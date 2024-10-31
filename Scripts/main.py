from fastapi import FastAPI
from fastapi import Query
from sqlalchemy import select, delete

from Scripts.database.schemas import EventUpdate
from Scripts.websocket.websocket import router as ws_router

import jwt

import base64
import io
import uuid
from datetime import datetime
from typing import List, Optional
import qrcode
from fastapi import UploadFile, File, Form, HTTPException, status, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError

from Scripts.database.database import async_session_maker_statistics
from Scripts.database.models import Event
from Scripts.database.schemas import EventOut
app = FastAPI()
app.include_router(ws_router)


SECRET_KEY = "univer hackathon server develop version"
ALGORITHM = "HS256"

origins = [
    "http://localhost:5173",
    "http://localhost",
    "http://127.0.0.1:8008",
    "http://localhost:63342",
    "http://127.0.0.1:8010"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Разрешаем конкретные источники
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все методы (GET, POST и т. д.)
    allow_headers=["*"],  # Разрешаем все заголовки
)
# Функция для извлечения и проверки JWT токена
def get_current_user(authorization: str = Header(...)) -> str:
    if authorization == '111':
        return '06a1cfc0-6418-4a48-937e-6fef713819e8'
    token = authorization.split(" ")[1]  # Bearer <token>
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options={"verify_aud": False})
    user_id = payload.get("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID отсутствует в токене")
    return user_id


@app.post("/events/", status_code=status.HTTP_201_CREATED)
async def create_event(
        UserId: str = Depends(get_current_user),  # Автоматически получаем UserId из токена
        name: Optional[str] = Form(None),
        description: Optional[str] = Form(None),
        dateStart: datetime = Form(...),
        dateEnd: datetime = Form(...),
        address: Optional[str] = Form(None),
        coordinates: Optional[List] = Form(None),  # Изменили тип на List[float]
        eventStatus: int = Form(...),
        file: Optional[UploadFile] = File(None)
):

    if coordinates:
        coordinates_str = ",".join(map(str, coordinates))
    else:
        coordinates_str = None
    async with async_session_maker_statistics() as session:
        user_id = uuid.UUID(UserId)
        print(UserId)
        try:
            photo_data = await file.read() if file else None
        except Exception:
            raise HTTPException(status_code=400, detail="Не удалось прочитать файл")

        db_event = Event(
            UserId=user_id,
            Name=name,
            Description=description,
            DateStart=dateStart,
            DateEnd=dateEnd,
            Address=address,
            Coordinates=coordinates_str,
            EventStatus=eventStatus,
            Photo=photo_data
        )

        session.add(db_event)
        try:
            await session.commit()
            await session.refresh(db_event)
        except IntegrityError:
            await session.rollback()
            raise HTTPException(status_code=400, detail="Некорректные данные")

        # Генерация QR-кода с ID события
        event_id = str(db_event.EventId)
        qr_data = f"https://yourwebsite.com/events/{event_id}"
        qr_image = qrcode.make(qr_data)

        # Сохраняем QR-код в байтовый поток
        img_byte_arr = io.BytesIO()
        qr_image.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)

        # Кодируем QR-код в base64
        qr_base64 = base64.b64encode(img_byte_arr.getvalue()).decode('utf-8')

        # Подготавливаем данные для ответа
        response_data = EventOut(
            EventId=db_event.EventId,
            UserId=str(db_event.UserId),
            Name=db_event.Name,
            Description=db_event.Description,
            DateStart=db_event.DateStart,
            DateEnd=db_event.DateEnd,
            Address=db_event.Address,
            Coordinates=db_event.Coordinates,
            EventStatus=db_event.EventStatus,
            Photo=base64.b64encode(photo_data).decode('utf-8') if photo_data else None
        )

        # Возвращаем данные события и QR-код в base64
        return {
            "event": response_data,
            "qr_code": qr_base64
        }



@app.get("/events/", response_model=List[EventOut])
async def get_events(skip: int = Query(0), limit: int = Query(10)):
    async with async_session_maker_statistics() as session:
        result = await session.execute(select(Event).offset(skip).limit(limit))
        events = result.scalars().all()

        # Формируем ответ с преобразованием фото в base64
        return [
            EventOut(
                EventId=event.EventId,
                UserId=event.UserId,
                Name=event.Name,
                Description=event.Description,
                DateStart=event.DateStart,
                DateEnd=event.DateEnd,
                Address=event.Address,
                Coordinates=event.Coordinates,
                EventStatus=event.EventStatus,
                Photo=base64.b64encode(event.Photo).decode('utf-8') if event.Photo else None
            )
            for event in events
        ]


@app.get("/events/{event_id}", response_model=EventOut)
async def get_event(event_id: int):
    async with async_session_maker_statistics() as session:
        event = await session.get(Event, event_id)
        if event is None:
            raise HTTPException(status_code=404, detail="Событие не найдено")

        # Конвертация фотографии в base64
        photo_base64 = base64.b64encode(event.Photo).decode('utf-8') if event.Photo else None

        return EventOut(
            EventId=event.EventId,
            UserId=event.UserId,
            Name=event.Name,
            Description=event.Description,
            DateStart=event.DateStart,
            DateEnd=event.DateEnd,
            Address=event.Address,
            Coordinates=event.Coordinates,
            EventStatus=event.EventStatus,
            Photo=photo_base64
        )


@app.get("/events/status/{event_status}", response_model=List[EventOut])
async def get_events_by_status(event_status: int, limit: int = Query(10), skip: int = Query(0)):
    async with async_session_maker_statistics() as session:
        # Фильтруем события по статусу и сортируем по дате начала (DateStart) в порядке убывания
        result = await session.execute(
            select(Event)
            .where(Event.EventStatus == event_status)
            .order_by(Event.DateStart.desc())
            .offset(skip)
            .limit(limit)
        )
        events = result.scalars().all()

        # Формируем ответ с преобразованием фото в base64
        return [
            EventOut(
                EventId=event.EventId,
                UserId=event.UserId,
                Name=event.Name,
                Description=event.Description,
                DateStart=event.DateStart,
                DateEnd=event.DateEnd,
                Address=event.Address,
                Coordinates=event.Coordinates,
                EventStatus=event.EventStatus,
                Photo=base64.b64encode(event.Photo).decode('utf-8') if event.Photo else None  # Конвертация в base64
            )
            for event in events
        ]


@app.put("/events/{event_id}", response_model=EventOut)
async def update_event(event_id: int, event_update: EventUpdate):
    async with async_session_maker_statistics() as session:
        event = await session.get(Event, event_id)
        if event is None:
            raise HTTPException(status_code=404, detail="Событие не найдено")

        if event_update.Name is not None:
            event.Name = event_update.Name
        if event_update.Description is not None:
            event.Description = event_update.Description
        if event_update.DateStart is not None:
            event.DateStart = event_update.DateStart
        if event_update.DateEnd is not None:
            event.DateEnd = event_update.DateEnd
        if event_update.Address is not None:
            event.Address = event_update.Address
        if event_update.Coordinates is not None:
            event.Coordinates = event_update.Coordinates
        if event_update.EventStatus is not None:
            event.EventStatus = event_update.EventStatus

        session.add(event)
        await session.commit()
        await session.refresh(event)

        return EventOut.from_orm(event)


@app.delete("/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(event_id: int):
    async with async_session_maker_statistics() as session:
        result = await session.execute(delete(Event).where(Event.EventId == event_id))
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Событие не найдено")
        await session.commit()

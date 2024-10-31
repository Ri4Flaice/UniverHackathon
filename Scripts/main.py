import base64
import uuid
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, UploadFile, File, HTTPException, status, Form
from fastapi import Query
from sqlalchemy import select, delete
from sqlalchemy.exc import IntegrityError

from Scripts.database.database import async_session_maker_statistics
from Scripts.database.models import Event
from Scripts.database.schemas import EventOut, EventUpdate
from Scripts.websocket.websocket import router as ws_router
app = FastAPI()
app.include_router(ws_router)


@app.post("/events/", response_model=EventOut, status_code=status.HTTP_201_CREATED)
async def create_event(
        UserId: str = Form(...),
        Name: Optional[str] = Form(None),
        Description: Optional[str] = Form(None),
        DateStart: datetime = Form(...),
        DateEnd: datetime = Form(...),
        Address: Optional[str] = Form(None),
        Coordinates: Optional[str] = Form(None),
        EventStatus: int = Form(...),
        file: Optional[UploadFile] = File(None)
):
    async with async_session_maker_statistics() as session:
        user_id = uuid.UUID(UserId)

        try:
            if file is not None:
                photo_data = await file.read()
            else:
                photo_data = None

        except Exception as e:
            raise HTTPException(status_code=400, detail="Не удалось прочитать файл")

        db_event = Event(
            UserId=user_id,
            Name=Name,
            Description=Description,
            DateStart=DateStart,
            DateEnd=DateEnd,
            Address=Address,
            Coordinates=Coordinates,
            EventStatus=EventStatus,
            Photo=photo_data
        )

        session.add(db_event)
        try:
            await session.commit()
            await session.refresh(db_event)
        except IntegrityError:
            await session.rollback()
            raise HTTPException(status_code=400, detail="Некорректные данные")

        # Подготавливаем данные для ответа
        response_data = EventOut(
            EventId=db_event.EventId,
            UserId=str(db_event.UserId),  # Преобразуем UUID в строку
            Name=db_event.Name,
            Description=db_event.Description,
            DateStart=db_event.DateStart,
            DateEnd=db_event.DateEnd,
            Address=db_event.Address,
            Coordinates=db_event.Coordinates,
            EventStatus=db_event.EventStatus,
            Photo=None

        )

        return response_data


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

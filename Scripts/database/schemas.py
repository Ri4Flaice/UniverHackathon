from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import Optional
from fastapi import UploadFile, File


class EventCreate(BaseModel):
    UserId: str
    Name: Optional[str]
    Description: Optional[str]
    DateStart: datetime
    DateEnd: datetime
    Address: Optional[str]
    Coordinates: Optional[str]
    EventStatus: int


class EventUpdate(BaseModel):
    Name: Optional[str]
    Description: Optional[str]
    DateStart: Optional[datetime]
    DateEnd: Optional[datetime]
    Address: Optional[str]
    Coordinates: Optional[str]
    EventStatus: Optional[int]
    Photo: Optional[bytes]


class EventOut(BaseModel):
    EventId: int
    UserId: UUID4
    Name: Optional[str]
    Description: Optional[str]
    DateStart: datetime
    DateEnd: datetime
    Address: Optional[str]
    Coordinates: Optional[str]
    EventStatus: int
    Photo: Optional[str]  # Новое поле для фото в формате base64

    class Config:
        orm_mode = True
        from_attributes = True  # Добавляем эту строку

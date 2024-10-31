from sqlalchemy import Column, BigInteger, String, Integer, TIMESTAMP, ForeignKey, LargeBinary, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from Scripts.database.database import Base

class AspNetUser(Base):
    __tablename__ = "AspNetUsers"

    Id = Column(UUID(as_uuid=True), primary_key=True)  # UUID первичный ключ
    FullName = Column(String(100))
    Login = Column(String(100))
    DateRegistration = Column(TIMESTAMP(timezone=True), nullable=False)
    Status = Column(Boolean, nullable=False)
    UserName = Column(String(256))
    NormalizedUserName = Column(String(256))
    Email = Column(String(256))
    NormalizedEmail = Column(String(256))
    EmailConfirmed = Column(Boolean, nullable=False)
    PasswordHash = Column(String)
    SecurityStamp = Column(String)
    ConcurrencyStamp = Column(String)
    PhoneNumber = Column(String)
    PhoneNumberConfirmed = Column(Boolean, nullable=False)
    TwoFactorEnabled = Column(Boolean, nullable=False)
    LockoutEnd = Column(TIMESTAMP(timezone=True))
    LockoutEnabled = Column(Boolean, nullable=False)
    AccessFailedCount = Column(Integer, nullable=False)

    # Связь с событиями
    events = relationship("Event", back_populates="user")


class Event(Base):
    __tablename__ = "events"

    EventId = Column(BigInteger, primary_key=True, autoincrement=True)
    UserId = Column(UUID(as_uuid=True), ForeignKey("AspNetUsers.Id", ondelete="CASCADE"), nullable=False)
    Name = Column(String(200))
    Description = Column(String(400))
    DateStart = Column(TIMESTAMP(timezone=True), nullable=False)
    DateEnd = Column(TIMESTAMP(timezone=True), nullable=False)
    Address = Column(String(150))
    Coordinates = Column(String(100))
    EventStatus = Column(Integer, nullable=False)
    Photo = Column(LargeBinary)

    # Связь с пользователем
    user = relationship("AspNetUser", back_populates="events")

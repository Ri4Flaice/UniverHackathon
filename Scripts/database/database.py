from typing import AsyncGenerator

from sqlalchemy import MetaData, NullPool
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from config import DB_PORT, DB_NAME, DB_PASS, DB_USER, DB_HOST

STATISTICS_DB_HOST = DB_HOST
STATISTICS_DB_USER = DB_USER
STATISTICS_DB_NAME = DB_NAME
STATISTICS_DB_PASS = DB_PASS
STATISTICS_DB_PORT = DB_PORT

Base = declarative_base()

metadata = MetaData()
STATISTICS_DATABASE_URL = f"postgresql+asyncpg://{STATISTICS_DB_USER}:{STATISTICS_DB_PASS}@{STATISTICS_DB_HOST}:{STATISTICS_DB_PORT}/{STATISTICS_DB_NAME}"

async_engine_statistics = create_async_engine(
    STATISTICS_DATABASE_URL,
    poolclass=NullPool,
    # echo=True,  # logging
)

async_session_maker_statistics = async_sessionmaker(async_engine_statistics, class_=AsyncSession,
                                                    expire_on_commit=False)


async def get_async_session_statistics() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker_statistics() as session:
        yield session

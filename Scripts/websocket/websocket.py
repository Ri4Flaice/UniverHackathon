from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi import APIRouter
import json
from fastapi import HTTPException

from Scripts.websocket.websocket_manager import manager

router = APIRouter(prefix='/ws')


@router.websocket("/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, user_id=client_id)  # Передаем user_id при подключении
    try:
        while True:
            data = await websocket.receive_text()
            print(client_id, 'айди клиента')
    except WebSocketDisconnect:
        manager.disconnect(client_id)


@router.post("/notify/{client_id}")
async def notify_user(client_id: str, message: str):
    try:
        await manager.send_personal_json({"message": message}, client_id)
        return {"message": "Уведомление отправлено"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

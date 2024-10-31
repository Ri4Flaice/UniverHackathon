from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str):
        websocket = self.active_connections.pop(user_id, None)
        if websocket:
            websocket.close()

    async def send_personal_json(self, data: dict, user_id: str):
        connection = self.active_connections.get(user_id)
        print(connection)
        if connection:
            await connection.send_json(data)

    async def broadcast_json(self, data: dict):
        for connection_id, connection in self.active_connections.items():
            await connection.send_json(data)


manager = ConnectionManager()

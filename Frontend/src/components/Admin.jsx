import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import '../style.css';


function Admin() {
    const [filter, setFilter] = useState('');
    const [events, setEvents] = useState([
        { id: 1, type: 'extreme', name: 'Storm Warning', color: 'red' },
        { id: 2, type: 'maintenance', name: 'Road Repair', color: 'orange' },
        { id: 3, type: 'maintenance', name: 'Street Festival', color: 'orange' },
        { id: 4, type: 'extreme', name: 'Flood Warning', color: 'red' },
        { id: 5, type: 'minor', name: 'Community Gathering', color: 'gray' },
        { id: 6, type: 'minor', name: 'Street Festival', color: 'gray' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна
    const [newEventName, setNewEventName] = useState('');

    const COLORS = {
        red: '#FF0000',
        orange: '#FFA500',
        gray: '#808080',
    };

    const handleCreateEvent = () => {
        if (newEventName) {
            const newEvent = {
                id: events.length + 1,
                type: 'minor',
                name: newEventName,
                color: 'gray',
            };
            setEvents([...events, newEvent]);
            setNewEventName('');
            setIsModalOpen(false);
        }
    };

    const handleEdit = (id) => {
        alert(`Редактировать событие с ID: ${id}`);
    };

    const handleDelete = (id) => {
        setEvents(events.filter((event) => event.id !== id));
    };

    const filteredEvents = filter
        ? events.filter((event) => event.type === filter)
        : events;

    const chartData = [
        { name: 'Экстренные события', value: events.filter((e) => e.color === 'red').length },
        { name: 'Благоустройство города', value: events.filter((e) => e.color === 'orange').length },
        { name: 'Обычные события', value: events.filter((e) => e.color === 'gray').length },
    ];

    return (
        <div className="container">
            <div className="select-container">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="select p-2"
                >
                    <option value="">Все события</option>
                    <option value="extreme">Экстремальные</option>
                    <option value="maintenance">Ремонтные работы</option>
                    <option value="minor">Обычные события</option>
                </select>
                <button
                    className="bg-green-500 text-white px-4 py-2"
                    onClick={() => setIsModalOpen(true)} // Открыть модальное окно
                >
                    Создать событие
                </button>
            </div>

            <div className="flex mt-5">
                <div className="flex-1"> {/* События слева */}
                    {filteredEvents.map((event) => (
                        <div key={event.id} className="event-card">
                            <div className="flex-1">{event.name}</div>
                            <button
                                className="bg-yellow-500 mr-2 p-2"
                                onClick={() => handleEdit(event.id)}
                            >
                                Редактировать
                            </button>
                            <button
                                className="bg-orange-500 mr-2 text-white p-2"
                                onClick={() => handleDelete(event.id)}
                            >
                                некорректное событие
                            </button>

                            <button
                                className="bg-red-500 text-white p-2"
                                onClick={() => handleDelete(event.id)}
                            >
                                Удалить
                            </button>
                        </div>
                    ))}
                </div>

                <div className="chart-container"> {/* График справа */}
                    <PieChart width={300} height={300}>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            innerRadius={40} // Задайте внутренний радиус для эффекта пончика
                            fill="#8884d8"
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={
                                        COLORS[
                                            entry.name === 'Экстренные события'
                                                ? 'red'
                                                : entry.name === 'Благоустройство города'
                                                    ? 'orange'
                                                    : 'gray'
                                            ]
                                    }
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
            </div>

            {/* Модальное окно */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Создать новое событие</h2>
                        <input
                            type="text"
                            value={newEventName}
                            onChange={(e) => setNewEventName(e.target.value)}
                            placeholder="Название события"
                            className="p-2 border"
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 mt-2"
                            onClick={handleCreateEvent}
                        >
                            Создать
                        </button>
                        <button
                            className="bg-gray-300 text-black px-4 py-2 mt-2 ml-2"
                            onClick={() => setIsModalOpen(false)} // Закрыть модальное окно
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Admin;

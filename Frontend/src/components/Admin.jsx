import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import '../style.css';
import { useAuth } from "../context/AuthContext";

function Admin() {
    const { token } = useAuth();

    const [filter, setFilter] = useState(''); // Статус для фильтрации
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false); // новое состояние для режима редактирования
    const [currentEventId, setCurrentEventId] = useState(null); // для хранения ID редактируемого события
    const [newEventData, setNewEventData] = useState({
        name: '',
        description: '',
        dateStart: '',
        dateEnd: '',
        address: '',
        coordinates: '',
        eventStatus: '0',
    });

    const COLORS = {
        red: '#FF0000',
        orange: '#FFA500',
        gray: '#808080',
    };

    useEffect(() => {
        const fetchEventsFromAPI = async () => {
            try {
                const response = await axios.get("http://localhost:8008/events/");
                setEvents(response.data);
            } catch (error) {
                console.error("Ошибка при получении данных событий:", error);
            }
        };
        fetchEventsFromAPI();
    }, []);

    const getEventStatusLabel = (status) => {
        switch (status) {
            case 1:
                return 'Экстренные события';
            case 2:
                return 'Благоустройство города';
            case 3:
                return 'Обычные события';
            default:
                return 'Неизвестный статус';
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("name", newEventData.name);
        formDataToSend.append("description", newEventData.description);
        formDataToSend.append("dateStart", new Date(newEventData.dateStart).toISOString());
        formDataToSend.append("dateEnd", new Date(newEventData.dateEnd).toISOString());
        formDataToSend.append("address", newEventData.address);
        formDataToSend.append("coordinates", JSON.stringify(newEventData.coordinates.split(',').map(Number)));
        formDataToSend.append("eventStatus", Number(newEventData.eventStatus));

        try {
            const response = await axios.post("http://localhost:8008/events/", formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Событие создано:", response.data);
            setEvents([...events, response.data]);
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error("Ошибка при создании события:", error.response?.data || error.message);
        }
    };

    const handleMarkInvalidEvent = async (eventId) => {

        try {
            await axios.delete(`http://localhost:8081/api/Event/deleteInvalid/${eventId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEvents(events.filter(event => event.EventId !== eventId));
            console.log("Событие удалено:", eventId);
        } catch (error) {
            console.error("Ошибка при удалении события:", error.response?.data || error.message);
        }
    };

    const handleEditEvent = (eventId) => {
        const eventToEdit = events.find(event => event.EventId === eventId);

        // Проверьте, является ли Coordinates массивом, если нет - преобразуйте в массив
        const coordinatesArray = Array.isArray(eventToEdit.Coordinates)
            ? eventToEdit.Coordinates
            : eventToEdit.Coordinates.split(',').map(Number); // преобразование из строки в массив, если необходимо

        setNewEventData({
            name: eventToEdit.Name,
            description: eventToEdit.Description,
            dateStart: new Date(eventToEdit.DateStart).toISOString().slice(0, 16),
            dateEnd: new Date(eventToEdit.DateEnd).toISOString().slice(0, 16),
            address: eventToEdit.Address,
            coordinates: coordinatesArray.join(', '), // преобразуем массив обратно в строку для поля ввода
            eventStatus: String(eventToEdit.EventStatus),
        });
        setCurrentEventId(eventId);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("name", newEventData.name);
        formDataToSend.append("description", newEventData.description);
        formDataToSend.append("dateStart", new Date(newEventData.dateStart).toISOString());
        formDataToSend.append("dateEnd", new Date(newEventData.dateEnd).toISOString());
        formDataToSend.append("address", newEventData.address);
        formDataToSend.append("coordinates", JSON.stringify(newEventData.coordinates.split(',').map(Number)));
        formDataToSend.append("eventStatus", Number(newEventData.eventStatus));

        try {
            const response = await axios.put(`http://localhost:8008/events/${currentEventId}/`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Событие обновлено:", response.data);
            setEvents(events.map(event => event.EventId === currentEventId ? response.data : event));
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error("Ошибка при обновлении события:", error.response?.data || error.message);
        }
    };

    const resetForm = () => {
        setNewEventData({
            name: '',
            description: '',
            dateStart: '',
            dateEnd: '',
            address: '',
            coordinates: '',
            eventStatus: '0',
        });
        setCurrentEventId(null);
        setIsEditMode(false);
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await axios.delete(`http://localhost:8008/events/${eventId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEvents(events.filter(event => event.EventId !== eventId));
            console.log("Событие удалено:", eventId);
        } catch (error) {
            console.error("Ошибка при удалении события:", error.response?.data || error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEventData({ ...newEventData, [name]: value });
    };

    // Обновленный код фильтрации событий
    const filteredEvents = filter
        ? events.filter(event => event.EventStatus === Number(filter))
        : events;

    const chartData = [
        { name: 'Экстренные события', value: events.filter(e => e.EventStatus === 1).length },
        { name: 'Благоустройство города', value: events.filter(e => e.EventStatus === 2).length },
        { name: 'Обычные события', value: events.filter(e => e.EventStatus === 3).length },
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
                    <option value="1">Экстренные события</option>
                    <option value="2">Благоустройство города</option>
                    <option value="3">Обычные события</option>
                </select>
                <button
                    className="bg-green-500 text-white px-4 py-2"
                    onClick={() => {
                        resetForm(); // Сбрасываем форму перед открытием модального окна
                        setIsModalOpen(true);
                    }}
                >
                    Создать событие
                </button>
            </div>

            <div className="flex mt-5">
                <div className="flex-1">
                    {filteredEvents.map((event) => (
                        <div key={event.EventId} className="event-card">
                            <h3>{event.Name}</h3>
                            <p><strong>Описание:</strong> {event.Description}</p>
                            <p><strong>Дата начала:</strong> {new Date(event.DateStart).toLocaleString()}</p>
                            <p><strong>Дата окончания:</strong> {new Date(event.DateEnd).toLocaleString()}</p>
                            <p><strong>Адрес:</strong> {event.Address}</p>
                            <p><strong>Статус события:</strong> {getEventStatusLabel(event.EventStatus)}</p>

                            <div className="event-buttons">
                                <button className="bg-yellow-500 text-white px-4 py-2 mr-2" onClick={() => handleEditEvent(event.EventId)}>Редактировать</button>
                                <button className="bg-orange-500 text-white px-4 py-2 mr-2" onClick={() => handleMarkInvalidEvent(event.EventId)}>Некорректный</button>
                                <button className="bg-red-500 text-white px-4 py-2" onClick={() => handleDeleteEvent(event.EventId)}>Удалить</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="chart-container">
                    <PieChart width={300} height={300}>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            innerRadius={40}
                            fill="#8884d8"
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[
                                        entry.name === 'Экстренные события'
                                            ? 'red'
                                            : entry.name === 'Благоустройство города'
                                                ? 'orange'
                                                : 'gray'
                                        ]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{isEditMode ? 'Редактировать событие' : 'Создать новое событие'}</h2>
                        <form onSubmit={isEditMode ? handleUpdateEvent : handleCreateEvent}>
                            <input
                                type="text"
                                name="name"
                                value={newEventData.name}
                                onChange={handleInputChange}
                                placeholder="Название события"
                                className="p-2 border"
                            />
                            <input
                                type="text"
                                name="description"
                                value={newEventData.description}
                                onChange={handleInputChange}
                                placeholder="Описание"
                                className="p-2 border"
                            />
                            <input
                                type="datetime-local"
                                name="dateStart"
                                value={newEventData.dateStart}
                                onChange={handleInputChange}
                                className="p-2 border"
                            />
                            <input
                                type="datetime-local"
                                name="dateEnd"
                                value={newEventData.dateEnd}
                                onChange={handleInputChange}
                                className="p-2 border"
                            />
                            <input
                                type="text"
                                name="address"
                                value={newEventData.address}
                                onChange={handleInputChange}
                                placeholder="Адрес"
                                className="p-2 border"
                            />
                            <input
                                type="text"
                                name="coordinates"
                                value={newEventData.coordinates}
                                onChange={handleInputChange}
                                placeholder="Координаты (через запятую)"
                                className="p-2 border"
                            />
                            <select
                                name="eventStatus"
                                value={newEventData.eventStatus}
                                onChange={handleInputChange}
                                className="p-2 border mt-2"
                            >
                                <option value="0">Выберите статус события</option>
                                <option value="1">Экстренные события</option>
                                <option value="2">Благоустройство города</option>
                                <option value="3">Обычные события</option>
                            </select>

                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2">
                                {isEditMode ? 'Обновить' : 'Создать'}
                            </button>
                            <button
                                type="button"
                                className="bg-gray-300 text-black px-4 py-2 mt-2 ml-2"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    resetForm(); // сбрасываем форму при закрытии
                                }}
                            >
                                Отмена
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Admin;

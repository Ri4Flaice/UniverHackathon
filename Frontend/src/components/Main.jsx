import React, { useEffect, useState } from "react";
import axios from "axios";
import  '../style.css'

const Main = () => {
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState(null);

  const events = [
    {
      title: "Фестиваль Культуры",
      description: "Погрузитесь в традиции и обычаи нашего города",
    },
    {
      title: "Спортивный марафон",
      description: "Примите участие в забеге и испытайте свои силы",
    },
    {
      title: "Ночь музеев",
      description: "Посетите музеи города в необычное время",
    },
    {
      title: "Выставка Искусств",
      description: "Познакомьтесь с произведениями местных художников",
    },
  ];

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/User/getUserRatingList");
        setLeaders(response.data);
      } catch (error) {
        console.error("Failed to fetch leaders:", error);
        setError("Не удалось загрузить данные рейтинга.");
      }
    };

    fetchLeaders();
  }, []);

  return (
      <div
          className="bg-cover bg-center min-h-screen p-6 relative"
          style={{
            backgroundImage: "url('https://i.imgur.com/BEPRJGP.jpeg')",
          }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <h1 className="text-4xl font-bold mb-8 text-white relative z-10">
          События города
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {events.map((event, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-700">{event.description}</p>
              </div>
          ))}
        </div>

        {/* Таблица лидеров */}
        <div className="bg-white rounded-lg shadow-md p-4 mt-8 relative z-10">
          <h2 className="text-2xl font-semibold mb-4 text-center">Таблица лидеров</h2>
          {error && <p className="text-red-500 text-center">{error}</p>} {/* Отображение ошибки */}
          <table className="min-w-full">
            <thead>
            <tr>
              <th className="py-2 text-start border-b">ФИО</th>
              <th className="py-2 text-start border-b">Рейтинг</th>
            </tr>
            </thead>
            <tbody>
            {leaders.map((leader, index) => (
                <tr key={index}>
                  <td className="py-2 border-b">{leader.
                      fullName}</td>
                  <td className="py-2 border-b">{leader.rating}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default Main;

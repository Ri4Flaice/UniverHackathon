import React from "react";

const Main = () => {
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

  return (
    <div
      className="bg-cover bg-center min-h-screen p-6 relative"
      style={{
        backgroundImage:
          "url('https://pkzsk.info/wp-content/uploads/2023/08/img_2004.jpg')",
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
    </div>
  );
};

export default Main;

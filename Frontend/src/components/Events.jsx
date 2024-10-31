// src/pages/Events.jsx
import React from "react";
import Map from "./Map";

function Events() {
  return (
    <div className="bg-white p-6 rounded shadow-md">
      <Map />
      <h2 className="text-2xl font-semibold mb-4">Городская афиша</h2>
      {/* Можно добавить список событий и анимацию для плавного появления */}
      <p>Скоро в городе пройдут следующие события...</p>
    </div>
  );
}

export default Events;

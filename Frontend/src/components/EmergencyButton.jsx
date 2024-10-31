// src/pages/EmergencyButton.jsx
import React from "react";

function EmergencyButton() {
  return (
    <div className="bg-white p-6 rounded shadow-md text-center">
      <h2 className="text-2xl font-semibold mb-4">Экстренная помощь</h2>
      <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
        Вызвать помощь
      </button>
    </div>
  );
}

export default EmergencyButton;

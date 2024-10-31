import React from "react";

function EmergencyButton() {
  return (
    <div className="bg-white p-6 rounded shadow-md text-center m-4">
      <h2 className="text-2xl font-semibold mb-4">Экстренная помощь</h2>
      <a href="tel:112" className="bg-red-500 text-white px-4 py-2 rounded-lg">
        Вызвать помощь
      </a>
    </div>
  );
}

export default EmergencyButton;

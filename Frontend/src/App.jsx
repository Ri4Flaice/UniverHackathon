// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Events from "./components/Events";
import Notifications from "./components/Notifications";
import Services from "./components/Services";
import Feedback from "./components/Feedback";
import EmergencyButton from "./components/EmergencyButton";
import Main from "./components/Main";
import Map from "./components/Map";
import { useState } from "react";
import Auth from "./components/Auth";

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <header className="bg-red-900 text-white p-4 flex justify-between">
          <Link className="text-xl font-bold" to="/">
            ПЕТРОПАВЛОВСК
          </Link>
          <nav className="flex items-center gap-4">
            <Link className="mx-2 hover:scale-110 duration-300" to="/events">
              События
            </Link>
            <Link className="mx-2 hover:scale-110 duration-300" to="/map">
              Карта
            </Link>
            <Link
              className="mx-2 hover:scale-110 duration-300"
              to="/notifications"
            >
              Уведомления
            </Link>
            <Link className="mx-2 hover:scale-110 duration-300" to="/services">
              Услуги
            </Link>
            <Link className="mx-2 hover:scale-110 duration-300" to="/feedback">
              Обратная связь
            </Link>
            <Link className="mx-2 hover:scale-110 duration-300" to="/emergency">
              Экстренная кнопка
            </Link>
          </nav>
          <Auth />
        </header>

        <main className="p-4">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/events" element={<Events />} />
            <Route path="/map" element={<Map />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/services" element={<Services />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/emergency" element={<EmergencyButton />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

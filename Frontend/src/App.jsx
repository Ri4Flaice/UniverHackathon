import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Events from "./components/Events";
import Notifications from "./components/Notifications";
import Services from "./components/Services";
import Feedback from "./components/Feedback";
import EmergencyButton from "./components/EmergencyButton";
import Main from "./components/Main";
import Map from "./components/Map";
import Auth from "./components/Auth";
import Admin from "./components/Admin";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
      <AuthProvider>
        <Router>
          <div className="bg-gray-100 min-h-screen">
            <header className="bg-gray-900 text-white p-4 flex justify-between">
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
                <Link className="mx-2 hover:scale-110 duration-300" to="/notifications">
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

            <main className="">
              <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/events" element={<Events />} />
                <Route path="/map" element={<Map />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/services" element={<Services />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/emergency" element={<EmergencyButton />} />
                <Route path="/admin" element={<Admin />} /> {/* Добавьте маршрут для новой страницы */}
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
  );
}

export default App;

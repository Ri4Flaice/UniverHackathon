// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Events from "./components/Events";
import Notifications from "./components/Notifications";
import Services from "./components/Services";
import Feedback from "./components/Feedback";
import EmergencyButton from "./components/EmergencyButton";
import Main from "./components/Main";

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <header className="bg-blue-500 text-white p-4 flex justify-between">
          <Link className="text-xl font-bold" to="/">
            ПЕТРОПАВЛОВСК
          </Link>
          <nav>
            <Link className="mx-2" to="/events">
              Events
            </Link>
            <Link className="mx-2" to="/notifications">
              Notifications
            </Link>
            <Link className="mx-2" to="/services">
              Services
            </Link>
            <Link className="mx-2" to="/feedback">
              Feedback
            </Link>
            <Link className="mx-2" to="/emergency">
              Emergency
            </Link>
          </nav>
        </header>

        <main className="p-4">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/events" element={<Events />} />
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

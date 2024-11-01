import React, { useState, useEffect, useRef } from "react";
import { load } from "@2gis/mapgl";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Map = () => {
  const { token } = useAuth();
  const [query, setQuery] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dateStart: "",
    dateEnd: "",
    address: "",
    coordinates: null,
    eventStatus: "",
    file: null,
  });
  const [events, setEvents] = useState([]);
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const mapglAPI = useRef(null);
  const tooltipEl = useRef(null); // Создайте ссылку для подсказки

  const url = `https://catalog.api.2gis.com/3.0/items/geocode?q=${query}&fields=items.point&key=${
    import.meta.env.VITE_MAP_KEY
  }`;

  useEffect(() => {
    const initializeMap = async () => {
      const mapglAPI = await load();
      const map = new mapglAPI.Map(mapContainer.current, {
        center: [69.135137, 54.875406],
        zoom: 13,
        key: import.meta.env.VITE_MAP_KEY,
      });
      mapInstance.current = map;

      // Создайте элемент подсказки
      tooltipEl.current = document.createElement("div");
      tooltipEl.current.id = "tooltip";
      tooltipEl.current.style.position = "absolute";
      tooltipEl.current.style.pointerEvents = "none";
      tooltipEl.current.style.display = "none";
      tooltipEl.current.style.padding = "10px";
      tooltipEl.current.style.backgroundColor = "#fff";
      tooltipEl.current.style.border = "1px solid #ccc";
      tooltipEl.current.style.borderRadius = "4px";
      tooltipEl.current.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
      document.body.appendChild(tooltipEl.current);

      // Add click event listener to the map
      map.on("click", (event) => {
        const coordinates = event.lngLat.map(String);
        console.log("Clicked coordinates (as strings):", coordinates);
        setFormData((prev) => ({ ...prev, coordinates }));
        setFormVisible(true);
      });

      // Fetch and display events after map initialization
      fetchEvents();
    };

    initializeMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
      // Удалите элемент подсказки при размонтировании
      if (tooltipEl.current) {
        document.body.removeChild(tooltipEl.current);
      }
    };
  }, []);

  const fetchEvents = async () => {
    try {
      console.log("Fetching events...");
      const response = await axios.get("http://localhost:8008/events/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Events fetched:", response.data);
      setEvents(response.data);
      displayEventsOnMap(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const displayEventsOnMap = (events) => {
    events.forEach((event) => {
      const { Coordinates, EventStatus, Name, description } = event;

      // Парсинг координат из строки в массив
      let coordinates;
      try {
        coordinates = JSON.parse(Coordinates);
      } catch (error) {
        console.warn(
          `Skipping event ${Name} due to invalid coordinates format`,
          Coordinates
        );
        return; // Пропускаем это событие, если парсинг не удался
      }

      // Проверка, содержат ли координаты два значения
      if (Array.isArray(coordinates) && coordinates.length === 2) {
        const [lon, lat] = coordinates;

        const color =
          EventStatus === 1 ? "red" : EventStatus === 2 ? "yellow" : "gray";

        // Создаем элемент маркера
        const markerElement = document.createElement("div");
        markerElement.style.width = "20px";
        markerElement.style.height = "20px";
        markerElement.style.backgroundColor = color;
        markerElement.style.borderRadius = "50%";
        markerElement.style.border = "2px solid white"; // Добавление белой рамки для видимости

        // Создаем маркер
        const marker = new mapgl.Marker(mapInstance.current, {
          element: markerElement,
          coordinates: [lon, lat], // Здесь используются [lon, lat]
        });

        // Добавляем обработчики событий для маркера
        markerElement.onmouseover = (event) => {
          const offset = 5;
          tooltipEl.current.style.top = `${event.clientY + offset}px`;
          tooltipEl.current.style.left = `${event.clientX + offset}px`;
          tooltipEl.current.innerHTML = `<strong>${Name}</strong><br>${description}`;
          tooltipEl.current.style.display = "block";
        };

        markerElement.onmouseout = () => {
          tooltipEl.current.style.display = "none";
        };

        console.log(
          `Displayed event ${Name} at [${lon}, ${lat}] with color ${color}`
        );
      } else {
        console.warn(
          `Skipping event ${Name} due to invalid coordinates`,
          coordinates
        );
      }
    });
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data?.result?.items?.length > 0) {
        const { lon, lat } = data.result.items[0].point;
        mapInstance.current.setCenter([lon, lat]);
      }
    } catch (error) {
      console.error("Error fetching geocode data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "eventStatus" ? Number(value) : files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append(
      "dateStart",
      new Date(formData.dateStart).toISOString()
    );
    formDataToSend.append("dateEnd", new Date(formData.dateEnd).toISOString());
    formDataToSend.append("address", formData.address);
    formDataToSend.append(
      "coordinates",
      JSON.stringify(formData.coordinates.map(Number))
    );
    formDataToSend.append("eventStatus", Number(formData.eventStatus));
    if (formData.file) {
      formDataToSend.append("file", formData.file);
    }

    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await axios.post(
        "http://localhost:8008/events/",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response:", response.data);
      setFormVisible(false);
      fetchEvents(); // Refresh events after submission
    } catch (error) {
      console.error(
        "Error posting data:",
        error.response?.data || error.message
      );
      if (error.response && error.response.data && error.response.data.detail) {
        console.error("Detailed errors:", error.response.data.detail);
      }
    }
  };
  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="flex items-start m-4">
      <div className="flex-1 rounded-lg overflow-hidden p-2">
        <input
          type="text"
          placeholder="Введите адрес..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 w-full outline-none rounded-lg"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white py-2 px-10 rounded-lg my-4"
        >
          Найти
        </button>
        <div
          ref={mapContainer}
          style={{ width: "100%", height: "500px" }}
          className="rounded-lg overflow-hidden"
        />
      </div>
      <div>
        {formVisible && (
          <div className="bg-white max-w-[400px] rounded-lg p-4 shadow-md mt-2">
            <h2 className="text-lg font-bold mb-2">Информация о событии</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Название"
                value={formData.name}
                onChange={handleInputChange}
                className="border p-2 w-full rounded-lg mb-2"
              />
              <textarea
                name="description"
                placeholder="Описание"
                value={formData.description}
                onChange={handleInputChange}
                className="border p-2 w-full rounded-lg mb-2"
                rows={3}
              />
              <input
                type="datetime-local"
                name="dateStart"
                value={formData.dateStart}
                onChange={handleInputChange}
                required
                className="border p-2 w-full rounded-lg mb-2"
              />
              <input
                type="datetime-local"
                name="dateEnd"
                value={formData.dateEnd}
                onChange={handleInputChange}
                required
                className="border p-2 w-full rounded-lg mb-2"
              />
              <input
                type="text"
                name="address"
                placeholder="Адрес"
                value={formData.address}
                onChange={handleInputChange}
                className="border p-2 w-full rounded-lg mb-2"
              />
              <input
                type="text"
                name="coordinates"
                placeholder="Координаты"
                value={
                  formData.coordinates
                    ? JSON.stringify(formData.coordinates)
                    : ""
                }
                readOnly
                className="border p-2 w-full rounded-lg mb-2"
              />
              <input
                type="number"
                name="eventStatus"
                placeholder="Статус события"
                value={formData.eventStatus}
                onChange={handleInputChange}
                required
                className="border p-2 w-full rounded-lg mb-2"
              />
              <input
                type="file"
                name="file"
                onChange={handleInputChange}
                className="border p-2 w-full rounded-lg mb-2"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                Отправить
              </button>
            </form>
            <button
              onClick={() => setFormVisible(false)}
              className="mt-2 text-red-500"
            >
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;

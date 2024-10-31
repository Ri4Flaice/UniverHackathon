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
    eventStatus: "", // Keep it as a string initially
    file: null,
  });
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

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

      // Add click event listener to the map
      map.on("click", (event) => {
        const coordinates = event.lngLat.map(String); // Convert to array of strings
        console.log("Clicked coordinates (as strings):", coordinates);
        setFormData((prev) => ({ ...prev, coordinates }));
        setFormVisible(true);
      });
    };

    initializeMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
    };
  }, []);

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
      [name]: name === "eventStatus" ? Number(value) : files ? files[0] : value, // Convert eventStatus to a number
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
    ); // Convert to ISO 8601 format
    formDataToSend.append("dateEnd", new Date(formData.dateEnd).toISOString()); // Convert to ISO 8601 format
    formDataToSend.append("address", formData.address);
    formDataToSend.append(
      "coordinates",
      formData.coordinates
        ? JSON.stringify(formData.coordinates.map(String))
        : null
    ); // Convert coordinates to an array of strings
    formDataToSend.append("eventStatus", formData.eventStatus); // Send as a number
    formDataToSend.append("file", formData.file);

    try {
      const response = await axios.post(
        "http://localhost:8008/events",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response:", response.data);
      setFormVisible(false);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

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
                } // Show the string coordinates
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

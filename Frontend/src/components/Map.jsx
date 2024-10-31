import React, { useState, useEffect, useRef } from "react";
import { load } from "@2gis/mapgl";

const Map = () => {
  const [query, setQuery] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ info: "", location: null });
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  const url = `https://catalog.api.2gis.com/3.0/items/geocode?q=${query}&fields=items.point&key=${
    import.meta.env.VITE_MAP_KEY
  }`;

  useEffect(() => {
    let map;
    const initializeMap = async () => {
      const mapglAPI = await load();
      map = new mapglAPI.Map(mapContainer.current, {
        center: [69.135137, 54.875406],
        zoom: 13,
        key: import.meta.env.VITE_MAP_KEY,
      });
      mapInstance.current = map;

      // Add click event listener to the map
      map.on("click", (event) => {
        const coordinates = event.lngLat; // Get the coordinates of the click
        console.log("Clicked coordinates:", coordinates);
        setFormData({ ...formData, location: coordinates });
        setFormVisible(true); // Show the form when a location is clicked
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    // Handle form submission logic here (e.g., API call)
    setFormVisible(false); // Hide the form after submission
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
          <div className="bg-white flex-2 min-w-[400px] rounded-lg p-4 shadow-md mt-2">
            <h2 className="text-lg font-bold mb-2">Информация о здании</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                name="info"
                placeholder="Сообщите о проблеме..."
                value={formData.info}
                onChange={handleInputChange}
                className="border p-2 w-full rounded-lg mb-2"
                rows={4}
                required
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

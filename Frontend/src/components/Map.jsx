import React, { useState, useEffect, useRef } from "react";
import { load } from "@2gis/mapgl";

const Map = () => {
  const [query, setQuery] = useState("");
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  const url = `https://catalog.api.2gis.com/3.0/items/geocode?q=${query}&fields=items.point&key=${
    import.meta.env.VITE_MAP_KEY
  }`;

  useEffect(() => {
    console.log("map use effect run");
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
        // You can do something with these coordinates, like displaying them
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
        console.log(lon, lat);
        mapInstance.current.setCenter([lon, lat]);
      }
    } catch (error) {
      console.error("Error fetching geocode data:", error);
    }
  };

  return (
    <div className="w-full rounded-lg overflow-hidden p-2">
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
  );
};

export default Map;

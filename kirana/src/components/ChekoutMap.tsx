"use client";

import React, { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Crosshair, LocateFixed } from "lucide-react";

/* ---------------- ICON FIX ---------------- */
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

type Props = {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
};

const ChekoutMap = ({ position, setPosition }: Props) => {
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
    });
  };

  /* ---------------- MAP MARKER + CONTROLS ---------------- */
  const DraggableMarker = () => {
    const map = useMap();

    useEffect(() => {
      if (!position) return;
      map.setView(position as LatLngExpression, 15, { animate: true });
    }, [position, map]);

    return (
      <>
        <Marker
          icon={markerIcon}
          position={position as LatLngExpression}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target as L.Marker;
              const { lat, lng } = marker.getLatLng();
              setPosition([lat, lng]);
            },
          }}
        >
          <Popup>Your delivery location 📍</Popup>
        </Marker>

        {/* Floating Controls */}
        <div className="absolute bottom-3 left-3 flex flex-col gap-2 z-[1000]">
          {/* Recenter */}
          <button
            onClick={() =>
              map.setView(position as LatLngExpression, map.getZoom(), {
                animate: true,
              })
            }
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-green-50 transition"
            title="Recenter"
          >
            <Crosshair className="w-5 h-5 text-green-700" />
          </button>

          {/* Current Location */}
          <button
            onClick={handleCurrentLocation}
            className="w-10 h-10 rounded-full bg-green-600 shadow-md flex items-center justify-center hover:bg-green-700 transition"
            title="Use my location"
          >
            <LocateFixed className="w-5 h-5 text-white" />
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="relative h-52 rounded-2xl overflow-hidden border bg-gradient-to-br from-gray-100 to-gray-200">
      <MapContainer
        center={position as LatLngExpression}
        zoom={13}
        scrollWheelZoom
        className="w-full h-full rounded-2xl"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker />
      </MapContainer>
    </div>
  );
};

export default ChekoutMap;

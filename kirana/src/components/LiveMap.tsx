import React, { useEffect } from "react";
interface ILocation {
  latitude: number;
  longitude: number;
}
interface IProps {
  userLocation: ILocation;
  deliveryBoyLocation: ILocation;
}
import L, { LatLngExpression } from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function Recenter({ positions }: { positions: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (positions[0] !== 0 && positions[1] !== 0) {
      map.setView(positions, map.getZoom(), { animate: true });
    }
  }, [positions, map]);
  return null;
}

const LiveMap = ({ userLocation, deliveryBoyLocation }: IProps) => {
  const deliveryBoyIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/3842/3842177.png",
    iconSize: [45, 45],
  });
  const userIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/4821/4821951.png",
    iconSize: [45, 45],
  });
  const center = [userLocation.latitude, userLocation.longitude];

  const linePostion =
    deliveryBoyLocation && userLocation
      ? [
          [userLocation.latitude, userLocation.longitude],
          [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude],
        ]
      : [];
  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        center={center as LatLngExpression}
        zoom={13}
        scrollWheelZoom
        className="w-full h-full rounded-2xl"
      >
        <Recenter positions={center as any} />
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[userLocation.latitude, userLocation.longitude]}
          icon={userIcon}
        >
          {" "}
          <Popup>Delivery Address</Popup>{" "}
        </Marker>
        {deliveryBoyLocation && (
          <Marker
            position={[
              deliveryBoyLocation.latitude,
              deliveryBoyLocation.longitude,
            ]}
            icon={deliveryBoyIcon}
          >
            <Popup>Delivery Boy</Popup>
          </Marker>
        )}

        <Polyline positions={linePostion as any} color="green" />
      </MapContainer>
    </div>
  );
};

export default LiveMap;

"use client";
import { getSocekt } from "@/llib/socket";
import React, { useEffect } from "react";

interface Props {
  userId: string;
}

function GeoUpdater({ userId }: Props) {
  const socket = getSocekt();
  socket.emit("identity",userId);

  useEffect(() => {
    if (!userId) return;
    if (!navigator.geolocation) return;
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        socket.emit("update-location", {
          userId,
          latitude: lat,
          longitude: lon,
        });
      },
      (err) => {
        console.log(err);
      },
      { enableHighAccuracy: true },
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, [userId]);

  return null;
}

export default GeoUpdater;

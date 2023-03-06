import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import React, { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
//import imgLocation from "src/images/marker.png";


export default function Map() {

  const [direccion, setDireccion] = useState(""); // [37.358342303352885, -5.986570537333228]
  const [coordenadas, setCoordenadas] = useState(null);

  const handleDireccionChange = (event) => {
    setDireccion(event.target.value);
  };

  const handleBuscarClick = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${direccion}&format=json`
      );
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setCoordenadas([lat, lon]);
      } else {
        alert("Dirección no encontrada");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const customIcon = new L.Icon({ 
    iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-green.png', //CAMBIAR POR NUESTRO MARKER (import no vale )
    iconSize: [25, 35],
    iconAnchor: [22, 94]
  });

  return (
    <div>
      <MapContainer
        center={[37.358342303352885, -5.986570537333228]}
        zoom={50}
        style={{ width: "40vw", height: "100vh", margin: "1vw" }}
      >
        <TileLayer
          url={
            "https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=4Qg1CBLvuefoRWUOrqlJ"
          }
        />
        <Marker icon={customIcon} position={[37.358342303352885, -5.986570537333228]}>
          <Popup>Este es el recurso buscado.</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

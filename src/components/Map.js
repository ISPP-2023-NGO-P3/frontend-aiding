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
   
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${direccion}&format=json`
      );
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setCoordenadas([lat, lon]);
      } else {
        alert("Dirección no encontrada");
      }
    
  };

  const customIcon = new L.Icon({
    iconUrl: require("../images/marker.png"),
    iconRetinaUrl: require("../images/marker.png"),
    //iconAnchor: null,
    //popupAnchor: null,
    //shadowUrl: null,
    //shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(20, 30),
    //className: 'leaflet-div-icon'
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

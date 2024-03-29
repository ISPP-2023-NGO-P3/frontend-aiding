import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
} from "mdb-react-ui-kit";
import resourcesApi from "./services/backend.js";
import L from "leaflet";

import { Button } from "react-bootstrap";

// CSS
import "leaflet/dist/leaflet.css";
import "../../../css/mapResources.css";

export default function DetailsUser() {
  let navigate = useNavigate();

  const [resource, setResource] = useState({
    title: "",
    description: "",
    contact_phone: "",
    street: "",
    number: "",
    city: "",
    additional_comments: "",
    latitude: "",
    longitude: "",
    resource_type: "",
    position: "",
  });

 /*  const {
    title,
    description,
    contact_phone,
    street,
    number,
    city,
    additional_comments,
    latitude,
    longitude,
    resource_type,
  } = resource; */

  const { id } = useParams();

  useEffect(() => {
    loadResouce();
  }, []);

  const loadResouce = async () => {
    const result = await resourcesApi.get(`/${id}`);
    setResource(result.data);
  };

  const customIcon = new L.Icon({
    iconUrl: require("../../../images/marker.png"),
    iconRetinaUrl: require("../../../images/marker.png"),
    //iconAnchor: null,
    //popupAnchor: null,
    //shadowUrl: null,
    //shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(20, 30),
    //className: 'leaflet-div-icon'
  });

  // FORMATEADOR DE LOS ENUMERADOS
  function resourceFormatter(value) {
    var formattedValue = value;
    switch (value) {
      case "neighborhood_association":
        formattedValue = "Asociación de vecinos";
        return `${formattedValue}`;
      case "seniors_association":
        formattedValue = "Asociación de mayores";
        return `${formattedValue}`;
      case "nursing_home":
        formattedValue = "Residencia";
        return `${formattedValue}`;
      
    }
  }

  const resource_type = resourceFormatter(resource.resource_type);


  return (
    <section>
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol lg="6">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="12">
                    <MDBRow>
                      <MapContainer
                        center={[37.358342303352885, -5.986570537333228]}
                        zoom={13}
                        id="map"
                        style={{
                          height: "70vh",
                          margin: "1vw",
                        }}
                      >
                        <TileLayer
                          url={
                            "https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=4Qg1CBLvuefoRWUOrqlJ"
                          }
                        />
                        <Marker
                          icon={customIcon}
                          position={[resource.latitude, resource.longitude]}
                        >
                          <Popup>{resource.title}</Popup>
                        </Marker>
                      </MapContainer>
                    </MDBRow>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol lg="6">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Título</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{resource.title}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />

                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Descripción</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {resource.description}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />

                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Teléfono de contacto</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {resource.contact_phone}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />

                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Calle</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{resource.street}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />

                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Número</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{resource.number}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />

                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Ciudad</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{resource.city}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />

                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Tipo de recurso</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {resource_type}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />

                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Comentarios adicionales</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {resource.additional_comments}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />

                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Posición en el mapa</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{resource.position}</MDBCardText>
                  </MDBCol>
                </MDBRow>

              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        <Button
          onClick={() => {
            navigate(`/information/map-resources`);
          }}
          type="button"
          className="btn btn-light w-100"
          id="retorno"
        >
          {" "}
          Volver al listado
        </Button>

        <hr />
      </MDBContainer>
    </section>
  );
}

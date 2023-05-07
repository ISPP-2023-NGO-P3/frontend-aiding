import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";

import resourcesApi from "../pages/information/map/services/backend.js";
import L from "leaflet";

// CSS
import "leaflet/dist/leaflet.css";
import "../css/mapResources.css";

import Accordion from "react-bootstrap/Accordion";
import { Button } from "react-bootstrap";

export default function ResourcesListEdit() {
  let navigate = useNavigate();

  const [resources_data, setResourceData] = React.useState([]);

  useEffect(() => {
    resourcesApi.get().then((response) => {
      setResourceData(response.data);
    });
  }, []);

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

  const markers = [
    { position: [37.3910271, -5.994537], title: "Centro de costura" },
    { position: [36.7195609, -4.4214742], title: "Merienda con nosotros" },
    { position: [36.7128403, -6.1034092], title: "¿Juegas a la petanca?" },
    {
      position: [40.402842872713414, -3.6873832954404344],
      title: "Artesanía para mayores",
    },
  ];

  resources_data.map((item) => ({ position: [item.latitude, item.longitude] }));

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

                        {resources_data.map((item) => (
                          <Marker
                            key={item.id}
                            icon={customIcon}
                            position={[item.latitude, item.longitude]}
                          >
                            <Popup>{item.title}</Popup>
                          </Marker>
                        ))}
                      </MapContainer>
                    </MDBRow>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          {resources_data.length > 0 ? (
          <MDBCol lg="6">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <h3> LISTADO DE RECURSOS </h3>

                  <div>
                    {resources_data.map((item) => (
                      <Accordion defaultActiveKey="">
                        <Accordion.Item eventKey={item.id}>
                          <Accordion.Header>{item.title}</Accordion.Header>
                          <Accordion.Body>
                            <div class="izquierda">
                              <h5>Descripción: </h5> <p> {item.description}</p>
                              <h5>Teléfono de contacto: </h5> <p> {item.contact_phone}</p>
                              <h5>Dirección : </h5>{" "}
                              <p>
                                {" "}
                                {"C/" +
                                  item.street +
                                  ", " +
                                  item.number +
                                  " " +
                                  item.city}
                              </p>
                              <h5>Comentarios adicionales: </h5>{" "}
                              <p> {item.additional_comments}</p>
                              <Button
                                onClick={() => {
                                  navigate(
                                    `/information/map-resources/${item.id}`
                                  );
                                }}
                                type="button"
                                className="btn btn-light w-20"
                                id="boton"
                              >
                                Ver más información
                              </Button>
                            </div>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    ))}
                  </div>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          ): (
          <MDBCol lg="6">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <h3>No hay recursos disponibles</h3>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          )}
        </MDBRow>
      </MDBContainer>
    </section>
  );
}

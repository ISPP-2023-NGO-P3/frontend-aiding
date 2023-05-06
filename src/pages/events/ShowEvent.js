import React from "react";
import { events } from "./services/backend";
import { useEffect } from 'react';
import moment from 'moment';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
} from "mdb-react-ui-kit";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import swal from "sweetalert";
import { useAuthContext } from "../../components/routes/authContext";
import { FaCheck, FaTimes } from 'react-icons/fa';

const successMsg = {
  title: "Mensaje de confirmación",
  text: "El evento se ha borrado correctamente",
  icon: "success",
  button: "Aceptar",
  timer: "5000",
};

const errorMsg = {
  title: "Mensaje de error",
  text: "Se ha producido un error al borrar el evento",
  icon: "error",
  button: "Aceptar",
  timer: "5000",
};

function ShowEvent() {

  const { isAuthenticated } = useAuthContext();
    /*DATOS*/
  const [event_data, setEventData] = React.useState(
    {
    title: '...',
    description: '...',
    start_date: '...',
    end_date: '...',
    places: '...',
    street: '...',
    number: '...',
    city: '...',
    latitude: '...',
    longitude: '...',
    available_places: '...',
    }
  );

  const [map_loaded,setMapLoaded] = React.useState (false);

  const { id } = useParams();

  let navigate=useNavigate();


  /*CARGA DE DATOS*/
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const result = await events.get(`/${id}`);
    setEventData(result.data);
    setMapLoaded(true);
  };

  /*FORMATEO DE FECHAS*/
  function formatDate(date) {
    return moment(date).format('DD/MM/YYYY HH:mm');
  };

  const deleteConfirmationAlert = async () => {
    swal({
      title: "Eliminar evento",
      text: "¿Estás seguro que desea eliminar el evento?",
      icon: "warning",
      buttons: ["No", "Sí"],
    }).then((res) => {
      if (res) {
        deleteEvent();
      }
    });
  };

  const deleteEvent = async () => {
    const result = await events
      .delete(`/${id}`)
      .then((res) => {
        swal(successMsg);
        navigate("/admin/events");
      })
      .catch((err) => {
        swal(errorMsg);
      });
  };
  const customIcon = new L.Icon({
    iconUrl: require("../../images/marker.png"),
    iconRetinaUrl: require("../../images/marker.png"),
    shadowAnchor: null,
    iconSize: new L.Point(20, 30),
  });
  
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
                    {map_loaded && <MapContainer
                        center={[event_data.latitude, event_data.longitude]}
                        zoom={13}
                        id="map"
                        style={{
                          height: "70vh",
                          margin: "1vw",
                        }}
                      >
                        <TileLayer
                          url={
                            "https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?callback=initialize&key=4Qg1CBLvuefoRWUOrqlJ"
                          }
                        />
                        <Marker
                          icon={customIcon}
                          position={[event_data.latitude, event_data.longitude]}
                        >
                          <Popup>{event_data.title}</Popup>
                        </Marker>
                      </MapContainer>}
                    </MDBRow>

                    {isAuthenticated && moment(event_data.start_date).isAfter(new Date())&& (
                      <MDBRow>
                        <MDBCol>
                          <MDBCardText className="text-muted w-auto">
                            <Button
                              onClick={() => {
                                navigate(`/admin/events/${id}/update`);
                              }}
                              type="button"
                              className="btn btn-light w-100"
                            >
                              Editar evento
                            </Button>
                          </MDBCardText>
                        </MDBCol>

                        <MDBCol>
                          <MDBCardText className="text-muted w-auto">
                            <Button
                              onClick={() => {
                                deleteConfirmationAlert();
                              }}
                              type="button"
                              className="btn btn-danger w-100"
                            >
                              Borrar
                            </Button>
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                    )}
                    
                    {(moment(event_data.start_date).isAfter(new Date()) && event_data.available_places[0] !== '0' ) && (
                      <><hr></hr><MDBRow>
                        <MDBCol>
                          <MDBCardText className="text-muted w-auto">
                            <Button
                              onClick={() => {
                                navigate(`/events/${id}/booking`);
                              } }
                              type="button"
                              className="btn btn-light w-100"
                            >
                              Apuntarse al evento
                            </Button>
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow></>
                    )}
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
                    <MDBCardText className="text-muted">{event_data.title}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />

                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Descripción</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {event_data.description}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />

                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Calle</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{event_data.street}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />

                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Número</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{event_data.number}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />

                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Ciudad</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{event_data.city}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />

                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Fecha y hora</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {formatDate(event_data.start_date)} - {formatDate(event_data.end_date)}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />

                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Sitios</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {event_data.places}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                
                {(moment(event_data.start_date).isAfter(new Date())) &&(
                  <><hr /><MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Plazas disponibles</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">
                        {event_data.available_places.replace("places available of", "plazas disponibles de").replace("places", "plazas")}
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow></>
                )}

                {(moment(event_data.start_date).isAfter(new Date())) &&(
                <><hr /><MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>¿Evento lleno?</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">
                        {event_data.available_places[0] === '0' ? (
                          <>
                            <span>Sí </span>
                            <FaCheck style={{ color: 'green' }} />
                          </>
                        ) : (
                          <>
                            <span>No </span>
                            <FaTimes style={{ color: 'red' }} />
                          </>
                        )}
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow></>
                )}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        <hr></hr>
        {isAuthenticated && (
        <Button
          onClick={() => {
            navigate(`/admin/events`);
          }}
          type="button"
          className="btn btn-light w-100"
        >
          {" "}
          Volver al listado
        </Button>)}
        {(isAuthenticated == false) && (
          <Button
            onClick={() => {
              window.history.back();
            }}
            type="button"
            className="btn btn-light w-100"
          >
            Volver al listado
          </Button>)}
      </MDBContainer>
    </section>
  );
}

export default ShowEvent;
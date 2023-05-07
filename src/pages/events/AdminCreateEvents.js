import swal from "sweetalert";
import Form from "react-bootstrap/Form";
import { events } from "./services/backend";
import Button from "react-bootstrap/Button";
import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { userTimezone  } from "../../config";
import { isAntispam } from "../../components/AntiSpam.js";

const errorMsg = {
  title: "Mensaje de error",
  text: "Se ha producido un error al crear el evento",
  icon: "error",
  button: "Aceptar",
  timer: "5000",
};

const successMsg = {
  title: "Mensaje de confirmación",
  text: "El evento se ha creado correctamente",
  icon: "success",
  button: "Aceptar",
  timer: "5000",
};

function AdminCreateEvent() {
    let navigate = useNavigate();
    const [event, setEventData] = React.useState(
      {
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      places: '',
      street: '',
      number: '',
      city: '',
      }
    );

    const onTitleChange = (e) => {
      setEventData({ ...event, title: e.target.value });
    }

    const onDescriptionChange = (e) => {
      setEventData({ ...event, description: e.target.value });
    }

    const onStreetChange = (e) => {
      setEventData({ ...event, street: e.target.value });
    }
  
    const onNumberChange = (e) => {
      setEventData({ ...event, number: e.target.value });
    }
  
    const onCityChange = (e) => {
      setEventData({ ...event, city: e.target.value });
    }

    const onPlacesChange = (e) => {
      setEventData({ ...event, places: e.target.value });
    }
  
    const onStartDateChange = (e) => {
      setEventData({ ...event, start_date: moment(e.target.value).format('YYYY-MM-DD HH:mm:ss') });
    }
  
    const onEndDateChange = (e) => {
      setEventData({ ...event, end_date:  moment(e.target.value).format('YYYY-MM-DD HH:mm:ss')  });
    }

    const onSubmit = async (e) => {
      e.preventDefault();
      if (validateForm()) {
      const eventWithTimeZone = { ...event,userTimezone}
      postEvent(eventWithTimeZone);
      } 
    };

    function postEvent(event){
      const aux = events.post('',event).then((response) => {
        console.log(response);
        swal(successMsg);
        navigate("/admin/events");
      }).catch((error) => {
        if(error.response.status === 400) {
          let error_msgs = {general: "La dirección es inválida"};
          setErrors(error_msgs);
        } else{
          console.log(error);
          console.log(event);
          swal(errorMsg);
        }
      });
    };

    const { title, description, start_date, end_date, places, street,number,city } = event;

    /* Validator */
    const [errors, setErrors] = useState({});

    function validateDate(){
      if (start_date > end_date){
        return false;
      } else {
        return true;
      }
    }

    function validateStartDate(startDate){
      let today = moment((new Date()).toISOString()).format('YYYY-MM-DD HH:mm:ss');
      console.log(today);
      console.log(startDate);
      if (startDate < today){
        return false;
      } else {
        return true;
      }
    }

    function validarCampoNumerico(valor) {
      const regex = /^[0-9]*$/;
      return regex.test(valor);
    }
    
    function validateAddress(valor) {
      const regex = /^[a-zA-Z0-9\s, 'À-ÿ\/-]*$/;
      return regex.test(valor);
    }
    
    function validateForm() {
      let error_msgs = {};

      if (title === "" || title === null) {
        error_msgs.title = "El nombre no puede estar vacío";
      } else if (title.length >= 100){
        error_msgs.title = "El nombre no puede tener más de 100 caracteres";
      } else if (!isAntispam(title)){
        error_msgs.title = "El nombre no puede contener palabras prohibidas";
      }
      
      if (description === "" || description === null) {
        error_msgs.description = "La descripción no puede estar vacía";
      } else if (description.length >= 500){
        error_msgs.description = "La descripción no puede tener más de 500 caracteres";
      } else if (!isAntispam(description)){
        error_msgs.description = "La descripción no puede contener palabras prohibidas";
      }

      if (places === "" || places === null) {
        error_msgs.places = "Las plazas no pueden estar vacías";
      } else if (places.length <= 0){
        error_msgs.places = "Las plazas no pueden ser negativas";
      } else if (!validarCampoNumerico(places)){
        error_msgs.places = "Las plazas deben ser un número";
      }

      if (street === "" || street === null) {
        error_msgs.street = "La calle no puede estar vacía";
      } else if (street.length >= 255){
        error_msgs.street = "La calle no puede tener más de 255 caracteres";
      } else if (!validateAddress(street)){
        error_msgs.street = "La calle no puede contener caracteres especiales";
      } else if (!isAntispam(street)){
        error_msgs.street = "La calle no puede contener palabras prohibidas";
      }

      if (number.length >= 10){
        error_msgs.number = "El número no puede tener más de 10 caracteres";
      } else if (!validarCampoNumerico(number)){
        error_msgs.number = "El número debe ser un número";
      }

      if (city === "" || city === null) {
        error_msgs.city = "La ciudad no puede estar vacía";
      } else if (city.length >= 100){
        error_msgs.city = "La ciudad no puede tener más de 100 caracteres";
      } else if (!isAntispam(city)){
        error_msgs.city = "La ciudad no puede contener palabras prohibidas";
      }

      if (start_date === "" || start_date === null) {
        error_msgs.start_date = "La fecha de inicio no puede estar vacía";
      } else if (!validateStartDate(start_date)){
        error_msgs.start_date = "La fecha de inicio no puede ser anterior a la actual";
      } else if (!validateDate()){
        error_msgs.start_date = "La fecha de fin no puede ser anterior a la de inicio";
      }

      if (end_date === "" || end_date === null) {
        error_msgs.end_date = "La fecha de fin no puede estar vacía";
      } else if (!validateDate()){
        error_msgs.end_date = "La fecha de fin no puede ser anterior a la de inicio";
      } else if (!validateStartDate(end_date)){
        error_msgs.end_date = "La fecha de fin no puede ser anterior a la actual";
      }

      setErrors(error_msgs);

      if (Object.keys(error_msgs).length === 0) {
        return true;
      } else {
        return false;
    }

    }

    return (
        <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 shadow">
            <h1 className="pt-3">Crear evento</h1>
            <Form className="" onSubmit={(e) => onSubmit(e)}>
              <div className="row justify-content-evenly">
                <Form.Group className="mb-3">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    onChange={(e) => onTitleChange(e)}
                    value={title}
                    name="title"
                    placeholder="Título del evento (100 caracteres)"
                    maxLength={100}
                  />
                </Form.Group>
                {errors.title && (
                  <p className="text-danger">{errors.title}</p>
                )}
                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    onChange={(e) => onDescriptionChange(e)}
                    value={description}
                    name="description"
                    placeholder="Descripción del evento"
                  />
                </Form.Group>
                {errors.description && (
                  <p className="text-danger">{errors.description}</p>
                )}
                <Form.Group className="mb-3">
                  <Form.Label>Plazas</Form.Label>
                  <Form.Control
                    onChange={(e) => onPlacesChange(e)}
                    value={places}
                    name="places"
                    placeholder="Plazas en el evento"
                  />
                </Form.Group>
                {errors.places && (
                  <p className="text-danger">{errors.places}</p>
                )}
  
                <Form.Group className="mb-3">
                  <Form.Label>Calle</Form.Label>
                  <Form.Control
                    onChange={(e) => onStreetChange(e)}
                    value={street}
                    name="street"
                    placeholder="Nombre de la calle"
                  />
                </Form.Group>

                {errors.street && (
                  <p className="text-danger">{errors.street}</p>
                )}
  
                <Form.Group className="mb-3">
                  <Form.Label>Número</Form.Label>
                  <Form.Control
                    onChange={(e) => onNumberChange(e)}
                    value={number}
                    name="number"
                    placeholder="Número de la calle"
                  />
                </Form.Group>
                {errors.number && (
                  <p className="text-danger">{errors.number}</p>
                )}
                <Form.Group className="mb-3">
                  <Form.Label>Ciudad</Form.Label>
                  <Form.Control
                    onChange={(e) => onCityChange(e)}
                    value={city}
                    name="city"
                    placeholder="Ciudad donde se encuentra el evento"
                  />
                </Form.Group>
                {errors.city && (
                  <p className="text-danger">{errors.city}</p>
                )}
                <Form.Group className="mb-3">
                <Form.Label>Fecha de inicio</Form.Label>
                <Form.Control
                  onChange={(e) => onStartDateChange(e)}
                  value={start_date}
                  type="datetime-local"
                  name="start_date"
                />
              </Form.Group>
                {errors.start_date && (
                  <p className="text-danger">{errors.start_date}</p>
                )}
              <Form.Group className="mb-3">
                <Form.Label>Fecha de finalizado</Form.Label>
                <Form.Control
                  onChange={(e) => onEndDateChange(e)}
                  value={end_date}
                  type="datetime-local"
                  name="end_date"
                />
              </Form.Group>
                {errors.end_date && (
                  <p className="text-danger">{errors.end_date}</p>
                )}

              </div>
              {errors.general && (<p className="text-danger">{errors.general}</p>)}
              <div className="row justify-content-evenly">
                <Button className="col mb-4 mx-2" variant="primary" type="submit">
                  Guardar evento
                </Button>
                <Link
                  className="btn btn-outline-danger col mb-4 mx-2"
                  to="/admin/events"
                >
                  Cancelar
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
};
export default AdminCreateEvent;
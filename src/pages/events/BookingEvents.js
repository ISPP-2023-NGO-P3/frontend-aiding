import React from "react";
import { events } from "./services/backend.js";
import swal from "sweetalert";
import { useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { isAntispam } from "../../components/AntiSpam.js";

const successMsg = {
  title: "Mensaje de confirmación",
  text: "Enhorabuena, te has apuntado al evento correctamente, te esperamos allí, no faltes!",
  icon: "success",
  button: "Aceptar",
  timer: "5000",
};

const errorMsg = {
  title: "Mensaje de error",
  text: "Se ha producido un error al reservar el evento",
  icon: "error",
  button: "Aceptar",
  timer: "5000",
};

function BookingEvents() {
  let navigate = useNavigate();

  const { id } = useParams();

  function postBooking(booking) {
    events
      .post(`/${id}/booking/`, booking)
      .then((response) => {
        console.log(response);
        swal(successMsg);
        navigate(`/events/${id}`);
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          let error_msgs = {
            general:
              "No hay más plazas disponibles para ese evento, porfavor apúntese a otro diferente",
          };
          setErrors(error_msgs);
        } else {
          swal(errorMsg);
        }
      });
  }

  /* Validator */
  const [errors, setErrors] = useState({});

  function validateName(valor) {
    const regex = /^[a-zA-ZÀ-ÿ]+(([',. -][a-zA-ZÀ-ÿ ])?[a-zA-ZÀ-ÿ]*)*$/;
    return regex.test(valor);
  }

  function validateTelefone(valor) {
    const regex = /^(\+34|0034|34)?[ -]*(6|7|9)[ -]*([0-9][ -]*){8}$/;
    return regex.test(valor);
  }

  function validateForm() {
    let error_msgs = {};

    if (name === "" || name === null) {
      error_msgs.name = "El nombre no puede estar vacío";
    } else if (!validateName(name)) {
      error_msgs.name = "El nombre no es válido";
    } else if (!isAntispam(name)) {
      error_msgs.name = "El nombre no puede contener palabras prohibidas";
    }

    if (last_name === "" || last_name === null) {
      error_msgs.last_name = "Debes de introducir un apellido";
    } else if (!validateName(last_name)) {
      error_msgs.last_name = "El apellido no es válido";
    } else if (!isAntispam(last_name)) {
      error_msgs.last_name = "El apellido no puede contener palabras prohibidas";
    }

    if (phone === "" || phone === null) {
      error_msgs.phone = "Debes de introducir un teléfono";
    } else if (!validateTelefone(phone)) {
      error_msgs.phone = "El teléfono no es válido";
    }
    
    setErrors(error_msgs);

    if (Object.keys(error_msgs).length === 0) {
      return true;
    } else {
      return false;
    }
  }

  const [booking, setBooking] = useState({
    name: "",
    last_name: "",
    phone: "",
  });

  const { name, last_name, phone } = booking;

  const onInputChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      postBooking(booking);
    }
  };

  return (
    <div className="container my-5 shadow">
      <h1 className="pt-3">Apuntarse a un evento</h1>
      <Form onSubmit={(e) => onSubmit(e)}>
        <div className="row justify-content-evenly">
          <div className="col-md-6">
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introduce tu nombre (máximo 100 caracteres)"
                name="name"
                value={name}
                maxLength={100}
                onChange={(e) => onInputChange(e)}
              />
            </Form.Group>
            {errors.name && <p className="text-danger">{errors.name}</p>}
            <Form.Group className="mb-3">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introduce tus apellidos (máximo 100 caracteres)"
                name="last_name"
                value={last_name}
                maxLength={100}
                onChange={(e) => onInputChange(e)}
              />
            </Form.Group>
            {errors.last_name && (
              <p className="text-danger">{errors.last_name}</p>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introduce tu teléfono"
                name="phone"
                value={phone}
                onChange={(e) => onInputChange(e)}
              />
            </Form.Group>
            {errors.phone && <p className="text-danger">{errors.phone}</p>}
          </div>
        </div>
        <div className="row justify-content-evenly">
          <Button
            className="col mb-4 mx-5"
            variant="outline-success"
            type="submit"
          >
            Apuntarse al evento
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default BookingEvents;

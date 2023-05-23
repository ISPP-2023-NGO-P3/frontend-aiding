import React from "react";
import swal from "sweetalert";
import { useNavigate, useParams, Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import {contacts} from "./services/backend.js";

const successMsg = {
  title: "Mensaje de confirmación",
  text: "Te confirmamos se ha actualizado correctamente",
  icon: "success",
  button: "Aceptar",
  timer: "5000",
};

const errorMsg = {
  title: "Mensaje de error",
  text: "Se ha producido un error al actualizar",
  icon: "error",
  button: "Aceptar",
  timer: "5000",
};
function ContactDetail() {
  let navigate = useNavigate();
  const { id } = useParams();

  const [contact, setContact] = useState({
    name: "",
    email: "",
    datetime: "",
    subject: "",
    message: "",
    isAnswered: "",
});

const { name, email, datetime, subject, message, isAnswered } = contact;

useEffect(() => {
  loadContact();
}, []);

const loadContact = async () => {
  const result = await contacts.get(`/${id}/`);
  setContact(result.data);
};

function putContact(contact) {
  const aux = contacts
    .put(`/${id}/`, contact)
    .then((response) => {
      swal(successMsg);
      window.history.back();
    })
    .catch((error) => {
      swal(errorMsg);
    });
  }

const onInputChange = (e) => {
  if (e.target.name === "isAnswered") {
    setContact({ ...contact, [e.target.name]: e.target.checked });
  } else {
    setContact({ ...contact, [e.target.name]: e.target.value });
  }
};
    

const onSubmit = async (e) => {
  e.preventDefault();
  putContact(contact);
};


  return (
  <div className="container my-5 shadow">
  <h1 className="pt-3">Contáctanos</h1>
  <p className="text-danger"></p>
  <Form className="" onSubmit={(e) => onSubmit(e)}>
  <div className="row justify-content-evenly">
    <div className="col-md-5">
      <table className="table table-striped table-hover">
        <tbody>
          <tr>
            <td><label>Nombre</label></td>
            </tr>
            <tr>
            <td><p>{name}</p></td>
          </tr>
          <tr>
            <td><label>Correo electrónico</label></td>
            </tr>
            <tr>
            <td><p>{email}</p></td>
          </tr>
          <tr>
            <td><label>Fecha</label></td>
          </tr>
          <tr>
            <td><p>{new Date(datetime).toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit', year: '2-digit', hour:'2-digit', minute:'2-digit'})}</p></td>
          </tr>
          </tbody>
      </table>
      </div>
      <div className="col-md-5">
      <table className="table table-striped table-hover">
      <tbody>
        <tr>
          <td><label>Asunto</label></td>
          </tr>
          <tr>
          <td><p>{subject}</p></td>
        </tr>
        <tr>
          <td><label>Mensaje</label></td>
          </tr>
          <tr>
          <td className="izquierda"><p>{message}</p></td>
          </tr>
      </tbody>
      </table>
      </div>
      <div className="col-md-5">
        <Form.Group className="mb-3">
          <Form.Label>Respondido</Form.Label>
          <Form.Check
            type="switch"
            id="custom-switch"
            name="isAnswered"
            checked={isAnswered}
            onChange={(e) => onInputChange(e)}
          />
        </Form.Group>
      </div>
  </div>
  <div className="row justify-content-center">
    <div className="col-md-7">
      <Button className="col mb-4 mx-2" variant="outline-success" type="submit">
        Actualizar
      </Button>
      <Link
        className="btn btn-outline-danger col mb-4 mx-2"
        to="/admin/base/contacts"
      >
        Volver
      </Link>
    </div>    
  </div>
  </Form>
  </div>
  );
  }

  export default ContactDetail;


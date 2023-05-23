import React from "react";
import {partners} from "./services/backend.js";
import swal from 'sweetalert';
import { useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import { isAntispam } from "../../components/AntiSpam.js";

const successMsg = {
  title: "Mensaje de confirmación",
  text: "Te confirmamos que la comunicación se ha editado correctamente",
  icon: "success",
  button: "Aceptar",
  timer: "5000",
}

const errorMsg = {
  title: "Mensaje de error",
  text: "Se ha producido un error al editar la comunicación",
  icon: "error",
  button: "Aceptar",
  timer: "5000",
}

const successMsgDelete = {
  title: "Mensaje de confirmación",
  text: "Te confirmamos que la comunicación se ha borrado correctamente",
  icon: "success",
  button: "Aceptar",
  timer: "5000",
};

const errorMsgDelete = {
  title: "Mensaje de error",
  text: "Se ha producido un error al borrar la comunicación",
  icon: "error",
  button: "Aceptar",
  timer: "5000",
};


function UpdateCommunication() {
  let navigate = useNavigate();

  const { id, idc } = useParams();

  const [communication, setCommunication] = useState({
    date: "",
    communication_type: "",
    description: "",
  });

  const {
    date,
    communication_type,
    description,
  } = communication;

  useEffect(() => {
    const getCommunication = partners.get(`/${id}/communication/${idc}`).then((response) => {setCommunication(response.data[0]);});
  }, []);

  console.log(communication)

  function putCommunication(communication) {
    const aux = partners
      .put(`/${id}/communication/${idc}`, communication)
      .then((response) => {
        swal(successMsg);
        navigate(`/admin/partners/${id}`);
      })
      .catch((error) => {
        console.log(communication)
        swal(errorMsg);
      });
  }

  const onInputChange = (e) => {
    setCommunication({ ...communication, [e.target.name]: e.target.value });
  };

  /* Validator */
  const [errors, setErrors] = useState({});

  function validateForm() {
    let error_msgs = {};

    if (date === "" || date === null) {
      error_msgs.date = "La fecha no puede estar vacía";
    }

    if (description === "" || description === null) {
      error_msgs.description = "La descripción no puede estar vacía";
    } else if (description.length > 255) {
      error_msgs.description = "La descripción debe tener menos de 255 caracteres";
    } else if (!isAntispam(description)) {
      error_msgs.description = "La descripción no puede contener palabras prohibidas";
    }

    setErrors(error_msgs);

    if (Object.keys(error_msgs).length === 0) {
      return true;
    } else {
      return false;
    }
  }
  
  const onSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      putCommunication(communication);
    }
  };

  /** BORRADO */

  const deleteResouce = async () => {
    const result = await partners
      .delete(`/${id}/communication/${idc}`)
      .then((res) => {
        swal(successMsgDelete);
        navigate(`/admin/partners/${id}`);
      })
      .catch((err) => {
        swal(errorMsgDelete);
      });
  };

  const deleteConfirmationAlert = async () => {
    swal({
      title: "Eliminar comunicación",
      text: "¿Estás seguro que desea eliminar la comunicación?",
      icon: "warning",
      buttons: ["No", "Sí"],
    }).then((res) => {
      if (res) {
        deleteResouce();
      }
    });
  };

  return (
    <div className="container my-5 shadow">
      <h1 className="pt-3">Actualizando comunicación</h1>
      <Form className="" onSubmit={(e) => onSubmit(e)}>
        <div className="row justify-content-evenly">
          <div className="col-md-6">
              <Form.Group className="mb-3">
              <Form.Label>Fecha de la comunicación</Form.Label>
              <Form.Control
                onChange={(e) => onInputChange(e)}
                value={date}
                type="date"
                name="date"
              />
            </Form.Group>
            {errors.date && (
                  <p className="text-danger">{errors.date}</p>
                )}
            <Form.Group className="mb-3">
              <Form.Label>Tipo de la comunicación</Form.Label>
              <Form.Select
                onChange={(e) => onInputChange(e)}
                value={communication_type}
                name="communication_type"
              >
                <option value="TELEFÓNICA">Telefónica</option>
                <option value="TELEMÁTICA">Telemática</option>
                <option value="PERSONAL">Personal</option>
                <option value="EMAIL">Email</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                onChange={(e) => onInputChange(e)}
                value={description}
                name="description"
                as="textarea"
                rows={3}
                placeholder="Descripción de la comunicación"
              />
            </Form.Group>
            {errors.description && (
                  <p className="text-danger">{errors.description}</p>
                )}
          </div>
        </div>

        <div className="row justify-content-evenly">
          <Button className="col mb-4 mx-3" variant="outline-success" type="submit">
            Guardar comunicación
          </Button>
          <Button className="col mb-4 mx-3" onClick={() => {deleteConfirmationAlert();}} variant="outline-danger">
            Eliminar comunicación
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default UpdateCommunication;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import resourcesApi from "./services/backend.js";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { isAntispam } from "../../../components/AntiSpam.js";

const successMsg = {
  title: "Mensaje de confirmación",
  text: "Te confirmamos que el recurso se ha creado correctamente",
  icon: "success",
  button: "Aceptar",
  timer: "5000",
};

const errorMsg = {
  title: "Mensaje de error",
  text: "Se ha producido un error al crear el recurso",
  icon: "error",
  button: "Aceptar",
  timer: "5000",
};

export default function CreateResource() {

  let navigate = useNavigate();

  const [resource, setResource] = useState({
    title: "",
    description: "",
    contact_phone: "",
    street: "",
    number: "",
    city: "",
    additional_comments: "",
    resource_type:"seniors_association"
  });

  const { title, description, contact_phone, street, number, city, additional_comments, resource_type } =
    resource;

  const onInputChange = (e) => {
    setResource({ ...resource, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      postResource(resource);
    }
  };

  function postResource(resource) {
    const aux = resourcesApi
      .post("", resource)
      .then((response) => {
        console.log(response);
        swal(successMsg);
        navigate("/admin/information/resources");
      })
      .catch((error) => {
        if(error.response.status === 400) {
          let error_msgs = {general: "La dirección es inválida"};
          setErrors(error_msgs);
        } else {
          swal(errorMsg);
        }
        
      });
  }

    /* Validator */
   const [errors, setErrors] = useState({});
 
   function validateTelefone(valor) {
    const regex = /^(\+34|0034|34)?[ -]*(6|7|9)[ -]*([0-9][ -]*){8}$/;
    return regex.test(valor);
  }

  function validateName(valor) {
    const regex = /^[a-zA-ZÀ-ÿ]+(([',. -][a-zA-ZÀ-ÿ ])?[a-zA-ZÀ-ÿ]*)*$/;
    return regex.test(valor);
  }

  function validateAddress(valor) {
    const regex = /^[a-zA-Z0-9\s, 'À-ÿ\/-]*$/;
    return regex.test(valor);
  }

  function validarCampoNumerico(valor) {
    const regex = /^[0-9]*$/;
    return regex.test(valor);
  }

   function validateForm() {
     let error_msgs = {};
 
    if (title === "" || title === null) {
      error_msgs.title = "El título no puede estar vacío";
    } else if (title.length > 100) {
      error_msgs.title = "El título no puede tener más de 100 caracteres";
    } else if (!validateName(title)) {
      error_msgs.title = "El título no puede contener números ni caracteres especiales";
    } else if (!isAntispam(title)) {
      error_msgs.title = "El título no puede contener palabras prohibidas";
    }
  
    if (description === "" || description === null) {
      error_msgs.description = "La descripción no puede estar vacía";
    } else if (description.length > 255) {
      error_msgs.description = "La descripción no puede tener más de 255 caracteres";
    } else if (!isAntispam(description)) {
      error_msgs.description = "La descripción no puede contener palabras prohibidas";
    }

    if (street === "" || street === null) {
      error_msgs.street = "La calle no puede estar vacía";
    } else if (street.length > 255) {
      error_msgs.street = "La calle no puede tener más de 255 caracteres";
    } else if (!validateAddress(street)) {
      error_msgs.street = "La calle no puede contener números ni caracteres especiales";
    } else if (!isAntispam(street)) {
      error_msgs.street = "La calle no puede contener palabras prohibidas";
    }

    if (contact_phone === "" || contact_phone === null) {
      error_msgs.contact_phone = "El teléfono no puede estar vacío";
    } else if (!validateTelefone(contact_phone)) {
      error_msgs.contact_phone = "Este no es un teléfono válido";
    }

    if (number.length > 10) {
      error_msgs.number = "El número no puede tener más de 10 caracteres";
    } else if (!validarCampoNumerico(number)) {
      error_msgs.number = "El número no puede contener letras ni caracteres especiales y no debe de ser negativo";
    }

    if (city === "" || city === null) {
      error_msgs.city = "La ciudad no puede estar vacía";
    } else if (city.length > 100) {
      error_msgs.city = "La ciudad no puede tener más de 100 caracteres";
    } else if (!validateName(city)) {
      error_msgs.city = "La ciudad no puede contener números ni caracteres especiales";
    } else if (!isAntispam(city)) {
      error_msgs.city = "La ciudad no puede contener palabras prohibidas";
    }

    if (!(additional_comments === "" || additional_comments === null)) {
      if (additional_comments > 255) {
        error_msgs.additional_comments = "Los comentarios no pueden tener más de 255 caracteres";
      } else if (!isAntispam(additional_comments)) {
        error_msgs.additional_comments = "Los comentarios no pueden contener palabras prohibidas";
      }
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
          <h1 className="pt-3">Crear recurso</h1>
          <Form className="" onSubmit={(e) => onSubmit(e)}>
            <div className="row justify-content-evenly">
              <Form.Group className="mb-3">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={title}
                  name="title"
                  placeholder="Título del recurso (100 caracteres)"
                  maxLength={100}
                />
              </Form.Group>
              {errors.title && (
                  <p className="text-danger">{errors.title}</p>
                )}

              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={description}
                  name="description"
                  placeholder="Descripción del recurso (255 caracteres)"
                  maxlength={255}
                />
              </Form.Group>
              {errors.description && (
                  <p className="text-danger">{errors.description}</p>
                )}
              <Form.Group className="mb-3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={contact_phone}
                  name="contact_phone"
                  placeholder="Teléfono de contacto"
                />
              </Form.Group>
              {errors.contact_phone && (
                  <p className="text-danger">{errors.contact_phone}</p>
                )}

              <Form.Group className="mb-3">
                <Form.Label>Calle</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={street}
                  name="street"
                  placeholder="Calle del recurso"
                  maxlength={255}
                />
              </Form.Group>
              {errors.street && (
                  <p className="text-danger">{errors.street}</p>
                )}

              <Form.Group className="mb-3">
                <Form.Label>Número</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={number}
                  name="number"
                  placeholder="Número de la calle"
                  maxlength={10}
                />
              </Form.Group>
              {errors.number && (
                  <p className="text-danger">{errors.number}</p>
                )}

              <Form.Group className="mb-3">
                <Form.Label>Ciudad</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={city}
                  name="city"
                  placeholder="Ciudad donde se encuentra el recurso"
                  maxlength={100}
                />
              </Form.Group>
              {errors.city && (
                  <p className="text-danger">{errors.city}</p>
                )}

              <Form.Group className="mb-3">
                <Form.Label>Comentarios adicionales</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={additional_comments}
                  name="additional_comments"
                  placeholder="Comentarios adicionales (255 caracteres)"
                  maxlength={255}
                />
              </Form.Group>
              {errors.additional_comments && (
                  <p className="text-danger">{errors.additional_comments}</p>
                )}
              <Form.Group className="mb-3">
                <Form.Label>Tipo de recurso</Form.Label>
                <Form.Select
                  onChange={(e) => onInputChange(e)}
                  value={resource_type}
                  name="resource_type"
                >
                  <option value="neighborhood_association">Asociación de vecinos</option>
                  <option value="seniors_association">Asociación de mayores</option>
                  <option value="nursing_home">Residencia</option>
                 
                </Form.Select>
              </Form.Group>
            </div>
            {errors.general && (<p className="text-danger">{errors.general}</p>)}
            <div className="row justify-content-evenly">
              <Button className="col mb-4 mx-2" variant="outline-success" type="submit">
                Guardar recurso
              </Button>
              <Link
                className="btn btn-outline-danger col mb-4 mx-2"
                to="/admin/information/resources"
              >
                Cancelar
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

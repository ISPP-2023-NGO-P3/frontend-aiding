import React from "react";
import {volunteers} from "./services/backend.js";
import swal from 'sweetalert';
import { useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import { isAntispam } from "../../components/AntiSpam.js";

const successMsg = {
  title: "Mensaje de confirmación",
  text: "El voluntario se ha actualizado correctamente",
  icon: "success",
  button: "Aceptar",
  timer: "5000",
}

const errorMsg = {
  title: "Mensaje de error",
  text: "Se ha producido un error al actualizar el voluntario",
  icon: "error",
  button: "Aceptar",
  timer: "5000",
}


function UpdateVolunteer() {
  let navigate = useNavigate();

  const { id } = useParams();

  const [volunteer, setVolunteer] = useState({
    name: "",
    last_name: "",
    nif: "",
    place: "",
    phone: "",
    email: "",
    state: "Activo",
    situation: "Ok",
    rol: "Voluntario",
    postal_code: "",
    observations:"",
    computerKnowledge:"",
    truckKnowledge:"",
    warehouseKnowledge:"",
    otherKnowledge:"",
    });
  
  
    const {
      name,
      last_name,
      nif,
      place,
      phone,
      email,
      state,
      situation,
      rol,
      postal_code,
      observations,
      computerKnowledge,
      truckKnowledge,
      warehouseKnowledge,
      otherKnowledge,
    } = volunteer;

  useEffect(() => {
    loadVolunteer();
  }, []);
  
  const loadVolunteer = async () => {
    const result = await volunteers.get(`/${id}`);
    setVolunteer(result.data);
  };
  
  function putVolunteer(volunteer) {
    const aux = volunteers
      .put(`/${id}`, volunteer)
      .then((response) => {
        swal(successMsg);
        const role = localStorage.getItem("role");
        navigate(role === 'admin' ? `/admin/volunteers/${id}` : `/roles/volunteers/${id}`);
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          let error_msgs = {general: "Ya existe un voluntario con ese NIF, teléfono o email"};
          setErrors(error_msgs);
        }else {
          swal(errorMsg);
        }
      });
  }

  const onInputChange = (e) => {
    if(e.target.name === "truckKnowledge" || e.target.name === "computerKnowledge" ||e.target.name === "warehouseKnowledge"){
      setVolunteer({ ...volunteer, [e.target.name]: e.target.checked });
    }else{
      setVolunteer({ ...volunteer, [e.target.name]: e.target.value });
    }
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      putVolunteer(volunteer);
    }
      
  };

    /* Validators */
  const [errors, setErrors] = useState({});

  function validateEmail(email) {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regex.test(email);
  }

  function validateNIF(nif) {
    const dniRegex = /^([a-z]|[A-Z]|[0-9])[0-9]{7}([a-z]|[A-Z]|[0-9])$/;
    const strRegex = /^[a-zA-Z]$/;
    const first_caracter=nif.charAt(0);
    if(!dniRegex.test(nif)){ //Check NIF and DNI
      if(!strRegex.test(first_caracter)){//if DNI
        const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
        const letterIndex = parseInt(nif.substring(0, 8),10) % 23;
        const expectedLetter = letters.charAt(letterIndex);
        const actualLetter = nif.charAt(8).toUpperCase();
        return expectedLetter === actualLetter;
      }
    }return true;
  }


  function validateName(valor) {
    const regex = /^[a-zA-ZÀ-ÿ]+(([',. -][a-zA-ZÀ-ÿ ])?[a-zA-ZÀ-ÿ]*)*$/;
    return regex.test(valor);
  }

  function validatePostalCode(valor) {
    const regex = /^[0-9]{5}$/;
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
    } else if(!validateName(name)){
      error_msgs.name="El nombre no puede contener números o carácteres especiales";
    } else if (!isAntispam(name)) {
      error_msgs.name="El nombre no puede contener palabras prohibidas";
    }

    if (last_name === "" || last_name === null) {
      error_msgs.last_name = "Los apellidos no pueden estar vacío";
    } else if(!validateName(last_name)){
      error_msgs.last_name="Los apellidos no pueden contener números o carácteres especiales";
    } else if (!isAntispam(last_name)) {
      error_msgs.last_name="Los apellidos no pueden contener palabras prohibidas";
    }

    if ( nif === "" || nif === null) {
      error_msgs.nif = "El NIF no puede estar vacío";
    } else if (!validateNIF(nif)) {
      error_msgs.nif = "Este no es un NIF válido";
    }

    if (phone === "" || phone === null) {
      error_msgs.phone = "El teléfono no puede estar vacío";
    } else if (!validateTelefone(phone)) {
      error_msgs.phone = "Este no es un teléfono válido";
    }

    if (place === "" || place === null) {
      error_msgs.place = "La población no puede estar vacía";
    } else if(!validateName(place)){
      error_msgs.place="La población no puede contener números o carácteres especiales";
    } else if (!isAntispam(place)) {
      error_msgs.place="La población no puede contener palabras prohibidas";
    }
    
    if (email === "" || email === null) {
      error_msgs.email = "El email no puede estar vacío";
    }else if (!validateEmail(email)) {
      error_msgs.email = "Este no es un email válido";
    } else if (!isAntispam(email)) {
      error_msgs.email="El email no puede contener palabras prohibidas";
    }

    if (situation === "" || situation === null) {
      error_msgs.situation = "Por favor, indique la situación del voluntario";
    }

    if (rol === "" || rol === null) {
      error_msgs.rol = "Por favor, indique el rol del voluntario";
    }
    
    if (!(observations === "" || observations === null)) {
      if (observations.length>250) {
        error_msgs.observations = "Las observaciones no pueden tener más de 250 caracteres";
      } else if (!isAntispam(observations)) {
        error_msgs.observations="Las observaciones no pueden contener palabras prohibidas";
      }
    }

    if (postal_code === "" || postal_code === null) {
      error_msgs.postal_code = "El código postal no puede estar vacío";
    } else if (!validatePostalCode(postal_code)) {
      error_msgs.postal_code = "Este no es un código postal válido";
    }

    setErrors(error_msgs);

    if (Object.keys(error_msgs).length === 0) {
      return true;
    } else {
      return false;
    }
  }

  function handleClickReturn(){
    navigate(`/admin/volunteers/${id}`);
  }
  
  return (
    <div className="container my-5 shadow">
      <h1 className="pt-3">Actualizando voluntario Nº {id}</h1> 
      <h1 className="pt-3">{volunteer.name} {volunteer.last_name}</h1>
      <Form className="" onSubmit={(e) => onSubmit(e)}>
        <div className="row justify-content-evenly">
          <div className="col-md-5">
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                onChange={(e) => onInputChange(e)}
                value={name}
                name="name"
                placeholder="Nombre del voluntario"
              />
              </Form.Group>
              {errors.name && (
                <p className="text-danger">{errors.name}</p>
              )}
            <Form.Group className="mb-3">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                onChange={(e) => onInputChange(e)}
                value={last_name}
                name="last_name"
                placeholder="Apellidos del voluntario"
              />
              </Form.Group>
                {errors.last_name && (
                  <p className="text-danger">{errors.last_name}</p>
                  )}
                <Form.Group className="mb-3">
                  <Form.Label>NIF</Form.Label>
                  <Form.Control
                    onChange={(e) => onInputChange(e)}
                    value={nif}
                    name="nif"
                    placeholder="NIF del voluntario. Debe ser único."
                  />
                </Form.Group>
                {errors.nif && (
                    <p className="text-danger">{errors.nif}</p>
                  )}
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    onChange={(e) => onInputChange(e)}
                    value={phone}
                    name="phone"
                    placeholder="Teléfono del voluntario. Debe ser único."
                  />
                  </Form.Group>
                  {errors.phone && (
                    <p className="text-danger">{errors.phone}</p>
                  )}
                <Form.Group className="mb-3">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    onChange={(e) => onInputChange(e)}
                    value={email}
                    name="email"
                    placeholder="E-mail del voluntario. Debe ser único."
                  />
                </Form.Group>
                {errors.email && (
                  <p className="text-danger">{errors.email}</p>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Población</Form.Label>
                  <Form.Control
                    onChange={(e) => onInputChange(e)}
                    value={place}
                    name="place"
                    placeholder="Población del voluntario"
                  />
                </Form.Group>
                {errors.place && (
                  <p className="text-danger">{errors.place}</p>
                )}
                <Form.Group className="mb-3">
                <Form.Label>Código postal</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={postal_code}
                  name="postal_code"
                  placeholder="Código postal"
                />
              </Form.Group>
              {errors.place && (
                  <p className="text-danger">{errors.postal_code}</p>
                )}
            </div>
            <div className="col-md-5">
              <Form.Group className="mb-3">
                <Form.Label>Rol</Form.Label>
                <Form.Select
                  onChange={(e) => onInputChange(e)}
                  value={rol}
                  name="rol">
                  <option value="Voluntario">Voluntario</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Capitan">Capitan</option>
                  <option value="nuevo">Nuevo</option>
                  <option value="posibleSupervisor">Posible Supervisor</option>
                  <option value="posibleCapitan">Posible Capitán</option>
                  <option value="posibleVoluntarioEstructura">Posible voluntario de estructura</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Situacion</Form.Label>
                <Form.Select
                  onChange={(e) => onInputChange(e)}
                  value={situation}
                  name="situation">
                  <option value="Ok">Ok</option>
                  <option value="necesitaFormacion">Necesita Formacion</option>
                  <option value="necesitaComplemento">Necesita Complemento</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Conocimiento Tecnologico</Form.Label>
                <Form.Check
                type='checkbox'
                checked = {computerKnowledge}
                name="computerKnowledge"
                onChange={(e) => onInputChange(e)}
              />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Puede Manejar un Camión</Form.Label>
                <Form.Check 
                type='checkbox'
                checked = {truckKnowledge}
                name="truckKnowledge"
                onChange={(e) => onInputChange(e)}
              />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Sabe gestionar almacenes</Form.Label>
                <Form.Check 
                type='checkbox'
                checked = {warehouseKnowledge}
                name="warehouseKnowledge"
                onChange={(e) => onInputChange(e)}
              />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Otros conocimientos</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={otherKnowledge}
                  name="otherKnowledge"
                  placeholder="Otros conocimientos del voluntario"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  onChange={(e) => onInputChange(e)}
                  value={state}
                  name="state">
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Observaciones</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={observations}
                  as="textarea" 
                  rows="3"
                  name="observations"
                  placeholder="Observaciones"
                />
              </Form.Group>
              {errors.observations && (
                  <p className="text-danger">{errors.observations}</p>
                )}
            </div>
          </div>
          {errors.general && (<p className="text-danger">{errors.general}</p>)}
          <div className="row justify-content-evenly">
            <Button className="col mb-4 mx-2" variant="outline-success" type="submit">
              Guardar voluntario
            </Button>
            <Button className="col mb-4 mx-2" variant="outline-danger" onClick={()=> handleClickReturn() }>
              Cancelar
            </Button>
          </div>
        </Form>
      </div>
    );
  }

export default UpdateVolunteer;
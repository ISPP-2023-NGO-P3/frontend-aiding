import React from "react";
import {partners} from "./services/backend.js";
import swal from 'sweetalert';
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import IBAN from 'iban';
import { parseISO, differenceInYears } from 'date-fns';
import { isAntispam } from "../../components/AntiSpam.js";

const successMsg = {
  title: "Mensaje de confirmación",
  text: "Te confirmamos que el socio se ha creado correctamente",
  icon: "success",
  button: "Aceptar",
  timer: "5000",
}

const errorMsg = {
  title: "Mensaje de error",
  text: "Se ha producido un error al crear el socio",
  icon: "error",
  button: "Aceptar",
  timer: "5000",
}

function CreatePartner() {
    let navigate = useNavigate();

    function postPartner(partner){
        const aux = partners.post('',partner).then((response) => {
            console.log(response);
            console.log(partner);
            swal(successMsg);
            navigate("/admin/partners");
        }).catch((error) => {
            if (error.response && error.response.status === 409) {
              let error_msgs = {general: "Ya existe un socio con ese DNI, teléfono, email o IBAN"};
              setErrors(error_msgs);
            }else {
              swal(errorMsg);
            }
          });
    };

    /* Validator */
  const [errors, setErrors] = useState({});

  function validateEmail(email) {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regex.test(email);
  }

  function validateDNI(dni) {
    const dniRegex = /^\d{8}[a-zA-Z]$/;
    if (!dniRegex.test(dni)) {
      return false;
    }
    const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
    const letterIndex = parseInt(dni.substring(0, 8),10) % 23;
    const expectedLetter = letters.charAt(letterIndex);
    const actualLetter = dni.charAt(8).toUpperCase();
    return expectedLetter === actualLetter;
  }


  function validateIBAN(iban) {
    if (IBAN.isValid(iban) && iban.substring(0,2) === "ES") {
      return true;
    } else {
      return false;
    }
  }

  function validateAge(birthdate) {
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  
    const parsedBirthdate = parseISO(birthdate);
    const age = differenceInYears(new Date(), parsedBirthdate);
  
    return age >= 18;
  }

  function validateText(valor) {
    const regex = /^[a-zA-ZÀ-ÿ]*$/;
    return regex.test(valor);
  }
  
  function validateName(valor) {
    const regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+(([',. -][a-zA-ZñÑáéíóúÁÉÍÓÚ ])?[a-zA-ZñÑáéíóúÁÉÍÓÚ]*)*$/;
    return regex.test(valor);
  }

  function validateTelefone(valor) {
    const regex = /^(\+34|0034|34)?[ -]*(6|7|9)[ -]*([0-9][ -]*){8}$/;
    return regex.test(valor);
  }

  function validateAddress(valor) {
    const regex = /^[a-zA-Z0-9\s, 'À-ÿ\/-]*$/;
    return regex.test(valor);
  }

  function validatePostalCode(valor) {
    const regex = /^[0-9]{5}$/;
    return regex.test(valor);
  }

  function validateForm() {
    let error_msgs = {};

    if (name === "" || name === null) {
      error_msgs.name = "El nombre no puede estar vacío";
    } else if (!validateName(name)) {
      error_msgs.name = "El nombre no puede contener números o caracteres especiales";
    } else if (!isAntispam(name)) {
      error_msgs.name = "El nombre de usuario no puede contener palabras prohibidas";
    }

    if (last_name === "" || last_name === null) {
      error_msgs.last_name = "Los apellidos no pueden estar vacío";
    } else if (!validateName(last_name)) {
      error_msgs.last_name = "Los apellidos no pueden contener números o caracteres especiales";
    } else if (!isAntispam(last_name)) {
      error_msgs.last_name = "Los apellidos no pueden contener palabras prohibidas";
    }

    if (dni === "" || dni === null) {
      error_msgs.dni = "El DNI no puede estar vacío";
    } else if (!validateDNI(dni)) {
      error_msgs.dni = "Este no es un DNI válido";
    }

    if (phone1 === "" || phone1 === null) {
      error_msgs.phone1 = "El teléfono no puede estar vacío";
    } else if (!validateTelefone(phone1)) {
      error_msgs.phone1 = "Este no es un teléfono válido";
    }

    if(!validateTelefone(phone2) && !(phone2 === "") && !(phone2 === null)){
      error_msgs.phone2 = "Este no es un teléfono válido";
    }

    if (birthdate === "" || birthdate === null) {
      error_msgs.birthdate = "El cumpleaños no puede estar vacío";
    } else if (!validateAge(birthdate)) {
      error_msgs.birthdate = "El socio debe ser mayor de edad";
    }

    if (address === "" || address === null) {
      error_msgs.address = "La dirección no puede estar vacía";
    } else if(!validateAddress(address)){
      error_msgs.address = "La dirección no puede contener caracteres especiales";
    } else if (!isAntispam(address)) {
      error_msgs.address = "La dirección no puede contener palabras prohibidas";
    }

    if (postal_code === "" || postal_code === null) {
      error_msgs.postal_code = "El código postal no puede estar vacío";
    } else if (!validatePostalCode(postal_code)) {
      error_msgs.postal_code = "Este no es un código postal válido";
    }

    if (township === "" || township === null) {
      error_msgs.township = "La ciudad no puede estar vacía";
    } else if (!validateText(township)) {
      error_msgs.township = "La ciudad no puede contener números o caracteres especiales";
    } else if (!isAntispam(township)) {
      error_msgs.township = "La ciudad no puede contener palabras prohibidas";
    }

    if (province === "" || province === null) {
      error_msgs.province = "La provincia no puede estar vacía";
    } else if (!validateText(province)) {
      error_msgs.province = "La provincia no puede contener números o caracteres especiales";
    } else if (!isAntispam(province)) {
      error_msgs.province = "La provincia no puede contener palabras prohibidas";
    }
    
    if (email === "" || email === null) {
      error_msgs.email = "El email no puede estar vacío";
    }else if (!validateEmail(email)) {
      error_msgs.email = "Este no es un email válido";
    } else if (!isAntispam(email)) {
      error_msgs.email = "El email no puede contener palabras prohibidas";
    }

    if (iban === "" || iban === null) {
      error_msgs.iban = "El IBAN no puede estar vacío";
    } else if(!validateIBAN(iban)){
      error_msgs.iban = "Este no es un IBAN válido, y debe ser de España";
    }

    if (account_holder === "" || account_holder === null) {
      error_msgs.account_holder = "El titular de la cuenta no puede estar vacío";
    } else if (!validateName(account_holder)) {
      error_msgs.account_holder = "El titular de la cuenta no puede contener números o caracteres especiales";
    } else if (!isAntispam(account_holder)) {
      error_msgs.account_holder = "El titular de la cuenta no puede contener palabras prohibidas";
    }

    setErrors(error_msgs);

    if (Object.keys(error_msgs).length === 0) {
      return true;
    } else {
      return false;
    }
  }

    const [partner, setPartner] = useState({
      name: "",
      last_name: "",
      dni: "",
      phone1: "",
      phone2: "",
      birthdate: "",
      sex: "none",
      email: "",
      address: "",
      postal_code: "",
      township: "",
      province: "",
      language: "spanish",
      iban: "",
      account_holder: "",
      state: "Activo",
    });
  
  
    const {
      name,
      last_name,
      dni,
      phone1,
      phone2,
      birthdate,
      sex,
      email,
      address,
      postal_code,
      township,
      province,
      language,
      iban,
      account_holder,
      state,
    } = partner;
  
    const onInputChange = (e) => {
      setPartner({ ...partner, [e.target.name]: e.target.value });
    };
  
    const onSubmit = async (e) => {
      e.preventDefault();
      if (validateForm()) {
        postPartner(partner);
      }
      
    };
  
    return (
      <div className="container my-5 shadow">
        <h1 className="pt-3">Crear socio</h1>
        <Form className="" onSubmit={(e) => onSubmit(e)}>
          <div className="row justify-content-evenly">
            <div className="col-md-5">
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>

                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={name}
                  name="name"
                  placeholder="Nombre del socio"
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
                  placeholder="Apellidos del socio"
                />
              </Form.Group>
              {errors.last_name && (
                    <p className="text-danger">{errors.last_name}</p>
                  )}
              <Form.Group className="mb-3">
                <Form.Label>DNI</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={dni}
                  name="dni"
                  placeholder="DNI del socio. Debe ser único."
                />
              </Form.Group>
              {errors.dni && (
                    <p className="text-danger">{errors.dni}</p>
                  )}
              <Form.Group className="mb-3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={phone1}
                  name="phone1"
                  placeholder="Teléfono del socio. Debe ser único."
                />
              </Form.Group>
                  {errors.phone1 && (
                    <p className="text-danger">{errors.phone1}</p>
                  )}
              <Form.Group className="mb-3">
                <Form.Label>Teléfono adicional</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={phone2}
                  name="phone2"
                  placeholder="Teléfono del socio"
                />
              </Form.Group>
                    {errors.phone2 && (
                      <p className="text-danger">{errors.phone2}</p>
                    )}
              <Form.Group className="mb-3">
                <Form.Label>Género</Form.Label>
                <Form.Select
                  onChange={(e) => onInputChange(e)}
                  value={sex}
                  name="sex"
                >
                  <option value="men">Hombre</option>
                  <option value="women">Mujer</option>
                  <option value="none">No especifica</option>
                </Form.Select>
              </Form.Group>
  
              <Form.Group className="mb-3">
                <Form.Label>Idioma</Form.Label>
                <Form.Select
                  onChange={(e) => onInputChange(e)}
                  value={language}
                  name="language"
                >
                  <option value="spanish">Español</option>
                  <option value="catalan">Catalán</option>
                </Form.Select>
              </Form.Group>
              {errors.language && (
                  <p className="text-danger">{errors.language}</p>
                )}
  
              <Form.Group className="mb-3">
                <Form.Label>Titular de la cuenta</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={account_holder}
                  name="account_holder"
                  placeholder="Titular de la cuenta del socio"
                />
              </Form.Group>
              {errors.account_holder && (
                  <p className="text-danger">{errors.account_holder}</p>
                )}
            </div>
  
            <div className="col-md-5">
              <Form.Group className="mb-3">
                <Form.Label>Fecha de nacimiento</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={birthdate}
                  type="date"
                  name="birthdate"
                />
              </Form.Group>
              {errors.birthdate && (
                  <p className="text-danger">{errors.birthdate}</p>
                )}
              
              <Form.Group className="mb-3">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={address}
                  name="address"
                  placeholder="Dirección del socio"
                />
              </Form.Group>
              {errors.address && (
                  <p className="text-danger">{errors.address}</p>
                )}
  
              <Form.Group className="mb-3">
                <Form.Label>Código postal</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={postal_code}
                  name="postal_code"
                  placeholder="Código postal del socio"
                />
              </Form.Group>
              {errors.postal_code && (
                  <p className="text-danger">{errors.postal_code}</p>
                )}
  
              <Form.Group className="mb-3">
                <Form.Label>Pueblo/Ciudad</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={township}
                  name="township"
                  placeholder="Pueblo/Ciudad del socio"
                />
              </Form.Group>
              {errors.township && (
                  <p className="text-danger">{errors.township}</p>
                )}
  
              <Form.Group className="mb-3">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={email}
                  name="email"
                  placeholder="E-mail del socio. Debe ser único."
                />
              </Form.Group>
              {errors.email && (
                  <p className="text-danger">{errors.email}</p>
                )}
  
              <Form.Group className="mb-3">
                <Form.Label>Provincia</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={province}
                  name="province"
                  placeholder="Provincia del socio"
                />
              </Form.Group>
              {errors.province && (
                  <p className="text-danger">{errors.province}</p>
                )}
  
              <Form.Group className="mb-3">
                <Form.Label>IBAN</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={iban}
                  name="iban"
                  placeholder="Iban del socio. Debe ser único."
                />
              </Form.Group>
              {errors.iban && (
                  <p className="text-danger">{errors.iban}</p>
                )}
  
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  onChange={(e) => onInputChange(e)}
                  value={state}
                  name="state"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>
          {errors.general && (<p className="text-danger">{errors.general}</p>)}
          <div className="row justify-content-evenly">
            <Button className="col mb-4 mx-2" variant="outline-success" type="submit">
              Guardar socio
            </Button>
            <Link
              className="btn btn-outline-danger col mb-4 mx-2"
              to="/admin/partners/"
            >
              Cancelar
            </Link>
          </div>
        </Form>
      </div>
    );
  }

export default CreatePartner;
import React from "react";
import {partners,donations} from "./services/backend.js";
import swal from 'sweetalert';
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import IBAN from 'iban';

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
            swal(successMsg);
            navigate("/partners");
        }).catch((error) => {
          if (error.response) {
            // el servidor respondió con un código de estado diferente de 2xx
            let error_msgs = {};
            error_msgs.error = error.response;
            setErrors(error_msgs);
          } else {
            // error de red u otro error
            console.log(error);
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
    const letterIndex = parseInt(dni.substring(0, 8)) % 23;
    const expectedLetter = letters.charAt(letterIndex);
    const actualLetter = dni.charAt(8).toUpperCase();
    return expectedLetter === actualLetter;
  }

  function validateIBAN(iban) {
    if (IBAN.isValid(iban)) {
      return true;
    } else {
      return false;
    }
  }

  function validateForm() {
    let error_msgs = {};

    if (name === "" || name === null) {
      error_msgs.name = "El nombre no puede estar vacío";
    }

    if (last_name === "" || last_name === null) {
      error_msgs.last_name = "Los apellidos no pueden estar vacío";
    }

    if (dni === "" || dni === null) {
      error_msgs.dni = "El DNI no puede estar vacío";
    } else if (!validateDNI(dni)) {
      error_msgs.dni = "Este no es un DNI válido";
    }

    if (phone1 === "" || phone1 === null) {
      error_msgs.phone1 = "El teléfono no puede estar vacío";
    }

    if (birthdate === "" || birthdate === null) {
      error_msgs.birthdate = "El cumpleaños no puede estar vacío";
    }

    if (address === "" || address === null) {
      error_msgs.address = "La dirección no puede estar vacía";
    }

    if (postal_code === "" || postal_code === null) {
      error_msgs.postal_code = "El código postal no puede estar vacío";
    }

    if (township === "" || township === null) {
      error_msgs.township = "La ciudad no puede estar vacía";
    }

    if (province === "" || province === null) {
      error_msgs.province = "La provincia no puede estar vacía";
    }
    
    if (email === "" || email === null) {
      error_msgs.email = "El email no puede estar vacío";
    }else if (!validateEmail(email)) {
      error_msgs.email = "Este no es un email válido";
    }

    if (iban === "" || iban === null) {
      error_msgs.iban = "El IBAN no puede estar vacío";
    } else if(!validateIBAN(iban)){
      error_msgs.iban = "Este no es un IBAN válido";
    }

    if (account_holder === "" || account_holder === null) {
      error_msgs.account_holder = "El titular de la cuenta no puede estar vacío";
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
      state: "active",
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
        const formData = new FormData();
        formData.append("name", name);
        formData.append("last_name", last_name);
        formData.append("dni", dni);
        formData.append("phone1", phone1);

        postPartner(partner);
      }
      
    };
  
    return (
      <div className="container my-5 shadow">
        <h1 className="pt-3">Crear socio</h1>
        {errors.error && (<p className="text-danger">{errors.error}</p>)}
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
                  placeholder="DNI del socio"
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
                  placeholder="Teléfono del socio"
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
                  placeholder="E-mail del socio"
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
                <Form.Label>Iban</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={iban}
                  name="iban"
                  placeholder="Iban del socio"
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
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>
  
          <div className="row justify-content-evenly">
            <Button className="col mb-4 mx-5" variant="outline-success" type="submit">
              Guardar socio
            </Button>
          </div>
        </Form>
      </div>
    );
  }

export default CreatePartner;
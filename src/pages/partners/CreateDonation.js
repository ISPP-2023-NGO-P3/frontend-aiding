import React from "react";
import {partners} from "./services/backend.js";
import swal from 'sweetalert';
import { useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";


const successMsg = {
  title: "Mensaje de confirmación",
  text: "Te confirmamos que la donación se ha creado correctamente",
  icon: "success",
  button: "Aceptar",
  timer: "5000",
}

const errorMsg = {
  title: "Mensaje de error",
  text: "Se ha producido un error al crear la donación",
  icon: "error",
  button: "Aceptar",
  timer: "5000",
}

function CreateDonation() {
    let navigate = useNavigate();

    const { id } = useParams();

    function postDonation(){
        const aux = partners.post(`/${id}/donation`,donation).then((response) => {
            console.log(response);
            swal(successMsg);
            navigate(`/admin/partners/${id}`);
        }).catch((error) => {
          if (error.response && error.response.status === 400) {
            let error_msgs = {general: "Actualmente el socio esta inactivo. Para crear una donación debe estar activo."};
            setErrors(error_msgs);
          }else {
            swal(errorMsg);
          }
        });
    };
    
    const [errors, setErrors] = useState({});


    const [donation, setDonation] = useState({
      amount: "",
      periodicity: "MENSUAL",
    });

    const {
      amount,
      periodicity,
    } = donation;
  
    const onInputChange = (e) => {
      setDonation({ ...donation, [e.target.name]: e.target.value });
    };

    function validarCampoNumerico(valor) {
      const regex = /^[0-9]*$/;
      return regex.test(valor);
    }

    function validateForm() {
      let error_msgs = {};
  
      if (amount === "" || amount === null) {
        error_msgs.amount = "La cantidad no puede estar vacía";
      } else if (amount <= 0) {
        error_msgs.amount = "La cantidad debe ser mayor que 0";
      } else if (!validarCampoNumerico(amount)) {
        error_msgs.amount = "La cantidad debe ser un número";
      }

      if (periodicity === "" || periodicity === null) {
        error_msgs.periodicity = "La periodicidad no puede estar vacía";
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
        const formData = new FormData(); 
        formData.append("amount", amount);
        formData.append("periodicity", periodicity);
        postDonation(FormData);
      }
    };
  
    function handleClickReturn(){
      navigate(`/admin/partners/${id}`);
    }

    return (
      <div className="container my-5 shadow">
        <h1 className="pt-3">Crear donación</h1>
        <Form className="" onSubmit={(e) => onSubmit(e)}>
          <div className="row justify-content-evenly">
            <div className="col-md-6">

              <Form.Group className="mb-3">
                <Form.Label>Periodicidad</Form.Label>
                <Form.Select
                  onChange={(e) => onInputChange(e)}
                  value={periodicity}
                  name="periodicity">
                  <option value="MENSUAL">Mensual</option>
                  <option value="TRIMESTRAL">Trimestral</option>
                  <option value="SEMESTRAL">Semestral</option>
                  <option value="ANUAL">Anual</option>
                </Form.Select>
                {errors.periodicity && (<p className="text-danger">{errors.periodicity}</p>)}
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={amount}
                  name="amount"
                />
                {errors.amount && (<p className="text-danger">{errors.amount}</p>)}
              </Form.Group>
            </div>
          </div>
  
          <div className="row justify-content-evenly">
          {errors.general && (<p className="text-danger">{errors.general}</p>)}
            <Button className="col mb-4 mx-5" variant="outline-success" type="submit">
              Crear donación
            </Button>
            <Button className="col mb-4 mx-2" variant="outline-danger" onClick={()=> handleClickReturn() }>
              Cancelar
            </Button>
          </div>
        </Form>
      </div>
    );
  }

export default CreateDonation;
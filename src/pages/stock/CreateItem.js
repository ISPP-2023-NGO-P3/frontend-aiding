import React from "react";
import { items, tiposBE } from "./services/backend.js";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import { isAntispam } from "../../components/AntiSpam.js";

const successMsg = {
  title: "Mensaje de confirmación",
  text: "Te confirmamos que el item se ha creado correctamente",
  icon: "success",
  button: "Aceptar",
  timer: "5000",
};

const errorMsg = {
  title: "Mensaje de error",
  text: "Se ha producido un error al crear el item",
  icon: "error",
  button: "Aceptar",
  timer: "5000",
};

function CreateItem() {
  let navigate = useNavigate();

  function postItem(item) {
    const aux = items
      .post("", item)
      .then((response) => {
        console.log(response);
        console.log(item);
        swal(successMsg);
        navigate("/admin/stock/items");
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          let error_msgs = { general: "Ya existe un item con ese nombre" };
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

  function validateForm() {
    let error_msgs = {};

    if (name === "" || name === null) {
      error_msgs.name = "El nombre no puede estar vacío";
    } else if (name.length > 100) {
      error_msgs.name = "El nombre no puede tener más de 100 caracteres";
    } else if (!validateName(name)) {
      error_msgs.name = "El nombre no puede contener números";
    } else if (!isAntispam(name)) {
      error_msgs.name = "El nombre no puede contener spam";
    }

    if (description === "" || description === null) {
      error_msgs.description = "La descripción no puede estar vacía";
    } else if (description.length > 150) {
      error_msgs.description = "La descripción no puede tener más de 150 caracteres";
    } else if (!isAntispam(description)) {
      error_msgs.description = "La descripción no puede contener spam";
    }

    if (quantity === "" || quantity === null) {
      error_msgs.quantity = "La cantidad no puede estar vacía";
    } else if (quantity < 0) {
      error_msgs.quantity = "La cantidad no puede ser negativa";
    }

    if (type_id === "" || type_id === null) {
      error_msgs.type_id = "El tipo no puede estar vacío";
    }

    setErrors(error_msgs);

    if (Object.keys(error_msgs).length === 0) {
      return true;
    } else {
      return false;
    }
  }

  const [item, setItem] = useState({
    name: "",
    description: "",
    quantity: "",
    type_id: "",
  });

  //constante de la clave ajena
  const [type, setType] = useState([
    {
      id: "",
      name: "",
    },
  ]);

  function getTipos() {
    tiposBE
      .get("")
      .then((response) => {
        setType(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getTipos();
  }, []);

  const { name, description, quantity, type_id } = item;

  const onInputChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      postItem(item);
    }
  };

  return (
    <div className="container my-5 shadow">
      <h1 className="pt-3">Crear item</h1>
      <Form className="" onSubmit={(e) => onSubmit(e)}>
        <div className="row justify-content-evenly">
          <div className="col-md-5">
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>

              <Form.Control
                onChange={(e) => onInputChange(e)}
                value={name}
                name="name"
                placeholder="Nombre del item"
              />
            </Form.Group>
            {errors.name && <p className="text-danger">{errors.name}</p>}
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                onChange={(e) => onInputChange(e)}
                value={description}
                name="description"
                placeholder="Descripción del item"
              />
            </Form.Group>
            {errors.description && (
              <p className="text-danger">{errors.description}</p>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                onChange={(e) => onInputChange(e)}
                value={quantity}
                type="number"
                name="quantity"
                placeholder="Cantidad del item"
              />
            </Form.Group>
            {errors.quantity && (
              <p className="text-danger">{errors.quantity}</p>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                onChange={(e) => onInputChange(e)}
                value={type_id}
                name="type_id"
              >
                <option value=""></option>
                {type.map((t) => (
                  <option value={t.id}>{t.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            {errors.type_id && (
              <p className="text-danger">{errors.type_id}</p>
            )}
          </div>
        </div>
        {errors.general && <p className="text-danger">{errors.general}</p>}
        <div className="row justify-content-evenly">
          <Button
            className="col mb-4 mx-5"
            variant="outline-success"
            type="submit"
          >
            Guardar item
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default CreateItem;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { base, rolesBE } from "./services/backend.js";
import swal from "sweetalert";
import { isAntispam } from "../../components/AntiSpam.js";

const successMsg = {
  title: "Mensaje de confirmación",
  text: "El usuario se ha actualizado correctamente",
  icon: "success",
  button: "Aceptar",
  timer: "5000",
};

const errorMsg = {
  title: "Mensaje de error",
  text: "Se ha producido un error al actualizar el usuario",
  icon: "error",
  button: "Aceptar",
  timer: "5000",
};

const incorrectPasswordMsg = {
  title: "La contraseña introducida no es correcta",
  text: "Por favor introduzca la contraseña actual del usuario para poder modificarlo",
  icon: "error",
  button: "Aceptar",
  timer: "5000",
};

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    password: "",
    new_password: "",
    is_admin: "",
    roles_id: "",
  });

  const [roles, setRoles] = useState([
    {
      id: "",
      name: "",
    },
  ]);

  const { username, password, new_password, is_admin, roles_id } = user;

  function getRoles() {
    rolesBE
      .get("")
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    const fetchUser = async () => {
      const response = await base.get(`users/${id}`);
      setUser(response.data);
    };
    fetchUser();
    getRoles();
  }, [id]);

  const onInputChange = (e) => {
    if (e.target.name === "is_admin") {
      setUser({ ...user, [e.target.name]: e.target.checked });
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  /* Validator */
  const [errors, setErrors] = useState({});

  function validateForm() {
    let error_msgs = {};

    if (username === "" || username === null) {
      error_msgs.username = "El nombre de usuario no puede estar vacío";
    } else if (!isAntispam(username)) {
      error_msgs.username =
        "El nombre de usuario no puede contener palabras prohibidas";
    } else if (username.length > 100) {
      error_msgs.username =
        "El nombre de usuario no puede contener más de 100 caracteres";
    }

    if (password === "" || password === null) {
      error_msgs.password = "La contraseña no puede estar vacía";
    } else if (password.length > 100) {
      error_msgs.password =
        "La contraseña no puede contener más de 100 caracteres";
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
      await base
        .put(`/users/${id}`, user)
        .then((res) => {
          swal(successMsg);
          navigate("/admin/base/users");
        })
        .catch((error) => {
          if (error.response.status === 404) {
            swal(incorrectPasswordMsg);
          }
        });
    }
  };

  return (
    <div className="container my-5 shadow">
      <h1 className="pt-3">Editar usuario</h1>

      <Form className="" onSubmit={onSubmit}>
        <div className="row justify-content-evenly">
          <div className="col-md-12">
            <Form.Group className="mb-12">
              <Form.Label>Nombre de usuario:</Form.Label>
              <Form.Control
                onChange={onInputChange}
                value={username}
                name="username"
                placeholder="Nombre del usuario"
              />
            </Form.Group>

            {errors.username && (
              <p className="text-danger">{errors.username}</p>
            )}

            <Form.Group className="mb-12">
              <Form.Label>Contraseña actual</Form.Label>
              <Form.Control
                onChange={onInputChange}
                type="password"
                name="password"
                placeholder="Debe introducir su actual contraseña para confirmar cualquier cambio"
              />
            </Form.Group>

            <Form.Group className="mb-12">
              <Form.Label>Nueva Contraseña</Form.Label>
              <Form.Control
                onChange={onInputChange}
                type="password"
                name="new_password"
                placeholder="Introduzca su nueva contraseña si desea modificarla"
              />
            </Form.Group>

            {errors.password && (
                    <p className="text-danger">{errors.password}</p>
                  )}

              <Form.Group className="mb-12">
                <Form.Label>Administrador</Form.Label>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  name="is_admin"
                  checked={is_admin}
                  onChange={(e) => onInputChange(e)}
                />
              </Form.Group>
             {/*  <Form.Group className="mb-3">
              <p className="text-danger">{errors.password}</p>
            )}

            <Form.Group className="mb-12">
              <Form.Label>Administrador</Form.Label>
              <Form.Check
                type="switch"
                id="custom-switch"
                name="is_admin"
                checked={is_admin}
                onChange={(e) => onInputChange(e)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Roles</Form.Label>
              <Form.Select
                onChange={(e) => onInputChange(e)}
                value={roles_id}
                name="roles_id"
              >
                <option value=""></option>
                {roles.map((rol) => (
                  <option value={rol.id}>{rol.name}</option>
                ))}
              </Form.Select>
            </Form.Group>*/}
          </div>
        </div>

        <div className="row justify-content-evenly">
          <Button
            className="col mb-4 mx-2"
            variant="outline-success"
            type="submit"
          >
            Guardar cambios
          </Button>
          <Link
            className="btn btn-outline-danger col mb-4 mx-2"
            to="/admin/base/users"
          >
            Cancelar
          </Link>
        </div>
      </Form>
    </div>
  );
}

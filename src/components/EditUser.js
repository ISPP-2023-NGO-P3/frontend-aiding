import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EditUser() {
  let navigate = useNavigate();

  const { id } = useParams();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    nif: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    role: "",
  });

  const { firstName, lastName, nif, phone, email, username, password, role } =
    user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    loadUser();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await axios.put(
      `https://pruebamysql.pythonanywhere.com/persons/${id}`,
      user
    );
    navigate("/");
  };

  const loadUser = async () => {
    const result = await axios.get(
      `https://pruebamysql.pythonanywhere.com/persons/${id}`
    );
    setUser(result.data);
  };

  return (
    <div className="container">
      <form onSubmit={(e) => onSubmit(e)}>
        <label>
          Nombre:
          <input
            type={"text"}
            className="form-control"
            placeholder="Introduzca su nombre"
            name="firstName"
            value={firstName} //Value = Mismo que en base de datos
            onChange={(e) => onInputChange(e)}
            required="true"
          />
        </label>
        <label>
          Apellidos:
          <input
            type={"text"}
            className="form-control"
            placeholder="Introduzca sus apellidos"
            name="lastName"
            value={lastName}
            onChange={(e) => onInputChange(e)}
            required="true"
          />
        </label>
        <label>
          NIF:
          <input
            type={"text"}
            pattern="(([X-Z]{1})([-]?)(\d{7})([-]?)([A-Z]{1}))|((\d{8})([-]?)([A-Z]{1}))"
            className="form-control"
            placeholder="Introduzca su NIF"
            name="nif"
            value={nif}
            onChange={(e) => onInputChange(e)}
            required="true"
          />
        </label>
        <label>
          Teléfono:
          <input
            type="tel"
            className="form-control"
            placeholder="Introduzca su teléfono"
            name="phone"
            value={phone}
            onChange={(e) => onInputChange(e)}
            required="true"
          />
        </label>
        <label>
          Correo electrónico:
          <input
            type="email"
            className="form-control"
            placeholder="Introduzca su correo electrónico"
            name="email"
            value={email}
            onChange={(e) => onInputChange(e)}
            s
            required="true"
          />
        </label>
        <label>
          Nombre de usuario:
          <input
            type="text"
            className="form-control"
            placeholder="Introduzca su nombre de usuario"
            name="username"
            value={username}
            onChange={(e) => onInputChange(e)}
            required="true"
          />
        </label>
        <label>
          Contraseña:
          <input
            type="password"
            className="form-control"
            placeholder="intruduzca su contraseña"
            name="password"
            value={password}
            onChange={(e) => onInputChange(e)}
            required="true"
          />
        </label>
        <label>
          Rol:
          <select value={role} onChange={(e) => onInputChange(e)}>
            <option value="">Seleccione un rol</option>
            <option value="admin">Administrador</option>
            <option value="user">Usuario</option>
          </select>
        </label>
        <button type="submit" className="btn btn-outline-primary">
          Guardar cambios
        </button>
        <Link
          className="btn btn-outline-danger mx-2"
          to={`/viewuser/${user.id}`}
        >
          Cancelar
        </Link>
      </form>
    </div>
  );
}

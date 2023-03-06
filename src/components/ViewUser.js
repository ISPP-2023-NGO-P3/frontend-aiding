import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function ViewUser() {
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

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const result = await axios.get(
      `http://127.0.0.1:8000/base/${id}`
    );
    setUser(result.data);
  };

  let navigate = useNavigate();

  const deleteUser = async (id) => {
    await axios.delete(`https://pruebamysql.pythonanywhere.com/persons/${id}`);
    navigate("/");
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          Detalles del usuario : {user.id}
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <b>Nombre: </b>
              {user.firstName}
            </li>
            <li className="list-group-item">
              <b>Apellidos: </b>
              {user.lastName}
            </li>
            <li className="list-group-item">
              <b>NIF: </b>
              {user.nif}
            </li>
            <li className="list-group-item">
              <b>Teléfono: </b>
              {user.phone}
            </li>
            <li className="list-group-item">
              <b>Email: </b>
              {user.email}
            </li>
            <li className="list-group-item">
              <b>Usuario: </b>
              {user.username}
            </li>
            <li className="list-group-item">
              <b>Contraseña: </b>
              {user.password}
            </li>
          </ul>
        </div>
        <Link className="btn btn-primary my-2" to={"/"}>
          Volver
        </Link>
        <Link
          className="btn btn-outline-primary mx-2"
          to={`/edituser/${user.id}`}
        >
          Edit
        </Link>
        <button
          className="btn btn-danger mx-2"
          onClick={() => {
            deleteUser();
          }}
        >
          Eliminar usuario
        </button>
      </div>
    </div>
  );
}

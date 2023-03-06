import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { Link } from "react-router-dom";


export default function Login() {
  let navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState(null);

  const { username, password } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/base/login/", user);
      if (response.status === 200) {
        navigate(`/viewuser/${user.id}`);
      }
    } catch (error) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div>
      <form onSubmit={(e) => onSubmit(e)}>
        <label>
          
          <input placeholder="Usuario"
            type="text"
            value={username}
            onChange={(e) => onInputChange(e)}
            name="username"
            required="true"
          />
        </label>
        <label>
          
          <input placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => onInputChange(e)}
            name="password"
            required="true"
          />
        </label>
        <button type="submit">Iniciar sesión</button>
        <a>¿Ha olvidado su contraseña?</a>
        {error && <p className="error">{error}</p>}
        <a>
          Contacte con atención al cliente mediantes este correo:
          AidingSevilla@outlook.es
        </a>
      </form>
      <Link className="btn btn-outline-light" to="/createuser">
            Add User
          </Link>
    </div>
  );
}

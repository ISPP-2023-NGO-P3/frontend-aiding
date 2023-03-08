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

  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const { username, password } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    if (e.target.name === 'username' && !e.target.value) {
      setUsernameError(true);
    } else if (e.target.name === 'password' && e.target.value.length < 6) {
      setPasswordError(true);
    } else {
      setUsernameError(false);
      setPasswordError(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!username || password.length < 6) {
      return;
    }
    try {
      const res = await axios.post("http://127.0.0.1:8000/base/login/", user);
      if (res.status === 200) {
        navigate(`/viewuser/${res.data.id}`);
      }
    } catch (err) {
      alert("El usuario o la contraseña son incorrectos");
    }
  };

  return (
    <div>
      <form onSubmit={(e) => onSubmit(e)}>
        <label>
          <input
            placeholder="Usuario"
            type="text"
            value={username}
            onChange={(e) => onInputChange(e)}
            name="username"
            required="true"
            className={usernameError ? 'input-error' : ''}
          />
          {usernameError && <span className="error-message">Este campo es obligatorio</span>}
        </label>
        <label>
          <input
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => onInputChange(e)}
            name="password"
            required="true"
            className={passwordError ? 'input-error' : ''}
          />
          {passwordError && <span cla ssName="error-message">La contraseña debe tener al menos 6 caracteres</span>}
        </label>
        <button type="submit">Iniciar sesión</button>
        <a>¿Ha olvidado su contraseña?</a>
        <a>
          Contacte con atención al cliente mediantes este correo:
          AidingSevilla@outlook.es
        </a>
      </form>
      <Link className="btn btn-outline-light" to="/createuser">
        Crear Usuario
      </Link>
    </div>
  );
}

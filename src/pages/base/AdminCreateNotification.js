import React, { useEffect } from "react";
import { notifications } from "./services/backend.js";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNotificationContext } from "../../components/notificationContext.js";

const successMsg = {
  title: "Mensaje de confirmación",
  text: "Te confirmamos que la notificación se ha enviado correctamente",
  icon: "success",
  button: "Aceptar",
  timer: "5000",
};

const errorMsg = {
  title: "Mensaje de error",
  text: "Se ha producido un error al enviar la notificación.",
  icon: "error",
  button: "Aceptar",
  timer: "5000",
};

function AdminCreateNotification() {
  let navigate = useNavigate();

  function postNotification(notification) {
    const error_msgs = {};
    notifications
      .post("", notification, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        swal(successMsg);
        navigate("/");
      })
      .catch((error) => {
        if (error.response) {
          // el servidor respondió con un código de estado diferente de 2xx
          error_msgs.error = error.response.data.message;
          setErrors(error_msgs);
          swal(errorMsg)
        } else {
          // error de red u otro error
          console.log(error);
          swal(errorMsg);
        }
      });
  }

  /* Validator */
  const [errors, setErrors] = useState({});

  function validateEmails(emails) {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const invalidEmails = emails
      .split(/[,;: ]/)
      .map((email) => email.trim())
      .filter((email) => emailRegex.test(email) === false);

    return invalidEmails.length <= 0;
  }

  function validateForm() {
    let error_msgs = {};

    if (recipients === "") {
      error_msgs.recipients = "Ingrese, al menos, un correo electrónico";
    } else if (recipients !== "" && !validateEmails(recipients)) {
      error_msgs.recipients = "Algunos correos electrónicos no son válidos";
    }
    if (message === "" || message === null) {
      error_msgs.message = "El mensaje no puede estar vacío";
    }

    if (subject === "" || subject === null) {
      error_msgs.subject = "El asunto no puede estar vacío";
    }
    
    setErrors(error_msgs);

    return Object.keys(error_msgs).length === 0;
  }
  const location = useLocation();
  const initialRecipients = location.state?.initialRecipients || [];

  const [notification, setNotification] = useState({
    subject: "",
    message: "",
    recipients: initialRecipients.join(", "),
    file: null,
  });

  const { subject, message, recipients, file } = notification;

  const onInputChange = (e) => {
    setNotification({ ...notification, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("message", message);
      formData.append("recipients", recipients);
      if (file) {
        formData.append("file", file);
      }

      postNotification(formData);
      navigate("/");
    }
  };

  /* NOTIFY PARTNERS / VOLUNTEERS */
  const { emails, setFilteredEmails } = useNotificationContext();
  const [emailsToNotify, setEmailsToNotify] = useState("");

  useEffect(() => {
    setNotification({ ...notification, recipients: emails });
    setEmailsToNotify(emails);
    setFilteredEmails("");
  }, []);

  return (
    <>
      {emailsToNotify.length > 0 && (
        <div class="alert alert-primary" role="alert">
          Se han seleccionado {emailsToNotify.split(" ").length} correos
          electrónicos.
        </div>
      )}

      <div className="container my-5 shadow">
        <h1 className="pt-3">Notificación</h1>
        {errors.error && <p className="text-danger">{errors.error}</p>}
        <Form className="" onSubmit={(e) => onSubmit(e)}>
          <div className="row justify-content-evenly">
            <div className="col-md-5">
              <Form.Group className="mb-3">
                <Form.Label>Asunto</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={subject}
                  name="subject"
                  placeholder="Asunto"
                />
                {errors.subject && <p className="text-danger">{errors.subject}</p>}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Receptores</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={recipients}
                  name="recipients"
                  placeholder="Agregue direcciones de receptores separados por espacios"
                />
                {errors.recipients && (
                  <p className="text-danger">{errors.recipients}</p>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mensaje</Form.Label>
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={message}
                  name="message"
                  as="textarea"
                  rows={3}
                  placeholder="Escribe aquí tu mensaje"
                />
                {errors.message && (
                  <p className="text-danger">{errors.message}</p>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Adjuntar archivo</Form.Label>
                <Form.Control
                  type="file"
                  name="file"
                  onChange={(e) =>
                    setNotification({
                      ...notification,
                      file: e.target.files[0],
                    })
                  }
                />
              </Form.Group>
            </div>
          </div>

          <div className="row justify-content-evenly">
            <Button className="col mb-4 mx-5" variant="primary" type="submit">
              Enviar mensaje
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}
export default AdminCreateNotification;

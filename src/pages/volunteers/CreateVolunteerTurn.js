import React from "react";
import { useState, useEffect } from "react";
import { volunteers } from "./services/backend.js";
import swal from "sweetalert";
import { useParams, useNavigate, Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const successMsg = {
  title: "Mensaje de confirmación",
  text: "El voluntario se ha asignado correctamente",
  icon: "success",
  button: "Aceptar",
  timer: "5000",
};

const errorMsg = {
  title: "Mensaje de error",
  text: "El voluntario no se ha podido asignar correctamente porque está inactivo",
  icon: "error",
  button: "Aceptar",
  timer: "5000",
};

function CreateVolunteerTurn() {
  let navigate = useNavigate();

  function postVolunteerTurn(volunteerTurn) {
    const aux = volunteers
      .post("volunteerTurns/", volunteerTurn)
      .then((response) => {
        console.log(response);
        swal(successMsg);
        navigate("/roles/volunteers/turns/" + id + "/draft");
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          let error_msgs = {
            general: "Este voluntario ya está asignado al turno",
          };
          setErrors(error_msgs);
        } else {
          swal(errorMsg);
        }
      });
  }

  /* Validator */
  const [errors, setErrors] = useState({});

  const { id } = useParams();

  function validateForm() {
    let error_msgs = {};

    if (volunteer_id === "" || volunteer_id === null) {
      error_msgs.name = "Debe seleccionar algún voluntario";
    }

    setErrors(error_msgs);

    if (Object.keys(error_msgs).length === 0) {
      return true;
    } else {
      return false;
    }
  }

  const [formData, setFormData] = useState({
    volunteer_id: "",
    turn_id: id,
    volunteerList: [],
  });

  const { volunteer_id, turn, volunteerList } = formData;

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    volunteers.get().then((response) => {
      setFormData({ ...formData, volunteerList: response.data });
    });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const selectedVolunteer = volunteerList.map((volunteer) => {
        if (volunteer.id === parseInt(volunteer_id)) {
          return volunteer;
        }
      }
      );
      if (selectedVolunteer && selectedVolunteer.state !== "Inactivo") {
        postVolunteerTurn(formData);
      } else {
        swal({
          title: "Usuario inactivo",
          text: "No se puede asignar porque el voluntario está inactivo",
          icon: "error",
          button: "Aceptar",
          timer: "5000",
        });
      }
    }
  };  

  return (
    <div className="container my-5 shadow">
      <h1 className="pt-3">Asignar voluntario</h1>
      <Form className="" onSubmit={(e) => onSubmit(e)}>
        <div className="row justify-content-evenly">
          <div className="col-md-5">
            <Form.Group className="mb-3">
              <Form.Control
                as="select"
                onChange={(e) => onInputChange(e)}
                value={volunteer_id}
                name="volunteer_id"
              >
                <option value="">Seleccione el voluntario</option>
                {volunteerList.map((volunteer) => (
                  <option key={volunteer.id} value={volunteer.id}>
                    {volunteer.name} {volunteer.last_name}, {volunteer.rol}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            {errors.name && (
              <p className="text-danger">{errors.name}</p>
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
            Asignar voluntario
          </Button>
          <Link
            className="btn btn-outline-danger col mb-4 mx-2"
            to={`/roles/volunteers/turns/${id}/draft`}
          >
            Cancelar
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default CreateVolunteerTurn;

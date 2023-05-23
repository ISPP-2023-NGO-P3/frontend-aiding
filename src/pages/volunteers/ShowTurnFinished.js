import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
} from "mdb-react-ui-kit";
import {volunteers} from "./services/backend.js";
import swal from "sweetalert";
import { Button} from "react-bootstrap";
import { Table } from 'antd';

const onChange = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};

const successMsgDelete = {
  title: "Mensaje de confirmación",
  text: "El turno se ha borrado correctamente",
  icon: "success",
  button: "Aceptar",
  timer: "5000",
};

const errorMsgDelete = {
  title: "Mensaje de error",
  text: "Se ha producido un error al borrar el turno",
  icon: "error",
  button: "Aceptar",
  timer: "5000",
};

const successMsgFinish = {
  title: "Mensaje de confirmación",
  text: "El turno se ha quitado de modo borrador correctamente",
  icon: "success",
  button: "Aceptar",
  timer: "5000",
};

const errorMsgFinish = {
  title: "Mensaje de error",
  text: "Se ha producido un error al quitar el modo borrador del turno",
  icon: "error",
  button: "Aceptar",
  timer: "5000",
};

const errorMsgDeleteVolunteer = {
  title: "Mensaje de error",
  text: "Se ha producido un error al quitar el voluntario del turno",
  icon: "error",
  button: "Aceptar",
  timer: "5000",
};

export default function Details() {
  let navigate = useNavigate();

  const [turn, setTurn] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  const { id } = useParams();

  useEffect(() => {
    loadTurn();
  }, []);

  const loadTurn = async () => {
    const result = await volunteers.get(`turns/${id}/`);
    setTurn(result.data);
  };

  const deleteConfirmationAlert = async () => {
    swal({
      title: "Eliminar turno",
      text: "¿Estás seguro que desea eliminar el turno?",
      icon: "warning",
      buttons: ["No", "Sí"],
    }).then((res) => {
      if (res) {
        deleteTurn();
      }
    });
  };

  const finishDraftConfirmationAlert = async () => {
    swal({
      title: "Completar turno",
      text: "¿Estás seguro que desea completar el borrador del turno?",
      icon: "warning",
      buttons: ["No", "Sí"],
    }).then((res) => {
      if (res) {
        finishDraftTurn();
      }
    });
  };

  const deleteTurn = async () => {
    const result = await volunteers
      .delete(`/turns/${id}`)
      .then((res) => {
        swal(successMsgDelete);
        navigate("/roles/volunteers/turns");
      })
      .catch((err) => {
        swal(errorMsgDelete);
      });
  };

  const finishDraftTurn = async () => {
    const result = await volunteers
      .put(`/turns/${id}/draft`)
      .then((res) => {
        swal(successMsgFinish);
        navigate("/roles/volunteers/turns");
      })
      .catch((err) => {
        swal(errorMsgFinish);
      });
  };

  const deleteVolunteerConfirmationAlert = async (volunteerTurn) => {
    swal({
      title: "Quitar voluntario",
      text: "¿Estás seguro que desea quitar el voluntario del turno?",
      icon: "warning",
      buttons: ["No", "Sí"],
    }).then((res) => {
      if (res) {
        deleteVolunteerTurn(volunteerTurn);
      }
    });
  };

  const deleteVolunteerTurn = async (volunteerTurn) => {
    const result = await volunteers
      .delete(`/volunteerTurns/${volunteerTurn}`)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        swal(errorMsgDeleteVolunteer);
      });
  };

  const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
      const [value, setValue] = useState('');
      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
              (child) =>
                !value || child.props.children.toLowerCase().startsWith(value),
            )}
          </ul>
        </div>
      );
    },
  );

  const columnsDraft = [
    {
      title: 'ID del Voluntario',
      dataIndex: 'id',
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
    },
    {
      title: 'Apellidos',
      dataIndex: 'last_name',
    },
    {
      title: 'NIF',
      dataIndex: 'nif',
    },
    {
      title: 'Rol',
      dataIndex: 'rol',
    },
  ];

  const [volunteers_data, setVolunteersData] = React.useState([
    {
      num_volunteer: '...',
      nif: '...',
      name: '...',
      last_name: '...',
      rol: '...',
    }
  ]);

  useEffect(() => {
    volunteers.get(`/turns/${id}/volunteers`).then((response) => {
      const promises = response.data.volunteerTurn.map((volunteerTurn) => {
        return volunteers.get(`${volunteerTurn.volunteer_id}`).then((volunteerResponse) => {
          const data = volunteerResponse.data;
          const updatedData = Object.assign({}, data, {volunteerTurn: volunteerTurn.id})
          return updatedData;
        })
      })

      Promise.all(promises).then((volunteerData) => {
        setVolunteersData(volunteerData);
      })
    });
  }, []);

    return(
      <section>
      <MDBContainer className="py-5">
      <MDBCol lg="1">
        <Button  onClick={()=> navigate(`/roles/volunteers/turns`) } type="button" id="button" className="btn btn-light w-100">
          Volver
        </Button>
      </MDBCol>
        <center>
          <h2>
          Turno
          </h2>
        </center>
        <MDBRow>
          <MDBCol style={{paddingLeft: "30px"}}>
            <MDBCard style={{width: "600px", paddingTop: "17px", paddingBottom: "17px"}}>
                <MDBRow>
                <MDBCol sm="3">
                  <MDBCardText>Título</MDBCardText>
                </MDBCol>
                <MDBCol sm="9">
                  <MDBCardText className="text-muted">
                    {turn.title}
                  </MDBCardText>
                </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                <MDBCol sm="3">
                  <MDBCardText>Fecha</MDBCardText>
                </MDBCol>
                <MDBCol sm="9">
                  <MDBCardText className="text-muted">
                    {turn.date}
                  </MDBCardText>
                </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                <MDBCol sm="3">
                  <MDBCardText>Hora de Inicio</MDBCardText>
                </MDBCol>
                <MDBCol sm="9">
                  <MDBCardText className="text-muted">
                    {turn.startTime}
                  </MDBCardText>
                </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                <MDBCol sm="3">
                  <MDBCardText>Finalización</MDBCardText>
                </MDBCol>
                <MDBCol sm="9">
                  <MDBCardText className="text-muted">
                    {turn.endTime}
                  </MDBCardText>
                </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                <MDBCol sm="3">
                  <MDBCardText>Estado</MDBCardText>
                </MDBCol>
                <MDBCol sm="9">
                  <MDBCardText className="text-muted">
                    {turn.draft ? "Terminado" : "Borrador  "}
                  </MDBCardText>
                </MDBCol>
                </MDBRow>
            </MDBCard>
          </MDBCol>
          <MDBCol style={{paddingLeft: "30px"}}>
            <MDBCard style={{width: "600px"}}>
              <MDBCol style={{paddingTop: "5px", paddingBottom: "5px"}}>
                <MDBCardText className="text-muted w-auto">
                  <Button
                    onClick={() => {
                    deleteConfirmationAlert();
                    }}
                    type="button"
                    className="btn btn-danger w-75"
                    >
                      Borrar
                    </Button>
                  </MDBCardText>
              </MDBCol>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        <hr />
        <div className='container my-5'>
          <h2 className="pt-3">Voluntarios asignados</h2>
          <br></br>
          <Table id='table'
          columns={columnsDraft} dataSource={volunteers_data} onChange={onChange} scroll={{y: 400,}} pagination={{pageSize: 20,}}/>
        </div>
      </MDBContainer>
    </section>
    )
}
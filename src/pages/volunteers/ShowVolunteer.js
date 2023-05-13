import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
} from "mdb-react-ui-kit";
import {volunteers} from "./services/backend.js";
import { Button} from "react-bootstrap";
import { Badge, Tag } from 'antd';

export default function Details() {
  let navigate = useNavigate();

  /**Establecer usuario */
  const [user, setUser] = useState({
    name: "",
    last_name: "",
    id: "",
    nif: "",
    place: "",
    phone: "",
    email: "",
    state: "",
    situation: "",
    rol: "",
    observations:"",
    computerKnowledge:"",
    truckKnowledge:"",
    warehouseKnowledge:"",
    otherKnowledge:"",
    postal_code:"",
  });

  const { id } = useParams();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const result = await volunteers.get(`/${id}`);
    setUser(result.data);
  };
  
  
  // FORMATEADOR DE LOS ENUMERADOS
  function volunteerFormatter(value) {
    var formattedValue = value;
    switch (value) {
      case "necesitaFormacion":
        formattedValue = "Necesita formación";
        return `${formattedValue}`;
      case "necesitaComplemento":
        formattedValue = "Necesita complemento";
        return `${formattedValue}`;
      case "posibleSupervisor":
        formattedValue = "Posible supervisor";
        return `${formattedValue}`;
      case "posibleCapitan":
        formattedValue = "Posible capitán";
        return `${formattedValue}`;
      case "posibleEncargadoEstructura":
        formattedValue = "Posible encargado de estructura";
        return `${formattedValue}`;
      case "Ok":
        formattedValue = "Ok";
        return `${formattedValue}`;
      case "Capitan":
        formattedValue = "Capitán";
        return `${formattedValue}`;
      default:
        formattedValue= value.charAt(0).toUpperCase() + value.slice(1);
        return `${formattedValue}`;
    }
  }
  const situation = volunteerFormatter(user.situation);
  const rol = volunteerFormatter(user.rol);
  const role = localStorage.getItem("role");

  function handleClickReturn(){
    role === 'admin' ? navigate(`/admin/volunteers`) : navigate(`/roles/volunteers`);
  }

  return (
    <section>
      <MDBContainer className="py-5">
      <MDBRow>
          <MDBCol lg="1"> 
            <Button  onClick={()=> handleClickReturn() } type="button" id="button" className="btn btn-light w-100">
              Volver
            </Button>
          </MDBCol>
          <MDBCol lg="10"> 
          <center>
          <h2>
            {user.name} {user.last_name}
            </h2></center>
            </MDBCol>
        </MDBRow>
        <hr />
        <MDBRow>
          <MDBCol lg="10"> 
            <MDBRow>
              <MDBCol lg="6">
                <Badge.Ribbon text="Información" color="#146C94">
                  <MDBCard className="mb-4">
                    <MDBCardBody>
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>ID del Voluntario</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9" className="align-items-center d-flex justify-content-center">
                          <MDBCardText className="text-muted">
                            {user.id}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr/>
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>NIF</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">{user.nif}</MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Rol</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            {rol}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Situación</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            {situation}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                    </MDBCardBody>
                  </MDBCard>
                </Badge.Ribbon>
              </MDBCol>
              <MDBCol lg="6">
                <Badge.Ribbon text="Conocimientos" color="#146C94">
                  <MDBCard className="mb-4">
                    <MDBCardBody>
                    <MDBRow>
                        <MDBCol sm="4" className="align-items-center d-flex justify-content-center">
                          <MDBCardText  >Conocimientos</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="8">
                          <MDBCardText className="text-muted mt-4" >
                            <Tag color={user.computerKnowledge ? 'green' : 'red'} key={user.computerKnowledge}>
                              Conocimiento tecnológico </Tag>
                          </MDBCardText>
                          <MDBCardText className="text-muted">
                            <Tag color={user.truckKnowledge ? 'green' : 'red'} key={user.truckKnowledge}>
                              Manejo de camiones </Tag>
                          </MDBCardText>
                          <MDBCardText className="text-muted">
                            <Tag color={user.warehouseKnowledge ? 'green' : 'red'} key={user.warehouseKnowledge}>
                              Gestión de almacenes</Tag>
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="4">
                          <MDBCardText>Otros conocimientos</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="8">
                          <MDBCardText className="text-muted">{user.otherKnowledge}</MDBCardText>
                        </MDBCol>
                      </MDBRow>
                    </MDBCardBody>
                  </MDBCard>
                </Badge.Ribbon>
              </MDBCol>
              <MDBCol lg="12">
                <Badge.Ribbon text="Datos personales" color="#146C94">
                  <MDBCard className="mb-4">
                    <MDBCardBody>
                      
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Población</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            {user.place}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Código Postal</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                          {user.postal_code}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Teléfono</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            {user.phone}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Email</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            {user.email}
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
                          <Tag color={user.state === 'Activo' ? 'green' : 'red'} key={user.state}>
                            {user.state.toUpperCase()}
                          </Tag>
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Observaciones</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            {user.observations}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                    </MDBCardBody>
                  </MDBCard>
                </Badge.Ribbon>
              </MDBCol>
            </MDBRow>
          </MDBCol>
          <MDBCol lg="2">
            <MDBCard className="mb-4">
              <MDBCardBody>  
                <MDBRow>
                  <MDBCol>
                    <MDBCardText className="text-muted w-auto">
                      <Button
                        onClick={() => 
                          {role === 'admin' ? navigate(`/admin/volunteers/update/${id}`) : navigate(`/roles/volunteers/update/${id}`)}}
                        type="button" id="button" 
                        className="btn btn-light w-100"
                      >
                        Editar voluntario
                      </Button>
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
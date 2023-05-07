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
  MDBCardImage
} from "mdb-react-ui-kit";
import Communication from "./Communications.js";
import {partners, fileUrl, dontaionAmmount} from "./services/backend.js";
import { generateCertificate} from "./Certificate.js";
import { PDFViewer, PDFDownloadLink} from "@react-pdf/renderer";
import { Button} from "react-bootstrap";
import { Badge, Tag } from 'antd';

export default function Details() {
  let navigate = useNavigate();


  /**Establecer usuario */
  const [user, setUser] = useState({
    dni: "",
    name: "",
    last_name: "",
    email: "",
    state: "",
    phone1: "",
    province: "",
    iban: "",
    phone2: "",
    birthdate: "",
    sex: "",
    address: "",
    postal_code: "",
    township: "",
    language: "",
    account_holder: "",
  });

  const [donation, setDonation] = useState({
    id: "",
    start_date: "",
    amount: "",
    periodicity: "",
  });

  const { id } = useParams();

  useEffect(() => {
    loadUser();
    loadDonation();
  }, []);

  const loadUser = async () => {
    const result = await partners.get(`/${id}`);
    setUser(result.data);
  };

  const [donationAmount, setDonationAmount] = useState({
    
  });

  const totalAmount =  async () => {
    const result = await dontaionAmmount.get(`/${donation.id}`);
    setDonationAmount(result.data['total_amuont']) ;
  };

  function createCommunicationRedirect(){
    navigate(`/admin/partners/${id}/communication/create`);
  }

  function createDonationRedirect(){
    navigate(`/admin/partners/${id}/donation/create`);
  }

  function editDonationRedirect(){
    navigate(`/admin/partners/${id}/donation/update`);
  }

  function handleClickReturn(){
    navigate(`/admin/partners`);
  }
  
  const loadDonation = async () => {
    const result = await partners.get(`/${id}/donation`);
    setDonation(result.data);
  };

  function existDonation(){
    if (donation.start_date == "" || donation.start_date == undefined){
      return false;
    }else{
      return true;
    }
  }

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      type="button" id="button" className="btn btn-light w-100"
    >
      {children}
      &#x25bc;
    </a>
  ));
  
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
  
  // FORMATEADOR DE LOS ENUMERADOS
  function partnerFormatter(value) {
    var formattedValue = value;
    switch (value) {
      case "men":
        formattedValue = "Hombre";
        return `${formattedValue}`;
      case "women":
        formattedValue = "Mujer";
        return `${formattedValue}`;
      case "none":
        formattedValue = "Ninguno";
        return `${formattedValue}`;
      case "spanish":
        formattedValue = "Español";
        return `${formattedValue}`;
      case "catalan":
        formattedValue = "Catalán";
        return `${formattedValue}`;
    }
  }

  function donationFormatter(value) {
    var formattedValue = value;
    switch (value) {
      case "MENSUAL":
        formattedValue = "Mensual";
        return `${formattedValue}`;
      case "TRIMESTRAL":
        formattedValue = "Trimestral";
        return `${formattedValue}`;
      case "SEMESTRAL":
        formattedValue = "Semestral";
        return `${formattedValue}`;
    
      case "ANUAL":
        formattedValue = "Anual";
        return `${formattedValue}`;
      }
    }



    //VARIABLES DEL POP UP CERTIFICADO
  const [verCertificado, setVerCertificado] = useState(false);
  const [idioma, setIdioma] = useState("Español");

  

  function handleClick(lan){
    totalAmount().then(()=>{
      setVerCertificado(true);
      setIdioma(lan);
    })
  } 

  const sex = partnerFormatter(user.sex);
  const language = partnerFormatter(user.language);
  const periodicity = donationFormatter(donation.periodicity);
  const donationExist = existDonation();

  return (
    <section>
      {verCertificado ? (
        <section>
          <div style={{display: "flex", flexDirection:"row"}}>
            <button onClick={()=>  setIdioma("Español")}type="button" id="button" className="btn btn-light w-100"  width="10%"> Español </button>            
            <button onClick={()=>  setIdioma("Catalán")}type="button" id="button" className="btn btn-light w-100"  width="10%"> Català </button>
            <button onClick={()=>  setVerCertificado(false)}type="button" id="button" className="btn btn-light w-100" width="10%"> Cerrar </button>
          </div>
          <div><PDFViewer  height={"910"} width={"700"}>{generateCertificate(user,idioma, donationAmount)}</PDFViewer></div>
          <div>
            ¿No carga?
            <div><PDFDownloadLink document={generateCertificate(user,"Español",donationAmount)} fileName="certificate.pdf">
              {({ blob, url, loading, error }) =>
                loading ? 'Loading document...' : 'Descarga en español'
              }
            </PDFDownloadLink></div>
            <div><PDFDownloadLink document={generateCertificate(user,"Català", donationAmount)} fileName="certificate.pdf">
              {({ blob, url, loading, error }) =>
                loading ? 'Loading document...' : 'Descaga en català'
              }
            </PDFDownloadLink></div>  
          </div>
        </section>
      ):
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
                <Badge.Ribbon text="Contacto" color="purple">
                  <MDBCard className="mb-4">
                    <MDBCardBody>
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
                          <MDBCardText>Teléfono 1</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            {user.phone1}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Teléfono 2</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            {user.phone2}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                    </MDBCardBody>
                  </MDBCard>
                </Badge.Ribbon>
              </MDBCol>
              <MDBCol lg="6">
                <Badge.Ribbon text="Donaciones" color="purple">
                  <MDBCard className="mb-4">
                    <MDBCardBody>
                    <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Importe</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">{donation.amount}€</MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Periodicidad</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">{periodicity}</MDBCardText>
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
                    </MDBCardBody>
                  </MDBCard>
                </Badge.Ribbon>
              </MDBCol>
              <MDBCol lg="12">
                <Badge.Ribbon text="Datos personales" color="purple">
                  <MDBCard className="mb-4">
                    <MDBCardBody>
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>DNI</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">{user.dni}</MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Fecha de Nacimiento</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            {user.birthdate}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Sexo</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">{sex}</MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Dirección</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            {user.address}
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
                          <MDBCardText>Municipio</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            {user.township}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Provincia</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            {user.province}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Idioma</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            {language}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>IBAN</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            {user.iban}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Titular de la cuenta</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            {user.account_holder}
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
                        onClick={() => {navigate(`/admin/partners/update/${id}`)}}
                        type="button" id="button" 
                        className="btn btn-light w-100"
                      >
                        Editar socio
                      </Button>
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr /> 
                {donationExist && ( 
                  
                  <section>
                <MDBRow>
                  <MDBCol>
                    <MDBCardText className="text-muted w-auto">
                      <Button  href={fileUrl + `/partners/${user.id}/receipt`} type="button" id="button" className="btn btn-light w-100">
                        Generar recibo
                      </Button>
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol>
                  <MDBCardText className="text-muted w-auto">
                    <Button  onClick={()=> handleClick(user.language)} type="button" id="button" className="btn btn-light w-100">
                      Generar certificado
                    </Button>
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                </section>
              )}
                <MDBRow>
                  <MDBCol>
                    <MDBCardText className="text-muted w-auto">
                      <Button onClick={createCommunicationRedirect} type="button" id="button" className="btn btn-light w-100">
                        Añadir nueva comunicación
                      </Button>
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr/>
                  <MDBRow>
                    <MDBCol>
                      <MDBCardText className="text-muted w-auto">
                      {existDonation() && (
                        <Button onClick={editDonationRedirect} type="button" id="button" className="btn btn-light w-100">
                          Editar Donación
                        </Button>)
                      }
                      {!existDonation() && (
                        <Button onClick={createDonationRedirect} type="button" id="button" className="btn btn-light w-100">
                          Crear Donación
                        </Button>)
                      }
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="12">
            <MDBCard className="mb-4 mb-md-0">
              <MDBCardBody>
                <MDBCardText><h4>COMUNICACIONES</h4></MDBCardText>

              <Communication user_id={id}/>

            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
    }
    </section>
  );
}
import "../../../App.css";
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

// React Bootstrap
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Local imports
import { advertisementBE, sectionBE, mediaUrl } from "./services/backend.js";
import SafeHTML from "../../../components/SanitizeHTML";
import { useAuthContext } from "../../../components/routes/authContext";

export default function ShowAdvertisement() {
  let navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  /* Data */
  const { id } = useParams();
  const [advertisement, setAdvertisement] = useState({
    title: "",
    abstract: "",
    body: "",
    url: "",
    creation_date: "",
    section_id: "",
    section_id__name: "",
    front_page: "default.jpg",
  });

  const [sectionAdvertisements, setSectionAdvertisements] = useState([]);

  const {
    title,
    abstract,
    section_id,
    section_id__name,
    body,
    creation_date,
    url,
    front_page,
  } = advertisement;

  /* Functions */

  function deleteAdvertisement(advertisementId, data) {
    const filteredAdvertisements = data.filter(
      (advertisement) =>
        parseInt(advertisement.id) !== parseInt(advertisementId)
    );
    return filteredAdvertisements;
  }

  useEffect(() => {
    advertisementBE.get(`${id}`).then((response) => {
      setAdvertisement(response.data);
    });
  }, [id]);

  const firstLoad = useRef(true);
  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
    } else {
      sectionBE.get(`/${section_id}/advertisements/`).then((response) => {
        const data = deleteAdvertisement(id, response.data);
        setSectionAdvertisements(data);
      });
    }
  }, [advertisement]);

  const role = localStorage.getItem("role");

  return (
    <Container>
      <Row className="mt-5">
        <Col lg={6} className="align-self-center shadow mb-5 offset-lg-1">
          <Row className="">
            <h1 className="title" style={{ textAlign: "left" }}>
              <strong>{title}</strong>
            </h1>
          </Row>

          <hr />

          <Row>
            <Col>
              <Row>
                <p className="text-muted" style={{ textAlign: "justify" }}>
                  {abstract}
                </p>
              </Row>
              <Row className="justify-content-between">
                <p className="text-muted" style={{ width: "auto" }}>
                  <i>{creation_date && parseDate(creation_date)}</i>
                </p>
                {url && (
                  <a href={url} style={{ width: "auto" }}>
                    Link a la noticia original
                    <i class="bi bi-box-arrow-up-right"></i>
                  </a>
                )}
              </Row>
            </Col>
          </Row>

          <hr />

          <Row className="justify-content-center">
            <Image
              style={{
                display: "block",
                width: "100%",
                height: "auto",
              }}
              className=""
              fluid={true}
              src={`${mediaUrl}${front_page}`}
            />
          </Row>

          <hr />

          <Row>
            <SafeHTML html={body} />
          </Row>
          {isAuthenticated && role === 'admin' && (
            <Row className="justify-content-center">
              <Link
                className="btn btn-outline-primary col-4 mb-4 mx-2"
                to={`/admin/information/advertisements/${id}/update`}
              >
                Modificar artículo
              </Link>
            </Row>
          )}
        </Col>
        <Col className="mb-5 mx-3">
          <Row className="">
            <h5 className="title" style={{ textAlign: "center" }}>
              <strong>Más noticias de {section_id__name}</strong>
            </h5>
          </Row>
          <hr />

          {sectionAdvertisements.length === 0 && (
            <>
              <Row className="justify-content-center">
                <p className="text-muted" style={{ textAlign: "center" }}>
                  No hay más noticias de esta sección
                </p>
              </Row>
            </>
          )}
          {sectionAdvertisements.map((adv) => (
            <Card
              onClick={() => {
                navigate(`/information/advertisements/${adv.id}`);
              }}
              className="shadow w-auto my-5"
              style={{ cursor: "pointer" }}
            >
              <Row>
                <Col style={{}} className="" align="center" xs={5}>
                  <Card.Img
                    variant="top"
                    className="pr-5"
                    src={`${mediaUrl}${adv.front_page}`}
                  />
                </Col>
                <Col
                  style={{ maxHeight: "6rem", maxWidth: "auto" }}
                  className="mr-2 justify-content-center align-self-center"
                >
                  <div>
                    <Card.Title
                      className="title me-2"
                      style={{
                        textAlign: "left",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: "2",
                        WebkitBoxOrient: "vertical",
                        textAlign: "left",
                      }}
                    >
                      <strong>{adv.title}</strong>
                    </Card.Title>
                  </div>
                </Col>
              </Row>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
}

function parseDate(dateString) {
  const isoDate = new Date(dateString);
  const day = isoDate.getUTCDate().toString().padStart(2, "0");
  const month = new Intl.DateTimeFormat("es-ES", { month: "long" }).format(
    isoDate
  );
  const year = isoDate.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

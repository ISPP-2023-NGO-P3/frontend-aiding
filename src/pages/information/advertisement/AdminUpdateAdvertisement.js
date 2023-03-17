import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Col, Container, Row } from "react-bootstrap";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import React, { useState } from "react";
import { advertisementBE, sectionBE } from "./services/backend.js";

import { Link, useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { BsJustifyRight } from "react-icons/bs";
import { BiAlignJustify } from "react-icons/bi";
import { BsJustify } from "react-icons/bs";
import { BsTypeBold } from "react-icons/bs";
import { BsTypeItalic } from "react-icons/bs";
import { BsTypeStrikethrough } from "react-icons/bs";
import { BsTypeH1 } from "react-icons/bs";
import { BsTypeH2 } from "react-icons/bs";
import { BsTypeH3 } from "react-icons/bs";

const successMsg = {
  title: "Mensaje de confirmación",
  text: "Te confirmamos que el artículo se ha creado correctamente",
  icon: "success",
  button: "Aceptar",
  timer: "5000",
};

const errorMsg = {
  title: "Mensaje de error",
  text: "Se ha producido un error al crear el artículo",
  icon: "error",
  button: "Aceptar",
  timer: "5000",
};

const AdminUpdateAdvertisement = () => {
  let navigate = useNavigate();

  /* Editor */
  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      Paragraph,
      Text,
      Heading,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

  });

  /* Data */
  const { id } = useParams();
  const [advertisement, setAdvertisement] = useState({
    title: "",
    abstract: "",
    body: "",
    url: "",
    section_id: "",
    front_page: "",
  });

  const [sections, setSections] = useState([
    {
      id: "",
      name: "",
    },
  ]);

  const { title, abstract, body, url, section_id, front_page } = advertisement;

  /* Events */
  const onInputChange = (e) => {
    if (e.target.type === "file") {
      setAdvertisement({
        ...advertisement,
        [e.target.name]: e.target.files[0],
      });
    } else {
      setAdvertisement({ ...advertisement, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("abstract", abstract);
      formData.append("body", editor.getHTML());
      formData.append("url", url);
      formData.append("section_id", section_id);
      formData.append("front_page", front_page);

      putAdvertisement(formData);
    }
  };

  /* Validator */
  const [errors, setErrors] = useState({});

  function validateForm() {
    let error_msgs = {};

    if (title === "" || title === null) {
      error_msgs.title = "El título no puede estar vacío";
    }

    if (abstract === "" || abstract === null) {
      error_msgs.abstract = "El resumen no puede estar vacío";
    }

    if (
      editor.getHTML() === "" ||
      editor.getHTML() === null ||
      editor.getHTML() === "<p></p>"
    ) {
      error_msgs.body = "El cuerpo del artículo no puede estar vacío";
    }

    if (section_id === "" || section_id === null) {
      error_msgs.section_id = "Hay un error con la sección";
    }

    if (front_page === "" || front_page === null) {
      error_msgs.front_page = "El artículo debe tener una imagen de portada";
    }

    setErrors(error_msgs);

    if (Object.keys(error_msgs).length === 0) {
      return true;
    } else {
      return false;
    }
  }

  /* Functions */
  function putAdvertisement(advertisement) {
    advertisementBE
      .put(`${id}`, advertisement, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        swal(successMsg);
        navigate("/information/sections");
      })
      .catch((error) => {
        console.log(error);
        swal(errorMsg);
      });
  }

  function getSections() {
    sectionBE
      .get("")
      .then((response) => {
        setSections(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getAdvertisement() {
    advertisementBE
      .get(`${id}`)
      .then((response) => {
        setAdvertisement(response.data);
        editor.commands.setContent(response.data.body);
      })
      .catch((error) => {
        /* navigate("/information/sections"); */
      });
  }

  React.useEffect(() => {
    getAdvertisement();
    getSections();
  }, []);


  return (
    <>
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 shadow">
            <h1 className="pt-3">Redactar artículo</h1>
            <Form
              className=""
              onSubmit={(e) => onSubmit(e)}
              noValidate
              validated={false}
            >
              <div className="row justify-content-evenly">
                <Form.Group className="mb-3">
                  <Form.Label>Título</Form.Label>
                  {errors.title && (
                    <p className="text-danger">{errors.title}</p>
                  )}
                  <Form.Control
                    onChange={(e) => onInputChange(e)}
                    value={title}
                    name="title"
                    required
                    placeholder="Título del artículo"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Resumen</Form.Label>
                  {errors.abstract && (
                    <p className="text-danger">{errors.abstract}</p>
                  )}
                  <Form.Control
                    onChange={(e) => onInputChange(e)}
                    value={abstract}
                    name="abstract"
                    placeholder="Breve resumen de máximo 250 caractéres"
                    as="textarea"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Enlace (Opcional)</Form.Label>
                  {errors.url && <p className="text-danger">{errors.url}</p>}
                  <Form.Control
                    onChange={(e) => onInputChange(e)}
                    value={url}
                    name="url"
                    placeholder="Enlace del artículo original"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Sección</Form.Label>
                  {errors.section_id && (
                    <p className="text-danger">{errors.section_id}</p>
                  )}
                  <Form.Select
                    onChange={(e) => onInputChange(e)}
                    name="section_id"
                    required
                  >
                    <option>Seleciona una sección</option>
                    {sections.map((section) => (
                      <option value={section.id}>{section.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Imagen de la portada</Form.Label>
                  {errors.front_page && (
                    <p className="text-danger">{errors.front_page}</p>
                  )}
                  <Form.Control
                    onChange={(e) => onInputChange(e)}
                    type="file"
                    name="front_page"
                    required
                  />
                </Form.Group>
              </div>

              <div className="row justify-content-evenly">
                {errors.body && <p className="text-danger">{errors.body}</p>}
                <Button
                  className="col mb-4 mx-2"
                  variant="primary"
                  onClick={(e) => onSubmit(e)}
                >
                  Publicar artículo
                </Button>
                <Link
                  className="btn btn-outline-danger col mb-4 mx-2"
                  to="/admin/information/advertisements"
                >
                  Cancelar
                </Link>
              </div>
            </Form>
            <Container>
              <Row className="justify-content-center">
                <Col sm={10} className="pt-5">
                  <EditButtons editor={editor} />
                  <EditorContent
                    className="border border-bottom-0 border-2 mt-3"
                    editor={editor}
                  />
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUpdateAdvertisement;

const EditButtons = ({ editor }) => {
  if (!editor) {
    return null;
  }
  return (
    <>
      <div className="btn-group me-2" role="group">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            (editor.isActive("heading", { level: 1 }) ? "is-active" : "") +
            " " +
            "btn btn-outline-dark"
          }
        >
          <BsTypeH1 />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            (editor.isActive("heading", { level: 2 }) ? "is-active" : "") +
            " " +
            "btn btn-outline-dark"
          }
        >
          <BsTypeH2 />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            (editor.isActive("heading", { level: 3 }) ? "is-active" : "") +
            " " +
            "btn btn-outline-dark"
          }
        >
          <BsTypeH3 />
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={
            (editor.isActive("paragraph") ? "is-active" : "") +
            " " +
            "btn btn-outline-dark"
          }
        >
          paragraph
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={
            (editor.isActive("bold") ? "is-active" : "") +
            " " +
            "btn btn-outline-dark"
          }
        >
          <BsTypeBold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={
            (editor.isActive("italic") ? "is-active" : "") +
            " " +
            "btn btn-outline-dark"
          }
        >
          <BsTypeItalic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={
            (editor.isActive("strike") ? "is-active" : "") +
            " " +
            "btn btn-outline-dark"
          }
        >
          <BsTypeStrikethrough />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            (editor.isActive({ textAlign: "center" }) ? "is-active" : "") +
            " " +
            "btn btn-outline-dark"
          }
        >
          <BiAlignJustify />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={
            (editor.isActive({ textAlign: "right" }) ? "is-active" : "") +
            " " +
            "btn btn-outline-dark"
          }
        >
          <BsJustifyRight />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={
            (editor.isActive({ textAlign: "justify" }) ? "is-active" : "") +
            " " +
            "btn btn-outline-dark"
          }
        >
          <BsJustify />
        </button>
        <button
          onClick={() => editor.chain().focus().unsetTextAlign().run()}
          className="btn btn-outline-dark"
        >
          unsetTextAlign
        </button>
      </div>
    </>
  );
};

import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Table, Button, Input, Space } from "antd";
import { useRef, useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import { advertisementBE, sectionBE } from "./services/backend.js";
import { useNavigate } from "react-router-dom";

import swal from "sweetalert";
import TableReact from "react-bootstrap/Table";
import ButtonReact from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Col, Container, Row } from "react-bootstrap";


const successMsg_delete = {
  title: "Mensaje de confirmación",
  text: "Te confirmamos que la sección se ha eliminado correctamente",
  icon: "success",
  button: "Aceptar",
  timer: "5000",
};

const successMsg_create = {
  title: "Mensaje de confirmación",
  text: "Te confirmamos que la sección se ha creado correctamente",
  icon: "success",
  button: "Aceptar",
  timer: "5000",
};

const errorMsg_create = {
  title: "Mensaje de error",
  text: "Se ha producido un error al crear la sección",
  icon: "error",
  button: "Aceptar",
  timer: "5000",
};

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

const AdminListAdvertisement = () => {
  let navigate = useNavigate();

  /*LIMPIEZA*/
  const [filteredInfo, setFilteredInfo] = useState({});

  const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
  };

  const clearFilters = () => {
    setFilteredInfo({});
    setSearchText("");
  };

  /* Filters */
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setFilteredInfo({});
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Búsqueda`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={
              <SearchOutlined
                style={{
                  alignItems: "center",
                  display: "inline-grid",
                }}
              />
            }
            size="small"
            style={{
              width: 90,
            }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Borrar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filtrar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#678edf" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#678edf",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Título",
      dataIndex: "title",
      filteredValue: filteredInfo.title || null,
      ...getColumnSearchProps("title"),
    },
    {
      title: "Sección",
      dataIndex: "section_id__name",
      filteredValue: filteredInfo.section_id__name || null,
      ...getColumnSearchProps("section_id__name"),
    },
    {
      title: "Fecha de creación",
      dataIndex: "creation_date",
      sorter: {
        compare: (a, b) => compareDates(a.creation_date, b.creation_date),
        multiple: 1,
      },
    },
  ];

  /* Data */
  const [event, setEvent] = React.useState(true);
  const [advertisements, setAdvertisements] = React.useState([
    {
      title: "",
      abstract: "",
      url: "",
      section: "",
      creation_date: "",
      front_page: "default.jpg",
    },
  ]);

  const [sections, setSections] = React.useState([
    {
      id: "",
      name: "",
    },
  ]);

  const [section, setSection] = React.useState({
    name: "",
  });

  const { name } = section;

  /* Validator */
  const [errors, setErrors] = useState({});

  function validateForm() {
    let error_msgs = {};

    if (name === "" || name === null) {
      error_msgs.name = "El nombre no puede estar vacío";
    } else if (name.length < 3) {
      error_msgs.name = "El nombre debe tener al menos 3 caracteres";
    } else if (name.length > 100) {
      error_msgs.name = "El nombre debe tener menos de 100 caracteres";
    }

    setErrors(error_msgs);

    if (Object.keys(error_msgs).length === 0) {
      return true;
    } else {
      return false;
    }
  }

  /* Events */
  const onInputChange = (e) => {
    setSection({ ...section, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      sectionBE
        .post("", section)
        .then((response) => {
          swal(successMsg_create).then((res) => {
            if (res) {
              setEvent(!event);
              setSection({ name: "" });
            }
          });
        })
        .catch((error) => {
          if (error.response && error.response.status === 409) {
            let error_msgs = {name: "Ya existe una sección con ese título"};
            setErrors(error_msgs);
          }else {
            swal(errorMsg_create);
            console.log(sectionBE.getUri())
          }
        });
    }
  };

  /* Functions */
  const deleteConfirmationAlert = async (id) => {
    swal({
      title: "Eliminar sección",
      text: "¿Estás seguro que desea eliminar la sección?",
      icon: "warning",
      buttons: ["No", "Sí"],
    }).then((res) => {
      if (res) {
        sectionBE.delete(`${id}`).then((response) => {
          swal(successMsg_delete).then((res) => {
            if (res) {
              setEvent(!event);
            }
          });
        });
      }
    });
  };

  useEffect(() => {
    sectionBE.get().then((response) => {
      setSections(response.data);
    });
  }, [event]);

  useEffect(() => {
    advertisementBE.get().then((response) => {
      setAdvertisements(response.data);
      console.log(response.status);
    });
  }, []);

  return (
    <>
      <Container className="my-5">
        <Row>
          <h1 className="py-1">Artículos y secciones</h1>
        </Row>

        <Row>
          <Col>
            <Button
              onClick={() => {
                navigate("/admin/information/advertisements/create");
              }}
              id="boton-socio"
            >
              Crear artículo
            </Button>
            <Button onClick={clearFilters} id="boton-socio">
              Limpiar filtros
            </Button>
            <Table
              onRow={(record) => {
                return {
                  onClick: () => {
                    navigate("/information/advertisements/" + record.id);
                  },
                };
              }}
              columns={columns}
              dataSource={advertisements}
              onChange={onChange && handleChange}
              scroll={{ y: 400 }}
              pagination={{ pageSize: 20 }}
            />
          </Col>
        </Row>

        <hr></hr>

        <Row className="mb-4">
          <Col sm>
            <h3>Secciones</h3>
            <TableReact striped bordered hover>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sections.map((section) => (
                  <tr>
                    <td>{section.name}</td>
                    <td>
                      <ButtonReact
                        className=""
                        variant="danger"
                        onClick={() => deleteConfirmationAlert(section.id)}
                      >
                        Eliminar
                      </ButtonReact>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableReact>
          </Col>
          <Col sm>
            <h3>Crear sección</h3>
            <Form
              className=""
              onSubmit={(e) => onSubmit(e)}
              noValidate
              validated={false}
            >
              <Row className="justify-content-evenly">
                <Form.Group className="mb-3">
                  {errors.name && <p className="text-danger">{errors.name}</p>}
                  <Form.Control
                    onChange={(e) => onInputChange(e)}
                    value={name}
                    name="name"
                    required
                    maxLength={100}
                    placeholder="Nombre de la sección"
                  />
                </Form.Group>
              </Row>
              <ButtonReact
                className="col mb-4 mx-2"
                variant="primary"
                onClick={(e) => onSubmit(e)}
              >
                Crear sección
              </ButtonReact>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminListAdvertisement;

function compareDates(dateString1, dateString2) {
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);

  if (date1 < date2) {
    return -1;
  } else if (date1 > date2) {
    return 1;
  } else {
    return 0;
  }
}

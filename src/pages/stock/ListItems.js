import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Table, Button, Input, Space } from "antd";
import { useRef, useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import { items, tiposBE } from "./services/backend.js";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import Form from "react-bootstrap/Form";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";

import swal from "sweetalert";
import TableReact from "react-bootstrap/Table";
import ButtonReact from "react-bootstrap/Button";
import { Col, Row } from "react-bootstrap";
import { isAntispam } from "../../components/AntiSpam.js";

const successMsg_delete = {
  title: "Mensaje de confirmación",
  text: "Te confirmamos que el tipo de item se ha eliminado correctamente",
  icon: "success",
  button: "Aceptar",
  timer: "5000",
};

const successMsg_create = {
  title: "Mensaje de confirmación",
  text: "Te confirmamos que el tipo de item se ha creado correctamente",
  icon: "success",
  button: "Aceptar",
  timer: "5000",
};

const errorMsg_create = {
  title: "Mensaje de error",
  text: "Se ha producido un error al crear el tipo de item",
  icon: "error",
  button: "Aceptar",
  timer: "5000",
};

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

const Items = () => {
  let navigate = useNavigate();

  /*BUSCADOR*/
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
            Resetear
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
      title: "Nombre",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Cantidad",
      dataIndex: "quantity",
    },
    {
      title: "Descripción",
      dataIndex: "description",
    },
    {
      title: "Tipo de Item",
      dataIndex: "type_id",
      render: (typeId) => getTypeName(typeId),
    },
  ];

  /* Data */
  const [event, setEvent] = React.useState(true);
  const [items_data, setItemsData] = React.useState([]);

  const [types, setTypes] = React.useState([
    {
      id: "",
      name: "",
    },
  ]);

  const [type, setType] = React.useState({
    name: "",
  });

  const { name } = type;

  function getTypeName(typeId) {
    const type = types.find((t) => t.id === typeId);
    return type ? type.name : "";
  }

  /* Validator */
  const [errors, setErrors] = useState({});

  function validateForm() {
    let error_msgs = {};

    if (name === "" || name === null) {
      error_msgs.name = "El nombre no puede estar vacío";
    } else if (!isAntispam(name)) {
      error_msgs.name = "El nombre no puede contener spam";
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
    setType({ ...type, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      tiposBE
        .post("", type)
        .then((response) => {
          swal(successMsg_create).then((res) => {
            if (res) {
              setEvent(!event);
              setType({ name: "" });
            }
          });
        })
        .catch((error) => {
          if (error.response && error.response.status === 409) {
            let error_msgs = { name: "Ya existe una tipo con ese nombre" };
            setErrors(error_msgs);
          } else {
            swal(errorMsg_create);
            console.log(tiposBE.getUri());
          }
        });
    }
  };

  const deleteConfirmationAlert = async (id) => {
    swal({
      title: "Eliminar tipo",
      text: "¿Estás seguro que desea eliminar el tipo?",
      icon: "warning",
      buttons: ["No", "Sí"],
    }).then((res) => {
      if (res) {
        tiposBE.delete(`${id}`).then((response) => {
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
    tiposBE.get().then((response) => {
      setTypes(response.data);
    });
  }, [event]);

  useEffect(() => {
    items.get().then((response) => {
      setItemsData(response.data);
      console.log(response.status);
    });
  }, [event]);

  function createItemRedirect() {
    navigate("/admin/stock/items/create");
  }

  return (
    <div className="container my-5">
      <h1 className="pt-3">Items</h1>

      <MDBRow className="g-0">
        <MDBCol md="2">
          <Button onClick={createItemRedirect} id="boton-socio">
            Crear nuevo ítem
          </Button>
        </MDBCol>
      </MDBRow>
      <br></br>
      <Table
        id="table"
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              navigate("/admin/stock/items/" + record.id);
            },
          };
        }}
        columns={columns}
        dataSource={items_data}
        onChange={onChange}
        scroll={{ y: 400 }}
        pagination={{ pageSize: 20 }}
      />

      <Row className="mb-4">
        <Col sm>
          <h3>Tipos de item</h3>
          <TableReact striped bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {types.map((type) => (
                <tr>
                  <td>{type.name}</td>
                  <td>
                    <ButtonReact
                      className=""
                      variant="danger"
                      onClick={() => deleteConfirmationAlert(type.id)}
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
          <h3>Crear tipo de item</h3>
          <Form
            className=""
            onSubmit={(e) => onSubmit(e)}
            noValidate
            validated={false}
          >
            <Row className="justify-content-evenly">
              <Form.Group className="mb-3">
                <Form.Control
                  onChange={(e) => onInputChange(e)}
                  value={name}
                  name="name"
                  required
                  placeholder="Nombre del tipo de item"
                />
              </Form.Group>
              {errors.name && <p className="text-danger">{errors.name}</p>}
            </Row>
            <ButtonReact
              className="col mb-4 mx-2"
              variant="primary"
              onClick={(e) => onSubmit(e)}
            >
              Crear tipo
            </ButtonReact>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Items;

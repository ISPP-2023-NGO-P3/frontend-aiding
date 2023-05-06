import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import ButtonR from "react-bootstrap/Button";
import { Table, Button, Input, Space, Tag } from "antd";
import { useRef, useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import { fileUrl, partners } from "./services/backend.js";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import * as XLSX from "xlsx";
import axios from "axios";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import { useNotificationContext } from "../../components/notificationContext.js";


const Partners = () => {
  let navigate = useNavigate();

  function partnerFormatter(value) {
    var formattedValue = value;
    switch (value) {
      case "spanish":
        formattedValue = "Español";
        return `${formattedValue}`;
      case "catalan":
        formattedValue = "Catalán";
        return `${formattedValue}`;
    }
  }

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
            Restaurar
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
      title: "DNI",
      dataIndex: "dni",
      filteredValue: filteredInfo.dni || null,
      ...getColumnSearchProps("dni"),
    },
    {
      title: "Nombre",
      dataIndex: "name",
      filteredValue: filteredInfo.name || null,
      ...getColumnSearchProps("name"),
      ellipsis: true,
    },
    {
      title: "Apellidos",
      dataIndex: "last_name",
      filteredValue: filteredInfo.last_name || null,
      ...getColumnSearchProps("last_name"),
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      filteredValue: filteredInfo.email || null,
      ...getColumnSearchProps("email"),
      ellipsis: true,
    },
    {
      title: "Provincia",
      dataIndex: "province",
      filteredValue: filteredInfo.province || null,
      ...getColumnSearchProps("province"),
      ellipsis: true,
    },
    {
      title: "Idioma",
      dataIndex: "language",
      filters: [
        {
          text: "Español",
          value: "spanish",
        },
        {
          text: "Catalán",
          value: "catalan",
        },
      ],
      filteredValue: filteredInfo.language || null,
      onFilter: (value, record) => record.language.includes(value),
      render: (language) => partnerFormatter(language),
    },
    {
      title: "Registro Donación",
      dataIndex: "state",
      filters: [
        {
          text: "Activo",
          value: "Activo",
        },
        {
          text: "Inactivo",
          value: "Inactivo",
        },
      ],
      filteredValue: filteredInfo.state || null,
      onFilter: (value, record) => record.state.includes(value),
      render: (state) => (
        <Tag color={state === "Activo" ? "green" : "red"} key={state}>
          {state.toUpperCase()}
        </Tag>
      ),
    },
  ];

  /*DATOS*/
  const [partners_data, setPartnersData] = React.useState([]);

  useEffect(() => {
    partners.get().then((response) => {
      setPartnersData(response.data);
      setFilteredPartners(response.data);
    });
  }, []);

  function createPartnerRedirect() {
    navigate("/admin/partners/create");
  }

  /* NOTIFICATIONS */

  const {setFilteredEmails} = useNotificationContext();

  function notifyPartners() {
    let emails_aux = filteredPartners.map(obj => obj.email).join(" ");
    setFilteredEmails(emails_aux);
    navigate("/admin/notification/create");
  };

  const [filteredPartners, setFilteredPartners] = useState([{
    id: "...",
    dni: "...",
    name: "...",
    last_name: "...",
    email: "...",
    state: "...",
    language: "...",
    province: "...",
  },
]);


  const onChange = (pagination, filters, sorter, extra) => {
    setFilteredPartners(extra.currentDataSource);
  };

  /* EXPORTACIÓN DE SOCIOS */

  const exportToExcel = (fileName) => {
    const sheetName = "Sheet1";
    const workbook = XLSX.utils.book_new();
    const worksheetData = XLSX.utils.json_to_sheet(filteredPartners);
    XLSX.utils.book_append_sheet(workbook, worksheetData, sheetName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };
  const [show, setShow] = useState(false);

  const [selectedFile, setSelectedFile] = React.useState(null);

  var [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("selectedFile", selectedFile);
    partners
      .post("import/", formData)
      .then((response) => {
        console.log(fileUrl);
        setShow(false);
        navigate("/admin/partners/");
        window.location.reload(true);
      })
      .catch((error) => {
        setErrors(error.response.data["error"]);
        console.log(errors);
      });
    partners.get().then((response) => {
      setPartnersData(response.data);
      setFilteredPartners(response.data);
    });
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleClose = () => setShow(false);

  const handleShow = () => {
    setErrors("");
    setShow(true);
  };

  return (
    <div className="container my-5">
      <h1 className="pt-3">Socios</h1>
      <div id="botones-socios">
        <Button onClick={handleShow} id="boton-importar">
          Importar socios
        </Button>
        <Button id="boton-importar" onClick={() => exportToExcel("myTable")}>
          Exportar a Excel
        </Button>
        <Button id="boton-importar" onClick={() => notifyPartners()}>
          Notificar socios seleccionados
        </Button>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Importar socios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="" id="modal-partner-content">
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <div id="modal-partner-content">
                <input
                  name="file"
                  id="input-file"
                  type="file"
                  class="custom-file-input"
                  onChange={handleFileSelect}
                />
              </div>
            </Form.Group>
            <div id="modal-button-right">
              <ButtonR
                variant="outline-success"
                className="col mb-4 mx-5"
                type="submit"
                onClick={handleSubmit}
              >
                {" "}
                Importar{" "}
              </ButtonR>
            </div>
          </Form>
          <div id="modal-button-left">
            <ButtonR
              variant="outline-danger"
              className="col mb-4 mx-5"
              onClick={handleClose}
            >
              {" "}
              Cancelar{" "}
            </ButtonR>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <p className="text-danger">{errors.toString()}</p>
        </Modal.Footer>
      </Modal>

      <MDBRow>
        <MDBCol md="2">
          <Button onClick={createPartnerRedirect} id="boton-socio">
            Crear socio
          </Button>
        </MDBCol>
      </MDBRow>

      <MDBRow>
        <MDBCol md="2">
        <Button onClick={clearFilters} id="boton-socio">Limpiar filtros</Button>
        </MDBCol>
      </MDBRow>

      <Table
        id="table"
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              navigate("/admin/partners/" + record.id);
            },
          };
        }}
        columns={columns}
        dataSource={partners_data}
        onChange={onChange && handleChange}
        scroll={{ y: 400 }}
        pagination={{ pageSize: 20 }}
      />
    </div>
  );
};

export default Partners;

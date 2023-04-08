import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import ButtonR from "react-bootstrap/Button";
import { Table, Button, Input, Space, Tag} from 'antd';
import { useRef, useState, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import {fileUrl, partners} from "./services/backend.js";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import Modal from 'react-bootstrap/Modal';
import Form from "react-bootstrap/Form";
import * as XLSX from 'xlsx';
import axios from 'axios';
import {MDBCol,MDBRow} from "mdb-react-ui-kit";


const onChange = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};

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

  /*BUSCADOR*/
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined style={{
              alignItems: 'center',
              display: 'inline-grid',
            }}/>}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
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
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#678edf' : undefined,
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
            backgroundColor: '#678edf',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: 'DNI',
      dataIndex: 'dni',
      ...getColumnSearchProps('dni'),
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Apellidos',
      dataIndex: 'last_name',
      ...getColumnSearchProps('last_name'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Provincia',
      dataIndex: 'province',
      ...getColumnSearchProps('province'),
    },
    {
      title: 'Idioma',
      dataIndex: 'language',
      filters: [
        {
          text: 'Español',
          value: 'Español',
        },
        {
          text: 'Catalán',
          value: 'Catalán',
        },
      ],
      onFilter: (value, record) => record.language.includes(value),
    },
    {
      title: 'Registro Donación',
      dataIndex: 'state',
      filters: [
        {
          text: 'Activo',
          value: 'Activo',
        },
        {
          text: 'Inactivo',
          value: 'Inactivo',
        },
      ],
      onFilter: (value, record) => record.state.includes(value),
      render: (state) => (
        <Tag color={state === 'Activo' ? 'green' : 'red'} key={state}>
          {state.toUpperCase()}
        </Tag>
      ),
    },
  ];

  /*DATOS*/
  const [partners_data, setPartnersData] = React.useState([
    {
      dni: '...',
      name: '...',
      last_name: '...',
      email: '...',
      state: '...',
      language: '...',
      province: '...',
    }
  ]);

  useEffect(() => {
    partners.get().then((response) => {setPartnersData(response.data);});
  }, []);

  function createPartnerRedirect(){
    navigate("/admin/partners/create");
  }

  /*EXPORTACIÓN DE SOCIOS */

  const exportToExcel = (fileName) => {
    const sheetName = 'Sheet1';
    const workbook = XLSX.utils.book_new();
    const worksheetData = XLSX.utils.json_to_sheet(partners_data);
    XLSX.utils.book_append_sheet(workbook, worksheetData, sheetName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };
  const [show, setShow] = useState(false);

  const [selectedFile, setSelectedFile] = React.useState(null);

  var [errors, setErrors] = useState({});

  const handleSubmit = async(event) => {
    event.preventDefault()
    const formData = new FormData();
    formData.append("selectedFile", selectedFile);
    try {
      const response = await axios({
        method: "post",
        url: fileUrl+"partners/import/",
        data: formData,
      });
      setShow(false);
    } catch(error) {
      setErrors(error.response.data["error"]);
      console.log(errors);
    }
    partners.get().then((response) => {setPartnersData(response.data);});
  }

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const handleClose = () => setShow(false);

  const handleShow = () => {
    setErrors("");
    setShow(true);
  }
  
  return (
    <div className='container my-5'>
        <h1 className="pt-3">Socios</h1>
        <div id="botones-socios">
          <Button onClick={handleShow} id="boton-importar" >Importar socios</Button>
          <Button  id="boton-importar" onClick={() => exportToExcel('myTable')}>Exportar a Excel</Button>
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Importar socios</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="" id='modal-partner-content'> 
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <div id="modal-partner-content">
                <input name="file" id="input-file" type="file" class="custom-file-input" onChange={handleFileSelect} />
              </div>
              </Form.Group>
              <div id='modal-button-right'>
                <ButtonR variant="outline-success" className="col mb-4 mx-5" type="submit" onClick={handleSubmit}> Importar </ButtonR>
              </div>
            </Form>
            <div id='modal-button-left'>
              <ButtonR variant="outline-danger" className="col mb-4 mx-5" onClick={handleClose}> Cancelar </ButtonR>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <p className="text-danger">{errors.toString()}</p>
          </Modal.Footer> 
        </Modal>
        
        <MDBRow>
          <MDBCol md='2'>
          <Button onClick={createPartnerRedirect} id="boton-socio">Crear socio</Button>
          </MDBCol>
        </MDBRow>
        <br></br>
        <Table id='table'
        onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              navigate("/admin/partners/" + record.id);
            },
          };
        }}
        columns={columns} dataSource={partners_data} onChange={onChange} scroll={{y: 400,}} pagination={{pageSize: 20,}}/>
    </div>
  );
}

export default Partners;
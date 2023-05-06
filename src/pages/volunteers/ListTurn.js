import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Table, Button, Input, Space, Tag} from 'antd';
import { useRef, useState, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import {volunteers} from "./services/backend.js";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import {MDBCol,MDBRow} from "mdb-react-ui-kit";

const onChange = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};

const Turns = () => {
  let navigate = useNavigate();

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
      title: 'Título del turno',
      dataIndex: 'title',
    },
    {
      title: 'Fecha',
      dataIndex: 'date',
    },
    {
      title: 'Hora de Comienzo',
      dataIndex: 'startTime',
    },
    {
      title: 'Hora de Finalización',
      dataIndex: 'endTime',
    },
    {
      title: 'Borrador',
      dataIndex: 'draft',
      render:(draft) => draft ? 'No' : 'Sí',
    },
  ];

  /*DATOS*/
  const [turns_data, setTurnsData] = React.useState([]);

  useEffect(() => {
    volunteers.get("turns/").then((response) => {setTurnsData(response.data);});
  }, []);

  function createTurnRedirect(){
    navigate("/roles/volunteers/turns/create");
  }

  return (
    <div className='container my-5'>
        <h1 className="pt-3">Turnos</h1>        
        <MDBRow className='g-0'>
          <MDBCol md='1'>
          <Button onClick={createTurnRedirect} id="boton-turno">Crear turno</Button>
          </MDBCol>
        </MDBRow>
        <br></br>
        <Table id='table'
        onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              if(record.draft){
                navigate("/roles/volunteers/turns/" + record.id);
              } else {
                navigate("/roles/volunteers/turns/" + record.id + "/draft");
              }
            },
          };
        }}
        columns={columns} dataSource={turns_data} onChange={onChange} scroll={{y: 400,}} pagination={{pageSize: 20,}}/>
    </div>
  );
}

export default Turns;
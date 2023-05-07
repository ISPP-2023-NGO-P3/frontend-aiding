import { events } from "./services/backend";
import { useNavigate } from "react-router-dom";
import { Table, Button, Input, Space } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { useRef, useState, useEffect } from "react";
import React from "react";

const AdminListEvent = () => {
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
            placeholder={`Search ${dataIndex}`}
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
              icon={<SearchOutlined />}
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
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{
            color: filtered ? "#1890ff" : undefined,
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
              backgroundColor: "#ffc069",
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
  
    const onChange = (pagination, filters, sorter, extra) => {
      console.log("params", pagination, filters, sorter, extra);
    };
  
    const columns = [
      {
        title: "Nº de evento",
        dataIndex: "id",
        sorter: {
          compare: (a, b) => a.id - b.id,
          multiple: 1,
        },
      },
      {
        title: "Título",
        dataIndex: "title",
        ...getColumnSearchProps("title"),
      },
      {
        title: "Descripción",
        dataIndex: "description",
        ...getColumnSearchProps("description"),
      },
      {
        title: "Calle",
        dataIndex: "street",
      },
      {
        title: "Número",
        dataIndex: "number",
      },
      {
        title: "Ciudad",
        dataIndex: "city",
      },
      {
       title:"Fecha de inicio",
       dataIndex:"start_date",
       render: (start_date) => {
        const formattedDateTime = new Date(start_date).toLocaleString('es-ES', {day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'})
        return <span>{formattedDateTime}</span>
        }
      },
      {
        title:"Fecha de finalizado",
        dataIndex:"end_date",
        render: (end_date) => {
          const formattedDateTime = new Date(end_date).toLocaleString('es-ES', {day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'})
          return <span>{formattedDateTime}</span>
        }
       },
    ];
  
    /*DATOS*/
    const [events_data, setEventData] = React.useState([]);
  
    useEffect(() => {
      events.get().then((response) => {
        setEventData(response.data);
      });
    }, []);
  
    return (
      <div className="container">
        <h1>Eventos</h1>
        <Button
          onClick={() => {
            navigate("/admin/events/create");
          }}
          id="boton-socio"
        >
          Crear evento
        </Button>
        <Table
          onRow={(record, rowIndex) => {
            return {
              onClick: () => {
                navigate("/events/" + record.id);
              },
            };
          }}
          columns={columns}
          dataSource={events_data}
          onChange={onChange}
          scroll={{ y: 800 }}
          pagination={{ pageSize: 4 }}
        />
      </div>
    );
  };
  
  export default AdminListEvent;
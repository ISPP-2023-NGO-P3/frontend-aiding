import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Table, Button, Input, Space } from "antd";
import { useRef, useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import resourcesApi from "./services/backend.js";
import { useNavigate } from "react-router-dom";

const ResourcesTable = () => {
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
            Cerrar
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
      title: "Nº de recurso",
      dataIndex: "id",
      sorter: {
        compare: (a, b) => a.id - b.id,
        multiple: 1,
      },
    },
    {
      title: "Título",
      dataIndex: "title",
      filteredValue: filteredInfo.title || null,
      ...getColumnSearchProps("title"),
    },
    {
      title: "Descripción",
      dataIndex: "description",
      filteredValue: filteredInfo.description || null,
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
      title: "Comentarios adicionales",
      dataIndex: "additional_comments",
    },
  ];

  /*DATOS*/
  const [resources_data, setResourceData] = React.useState([]);

  useEffect(() => {
    resourcesApi.get().then((response) => {
      setResourceData(response.data);
    });
  }, []);

  return (
    <div className="container">
      <h1>Recursos</h1>
      <Button
        onClick={() => {
          navigate("/admin/information/create-resource");
        }}
        id="boton-socio"
      >
        Crear recurso
      </Button>
      <Button onClick={clearFilters} id="boton-socio">
        Limpiar filtros
      </Button>
      <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: () => {
              navigate("/admin/information/resources/" + record.id);
            },
          };
        }}
        columns={columns}
        dataSource={resources_data}
        onChange={onChange && handleChange}
        scroll={{ y: 800 }}
        pagination={{ pageSize: 4 }}
      />
    </div>
  );
};

export default ResourcesTable;

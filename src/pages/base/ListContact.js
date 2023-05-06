import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Table, Button, Input, Space } from "antd";
import { useRef, useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";
import { contacts } from "./services/backend.js";

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

const Contacts = () => {
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
      title: "Email",
      dataIndex: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Asunto",
      dataIndex: "subject",
    },
    {
      title: "Fecha",
      dataIndex: "datetime",
      render: (datetime) => {
        const formattedDateTime = new Date(datetime).toLocaleString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
        return <span>{formattedDateTime}</span>;
      },
    },
    {
      title: "Respondido",
      dataIndex: "isAnswered",
      render: (isAnswered) => (isAnswered ? "Sí" : "No"),
      filters: [
        {
          text: "Sí",
          value: "Sí",
        },
        {
          text: "No",
          value: "No",
        },
      ],
      onFilter: (value, record) => record.isAnswered === (value === "Sí"),
    },
  ];

  /*DATOS*/
  const [contact_data, setContactData] = React.useState([]);

  /*CARGA DE DATOS*/
  useEffect(() => {
    contacts.get().then((response) => {
      setContactData(response.data);
    });
  }, []);
  console.log(contact_data);

  return (
    <div className="container my-5">
      <h1 className="pt-3">Mensajes</h1>
      <br></br>
        <Table
          id="table"
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                navigate("/admin/base/contacts/" + record.id);
              },
            };
          }}
          columns={columns}
          dataSource={contact_data}
          onChange={onChange}
          scroll={{ y: 400 }}
          pagination={{ pageSize: 20 }}
        />
    </div>
  );
};
export default Contacts;

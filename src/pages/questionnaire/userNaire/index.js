import React, { useEffect, useState, useRef, useCallback } from "react";
import "./index.css";
import qs from "qs";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { history } from "umi";
import { getTheNaireAnswer } from "@/services/questionNaire/index";
import PubSub from "pubsub-js";
import {
  Empty,
  Breadcrumb,
  Button,
  Table,
  Space,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  DatePicker,
  Image,
} from "antd";
export default function index(props) {
  useEffect(async () => {
    const result = await getTheNaireAnswer(props.location.query.id);
    setList(result.data);
  }, []);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [list, setList] = useState([]);
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const { TextArea } = Input;
  const handleOk = async () => {};
  const handleOk2 = async () => {};
  const deleleNaire = async (record) => {};
  //下面是筛选条件框
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
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`请输入`}
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
            搜索
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            重置
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
    onFilterDropdownVisibleChange: (visible) => {
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
  //筛选条件
  const columns = [
    {
      title: "头像",
      key: "img",
      render: (_, record) => (
        <Space>
          <Image width={100} src={record.userHeadImg}></Image>
        </Space>
      ),
    },
    {
      title: "用户名",
      dataIndex: "username",
      ...getColumnSearchProps("username"),
    },
    {
      title: "填写时间",
      dataIndex: "submitTime",
      ...getColumnSearchProps("submitTime"),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space>
          <a
            onClick={() =>
              history.push(
                "/naireDetail?id=" +
                  record.answerId +
                  "&questionnaireId=" +
                  record.questionnaireId
              )
            }
          >
            查看详情
          </a>
        </Space>
      ),
    },
  ];
  return (
    <div>
      <div className="question-container">
        <Breadcrumb>
          <Breadcrumb.Item>问卷管理</Breadcrumb.Item>
          <Breadcrumb.Item>问卷填写情况</Breadcrumb.Item>
        </Breadcrumb>
        <Table
          style={{ marginTop: "20px" }}
          columns={columns}
          dataSource={list}
          pagination={{ position: ["bottomCenter"], pageSize: 7 }}
        />
      </div>
    </div>
  );
}

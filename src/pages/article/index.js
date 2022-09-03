import React, { useEffect, useState, useRef, useCallback } from "react";
import "./index.css";
import qs from "qs";
import Highlighter from "react-highlight-words";
import { uploadFile } from "@/utils/index";
import {
  postArticle,
  getArticle,
  deleteArticle,
} from "@/services/article/index";
import {
  SearchOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { history } from "umi";
import dayjs from "dayjs";
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
  Upload,
} from "antd";
import Question from "@/components/Question/index";
export default function index() {
  useEffect(async () => {
    const result = await getArticle();
    setList(result.data);
  }, []);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [list, setList] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [fileList, setFileList] = useState([]);
  const searchInput = useRef(null);
  const { TextArea } = Input;
  const handleOk = async () => {};
  const handleOk2 = async () => {
    const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const result = await postArticle(time, fileList[0].url, url, title);
    if (result.code == 200) {
      message.success("添加成功");
      const result2 = await getArticle();
      setList(result2.data);
    } else message.error("添加失败");
  };
  const changePut = (e, item) => {
    if (item == "title") setTitle(e.target.value);
    if (item == "url") setUrl(e.target.value);
  };
  const handleChange = async (obj) => {
    if (obj.file.status === "remove") {
    }
    if (obj.file.status === "done") {
      const result = await uploadFile(obj.file.originFileObj, obj.file.uid);
      obj.fileList[obj.fileList.length - 1].url = result;
    }
    setFileList(obj.fileList);
  };
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
      title: "推文图片",
      key: "imgPath",
      render: (_, record) => <Image width={100} src={record.imgPath}></Image>,
    },
    {
      title: "推文标题",
      dataIndex: "title",
      ...getColumnSearchProps("title"),
    },
    {
      title: "更新时间",
      dataIndex: "adTime",
      ...getColumnSearchProps("time"),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="确定删除吗?"
            onConfirm={async () => {
              const result = await deleteArticle(record.id);
              if (result.code == 200) {
                message.success("删除成功");
                const result2 = await getArticle();
                setList(result2.data);
              } else message.error("删除失败");
            }}
          >
            <a style={{ color: "#C34438" }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <div>
      <div className="question-container">
        <Modal
          title="问卷添加"
          visible={isModalVisible}
          footer={
            <div>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                }}
              >
                取消
              </Button>
              <Popconfirm
                title="确定提交此表单吗"
                onConfirm={handleOk2}
                onCancel={() => {
                  setIsModalVisible(false);
                }}
                okText="确认"
                cancelText="取消"
              >
                <Button onClick={handleOk}>确认</Button>
              </Popconfirm>
            </div>
          }
        >
          <Input
            style={{ marginBottom: "5px" }}
            placeholder="请输入推文标题"
            onChange={(e) => changePut(e, "title")}
          ></Input>
          <Input
            style={{ marginBottom: "5px" }}
            placeholder="请输入跳转url"
            onChange={(e) => changePut(e, "url")}
          ></Input>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleChange}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </Modal>
        <Breadcrumb>
          <Breadcrumb.Item>推文管理</Breadcrumb.Item>
          <Breadcrumb.Item>编辑推文</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ marginTop: "20px", width: "100%" }}>
          <Button onClick={() => setIsModalVisible(true)}>添加推文</Button>
        </div>
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

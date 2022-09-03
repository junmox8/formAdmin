import React, { useEffect, useState, useRef, useCallback } from "react";
import "./index.css";
import qs from "qs";
import { getFeedback, handUp } from "@/services/feedback/index";
import Highlighter from "react-highlight-words";
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
export default function index() {
  useEffect(async () => {
    const result = await getFeedback();
    setList(result.data);
  }, []);
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [shenheId, setId] = useState(""); //待审核反馈id
  const searchInput = useRef(null);
  const introduction = useRef(null);
  const { TextArea } = Input;
  const handleOk = async () => {};
  const handleOk2 = async () => {
    const result = await handUp(
      introduction.current.resizableTextArea.textArea.defaultValue,
      shenheId
    );
    if (result.code == 200) {
      message.success("审核成功");
      setIsModalVisible(false);
      const result2 = await getFeedback();
      setList(result2.data);
    }
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
      title: "用户头像",
      key: "avatar",
      render: (_, record) => <Image width={100} src={record.headImg}></Image>,
    },
    {
      title: "用户姓名",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "反馈标题",
      dataIndex: "title",
      ...getColumnSearchProps("title"),
    },
    {
      title: "反馈时间",
      dataIndex: "submitTime",
    },
    {
      title: "审核情况",
      dataIndex: "state",
      filters: [
        {
          text: "已审核",
          value: "已审核",
        },
        {
          text: "未审核",
          value: "未审核",
        },
      ],
      onFilter: (value, record) => record.state.includes(value),
      render: (_, record) => (
        <div
          style={{ display: "flex", flexWrap: "nowrap", alignItems: "center" }}
        >
          <div
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: record.state == "未审核" ? "red" : "green",
              marginRight: "3px",
            }}
          ></div>
          <div>{record.state}</div>
        </div>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space>
          <a
            onClick={() =>
              history.push("/feedbackDetail?id=" + record.feedback.id)
            }
          >
            查看详情
          </a>
          {record.checkComment == "" ? (
            <a
              onClick={() => {
                setIsModalVisible(true);
                setId(record.id);
              }}
            >
              审核
            </a>
          ) : (
            ""
          )}
        </Space>
      ),
    },
  ];
  {
    list.forEach((item) => {
      if (item.checkComment == "") item.state = "未审核";
      else item.state = "已审核";
      item.title = item.feedback.title;
      item.submitTime = item.feedback.submitTime;
    });
  }
  return (
    <div>
      <Modal
        title="反馈审核"
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
        <TextArea
          ref={introduction}
          style={{ marginBottom: "5px" }}
          rows={4}
          placeholder="请输入审核意见"
        />
      </Modal>
      <div className="question-container">
        <Breadcrumb>
          <Breadcrumb.Item>反馈管理</Breadcrumb.Item>
          <Breadcrumb.Item>反馈列表</Breadcrumb.Item>
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

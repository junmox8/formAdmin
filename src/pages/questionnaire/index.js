import React, { useEffect, useState, useRef, useCallback } from "react";
import "./index.css";
import qs from "qs";
import {
  postQuestionNaire,
  getQuestionNaire,
  deleteQuestionNaire,
} from "@/services/questionNaire/index";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { history } from "umi";
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
} from "antd";
import Question from "@/components/Question/index";
export default function index() {
  useEffect(async () => {
    const result = await getQuestionNaire();
    setList(result.data);
    console.log(result.data);
  }, []);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [questionNumber, setNumber] = useState([]);
  const [list, setList] = useState([]);
  const [questionNaire, setNaire] = useState([]);
  const [time, setTime] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const title = useRef();
  const introduction = useRef();
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;
  const handleOk = async () => {
    if (
      !title.current.input.defaultValue ||
      !introduction.current.resizableTextArea.textArea.defaultValue
    ) {
      message.error("请填写完整信息");
    } else {
      if (questionNumber.length > 0) PubSub.publish("handup", 1);
    }
  };
  const handleOk2 = async () => {
    let obj = {
      content: JSON.stringify(questionNaire),
      endTime: time[1],
      introduction:
        introduction.current.resizableTextArea.textArea.defaultValue,
      startTime: time[0],
      title: title.current.input.defaultValue,
    };
    const result = await postQuestionNaire(obj);
    if (result.code == 200) {
      setIsModalVisible(false);
      message.success("添加表单成功");
      // const result2 = await getQuestionNaire();
      // setList(result2.data);
      window.location.reload();
    }
  };
  const sendData = async (title, select, selects) => {
    const obj = { title, select, selects };
    let arr = questionNaire;
    arr.push(obj);
    setNaire(arr);
  };
  const deleleNaire = async (record) => {
    const result = await deleteQuestionNaire(record.id);
    if (result.code == 200) {
      message.success("删除成功");
      const result2 = await getQuestionNaire();
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
      title: "问卷标题",
      dataIndex: "title",
      ...getColumnSearchProps("title"),
    },
    {
      title: "简介",
      dataIndex: "introduction",
      ...getColumnSearchProps("introduction"),
    },
    {
      title: "截止时间",
      dataIndex: "endTime",
      ...getColumnSearchProps("endTime"),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space>
          <a onClick={() => history.push("/userNaire?id=" + record.id)}>
            查看详情
          </a>
          <Popconfirm title="确定删除吗?" onConfirm={() => deleleNaire(record)}>
            <a style={{ color: "#C34438" }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
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
                  setNumber([]);
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
            ref={title}
            style={{ marginBottom: "5px" }}
            placeholder="请输入问卷标题"
          ></Input>
          <TextArea
            ref={introduction}
            style={{ marginBottom: "5px" }}
            rows={4}
            placeholder="请输入问卷简介"
          />
          <RangePicker
            // value={time}
            onChange={(_, value) => setTime(value)}
            style={{ marginBottom: "5px" }}
          />
          {questionNumber.map((item, index) => {
            return <Question sendData={sendData}></Question>;
          })}
          <Button
            onClick={() => {
              setNumber([...questionNumber, 1]);
            }}
          >
            添加问题
          </Button>
        </Modal>
        <Breadcrumb>
          <Breadcrumb.Item>问卷管理</Breadcrumb.Item>
          <Breadcrumb.Item>编辑问卷</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ marginTop: "20px", width: "100%" }}>
          <Button onClick={() => setIsModalVisible(true)}>添加问卷</Button>
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

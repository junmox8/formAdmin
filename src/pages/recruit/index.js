import React, { useEffect, useState, useRef, useCallback } from "react";
import "./index.css";
import qs from "qs";
import Highlighter from "react-highlight-words";
import { uploadFile } from "@/utils/index";
import {
  SearchOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { add, get, del } from "@/services/recruit/index";
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
    const result = await get();
    setList(result.data);
  }, []);
  const [list, setList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [title, setTitle] = useState("");
  const [place, setPlace] = useState("");
  const [responsity, setResponsity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [time1, setTime1] = useState("");
  const [time2, setTime2] = useState("");
  const [time3, setTime3] = useState(""); //活动开始结束时间 加到描述字段里
  const searchInput = useRef(null);
  const description = useRef(null);
  const { TextArea } = Input;
  const handleChange = async (obj) => {
    if (obj.file.status === "remove") {
    }
    if (obj.file.status === "done") {
      const result = await uploadFile(obj.file.originFileObj, obj.file.uid);
      obj.fileList[obj.fileList.length - 1].url = result;
    }
    setFileList(obj.fileList);
  };
  const handleOk = async () => {};
  const handleOk2 = async () => {
    const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    if (
      phoneNumber &&
      time &&
      time2 &&
      description.current.resizableTextArea.textArea.defaultValue &&
      place &&
      responsity &&
      time1 &&
      title &&
      time3 &&
      fileList[0]
    ) {
      const result = await add(
        phoneNumber,
        time,
        time2,
        time3 + description.current.resizableTextArea.textArea.defaultValue,
        place,
        responsity,
        time1,
        title,
        fileList[0].url
      );
      if (result.code == 200) {
        message.success("添加招募信息成功");
        setIsModalVisible(false);
        const result2 = await get();
        setList(result2.data);
      } else {
        message.error("添加失败,请重试");
      }
    } else message.error("请填完所有信息");
  };
  const { RangePicker } = DatePicker;
  const changePut = (e, item) => {
    if (item == "title") setTitle(e.target.value);
    if (item == "place") setPlace(e.target.value);
    if (item == "responsity") setResponsity(e.target.value);
    if (item == "phoneNumber") setPhoneNumber(e.target.value);
  };
  const changeTime = (_, value) => {
    setTime1(value[0]);
    setTime2(value[1]);
  };
  const changeTime2 = (_, value) => {
    setTime3(value[0] + "-" + value[1]);
  };
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
      title: "招募标题",
      dataIndex: "title",
      ...getColumnSearchProps("title"),
    },
    {
      title: "封面图片",
      dataIndex: "coverImg",
      render: (_, record) => <Image width={100} src={record.coverImg}></Image>,
    },
    {
      title: "招募时间",
      dataIndex: "submitTime",
    },
    {
      title: "活动地点",
      dataIndex: "location",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space>
          <a onClick={() => history.push("/recruitDetail?id=" + record.id)}>
            查看详情
          </a>
          <Popconfirm
            title="确定删除吗?"
            onConfirm={async () => {
              const result = await del(record.id);
              if (result.code == 200) {
                message.success("删除成功");
                const result2 = await get();
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
  {
    list.forEach((item) => {
      item.submitTime = item.startTime + "-" + item.endTime;
    });
  }
  return (
    <div>
      <Modal
        title="招募添加"
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
          placeholder="请输入标题"
          onChange={(e) => changePut(e, "title")}
        ></Input>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <RangePicker
          placeholder={["招募开始时间", "招募结束时间"]}
          style={{ marginBottom: "5px" }}
          showTime
          onChange={changeTime}
        />
        <RangePicker
          placeholder={["活动开始时间", "活动结束时间"]}
          style={{ marginBottom: "5px" }}
          showTime
          onChange={changeTime2}
        />
        <Input
          style={{ marginBottom: "5px" }}
          placeholder="请输入地点"
          onChange={(e) => changePut(e, "place")}
        ></Input>
        <Input
          style={{ marginBottom: "5px" }}
          placeholder="请输入举办方"
          onChange={(e) => changePut(e, "responsity")}
        ></Input>
        <Input
          style={{ marginBottom: "5px" }}
          placeholder="请输入电话"
          onChange={(e) => changePut(e, "phoneNumber")}
        ></Input>
        <TextArea
          ref={description}
          style={{ marginBottom: "5px" }}
          rows={4}
          placeholder="请输入问卷简介"
        />
      </Modal>
      <div className="question-container">
        <Breadcrumb>
          <Breadcrumb.Item>招募管理</Breadcrumb.Item>
          <Breadcrumb.Item>招募列表</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ marginTop: "20px", width: "100%" }}>
          <Button onClick={() => setIsModalVisible(true)}>添加招募</Button>
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

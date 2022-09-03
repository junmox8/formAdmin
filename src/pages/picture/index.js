import React, { useState, useEffect } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { upLoadSlide, getSlide } from "@/services/img/index";
import { uploadFile } from "@/utils/index";
import { handUpImg, getImg } from "@/services/img/index";
import "./index.css";
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
  Upload,
} from "antd";
export default function index() {
  useEffect(async () => {
    const result = await getImg();
    let arr = [];
    let asd = result.data[0].url.split(",");
    asd.forEach((item, index) => {
      let obj = {};
      (obj.url = item), (obj.uid = index);
      obj.name = "imgs" + index;
      arr.push(obj);
    });
    setFileList(arr);
  }, []);
  const [fileList, setFileList] = useState([]);
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
  const handleChange = async (obj) => {
    if (obj.file) {
      if (obj.file.status === "remove") {
      }
      if (obj.file.status === "done") {
        const result = await uploadFile(obj.file.originFileObj, obj.file.uid);
        obj.fileList[obj.fileList.length - 1].url = result;
      }
      setFileList(obj.fileList);
    }
  };
  const handUp = async () => {
    let i = "";
    fileList.forEach((item, index) => {
      if (index !== fileList.length - 1) i += item.url + ",";
      else i += item.url;
    });
    const result = await handUpImg(i);
    if (result.code == 200) {
      message.success("更改轮播图成功");
    } else message.error("更改轮播图失败");
  };

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item>图片管理</Breadcrumb.Item>
        <Breadcrumb.Item>轮播图编辑</Breadcrumb.Item>
      </Breadcrumb>
      <div className="picture-container">
        <Form>
          <Form.Item label="轮播图">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleChange}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </Form.Item>
        </Form>
        <div className="button-container">
          <Button onClick={handUp}>提交</Button>
        </div>
      </div>
    </div>
  );
}

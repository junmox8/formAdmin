import React, { useState, useEffect } from "react";
import "./index.css";
import { getById } from "@/services/feedback/index";
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
  Radio,
  Checkbox,
  Image,
} from "antd";
export default function index(props) {
  useEffect(async () => {
    const result = await getById(props.location.query.id);
    console.log(result.data);
    if (result.data.feedback.resourceUrl)
      setImgs(result.data.feedback.resourceUrl.split(","));
    if (result.data.feedback.content)
      setAnswers(result.data.feedback.content.split(","));
    if (result.data.feedback.title) setTitle(result.data.feedback.title);
    if (result.data.feedback.checkComment)
      setYijian(result.data.feedback.checkComment);
  }, []);
  const [imgs, setImgs] = useState([]);
  const [answer, setAnswers] = useState([]);
  const [title, setTitle] = useState([]);
  const [yijian, setYijian] = useState("");
  {
  }
  return (
    <div className="feedbackDetail-container">
      <Form disabled labelWrap={true} labelCol={{ span: 8, offset: 0 }}>
        <Form.Item label="反馈标题">
          <Input value={title}></Input>
        </Form.Item>
        <Form.Item label="具体地点">
          <Input value={answer[0]}></Input>
        </Form.Item>
        <Form.Item label="日期时间">
          <Input value={answer[1]}></Input>
        </Form.Item>
        <Form.Item label="水体味道">
          <Radio.Group value={answer[2]}>
            <Radio value={"1"}>腥臭味</Radio>
            <Radio value={"2"}>一般臭味</Radio>
            <Radio value={"3"}>无臭味</Radio>
            <Radio value={"4"}>其他味道</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="水生植物数量">
          <Radio.Group value={answer[3]}>
            <Radio value={"1"}>大量植物</Radio>
            <Radio value={"2"}>正常</Radio>
            <Radio value={"3"}>无</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="排口">
          <Radio.Group value={answer[4]}>
            <Radio value={"1"}>有</Radio>
            <Radio value={"2"}>无</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="水体颜色">
          <Radio.Group value={answer[5]}>
            <Radio value={"1"}>清澈见底</Radio>
            <Radio value={"2"}>绿色</Radio>
            <Radio value={"3"}>灰绿色</Radio>
            <Radio value={"4"}>黑色</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="反馈图片">
          {imgs.map((item) => {
            return <Image src={item}></Image>;
          })}
        </Form.Item>
      </Form>
      <div className="shenhe">
        {yijian.length == 0 ? (
          <div></div>
        ) : (
          <div style={{ width: "100%", height: "auto" }}>
            <Form disabled>
              <Form.Item label="审核意见">
                <Input value={yijian}></Input>
              </Form.Item>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}

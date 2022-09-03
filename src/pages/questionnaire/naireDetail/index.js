import React, { useState, useEffect } from "react";
import "./index.css";
import { getNaireDetail, getTheNaire } from "@/services/questionNaire/index";
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
} from "antd";
export default function index(props) {
  useEffect(async () => {
    const result = await getNaireDetail(props.location.query.id);
    const result2 = await getTheNaire(props.location.query.questionnaireId);
    setQuestions(JSON.parse(result2.data.content)); //问卷
    setAnswers(JSON.parse(result.data.answer)); //答案
  }, []);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  {
    questions.forEach((item) => {
      if (item.selects && typeof item.selects == "string")
        item.selects = item.selects.split(",");
      if (item.select == "3" && item.selects) {
        let a = [];
        item.selects.map((item, index) => {
          let b = {
            label: item,
            value: index,
          };
          a.push(b);
        });
        item.checkbox = a;
      }
    });
    console.log(questions);
  }
  return (
    <div>
      <div className="naire-container">
        <Form disabled labelWrap={true} labelCol={{ span: 8, offset: 0 }}>
          {answers.map((item, index) => {
            return (
              <Form.Item label={questions[index].title}>
                {item.select == "1" ? (
                  <Input value={item.text}></Input>
                ) : item.select == "2" ? (
                  <Radio.Group value={item.radio}>
                    {questions[index].selects.map((i, ind) => {
                      return <Radio value={ind}>{i}</Radio>;
                    })}
                  </Radio.Group>
                ) : (
                  <Checkbox.Group
                    options={questions[index].checkbox}
                    defaultValue={item.checkbox}
                  />
                )}
              </Form.Item>
            );
          })}
        </Form>
      </div>
    </div>
  );
}

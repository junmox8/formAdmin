import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import { Input, Select } from 'antd';
import PubSub from 'pubsub-js';
export default function index(props) {
  useEffect(() => {
    PubSub.subscribe('handup', (_, data) => {
      props.sendData(
        title.current?.input?.defaultValue ? title.current?.input?.defaultValue : '',
        selects.current.input.alt,
        select.current?.input?.defaultValue ? select.current?.input?.defaultValue : '',
      );
    });
  }, []);
  const title = useRef();
  const select = useRef();
  const selects = useRef();
  const [selectValue, setSelectValue] = useState('1');
  const { Option } = Select;
  return (
    <div className="question">
      <Input ref={title} placeholder="请输入问题标题" style={{ width: '30%' }}></Input>
      <Select
        placeholder="请选择"
        style={{
          width: 120,
        }}
        onChange={(value) => {
          setSelectValue(value);
          selects.current.input.alt = value;
        }}
      >
        <Option value="1">输入框</Option>
        <Option value="2">单选</Option>
        <Option value="3">多选</Option>
      </Select>
      <Input
        style={{
          display: selectValue == 2 || selectValue == 3 ? 'block' : 'none',
          width: '40%',
        }}
        placeholder="输入选项名称,格式：xx,xx"
        ref={select}
      ></Input>
      <Input style={{ display: 'none' }} ref={selects}></Input>
    </div>
  );
}

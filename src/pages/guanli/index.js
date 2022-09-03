import React, { useEffect, useState, useRef } from 'react';
import './index.css';
import qs from 'qs';
import { getAllAdmin, deleteAdmin, postAdmin, updateAdmin } from '@/services/user/index';
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
} from 'antd';
export default function index() {
  useEffect(async () => {
    setType(localStorage.getItem('type'));
    const result = await getAllAdmin();
    setUsers(
      result.data.filter((item) => {
        return item.identity == 2;
      }),
    );
  }, []);
  const [type, setType] = useState(1);
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reviseId, setId] = useState(0);
  const addUsername = useRef();
  const addPassword = useRef();
  const reviseUsername = useRef();
  const revisePassword = useRef();
  const deleteUser = async (id) => {
    const result = await deleteAdmin(id);
    if (result.code === 200) {
      message.success('删除用户成功');
      const result = await getAllAdmin();
      setUsers(
        result.data.filter((item) => {
          return item.identity == 2;
        }),
      );
    }
  };
  const handleOk = async () => {
    const result = await postAdmin(
      addUsername.current.input.defaultValue,
      addPassword.current.input.defaultValue,
    );
    if (result.code === 200) {
      message.success('添加用户成功');
      const result = await getAllAdmin();
      setUsers(
        result.data.filter((item) => {
          return item.identity == 2;
        }),
      );
    }
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleOk2 = async () => {
    const result = await updateAdmin(
      reviseUsername.current.input.defaultValue,
      revisePassword.current.input.defaultValue,
      reviseId,
    );
    if (result.code === 200) {
      message.success('修改成功');
      const result = await getAllAdmin();
      setUsers(
        result.data.filter((item) => {
          return item.identity == 2;
        }),
      );
    }
    setIsModalVisible2(false);
  };
  const handleCancel2 = () => {
    setIsModalVisible2(false);
  };
  const showModal = (username, password, id) => {
    setUsername(username);
    setPassword(password);
    setId(id);
    setIsModalVisible2(true);
  };
  const columns = [
    {
      title: '账号',
      dataIndex: 'username',
    },
    {
      title: '密码',
      dataIndex: 'password',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <a onClick={() => showModal(record.username, record.password, record.id)}>编辑</a>
          <Popconfirm title="确定删除吗?" onConfirm={() => deleteUser(record.id)}>
            <a style={{ color: '#C34438' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <div>
      <div style={{ display: type == 2 ? 'block' : 'none' }} className="admin-container">
        <div
          style={{
            width: '100%',
            height: '80%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Empty description="仅超级管理员可查看" />
        </div>
      </div>
      <div style={{ display: type == 1 ? 'block' : 'none' }} className="admin-container">
        <Modal
          title="普通管理员添加"
          maskClosable={false}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form>
            <Form.Item label="账号">
              <Input ref={addUsername}></Input>
            </Form.Item>
            <Form.Item label="密码">
              <Input ref={addPassword}></Input>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="普通管理员编辑"
          maskClosable={false}
          visible={isModalVisible2}
          onOk={handleOk2}
          onCancel={handleCancel2}
        >
          <Form>
            <Form.Item label="账号">
              <Input ref={reviseUsername} placeholder={username}></Input>
            </Form.Item>
            <Form.Item label="密码">
              <Input ref={revisePassword} placeholder={password}></Input>
            </Form.Item>
          </Form>
        </Modal>
        <Breadcrumb>
          <Breadcrumb.Item>账号管理</Breadcrumb.Item>
          <Breadcrumb.Item>编辑账号</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ marginTop: '20px', width: '100%' }}>
          <Button onClick={() => setIsModalVisible(true)}>添加成员</Button>
        </div>
        <Table
          style={{ marginTop: '20px' }}
          columns={columns}
          dataSource={users}
          pagination={{ position: ['bottomCenter'], pageSize: 7 }}
        />
      </div>
    </div>
  );
}

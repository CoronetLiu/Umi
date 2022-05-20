import React, { useEffect, useState } from 'react';
import { Space, Modal, Form, Input, Col, message } from 'antd';
import { connect, useModel, history } from 'umi';
import cookie from 'react-cookies';
import { logout, updatePassword } from './service';
import styles from './index.less';
import Avatar from './AvatarDropdown';
import defaultSettings from '../../../config/defaultSettings';

const labelCol = {
  labelCol: {
    span: 6,
  },
};

const GlobalHeaderRight = (props) => {
  const { initialState } = useModel('@@initialState');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [form] = Form.useForm();
  const { validateFields, resetFields, setFieldsValue } = form;

  useEffect(() => {
    const { dispatch } = props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, []);

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  const handleSubmit = () => {
    validateFields().then(async (values) => {
      setLoading(true);
      let res = await updatePassword({
        oldPassword: values.originPassword,
        newPassword: values.newPassword,
      });
      setLoading(false);
      if (res) {
        if (res.code === 1) {
          setVisible(false);
          message.success('修改成功');
          cookie.remove('code', { path: '/' });
          let result = await logout();
          if (result && result.code == 1) {
            history.push('/login');
          } else {
            message.error('网络故障');
          }
        } else {
          message.error(res.data);
        }
      } else {
        message.error('修改失败');
      }
    });
  };

  const confirmLogout = async () => {
    cookie.remove('code', { path: '/' });
    let res = await logout();
    if (res && res.code == 1) {
      message.success('已退出');
      history.push('/login');
    } else {
      message.error('退出失败');
    }
  };

  const afterClose = () => {
    resetFields();
  };

  return (
    <Space className={className}>
      {window.location.pathname == '/login/subSystem' ? null : (
        <div
          className={styles.back}
          onClick={() => {
            history.push('/login/subSystem');
          }}
        >
          <i></i>
          <span>返回系统页</span>
        </div>
      )}
      <Avatar
        setVisible={setVisible}
        setAboutVisible={setAboutVisible}
        setLogoutVisible={setLogoutVisible}
      />
      <Modal
        title="修改密码"
        width={400}
        visible={visible}
        onOk={handleSubmit}
        confirmLoading={loading}
        onCancel={() => setVisible(false)}
        style={{ textAlign: 'center', top: '30%' }}
        afterClose={afterClose}
      >
        <Form {...labelCol} form={form}>
          <Col span={24}>
            <Form.Item
              label="原始密码"
              name="originPassword"
              rules={[
                {
                  required: true,
                  message: '原始密码不能为空',
                },
              ]}
            >
              <Input.Password placeholder="请输入原始密码" />
            </Form.Item>
            <Form.Item
              label="新密码"
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: '新密码不能为空',
                },
                {
                  min: 6,
                  max: 20,
                  message: '长度必须为6~20',
                },
                {
                  pattern:
                    /^([0-9]+[a-zA-Z]+[0-9a-zA-Z.!@#$%^&*()\-=_+?]*)$|^([a-zA-Z]+[0-9]+[0-9a-zA-Z.!@#$%^&*()\-=_+?]*)$|^([0-9]+[.!@#$%^&*()\-=_+?]+[0-9a-zA-Z.!@#$%^&*()\-=_+?]*)$|^([.!@#$%^&*()\-=_+?]+[0-9]+[0-9a-zA-Z.!@#$%^&*()\-=_+?]*)$|^([a-zA-Z]+[.!@#$%^&*()\-=_+?]+[0-9a-zA-Z.!@#$%^&*()\-=_+?]*)$|^(.[!@#$%^&*()\-=_+?]+[a-zA-Z]+[0-9a-zA-Z.!@#$%^&*()\-=_+?]*)$/,
                  message: '必须为字母、数字、符号任意两者的组合',
                },
              ]}
            >
              <Input.Password placeholder="请输入新密码" />
            </Form.Item>
            <Form.Item
              label="确认新密码"
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                {
                  required: true,
                  message: '请再次确认新密码',
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('两次密码输入不一致!');
                  },
                }),
              ]}
            >
              <Input.Password placeholder="请再次确认新密码" />
            </Form.Item>
          </Col>
          <Col className={styles.change_pw_explain}>
            <Form.Item label="说明">
              <p>1.必须为字母、数字、符号任意两者的组合</p>
              <p>2.不少于6位，不大于20位</p>
              <p>3.不能和原密码相同</p>
            </Form.Item>
          </Col>
        </Form>
      </Modal>
      <Modal
        title="关于"
        width={400}
        visible={aboutVisible}
        onCancel={() => setAboutVisible(false)}
        style={{ textAlign: 'center', top: '30%' }}
        footer={
          <p
            style={{
              height: '15px',
              margin: 0,
              fontSize: '12px',
              color: '#333333',
              textAlign: 'center',
            }}
          >
            &copy; 2022 Umi
          </p>
        }
        wrapClassName={styles.about_sys_version}
      >
        <i></i>
        <div
          style={{
            marginTop: 10,
            fontSize: '18px',
            fontWeight: 'bold',
          }}
        >
          <p>{defaultSettings.title}</p>
          <p>v1.0</p>
        </div>
      </Modal>
      <Modal
        title="提示"
        width={300}
        visible={logoutVisible}
        onOk={confirmLogout}
        onCancel={() => setLogoutVisible(false)}
        style={{ textAlign: 'center', top: '30%' }}
        bodyStyle={{ padding: '20px 20px 0' }}
        className={styles.logout_box}
      >
        <Form {...labelCol} form={form}>
          <Col span={24}>
            <p>确定退出系统吗？</p>
          </Col>
        </Form>
      </Modal>
    </Space>
  );
};

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(GlobalHeaderRight);

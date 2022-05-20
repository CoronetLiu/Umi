import React, { useEffect, useState } from 'react';
import { message, Form, Input, Button } from 'antd';
import { history } from 'umi';
import cookie from 'react-cookies';
import JSEncrypt from 'jsencrypt';
import { parse } from 'qs';
import { login } from './service';
import { getPermissionList } from '@/services/api';
import CaptchaCode from './components/captchaCode';
import styles from './index.less';
import defaultSettings from '../../../config/defaultSettings';

const UserLogin = () => {
  const [loading, setLoading] = useState(false);
  const [loginCode, setLoginCode] = useState();

  useEffect(() => {
    if (cookie.load('code')) {
      window.location.href = '/login/subSystem';
    }
  }, []);

  const handleSubmit = async (values) => {
    cookie.remove('code', { path: '/' });
    localStorage.removeItem('antd-pro-authority');
    //登录...用户信息...权限
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(
      'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvucee5/4aWggajN5sulRpN9IUwY6e8JSFbPz9pKS/d98g4uDL6+nLKy3YgPgjA8MzCPMYEctCCt2i8y9EXEtNOrzRleNmQjgDlPmNNF4sqQFpuwURtiEmNrRPyapZpAq9IKo1vG4hQKMHEyne57cGp/hGjmE2IFS3KJmPouRLXpTwqBtCF072T3rH2f5BQkIVqtMQ5tUcrySvzrKDhbGczI4leHx/R+0Iog0OLOO4VHtqb8zZWf6m3UIYuWbFuDye4zSYniMQCzDSiMw6i9ZtN5KVgQ/Q4R/olaTl4+XWsx/cEHO7mBA2/o2Hnykr/cXnMjHZmDOqQALJvb2vja/5wIDAQAB',
    );
    values.password = encrypt.encrypt(values.password);
    setLoading(true);
    const result = await login({ ...values, type: 'account' });
    setLoading(false);
    if (result?.code == 1) {
      message.success('登陆成功！');
      cookie.save('code', result.data.code, { path: '/' });
      // 获取权限
      const auth = await getPermissionList({
        id: '',
        permissionValue: '',
        limit: 'all',
      });
      if (auth?.code == 1) {
        let permissionArray = [];
        let paramTemp = auth.data;
        for (let i = 0; i < paramTemp.length; i++) {
          permissionArray.push(paramTemp[i].permissionValue);
        }
        localStorage.setItem('antd-pro-authority', JSON.stringify(permissionArray));

        // 判断如何跳转
        const urlParams = new URL(window.location.href);
        const params = parse(window.location.href.split('?')[1]);
        let { redirect, url } = params;
        if (redirect) {
          // 管理系统的重定向
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
            window.location.href = redirect;
          } else {
            window.location.href = redirect;
          }
        } else if (url) {
          // 子系统的重定向
          let returnUrl = decodeURIComponent(url);
          window.location.href = returnUrl;
        } else {
          // 进系统选择页
          history.push('/login/subSystem');
        }
      }
    }
  };

  const getCode = (code) => {
    setLoginCode(code);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.mainContainer}>
          <Form onFinish={handleSubmit} onFinishFailed={onFinishFailed}>
            <h1
              className={styles.formtitle}
              style={{ fontSize: window.screen.width > 1366 ? '32px' : '28px' }}
            >
              <span>欢迎登录</span>
              <span>{defaultSettings.title}</span>
            </h1>
            <div className={styles.inputgroups}>
              <div className={styles.InputItem}>
                <span className={styles.userIcon}></span>
                <Form.Item
                  className={styles.userItem}
                  name="username"
                  rules={[{ required: true, message: '请输入用户名！' }]}
                >
                  <Input className={styles.inputstyle} placeholder="用户名" />
                </Form.Item>
              </div>
              <div className={styles.InputItem}>
                <span className={styles.pwdIcon}></span>
                <Form.Item
                  className={styles.userItem}
                  name="password"
                  rules={[{ required: true, message: '请输入密码！' }]}
                >
                  <Input type="password" className={styles.inputstyle} placeholder="密码" />
                </Form.Item>
              </div>
              <div className={styles.InputItem}>
                <div className={styles.captchaWrapper}>
                  <span className={styles.codeIcon}></span>
                  <Form.Item
                    className={styles.codeItem}
                    name="captchacode"
                    rules={[
                      {
                        required: true,
                        message: '请输入验证码！',
                      },
                      ({ getFieldValue }) => ({
                        validator(value) {
                          if (!value || getFieldValue('captchacode') === loginCode) {
                            return Promise.resolve();
                          }
                          return Promise.reject('请输入正确验证码!');
                        },
                      }),
                    ]}
                  >
                    <Input className={styles.inputCodestyle} placeholder="验证码" />
                  </Form.Item>
                  <CaptchaCode width={80} getCode={getCode} />
                </div>
              </div>
              <div className={styles.InputItem}>
                <Form.Item className={styles.submitItem} name="submit">
                  <Button block size="large" loading={loading} type="primary" htmlType="submit">
                    登录
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;

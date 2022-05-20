import React from 'react';
import { Avatar, Menu } from 'antd';
import { connect } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const AvatarDropdown = ({ currentUser, setLogoutVisible, setVisible, setAboutVisible }) => {
  const onMenuClick = (event) => {
    const { key } = event;
    if (key === 'logout') {
      setLogoutVisible(true);
    } else if (key === 'changePwd') {
      setVisible(true);
    } else if (key === 'about') {
      setAboutVisible(true);
    }
  };

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="changePwd">修改密码</Menu.Item>
      <Menu.Item key="about">关于</Menu.Item>
      <Menu.Item key="logout">退出</Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} alt="avatar" />
        <span className={styles.name}>{currentUser?.realname || currentUser?.username}</span>
      </span>
    </HeaderDropdown>
  );
};

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);

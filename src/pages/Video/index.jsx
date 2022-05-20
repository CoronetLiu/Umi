import React, { useState } from 'react';
import { Button } from 'antd';
import { PlaySquareOutlined, UndoOutlined, CarOutlined } from '@ant-design/icons';
import { useAccess, Access } from 'umi';
import styles from './index.less';
import RealVideo from './RealVideo';
import HistoryVideo from './HistoryVideo';
import MockVideo from './MockVideo';

const Video = () => {
  const access = useAccess(); // 用来获取所有的权限
  const [realVisible, setRealVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [mockVisible, setMockVisible] = useState(false);
  const [cSite, setCSite] = useState({ siteCode: '00000101', siteName: '模拟站点' });

  return (
    <div className={styles.videoBox}>
      <div className={styles.rhBtn}>
        <Access accessible={access['pms:video:realVideo']}>
          <Button
            type="primary"
            shape="round"
            icon={<PlaySquareOutlined />}
            size={'large'}
            onClick={() => setRealVisible(true)}
          >
            实时视频
          </Button>
        </Access>
        <Access accessible={access['pms:video:historyVideo']}>
          <Button
            type="primary"
            ghost
            shape="round"
            icon={<UndoOutlined />}
            size={'large'}
            onClick={() => setHistoryVisible(true)}
          >
            历史视频
          </Button>
        </Access>
        <Access accessible={access['pms:video:mockVideo']}>
          <Button
            type="dashed"
            ghost
            danger
            shape="round"
            icon={<CarOutlined />}
            size={'large'}
            onClick={() => setMockVisible(true)}
          >
            模拟视频
          </Button>
        </Access>
      </div>
      <RealVideo visible={realVisible} setVisible={setRealVisible} cSite={cSite} />
      <HistoryVideo visible={historyVisible} setVisible={setHistoryVisible} cSite={cSite} />
      <MockVideo visible={mockVisible} setVisible={setMockVisible} cSite={cSite} />
    </div>
  );
};

export default Video;

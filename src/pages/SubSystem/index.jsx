import React, { useEffect, useState } from 'react';
import { Carousel } from 'antd';
import { queryFakeList } from './service';
import styles from './index.less';
import RightContent from '@/components/RightContent';
import logo from '@/assets/logo.svg';
import defaultSettings from '../../../config/defaultSettings';
import { autoAddress } from '@/utils/utils';

const SubSystem = () => {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    getLists();
  }, []);

  const getLists = async () => {
    let res = await queryFakeList({
      count: 10,
    });
    if (res?.code == 1) {
      setLists(res.data || []);
    }
  };

  return (
    <div className={styles.list_menu_wrapper}>
      <div className={styles.top_container}>
        <div>
          <img src={logo} alt="" />
          <p>{defaultSettings.title}</p>
        </div>
        <RightContent />
      </div>
      <div className={styles.enforceStatistic}>
        <div className={styles.enforceStatistic_banner}>
          <Carousel autoplay>
            <div className={styles.enforceStatistic_banner1}></div>
            <div className={styles.enforceStatistic_banner2}></div>
          </Carousel>
        </div>
        <div className={styles.enforceStatistic_systemType}>
          {lists.length > 0 &&
            lists.map((item) => {
              let url = autoAddress(defaultSettings.pmsPort) + '/index';
              if (item.auth == 'bms') {
                url = autoAddress(defaultSettings.subPort) + '/index';
              } else if (item.auth == 'ems') {
                url = autoAddress(defaultSettings.subPort) + '/index';
              } else if (item.auth == 'vms') {
                url = autoAddress(defaultSettings.subPort) + '/index';
              }
              /*大屏监控类打开新页面*/
              return (
                <a
                  key={item.auth}
                  href={url}
                  target={item.auth.indexOf('vms') >= 0 ? '_blank' : '_self'}
                  rel={'noreferrer'}
                >
                  <dl>
                    <dt></dt>
                    <dd>
                      <p>{item?.title || ''}</p>
                    </dd>
                  </dl>
                </a>
              );
            })}
        </div>
        <div className={styles.enforceStatistic_plugType}>
          <a>
            <div>
              <p>视频播放插件</p>
              <i></i>
            </div>
          </a>
          <a>
            <div>
              <p>文件预览插件</p>
              <i></i>
            </div>
          </a>
          <a>
            <div>
              <p>系统操作手册</p>
              <i></i>
            </div>
          </a>
          <a>
            <div>
              <p>系统安装部署手册</p>
              <i></i>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SubSystem;

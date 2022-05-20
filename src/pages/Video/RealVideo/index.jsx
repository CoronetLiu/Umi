import { Modal, Table, message } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import videojs from 'video.js';
import videozhCN from 'video.js/dist/lang/zh-CN.json'; //播放器中文，不能使用.js文件
import 'video.js/dist/video-js.css'; //样式文件注意要加上
import styles from './index.less';
import { getRealUrl, getData, getAuditDetail } from '../service';
import defaultEmptyVideo from '@/assets/default/defaultEmptyVideo.png';
import defaultEmptyImg from '@/assets/default/defaultEmptyImg.png';

videojs.addLanguage('zh-CN', videozhCN);

let global = [];
let player;
const Real = (props) => {
  const { visible, setVisible, cSite } = props;
  const [dataSource, setDataSource] = useState([]);
  const dataSourceRef = useRef([]);
  dataSourceRef.current = dataSource;

  //实时视频的URL
  const [showReal, setShowReal] = useState(false);

  //头部图片的URL
  const [headPicSrc, setHeadPicSrc] = useState('');
  const headPicSrcRef = useState('');
  headPicSrcRef.current = headPicSrc;

  //车牌图片的URL
  const [platePicSrc, setPlatePicSrc] = useState('');
  const platePicSrcRef = useState('');
  platePicSrcRef.current = platePicSrc;

  const realRef = useRef();

  const columns = [
    {
      title: '检测时间',
      dataIndex: 'detectionTime',
      align: 'left',
      ellipsis: true,
      width: '15%',
    },
    {
      title: '车牌号',
      dataIndex: 'vehPlate',
      align: 'left',
      width: '10%',
    },
    {
      title: '轴数',
      dataIndex: 'axleNum',
      align: 'left',
      width: '8%',
    },
    {
      title: '限重(kg)',
      dataIndex: 'limitWeight',
      align: 'left',
      width: '12%',
    },
    {
      title: '车货总重(kg)',
      dataIndex: 'totalWeight',
      align: 'left',
      width: '12%',
    },
    {
      title: '超限重量(kg)',
      dataIndex: 'wholeOver',
      align: 'left',
      width: '12%',
    },
    {
      title: '是否超限',
      dataIndex: 'overLimitFlag',
      key: 'overLimitFlag',
      width: '10%',
      render(_, record, index) {
        return _ == '1' ? <span style={{ color: '#F2627B' }}>是</span> : <span>否</span>;
      },
    },
    {
      title: '超限率',
      dataIndex: 'overRate',
      width: '8%',
      align: 'left',
      render(_, record) {
        return <span style={{ color: _ ? '#D84557' : '#fff' }}>{_}%</span>;
      },
    },
  ];

  useEffect(() => {
    if (visible) {
      getRealUrlFn();
    }

    return () => {
      if (realRef.current) {
        clearInterval(realRef.current);
      }
      for (let i = 0; i < global.length; i++) {
        if (global[i]) {
          clearTimeout(global[i]);
        }
      }
      global = [];
    };
  }, [visible]);

  const getRealUrlFn = async () => {
    let res = await getRealUrl({
      siteCode: cSite.siteCode,
    });
    if (res?.code == 1 && res.data) {
      setShowReal(true);
      //初始化video
      player = videojs(
        'videoPlayer',
        {
          autoplay: true, //自动播放
          language: 'zh-CN',
          controls: true, //控制条
          preload: 'auto', //自动加载
          errorDisplay: true, //错误展示
          width: 750, //宽
          height: 424, //高
          sources: [
            {
              src: res.data,
              type: 'application/x-mpegURL', //类型
              // type: "rtmp/flv", //类型
              // type: 'video/mp4',
            },
          ],
        },
        function onPlayerReady() {
          console.log('播放实时视频...');
          this.play();
          //请求数据
          getDataFn();
          let realTimer = setInterval(() => {
            getDataFn();
          }, 1000 * 10);
          realRef.current = realTimer;
        },
      );
    } else {
      setShowReal(false);
      message.info('未获取到视频源');
    }
  };

  // 查询数据
  const getDataFn = async (params) => {
    let start = '';
    let s = '';
    let e = '';
    if (params) {
      //查历史
      start = params[0];
      s = moment(params[0]).format('YYYY-MM-DD HH:mm:ss');
      e = moment(params[1]).format('YYYY-MM-DD HH:mm:ss');
    } else {
      let now = new Date();
      let end = new Date(now.getTime());
      start = new Date(now.getTime() - 1000 * 10); //查询10秒前数据
      s = moment(start).format('YYYY-MM-DD HH:mm:ss');
      e = moment(end).format('YYYY-MM-DD HH:mm:ss');
    }
    let res = await getData({
      siteCode: cSite.siteCode,
      detectionTimeStart: s,
      detectionTimeEnd: e,
    });
    if (res && res.code == 1) {
      if (!res.data.pageInfo.list.length) return; //列表为空
      renderList(start, res.data.pageInfo.list);
    }
  };

  // 循环返回的列表
  const renderList = (startSearchTime, list) => {
    let startTime = startSearchTime;

    list.map((item, index) => {
      if (item.detectionTime) {
        let nextTime = new Date(item.detectionTime).getTime();
        insertItem(item, index, nextTime - startTime);
      }
    });
  };

  // 插入新数据
  const insertItem = (item, index, timeOut) => {
    ((item, index, timeOut) => {
      let timer = setTimeout(async () => {
        let oldData = JSON.parse(JSON.stringify(dataSourceRef.current));
        setDataSource([item].concat(oldData));
        let detail = await getAuditDetail({
          busiNum: item.busiNum,
        });
        if (detail?.code == 1) {
          setHeadPicSrc(detail.data.headPic);
          setPlatePicSrc(detail.data.platePic);
        }
      }, timeOut);
      global.real[index] = timer;
    })(item, index, timeOut);
  };

  const afterClose = () => {
    setShowReal(false);
    setDataSource([]);
    setHeadPicSrc('');
    setPlatePicSrc('');
    if (player) {
      player.pause();
      player.dispose();
      player = null;
    }
  };

  return (
    <Modal
      title={cSite.siteName}
      visible={visible}
      mask={false}
      getContainer={false}
      wrapClassName={styles.videoModal}
      footer={null}
      width={'900px'}
      style={{
        textAlign: 'center',
        height: '630px',
        top: '60px',
        paddingBottom: '0',
      }}
      bodyStyle={{
        padding: '20px',
        background: 'transparent',
      }}
      onCancel={() => setVisible(false)}
      afterClose={afterClose}
      destroyOnClose={true}
    >
      <div>
        <div className={styles.rec_top}>
          <div>
            <div style={{ height: '100%', width: showReal ? '100%' : 0, overflow: 'hidden' }}>
              <video id="videoPlayer" className="video-js vjs-big-play-centered vjs-fluid"></video>
            </div>
            <img src={defaultEmptyVideo} style={{ display: !showReal ? 'block' : 'none' }} alt="" />
          </div>
          <div>
            {headPicSrcRef.current ? (
              <div>
                <img src={headPicSrcRef.current} alt="" />
              </div>
            ) : (
              <div>
                <img src={defaultEmptyImg} />
              </div>
            )}
            {platePicSrcRef.current ? (
              <div>
                <img src={platePicSrcRef.current} alt="" />
              </div>
            ) : (
              <div>
                <img src={defaultEmptyImg} />
              </div>
            )}
          </div>
        </div>
        <div className={styles.centerTitle}>检测数据</div>
        <div className={styles.rec_table}>
          <Table
            rowKey="id"
            dataSource={dataSource}
            columns={columns}
            bordered={false}
            size="small"
            rowClassName={(record, index) => {
              let className = styles.dark_row;
              if (index % 2 === 1) className = styles.light_row;
              return className;
            }}
            pagination={{
              showSizeChanger: false,
              defaultCurrent: 1,
              defaultPageSize: 5,
              position: ["center','center"],
              showTotal: (total) => `共 ${total} 条`,
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default Real;

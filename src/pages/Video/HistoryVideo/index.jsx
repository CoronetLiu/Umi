import { Modal, Table, message, Form, Row, Col, DatePicker, Button } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import videojs from 'video.js';
import videozhCN from 'video.js/dist/lang/zh-CN.json'; //播放器中文，不能使用.js文件
import 'video.js/dist/video-js.css'; //样式文件注意要加上
import styles from './index.less';
import { getHistoryUrl, getData, getAuditDetail } from '../service';
import defaultEmptyVideo from '@/assets/default/defaultEmptyVideo.png';
import defaultEmptyImg from '@/assets/default/defaultEmptyImg.png';

videojs.addLanguage('zh-CN', videozhCN);

const { RangePicker } = DatePicker;

let global = [];
let playerHistory;
const History = (props) => {
  const { visible, setVisible, cSite } = props;
  const [form] = Form.useForm();
  const { resetFields } = form;
  const [dataSource, setDataSource] = useState([]);
  const dataSourceRef = useRef([]);
  dataSourceRef.current = dataSource;

  //历史视频的URL
  const [showHistory, setShowHistory] = useState(false);

  //头部图片的URL
  const [headPicSrc, setHeadPicSrc] = useState('');
  const headPicSrcRef = useState('');
  headPicSrcRef.current = headPicSrc;

  //车牌图片的URL
  const [platePicSrc, setPlatePicSrc] = useState('');
  const platePicSrcRef = useState('');
  platePicSrcRef.current = platePicSrc;

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
    return () => {
      for (let i = 0; i < global.length; i++) {
        if (global[i]) {
          clearTimeout(global[i]);
        }
      }
      global = [];
    };
  }, [visible]);

  const getHistoryUrlFn = async (params) => {
    let res = await getHistoryUrl({
      siteCode: cSite.siteCode,
      beginTime: moment(params[0]).format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment(params[1]).format('YYYY-MM-DD HH:mm:ss'),
    });
    if (res?.code == 1 && res.data) {
      setShowHistory(true);
      if (playerHistory) {
        playerHistory.pause();
        let src = {
          src: res.data,
          type: 'application/x-mpegURL', //类型
        };
        playerHistory.src(src);
        playerHistory.load(src);
        playerHistory.play();
        console.log('播放历史视频......');
      } else {
        //初始化video
        playerHistory = videojs(
          'videoPlayerHistory',
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
                // src: 'http://10.100.16.37:8090/hls1/test.m3u8',
                src: res.data,
                type: 'application/x-mpegURL', //类型
                // type: "rtmp/flv", //类型
                // type: 'video/mp4',
              },
            ],
          },
          function onPlayerReady() {
            console.log('播放历史视频...');
            this.play();
            getDataFn(params);
          },
        );
      }
    } else {
      setShowHistory(false);
      message.info('未查询到视频');
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

  const onFinish = (values) => {
    console.log(values);
    if (!values.searchDate) {
      message.info('请选择查询日期');
      return;
    }
    if (
      new Date(values.searchDate[1]).getTime() - new Date(values.searchDate[0]).getTime() >
      30 * 60 * 1000
    ) {
      message.error('已超过最大时间选择范围30min，请重新选择！');
      return;
    }

    //切换为历史
    getHistoryUrlFn(values.searchDate);
  };

  const disabledDate = (value) => {
    if (value.format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')) return false;
    return (
      new Date(value.format('YYYY-MM-DD 00:00:00')) -
        new Date(moment().format('YYYY-MM-DD HH:mm:ss')) >
      1000 * 60 * 60 * 2
    );
  };

  const afterClose = () => {
    resetFields();
    setShowHistory(false);
    setDataSource([]);
    setHeadPicSrc('');
    setPlatePicSrc('');
    if (playerHistory) {
      playerHistory.pause();
      playerHistory.dispose();
      playerHistory = null;
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
        height: '690px',
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
        <Form name="basic" form={form} onFinish={onFinish}>
          <Row span={24}>
            <Col>
              <Form.Item label="" name="searchDate">
                <RangePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime={true}
                  disabledDate={disabledDate}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item className={styles.subBtn}>
                <Button htmlType="submit">查询</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div className={styles.rec_top}>
          <div>
            <div style={{ height: '100%', width: showHistory ? '100%' : 0, overflow: 'hidden' }}>
              <video
                id="videoPlayerHistory"
                className="video-js vjs-big-play-centered vjs-fluid"
              ></video>
            </div>
            <img
              src={defaultEmptyVideo}
              style={{ display: !showHistory ? 'block' : 'none' }}
              alt=""
            />
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

export default History;

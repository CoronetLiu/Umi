import React, { useState, useEffect } from 'react';
import { Drawer, Button, Carousel, Descriptions, Modal } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons/lib';
import Viewer from 'react-viewer';
import { Player, BigPlayButton, LoadingSpinner } from 'video-react';
import styles from './index.less';
import defaultImg from '@/assets/default/defaultEmptyImg.png';
import defaultVideo from '@/assets/default/defaultEmptyVideo.png';

const BackIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2472213_5m92dllin28.js',
});

const Detail = ({ visible, setVisible, detailMsg }) => {
  const [picList, setPicList] = useState([]);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [playerVisible, setPlayerVisible] = useState(false);

  const onClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    let arr = [];
    Object.keys(detailMsg).forEach(function (item) {
      if (item == 'headPic' || item == 'tailPic' || item == 'wholePic') {
        if (detailMsg[item] !== null) {
          arr.push({ src: detailMsg[item] });
        }
      }
    });
    setPicList(arr);
  }, [visible]);

  return (
    <Drawer
      className={styles.detailDrawer}
      mask={false}
      getContainer={() => document.getElementsByTagName('main')[0]}
      closable={false}
      onClose={onClose}
      style={{
        position: 'absolute',
        padding: '0',
        top: '0',
        width: '100%',
        zIndex: !visible ? -1 : 99,
      }}
      visible={visible}
    >
      <div className={styles.detailContainer}>
        <div className={styles.backBox}>
          <Button type="primary" onClick={onClose}>
            <BackIcon type="icon-back" />
            返回{' '}
          </Button>
          <div>{detailMsg.vehPlate} 检测数据详情</div>
        </div>

        <div className={styles.detailContent}>
          <div className={styles.baseInfo}>
            <div className={styles.blockContainer}>
              <div className={styles.title}>基本信息</div>
              <div className={styles.content}>
                <Descriptions column={4}>
                  <Descriptions.Item label="车牌号">{detailMsg?.vehPlate}</Descriptions.Item>
                  <Descriptions.Item label="检测时间">{detailMsg?.detectionTime}</Descriptions.Item>
                  <Descriptions.Item label="站点名称">{detailMsg?.siteName}</Descriptions.Item>
                  <Descriptions.Item label="轴数">{detailMsg?.axleNum}</Descriptions.Item>

                  <Descriptions.Item label="轴型">{detailMsg?.axleGroupType}</Descriptions.Item>
                  <Descriptions.Item label="车道号">{detailMsg?.roadwayNumber}</Descriptions.Item>
                  <Descriptions.Item label="方向">
                    {detailMsg?.roadwayDirection == 0 ? '上行' : '下行'}
                  </Descriptions.Item>
                  <Descriptions.Item label="经营许可证号">
                    {detailMsg?.businessPermitNum}
                  </Descriptions.Item>

                  <Descriptions.Item label="道路运输证号">
                    {detailMsg?.roadTransportPermitNum}
                  </Descriptions.Item>
                  <Descriptions.Item label="从业资格证书">
                    {detailMsg?.qualificationCode}
                  </Descriptions.Item>
                  <Descriptions.Item label="是否黑名单">
                    {detailMsg?.ifBlack == '1' ? '是' : '否'}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>
            <div className={styles.blockContainer}>
              <div className={styles.title}>超限信息</div>
              <div className={styles.content}>
                <Descriptions column={4}>
                  <Descriptions.Item label="超重">{detailMsg?.wholeOver}kg</Descriptions.Item>
                  <Descriptions.Item label="超长">{detailMsg?.overVehLength}mm</Descriptions.Item>
                  <Descriptions.Item label="超宽">{detailMsg?.overVehWidth}mm</Descriptions.Item>
                  <Descriptions.Item label="超高">{detailMsg?.overVehHeight}mm</Descriptions.Item>
                </Descriptions>
                <Descriptions column={4}>
                  <Descriptions.Item label="超限率">{detailMsg?.overRateWeight}</Descriptions.Item>
                  <Descriptions.Item label="超长率">{detailMsg?.overRateLength}</Descriptions.Item>
                  <Descriptions.Item label="超宽率">{detailMsg?.overRateWidth}</Descriptions.Item>
                  <Descriptions.Item label="超高率">{detailMsg?.overRateHeight}</Descriptions.Item>
                </Descriptions>
                <Descriptions column={4}>
                  <Descriptions.Item label="限重">{detailMsg?.limitWeight}kg</Descriptions.Item>
                  <Descriptions.Item label="限长">{detailMsg?.limitLength}mm</Descriptions.Item>
                  <Descriptions.Item label="限宽">{detailMsg?.limitWidth}mm</Descriptions.Item>
                  <Descriptions.Item label="限高">{detailMsg?.limitHeight}mm</Descriptions.Item>
                </Descriptions>
                <Descriptions column={4}>
                  <Descriptions.Item label="车货总重">{detailMsg?.totalWeight}kg</Descriptions.Item>
                  <Descriptions.Item label="车长">{detailMsg?.vehLength}mm</Descriptions.Item>
                  <Descriptions.Item label="车宽">{detailMsg?.vehWidth}mm</Descriptions.Item>
                  <Descriptions.Item label="车高">{detailMsg?.vehHeight}mm</Descriptions.Item>
                </Descriptions>
              </div>
            </div>
          </div>
          <div className={styles.picInfo}>
            <div className={styles.carouselContainer}>
              {picList && picList.length ? (
                <Carousel autoplay>
                  {picList.map((item) => {
                    return (
                      <div>
                        <img
                          src={item}
                          style={{ width: '100%' }}
                          onClick={() => {
                            setViewerVisible(true);
                          }}
                        />
                      </div>
                    );
                  })}
                </Carousel>
              ) : (
                <img style={{ height: '50%' }} src={defaultImg} />
              )}
            </div>
            <div className={styles.platePic}>
              {detailMsg?.platePic ? (
                <img
                  src={detailMsg.platePic}
                  style={{ height: '100%', width: '100%' }}
                  onClick={() => {
                    setViewerVisible(true);
                  }}
                />
              ) : (
                <img style={{ height: '50%' }} src={defaultImg} />
              )}
            </div>
            <div className={styles.shortVideo}>
              {detailMsg?.shortVideo ? (
                <video
                  style={{ width: '100%', height: '100%' }}
                  src={detailMsg.shortVideo}
                  onClick={() => {
                    setPlayerVisible(true);
                  }}
                />
              ) : (
                <img style={{ height: '50%' }} src={defaultVideo} />
              )}
            </div>
          </div>
        </div>
      </div>
      <Viewer
        zIndex={99999}
        visible={viewerVisible}
        images={picList}
        onClose={() => {
          setViewerVisible(false);
        }}
      ></Viewer>
      <Modal
        zIndex={99999}
        visible={playerVisible}
        footer={null}
        width={'50%'}
        style={{ height: '80%' }}
        bodyStyle={{ height: '100%' }}
        getContainer={'body'}
        onCancel={() => {
          setPlayerVisible(false);
        }}
        destroyOnClose={true}
        className={styles.videoFullModal}
      >
        <Player
          width={'100%'}
          height={'100%'}
          videoId="video-1"
          fluid={false}
          src={detailMsg?.shortVideo}
        >
          <BigPlayButton position="center"></BigPlayButton>
          <LoadingSpinner />
        </Player>
      </Modal>
    </Drawer>
  );
};
export default Detail;

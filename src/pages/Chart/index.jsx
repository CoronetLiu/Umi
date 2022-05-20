import React, { useEffect } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';
import Pie from './components/Pie';
import Gauge from './components/Gauge';
import Circle from './components/Circle';
import LiquidFill from './components/LiquidFill';
import BarSplit from './components/BarSplit';
import Triangle from './components/Triangle';
import Rect from './components/Rect';
import BarCombine from './components/BarCombine';
import BarLine from './components/BarLine';
import LineArea from './components/LineArea';
import Funnel from './components/Funnel';
import Scatter from './components/Scatter';
import Radar from './components/Radar';
import HeatMap from './components/HeatMap';
import Calendar from './components/Calendar';
import Cloud from './components/Cloud';

export default () => {
  useEffect(() => {}, []);

  return (
    <div className={styles.chartBox}>
      <Row span={24} style={{ height: '250px' }}>
        <Col span={6}>
          <div className={styles.chartItem}>
            <p>仪表</p>
            <Pie />
          </div>
        </Col>
        <Col span={6}>
          <div className={styles.chartItem}>
            <p>仪表渐变</p>
            <Gauge />
          </div>
        </Col>
        <Col span={6}>
          <div className={styles.chartItem}>
            <p>环形图</p>
            <Circle />
          </div>
        </Col>
        <Col span={6}>
          <div className={styles.chartItem}>
            <p>水波图</p>
            <LiquidFill />
          </div>
        </Col>
      </Row>
      <Row span={24} style={{ height: '300px' }}>
        <Col span={8}>
          <div className={styles.chartItem}>
            <p>柱形分割</p>
            <BarSplit />
          </div>
        </Col>
        <Col span={8}>
          <div className={styles.chartItem}>
            <p>柱形三角</p>
            <Triangle />
          </div>
        </Col>
        <Col span={8}>
          <div className={styles.chartItem}>
            <p>柱形自定义</p>
            <Rect />
          </div>
        </Col>
      </Row>
      <Row span={24} style={{ height: '300px' }}>
        <Col span={8}>
          <div className={styles.chartItem}>
            <p>柱形组合</p>
            <BarCombine />
          </div>
        </Col>
        <Col span={8}>
          <div className={styles.chartItem}>
            <p>柱形折线组合</p>
            <BarLine />
          </div>
        </Col>
        <Col span={8}>
          <div className={styles.chartItem}>
            <p>线形区域渐变</p>
            <LineArea />
          </div>
        </Col>
      </Row>
      <Row span={24} style={{ height: '300px' }}>
        <Col span={8}>
          <div className={styles.chartItem}>
            <p>漏斗图</p>
            <Funnel />
          </div>
        </Col>
        <Col span={8}>
          <div className={styles.chartItem}>
            <p>散点图</p>
            <Scatter />
          </div>
        </Col>
        <Col span={8}>
          <div className={styles.chartItem}>
            <p>雷达图</p>
            <Radar />
          </div>
        </Col>
      </Row>
      <Row span={24} style={{ height: '400px' }}>
        <Col span={8}>
          <div className={styles.chartItem}>
            <p>地图</p>
            <HeatMap />
          </div>
        </Col>
        <Col span={8}>
          <div className={styles.chartItem}>
            <p>日历热力图</p>
            <Calendar />
          </div>
        </Col>
        <Col span={8}>
          <div className={styles.chartItem}>
            <p>词云</p>
            <Cloud />
          </div>
        </Col>
      </Row>
    </div>
  );
};

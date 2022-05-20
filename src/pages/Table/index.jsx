import React, { useState, useRef, useEffect } from 'react';
import { Form, Table, Button, Row, Col, Checkbox, Select, Input, DatePicker, message } from 'antd';
import { EyeFilled, UpOutlined, DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getTableData, getSiteNameByType, getDetail } from './service';
import Detail from '@/components/PublicDetail';
import styles from './index.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

const replaceStationType = (siteType) => {
  if (siteType == 0) return '固定治超站';
  if (siteType == 1) return '计重收费站';
  if (siteType == 2) return '高速劝返站';
  if (siteType == 3) return '非现场检测站';
  if (siteType == 4) return '源头企业站';
  if (siteType == 5) return '流动治超站';
};

const today = moment().format('YYYY-MM-DD 00:00:00');
const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

let autoH = document.body.clientHeight - 180;
let counts = Math.ceil((autoH - 95) / 45);
counts = counts < 1 ? 1 : counts;

const TableList = () => {
  const [form] = Form.useForm();
  const { resetFields, setFieldsValue, validateFields } = form;
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [detailMsg, setDetailMsg] = useState({});
  const [siteNames, setSiteNames] = useState([]);
  const [search, setSearch] = useState({ detectTime: [], ifOver: ['0', '1'], ifBlack: ['0', '1'] });
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(counts);
  const [total, setTotal] = useState(0);
  const [sortDirection, setSortDirection] = useState('desc');
  const [isShow, setIsShow] = useState(false);
  const [autoHeight, setAutoHeight] = useState(autoH + 'px');

  useEffect(() => {
    getSiteNameFn();
    getListFn();

    resizeTable();
    window.onresize = () => {
      resizeTable();
    };
  }, []);

  const resizeTable = () => {
    let autoH = document.body.clientHeight - 180;
    setAutoHeight(autoH + 'px');
  };

  const columns = [
    {
      title: '站点类型',
      dataIndex: 'siteType',
      align: 'center',
      render: (_) => {
        return replaceStationType(_);
      },
    },
    {
      title: '站点名称',
      dataIndex: 'siteName',
      align: 'center',
    },
    {
      title: '站点编码',
      dataIndex: 'siteCode',
      align: 'center',
    },
    {
      title: '检测时间',
      dataIndex: 'detectTime',
      align: 'center',
      defaultSortOrder: 'descend',
      sorter: true,
    },
    {
      title: '轴数',
      dataIndex: 'axleNum',
      align: 'center',
    },
    {
      title: '超限量',
      dataIndex: 'overNum',
      align: 'center',
    },
    {
      title: '超限率',
      dataIndex: 'overRate',
      align: 'center',
    },
    {
      title: '是否超限',
      dataIndex: 'ifOver',
      align: 'center',
      render: (_) => {
        return _ ? '是' : '否';
      },
    },
    {
      title: '是否黑名单',
      dataIndex: 'ifBlack',
      align: 'center',
      render: (_) => {
        return _ ? '是' : '否';
      },
    },
    {
      title: '数据详情',
      dataIndex: 'operation',
      align: 'center',
      width: '8%',
      render(_, record, index) {
        return (
          <span style={{ cursor: 'pointer' }} onClick={() => showDetail(record)}>
            <a>
              <EyeFilled /> 查看
            </a>
          </span>
        );
      },
    },
  ];

  const getListFn = async (params) => {
    let s = (search.detectTime && search.detectTime[0]?.format('YYYY-MM-DD HH:mm:ss')) || today;
    let e =
      (search.detectTime && search.detectTime[1]?.format('YYYY-MM-DD HH:mm:ss')) || currentTime;
    if (params && params.search) {
      if (params.search.detectTime && params.search.detectTime[0]) {
        s = params.search.detectTime[0].format('YYYY-MM-DD HH:mm:ss');
      } else {
        s = today;
      }
      if (params.search.detectTime && params.search.detectTime[1]) {
        e = params.search.detectTime[1].format('YYYY-MM-DD HH:mm:ss');
      } else {
        e = currentTime;
      }
    }

    // 都勾选传空字符串查全部，都不勾选不传当前字段返回空
    let ifOver = params && params.search ? params.search.ifOver : search.ifOver;
    if (ifOver.length == 2) {
      ifOver = '';
    } else if (ifOver.length == 0) {
      ifOver = undefined;
    } else {
      ifOver = ifOver[0];
    }
    let ifBlack = params && params.search ? params.search.ifBlack : search.ifBlack;
    if (ifBlack.length == 2) {
      ifBlack = '';
    } else if (ifBlack.length == 0) {
      ifBlack = undefined;
    } else {
      ifBlack = ifBlack[0];
    }
    setLoading(true);
    let res = await getTableData({
      siteType: params && params.search ? params.search.siteType : search.siteType,
      siteCode: params && params.search ? params.search.siteName : search.siteName,
      vehPlate: params && params.search ? params.search.vehPlate : search.vehPlate,
      axleNum: params && params.search ? params.search.axleNum : search.axleNum,
      overRateMin: params && params.search ? params.search.startPercent : search.startPercent,
      overRateMax: params && params.search ? params.search.endPercent : search.endPercent,
      ifOver,
      ifBlack,
      startTime: s,
      endTime: e,
      pageNum: (params && params.offset) || currentPage,
      pageSize: (params && params.limit) || pageSize,
      detectionTimeOrder:
        (params && params.sortDirection?.toUpperCase()) || sortDirection.toUpperCase(),
    });
    setLoading(false);

    if (res?.code == 1) {
      let list = [];
      for (let i = 0; i < 15; i++) {
        let type = Math.floor(Math.random() * 5);
        let obj = {
          busiNum: i,
          siteType: type,
          siteCode: type + '00000',
          siteName: replaceStationType(type) + i,
          detectTime: '2022-04-10 12:00:00',
          axleNum: i,
          overNum: i,
          overRate: i * 3 + '%',
          ifOver: i > 10,
          ifBlack: i % 3 == 0,
        };
        list.push(obj);
      }
      setDataSource(list);
      setTotal(15);
    } else {
      setDataSource([]);
      setTotal(0);
    }
  };

  const getSiteNameFn = async (type) => {
    let res = await getSiteNameByType({ siteType: type });
    if (res && res.code == 1) {
      setSiteNames([
        {
          siteName: '模拟站点',
          siteCode: '000000',
        },
      ]);
    } else {
      setSiteNames([]);
    }
  };

  let siteNameOptions = siteNames.map((item) => (
    <Option key={item.siteCode}>{item.siteName}</Option>
  ));

  const showDetail = async (record) => {
    let res = await getDetail({
      busiNum: record.busiNum,
    });
    if (res?.code == 1) {
      setDetailMsg(res.data);
      setVisible(true);
    } else {
      message.error('查询详情失败！');
    }
  };

  // 点击排序
  const handleTableChange = (pagination, filters, sorter) => {
    if (pagination.current == currentPage && pagination.pageSize == pageSize) {
      let order = sorter.order ? sorter.order.replace('end', '') : '';
      setSortDirection(order);
      getListFn({
        sortDirection: order,
      });
    }
  };

  const onChange = (current, size) => {
    setCurrentPage(current);
    setPageSize(size);
    getListFn({
      offset: current,
      limit: size,
    });
  };

  const onFinish = async (values) => {
    console.log('onFinish values=', values);
    setSearch(values);
    setCurrentPage(1);
    getListFn({
      offset: 1,
      limit: pageSize,
      search: values,
    });
  };

  return (
    <div className={[styles.listPageContainer, visible ? styles.hideList : ''].join(' ')}>
      <div className={styles.formBox}>
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={{
            siteType: '',
            siteCode: '',
            axleNum: '',
            detectTime: [moment(today), moment(currentTime)],
            ifOver: ['0', '1'],
            ifBlack: ['0', '1'],
          }}
        >
          <Row span={24}>
            <Col span={4} xxl={4}>
              <Form.Item label="站点类型" name="siteType">
                <Select onChange={(str) => getSiteNameFn(str)} style={{ textAlign: 'left' }}>
                  <Option key="">全部</Option>
                  <Option key="0">固定治超站</Option>
                  <Option key="1">计重收费站</Option>
                  <Option key="2">高速劝返站</Option>
                  <Option key="3">非现场检测站</Option>
                  <Option key="4">源头企业站</Option>
                  <Option key="5">流动治超站</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4} xxl={4}>
              <Form.Item label="站点名称" name="siteCode">
                <Select
                  showSearch
                  style={{ textAlign: 'left' }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option key={''}>全部</Option>
                  {siteNameOptions}
                </Select>
              </Form.Item>
            </Col>
            <Col span={10} xxl={10}>
              <Form.Item label="检测时间" name="detectTime">
                <RangePicker
                  showTime
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  allowClear={false}
                  allowEmpty={[true, true]}
                />
              </Form.Item>
            </Col>
            <Col span={6} xxl={6} style={{ display: isShow ? 'block' : 'none' }}>
              <Form.Item label="是否超限" name="ifOver">
                <Checkbox.Group>
                  <Row span={24}>
                    <Col span={12}>
                      <Checkbox value="1" style={{ lineHeight: '25px' }}>
                        是
                      </Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="0" style={{ lineHeight: '25px' }}>
                        否
                      </Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Col>
            <Col span={6} xxl={6} className={styles.formBtns}>
              <Button key="search" type="primary" htmlType="submit">
                查询
              </Button>
              <Button key="export" htmlType="export" style={{ margin: '0 10px' }}>
                导出
              </Button>
              <Button type="default" key="more" onClick={() => setIsShow(!isShow)}>
                {isShow ? '收起' : '展开'}
                {isShow ? <UpOutlined /> : <DownOutlined />}
              </Button>
            </Col>
          </Row>
          <Row span={24} style={{ display: isShow ? 'flex' : 'none' }}>
            <Col span={4} xxl={4}>
              <Form.Item label="车牌号" name="vehPlate">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={4} xxl={4}>
              <Form.Item label="轴数" name="axleNum">
                <Select showSearch placeholder="请选择">
                  <Option value={''}>全部</Option>
                  <Option value={'2'}>2</Option>
                  <Option value={'3'}>3</Option>
                  <Option value={'4'}>4</Option>
                  <Option value={'5'}>5</Option>
                  <Option value={'6'}>6</Option>
                  <Option value={'7'}>≥7</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} xxl={6}>
              <Form.Item label="超限率">
                <Form.Item
                  name="startPercent"
                  style={{ display: 'inline-block', width: '30%', paddingRight: '5px' }}
                  dependencies={['endPercent']}
                  rules={[
                    {
                      required: false,
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        value = Number(value);
                        if (!value || !getFieldValue('endPercent')) {
                          return Promise.resolve();
                        } else if (getFieldValue('endPercent') >= value) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject('结束值不能小于起始值');
                        }
                      },
                    }),
                  ]}
                  getValueFromEvent={(event) => {
                    return event.target.value.replace(/[^\d.]/g, '');
                  }}
                >
                  <Input />
                </Form.Item>
                <span className="ant-form-text">~</span>
                <Form.Item
                  name="endPercent"
                  style={{ display: 'inline-block', width: '30%', paddingRight: '5px' }}
                  dependencies={['startPercent']}
                  rules={[
                    {
                      required: false,
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        value = Number(value);
                        if (!value || !getFieldValue('startPercent')) {
                          return Promise.resolve();
                        } else if (getFieldValue('startPercent') <= value) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject('');
                        }
                      },
                    }),
                  ]}
                  getValueFromEvent={(event) => {
                    return event.target.value.replace(/[^\d.]/g, '');
                  }}
                >
                  <Input />
                </Form.Item>
                <span className="ant-form-text">%</span>
              </Form.Item>
            </Col>
            <Col span={6} xxl={6}>
              <Form.Item label="是否黑名单" name="ifBlack">
                <Checkbox.Group>
                  <Row span={24}>
                    <Col span={12}>
                      <Checkbox value="1" style={{ lineHeight: '25px' }}>
                        是
                      </Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="0" style={{ lineHeight: '25px' }}>
                        否
                      </Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      <Table
        rowKey="busiNum"
        style={{ minHeight: autoHeight }}
        dataSource={dataSource}
        columns={columns}
        bordered={true}
        size={'small'}
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          // showQuickJumper: {goButton: <Button type="primary" size={'small'}>GO</Button>},
          defaultCurrent: 1,
          current: currentPage,
          pageSize: pageSize,
          total: total,
          pageSizeOptions: ['5', '10', '20'],
          onChange: onChange,
          position: 'bottomCenter',
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
      <Detail visible={visible} setVisible={setVisible} detailMsg={detailMsg} />
    </div>
  );
};

export default TableList;

import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { SmileTwoTone, HeartTwoTone } from '@ant-design/icons';
import { Card, Typography } from 'antd';

const style = {
  margin: '15px 0',
  padding: '15px 20px',
  background: 'transparent',
  boxShadow: '0px 1px 10px 0px rgb(0, 0, 0, 0.12), 0px 5px 5px 1px rgb(0, 0, 0, 0.2)',
};

const CodePreview = ({ children }) => (
  <pre style={style}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

const Welcome = () => {
  return (
    <PageContainer>
      <Card>
        <Typography.Title
          level={2}
          style={{
            textAlign: 'center',
          }}
        >
          <SmileTwoTone /> Ant Design Pro <HeartTwoTone twoToneColor="#eb2f96" />
        </Typography.Title>
        <CodePreview>Umi : V3.5</CodePreview>
        <CodePreview>Ant Design : V4.19.5</CodePreview>
        <CodePreview>Node : V16.14.0</CodePreview>
      </Card>
    </PageContainer>
  );
};

export default Welcome;

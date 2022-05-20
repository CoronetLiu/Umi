import React, { useCallback, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import Captcha from './Captcha';

export default function CaptchaCode(props) {
  const instance = useRef(null);
  const [captcha, setCaptcha] = useState('');
  const { getCode } = props;
  const handleChange = useCallback((code) => {
    setCaptcha(code);
    getCode(code);
  }, []);
  const manualChange = () => {
    instance.current.handleClick();
  };
  console.log('captcha:', captcha);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Captcha
        width={props.width}
        height={props.height}
        style={props.fontWeight}
        onChange={handleChange}
        getInstance={instance}
        getCode={props.getCode}
      />
      <span
        style={{
          display: 'inline-block',
          width: 45,
          height: '36px',
          lineHeight: '18px',
          color: '#79B4F1',
          fontSize: 14,
          cursor: 'pointer',
          textAlign: 'right',
          margin: '0 8px',
        }}
        onClick={manualChange}
      >
        看不清换一张
      </span>
    </div>
  );
}

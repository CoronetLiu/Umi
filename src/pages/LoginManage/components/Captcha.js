import React, { useRef, useEffect, useCallback } from 'react';
import cs from 'classnames';

const Captcha = (props) => {
  const {
    height = 42,
    width = 96,
    bgColor = '#3C6D9B',
    charNum = 4,
    fontSize = 36,
    fontWeight = 600,
    onChange,
    className,
    getInstance,
  } = props;

  const canvas = useRef(null);

  const randomNum = (m, n) => Math.floor(Math.random() * (n - m + 1) + m);

  // 随机颜色
  const randomColor = () =>
    `rgb(${randomNum(150, 255)}, ${randomNum(150, 255)}, ${randomNum(0, 255)})`;

  const originalCharacter = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'm',
    'n',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];

  const generateCaptcha = useCallback(() => {
    let checkCode = '';

    if (canvas.current) {
      const ctx = canvas.current.getContext('2d');

      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        for (let i = 0; i < charNum; i++) {
          const charGap = Math.round(width / charNum);
          const offset = Math.round(charGap / 2) - 8;
          const code = originalCharacter[randomNum(0, originalCharacter.length - 1)];

          checkCode += code;
          ctx.save();
          ctx.beginPath();
          ctx.fillStyle = 'white';
          ctx.strokeStyle = randomColor();
          ctx.font = `${fontSize}px serif`;
          ctx.fontWeight = fontWeight;
          ctx.rotate((Math.PI / 180) * randomNum(-5, 5));
          ctx.strokeText(code, offset + i * charGap, height / 2 + 8);
          ctx.beginPath();
          //   ctx.moveTo(randomNum(0, width), randomNum(0, height));
          //   ctx.lineTo(randomNum(0, width), randomNum(0, height));
          ctx.stroke();
          ctx.restore();
        }
        return checkCode;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }, []);

  const handleClick = () => {
    const captcha = generateCaptcha();

    onChange(captcha);
  };

  if (typeof getInstance === 'object') {
    const instance = {
      handleClick,
    };

    getInstance.current = instance;
  }

  useEffect(() => {
    handleClick();
  }, []);

  return (
    <canvas
      className={cs('react-captcha', className)}
      onClick={handleClick}
      height={height}
      width={width}
      ref={canvas}
      style={{ display: 'inline-block', fontWeight: '900' }}
    />
  );
};

export default Captcha;

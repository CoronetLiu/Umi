import cookie from 'react-cookies';
import defaultSettings from '../../config/defaultSettings';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = (path) => reg.test(path);

/*
 *  IE浏览器判断
 * */
export const IEVersion = () => {
  let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  let isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; //判断是否IE<11浏览器
  let isEdge = userAgent.indexOf('Edge') > -1 && !isIE; //判断是否IE的Edge浏览器
  let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
  if (isIE) {
    let reIE = new RegExp('MSIE (\\d+\\.\\d+);');
    reIE.test(userAgent);
    let fIEVersion = parseFloat(RegExp['$1']);
    if (fIEVersion == 7) {
      return 7;
    } else if (fIEVersion == 8) {
      return 8;
    } else if (fIEVersion == 9) {
      return 9;
    } else if (fIEVersion == 10) {
      return 10;
    } else {
      return 6; //IE版本<=7
    }
  } else if (isEdge) {
    return 'edge'; //edge
  } else if (isIE11) {
    return 11; //IE11
  } else {
    return 0; //不是ie浏览器
  }
};

/*
 *   小数乘法精度
 * */
export const multiNum = (str, sr, l) => {
  if (!sr) sr = 100;
  if (!l) l = 2;
  let repeat = (str, num) => {
    return new Array(num + 1).join(str);
  };
  if (str) {
    str = str.toString();
    let s = Math.log10(sr);
    let a = Number(str.split('.')[0]) * sr;
    let b = (str.split('.')[1] && str.split('.')[1].slice(0, s)) || '';
    if (b.split('').length < s) {
      b = b + repeat('0', s - b.split('').length);
    }
    b = Number(b);
    let c = (str.split('.')[1] && str.split('.')[1].slice(s, s + l)) || '';
    if (c.split('').length < l) {
      c = c + repeat('0', l - c.split('').length);
    }
    return a + b + '.' + c;
  } else {
    return 0;
  }
};

// ie 不兼容flat
Array.prototype.flat = function (count) {
  let c = count || 1;
  let len = this.length;
  let exe = [];
  if (this.length == 0) return this;
  while (c--) {
    let _arr = [];
    let flag = false;
    if (exe.length == 0) {
      flag = true;
      for (let i = 0; i < len; i++) {
        if (this[i] instanceof Array) {
          exe.push(...this[i]);
        } else {
          exe.push(this[i]);
        }
      }
    } else {
      for (let i = 0; i < exe.length; i++) {
        if (exe[i] instanceof Array) {
          flag = true;
          _arr.push(...exe[i]);
        } else {
          _arr.push(exe[i]);
        }
      }
      exe = _arr;
    }
    if (!flag && c == Infinity) {
      break;
    }
  }
  return exe;
};

/*
 * params:{method, url, fileName, type, fields}
 * fields: 请求接口传递的参数
 * */
export const exportFile = (params) => {
  let arr = [];
  let fields = params.fields || {};
  for (let i in fields) {
    if (fields[i]) {
      arr.push(i + '=' + fields[i]);
    }
  }
  let xhr = new XMLHttpRequest();
  xhr.open(params.method || 'get', params.url + '?' + arr.join('&'), true); // 也可以使用GET方式，根据接口
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.setRequestHeader('code', cookie.load('code'));
  xhr.responseType = 'blob'; // 返回类型blob
  // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
  xhr.onload = function () {
    // 请求完成
    if (this.status === 200) {
      let fileType = this.getResponseHeader('file-type');
      // 返回200
      let blob = this.response;
      let reader = new FileReader();
      reader.readAsDataURL(blob); // 转换为base64，可以直接放入a表情href
      reader.onload = function (e) {
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, params.fileName + '.' + (params.type || fileType || 'xls'));
        } else {
          // 转换完成，创建一个a标签用于下载
          let a = document.createElement('a');
          document.body.appendChild(a);
          a.style.display = 'none';
          a.download = params.fileName + '.' + (params.type || fileType || 'xls');
          a.href = e.target.result;
          a.click();
          document.body.removeChild(a);
        }
      };
    } else if (this.status === 401) {
      cookie.remove('code', { path: '/' });
      localStorage.removeItem('antd-pro-authority');
      window.location.href = `http://${defaultSettings.umssAddress}/loginmanage`;
    }
  };
  // 发送ajax请求
  xhr.send(JSON.stringify(params));
};

// 格式化post 传递的数据
function postDataFormat(obj) {
  if (typeof obj != 'object') {
    alert('输入的参数必须是对象');
    return;
  }
  // 支持有FormData的浏览器（Firefox 4+ , Safari 5+, Chrome和Android 3+版的Webkit）
  if (typeof FormData == 'function') {
    let data = new FormData();
    for (let attr in obj) {
      data.append(attr, obj[attr]);
    }
    return data;
  } else {
    // 不支持FormData的浏览器的处理
    let arr = new Array();
    let i = 0;
    for (let attr in obj) {
      arr[i] = encodeURIComponent(attr) + '=' + encodeURIComponent(obj[attr]);
      i++;
    }
    return arr.join('&');
  }
}

export const getBeforeDate = (n) => {
  let d = new Date();
  let year = d.getFullYear();
  let mon = d.getMonth() + 1;
  let day = d.getDate();
  if (day <= n) {
    if (mon > 1) {
      mon = mon - 1;
    } else {
      year = year - 1;
      mon = 12;
    }
  }
  d.setDate(d.getDate() - n);
  year = d.getFullYear();
  mon = d.getMonth() + 1;
  day = d.getDate();
  let s = year + '-' + (mon < 10 ? '0' + mon : mon) + '-' + (day < 10 ? '0' + day : day);
  return s;
};

export const autoAddress = (port) => {
  let ip = window.location.hostname;
  if (ip.indexOf('http') != -1) {
    return ip + ':' + port;
  }
  return 'http://' + ip + ':' + port;
};

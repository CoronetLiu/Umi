// 语音
const play = (str) => {
  if (IEVersion()) {
    IETTS(str);
  } else {
    doTTS(str);
  }
};

function doTTS(yxStr) {
  let msg = new SpeechSynthesisUtterance(yxStr);
  msg.volume = 100;
  msg.rate = 1;
  msg.pitch = 1.5;
  window.speechSynthesis.speak(msg);
  console.log('Chrome playing...');
}

function IETTS(yxStr) {
  let voiceObj = new ActiveXObject('Sapi.SpVoice');
  voiceObj.Rate = -1;
  voiceObj.Volume = 100;
  voiceObj.Speak(yxStr, 1);
  console.log('IE playing...');
}

function IEVersion() {
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
}
export default play;

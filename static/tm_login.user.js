// ==UserScript==
// @name         虎虎授权
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  try to take over the world!
// @author       You
// @match        http*://*.huhuguanjia.com/*
// @grant        GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @connect      taofengcai.com
// @downloadURL  https://www.huhuguanjia.com/tm_login.user.js
// @updateURL    https://www.huhuguanjia.com/tm_login.user.js

// ==/UserScript==

(function () {
  'use strict'

  if (window.top === window.self) {
    MainFun()
  }

  function MainFun () {
    var curUrl = window.location.href;
    if (curUrl.indexOf("authorize") !== -1) {
      var dic = getDicParamFromUrl(curUrl);
      showButton(dic['code']);
    }
  }

  function showButton (code) {
    var rightMenu=document.createElement("div");
    rightMenu.innerHTML="<button id='to_local_btn' style='padding:5px'>前往local地址</button>";
    rightMenu.style.position = 'fixed';
    rightMenu.style.zIndex = 1000001;
    rightMenu.style.right = 0;
    rightMenu.style.top = 0;
    rightMenu.style.padding = '20px';
    document.getElementsByTagName('body')[0].appendChild(rightMenu);

    $("#to_local_btn").click(function () {
      window.location.href = "http://local.huhuguanjia.com:8082/authorize?code=" + code;
    });
  }

  //==================== utils ====================//

  function getDicParamFromUrl(url) {
    var idxQ = url.indexOf("?");
    if (idxQ === -1) {
      return [];
    }
    var strParam = url.substr(idxQ+1);
    return getDicParamFromStr(strParam);
  }

  function getDicParamFromStr(strParam) {
    if (!strParam) {
      return [];
    }
    var dicParam = [];
    var arrSplit = strParam.split("&");
    for (var j = 0; j < arrSplit.length; ++j) {
      var arr = arrSplit[j].split('=');
      dicParam[arr[0]] = arr[1];
    }
    return dicParam;
  }

})()

// ==UserScript==
// @name         钉钉网页版优化
// @namespace    https://zggmd.com/
// @version      0.1
// @description  1,自动填充 Merge Request 标题; 2, 自动选中Assignee
// @author       songsz
// @include      https://im.dingtalk.com*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
  'use strict';
  setTimeout(() => {
    // 删除下载提示条
    const d = document.getElementsByTagName('client-download-guide')[0]
    d.parentNode.removeChild(d)
    // 修改背景色
    const meta = document.createElement('meta')
    meta.name = "theme-color"
    meta.content="#008cee"
    document.getElementsByTagName('head')[0].appendChild(meta)
    // macOS下，绑定 command+Enter 发送消息
    document.onkeydown = () => {
      if (/macintosh|mac os x/i.test(navigator.userAgent) && window.event.metaKey && window.event.keyCode === 13) {
        document.getElementsByClassName('send-message-button')[0].click()
        return
      }
    }
    // 防止误关闭窗口
    window.onbeforeunload = event => {
      return '别关，关了还要重新扫码！'
    }
  }, 200)
  
})();

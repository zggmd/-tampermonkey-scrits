// ==UserScript==
// @name         从 Gitlab 打开 Jira 链接
// @namespace    https://tenxcloud.com/
// @version      0.0.2
// @description  shiftKey+altKey+点击gitlab界面任意元素上的jiraId，从新窗口打开该jira链接
// @author       songsz
// @include      https://gitlab.dev.21vianet.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// ==/UserScript==


/**
 * 更新日志：
 * v0.0.2: 当一行中发现多个jiraId时，渲染一个弹框列表，供用户手动选择跳转到哪个jira
 *
 */
(function() {
  'use strict';
  const config = {
    /**
     * 用于指定你的jira地址，最后不用加/
     */
    jiraAddress: 'http://jira.tenxcloud.21vianet.com',
    /**
     * 后台打开jira链接时，需要同时按下的修饰键。支持的值：shiftKey,altKey,metaKey。说明 metaKey: mac上表示Command键(⌘); Windows上表示Windows键(⊞)
     * mac上测试发现：
     * ctrlKey+click === right-click，右键，无法触发自定义事件。
     * ctrlKey+其他修饰键+click === right-click，右键，无法触发自定义事件，可见ctrlKey很霸道🤔。
     * shiftKey+click === 新窗口打开链接
     * metaKey+click === 从新tab页后台打开
     * altKey+click === 保存链接
     * 因为altKey + click 不常用，故默认替换该快捷键
     * */
    openJiraWithModifierKeys: ['altKey'],
  }
  // 新窗口打开
  const open = url => window.open(url, '_blank')
  // 从字符串提取jira列表
  const getJiraIdListFromStr = str => str.match(/\[\w+-\d+\]/g)?.map(k => k?.replace(/\[/, '')?.replace(/\]/,''))
  // 从jiraId获取jira🔗
  const getJiraLink = jiraId => `${config.jiraAddress}/browse/${jiraId}`
  // 清理老的添加的dom元素
  const clearOldDom = () => {
    document.getElementById('tenx_style_id')?.remove()
    document.getElementById('tenx_container_id')?.remove()
  }
  // 新增一个弹出框
  const renderPopover = (ids, e) => {
    const style = document.createElement('style')
    style.id = 'tenx_style_id'
    style.innerHTML = `#tenx_container_id {top: ${e.clientY}px;left: ${e.clientX}px;background: #ffffff;font-size: 13px;position: absolute;border: 1px solid #b1828263;padding: 8px;border-radius: 4px;}
    #tenx_container_id > .a:not(:last-child) {margin-bottom: 8px;}`
    ;document.getElementsByTagName('head')[0].appendChild(style);
    const div = document.createElement('div')
    div.id = 'tenx_container_id'
    div.onclick = ev => ev.stopPropagation()
    div.innerHTML = ids.map(id => `<div class="a"><a target="_blank" rel="noreferrer" href="${getJiraLink(id)}">${id}</a></div>`).join('')
    ;document.getElementsByTagName('body')[0].appendChild(div);
  }
  const clickOpenJiraEvent = (e) => {
    clearOldDom()
    if (config.openJiraWithModifierKeys.every(k => e[k])) {
      e.preventDefault()
      const jiraIds = getJiraIdListFromStr(e.target.innerText)
      if(!jiraIds?.length) return
      if (jiraIds.length === 1) {
        return open(getJiraLink(jiraIds[0]))
      }
      renderPopover(jiraIds, e)
    }
  }
  document.addEventListener('click', clickOpenJiraEvent)
})();

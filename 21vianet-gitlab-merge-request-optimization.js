// ==UserScript==
// @name         Gitlab Merge Request 优化
// @namespace    https://tenxcloud.com/
// @version      0.1
// @description  1,自动填充 Merge Request 标题; 2, 自动选中Assignee
// @author       songsz
// @include      https://gitlab.dev.21vianet.com/*/merge_requests/new*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
  'use strict';
  // 该MR的Assignee
  const Assignee = '⚠️这里修改成自己的指定的人⚠️⚠️⚠️'
  // 自动设置标题
  const getTitle = () => {
    const sourceTitle = [...(document.getElementsByClassName('js-onboarding-commit-item'))].map(node => node.textContent).filter(i => /^\[(.+?)\]/.test(i))
    if (sourceTitle?.length === 0) { return '' }
    if (sourceTitle?.length === 1) {
      return sourceTitle[0]
    } else {
      return sourceTitle.map(t => t.split(']')[0]).join('] && ') + ']'
    }
  }
  const setTitle = () => (document.querySelector("#merge_request_title").value = getTitle())
  setTitle()
  // 自动设置Assignee
  // 延时函数
  const delay = ({ timeout = 1000, data = {}, success = true }) =>
    new Promise((resolve, reject) =>
      setTimeout(() => (success ? resolve(data) : reject(new Error('depaly timeout'))), timeout)
    );

  const autoSetAssignee = async () => {
    // 自动点击
    document.querySelector("#new_merge_request > div:nth-child(9) > div > div.form-group.row.merge-request-assignee > div > div > div > button").click()
    // 等待
    await delay({timeout: 100})
    const elem = document.querySelector("#new_merge_request > div:nth-child(9) > div > div.form-group.row.merge-request-assignee > div > div > div > div > div.dropdown-input > input")
    elem.value = Assignee
    elem.dispatchEvent(new Event('input'));
    await delay({timeout: 2000})
    document.getElementsByClassName('dropdown-menu-user-full-name')[0].click()
  }
  autoSetAssignee()
})();

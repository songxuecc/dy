
// midal框顶部变有蓝色条框
const vhhModal = {
  inserted: function (el) {
    if (!el) return
    // 查找当前元素
    el.setAttribute('position', 'relative')
    // 给dialog元素 头部添加蓝色底部
    const children = el.querySelector('.el-dialog')
    const div = document.createElement('div')
    function setStyle (obj, json) {
      for (var i in json) {
        obj.style[i] = json[i]
      }
    }
    const style = {
      position: 'absolute',
      background: '#6fb8ff',
      top: '-10px',
      left: 0,
      width: '100%',
      height: '100%',
      'z-index': -1,
      'border-radius': '10px'
    }
    setStyle(div, style)
    if (children) {
      children.appendChild(div)
    }
  }
}

export default vhhModal

// 这个助手方法下面会用到，用来获取 css 相关属性值

import debounce from 'lodash/debounce'
const getAttr = (obj, key) => (
  obj.currentStyle
    ? obj.currentStyle[key]
    : window.getComputedStyle(obj, false)[key]
)

let right = 0
let top = 0
let minRight = 0
let maxRight = 0
let minTop = 0
let maxTop = 0
let currentX = 0
let currentY = 0
let unbindEvents = () => {}
const hhDrag = {
  inserted (el, binding, vnode) {
    /**
     * target: 组件的容器元素
     * el：组件的头部区域，也是就是拖拽的区域
     */
    const target = el
    // .parentNode
    // 鼠标手型
    el.style.cursor = 'move'
    const parentRight = parseInt(getAttr(target, 'right'))
    const change = () => {
      const flexFootComponent = vnode.children[vnode.children.length - 1]
      flexFootComponent.componentInstance.changeIsDragging()
    }
    el.onmousedown = (e) => {
      change()
      currentX = e.clientX
      currentY = e.clientY
      document.body.onselectstart = document.body.ondrag = function () {
        return false
      }
      right = parseInt(getAttr(target, 'right'))
      top = parseInt(getAttr(target, 'top'))
      minRight = parseInt(getAttr(document.body, 'width')) - (target.offsetLeft + parseInt(getAttr(target, 'width'))) - parentRight
      maxRight = parseInt(getAttr(document.body, 'width')) - parseInt(getAttr(target, 'width')) - 200
      minTop = target.offsetTop - 200
      maxTop = parseInt(getAttr(document.body, 'height')) -
        target.offsetTop - parseInt(getAttr(el, 'height'))
      bindEvents()
    }

    const bindEvents = () => {
      document.addEventListener('mouseup', onMouseUp)
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseleave', onMouseUp)
    }
    unbindEvents = () => {
      right = 0
      top = 0
      minRight = 0
      maxRight = 0
      minTop = 0
      maxTop = 0
      currentX = 0
      currentY = 0
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseUp)
      change()
    }
    const onMouseUp = event => {
      unbindEvents()
    }
    const onMouseMove = debounce(function (event) {
      document.body.unselectable = 'on'
      document.body.onselectstart = 'return false;'
      document.body.style['-moz-user-select'] = 'none'
      document.body.onselectstart = document.body.ondrag = function () {
        return false
      }
      // 鼠标移动时计算每次移动的距离，并改变拖拽元素的定位
      const disX = event.clientX - currentX
      const disY = event.clientY - currentY
      if (disX < 0 && disX - right <= -maxRight) { // 向左移动
        target.style.right = `${maxRight}px`
      } else if (disX > 0 && disX > minRight) { // 向右移动
        target.style.right = `${parentRight}px`
      } else {
        target.style.right = `${right - disX}px`
      }

      // 判断上、下边界
      if (disY < 0 && disY <= -minTop) {
        target.style.top = `${top - minTop}px`
      } else if (disY > 0 && Math.abs(disY) >= maxTop) {
        target.style.top = `${top + maxTop}px`
      } else {
        target.style.top = `${top + disY}px`
      }
      return false
    }, 0)
  },

  update (el) {
    const target = el.parentNode
    target.style.right = '15px'
    target.style.top = '50%'
    unbindEvents()
  },

  // 最后卸载时，清除事件绑定
  unbind (el) {
    unbindEvents()
    el.onmousedown = null
  }
}

export default hhDrag

// 这个助手方法下面会用到，用来获取 css 相关属性值

const getAttr = (obj, key) => (
  obj.currentStyle
    ? obj.currentStyle[key]
    : window.getComputedStyle(obj, false)[key]
)

let right = 15
let top = parseInt(getAttr(document.body, 'height')) / 2
let minRight = 0
let maxRight = 0
let minTop = 0
let maxTop = 0
let currentX = 0
let currentY = 0
let unbindEvents = () => {}
let isDown = false
const hhDrag = {
  inserted (el, binding, vnode) {
    /**
     * target: 组件的容器元素
     * el：组件的头部区域，也是就是拖拽的区域
     */
    const target = el
    // 鼠标手型
    el.style.cursor = 'move'
    const parentRight = parseInt(getAttr(target, 'right'))
    const change = () => {
      const flexFoot = vnode.context.$refs.flexFoot
      flexFoot.changeIsDragging && flexFoot.changeIsDragging()
    }
    el.onmousedown = (e) => {
      change()
      document.body.style.cssText += 'user-select: none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select: none'

      isDown = true
      currentX = e.clientX
      currentY = e.clientY
      right = parseInt(getAttr(target, 'right'))
      top = parseInt(getAttr(target, 'top'))
      minRight = parseInt(getAttr(document.body, 'width')) - (target.offsetLeft + parseInt(getAttr(target, 'width'))) - parentRight
      maxRight = parseInt(getAttr(document.body, 'width')) - parseInt(getAttr(target, 'width')) - 200
      minTop = target.offsetTop - 200
      maxTop = parseInt(getAttr(document.body, 'height')) -
        target.offsetTop - parseInt(getAttr(el, 'height')) + 70
      bindEvents()
    }

    const bindEvents = () => {
      document.addEventListener('mousemove', onMouseMove)
    }

    document.addEventListener('mouseup', function (e) {
      isDown = false
      unbindEvents()
    })

    unbindEvents = () => {
      console.log('unbindEvents')
      document.removeEventListener('mousemove', onMouseMove)
      right = 15
      top = parseInt(getAttr(document.body, 'height')) / 2
      minRight = 0
      maxRight = 0
      minTop = 0
      maxTop = 0
      currentX = 0
      currentY = 0
      change()
      document.body.style.cssText += 'user-select: text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select: text'
    }

    const onMouseMove = function (event) {
      if (isDown) {
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
      }
    }
  },

  update (el) {
    unbindEvents()
  },

  // 最后卸载时，清除事件绑定
  unbind (el) {
    unbindEvents()
    el.onmousedown = null
  }
}

export default hhDrag

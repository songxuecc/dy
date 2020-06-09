<template lang="html">
   <canvas ref="canvas" class="mycursor" v-on:mousedown="mouseDown" v-on:mousemove="mouseMove" v-on:mouseup="mouseUp">
   </canvas>
</template>
<script>

import utils from '@/common/utils'

export default {
  props: {
    canvas_size: Array
  },
  watch: {
    canvas_size: function (newVal, oldVal) { // watch it
      this.canvas.width = newVal[0]
      this.canvas.height = newVal[1]
      this.rect = {
        x: parseInt(this.canvas.width / 4),
        y: parseInt(this.canvas.height / 4),
        w: parseInt(this.canvas.width / 2),
        h: parseInt(this.canvas.height / 2)
      }
      this.drawRect()
    }
  },
  data () {
    return {
      canvas: '',
      ctx: '',
      rect: {
        x: 0,
        y: 0,
        w: 0,
        h: 0
      },
      selectwidth: 14,
      resizeSelect: [],
      drag: {
        isDrag: false,
        offsetx: 0,
        offsety: 0
      },
      resize: {
        isResize: false,
        selectIndex: -1
      },
      mousePos: 0 // 0-无关区域 1-方框内  2-放大方框内
    }
  },

  mounted () {
    this.canvas = this.$refs['canvas']
    this.ctx = this.canvas.getContext('2d')
    this.drawRect()
  },
  methods: {
    drawRect () {
      if (this.rect.w <= 0 || this.rect.h <= 0 || this.rect.x <= 0 || this.rect.y <= 0) {
        return
      }
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.fillStyle = 'rgba(107,190,225,0.7)'
      this.ctx.lineWidth = 2
      this.ctx.strokeStyle = 'rgb(255,250,250)'
      this.ctx.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h)
      this.ctx.beginPath()
      this.ctx.rect(this.rect.x, this.rect.y, this.rect.w, this.rect.h)
      this.ctx.stroke()
      this.ctx.closePath()

      this.ctx.fillStyle = 'rgb(255,250,250)'

      let obj = [0, 0.5, 1]
      this.resizeSelect = []
      // 0  3  5
      // 1     6
      // 2  4  7
      for (let x of obj) {
        for (let y of obj) {
          if (x === 0.5 && y === 0.5) {
            continue
          }
          let sx = this.rect.x + this.rect.w * x - this.selectwidth / 2
          let sy = this.rect.y + this.rect.h * y - this.selectwidth / 2
          this.resizeSelect.push({
            x: sx, y: sy, w: this.selectwidth, h: this.selectwidth
          })
          this.ctx.fillRect(sx, sy, this.selectwidth, this.selectwidth)
        }
      }
    },
    isInRect (pos, rect) {
      if (pos.x > rect.x && pos.x < (rect.x + rect.w) &&
          pos.y > rect.y && pos.y < (rect.y + rect.h)
      ) {
        return true
      }
      return false
    },

    refreshMousePos (mouse) {
      let isResize = -1
      for (var i in this.resizeSelect) {
        if (this.isInRect(mouse, this.resizeSelect[i])) {
          isResize = parseInt(i)
          break
        }
      }
      if (isResize !== -1) {
        if ([2, 5].includes(isResize)) {
          this.canvas.style.cursor = 'nesw-resize'
        } else if ([0, 7].includes(isResize)) {
          this.canvas.style.cursor = 'nwse-resize'
        } else if ([3, 4].includes(isResize)) {
          this.canvas.style.cursor = 'ns-resize'
        } else {
          this.canvas.style.cursor = 'ew-resize'
        }
        this.resize.selectIndex = isResize
        this.mousePos = 2
      } else if (this.isInRect(mouse, this.rect)) {
        this.canvas.style.cursor = 'move'
        this.mousePos = 1
      } else {
        this.canvas.style.cursor = 'auto'
        this.mousePos = 0
      }
    },
    mouseDown (e) {
      let mouse = utils.getMousePosInCanvas(e, this.$refs.canvas)
      this.refreshMousePos(mouse)
      if (this.mousePos === 1) {
        this.drag.isDrag = true
        this.drag.offsetx = mouse.x - this.rect.x
        this.drag.offsety = mouse.y - this.rect.y
      } else if (this.mousePos === 2) {
        this.resize.isResize = true
      }
    },
    mouseMove (e) {
      let mouse = utils.getMousePosInCanvas(e, this.$refs.canvas)
      if (!this.drag.isDrag && !this.resize.isResize) {
        this.refreshMousePos(mouse)
      }

      if (this.drag.isDrag) {
        let mouse = utils.getMousePosInCanvas(e, this.$refs.canvas)
        if ((mouse.x - this.drag.offsetx) > 0 && (mouse.y - this.drag.offsety) > 0 &&
        (mouse.x - this.drag.offsetx + this.rect.w) < this.canvas.width &&
        (mouse.y - this.drag.offsety + this.rect.h) < this.canvas.height) {
          this.rect.x = mouse.x - this.drag.offsetx
          this.rect.y = mouse.y - this.drag.offsety
          this.drawRect()
        }
      } else if (this.resize.isResize) {
        let oldx = this.rect.x
        var oldy = this.rect.y

        switch (this.resize.selectIndex) {
          case 0:
            this.rect.x = mouse.x
            this.rect.y = mouse.y
            this.rect.w += oldx - mouse.x
            this.rect.h += oldy - mouse.y
            break
          case 3:
            this.rect.y = mouse.y
            this.rect.h += oldy - mouse.y
            break
          case 5:
            this.rect.y = mouse.y
            this.rect.w = mouse.x - oldx
            this.rect.h += oldy - mouse.y
            break
          case 1:
            this.rect.x = mouse.x
            this.rect.w += oldx - mouse.x
            break
          case 6:
            this.rect.w = mouse.x - oldx
            break
          case 2:
            this.rect.x = mouse.x
            this.rect.w += oldx - mouse.x
            this.rect.h = mouse.y - oldy
            break
          case 4:
            this.rect.h = mouse.y - oldy
            break
          case 7:
            this.rect.w = mouse.x - oldx
            this.rect.h = mouse.y - oldy
            break
        }
        this.drawRect()
      }
    },
    mouseUp (e) {
      this.drag.isDrag = false
      this.resize.isResize = false
      this.canvas.style.cursor = 'auto'
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/base.less';
</style>

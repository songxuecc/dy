<template lang="html">
    <canvas :class="eraseMouse" ref="canvas" v-on:mousedown="mouseDown" v-on:mousemove="mouseMove" v-on:mouseup="mouseUp">
    </canvas>
</template>
<script>

import utils from '@/common/utils'

export default {
  props: {
    canvas_size: Array,
    brush: Object,
    mode: ''
  },
  watch: {
    canvas_size: function (newVal, oldVal) { // watch it
      this.canvas.width = newVal[0]
      this.canvas.height = newVal[1]
      // this.drawImage()
    },
    brush: {
      handler: function (newVal) {
        this.brush = newVal
        this.eraseMouse = this.getMouseMode()
      },
      deep: true
    },
    mode: function (newVal, oldVal) {
      this.mode = newVal
      this.eraseMouse = this.getMouseMode()
    }
  },
  data () {
    return {
      canvas: '',
      ctx: '',
      drawing: false,
      prev: null,
      curr: null,
      eraseMouse: '',
      points: [],
      image: undefined
    }
  },

  mounted () {
    this.canvas = this.$refs['canvas']
    this.ctx = this.canvas.getContext('2d')
    this.eraseMouse = this.getMouseMode()
  },
  methods: {
    getMouseMode () {
      if (this.mode === '') {
        return ''
      }
      let color = (this.mode === 'erase' ? 'red' : 'lime')
      return 'circle-' + color + '-mouse-' + this.brush.pixel
    },

    mouseDown (e) {
      if (this.mode !== '') {
        let mouse = utils.getMousePosInCanvas(e, this.$refs.canvas)
        this.drawing = true
        this.prev = mouse
        this.curr = mouse
        this.points.push({
          x: this.curr.x,
          y: this.curr.y,
          pixel: this.brush.pixel,
          color: this.brush.color,
          mode: 'begin',
          compositeMode: this.mode
        })
      }
    },
    mouseMove (e) {
      if (this.drawing) {
        let mouse = utils.getMousePosInCanvas(e, this.$refs.canvas)
        this.curr = mouse
        this.draw(this.prev, this.curr, this.brush, this.mode)
        this.points.push({
          x: this.curr.x,
          y: this.curr.y,
          mode: 'draw'
        })
        this.prev = this.curr
      }
    },
    mouseUp (e) {
      this.drawing = false
      this.points.push({
        mode: 'end'
      })
    },
    toDataURL () {
      return this.canvas.toDataURL()
    },
    drawImage (image = undefined) {
      this.ctx.globalCompositeOperation = 'source-over'
      if (image === undefined) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.fillStyle = '#ffffff'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
      } else {
        let self = this
        image.onload = function () {
          self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height)
          self.ctx.drawImage(this, 0, 0, self.canvas.width, self.canvas.height)
        }
      }
      this.image = image
    },
    reset () {
      this.drawImage()
      this.points.length = 0
    },

    draw (prev, curr, brush, compositeMode) {
      if (compositeMode === 'recover') {
        this.ctx.globalCompositeOperation = 'destination-out'
      } else {
        this.ctx.globalCompositeOperation = 'source-over'
      }
      this.ctx.beginPath()
      this.ctx.moveTo(prev.x, prev.y)
      this.ctx.lineTo(curr.x, curr.y)
      this.ctx.strokeStyle = brush.color
      this.ctx.lineWidth = brush.pixel
      this.ctx.stroke()
      this.ctx.closePath()

      this.ctx.beginPath()
      this.ctx.fillStyle = brush.color
      this.ctx.arc(curr.x, curr.y, brush.pixel / 2, 0, Math.PI * 2, true)
      this.ctx.closePath()
      this.ctx.fill()
    },
    reDrawAll () {
      let curr, brush, prev, compositeMode
      this.ctx.globalCompositeOperation = 'source-over'
      if (this.image) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height)
      }
      for (let i = 0; i < this.points.length; i++) {
        let pt = this.points[i]
        if (pt.mode === 'end') {
          continue
        }
        if (pt.mode === 'begin') {
          curr = {
            x: pt.x,
            y: pt.y
          }
          brush = {
            color: pt.color,
            pixel: pt.pixel
          }
          compositeMode = pt.compositeMode
          continue
        }
        prev = curr
        curr = {
          x: pt.x,
          y: pt.y
        }
        this.draw(prev, curr, brush, compositeMode)
      }
    },
    undo () {
      for (let i = this.points.length - 1; i >= 0; i--) {
        let pt = this.points[i]
        if (pt.mode === 'begin') { // 倒数第一个begin往前
          this.points.splice(i, this.points.length - i)
          break
        }
      }
      this.reDrawAll()
    }
  }
}
</script>
<style lang="less" scoped>
    a {text-decoration: none;}
    .canvas {
      width:480px;
      height:480px;
      position: absolute;
      top: 0;
      left: 0;
    }
    .plus-mouse{
      cursor: url('~@/assets/icon/plus.svg') ,auto
    }
    .remove-mouse{
      cursor: url('~@/assets/icon/remove.svg') ,auto
    }
</style>

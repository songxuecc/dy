<template lang="html">
   <canvas :class="mouseMode" ref="canvas"  v-on:mousedown="mouseDown" v-on:mousemove="mouseMove" v-on:mouseup="mouseUp">
   </canvas>
</template>
<script>

import utils from '@/common/utils'

export default {
  props: {
    canvas_size: Array,
    brush: Object
  },
  watch: {
    canvas_size: function (newVal, oldVal) { // watch it
      this.canvas.width = newVal[0]
      this.canvas.height = newVal[1]
    },
    brush: {
      handler: function (newVal) {
        this.brush = newVal
        if (this.brush.color === 'red') {
          this.mouseMode = 'remove-mouse'
        } else {
          this.mouseMode = 'plus-mouse'
        }
      },
      deep: true
    }
  },
  data () {
    return {
      canvas: '',
      ctx: '',
      drawing: false,
      prev: null,
      curr: null,
      mouseMode: '',
      points: []
    }
  },

  mounted () {
    this.canvas = this.$refs['canvas']
    this.ctx = this.canvas.getContext('2d')
  },
  methods: {
    mouseDown (e) {
      if (this.brush.color !== '') {
        let mouse = utils.getMousePosInCanvas(e, this.$refs.canvas)
        this.drawing = true
        this.prev = mouse
        this.curr = mouse
        this.points.push({
          x: this.curr.x,
          y: this.curr.y,
          pixel: this.brush.pixel,
          color: this.brush.color,
          mode: 'begin'
        })
      }
    },
    mouseMove (e) {
      if (this.drawing) {
        let mouse = utils.getMousePosInCanvas(e, this.$refs.canvas)
        this.curr = mouse
        this.draw(this.prev, this.curr, this.brush)

        this.points.push({
          x: this.curr.x,
          y: this.curr.y,
          mode: 'draw'
        })
        this.prev = this.curr
      }
    },
    mouseUp (e) {
      let mouse = utils.getMousePosInCanvas(e, this.$refs.canvas)
      this.curr = mouse
      this.drawing = false
      this.points.push({
        mode: 'end'
      })
    },
    toDataURL () {
      return this.canvas.toDataURL()
    },
    reset () {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.points.length = 0
    },
    draw (prev, curr, brush) {
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
      let curr, brush, prev
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
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
          continue
        }
        prev = curr
        curr = {
          x: pt.x,
          y: pt.y
        }
        this.draw(prev, curr, brush)
      }
    },
    undo () {
      if (this.points.length === 0) {
        return
      }
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
    @import '~@/assets/css/base.less';
    @import '~@/assets/css/whitebackgroundview.less';
</style>

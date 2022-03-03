<template>
  <div id="app" class="left">
    <div>
      <canvas id="c" width="500" height="500"></canvas>
    </div>
    <div class="flex">
      <span class="flex align-c">颜色：<colorPicker v-model="strokeColor" /></span>
      <el-button @click="select">选择</el-button>
      <el-button @click="Pencil">画笔</el-button>
      <el-button @click="Brush">橡皮擦</el-button>
      <el-button @click="Rect">矩形</el-button>
      <el-button @click="Rect">文本</el-button>
      <el-button @click="undo">撤销</el-button>
      <el-button @click="redo">还原</el-button>
      <el-button @click="del">删除</el-button>
      <el-button @click="clear">清空</el-button>
      <el-button @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import fabric from 'fabric'

export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      strokeColor: '#ff0000',
      bgColor: '#ffffff',
      lineSize: 1, // 线条大小 （线条 and 线框）
      fontSize: 18, // 字体大小

      selectTool: '', // 当前用户选择的绘图工具 画笔：brush 直线：line 矩形：rect 圆形 circle 文本 text

      mouseFrom: {}, // 鼠标绘制起点
      mouseTo: {}, // 鼠标绘制重点

      drawingObject: null, // 保存鼠标未松开时用户绘制的临时图像

      textObject: null, // 保存用户创建的文本对象

      isDrawing: false, // 当前是否正在绘制图形（画笔，文本模式除外）
      stateArr: [], // 保存画布的操作记录
      stateIdx: 0, // 当前操作步数
      isRedoing: false // 当前是否在执行撤销或重做操作
    }
  },
  mounted () {
    this.initCanvas()
    this.initImage()
  },
  methods: {
    // 初始化画布
    initCanvas () {
      // 初始化线框色 与 指示器
      this.strokeColor = '#000000'
      this.lineSize = '10'
      // 初始化 fabric canvas对象

      if (!this.canvas) {
        this.canvas = new fabric.Canvas('c')
        // 设置画布背景色 (背景色需要这样设置，否则拓展的橡皮功能会报错)
        this.canvas.setBackgroundColor(this.bgColor, undefined, {
          erasable: false
        })
        // 设置背景色不受缩放与平移的影响
        this.canvas.set('backgroundVpt', false)
        // 禁止用户进行组选择
        this.canvas.selection = false
        // 设置当前鼠标停留在
        this.canvas.hoverCursor = 'default'
        // 重新渲染画布
        this.canvas.renderAll()
        // 记录画布原始状态
        this.stateArr.push(JSON.stringify(this.canvas))
        this.stateIdx = 0
      }
    },
    initImage () {
      // 添加canvas背景图片
      const canvas = this.canvas
      // 使用网络图片
      let imgUrl = 'https://img.alicdn.com/imgextra/i4/3164961781/O1CN01YsfdOG1P1jzuEXHwq_!!3164961781.jpg_800x800.jpg'
      fabric.Image.fromURL(imgUrl, (img, err) => {
        if (err) {
          canvas.setBackgroundColor('rgba(85, 107, 198, 0.6)',
            canvas.renderAll.bind(canvas))
        } else {
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width / img.width,
            scaleY: canvas.height / img.height,
            // 禁止使用橡皮擦
            erasable: false,
            // 使用的图片跨域时，配置此参数
            crossOrigin: 'anonymous'
          })
        }
      })
    },
    // 选择
    select () {
      this.canvas.isDrawingMode = false
    },
    // 画笔
    Pencil () {
      // 开启画布自由绘画模式
      this.canvas.isDrawingMode = true
      // 设置自由绘画模式画笔类型为 铅笔类型
      this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas)
      // 设置自由绘画模式 画笔颜色与画笔线条大小
      this.canvas.freeDrawingBrush.color = this.strokeColor
      this.canvas.freeDrawingBrush.width = 4
    },
    // 橡皮擦
    Brush () {
      // 设置绘画模式画笔类型为 铅笔类型
      this.canvas.freeDrawingBrush = new fabric.EraserBrush(this.canvas)
      this.canvas.isDrawingMode = true
      //  optional
      this.canvas.freeDrawingBrush.width = 10
      //  undo erasing
      // this.canvas.freeDrawingBrush.inverted = true
    },
    // 矩形
    Rect () {
      let rect = new fabric.Rect({
        left: 100, // 左上角位置
        top: 100, // 左上角位置
        width: 100,
        height: 100,
        fill: this.strokeColor, // 背景颜色
        stroke: this.strokeColor, // 边框颜色
        strokeWidth: 1, // 边框宽度
        hasControls: true, // 设置为false时，选中的时候不出现旋转缩放标识
        hasBorders: true, // 设置为false时，选中的时候不出现边框
        selectable: true, // 不能被选择
        selection: true // 不会出现被选中的效果
      })
      this.canvas.add(rect)
    },
    // 撤销
    undo () {
      this.tapHistoryBtn(-1)
    },
    // 撤销
    redo () {
      this.tapHistoryBtn(1)
    },
    // 删除
    del () {

    },
    // 清空
    clear () {

    },
    // 保存
    save () {

    },
    // 撤销重做按钮点击
    tapHistoryBtn (flag) {
      this.isRedoing = true
      let stateIdx = this.stateIdx + flag
      console.log(stateIdx, 'stateIdx')
      // 判断是否已经到了第一步操作
      if (stateIdx < 0) return
      // 判断是否已经到了最后一步操作
      if (stateIdx >= this.stateArr.length) return
      if (this.stateArr[stateIdx]) {
        this.canvas.loadFromJSON(this.stateArr[stateIdx])
        if (this.canvas.getObjects().length > 0) {
          this.canvas.getObjects().forEach(item => {
            item.set('selectable', false)
          })
        }
        this.stateIdx = stateIdx
      }
    }

  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

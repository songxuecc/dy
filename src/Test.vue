<template>
  <div id="app">
    <div>
      <canvas id="c" width="500" height="500"></canvas>
    </div>
    <div class="flex column">
      <colorPicker v-model="strokeColor" />
      <el-button @click="useRect">方块</el-button>
      <el-button @click="select">选择</el-button>
      <el-button @click="usePencil">画笔</el-button>
      <el-button @click="useBrush">橡皮擦</el-button>
    </div>
  </div>
</template>

<script>
import fabric from 'fabric'
// import './eraser_brush.js'
// import '@/libs/eraser_brush.mixin'
export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      strokeColor: '#ff0000'
    }
  },
  mounted () {
    console.log(fabric, 'fabric')
    this.canvas = new fabric.Canvas('c')
    this.initCanvas()
    this.init()
  },
  methods: {
    // 初始化画布
    initCanvas () {
      // 初始化线框色 与 指示器
      this.strokeColor = '#000000'
      this.lineSize = '10'
      // // this.$refs.strokeColor.style.backgroundColor = this.strokeColor;
      // // 初始化填充色 与 指示器
      // this.fillColor = "rgba(0,0,0,0)";
      // // this.$refs.fillColor.style.backgroundColor = this.fillColor;
      // // 初始化背景色 与 指示器
      // this.bgColor = "#2F782C";
      // // this.$refs.bgColor.style.backgroundColor = this.bgColor;

      // // 初始化 fabric canvas对象
      // if (!this.canvas) {
      //   this.canvas = new fabric.Canvas("c");
      //   // 设置画布背景色 (背景色需要这样设置，否则拓展的橡皮功能会报错)
      //   this.canvas.setBackgroundColor(this.bgColor, undefined, {
      //     erasable: false,
      //   });
      //   // 设置背景色不受缩放与平移的影响
      //   this.canvas.set("backgroundVpt", false);
      //   // 禁止用户进行组选择
      //   this.canvas.selection = false;
      //   // 设置当前鼠标停留在
      //   this.canvas.hoverCursor = "default";
      //   // 重新渲染画布
      //   this.canvas.renderAll();
      //   // 记录画布原始状态
      //   this.stateArr.push(JSON.stringify(this.canvas))
      //   this.stateIdx = 0
      // }
    },
    init () {
      // 添加canvas背景图片
      const canvas = this.canvas
      // 使用本地图片
      // let imgUrl = require('https://img.alicdn.com/imgextra/i4/3164961781/O1CN01YsfdOG1P1jzuEXHwq_!!3164961781.jpg_800x800.jpg')
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

            erasable: false,
            crossOrigin: 'anonymous' // 使用的图片跨域时，配置此参数
          })
        }
      })
      // this.bgColor = '#2F782C'
      this.canvas.setBackgroundColor(this.bgColor, undefined, {
        erasable: false
      })
    },
    useRect () {
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
    usePencil () {
      // 开启画布自由绘画模式
      this.canvas.isDrawingMode = true
      // 设置自由绘画模式画笔类型为 铅笔类型
      this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas)
      // 设置自由绘画模式 画笔颜色与画笔线条大小
      this.canvas.freeDrawingBrush.color = this.strokeColor
      this.canvas.freeDrawingBrush.width = 4
    },
    // 初始化画笔工具
    useBrush () {
      // 设置绘画模式画笔类型为 铅笔类型
      this.canvas.freeDrawingBrush = new fabric.EraserBrush(this.canvas)
      this.canvas.isDrawingMode = true
      //  optional
      this.canvas.freeDrawingBrush.width = 10
      //  undo erasing
      // this.canvas.freeDrawingBrush.inverted = true
    },
    select () {
      this.canvas.isDrawingMode = false
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

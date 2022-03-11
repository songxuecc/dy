<template>
  <el-container class="left" style="height:100%;box-sizing:border-box;">
    <el-container >
      <el-aside width="320px" style="padding:10px 20px 30px 20px;margin-right:20px;box-shadow: 2px 0 4px rgb(0 0 0 / 5%);">
          <el-row class="bold font-14 mb-10 mt-10">画笔颜色(可吸取图片颜色)</el-row>
          <div class="flex mb-10">
            <div class="btn-color flex align-c">
              <colorPicker v-model="strokeColor" style="flex:1;z-index:9999"/>
              <el-input type="text" size="mini" v-model="strokeColor" style="width:100px;margin-left:10px" />
            </div>
          </div>

          <el-row class="bold font-14 ">画笔大小</el-row>
          <div class="brushWidth flex align-c mb-10">
            <el-slider  :min="1" :max="100" v-model="lineSize" style="flex:1"/>
            <el-input type="text" size="mini" v-model="lineSize" style="width:60px;margin-left:10px" />
          </div>

          <el-row class="bold font-14 ">字体大小</el-row>
          <div class="brushWidth flex align-c mb-10">
            <el-slider  :min="1" :max="100" v-model="fontSize"  style="flex:1"/>
            <el-input type="text" size="mini" v-model="fontSize" style="width:60px;margin-left:10px" />
          </div>

          <!-- <div class="bold font-14 flex mb-10 justify-b">
            <span>缩放大小</span>
            <div style="width:100px">{{zoom}}</div>
          </div> -->

          <el-row class="bold font-14 mb-10">图片调整</el-row>
          <el-row class="mb-20">
            <el-col class="mb-10" :span="12"><el-button size="medium" style="width:125px;height:36px" icon="el-icon-edit-outline" @click="tapToolBtn('brush')" :type="  selectTool == 'brush' ? 'primary':'default'" >画笔</el-button></el-col>
            <el-col class="mb-10" :span="12"><el-button size="medium" style="width:125px;height:36px" icon="el-icon-edit-outline" @click="tapToolBtn('rect')" :type="selectTool == 'rect' ? 'primary':'default'" >方块</el-button></el-col>
            <el-col class="mb-10" :span="12"><el-button size="medium" style="width:125px;height:36px" icon="el-icon-edit-outline"  @click="tapToolBtn('text')" :type="selectTool == 'text' ? 'primary':'default'" >文本</el-button></el-col>
            <el-col class="mb-10" :span="12"><el-button size="medium" style="width:125px;height:36px" icon="el-icon-edit-outline"  @click="tapToolBtn('eraser')" :type="selectTool == 'eraser' ? 'primary':'default'" >橡皮</el-button></el-col>
            <el-col class="mb-10" :span="12"><el-button size="medium" style="width:125px;height:36px" icon="el-icon-edit-outline"  @click="tapToolBtn('select')"  :type="selectTool == 'select' ? 'primary':'default'">选择</el-button></el-col>
            <!-- <el-col class="mb-10" :span="12"><el-button size="medium" style="width:125px;height:36px" icon="el-icon-rank"  @click="tapToolBtn('move')" :type="selectTool == 'move' ? 'primary':'default'"  >移动</el-button></el-col> -->
            <el-col class="mb-10" :span="12"><el-button size="medium" style="width:125px;height:36px" icon="el-icon-circle-plus-outline"  @click="tapScaleBtn(1)"  >放大</el-button></el-col>
            <el-col class="mb-10" :span="12"><el-button size="medium" style="width:125px;height:36px" icon="el-icon-remove-outline"  @click="tapScaleBtn(-1)"  >缩小</el-button></el-col>
            <el-col class="mb-10" :span="12"><el-button size="medium" style="width:125px;height:36px" icon="el-icon-delete"  @click="del" >删除</el-button></el-col>
            <el-col class="mb-10" :span="12"><el-button size="medium" style="width:125px;height:36px" icon="el-icon-refresh-left"  @click="tapHistoryBtn(-1)" >返回</el-button></el-col>
            <el-col class="mb-10" :span="12"><el-button size="medium" style="width:125px;height:36px" icon="el-icon-refresh-right"  @click="tapHistoryBtn(1)" >撤销</el-button></el-col>
            <el-col  :span="12"><el-button size="medium" style="width:125px;height:36px" icon="el-icon-refresh"  @click="tapClearBtn" >清除</el-button></el-col>
          </el-row>
          <el-row >
            <el-col  :span="12"><el-button size="medium" type="primary" style="width:265px;height:36px" icon="el-icon-edit-outline"  @click="tapSaveBtn" >保存</el-button></el-col>
          </el-row>

      </el-aside>
      <el-main class="flex justify-c pr-20" style="overflow:auto">
        <div :style="`box-shadow: 0 4px 20px rgb(0 0 0 / 10%);width:${width}px;height:${height}px;`" >
          <canvas id="c"></canvas>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import fabric from 'fabric'

export default {
  name: 'DrawingBoard',
  props: {
    imgUrl: String
  },
  data () {
    return {
      // fabric canvas对象
      canvas: null,
      // 线框色
      strokeColor: '#000000',
      // 背景色
      bgColor: '#ffffff',
      // 线条大小 （线条 and 线框）
      lineSize: 5,
      // 字体大小
      fontSize: 18,
      // 当前用户选择的绘图工具 画笔：brush 直线：line 矩形：rect 圆形 circle 文本 text
      selectTool: '',
      // 鼠标绘制起点
      mouseFrom: {},
      // 鼠标绘制重点
      mouseTo: {},
      // 保存鼠标未松开时用户绘制的临时图像
      drawingObject: null,
      // 保存用户创建的文本对象
      textObject: null,
      // 当前是否正在绘制图形（画笔，文本模式除外）
      isDrawing: false,
      // 保存画布的操作记录
      stateArr: [],
      // 当前操作步数
      stateIdx: 0,
      // 当前是否在执行撤销或重做操作
      isRedoing: false,
      // 画布大小
      originWidth: 500,
      originHeight: 500,
      zoom: 1,
      width: undefined,
      height: undefined
    }
  },
  watch: {
    // 监听线条大小变化
    lineSize () {
      this.canvas.freeDrawingBrush.width = this.lineSize
    },
    // 监听背景色变化
    strokeColor () {
      this.tapToolBtn(this.selectTool, true)
    }
  },
  methods: {
    initImage (src) {
      // 添加canvas背景图片
      const self = this
      // 使用网络图片
      fabric.Image.fromURL(
        src,
        (img, err) => {
          if (err) {
            // canvas.setBackgroundColor(
            //   self.bgColor,
            //   canvas.renderAll.bind(canvas)
            // )
          } else {
            const scale = 500 / img.width
            this.scale = scale.toFixed(2)

            this.originWidth = img.width
            this.originHeight = img.height

            this.width = scale * img.width
            this.height = scale * img.height
            this.canvas.setWidth(this.width)
            this.canvas.setHeight(this.height)

            const imgConfig = {
              scaleX: scale,
              scaleY: scale,
              erasable: false,
              // 使用的图片跨域时，配置此参数
              crossOrigin: 'anonymous',
              src: this.imgUrl
            }
            img.set(imgConfig)
            self.canvas.add(img)
          }
        },
        {
          crossOrigin: 'anonymous'
        }
      )
    },
    // 初始化画布
    async initCanvas () {
      // 初始化 fabric canvas对象
      if (!this.canvas) {
        this.isRedoing = true
        this.canvas = new fabric.Canvas('c')
        this.initImage(this.imgUrl)
        this.isRedoing = false
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
        // 当选择画布中的对象时，该对象不出现在顶层。
        this.canvas.preserveObjectStacking = true
        this.stateIdx = 0
      }
    },
    // 初始化画布事件
    initCanvasEvent () {
      // 操作类型集合
      let toolTypes = ['line', 'rect', 'circle', 'text', 'move']

      // 监听鼠标按下事件
      this.canvas.on('mouse:down', (options) => {
        if (this.selectTool !== 'text' && this.textObject) {
          // 如果当前存在文本对象，并且不是进行添加文字操作 则 退出编辑模式，并删除临时的文本对象
          // 将当前文本对象退出编辑模式
          this.textObject.exitEditing()
          this.textObject.set('backgroundColor', 'rgba(0,0,0,0)')
          if (this.textObject.text === '') {
            this.canvas.remove(this.textObject)
          }
          this.canvas.renderAll()
          this.textObject = null
        }
        // 判断当前是否选择了集合中的操作
        if (toolTypes.indexOf(this.selectTool) !== -1) {
          // 记录当前鼠标的起点坐标 (减去画布在 x y轴的偏移，因为画布左上角坐标不一定在浏览器的窗口左上角)
          this.mouseFrom.x = options.e.clientX - this.canvas._offset.left
          this.mouseFrom.y = options.e.clientY - this.canvas._offset.top
          // 判断当前选择的工具是否为文本
          if (this.selectTool === 'text') {
            // 文本工具初始化
            this.initText()
          } else {
            // 设置当前正在进行绘图 或 移动操作
            this.isDrawing = true
          }
        }
      })
      // 监听鼠标移动事件
      this.canvas.on('mouse:move', (options) => {
        // 如果当前正在进行绘图或移动相关操作
        if (this.isDrawing) {
          // 记录当前鼠标移动终点坐标 (减去画布在 x y轴的偏移，因为画布左上角坐标不一定在浏览器的窗口左上角)
          this.mouseTo.x = options.e.clientX - this.canvas._offset.left
          this.mouseTo.y = options.e.clientY - this.canvas._offset.top
          switch (this.selectTool) {
            case 'line':
              // 当前绘制直线，初始化直线绘制
              this.initLine()
              break
            case 'rect':
              // 初始化 矩形绘制
              this.initRect()
              break
            case 'circle':
              // 初始化 绘制圆形
              this.initCircle()
              break
            case 'move':
              // 初始化画布移动
              this.initMove()
              break
            // case 'select':
            //   // 初始化画布移动
            //   this.select()
            //   break
          }
        }
      })
      // 监听鼠标松开事件
      this.canvas.on('mouse:up', (options) => {
        // 如果当前正在进行绘图或移动相关操作
        if (this.isDrawing) {
          // 清空鼠标移动时保存的临时绘图对象
          this.drawingObject = null
          // 重置正在绘制图形标志
          this.isDrawing = false
          // 清空鼠标保存记录
          this.resetMove()
          // 如果当前进行的是移动操作，鼠标松开重置当前视口缩放系数
          if (this.selectTool === 'move') {
            this.canvas.setViewportTransform(this.canvas.viewportTransform)
          }
        }
      })
      // 监听画布渲染完成
      this.canvas.on('after:render', () => {
        if (!this.isRedoing) {
          // 当前不是进行撤销或重做操作
          // 在绘画时会频繁触发该回调，所以间隔1s记录当前状态
          if (this.recordTimer) {
            clearTimeout(this.recordTimer)
            this.recordTimer = null
          }
          this.recordTimer = setTimeout(() => {
            this.stateArr.push(JSON.stringify(this.canvas))
            this.stateIdx++
            console.log(this.stateIdx)
          }, 100)
        } else {
          // 当前正在执行撤销或重做操作，不记录重新绘制的画布
          this.isRedoing = false
        }
      })
    },
    // 初始化画笔工具
    initBruch () {
      // 设置绘画模式画笔类型为 铅笔类型
      this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas)
      // 设置画布模式为绘画模式
      this.canvas.isDrawingMode = true
      // 设置绘画模式 画笔颜色与画笔线条大小
      this.canvas.freeDrawingBrush.color = this.strokeColor
      this.canvas.freeDrawingBrush.width = parseInt(this.lineSize, 10)
    },
    // 初始化 绘制直线
    initLine () {
      // 根据保存的鼠标起始点坐标 创建直线对象
      let canvasObject = new fabric.Line(
        [
          this.getTransformedPosX(this.mouseFrom.x),
          this.getTransformedPosY(this.mouseFrom.y),
          this.getTransformedPosX(this.mouseTo.x),
          this.getTransformedPosY(this.mouseTo.y)
        ],
        {
          fill: this.fillColor,
          stroke: this.strokeColor,
          strokeWidth: this.lineSize
        }
      )
      // 绘制 图形对象
      this.startDrawingObject(canvasObject)
    },
    // 初始化 绘制矩形
    initRect () {
      // 计算矩形长宽
      const zoom = this.canvas.getZoom()
      let left = this.getTransformedPosX(this.mouseFrom.x)
      let top = this.getTransformedPosY(this.mouseFrom.y)
      let width = (this.mouseTo.x - this.mouseFrom.x) / zoom
      let height = (this.mouseTo.y - this.mouseFrom.y) / zoom
      // 创建矩形 对象
      let canvasObject = new fabric.Rect({
        left: left,
        top: top,
        width: width,
        height: height,
        stroke: this.strokeColor,
        fill: this.strokeColor,
        strokeWidth: this.lineSize,
        selectable: true, // 不能被选择
        selection: true // 不会出现被选中的效果
      })
      // 绘制矩形
      this.startDrawingObject(canvasObject)
    },
    // 初始化绘制圆形
    initCircle () {
      let left = this.getTransformedPosX(this.mouseFrom.x)
      let top = this.getTransformedPosY(this.mouseFrom.y)
      // 计算圆形半径
      let radius =
        Math.sqrt(
          (this.getTransformedPosX(this.mouseTo.x) - left) *
            (this.getTransformedPosY(this.mouseTo.x) - left) +
            (this.getTransformedPosX(this.mouseTo.y) - top) *
              (this.getTransformedPosY(this.mouseTo.y) - top)
        ) / 2
      // 创建 原型对象
      let canvasObject = new fabric.Circle({
        left: left,
        top: top,
        stroke: this.strokeColor,
        fill: this.fillColor,
        radius: radius,
        strokeWidth: this.lineSize
      })
      // 绘制圆形对象
      this.startDrawingObject(canvasObject)
    },
    // 初始化文本工具
    initText () {
      if (!this.textObject) {
        // 当前不存在绘制中的文本对象

        // 创建文本对象
        this.textObject = new fabric.Textbox('', {
          left: this.getTransformedPosX(this.mouseFrom.x),
          top: this.getTransformedPosY(this.mouseFrom.y),
          fontSize: this.fontSize,
          fill: this.strokeColor,
          hasControls: false,
          editable: true,
          width: 30,
          backgroundColor: '#fff',
          selectable: true,
          selection: true // 不会出现被选中的效果
        })
        this.canvas.add(this.textObject)
        // 文本打开编辑模式
        this.textObject.enterEditing()
        // 文本编辑框获取焦点
        this.textObject.hiddenTextarea.focus()
      } else {
        // 将当前文本对象退出编辑模式
        this.textObject.exitEditing()
        this.textObject.set('backgroundColor', 'rgba(0,0,0,0)')
        if (this.textObject.text === '') {
          this.canvas.remove(this.textObject)
        }
        this.canvas.renderAll()
        this.textObject = null
      }
    },
    // 初始化橡皮擦功能
    initEraser () {
      this.canvas.freeDrawingBrush = new fabric.EraserBrush(this.canvas)
      this.canvas.freeDrawingBrush.width = parseInt(this.lineSize, 10)
      this.canvas.isDrawingMode = true
    },
    // 初始化画布移动
    initMove () {
      var vpt = this.canvas.viewportTransform
      vpt[4] += this.mouseTo.x - this.mouseFrom.x
      vpt[5] += this.mouseTo.y - this.mouseFrom.y
      this.canvas.requestRenderAll()
      this.mouseFrom.x = this.mouseTo.x
      this.mouseFrom.y = this.mouseTo.y
    },
    // 绘制图形
    startDrawingObject (canvasObject) {
      // 禁止用户选择当前正在绘制的图形
      canvasObject.selectable = false
      // 如果当前图形已绘制，清除上一次绘制的图形
      if (this.drawingObject) {
        this.canvas.remove(this.drawingObject)
      }
      // 将绘制对象添加到 canvas中
      this.canvas.add(canvasObject)
      // 保存当前绘制的图形
      this.drawingObject = canvasObject
    },
    // 清空鼠标移动记录 （起点 与 终点）
    resetMove () {
      this.mouseFrom = {}
      this.mouseTo = {}
    },
    // 绘图工具点击选择
    tapToolBtn (tool, reset) {
      if (this.selectTool === tool && !reset) return
      // 保存当前选中的绘图工具
      this.selectTool = tool
      // 选择任何工具前进行一些重置工作
      // 禁用画笔模式
      this.canvas.isDrawingMode = false
      // 禁止图形选择编辑
      let drawObjects = this.canvas.getObjects()
      if (drawObjects.length > 0) {
        drawObjects.map((item) => {
          item.set('selectable', false)
        })
      }
      if (this.selectTool === 'brush') {
        // 如果用户选择的是画笔工具，直接初始化，无需等待用户进行鼠标操作
        this.initBruch()
      } else if (this.selectTool === 'eraser') {
        // 如果用户选择的是橡皮擦工具，直接初始化，无需等待用户进行鼠标操作
        this.initEraser()
      } else if (this.selectTool === 'select') {
        // 如果用户选择的是橡皮擦工具，直接初始化，无需等待用户进行鼠标操作
        this.initSelect()
      }
    },
    // 缩放按钮点击
    tapScaleBtn (flag) {
      // flag -1 缩小 1 放大
      let zoom = this.canvas.getZoom()
      if (flag > 0) {
        // 放大
        zoom *= 1.1
      } else {
        // 缩小
        zoom *= 0.9
      }
      // zoom 不能大于 20 不能小于0.01
      zoom = zoom > 20 ? 20 : zoom
      zoom = zoom < 0.01 ? 0.01 : zoom

      zoom = zoom.toFixed(2)
      this.canvas.setZoom(zoom)
      // 放大缩小画布
      let newZoom = this.canvas.getZoom()
      this.zoom = newZoom
      let scale = this.scale
      const originWidth = this.originWidth
      const originHeight = this.originHeight
      const width = originWidth * scale * newZoom
      const height = originHeight * scale * newZoom
      this.canvas.setWidth(width)
      this.canvas.setHeight(height)
      this.width = width
      this.height = height
      console.log(newZoom, scale, originWidth, width)
    },
    // 撤销重做按钮点击
    tapHistoryBtn (flag) {
      this.isRedoing = true

      let stateIdx = this.stateIdx + flag
      // 判断是否已经到了第一步操作
      if (stateIdx < 1) return
      // 判断是否已经到了最后一步操作
      if (stateIdx >= this.stateArr.length) return
      if (this.stateArr[stateIdx]) {
        this.canvas.loadFromJSON(this.stateArr[stateIdx])
        if (this.canvas.getObjects().length > 0) {
          this.canvas.getObjects().forEach((item) => {
            item.set('selectable', false)
          })
        }
        this.stateIdx = stateIdx
      }
    },
    // 监听画布重新绘制
    tapClearBtn () {
      let children = this.canvas.getObjects()
      if (children.length > 0) {
        this.canvas.remove(...children)
      }
    },
    // 保存按钮点击
    tapSaveBtn () {
      let newZoom = this.canvas.getZoom()
      let scale = this.scale
      const enlarge = 1 / scale * newZoom
      const width = this.canvas.width / scale
      const height = this.canvas.height / scale
      console.log(enlarge, 'enlarge')

      this.canvas.clone((cvs) => {
        cvs.setZoom(enlarge)
        // 遍历所有对对象，获取最小坐标，最大坐标
        let top = 0
        let left = 0

        const dataURL = cvs.toDataURL({
          format: 'jpeg',
          multiplier: cvs.getZoom(),
          left,
          top,
          width,
          height
        })
        // 压缩图片
        function compress (
          base64, // 源图片
          rate, // 缩放比例
          callback // 回调
        ) {
        // 处理缩放，转格式
          var _img = new Image()
          _img.src = base64
          _img.onload = function () {
            var _canvas = document.createElement('canvas')
            var w = this.width / rate
            var h = this.height / rate
            _canvas.setAttribute('width', w)
            _canvas.setAttribute('height', h)
            _canvas.getContext('2d').drawImage(this, 0, 0, w, h)
            var base64 = _canvas.toDataURL('image/jpeg')
            _canvas.toBlob(function (blob) {
              if (blob.size > 750 * 1334) { // 如果还大，继续压缩
                compress(base64, rate, callback)
              } else {
                callback(base64)
              }
            }, 'image/jpeg')
          }
        }
        compress(
          dataURL,
          1.5,
          function (base64) {
            const link = document.createElement('a')
            link.download = 'canvas.jpeg'
            console.log(base64, 'base64')
            link.href = base64
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        )
      })
    },
    // 计算画布移动之后的x坐标点
    getTransformedPosX (x) {
      let zoom = Number(this.canvas.getZoom())
      return (x - this.canvas.viewportTransform[4]) / zoom
    },
    getTransformedPosY (y) {
      let zoom = Number(this.canvas.getZoom())
      return (y - this.canvas.viewportTransform[5]) / zoom
    },
    initSelect () {
      console.log(this.canvas.getActiveObject())
      if (this.canvas.getActiveObject() && this.canvas.getActiveObject().src === this.imgUrl) {
        return false
      } else {
        this.canvas.isDrawingMode = false
        this.selectTool = 'select'
        let drawObjects = this.canvas.getObjects()
        if (drawObjects.length > 0) {
          drawObjects.map((item) => {
            item.set('selectable', true)
          })
        }
      }
      // let drawObjects = this.canvas.getObjects()
      // if (drawObjects.length > 0) {
      //   drawObjects.map((item) => {
      //     item.set('selectable', true)
      //   })
      // }
      // this.canvas.isDrawingMode = false
      // this.selectTool = 'select'
    },
    del () {
      if (this.canvas.getActiveObject().src === this.imgUrl) {
        this.$message.warning('不可以删除此图片')
        return false
      } else {
        this.canvas.remove(this.canvas.getActiveObject())
      }
    }
  },
  mounted () {
    this.initCanvas()
    this.tapToolBtn('brush')
    this.initCanvasEvent()
  }
}
</script>
<style lang="less" scoped>
.home {
  overflow: hidden;
  height: 100vh;
}

 /deep/ .colorBtn {
      width: 40px !important;
      height: 24px !important;
      border-radius: 2px;
    }

.btnwrap {
  height: 50px;
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  .btn-color {
    width: 40px;
    height: 40px;
    position: relative;
    margin-left: 20px;

  }
  .color-label {
    padding-left: 4px;
  }

  .brushWidth {
    margin-left: 10px;
  }

  .btn-tool {
    margin-left: 10px;
    padding: 0 4px;
    &:hover {
      cursor: pointer;
    }
    &.active {
      background: #2962ff;
      color: #fff;
      border-color: #2962ff;
    }
  }
}

/deep/ .el-container {
  height: 100%;
}
</style>

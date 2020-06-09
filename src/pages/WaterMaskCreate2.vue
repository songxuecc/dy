<template lang="html">
  <el-container class="main-wrapper" style="height:700px">
    <el-header>
       <div class="navbar">
        <div class="navbar-content">
            <div class="nav-title">虎虎抖音小店</div>
            <div class="nav-right">
                <el-button size="small" @click="openSaveDialog">保存</el-button>
                <el-button size="small" @click="leftDialogVisible=true">返回</el-button>
            </div>
            <el-dialog
                title="预览图" width="30%"
                :visible.sync="saveDialogVisible">
                 <div v-html="canvas && canvas.toSVG()"></div>
                 <el-button size="mini" @click="saveDialogVisible=false">继续设计</el-button>
                 <el-button size="mini" @click="saveWaterMark('new')">新存一张</el-button>
                 <el-button v-if="waterMark.water_mark_type === 0" size="mini" @click="saveWaterMark('old')">覆盖原图</el-button>
             </el-dialog>
             <el-dialog width="30%"
                :visible.sync="saveDialogVisible2">
                 <div>已保存至我的水印</div>
                 <el-button size="mini" @click="saveDialogVisible2=false">继续设计</el-button>
                 <el-button size="mini" @click="startCreateWaterMarkActivity">去投放</el-button>
             </el-dialog>
             <el-dialog width="30%"
                :visible.sync="leftDialogVisible">
                 <div>是否确定要离开？</div>
                 <el-button size="mini" @click="leftDialogVisible=false;$router.go(-1)">确定</el-button>
                 <el-button size="mini" @click="leftDialogVisible=false">取消</el-button>
             </el-dialog>
        </div>
    </div>
    </el-header>
    <el-main style="padding-top:0; padding-bottom:0;">
      <el-container>
        <el-aside width="100px" direction="vertical" style="background:rgb(181,192,207)">
            <el-popover
              placement="right"
              width="400"
              trigger="click"
              ref="myImagePopover"
              >
              <el-tabs  @tab-click="scTabClick" v-model="scTabs">
                <el-tab-pane label="基本图形" name="base-shape">
                    <el-button class="icon-button" @click="addObject('Rect'); closePopover('myImagePopover')">
                      <i class='iconfont icon-rect' style="font-size:80px"></i>
                    </el-button>
                    <el-button class="icon-button" @click="addObject('Circle'); closePopover('myImagePopover')" >
                      <i class='iconfont icon-circle' style="font-size:80px"></i>
                    </el-button>
                </el-tab-pane>
                <!-- <el-tab-pane label="系统元素" name="material">
                  <ul style="display:inline; padding:0px;">
                    <li v-for="(item ,i) in waterMarkMaterialList" :key="i" style="display:inline;margin-left:10px;">
                     <el-button style="padding:0px;" @click="addObjectsFromJson(item.json); closePopover('myImagePopover')">
                        <div v-html="item.svg"></div>
                      </el-button>
                    </li>
                  </ul>
                </el-tab-pane> -->
                <el-tab-pane label="我的图片" name='user-image'>
                  <ul style="display:inline; padding:0px;">
                     <li v-for="image in userWaterMarkImageList" :key="image.url" style="display:inline;margin-left:10px;">
                      <el-button style="padding:0px;"
                        @click="addImageObject(image.url); closePopover('myImagePopover')">
                        <el-image style="width: 100px; height: 100px;" :src="image.url" fit="fill"></el-image>
                      </el-button>
                    </li>
                  </ul>
                   <el-upload style="vertical-align:top;display: inline; margin-left:5px;"
                      :action="uploadWaterMarkImageAction"
                      :headers="getTokenHeaders"
                      :on-success="uploadOnSuccess"
                      :show-file-list="false"
                      :multiple="false"
                      >
                      <el-button style="padding:0px;">
                        <i class='el-icon-plus' style="width: 100px; height: 100px; line-height:100px"></i>
                      </el-button>
                    </el-upload>
                </el-tab-pane>
              </el-tabs>
              <el-button slot="reference" style="margin-top:30px;" type="primary" plain size='medium'>素材</el-button>
            </el-popover>
            <el-button @click="addObject('IText')" style="margin-top:30px;" type="primary" plain size='medium'>文本</el-button>
            <el-tooltip class="item" effect="dark" content="自动替换为每个商品的促销价" placement="top">
              <el-button @click="addObject('PriceText')" style="margin-top:30px; margin-left:0" type="primary" plain size='medium'>价格</el-button>
            </el-tooltip>
        </el-aside>
        <el-main style="height: 630px; background-color:rgb(234,238,242); padding:0">
          <div style="margin:auto;width:600px;margin-top:15px;">
            <canvas id="canvas" class="canvas_bg" width="600" height="600"></canvas>
          </div>
        </el-main>
        <el-aside width="250px" direction="vertical" style="background:rgb(181,192,207);padding:10px;font-size: 12px;
    text-align: left;">
          <div v-if='selectedObj'>
            <el-row v-if='isTextObject(selectedObj) && selectedObj.isPrice !== true'  class='style-item'>
              <el-input type='textarea' :autosize="{ minRows: 2, maxRows: 4}" v-model='selectedObj.text'
                    @change="changeStyle('text')">
              </el-input>
            </el-row>
             <el-row v-if='isTextObject(selectedObj) && selectedObj.isPrice === true'  class='style-item'>
               <span>内容自动用团购价进行替换（9.9为示意）</span>
            </el-row>
            <el-row v-if='isTextObject(selectedObj)' class='style-item'>
              <el-button :class="['icon-button', selectedObj.fontWeight ==='bold'? 'active':'']"
                        size='min' plain style="padding:0;border:0"
                        @click="changeStyle('fontWeight',selectedObj.fontWeight ==='bold'? 'normal':'bold')">
                <i class='iconfont icon-jiacu' style="font-size:20px" ref='jiacu'></i>
              </el-button>
              <el-button :class="['icon-button', selectedObj.fontStyle ==='oblique'? 'active':'']"
                          size='min' plain style="padding:0;border:0"
                          @click="changeStyle('fontStyle', selectedObj.fontStyle ==='oblique'? 'normal':'oblique');">
                <i class='iconfont icon-xieti' style="font-size:20px"></i>
              </el-button>
              <el-button :class="['icon-button', selectedObj.underline === true? 'active':'']"
                      size='min' plain  @click="changeStyle('underline', selectedObj.underline ===true ? false:true);">
                <i class='iconfont icon-xiahuaxian' style="font-size:20px"></i>
              </el-button>
            </el-row>
            <el-row v-if='isTextObject(selectedObj)' class='style-item'>
              <el-col :span="4"><span class='slider-desc'>字体</span></el-col>
              <el-select v-model="selectedObj.fontFamily" placeholder="请选择" size='mini' @change="changeStyle('fontFamily')">
                  <el-option
                    v-for="(item,i) in fontFamilys"
                    :key="i"
                    :label="item.label"
                    :value="item.value">
                    <span v-bind:style="{fontFamily:item.value}">{{ item.label }}</span>
                  </el-option>
              </el-select>
            </el-row>
            <el-row class='style-item' v-if='!isImageObject(selectedObj)'>
                <el-col :span="4"><span class='slider-desc'>颜色</span></el-col>
                <el-color-picker v-model="selectedObj.fill" size="mini" :show-alpha="true"
                    @change="changeStyle('fill', selectedObj.fill)"></el-color-picker>
            </el-row>
            <el-row class='style-item'>
                <el-col :span="4"><span class='slider-desc'>透明度</span></el-col>
                <el-col :span="20">
                  <el-slider v-model="selectedObj.opacity" :min=0 :max=1 :step='0.01' show-input :show-input-controls=false input-size='mini'
                      @change="changeStyle('opacity')"></el-slider></el-col>
            </el-row>
            <el-row class='style-item'>
                <el-col :span="4"><span class='slider-desc'>旋转</span></el-col>
                <el-col :span="20">
                  <el-slider v-model="selectedObj.angle" :min=-180 :max=180 show-input :show-input-controls=false input-size='mini'
                      @change="changeStyle('angle')"></el-slider>
              </el-col>
            </el-row>
            <el-row v-if='isTextObject(selectedObj)' class='style-item'>
                <el-col :span="4"><span class='slider-desc'>字号</span></el-col>
                <el-col :span="20">
                  <el-slider v-model="selectedObj.fontSize" :min=12 :max=250 :step=2 show-input :show-input-controls=false input-size='mini'
                    @change="changeStyle('fontSize')"></el-slider>
              </el-col>
            </el-row>
            <el-row class='style-item'>
              <el-col :span="12">
                <el-input placeholder="" v-model="selectedObj.left" size="mini" @change="changeStyle('left',parseInt(selectedObj.left))">
                  <template slot="prepend"><div>x</div></template>
                </el-input>
              </el-col>
              <el-col :span="12">
                <el-input placeholder="" v-model="selectedObj.top" size="mini" @change="changeStyle('top',parseInt(selectedObj.top))">
                  <template slot="prepend"><div>y</div></template>
                </el-input>
              </el-col>
            </el-row>
            <!-- <el-row class='style-item'  v-if='isImageObject(selectedObj)'>
              <el-col :span="12">
                <el-input placeholder="" v-model="selectedObj.width" size="mini" @change="changeStyle('left',parseInt(selectedObj.width))">
                  <template slot="prepend"><div>宽</div></template>
                </el-input>
              </el-col>
              <el-col :span="12">
                <el-input placeholder="" v-model="selectedObj.height" size="mini" @change="changeStyle('top',parseInt(selectedObj.height))">
                  <template slot="prepend"><div>高</div></template>
                </el-input>
              </el-col>
            </el-row> -->
            <!-- <el-row class='style-item'  v-if='isRectObject(selectedObj)'>
                <el-col :span="4"><span class='slider-desc'>角度</span></el-col>
                <el-col :span="20">
                  <el-slider v-model="selectedObj.rx" :min=0 :max=180 :step='1' show-input :show-input-controls=false input-size='mini'
                      @change="changeStyle('rx')">
                  </el-slider>
                </el-col>
            </el-row> -->
          </div>
        </el-aside>
      </el-container>
    </el-main>
    <!-- <el-aside width="200px">Aside</el-aside> -->
    <context-menu id="context-menu" ref="ctxMenu">
      <li @click='deleteObject'>删除</li>
      <li @click='changeToPrice'>转换为价格</li>
    </context-menu>
    <!--为了进页面就加载字体，而不是等到用到再加载-->
    <div v-for="(item, i) in fontFamilys" :key="i">
      <span v-bind:style="{fontFamily:item.value}"></span>
    </div>
  </el-container>
</template>
<script>

import request from '@/mixins/request.js'
import fabric from 'fabric'
import contextMenu from 'vue-context-menu'
import { mapGetters } from 'vuex'

export default {
  mixins: [request],
  components: {
    fabric,
    contextMenu
  },
  data () {
    return {
      waterMark: {
        json: '',
        svg: '',
        water_mark_id: -1,
        water_mark_type: 0
      },
      canvas: null,

      uploadWaterMarkImageAction: '/api/uploadUserWaterMarkImage',
      scTabs: 'base-shape',
      fontFamilys: [
        {'label': '思源黑体Heavy', 'value': 'SourceHanSansSC-Heavy'},
        {'label': '思源黑体Bold', 'value': 'SourceHanSansSC-Bold'},
        {'label': '思源黑体Medium', 'value': 'SourceHanSansSC-Medium'},
        {'label': '思源黑体Regular', 'value': 'SourceHanSansSC-Regular'},
        {'label': '思源黑体Normal', 'value': 'SourceHanSansSC-Normal'},
        {'label': '思源黑体Light', 'value': 'SourceHanSansSC-Light'},
        {'label': '思源黑体ExtraLight', 'value': 'SourceHanSansSC-ExtraLight'},
        {'label': '思源宋体Heavy', 'value': 'SourceHanSerifSC-Heavy'},
        {'label': '思源宋体Bold', 'value': 'SourceHanSerifSC-Bold'},
        {'label': '思源宋体SemiBold', 'value': 'SourceHanSerifSC-SemiBold'},
        {'label': '思源宋体Medium', 'value': 'SourceHanSerifSC-Medium'},
        {'label': '思源宋体Regular', 'value': 'SourceHanSerifSC-Regular'},
        {'label': '思源宋体Light', 'value': 'SourceHanSerifSC-Light'},
        {'label': '思源宋体ExtraLight', 'value': 'SourceHanSerifSC-ExtraLight'},
        {'label': '站酷小微', 'value': 'zk-xw'},
        {'label': '站酷文艺体', 'value': 'zk-wy'},
        {'label': '站酷快乐体', 'value': 'zk-kl'}
      ],
      userWaterMarkImageList: [],
      waterMarkMaterialList: [],
      myImageUploadShow: true,
      selectedObj: null,
      textDefaultStyle: {
        'fontWeight': 'normal',
        'fontStyle': 'normal',
        'underline': false,
        'fontFamily': 'SourceHanSansSC-Bold',
        'fill': 'rgba(0,0,0,1)',
        'opacity': 1,
        'angle': 0,
        'fontSize': 12,
        'left': 250,
        'top': 250
      },
      objectDefaultStyle: {
        'fill': 'rgba(0,0,0,1)',
        'opacity': 1,
        'angle': 0,
        'left': 0,
        'top': 0
      },
      saveDialogVisible: false,
      saveDialogVisible2: false,
      leftDialogVisible: false,
      WaterMarkTypeOptions: [
        {value: -1, label: '全部'},
        {value: 1001, label: '中秋节'},
        {value: 1002, label: '七夕节'},
        {value: 0, label: '我的'}
      ],
      waterMarkTemplatetype: -1
    }
  },
  computed: {
    ...mapGetters({
      getTokenHeaders: 'getTokenHeaders'
    })
  },
  watch: {
  },
  mounted () {
    // 添加子定义属性
    fabric.Object.prototype.toObject = (function (toObject) {
      return function (propertiesToInclude) {
        propertiesToInclude = (propertiesToInclude || []).concat(
          ['isPrice']
        )
        return toObject.apply(this, [propertiesToInclude])
      }
    })(fabric.Object.prototype.toObject)
    this.canvas = new fabric.Canvas('canvas', {
      fireRightClick: true, // 允许右键
      preserveObjectStacking: true // 选中object不在最上层
    })
    let self = this

// let strSvg = '<svg width="450" height="450" id="svgcontent" overflow="visible" x="0" y="0" viewBox="0 0 600 600"><!-- 光云科技制作 --><defs></defs><g style="pointer-events:none"><title style="pointer-events:inherit">background</title><rect fill="none" id="canvas_background" height="802" width="802" y="-1" x="-1" style="pointer-events:inherit"></rect><g display="none" id="canvasGrid" style="pointer-events:inherit"><rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%" style="pointer-events:inherit" id="svg_1"></rect></g></g><g style="pointer-events:all"><title style="pointer-events:inherit">Layer 1</title><g stroke="null" id="svg_7" style="pointer-events:inherit"><g stroke="null" id="svg_4" style="pointer-events:inherit"><g stroke="null" id="svg_5" style="pointer-events:inherit"><path stroke="null" fill="#bf0000" id="svg_6" d="M-2,711.99999L801.99999,711.99999L801.99999,800L-2,800L-2,711.99999" style="pointer-events:inherit"></path></g></g></g><text xml:space="preserve" text-anchor="start" font-family="Source Han Sans, Source Han Sans_temp" font-size="44" id="svg_8" y="772" x="21" stroke-width="0" stroke="#000" fill="#ffffff" style="pointer-events:inherit">新升级更好用  谁用谁知道</text><g stroke="null" id="svg_15" style="pointer-events:inherit"><g stroke="null" id="svg_12" style="pointer-events:inherit"><g stroke="null" id="svg_13" style="pointer-events:inherit"><path stroke="null" fill="#bf0000" id="svg_14" d="M0,193.00001L0,0L193.00001,0L0,193.00001" style="pointer-events:inherit"></path></g></g></g><text transform="rotate(-45 39.99999999999999,37.99999999999999) " xml:space="preserve" text-anchor="start" font-family="Source Han Sans, Source Han Sans_temp" font-size="34" id="svg_16" y="52" x="6" stroke-width="0" stroke="#000" fill="#ffff00" style="pointer-events:inherit">新品</text><text transform="rotate(-45 73.99999999999997,67) " xml:space="preserve" text-anchor="start" font-family="Source Han Sans, Source Han Sans_temp" font-size="42" id="svg_17" y="85" x="-10" stroke-width="0" stroke="#000" fill="#ffffff" style="pointer-events:inherit">买一送一</text><g stroke="null" transform="rotate(90.34898376464844 671.93798828125,739.682373046875) " id="svg_24" style="pointer-events:inherit"><g stroke="null" id="svg_21" style="pointer-events:inherit"><g stroke="null" id="svg_22" style="pointer-events:inherit"><path fill="#ffff00" stroke="null" id="svg_23" d="M732.81867,804.01004L672.39448,868.66014L611.05729,804.01004L611.05729,610.70461L732.81866,610.70461L732.81866,804.01004" style="pointer-events:inherit"></path></g></g></g><text xml:space="preserve" text-anchor="start" font-family="Source Han Sans, Source Han Sans_temp" font-size="30" id="svg_25" y="721" x="610" stroke-width="0" stroke="#000" fill="#191919" style="pointer-events:inherit">拼单仅需：</text><text smart-price="2" xml:space="preserve" text-anchor="start" font-family="Source Han Sans, Source Han Sans_temp" font-size="64" id="svg_26" y="783" x="608" stroke-width="0" stroke="#000" fill="#bf0000" style="pointer-events:inherit">88.88</text></g></svg>'
    let strSvg = '<svg width="450" height="450" id="svgcontent" overflow="visible" x="0" y="0" viewBox="0 0 600 600"><!-- 光云科技制作 --><defs></defs><g style="pointer-events:none"><title style="pointer-events:inherit">background</title><rect fill="none" id="canvas_background" height="802" width="802" y="-1" x="-1" style="pointer-events:inherit"></rect><g display="none" id="canvasGrid" style="pointer-events:inherit"><rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%" style="pointer-events:inherit" id="svg_1"></rect></g></g><g style="pointer-events:all"><title style="pointer-events:inherit">Layer 1</title><g stroke="null" id="svg_7" style="pointer-events:inherit"><g stroke="null" id="svg_4" style="pointer-events:inherit"><g stroke="null" id="svg_5" style="pointer-events:inherit"><path stroke="null" fill="#ffffff" id="svg_6" d="M0,696L670.00004,696L670.00004,800L0,800L0,696" style="pointer-events:inherit"></path></g></g></g><text xml:space="preserve" text-anchor="start" font-family="Source Han Sans, Source Han Sans_temp" font-size="60" id="svg_8" y="770" x="22" stroke-width="0" stroke="null" fill="#00a000" style="pointer-events:inherit">有了它，任性出游！</text><g stroke="null" transform="rotate(89.78797149658203 675.8613281250001,721.7996215820311) " id="svg_15" style="pointer-events:inherit"><g stroke="null" id="svg_12" style="pointer-events:inherit"><g stroke="null" id="svg_13" style="pointer-events:inherit"><path stroke="null" fill="#03ad03" id="svg_14" d="M753.60396,783.57069L676.44425,845.65141L598.11866,783.57069L598.11866,597.94779L753.60396,597.94779L753.60396,783.57069" style="pointer-events:inherit"></path></g></g></g><text xml:space="preserve" text-anchor="start" font-family="Source Han Sans, Source Han Sans_temp" font-size="36" id="svg_17" y="694" x="612" stroke-width="0" stroke="null" fill="#ffffff" style="pointer-events:inherit">上新价：</text><text price-name="上新价" xml:space="preserve" text-anchor="start" font-family="Source Han Sans, Source Han Sans_temp" font-size="80" id="svg_18" y="772" x="613" stroke-width="0" stroke="null" fill="#ffff00" style="pointer-events:inherit">88.8</text></g></svg>'
    fabric.loadSVGFromString(strSvg, function (objects, options) {
      for (var i = 0; i < objects.length; i++) {
        let ob = objects[i]
        console.log(ob)
          // object 需要设置需要调整的属性，否则后面无法和控件很好的绑定
        let defaultStyle = (ob.type === 'text' || ob.type === 'i-text') ? self.textDefaultStyle : self.objectDefaultStyle
        for (var style in defaultStyle) {
          if (ob[style] === undefined) {
            ob[style] = defaultStyle[style]
          }
        }
          // 将text 转为 i-text ， 可缩放
        if (ob.type === 'text') {
          let newEditableText = new fabric.IText(ob.text, ob.toObject())
          if (newEditableText.get('fontFamily').indexOf('Source Han Serif SC') !== -1) {
            newEditableText.set('fontFamily', 'SourceHanSerifSC-Medium')
          } else {
            newEditableText.set('fontFamily', 'SourceHanSansSC-Normal')
          }
          console.log(newEditableText)
          self.canvas.remove(ob)
          self.canvas.add(newEditableText)
        } else {
          self.canvas.add(ob)
        }
      }
      self.canvas.renderAll.bind(self.canvas)
    })

    this.addEventToCanvas()

    // 添加监听事件
    this.addEventToCanvas()
  },
  activated () {
     // 导入选中的模版
    if (this.$route.params.waterMark) {
      this.waterMark = this.$route.params.waterMark
      this.loadObjectsFromJson(this.waterMark.json)
    }
    this.saveDialogVisible = false
    this.saveDialogVisible2 = false
  },
  methods: {
    loadObjectsFromJson (strJson) {
      let self = this
      this.canvas.loadFromJSON(strJson, function () {
        self.canvas.renderAll.bind(self.canvas)
      }, function (o, object) {
      })
    },
    addObjectsFromJson (strJson) {
      let json = JSON.parse(strJson)
      let self = this
      fabric.util.enlivenObjects(json.objects, function (objects) {
        self.canvas.add(...objects)
      })
    },
    addContextMenu () {
      let self = this
      fabric.util.addListener(document.getElementsByClassName('upper-canvas')[0], 'contextmenu', function (e) {
        e.preventDefault()
        let target = self.canvas.findTarget(e)
        if (target !== undefined) {
          let contains = false
          self.canvas.getActiveObjects().forEach((object) => {
            if (self.canvas.containsPoint(e, object)) {
              contains = true
            }
          })
          if (contains) {
            self.$refs.ctxMenu.open()
          }
        }
      })
    },
    addEventToCanvas () {
      // 右键自定义菜单
      this.addContextMenu()
      // 更新选中的对象事件
      let self = this
      this.canvas.on('selection:created', function (e) {
        self.setSelectedObject(e.selected)
      })
      this.canvas.on('selection:updated', function (e) {
        self.setSelectedObject(e.selected)
      })
      this.canvas.on('selection:cleared', function (e) {
        self.clearSelectedText()
      })

      this.canvas.on('object:modified', function (event) {
        // 文本scale改为对应的fontSize
        if (event.target) {
          if (event.target.scaleX !== 1 || event.target.scaleY !== 1) {
            let obj = event.target
            if (obj.type === 'i-text') {
              obj.fontSize *= obj.scaleX
              obj.fontSize = parseInt(obj.fontSize)
              obj.scaleX = 1
              obj.scaleY = 1
              obj._clearCache()
            } else if (obj.type === 'rect') {
              // console.log('before: ' , obj.width, obj.height, obj.scaleX, obj.scaleY)
              // obj.scaleToHeight()
              // obj.width *= obj.scaleX
              // obj.height *= obj.scaleY
              // obj.scaleX = 1;
              // obj.scaleY = 1;
              // console.log('after: ' , obj.width, obj.height)
              // // obj._clearCache()
            }
          }
        }
      })
    },
    changeClass (ref) {
      this.$refs[ref].addClass('active')
    },
    clearSelectedText () {
      this.selectedObj = null
    },
    setSelectedObject (selected) {
      this.selectedObj = null
      if (selected.length > 0) {
        this.selectedObj = selected[0]
      }
      console.log(this.selectedObj)
    },
    isTextObject (obj) {
      if (obj.type === 'i-text' || obj.type === 'text') {
        return true
      }
      return false
    },
    isImageObject (obj) {
      if (obj.type === 'image') {
        return true
      }
      return false
    },
    isRectObject (obj) {
      if (obj.type === 'rect') {
        return true
      }
      return false
    },

    deleteObject () {
      this.canvas.getActiveObjects().forEach((obj) => {
        this.canvas.remove(obj)
      })
      this.canvas.discardActiveObject().renderAll()
    },
    changeToPrice () {
      let obj = new fabric.Text('9.9', this.selectedObj.toObject())
      obj.set('text', '9.9')
      obj.set('isPrice', true)
      this.canvas.remove(this.selectedObj)
      this.canvas.add(obj)
      this.canvas.discardActiveObject().renderAll()
    },
    addObject (objectName, props = {}) {
      let obj = null
      if (objectName === 'IText') {
        obj = new fabric.IText('双击修改', this.textDefaultStyle)
      } else if (objectName === 'PriceText') {
        obj = new fabric.Text('9.9', this.textDefaultStyle)
        obj.set('isPrice', true)
      } else {
        let objStyle = this.objectDefaultStyle
        if (objectName === 'Rect') {
          objStyle['width'] = 100
          objStyle['height'] = 100
          objStyle['rx'] = 0
          objStyle['ry'] = 0
        } else if (objectName === 'Circle') {
          objStyle['radius'] = 100
        }
        obj = new fabric[objectName](this.objectDefaultStyle)
      }
      for (let key in props) {
        obj.set(key, props[key])
      }
      if (obj) {
        this.canvas.add(obj)
        this.canvas.setActiveObject(obj)
      }
    },
    addImageObject (url) {
      let self = this
      fabric.Image.fromURL(url, function (oImg) {
        if (oImg.width > 100) {
          let scale = 100 / oImg.width
          oImg.scale(scale)
          self.canvas.add(oImg)
          self.canvas.setActiveObject(oImg)
        }
      }, {crossOrigin: 'anonymous'})
    },
    changeStyle (style = null, value = null) {
      if (style === 'fill') {
        this.selectedObj.fill = ''
      }
      if (style !== null && value !== null) {
        this.selectedObj.set(style, value)
      }
      if (style === 'rx') {
        this.selectedObj.ry = this.selectedObj.rx
      }
      this.selectedObj.setCoords()
      this.selectedObj.dirty = true
      this.canvas.renderAll()
    },
    closePopover (ref) {
      this.$refs[ref].doClose()
    },
    openSaveDialog () {
      this.saveDialogVisible = true
    },
    saveWaterMark (opt) {
      this.saveDialogVisible = false
      let params = {
        str_json: JSON.stringify(this.canvas),
        str_svg: this.canvas.toSVG(),
        water_mark_type: 1007
      }
      this.request('saveWaterMarkTemplate', params, data => {
        this.waterMark.water_mark_id = data.water_mark_id
        this.waterMark.water_mark_type = 0
        this.waterMark.json = params['str_json']
        this.waterMark.svg = params['str_svg']
        this.saveDialogVisible2 = true
      })
    },
    startCreateWaterMarkActivity () {
      this.$router.push({
        name: 'WaterMarkActivityCreate',
        params: {
          'waterMark': this.waterMark
        }
      })
    },
    getUserWaterMarkImageList () {
      let params = {
        page_index: 1,
        page_size: 100
      }
      this.request('getUserWaterMarkImage', params, data => {
        this.userWaterMarkImageList = data
      })
    },
    getWaterMarkMaterialList () {
      let params = {
        page_index: 1,
        page_size: 100,
        type: 1001
      }
      this.request('getWaterMarkMaterialList', params, data => {
        this.waterMarkMaterialList = data
      })
    },

    uploadOnSuccess: function (response, file, fileList) {
      let code = parseInt(response.code)
      if (code !== 0) {
        this.requestFail(new Error('上传图片出错'))
        return
      }
      this.getUserWaterMarkImageList()
    },
    scTabClick: function (tab) {
      if (tab.name === 'user-image') {
        this.getUserWaterMarkImageList()
      } else if (tab.name === 'material') {
        this.getWaterMarkMaterialList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
    @import '~@/assets/css/base.less';
    @import '~@/assets/css/navbar.less';

    /deep/ .el-slider__input{
      width:55px !important;
    }
    /deep/ .el-slider__runway.show-input{
      margin-right:68px
    }

    .canvas_bg{
      background-color: #fff;
      background-size: 23px 23px;
      background-position: 0 0,11.5px 11.5px;
      background-image:linear-gradient(to top right,#ccc 25%,transparent 0,transparent 75%,#ccc 0,#ccc),linear-gradient(to top right,#ccc 25%,transparent 0,transparent 75%,#ccc 0,#ccc)
    }

    .style-item{
      margin-top:10px;
    }
    .solid-border{
        border: 1px solid black;
    }
    @import "//at.alicdn.com/t/font_1334237_164qfx191zs.css";
    .active{
      color: #3089dc !important;
    }
    .icon-button{
      padding:0;
      border:0;
    }
    .icon-button:hover,
    .icon-button:focus{
      color:#333333;
    }
    .slider-desc{
      font-size:12px;
      line-height:38px
    }
    /deep/ svg {
      width:150px;
      height:150px;
    }
    @font-face {
      font-family: "SourceHanSansSC-Bold";
      src: url('../assets/fonts/SourceHanSansSC-Bold.otf');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: "SourceHanSansSC-Heavy";
      src: url('../assets/fonts/SourceHanSansSC-Heavy.otf');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: "SourceHanSansSC-Normal";
      src: url('../assets/fonts/SourceHanSansSC-Normal.otf');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: "SourceHanSansSC-Medium";
      src: url('../assets/fonts/SourceHanSansSC-Medium.otf');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: "SourceHanSansSC-Light";
      src: url('../assets/fonts/SourceHanSansSC-Light.otf');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: "SourceHanSansSC-Regular";
      src: url('../assets/fonts/SourceHanSansSC-Regular.otf');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: "SourceHanSansSC-ExtraLight";
      src: url('../assets/fonts/SourceHanSansSC-ExtraLight.otf');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: "SourceHanSerifSC-Bold";
      src: url('../assets/fonts/SourceHanSerifSC-Bold.otf');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: "SourceHanSerifSC-Heavy";
      src: url('../assets/fonts/SourceHanSerifSC-Heavy.otf');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: "SourceHanSerifSC-SemiBold";
      src: url('../assets/fonts/SourceHanSerifSC-SemiBold.otf');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: "SourceHanSerifSC-Regular";
      src: url('../assets/fonts/SourceHanSerifSC-Regular.otf');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: "SourceHanSerifSC-Medium";
      src: url('../assets/fonts/SourceHanSerifSC-Medium.otf');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: "SourceHanSerifSC-Light";
      src: url('../assets/fonts/SourceHanSerifSC-Light.otf');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: "SourceHanSerifSC-ExtraLight";
      src: url('../assets/fonts/SourceHanSerifSC-ExtraLight.otf');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: "zk-kl";
      src: url('../assets/fonts/zk-kl.ttf');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: "zk-wy";
      src: url('../assets/fonts/zk-wy.ttf');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: "zk-xw";
      src: url('../assets/fonts/zk-xw.otf');
      font-weight: normal;
      font-style: normal;
    }

</style>

<template lang="html">
  <el-container class="main-wrapper" style="height:700px">
    <el-header>
       <div class="navbar">
        <div class="navbar-content">
            <div class="nav-title">抖音小店</div>
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
              width="350"
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
                  <ul style="display:inline-block; padding:0px;">
                    <li class="user-image-item">
                      <el-upload style="vertical-align:top;"
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
                    </li>
                    <li v-for="(image,i) in userWaterMarkImageList" :key="image.url" class="user-image-item"
                      @mouseenter="setMask('mask-'+i,'block')" @mouseleave="setMask('mask-'+i, 'none')">
                        <el-button style="padding:0px;">
                        <el-image style="width: 100px; height: 100px;" :src="image.url" fit="fill" lazy></el-image>
                        <div class="item-mask" :ref="'mask-'+ i">
                        <el-button circle icon="el-icon-plus" size='mini' type="success" style="margin-top:35px"
                          @click="addImageObject(image.url); closePopover('myImagePopover')"></el-button>
                        <el-button circle icon="el-icon-delete" style="margin-top:35px" size="mini" type="danger"
                          @click="deleteUserWaterMarkImage(image.id,i)"></el-button>
                      </div>
                      </el-button>
                    </li>
                  </ul>
                  <br>
                  <div style="text-align: center">
                   <el-pagination
                      @current-change="getUserWaterMarkImageList"
                      :current-page="1"
                      :page-size="8"
                      :total="myImageTotalNum"
                      layout="total, prev, pager, next"
                      >
                    </el-pagination>
                  </div>
                </el-tab-pane>
              </el-tabs>
              <el-button slot="reference" style="margin-top:30px;" type="primary" plain size='medium'>素材</el-button>
            </el-popover>
            <el-button @click="addObject('IText')" style="margin-top:30px;" type="primary" plain size='medium'>文本</el-button>
            <el-tooltip class="item" effect="dark" content="自动替换为每个商品的促销价" placement="top">
              <el-button @click="addObject('PriceText')" style="margin-top:30px; margin-left:0" type="primary" plain size='medium'>价格</el-button>
            </el-tooltip>
            <el-button style="margin-top:30px; margin-left:0" type="primary" plain size='medium' @click="importDialogVisible=true">导入</el-button>
            <el-dialog  :visible.sync="importDialogVisible">
              <div style="text-align: left" slot="title">
                导入SVG文件
              </div>
              <div style="width:80%;margin: auto;margin-top: -25px">
                <div style="text-align: left">
                  * 支持导入自己设计的水印<br>
                  * 暂时只支持导入svg文件内容，svg文件可以直接从PS，AI等设计软件导出<br>
                  * 导入文字格式自动设置为 思源黑体
                </div>
                <br>
                <el-input
                  type="textarea"
                  :rows="10"
                  placeholder="svg文件用文本打开，内容复制到这里"
                  v-model="importStrSvg">
                </el-input>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="importDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="importDialogVisible = false; addObjectsFromSvg(importStrSvg)">确 定</el-button>
              </span>
            </el-dialog>

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
          <div style="margin-top:10px;">
            操作说明:<br>
            右键功能（选中元素）<br>
            1. 删除: 删除选中元素<br>
            <!-- 2. 转换为价格: 将选中文本改为价格<br> -->
          </div>
        </el-aside>
      </el-container>
    </el-main>
    <!-- <el-aside width="200px">Aside</el-aside> -->
    <context-menu id="context-menu" ref="ctxMenu">
      <li @click='deleteObject'>删除</li>
      <!-- <li @click='changeToPrice'>转换为价格</li> -->
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
        // {'label': '思源黑体Heavy', 'value': 'SourceHanSansSC-Heavy'},
        // {'label': '思源黑体Bold', 'value': 'SourceHanSansSC-Bold'},
        // {'label': '思源黑体Medium', 'value': 'SourceHanSansSC-Medium'},
        // {'label': '思源黑体Regular', 'value': 'SourceHanSansSC-Regular'},
        {'label': '思源黑体', 'value': 'SourceHanSansSC-Normal'},
        // {'label': '思源黑体Light', 'value': 'SourceHanSansSC-Light'},
        // {'label': '思源黑体ExtraLight', 'value': 'SourceHanSansSC-ExtraLight'},
        // {'label': '思源宋体Heavy', 'value': 'SourceHanSerifSC-Heavy'},
        // {'label': '思源宋体Bold', 'value': 'SourceHanSerifSC-Bold'},
        // {'label': '思源宋体SemiBold', 'value': 'SourceHanSerifSC-SemiBold'},
        {'label': '思源宋体', 'value': 'SourceHanSerifSC-Medium'},
        // {'label': '思源宋体Regular', 'value': 'SourceHanSerifSC-Regular'},
        // {'label': '思源宋体Light', 'value': 'SourceHanSerifSC-Light'},
        // {'label': '思源宋体ExtraLight', 'value': 'SourceHanSerifSC-ExtraLight'},
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
        'fontFamily': 'SourceHanSansSC-Normal',
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
      importDialogVisible: false,
      importStrSvg: '',
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
        // let objects = self.canvas.getObjects()
        // for(var i=0; i<objects.length; i++) {
        //   let ob = objects[i]
        //   // object 需要设置需要调整的属性，否则后面无法和控件很好的绑定
        //   let defaultStyle = (ob.type === "text" || ob.type === 'i-text') ? self.textDefaultStyle : self.objectDefaultStyle
        //   for(var style in defaultStyle){
        //     if(ob[style] === undefined){
        //       ob[style] = defaultStyle[style]
        //     }
        //   }
        //   // 将text 转为 i-text ， 可缩放
        //   if (ob.type === "text") {
        //       let newEditableText = new fabric.IText(ob.text, ob.toObject());
        //       self.canvas.remove(ob)
        //       self.canvas.add(newEditableText)
        //   }
        // }
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
    addObjectsFromSvg (strSvg) {
      let self = this
      fabric.loadSVGFromString(strSvg, function (importObjects, options) {
        if (importObjects.length > 0) {
          let groupObj = fabric.util.groupSVGElements(importObjects, options)
          groupObj.scaleToHeight(self.canvas.height)
          groupObj.scaleToWidth(self.canvas.width)
          groupObj.set({ left: 0, top: 0 })
          groupObj.setCoords()
          let objects = groupObj.getObjects()
          groupObj.destroy()
          for (let i = 0; i < objects.length; i++) {
            if (self.isTextObject(objects[i])) {
              objects[i].set('fontFamily', 'SourceHanSansSC-Normal')
            }
          }
          self.canvas.add(...objects)
          self.canvas.renderAll.bind(self.canvas)
        }
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
        water_mark_id: (opt === 'new' || this.waterMark.water_mark_type !== 0) ? -1 : this.waterMark.water_mark_id,
        water_mark_type: 0
      }
      this.request('saveWaterMark', params, data => {
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
    getUserWaterMarkImageList (pageIndex) {
      let params = {
        page_index: pageIndex,
        page_size: 8
      }
      this.request('getUserWaterMarkImage', params, data => {
        this.userWaterMarkImageList = data['items']
        this.myImageTotalNum = data['total']
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
    },
    changeToPrice () {
      let obj = new fabric.Text('9.9', this.selectedObj.toObject())
      obj.set('text', '9.9')
      obj.set('isPrice', true)
      this.canvas.remove(this.selectedObj)
      this.canvas.add(obj)
      this.canvas.discardActiveObject().renderAll()
    },
    setMask (ref, value) {
      this.$refs[ref][0].style.display = value
    },
    deleteUserWaterMarkImage (id, index) {
      let params = {
        id: id
      }
      this.request('deleteUserWaterMarkImage', params, data => {
        this.userWaterMarkImageList.splice(index, 1)
      })
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
    .user-image-item{
      display: inline-block;
      float:left;
      margin-left: 10px;
      margin-bottom:10px;
      position: relative;
    }
    .item-mask{
      text-align: center;
      z-index: 2000;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      background-color: rgba(0,0,0,.6);
      display: none
    }
</style>

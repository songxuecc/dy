<template lang="html">
  <div v-loading="loadingCnt" style="margin:auto;margin-top: 20px">
    <el-radio-group v-if="posterType === 'WaterMark'" v-model="type"  size="small" @change="getWaterMarkList(true, true)" class="wm-tp-list">
      <el-radio-button v-for="(type, i) in WaterMarkTypeOptions" :key="i" :label="type.value">{{type.label}}</el-radio-button>
    </el-radio-group>

    <ul style="text-align:left;margin-top: -10px;padding-left: 10px;">
        <li class="wm-item"  v-if="posterType === 'WaterMark' && type==0">
          <el-button class="wm-button" @click="startCreateWaterMark()"  style="vertical-align: middle;">
            <i class="el-icon-plus" style="font-size: 32px;color: #8c939d;">
              <br>
              <span style="font-size: 14px;">(空白模版)</span>
            </i>
          </el-button>
        </li>
        <li class="wm-item" v-if="posterType==='PosterDg'">
          <el-upload
            action="/api/poster/upload"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="handleBeforeUpload"
            :headers="getTokenHeaders"
            :show-file-list="false"
            :data="{'poster_type': 1}"
            >
            <el-button class="wm-button">
                <i class="el-icon-plus" style="font-size: 32px;color: #8c939d;">
              <br>
              <p style="font-size: 14px;">(上传海报)</p>
              <p style="font-size: 14px;">(仅支持jpg/png/jpeg图片格式)</p>
            </i>
            </el-button>
          </el-upload>
        </li>
        <li v-for="(wm,i) in waterMarkList" :key="i" class="wm-item"
          @mouseenter="setMask('mask-'+i,'block')" @mouseleave="setMask('mask-'+i, 'none')"
        >
          <el-button class="wm-button">
                <el-image  :src='wm.image_url' lazy></el-image>
          </el-button>
          <div class="wm-item-mask" :ref="'mask-'+ i">
            <el-button size='small' type="warning" style="margin-top:100px"
            @click="startCreateWaterMarkActivity(wm)">创建活动</el-button>
            <el-button size='small' type="warning" style="margin-top:100px"
              @click="startCreateWaterMark(wm)">设计模版</el-button>
            <br>
            <el-button v-if="wm.water_mark_type==0" circle icon="el-icon-delete" style="margin-top:20px" size="mini"
            @click="deleteWaterMark(wm,i)"></el-button>
          </div>
        </li>

    </ul>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.index"
      :page-size="pagination.size"
      prev-text="上一页"
      next-text="下一页"
      layout="total,prev,pager,next,jumper,slot"
      :total="pagination.total">
      <el-button type="info" @click="handleCurrentChange" class="pagination-btn-ok">确定</el-button>
    </el-pagination>
  </div>
</template>

<script>
import request from '@/mixins/request.js'
import common from '@/common/common.js'
import { mapGetters } from 'vuex'
import { Loading } from 'element-ui'

export default {
  mixins: [request],
  components: {

  },
  created () {
  },
  mounted () {
    if (this.$route.name === 'PosterDgList') {
      this.posterType = 'PosterDg'
    } else {
      this.posterType = 'WaterMark'
      this.type = 1008
    }
    this.getWaterMarkList(true, true)
  },
  activated () {
    if (this.$route.name === 'PosterDgList') {
      this.posterType = 'PosterDg'
    } else {
      this.posterType = 'WaterMark'
      this.type = 1008
    }
  },
  data () {
    return {
      posterType: 'WaterMark',
      type: -1,
      waterMarkList: [],
      WaterMarkTypeOptions: [
        {value: -1, label: '全部'},
        {value: 0, label: '我的'},
        {value: 1015, label: '618'},
        {value: 1016, label: '端午节'},
        {value: 1017, label: '七夕'},
        {value: 1026, label: '男人节'},
        {value: 1019, label: '教师节'},
        {value: 1018, label: '中秋节'},
        {value: 1001, label: '国庆大促'},
        {value: 1020, label: '万圣节'},
        {value: 1021, label: '双11'},
        {value: 1022, label: '感恩节'},
        {value: 1008, label: '双12'},
        {value: 1023, label: '圣诞节'},
        {value: 1030, label: '元旦'},
        {value: 1024, label: '年货节'},
        {value: 1009, label: '春节'},
        {value: 1029, label: '情人节'},
        {value: 1028, label: '开学季'},
        {value: 1011, label: '春夏'},
        {value: 1010, label: '三八节'},
        {value: 1025, label: '愚人节'},
        {value: 1012, label: '五一'},
        {value: 1027, label: '五四节'},
        {value: 1013, label: '母亲节'},
        {value: 1014, label: '520'},
        {value: 1002, label: '9块9特卖'},
        {value: 1003, label: '领券立减'},
        {value: 1004, label: '活动秒杀'},
        {value: 1005, label: '特价商品'},
        {value: 1006, label: '金额满减'},
        {value: 1007, label: '新品上市'}
      ],
      pagination: {
        index: 1,
        total: 0,
        size: undefined
      },
      loadingInstance: undefined
    }
  },
  computed: {
    paginationSize: function () {
      if (this.type === 0 || this.posterType === 'PosterDg') {
        return 15
      } else {
        return 16
      }
    },
    ...mapGetters({
      getTokenHeaders: 'getTokenHeaders'
    })
  },
  methods: {
    setMask (ref, value) {
      this.$refs[ref][0].style.display = value
    },
    getWaterMarkList (isResetIndex = true, isResetSize = true) {
      if (this.pagination.size === undefined || isResetSize) {
        this.pagination.size = this.paginationSize
      }
      if (isResetIndex) {
        this.pagination.index = 1
      }

      let params = {
        type: this.type,
        page_index: this.pagination.index,
        page_size: this.pagination.size,
        poster_type: common.PosterType[this.posterType]
      }
      this.request('getWaterMarkList', params, data => {
        this.waterMarkList = data.items
        this.pagination.total = data.total
      })
    },
    // to do  json --> (type + id)
    startCreateWaterMark (wm = undefined) {
      // if (window._hmt) {
      //   if (wm) {
      //     window._hmt.push(['_trackEvent', '水印', '点击', '开始制作水印'])
      //   } else {
      //     window._hmt.push(['_trackEvent', '水印', '点击', '空白模版'])
      //   }
      // }
      if (wm) {
        this.$router.push({ name: 'WaterMaskCreate',
          params: {
            'water_mark_type': wm.water_mark_type,
            'water_mark_id': wm.water_mark_id
          } })
      } else {
        this.$router.push({ name: 'WaterMaskCreate',
          params: {
            'water_mark_type': 0,
            'water_mark_id': 0
          } })
      }
    },
    startCreateWaterMarkActivity (wm) {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '水印', '点击', '直接使用水印'])
      }
      this.$router.push({
        name: this.posterType + 'ActivityCreate',
        params: {
          'waterMark': wm
        }
      })
    },
    handleSizeChange (val) {
      this.pagination.size = val
      this.pagination.index = 1
      this.getWaterMarkList(true, false)
    },
    handleCurrentChange (val) {
      this.pagination.index = val
      this.getWaterMarkList(false, false)
    },
    deleteWaterMark (wm, index) {
      let params = {
        water_mark_id: wm.water_mark_id,
        water_mark_type: wm.water_mark_type
      }
      this.request('deleteWaterMark', params, data => {
        this.waterMarkList.splice(index, 1)
      })
    },
    handleBeforeUpload (file) {
      let self = this
      let type = file.type
      let size = file.size / 1024 / 1024
      if (type !== 'image/jpeg' && type !== 'image/png') {
        this.$message.error('只能上传jpg/jpeg/png文件')
        return false
      }
      if (size > 1) {
        this.$message.error('上传文件超过1M')
        return false
      }
      return new Promise(function (resolve, reject) {
        let _URL = window.URL || window.webkitURL
        let img = new Image()
        img.onload = function () {
          if (img.width < 480 || img.width > 1200) {
            reject(new Error('widthError'))
          } else if (img.height > 1500) {
            reject(new Error('heightError'))
          } else {
            resolve(file)
          }
        }
        img.onerror = function () {
          reject(new Error('loadError'))
        }
        img.src = _URL.createObjectURL(file)
      }).then(file => {
        self.loadingInstance = Loading.service({
          lock: true,
          text: '正在上传图片,可能耗时比较久, 请稍等',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        return file
      }, err => {
        if (err.message === 'widthError') {
          this.$message.error('图片宽度需要在480~1200px之间')
        } else if (err.message === 'heightError') {
          this.$message.error('图片高度不能超过1500px')
        } else {
          this.$message.error('加载图片失败，请重试')
        }
        return Promise.reject(new Error('sizeError'))
      })
    },
    handleUploadSuccess (response, file) {
      this.loadingInstance.close()
      if (parseInt(response.code) !== 0) {
        if (response.msg) {
          this.$message.error(response.msg)
        }
        return
      }
      this.$message({
        message: '上传成功',
        type: 'success'
      })
      this.getWaterMarkList()
    },
    handleUploadError (err, file) {
      this.$message.error(err.message)
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/var.less';
    .wm-item{
      display:inline-block;
      position:relative;
      margin-right: 15px;
      margin-top:30px;
      overflow: hidden;
      width:220px;
      height:220px
    }
    .wm-button{
      padding:0;
      width:220px;
      height:220px
    }
    .wm-item-mask{
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
    /deep/ .wm-tp-list {
      text-align:left;

      .el-radio-button__orig-radio:checked+.el-radio-button__inner{
        border-color: #409EFF
      }
      .el-radio-button__inner {
        border-left: 1px solid #DCDFE6;
        border-radius: 10px;
      }
      .el-radio-button {
        margin-left: 10px;
        margin-bottom: 10px;
      }
      .el-radio-button:first-child .el-radio-button__inner{
        border-radius: 10px;
      }
      .el-radio-button:last-child .el-radio-button__inner{
        border-radius: 10px;
      }
   }

</style>

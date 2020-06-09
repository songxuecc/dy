<template lang="html">
  <div style="width:900px; margin:auto; ">
    <el-radio-group v-model="type"  size="mini" @change="getWaterMarkList(true, true)">
      <el-radio-button v-for="(type, i) in WaterMarkTypeOptions" :key="i" :label="type.value">{{type.label}}</el-radio-button>
    </el-radio-group>

    <ul style="text-align:left;margin-top: 48px;">
        <li class="wm-item" v-show="type==0">
          <el-button class="wm-button" style="vertical-align: middle; width: 250px; height: 250px;" @click="startCreateWaterMark()">
            <i class="el-icon-plus" style="font-size: 32px;color: #8c939d;">
              <br>
              <span style="font-size: 14px;">(空白模版)</span>
            </i>
          </el-button>
        </li>
        <li v-for="(wm,i) in waterMarkList" :key="i" class="wm-item"
          @mouseenter="setMask('mask-'+i,'block')" @mouseleave="setMask('mask-'+i, 'none')"
        >
          <el-button class="wm-button">
              <div >
                <img style="width:250px;height:250px" :src='wm.image_url' />
              </div>
          </el-button>
          <div class="wm-item-mask" :ref="'mask-'+ i">
            <el-button size='small' type="warning" style="margin-top:100px"
              @click="startCreateWaterMark(wm)">开始制作</el-button>
            <el-button size='small' type="warning" style="margin-top:100px"
            @click="startCreateWaterMarkActivity(wm)">直接使用</el-button>
            <br>
            <el-button v-if="wm.water_mark_type==0" circle icon="el-icon-delete" style="margin-top:20px" size="mini"
            @click="deleteWaterMark(wm,i)"></el-button>
          </div>
        </li>

    </ul>
    <br>
     <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagination.index"
                :page-size=paginationSize
                layout="total, prev, pager, next, jumper"
                :total="pagination.total">
        </el-pagination>
  </div>
</template>
<script>

import request from '@/mixins/request.js'

export default {
  mixins: [request],
  components: {

  },
  created () {
  },
  mounted () {
    this.getWaterMarkList(true, true)
  },
  data () {
    return {
      type: -1,
      waterMarkList: [],
      WaterMarkTypeOptions: [
        {value: -1, label: '全部'},
        {value: 0, label: '我的'},
        // {value: 1001, label: '国庆大促'},
        // {value: 1008, label: '双12'},
        {value: 1009, label: '春节'},
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
      }
      // paginationDefaultSizes = [9, 15, 30],
      // paginationMySizes = [8, 14, 29]
    }
  },
  computed: {
    paginationSize: function () {
      if (this.type === 0) {
        return 8
      } else {
        return 9
      }
    }
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
        page_size: this.pagination.size
      }
      this.request('getWaterMarkList', params, data => {
        this.waterMarkList = data.items
        this.pagination.total = data.total
      })
    },
    // to do  json --> (type + id)
    startCreateWaterMark (wm = undefined) {
      this.$router.push({ name: 'WaterMaskCreate', params: {'waterMark': wm} })
    },
    startCreateWaterMarkActivity (wm) {
      this.$router.push({
        name: 'WaterMarkActivityCreate',
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
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/base.less';
    /deep/ svg {
      width:250px;
      height:250px;
    }
    .wm-item{
      display:inline-block;
      position:relative;
      margin-right: 20px;
      margin-top:30px;
    }
    .wm-button{
      padding:0;
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
</style>

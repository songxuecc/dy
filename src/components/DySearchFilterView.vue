<template lang="html">
    <div class="DySearchFilterView">
        <el-form ref="form" :model="search" :inline="true" class="flex wrap align-c" >
           <el-form-item class="mb-5 " style="margin-right:20px"  >
              <el-select v-model="search.status" placeholder="请选择" size="small" @change="handleFilterChange" popper-class="select-long" style="width: 200px">
                  <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
          </el-form-item>

          <el-form-item class="mb-5 " style="margin-right:20px"  >
              <el-select v-model="search.presell_type" placeholder="请选择发货模式" size="small" @change="handleFilterChange" popper-class="select-long" style="width: 200px" >
                  <el-option v-for="item in presellTypeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
          </el-form-item>

          <el-form-item class="mb-5 " style="margin-right:20px"  >
              <el-select v-model="search.captureStatus" placeholder="请选择" size="small" @change="handleFilterChange" popper-class="select-long" style="width: 200px" >
                  <el-option v-for="item in captureStatusOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
          </el-form-item>

          <el-form-item class="form-textarea" style="margin-right:20px">
              <el-input
                :value="search.goods_ids"
                @input="formatGoods_ids($event)"
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 2 }"
                resize="none"
                size="small"
                placeholder="商品ID查询"
                style="width: 257px;" />
                <span style="position:absolute;left:0;bottom:-32px" class="info">多个查询请换行或空格依次输入</span>
          </el-form-item>

          <el-form-item class="mb-5" style="margin-right:10px" >
              <el-input v-model="search.keyword" size="small"  placeholder="商品名称"   style="width: 300px"></el-input>
          </el-form-item>

<!--            <el-form-item>-->
<!--                <el-input v-model="search.minMultiPrice" size="small" placeholder="团购最低价"-->
<!--                          @keyup.enter.native="handleFilterChange" style="width: 80px" class="input-text-mini">-->
<!--                </el-input>-->
<!--                至-->
<!--                <el-input v-model="search.maxMultiPrice" size="small" placeholder="团购最高价"-->
<!--                          @keyup.enter.native="handleFilterChange" style="width: 80px" class="input-text-mini">-->
<!--                </el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item>-->
<!--                <el-input v-model="search.minScore" size="small" placeholder="最低分"-->
<!--                          @keyup.enter.native="handleFilterChange" style="width: 50px" class="input-text-mini">-->
<!--                </el-input>-->
<!--                至-->
<!--                <el-input v-model="search.maxScore" size="small" placeholder="最高分"-->
<!--                          @keyup.enter.native="handleFilterChange" style="width: 50px" class="input-text-mini">-->
<!--                </el-input>-->
<!--            </el-form-item>-->
            <!-- <el-form-item>
              <el-checkbox v-model="search.ignoreHasWaterMark" @change="handleFilterChange" v-if="$route.name=='WaterMarkActivityCreate'"
              border size="small">忽略已有水印</el-checkbox>
            </el-form-item> -->
            <!-- <el-form-item class="mb-5"  style="margin-right:0">
                <el-button type="primary" size="medium" @click="handleFilterChange">搜索</el-button>
            </el-form-item> -->

            <el-form-item style="margin-right:0;" class="mb-5">
              <el-button type="primary" size="medium" @click="handleFilterChange">
                <hh-icon type="iconsousuo1" style="font-size:16px"></hh-icon>
              </el-button>
            </el-form-item>

        </el-form>
    </div>
</template>
<script>
import utils from '@/common/utils.js'
import common from '@/common/common.js'

export default {
  components: {},
  props: {
    onlyEditable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      search: {
        // key: '',
        status: '0-3',
        captureStatus: -1,
        presell_type: -1,
        minMultiPrice: '',
        maxMultiPrice: '',
        minScore: '',
        maxScore: '',
        keyword: '',
        goods_ids: ''
        // ignoreHasWaterMark: false
      },
      captureStatusOptions: [
        {value: -1, label: '是否抓取'},
        {value: 0, label: '非抓取'},
        {value: 1, label: '抓取'}
      ],
      presellTypeOptions: [
        {value: -1, label: '全部发货模式'},
        {value: 0, label: '现货发货'},
        {value: 1, label: '预售发货'},
        {value: 2, label: '阶梯发货'}
      ]

    }
  },
  computed: {
    statusOptions () {
      let options = []
      for (let key in common.dyProductStatusMap) {
        let label = common.dyProductStatusMap[key] === '全部' ? '商品状态' : common.dyProductStatusMap[key]
        if (this.onlyEditable && ['草稿箱', '封禁中'].includes(label)) {
          continue
        }
        options.push({ value: key, label: label })
      }
      // return options.sort((a, b) => a.value - b.value)
      return options
    }
  },
  mounted () {
  },
  methods: {
    handleFilterChange () {
      this.$emit('filterChange')
    },
    formatGoods_ids: function (target) {
      const reg = /[^\d\n\s]/g
      const value = target.replace(reg, '')
      this.search.goods_ids = value
    },
    getParams () {
      let arrStatus = this.search.status.split('-')
      let status = -1
      let checkStatus = -1
      if (arrStatus.length > 1 && arrStatus[0]) {
        status = parseInt(arrStatus[0])
      }
      if (arrStatus.length > 1 && arrStatus[1]) {
        checkStatus = parseInt(arrStatus[1])
      }
      const goodsIds = this.search.goods_ids.split(/[\s\n]/).filter(item => item).map(item => item.trim())
      const setGoodsIds = [...new Set(goodsIds)]
      const limit = 100
      if (setGoodsIds.length > limit) {
        this.$message.error(`搜索id不可以超过${limit}条！`)
      }
      let params = {
        goods_ids: setGoodsIds.length ? setGoodsIds : '',
        keyword: this.search.keyword,
        status: status,
        check_status: checkStatus,
        capture_status: this.search.captureStatus,
        presell_type: this.search.presell_type
        // ignore_has_watermark: this.search.ignoreHasWaterMark
      }
      if (this.search.minMultiPrice && !isNaN(this.search.minMultiPrice)) {
        params['min_multi_price'] = utils.yuanToFen(this.search.minMultiPrice)
      }
      if (this.search.maxMultiPrice && !isNaN(this.search.maxMultiPrice)) {
        params['max_multi_price'] = utils.yuanToFen(this.search.maxMultiPrice)
      }
      if (this.search.minScore && !isNaN(this.search.minScore)) {
        params['min_score'] = this.search.minScore
      }
      if (this.search.maxScore && !isNaN(this.search.maxScore)) {
        params['max_score'] = this.search.maxScore
      }
      return params
    }
  }
}
</script>
<style lang="less" scoped>
  .DySearchFilterView{
    width: calc(100% - 20px);
    /deep/ .form-textarea {
      margin-bottom: 5px ;
      height: 41px;
      .el-form-item__content {
        height: 41px;
        .el-textarea {
          height: 41px;
          line-height: 41px;
          display: flex;
          align-items: center;
        }
        .el-textarea__inner {
          min-height: 32px  !important;
        }
      }
    }
    /deep/ .el-button--medium {
      padding: 7px 7px;
    }
  }
</style>

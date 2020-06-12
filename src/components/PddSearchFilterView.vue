<template lang="html">
    <div>
        <el-form ref="form" :model="search" :inline="true" style="text-align: left">
            <el-form-item>
                <el-input v-model="search.key" size="small" placeholder="商品名称、ID" @keyup.enter.native="handleFilterChange" style="width: 160px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-select v-model="search.status" placeholder="请选择" size="small" @change="handleFilterChange"
                           popper-class="select-long" style="width: 100px"
                >
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="search.captureStatus" placeholder="请选择" size="small" @change="handleFilterChange"
                           popper-class="select-long" style="width: 100px"
                >
                    <el-option v-for="item in captureStatusOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
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
            <el-form-item>
                <el-button type="primary" size="small" @click="handleFilterChange">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import utils from '@/common/utils.js'
import common from '@/common/common.js'

export default {
  components: {},
  data () {
    return {
      search: {
        key: '',
        status: '1',
        captureStatus: -1,
        minMultiPrice: '',
        maxMultiPrice: '',
        minScore: '',
        maxScore: ''
        // ignoreHasWaterMark: false
      },
      captureStatusOptions: [
        {value: -1, label: '是否抓取'},
        {value: 0, label: '非抓取'},
        {value: 1, label: '抓取'}
      ]
    }
  },
  computed: {
    statusOptions () {
      let options = []
      for (let key in common.pddProductStatusMap) {
        let label = common.pddProductStatusMap[key] === '全部' ? '商品状态' : common.pddProductStatusMap[key]
        options.push({ value: key, label: label })
      }
      return options.sort((a, b) => a.value - b.value)
    }
  },
  mounted () {
  },
  methods: {
    handleFilterChange () {
      this.$emit('filterChange')
    },
    getParams () {
      let params = {
        keyword: this.search.key,
        status: this.search.status,
        capture_status: this.search.captureStatus
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

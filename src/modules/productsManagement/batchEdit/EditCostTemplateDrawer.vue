<template>
  <div class="drawer-container">
    <el-row class="drawer-title pt-10">
      <el-col :span="8">
        <span>批量设置</span>
      </el-col>
      <el-col :span="16" style="text-align: right">
        <span style="font-size: 14px; line-height:32px;">下架商品修改后：</span>
        <el-radio-group v-model="commitType">
          <el-radio :label="1">直接上架</el-radio>
          <el-radio :label="2">保存到草稿箱</el-radio>
        </el-radio-group>
        <el-button type="info" size="small" @click="rollbackChange" class="ml-5">全部重置</el-button>
        <div v-if="Object.keys(selectProductDict).length === 0" style="display: inline-block; margin-left: 10px;">
          <el-tooltip class="item" effect="dark" placement="top" content="请选择需要修改的商品">
            <span class="button-wrapper">
              <el-button type="primary" size="small" disabled>全部保存</el-button>
            </span>
          </el-tooltip>
        </div>
        <el-button v-else type="primary" size="small" @click="confirmChange">全部保存</el-button>
      </el-col>
    </el-row>
    <div class="drawer-content">
      <span class="drawer-immediate">运费模板：</span>
      <el-select v-model="costTemplateId" placeholder="请选择" @change="applyChange">
        <el-option
          v-for="item in costTemplateList"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="text" @click="getCostTemplateList"><hh-icon type="iconjiazai" style="font-size:12px;"/>刷新</el-button>
      <el-button type="text" @click="open()">添加运费模版</el-button>
    </div>
  </div>
</template>

<script>
import request from '@/mixins/request.js'
export default {
  mixins: [request],
  components: {},
  props: {
    dyProductModelList: Array,
    selectProductDict: Object
  },
  data () {
    return {
      costTemplateList: [],
      costTemplateId: 0,
      commitType: 1
    }
  },
  computed: {
  },
  mounted () {
    this.getCostTemplateList()
  },
  methods: {
    open () {
      window.open('https://fxg.jinritemai.com/index.html#/ffa/morder/logistics/freight-list')
    },
    getCostTemplateList () {
      this.request('getCostTemplateList', {}, data => {
        this.costTemplateList = []
        data.List.forEach(item => {
          this.costTemplateList.push({
            value: item.template.id,
            name: item.template.template_name
          })
        })
      })
    },
    rollbackChange () {
      this.$emit('rollback')
    },
    applyChange () {
      for (let key in this.selectProductDict) {
        let product = this.selectProductDict[key]
        product.model.cost_template_id = this.costTemplateId
      }
    },
    confirmChange () {
      for (let key in this.selectProductDict) {
        let product = this.selectProductDict[key]
        // 下架商品
        if (product.model.status === 1 && product.model.check_status === 1) {
          // 下架商品
          product.model.commit = this.commitType
        }
      }
      this.applyChange()
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="less" scoped>
</style>

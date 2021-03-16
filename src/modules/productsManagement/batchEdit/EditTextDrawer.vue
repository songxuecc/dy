<template>
  <div class="drawer-container">
    <el-row class="drawer-title">
      <el-col :span="8">
        <span>批量设置</span>
      </el-col>
      <el-col :span="16" style="text-align: right">
        <span style="font-size: 14px; line-height:32px;">下架商品修改后：</span>
        <el-radio-group v-model="commitType">
          <el-radio :label="1">直接上架</el-radio>
          <el-radio :label="2">保存到草稿箱</el-radio>
        </el-radio-group>
        <el-button type="info" size="small" @click="rollbackChange">全部重置</el-button>
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
      <el-popover placement="top">
        <div style="width: 435px;">
          <el-input v-model="textHandler.textPrefix" size="small" placeholder="前缀" style="width: 160px;"></el-input>
          <span>{{ field == 'goods_name' ? '原标题' : '原描述' }}</span>
          <el-input v-model="textHandler.textSuffix" size="small" placeholder="后缀" style="width: 160px;"></el-input>
          <el-button type="primary" size="small" @click="applyChange">应用</el-button>
        </div>
        <el-button slot="reference" type="primary">添加关键字</el-button>
      </el-popover>
      <el-popover placement="top">
        <div style="width: 435px;">
          <el-input v-model="textHandler.textReplace1" size="small" style="width: 160px;"></el-input>
          <span>替换为</span>
          <el-input v-model="textHandler.textReplace2" size="small" style="width: 160px;"></el-input>
          <el-button type="primary" size="small" @click="applyChange">应用</el-button>
        </div>
        <el-button slot="reference" type="primary">替换关键字</el-button>
      </el-popover>
      <el-popover placement="top">
        <div>
          <el-input v-model="textHandler.textDelete" size="small" style="width: 160px;" placeholder="输入删除关键字"></el-input>
          <el-button type="primary" size="small" @click="applyChange">应用</el-button>
        </div>
        <el-button slot="reference" type="primary">删除关键字</el-button>
      </el-popover>&nbsp;&nbsp;&nbsp;&nbsp;
      <div v-if="field==='goods_name'" style="display: inline-block; margin: 0 10px;">
        <span style="font-size: 14px; line-height:32px;">超过{{ PRODUCT_TITLE_LIMIT }}个字:</span>
        <el-radio-group v-model="beyondWordsOptType" @change="handleBeyondTypeChange">
          <el-radio :label="1">自动去开头</el-radio>
          <el-radio :label="2">自动去末尾</el-radio>
          <el-radio :label="0">手动处理</el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
import common from '@/common/common.js'
import { TextHandler } from '@/common/batchEditHandler'
export default {
  components: {},
  props: {
    field: String,
    dyProductModelList: Array,
    selectProductDict: Object
  },
  data () {
    return {
      commitType: 1,
      beyondWordsOptType: 0,
      textHandler: new TextHandler()
    }
  },
  computed: {
    PRODUCT_TITLE_LIMIT () {
      return common.PRODUCT_TITLE_LIMIT
    }
  },
  mounted () {
  },
  methods: {
    handleBeyondTypeChange (value) {
      if (this.beyondWordsOptType === 1) {
        this.cutOffCnText(false, 30)
      } else if (this.beyondWordsOptType === 2) {
        this.cutOffCnText(true, 30)
      }
    },
    cutOffCnText (isUsePrefix, limit) {
      for (let key in this.selectProductDict) {
        let product = this.selectProductDict[key]
        product.model[this.field] = this.textHandler.cutOffCnText(product.model[this.field], isUsePrefix, limit)
      }
    },
    cutOffText (isUsePrefix, limit) {
      for (let key in this.selectProductDict) {
        let product = this.selectProductDict[key]
        product.model[this.field] = this.textHandler.cutOffText(product.model[this.field], isUsePrefix, limit)
      }
    },
    rollbackChange () {
      this.$emit('rollback')
      this.textHandler.reset()
    },
    applyChange () {
      for (let key in this.selectProductDict) {
        let product = this.selectProductDict[key]
        product.model[this.field] = this.textHandler.handle(product.model[this.field])
      }
      this.textHandler.reset()
      if (this.field === 'goods_name') {
        this.handleBeyondTypeChange()
      } else if (this.field === 'goods_desc') {
        this.cutOffText(true, 500)
      }
    },
    confirmChange () {
      // if (window._hmt) {
      //   let label = '全部保存 ' + this.field
      //   window._hmt.push(['_trackEvent', '批量修改', '修改', label])
      // }
      for (let key in this.selectProductDict) {
        let product = this.selectProductDict[key]
        if (product.model.status === 1 && product.model.check_status === 1) {
          // 下架商品
          product.model.commit = this.commitType
        }
      }
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="less" scoped>
</style>

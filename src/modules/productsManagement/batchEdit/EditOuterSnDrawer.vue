<template>
  <div class="drawer-container">
    <el-row class="drawer-title">
      <el-col :span="16">
        <span>批量设置</span>
      <!-- </el-col>
      <el-col :span="8"> -->
        <el-checkbox-group v-model="batchRange" style="display:inline-block;margin-left:10px">
          <el-checkbox label="outer_goods_id">修改商品编码</el-checkbox>
          <el-checkbox label="out_sku_sn">修改SKU编码</el-checkbox>
        </el-checkbox-group>
      </el-col>
      <el-col :span="8" style="text-align: right">
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
          <span>原编码</span>
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
      </el-popover>
    </div>
  </div>
</template>

<script>
import { TextHandler } from '@/common/batchEditHandler'
export default {
  components: {},
  props: {
    dyProductModelList: Array,
    selectProductDict: Object
  },
  data () {
    return {
      batchRange: ['outer_goods_id'],
      textHandler: new TextHandler()
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    rollbackChange () {
      this.$emit('rollback')
      this.textHandler.reset()
    },
    applyChange () {
      if (this.batchRange.indexOf('outer_goods_id') !== -1) {
        for (let key in this.selectProductDict) {
          let product = this.selectProductDict[key]
          product.model['outer_goods_id'] = this.textHandler.handle(product.model['outer_goods_id'])
        }
      }
      if (this.batchRange.indexOf('out_sku_sn') !== -1) {
        let self = this
        for (let key in this.selectProductDict) {
          let product = this.selectProductDict[key]
          product.model.sku_list.forEach((sku) => {
            sku['out_sku_sn'] = self.textHandler.handle(sku['out_sku_sn'])
          })
        }
      }

      this.textHandler.reset()
    },
    confirmChange () {
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="less" scoped>
</style>

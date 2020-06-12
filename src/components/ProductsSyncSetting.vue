<template lang="html">
    <div v-loading="loadingCnt" class="setting-content" style="width:650px; margin:auto">
        <!--<el-row>-->
            <!--<el-col :span="4">-->
                <!--<el-checkbox v-model="checkedSale">同步商品上下架</el-checkbox>-->
            <!--</el-col>-->
        <!--</el-row>-->
        <el-row class="setting-line">
            <el-col :span="5">
                <el-checkbox v-model="checkedTitle">同步商品标题</el-checkbox>
            </el-col>
            <el-col :span="4">
                <el-radio v-model="radioTitle" label="1">原始标题</el-radio>
            </el-col>
            <el-col :span="4">
                <el-radio v-model="radioTitle" label="0">处理标题 (超出字数自动截断)</el-radio>
            </el-col>
        </el-row>
        <el-row>
            <el-col :offset="9" :span="15">
                <el-input v-model="titleHandle.prefix" size="mini" placeholder="前缀" style="width:80px"></el-input>
                <span style="display:inline-block; width:70px; text-align:center"> + 标题 + </span>
                <el-input v-model="titleHandle.suffix" size="mini" placeholder="后缀" style="width:80px"></el-input>
            </el-col>
            <el-col :offset="9" :span="15" style="padding-top: 5px">
                <el-input v-model="titleHandle.keyword" size="mini" placeholder="标题关键字" style="width:80px"></el-input>
                <span style="display:inline-block; width:70px; text-align:center"> 替换为 </span>
                <el-input v-model="titleHandle.replace" size="mini" placeholder="替换内容" style="width:80px"></el-input>
            </el-col>
        </el-row>
        <el-row class="setting-line">
            <el-col :span="5">
                <el-checkbox v-model="checkedDesc">同步商品描述</el-checkbox>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="5">
                <el-checkbox v-model="checkedPrice">同步商品价格</el-checkbox>
            </el-col>
            <el-col :span="15">
                <div style="padding-bottom: 5px">
                    <span style="display:inline-block; width:210px; text-align:center"> 团购价设置: 其他平台SKU价格 X </span>
                    <el-input v-model="template.model.group_price_rate" size="mini" placeholder="" style="width:50px"></el-input>
                    <span style="display:inline-block; width:30px; text-align:center"> %  - </span>
                    <el-input v-model="template.model.group_price_diff" size="mini" placeholder="" style="width:50px"></el-input>
                    <span style="display:inline-block; width:30px; text-align:center"> 元 </span>
                </div>
                <div style="padding-bottom: 5px">
                    <span style="display:inline-block; width:210px; text-align:center"> 单买价设置: 其他平台SKU价格 X </span>
                    <el-input v-model="template.model.single_price_rate" size="mini" placeholder="" style="width:50px"></el-input>
                    <span style="display:inline-block; width:30px; text-align:center"> %  - </span>
                    <el-input v-model="template.model.single_price_diff" size="mini" placeholder="" style="width:50px"></el-input>
                    <span style="display:inline-block; width:30px; text-align:center"> 元 </span>
                </div>
                <div style="padding-bottom: 5px">
                    <span style="display:inline-block; width:210px; text-align:center"> 市场价设置: 其他平台市场价格 X </span>
                    <el-input v-model="template.model.price_rate" size="mini" placeholder="" style="width:50px"></el-input>
                    <span style="display:inline-block; width:30px; text-align:center"> %  - </span>
                    <el-input v-model="template.model.price_diff" size="mini" placeholder="" style="width:50px"></el-input>
                    <span style="display:inline-block; width:30px; text-align:center"> 元 </span>
                </div>
            </el-col>
        </el-row>
        <el-row class="setting-line">
            <el-col :span="5">
                <el-checkbox v-model="checkedStock">同步商品库存</el-checkbox>
            </el-col>
            <el-col :span="3" style="height: 24px;">
                <span> 库存为0时 </span>
            </el-col>
            <el-col :span="4">
                <el-radio v-model="radioStock" label="1">保持旧值</el-radio>
            </el-col>
            <el-col :span="4">
                <el-radio v-model="radioStock" label="2">零库存</el-radio>
            </el-col>
            <el-col :span="5">
                <el-radio v-model="radioStock" label="3">
                    统一设置为
                    <el-input v-model="stock" size="mini" placeholder="" style="width:50px"></el-input>
                </el-radio>
            </el-col>
        </el-row>
        <br>
        <div>
            <span style="color: red">注意：设置了源同步的商品会在每天凌晨从来源更新</span>
        </div>
        <div  class="common-bottom">
            <el-row>
                <el-col :offset="4" :span="6" style="display:flex; align-items:center; height:40px">
                    <el-checkbox v-model="checkedToSync">设置后立即同步</el-checkbox>
                </el-col>
                <el-col :span="8">
                    <el-button type="primary" @click="onSave" :disabled="saveBtnDisabled"> 设置 </el-button>
                    <el-button @click="onCancel"> 取消同步 </el-button>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import request from '@/mixins/request.js'
import FormModel from '@/common/formModel'

export default {
  mixins: [request],
  components: {},
  props: {
    selectTpProductList: Array
  },
  data () {
    return {
      checkedSale: false,
      checkedTitle: false,
      checkedDesc: false,
      checkedPrice: false,
      checkedStock: false,
      checkedToSync: false,
      radioTitle: '1',
      radioStock: '1',
      titleHandle: {
        prefix: '',
        suffix: '',
        keyword: '',
        replace: ''
      },
      template: new FormModel(),
      stock: ''
    }
  },
  computed: {
    saveBtnDisabled () {
      return !this.checkedSale &&
        !this.checkedTitle &&
        !this.checkedDesc &&
        !this.checkedPrice &&
        !this.checkedStock
    }
  },
  mounted () {
  },
  methods: {
    initByTPProduct () {
      if (this.selectTpProductList.length === 0) {
        return false
      }
      let tpProduct = this.selectTpProductList[0]
      if (!tpProduct.sync_setting) {
        return false
      }
      if (tpProduct.sync_setting.onsale) {
        this.checkedSale = !!tpProduct.sync_setting.onsale.is_sync
      }
      if (tpProduct.sync_setting.title) {
        if (tpProduct.sync_setting.title.is_sync) {
          this.checkedTitle = true
          if (tpProduct.sync_setting.title.is_original) {
            this.radioTitle = '1'
          } else {
            this.radioTitle = '0'
            this.titleHandle.prefix = tpProduct.sync_setting.title.prefix
            this.titleHandle.suffix = tpProduct.sync_setting.title.suffix
            this.titleHandle.keyword = tpProduct.sync_setting.title.keyword
            this.titleHandle.replace = tpProduct.sync_setting.title.replace
          }
        }
      }
      if (tpProduct.sync_setting.desc) {
        this.checkedDesc = !!tpProduct.sync_setting.desc.is_sync
      }
      if (tpProduct.sync_setting.stock) {
        if (tpProduct.sync_setting.stock.is_sync) {
          this.checkedStock = true
          this.radioStock = tpProduct.sync_setting.stock.zero_handle_type.toString()
          if (this.radioStock === '3') {
            this.stock = tpProduct.sync_setting.stock.handle_value
          }
        }
      }
      if (tpProduct.sync_setting.price) {
        if (tpProduct.sync_setting.price.is_sync) {
          this.checkedPrice = true
          this.template.assign({
            group_price_rate: tpProduct.sync_setting.price.group_price_rate / 100,
            group_price_diff: tpProduct.sync_setting.price.group_price_diff / 100,
            single_price_rate: tpProduct.sync_setting.price.single_price_rate / 100,
            single_price_diff: tpProduct.sync_setting.price.single_price_diff / 100,
            price_rate: tpProduct.sync_setting.price.price_rate / 100,
            price_diff: tpProduct.sync_setting.price.price_diff / 100
          })
        } else {
          return false
        }
      }
      return true
    },
    init () {
      this.checkedSale = false
      this.checkedTitle = false
      this.checkedDesc = false
      this.checkedPrice = false
      this.checkedStock = false
      this.checkedToSync = false
      this.radioTitle = '1'
      this.radioStock = '1'
      this.titleHandle.prefix = ''
      this.titleHandle.suffix = ''
      this.titleHandle.keyword = ''
      this.titleHandle.replace = ''
      this.template = new FormModel()
      this.stock = ''
      if (!this.initByTPProduct()) {
        this.request('getTemplate', {}, data => {
          this.template.assign(data)
        })
      }
    },
    onSave () {
      let syncSetting = {
        onsale: { is_sync: this.checkedSale ? 1 : 0 },
        title: {
          is_sync: this.checkedTitle ? 1 : 0,
          is_original: parseInt(this.radioTitle),
          ...this.titleHandle
        },
        desc: { is_sync: this.checkedDesc ? 1 : 0 },
        price: {
          is_sync: this.checkedPrice ? 1 : 0,
          group_price_rate: parseInt(this.template.model.group_price_rate * 100),
          group_price_diff: parseInt(this.template.model.group_price_diff * 100),
          single_price_rate: parseInt(this.template.model.single_price_rate * 100),
          single_price_diff: parseInt(this.template.model.single_price_diff * 100),
          price_rate: parseInt(this.template.model.price_rate * 100),
          price_diff: parseInt(this.template.model.price_diff * 100)
        },
        stock: {
          is_sync: this.checkedStock ? 1 : 0,
          zero_handle_type: parseInt(this.radioStock),
          handle_value: this.stock
        }
      }
      let items = []
      for (let i in this.selectTpProductList) {
        let tpProduct = this.selectTpProductList[i]
        items.push({
          goods_id: tpProduct.goods_id,
          sync_setting: syncSetting
        })
      }
      let params = {
        is_sync_now: this.checkedToSync ? 1 : 0,
        json: JSON.stringify(items)
      }
      this.request('setSourceSync', params, data => {
        this.$message('设置成功')
        for (let i in this.selectTpProductList) {
          let tpProduct = this.selectTpProductList[i]
          tpProduct.sync_setting = syncSetting
        }
        this.$emit('updateStatus')
      })
    },
    onCancel () {
      let goodsIds = []
      for (let i in this.selectTpProductList) {
        let tpProduct = this.selectTpProductList[i]
        goodsIds.push(tpProduct.goods_id)
      }
      this.request('cancelSourceSync', {goods_ids: goodsIds}, data => {
        this.$message('取消成功')
        this.$emit('updateStatus')
      })
    }
  }
}
</script>

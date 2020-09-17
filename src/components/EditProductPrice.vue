<template>
    <div>
      <el-row v-if="specList.length" style="margin-top:10px">
            <el-col :span=18>
              <div v-for="(spec,i) in specList" :key="spec.id" style="display:inline-block;">
                 <el-select v-model="specSelectId[i]" :placeholder="spec.name" size="mini"
                            :style="{ display:'inline-block', width:getSpecWidth(i, product.model.sku_list, product.model.goods_id) }"
                  class="multiple-text"
                  @change="changeSpec"
                  :clearable="true"
                  v-if="specList.length>1 && spec.values.length > 1 ">
                  <el-option
                    v-for="spec_value in spec.values"
                    :key="spec_value.id"
                    :label="spec_value.name"
                    :value="spec_value.id">
                  </el-option>
                </el-select>
                <div v-else :style="{ display:'inline-block', width:getSpecWidth(i, product.model.sku_list, product.model.goods_id) }"
                >{{spec.name}}</div>
                <el-divider direction="vertical" v-if="i+1<specList.length"></el-divider>
              </div>
            </el-col>
            <el-col :span=6 v-if="product.model.sku_list.length>1" style="text-align: right">
              <el-input v-model="batch_price" size="mini"
                  class="multiple-text" style="width:80px; display:inline-block"
                  placeholder="统一修改"
                >
                </el-input>
                <el-button type="primary" size="mini" style="padding: 6px 4px" @click="batchUpdatePrice()">确定</el-button>
            </el-col>
          </el-row>
          <el-divider style="margin:5px 0;" v-if="specList.length"></el-divider>
          <div v-for="(sku,sku_idx) in product.model.sku_list" :key="sku.sku_id">
            <div v-if="!skuDict[sku.sku_id].hidden">
              <el-row>
              <el-col :span="20">
                <div v-for="(spec,i) in sku.spec" :key="spec.spec_id" style="display:inline-block;">
                  <div :style="{ display:'inline-block', 'text-align':center, width:getSpecWidth(i, product.model.sku_list, product.model.goods_id) }"
                  >{{spec.spec_name}}</div>
                  <el-divider direction="vertical" v-if="i+1<sku.spec.length"></el-divider>
                </div>
                <div v-if="sku.spec.length === 0" style="display:inline-block;">默认规格</div>
              </el-col>
              <el-col :span="4">
                <el-input-number v-model="sku.price" :controls="false"  :min="0" size="mini"
                  class="multiple-text" style="width:80px;"
                  :class="{'is-text-change':sku.price !== product.originModel.sku_list[sku_idx].price}"
                >
                </el-input-number>
              </el-col>
            </el-row>
            <el-divider style="margin:5px 0;" v-if="sku_idx + 1 < product.model.sku_list.length"></el-divider>
            </div>
        </div>
    </div>
</template>

<script>
// import common from '@/common/common.js'
import utils from '@/common/utils'

export default {
  components: {
  },
  props: {
    product: Object
  },
  data () {
    return {
      specList: [],
      specSelectId: [],
      batch_price: '',
      skuDict: {}
    }
  },
  computed: {
  },
  created () {
    this.initData()
  },
  methods: {
    getProductSpec () {
      let productSpecList = []
      this.product.model.sku_list.forEach((sku) => {
        sku.spec.forEach((spec) => {
          let idx = productSpecList.findIndex(item => item.id === spec.parent_id)
          if (idx === -1) {
            productSpecList.push({
              'id': spec.parent_id,
              'name': spec.parent_name,
              'values': []
            })
            idx = productSpecList.length - 1
            this.specSelectId.push('')
          }
          let parentSpec = productSpecList[idx]
          idx = parentSpec['values'].findIndex(item => item.id === spec.spec_id)
          if (idx === -1) {
            parentSpec['values'].push({
              'name': spec.spec_name,
              'id': spec.spec_id
            })
          }
        })
      })
      return productSpecList
    },
    getSkuDict () {
      let skuDict = {}
      this.product.model.sku_list.forEach((sku) => {
        skuDict[sku.sku_id] = {
          'hidden': false
        }
      })
      return skuDict
    },
    initData () {
      this.specList = this.getProductSpec()
      this.specSelectId = Array(this.specList.length).fill('')
      this.skuDict = this.getSkuDict()
    },
    changeSpec () {
      let self = this
      for (let skuId in this.skuDict) {
        this.skuDict[skuId].hidden = false
      }
      for (let i in this.specList) {
        let spec = this.specList[i]
        if (this.specSelectId[i] !== '') {
          let selectId = this.specSelectId[i]
          this.product.model.sku_list.forEach((sku) => {
            sku.spec.forEach((skuSpec) => {
              if (skuSpec.parent_id === spec.id) {
                if (skuSpec.spec_id !== selectId) {
                  self.skuDict[sku.sku_id].hidden = true
                }
              }
            })
          })
        }
      }
    },
    batchUpdatePrice () {
      if (!utils.isNumber(this.batch_price)) {
        this.$alert('必须为数字')
        return
      }
      this.product.model.sku_list.forEach((sku) => {
        let skuId = sku.sku_id
        if (this.skuDict[skuId]['hidden'] === false) {
          sku.price = this.batch_price
        }
      })
    },
    getSpecWidth (specIndex, skuList) {
      let specLenArr = [0, 0, 0]
      for (let i in skuList) {
        let sku = skuList[i]
        let specNameArr = sku['spec_detail_names'].split(',')
        for (let j in specNameArr) {
          specLenArr[j] += specNameArr[j].length
        }
      }
      let sumLen = Math.max(1, specLenArr[0] + specLenArr[1] + specLenArr[2])
      let width = parseInt(480 * specLenArr[specIndex] / sumLen)
      return width + 'px'
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/base.less';
    /deep/ .el-divider--horizontal{
      margin:5px 0;
    }
</style>

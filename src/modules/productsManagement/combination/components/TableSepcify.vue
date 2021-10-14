<!--  -->
<template>
    <div class="card left">
      <el-form ref="form" size="mini" label-width="100px" :rules="rules" :model="bundle_list">
        <div  v-for="(item,index) in bundle_list" :key="item.id" class="">
            <h1 class="flex align-c justify-b" >
              <span>规格{{bundle_list.length>1 ? item.id:''}}</span>
              <span class="pointer delete" @click="deleteSpecify(item.id)" v-if="bundle_list.length > 1"><hh-icon type="iconshanchu1"></hh-icon></span>
            </h1>
            <el-form-item  label="组合商品:" class="item" :prop="`[${index}].sku_list`">
            <el-table
                :data="item.sku_list"
                style="width: 100%;border:1px solid #E5E5E5;border-radius:4px 4px 0 0;border-bottom:0;">
                <el-table-column
                    prop="image_url"
                    label="选择规格">
                    <template slot-scope="scope">
                      <div class="flex align-c">
                        <div style="width:60px;">
                          <el-image
                              style="height:60px;max-width:60px;border-radius:2px;margin-right:8px"
                              :src="scope.row.image_url"
                              fit="contain"
                              :preview-src-list="[scope.row.image_url]"
                              >
                              <div slot="placeholder">
                                  <hh-icon  type="iconwuzhaopian" style="font-size:60px" />
                              </div>
                              <div slot="error" class="flex align-c" style="height:100%">
                                  <hh-icon  type="icontupianjiazaishibai03" style="font-size:30px" />
                              </div>
                          </el-image>
                        </div>
                        <el-input
                            @input="handleInputShortName($event,scope.row,index,'short_name')"
                            :value="scope.row.short_name"
                            class="price"
                            type="textarea"
                        >
                        </el-input>
                      </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="ori_price"
                    label="单价"
                    align="center"
                    width="100">
                    <template slot-scope="scope">
                      ¥{{(scope.row.ori_price / 100).toFixed(2)}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="combo_num"
                    align="center"
                    label="数量"
                    width="90">
                    <template slot-scope="scope">
                      <el-input
                          @input="handleInputComboNum($event,scope.row,index)"
                          :value="scope.row.combo_num"
                          class="price"
                      >
                      </el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="stock_num"
                    label="库存"
                    align="center"
                    width="90">
                    <template slot-scope="scope">
                      <el-input
                          :disabled="true"
                          v-model="scope.row.stock_num"
                          class="price"
                      >
                      </el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    label="关联库存"
                    align="center"
                    width="90">
                    <template slot-scope="scope">
                      <el-switch :value="true" :disabled="true">
                      </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    width="90">
                    <template slot-scope="scope">
                      <el-button type="text"   @click="deleteProducts(scope.row,item)">删除</el-button>
                    </template>
                </el-table-column>
                </el-table>
                <div style="border-left:1px solid #E5E5E5;border-right:1px solid #E5E5E5;border-bottom:1px solid #E5E5E5;border-top:0;height:44px;line-height:44px">
                  <el-button type="text"  icon="el-icon-plus" @click="open(item)" style="padding-left:10px">选择商品</el-button>
                </div>
            </el-form-item>
            <el-form-item  label="组合名称:"   class="item"  :prop="`[${index}].spec_detail_name1`">
                <el-input :maxlength="30" show-word-limit  v-model="item.spec_detail_name1"  placeholder="请填写组合名称,限30个汉字" clearable @clear="handleClear(item,'spec_detail_name1')"></el-input>
            </el-form-item>

            <el-form-item  label="组合原价:" class="item">
               <span> {{item.ori_price ? `¥${(item.ori_price / 100).toFixed(2) }` : '-'}}</span>
            </el-form-item>

             <el-form-item  label="最终价格:"  class="item"  :prop="`[${index}].price`">
                <el-input
                    style="width: 295px"
                    :max="99999999"
                    v-model="item.price"
                    class="price"
                    :disabled="!item.sku_list.length"
                >
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>

            <el-form-item  label="组合库存:" class="item">
                <span> {{item.sku_list.length ? item.stock_num || '0' : '-'}}</span>
            </el-form-item>

            <el-form-item  label="商品编码:"  class="item" >
                <el-input
                    style="width: 295px"
                    v-model="item.code"
                    class="price"
                    clearable
                    @clear="handleClear(item,'code')"
                >
                </el-input>
            </el-form-item>
        </div>
        <el-button type="primary" plain size="medium" icon="el-icon-plus" style="margin-left:100px" @click="add">添加规格</el-button>
      </el-form>

      <DrawChooseProducts  ref="DrawChooseProducts" @submit="addProducts" />
    </div>
</template>

<script>
import DrawChooseProducts from './DrawChooseProducts'
import { mapMutations } from 'vuex'
import utils from '@/common/utils'
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'TableSepcify',
  components: {
    DrawChooseProducts
  },
  data () {
    return {
      activeSpecifiedActive: undefined,
      bundle_list: [{
        id: 1,
        sku_list: [],
        spec_detail_name1: '',
        stock_num: '',
        price: '',
        code: ''
      }]
    }
  },
  computed: {
    rules () {
      const nameRules = {}
      const priceRules = {}
      const skuRules = {}

      const checkWordsLength = (rule, value, callback) => {
        if (value && utils.getStrRealLength(value) > 30) {
          return callback(new Error('组合名称最多可以填写30个字符！'))
        } else {
          callback()
        }
      }

      this.bundle_list.forEach((item, index) => {
        const key = `[${index}].sku_list`
        skuRules[key] = [
          { required: true, message: '请选择商品', trigger: ['blur', 'change'] }
        ]
      })

      this.bundle_list.forEach((item, index) => {
        const key = `[${index}].spec_detail_name1`
        nameRules[key] = [
          { required: true, message: '请填写组合名称', trigger: 'change' },
          { validator: checkWordsLength, trigger: 'change' }
        ]
      })

      this.bundle_list.forEach((item, index) => {
        const key = `[${index}].price`
        priceRules[key] = [
          { required: true, message: '请填写最终价格', trigger: 'change' }
        ]
      })
      return {
        ...skuRules,
        ...nameRules,
        ...priceRules
      }
    }
  },
  methods: {
    ...mapMutations('productManagement/combination/tableSepcify', ['save']),
    add () {
      const defaultData = {
        id: this.bundle_list.length + 1,
        sku_list: [],
        spec_detail_name1: '',
        stock_num: '',
        price: '',
        code: ''
      }
      this.bundle_list.push(defaultData)
      this.$emit('refresh')
    },
    handleClear (row, key) {
      row[key] = ''
      const index = row.id
      this.$set(this.bundle_list, index - 1, row)
    },
    open (item) {
      this.$refs.DrawChooseProducts.open()
      this.activeSpecifiedActive = item
    },
    getOriPrice (skuList) {
      return skuList.reduce((t, c) => {
        return t + c.ori_price * c.combo_num
      }, 0)
    },
    getStockNum (skuList) {
      return Math.min(...skuList.map((item) => {
        return Math.floor(item.stock_num / item.combo_num)
      }))
    },
    addProducts (data) {
      // 有相同商品 是否替换
      // 无相同商品 直接加入

      if (this.activeSpecifiedActive.sku_list.length + data.length > 5) {
        return this.$message.warning('最多关联5个商品')
      }
      const index = this.activeSpecifiedActive.id
      data = data.map(item => {
        const index = item.choosedSkuId.split('-')[2]
        const sku = item.sku_list[index]
        item.sub_product_id = item.goods_id
        item.sub_sku_id = sku.sku_id
        item.combo_num = 1
        item.short_name = `${item.goods_name}-${sku.spec_detail_names}`
        item.ori_price = sku.price
        item.stock_type = 0
        item.pic_url = item.image_url
        item.stock_num = sku.quantity
        return item
      })
      // 组合原价 组合库存
      const skuList = this.activeSpecifiedActive.sku_list
      const activeSkuList = [...skuList, ...data]
      const oriPrice = this.getOriPrice(activeSkuList)
      const stockNum = this.getStockNum(activeSkuList)
      this.activeSpecifiedActive.stock_num = stockNum
      this.activeSpecifiedActive.ori_price = oriPrice
      this.activeSpecifiedActive.sku_list = activeSkuList
      this.$set(this.bundle_list, index - 1, this.activeSpecifiedActive)
      this.activeSpecifiedActive = undefined
      this.save({
        bundle_list: this.bundle_list
      })
      this.$emit('refresh')
    },
    deleteProducts (productRow, specify) {
      const skuList = specify.sku_list.filter(item => item.sub_product_id !== productRow.sub_product_id)
      const index = specify.id
      specify.sku_list = skuList
      this.$set(this.bundle_list, index - 1, specify)
    },
    deleteSpecify (id) {
      const h = this.$createElement
      this.$confirm('', {
        message: h('div', null, [
          h('div', {
            class: 'center'
          }, [
            h('hh-icon', {
              props: {
                type: 'iconjinggao1'
              },
              class: 'TableSepcify-icon'
            })
          ]),
          h('div', {
            class: 'TableSepcify-text'
          }, '确定删除该规格?')
        ]),
        type: 'warning',
        customClass: 'TableSepcify-customClass',
        cancelButtonClass: 'TableSepcify-cancelButtonClass',
        confirmButtonClass: 'TableSepcify-confirmButtonClass',
        showClose: false
      })
        .then(_ => {
          const index = id - 1
          this.bundle_list.splice(index, 1)
          this.$emit('refresh')
        })
        .catch(_ => {
          return false
        })
    },
    handleInputShortName (value, row, index) {
      const data = this.bundle_list[index]
      data.sku_list.forEach(item => {
        if (item.sub_sku_id === row.sub_sku_id) {
          item.short_name = value
        }
      })
      const bundleList = this.bundle_list
      bundleList[index] = data
      this.bundle_list = cloneDeep(bundleList)
    },
    handleInputComboNum (value, row, index) {
      const data = cloneDeep(this.bundle_list[index])
      data.sku_list.forEach(item => {
        if (item.sub_sku_id === row.sub_sku_id) {
          item.combo_num = value
        }
      })
      // 组合原价 组合库存
      const oriPrice = this.getOriPrice(data.sku_list)
      const stockNum = this.getStockNum(data.sku_list)
      console.log(oriPrice, 'oriPrice')
      data.stock_num = stockNum
      data.ori_price = oriPrice
      const bundleList = this.bundle_list
      bundleList[index] = data
      this.bundle_list = cloneDeep(bundleList)
    },
    getForm () {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid, object) => {
          if (valid) {
            const bundleList = cloneDeep(this.bundle_list)
            const arr = [];
            (bundleList || []).forEach(product => {
              (product.sku_list || []).forEach(sku => {
                arr.push(sku.image_url)
              })
            })

            bundleList.forEach(item => {
              item.price = utils.yuanToFen(item.price)
            })

            if (arr.length) {
              resolve({
                bundle_list: JSON.stringify(bundleList),
                banner_json: JSON.stringify(arr.slice(0, 5)),
                desc_json: JSON.stringify(arr)
              })
            } else {
              const e = {
                'product': 'no product'
              }
              reject(e)
            }
          } else {
            const e = object
            reject(e)
          }
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.price {
        /deep/ .el-input__inner {
          // border-right: none;
          padding: 5px;
          padding-left: 10px;
        }

      }

    .item {
        padding-bottom: 10px;
        box-sizing: border-box;
    }

    .card {
      background: #f9f9fa;
      border-radius: 4px;
      margin-bottom: 16px;
      padding: 24px 24px 1px;
    }

    h1 {
        color: #333;
        font-size: 16px;
        margin-bottom: 20px;
        font-family: yahei;
    }

.delete {
  &:hover {
    color: @color-primary;
  }
}
</style>
<style lang="less">
.TableSepcify-cancelButtonClass{
  font-size: 12px;
  margin-right: 10px;
  width: 120px;
  padding: 12px;
}

.TableSepcify-confirmButtonClass{
  font-size: 12px;
  width: 120px;
  padding: 12px;
}

.TableSepcify-icon {
  width: 50px;
  height: 50px;
  font-size: 50px;
}

.TableSepcify-text {
  width: 364px;
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4E4E4E;
  line-height: 20px;
  text-align: center;
  margin-top: 16px;
  margin-bottom: 20px;
}

.TableSepcify-customClass {
    padding-bottom: 20px;
    .el-message-box__header {
      padding-top: 0;
    }
    .el-message-box__btns {
      text-align: center;
    }
    .el-message-box__content {
      .el-message-box__message {
        padding-left: 0;
      }
      p {
        font-size: 18px;
        margin: 15px 0 10px;
        text-align: center;
      }
      .el-icon-warning {
        display: none;
      }
    }
}
</style>

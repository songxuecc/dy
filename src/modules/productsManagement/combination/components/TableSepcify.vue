<!--  -->
<template>
    <div class="card left">
        <div  v-for="(item) in bundle_list" :key="item.id" class="">
            <h1 class="flex align-c justify-b" >
              <span>规格{{bundle_list.length>1 ? item.id:''}}</span>
              <span class="pointer delete" @click="deleteSpecify(item.id)" v-if="bundle_list.length > 1"><hh-icon type="iconshanchu1"></hh-icon></span>
            </h1>
            <el-form-item required label="组合商品:" class="item">
            <el-table
                :data="item.tableData"
                style="width: 100%;border:1px solid #E5E5E5;border-radius:4px 4px 0 0;border-bottom:0;">
                <!-- <el-table-empty slot="empty"/> -->
                <el-table-column
                    prop="date"
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
                            v-model="scope.row.short_name"
                            class="price"
                            type="textarea"
                        >
                        </el-input>
                      </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="单价"
                    align="center"
                    width="100">
                    <template slot-scope="scope">
                      ¥{{(scope.row.ori_price / 100).toFixed(2)}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="address"
                    align="center"
                    label="数量"
                    width="90">
                    <template slot-scope="scope">
                      <el-input
                          :max="99999999"
                          v-model="scope.row.combo_num"
                          class="price"
                      >
                      </el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
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
                    prop="address"
                    label="关联库存"
                    align="center"
                    width="90">
                    <template slot-scope="scope">
                      <el-switch :value="true" :disabled="true">
                      </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="address"
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
            <el-form-item  label="组合名称:"   class="item" required>
                <el-input :maxlength="50" :minlength="8" show-word-limit  v-model="item.spec_detail_name1"  placeholder="请填写商家推荐语设置,限8-50个汉字" clearable @clear="handleClear(item,'spec_detail_name1')"></el-input>
            </el-form-item>

            <el-form-item  label="组合原价:" class="item">
               <span> {{item.ori_price ? `¥${(item.ori_price / 100).toFixed(2) }` : '-'}}</span>
            </el-form-item>

             <el-form-item  label="最终价格:"  class="item" required>
                <el-input
                    style="width: 295px"
                    :max="99999999"
                    v-model="item.price"
                    class="price"
                    :disabled="!item.tableData.length"
                >
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>

            <el-form-item  label="组合库存:" class="item">
                <span> {{item.stock_num || '-'}}</span>
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
      <DrawChooseProducts  ref="DrawChooseProducts" @submit="addProducts" />
    </div>
</template>

<script>
import DrawChooseProducts from './DrawChooseProducts'
import { mapMutations } from 'vuex'

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
        tableData: [],
        spec_detail_name1: '',
        stock_num: '',
        price: '',
        code: ''
      }]

    }
  },
  methods: {
    ...mapMutations('productManagement/combination/tableSepcify', ['save']),
    add () {
      const defaultData = {
        id: this.bundle_list.length + 1,
        tableData: [],
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
    getOriPrice (tableData) {
      return tableData.reduce((t, c) => {
        return t + c.ori_price
      }, 0)
    },
    getStockNum (tableData) {
      return Math.min(...tableData.map((item) => {
        return parseFloat(item.stock_num / item.combo_num)
      }))
    },
    addProducts (data) {
      // 有相同商品 是否替换
      // 无相同商品 直接加入
      const index = this.activeSpecifiedActive.id
      const tableData = this.activeSpecifiedActive.tableData

      data = data.map(item => {
        const index = item.choosedSkuId.split('-')[2]
        const sku = item.sku_list[index]
        item.sub_product_id = item.tp_id
        item.sub_sku_id = sku.sku_id
        item.combo_num = 1
        item.short_name = `${item.goods_name}-${sku.spec_detail_names}`
        item.ori_price = sku.price
        item.stock_type = 0
        item.pic_url = item.image_url
        item.stock_num = sku.quantity
        return item
      })
      // 组合原价
      // 最终价格
      const activeTableData = [...tableData, ...data]
      const oriPrice = this.getOriPrice(activeTableData)
      const stockNum = this.getStockNum(activeTableData)
      console.log(oriPrice)
      console.log(stockNum)
      this.activeSpecifiedActive.stock_num = stockNum
      this.activeSpecifiedActive.ori_price = oriPrice
      this.activeSpecifiedActive.tableData = activeTableData
      this.$set(this.bundle_list, index - 1, this.activeSpecifiedActive)
      this.activeSpecifiedActive = undefined
      this.save({
        bundle_list: this.bundle_list
      })
      this.$emit('refresh')
    },
    deleteProducts (productRow, specify) {
      const tableData = specify.tableData.filter(item => item.tp_id !== productRow.tp_id)
      const index = specify.id
      specify.tableData = tableData
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

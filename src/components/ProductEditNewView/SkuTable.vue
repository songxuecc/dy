<!--  -->
<template>
    <div class="SkuTable left">
    <h1 class="mb-10">商品规格</h1>
    <SkuSelect
      ref="SkuSelect"
      :specifications="spec_list"
      @change="onSkuSelectChange"/>
    <h1 class="mb-10" style="margin-top:20px">批量设置</h1>
    <el-form class="mb-10 flex wrap" style="padding-left:15px" size="small" :model="batchEditForm">
      <el-form-item>
        <el-select
          v-model="batchEditForm[spec.spec_id]"
          placeholder="请选择"
          v-for="(spec, index) in  spec_list"
          :key="index"
          style="width:130px"
          class="mr-5">
          <el-option
            :label="`全部-${spec.name}`"
            :value="-1">
          </el-option>
          <el-option
            v-for="item in spec.value_list"
            :key="item.spec_detail_id"
            :label="item.name"
            :value="item.spec_detail_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input  class="mr-5" style="width:130px" v-model="batchEditForm.promo_price" placeholder="价格"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input  class="mr-5" style="width:130px" v-model="batchEditForm.quantity" placeholder="库存"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input  class="mr-5" style="width:130px" v-model="batchEditForm.code" placeholder="编码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="medeium" type="primary" plain style="width:80px;height:32px;padding:0" @click="handleBatchEdit">设置</el-button>
      </el-form-item>

    </el-form>
    <h1 class="mb-10" style="margin-top:10px">价格与库存</h1>
        <el-form :rules="rules" ref="form" :model="tableData" size="small" style="padding-left:15px">
            <el-table
            :data="tableData"
            :span-method="spanMethod"
            cell-class-name="cell-class-name"
            style="width: 100%">
            <el-table-empty slot="empty"/>
            <el-table-column
                v-for="(spec, index) in  spec_list"
                fixed
                :key="index"
                :label="spec.name"
                width="150">
                <template slot-scope="scope">
                    <span >{{getRowData(scope.row,index)}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="quantity"
                label="总库存"
                width="130">
                <template slot-scope="scope">
                    <el-form-item  :prop="`[${scope.row.index}].quantity`">
                        <el-input v-model="scope.row.quantity" placeholder="请输入"></el-input>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column
                prop="address"
                width="130">
                <template slot="header" slot-scope="scope">
                    <span>货源方原价</span>
                    <el-tooltip manua="true" class="item" effect="dark" placement="top" style="vertical-align: middle">
                        <div slot="content">
                          <ul style="padding: 0; margin: 0;margin-bottom:5px;text-align:left" class="left">此处为货源方的原价,如果要进行调价不用在此处修改</ul>
                          <ul style="padding: 0; margin: 0;text-align:left" class="left">您可以在下一步统一进行价格调整</ul>
                        </div>
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </template>

                <template slot-scope="scope">
                    <el-form-item  class="relative" :prop="`[${scope.row.index}].promo_price`">
                        <span class="unit">¥</span>
                        <el-input class="price" v-model="scope.row.promo_price" placeholder="请输入"></el-input>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column
                prop="address"
                label="商品编码"
                >
                 <template slot="header" slot-scope="scope">
                  <div class="center">
                    <span @click="toggleVisibleSkuImport" >商品编码</span>
                    <el-tooltip content="点击查看抓取方法" effect="dark" placement="top">
                      <span class="pointer" @click="toggleVisibleSkuImport"><i class="el-icon-question"></i></span>
                    </el-tooltip>
                  </div>
                </template>
                <template slot-scope="scope">
                    <el-form-item  :prop="`[${scope.row.index}].code`">
                        <el-input v-model="scope.row.code" placeholder="请输入"></el-input>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column
                prop="address"
                label="预览图"
                width="90"
                align="center" >
                <template slot-scope="scope">
                    <div class="preview imgWrapper" style="padding:4px" v-if="scope.row.img">
                      <el-popover
                        placement="left"
                        width="270"
                        trigger="hover">
                        <img :src="scope.row.img" style="width: 270px;"/>
                        <div
                          slot="reference">
                          <el-image
                            slot="reference"
                            style="width: 60px; height: 60px"
                            class="pointer"
                            :src="scope.row.img">
                          </el-image>
                        </div>
                        </el-popover>
                    </div>
                </template>
            </el-table-column>
            </el-table>
        </el-form>
        <el-dialog :visible.sync="visibleSkuImport" width="30%"
          :append-to-body="true" v-hh-modal>
          <div slot="title" class="center" style="font-size: large;text-align:center">提示</div>
          <div style="text-align:center">
            <p>因商品编码属于商家后台的字段，故无法获取。</p>
            <p>您可在搬家上线成功后在【导入修改】中导入"规格名称-</p>
            <p>sku编码"对应表格进行修改。</p>
            <div class="flex  justify-c align-c skuImportDialoag">
              <img :src="skuImport"  style="width:176px;"/>
            </div>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import SkuSelect from './SkuSelect'
import omit from 'lodash/omit'
import cloneDeep from 'lodash/cloneDeep'
import skuImport from '@/assets/images/sku_import.png'

export default {
  name: 'component_name',
  props: {
    sku_json: Object
  },
  components: {
    SkuSelect
  },
  data () {
    return {
      spec_list: [],
      tableData: [],
      spec_price_list: [],
      batchEditForm: {
        promo_price: '',
        quantity: '',
        code: ''
      },
      skuImport,
      visibleSkuImport: false
    }
  },
  watch: {
    spec_list (n) {
      if (n) {
        n.forEach(item => {
          this.batchEditForm[item.spec_id] = -1
        })
      }
    }
  },
  computed: {
    rules () {
      const priceRules = {}
      this.tableData.forEach((item, index) => {
        const key = `[${index}].promo_price`
        priceRules[key] = [
          { required: true, message: '请输入价格', trigger: ['blur', 'change'] }
          // { required: true, message: '请输入0.01到9999999.99的数字，最多保留2位小数', trigger: ['blur', 'change'] }
        ]
      })
      return {
        ...priceRules
      }
    }
  },
  methods: {
    init (skuJson) {
      // 批量修改表单初始化
      this.batchEditForm.promo_price = ''
      this.batchEditForm.quantity = ''
      this.batchEditForm.code = ''

      this.spec_list = cloneDeep(skuJson.spec_list)
      this.spec_price_list = cloneDeep(skuJson.spec_price_list)
      const tableData = []
      const specData = this.initTableData(this.spec_list)
      let recordFirstPrice = false
      specData.forEach((spec, index) => {
        let matchSpecData = {}
        this.spec_price_list.forEach((data, index) => {
          const dataSet = new Set(data.spec_detail_id_list)
          const specSet = new Set(spec)
          const isEqual = [...dataSet].every(x => specSet.has(x))
          if (data.spec_detail_id_list.length && isEqual) {
            matchSpecData = data
            matchSpecData.promo_price = matchSpecData.promo_price
            if (!recordFirstPrice) {
              recordFirstPrice = matchSpecData.promo_price
            }
          } else {
            // 当用户抓取的商品缺少sku时，库存=0，价格取第一个sku价格（库存既然是0了所以价格是多少不重要，只要不是0就行）。从而解决价格=0的问题
            matchSpecData.promo_price = recordFirstPrice
            matchSpecData.quantity = 0
          }
        })
        matchSpecData.index = index
        matchSpecData.spec_detail_id_list = spec
        tableData.push(matchSpecData)
      })
      this.tableData = cloneDeep(tableData)
      this.originTableData = cloneDeep(tableData)
      this.$nextTick(() => {
        this.$refs.SkuSelect && this.$refs.SkuSelect.init(skuJson.spec_list)
      })
      this.$emit('change', this.tableData, this.spec_list)
      return {
        tableData,
        spec_list: this.spec_list
      }
    },
    initTableData (list) {
      // 获取阶乘后拼接完整的规格列表
      let specList = [...list]
      let result = [[]]
      while (specList.length) {
        const currentData = specList.shift()
        if (currentData.value_list.length) {
          let originResult = []
          result.forEach((r = []) => {
            currentData.value_list.forEach(spec => {
              const nextSpecs = [...r]
              nextSpecs.push(spec.spec_detail_id)
              originResult.push(nextSpecs)
            })
          })
          result = originResult
        }
      }
      return result
    },
    getForm () {
      // this.$refs.form.validate((valid, object) => {
      //   console.log(valid, object)
      // })
      return this.$data
    },
    getRowData (row, index) {
      const specList = this.spec_list
      let text = ''
      specList.forEach(spec => {
        (spec.value_list || []).forEach(value => {
          if (row.spec_detail_id_list && row.spec_detail_id_list[index] && value.spec_detail_id === row.spec_detail_id_list[index]) {
            text = value.name
          }
        })
      })
      return text
    },
    // 格式化数据
    onSkuSelectChange (specifications, type) {
      // 当用户删除sku时，剩下的sku原本是多少价格、库存就展示多少价格、库存；
      // 当用户修改sku名称时，价格不变；
      // 当用户新增sku时，价格、库存为空，用户点击【保存编辑】需toast提示用户填写价格、库存，若不填写则无法保存
      const specData = this.initTableData(specifications)
      let tableData = []
      // 匹配当前编辑列表数据价格
      specData.forEach((spec, index) => {
        let matchSpecData = {}
        this.tableData.forEach((data) => {
          const dataSet = new Set(data.spec_detail_id_list)
          const specSet = new Set(spec)
          // 元数据内规格包含 新的规格 获取原始数据
          const minus = [...dataSet].filter(x => !specSet.has(x))
          if (!minus.length) {
            matchSpecData = data
          }
        })
        // 将元数据规格更新为新的规格
        if (!matchSpecData.code) matchSpecData.code = ''
        if (!matchSpecData.img) matchSpecData.img = ''
        if (!matchSpecData.promo_price) matchSpecData.promo_price = ''
        if (!matchSpecData.sku_id) matchSpecData.sku_id = ''
        matchSpecData.spec_detail_id_list = spec
        matchSpecData.promo_price = typeof matchSpecData.promo_price !== 'undefined' ? matchSpecData.promo_price : ''
        matchSpecData.quantity = typeof matchSpecData.quantity !== 'undefined' ? matchSpecData.quantity : ''
        matchSpecData.price = typeof matchSpecData.price !== 'undefined' ? matchSpecData.price : ''
        matchSpecData.index = index
        tableData.push(matchSpecData)
      })
      // 如果没价格就匹配=初始化价格
      tableData = tableData.map((t, index) => {
        this.originTableData.forEach((data) => {
          const dataSet = new Set(data.spec_detail_id_list)
          const specSet = new Set(t.spec_detail_id_list)
          // 元数据内规格包含 新的规格 获取原始数据
          const conclude = [...specSet].every(x => dataSet.has(x))
          if (conclude && !t.promo_price && data.promo_price) {
            data.spec_detail_id_list = t.spec_detail_id_list
            t = data
          }
        })
        return t
      })

      // 图片
      if (specifications.every(item => !item.addSkuImage)) {
        tableData = tableData.map(item => {
          item.img = ''
          return item
        })
      } else {
        const valueList = specifications.find(item => item.addSkuImage).value_list
        tableData = tableData.map(data => {
          valueList.forEach(value => {
            if (data.spec_detail_id_list.includes(value.spec_detail_id)) {
              data.img = value.image
            }
          })
          return data
        })
      }

      this.$nextTick(() => {
        this.tableData = tableData
        this.spec_list = specifications
        this.$emit('change', this.tableData, this.spec_list)
      })
    },
    // sku抓取
    toggleVisibleSkuImport: function () {
      this.visibleSkuImport = !this.visibleSkuImport
    },
    // 批量设置
    handleBatchEdit () {
      console.log(this.batchEditForm, '批量设置')
      const specArrays = omit(this.batchEditForm, ['promo_price', 'quantity', 'code'])
      const specValues = (Object.values(specArrays) || []).filter(item => Number(item) !== -1)
      this.tableData = this.tableData.map(data => {
        const dataSet = new Set(data.spec_detail_id_list)
        const specSet = new Set(specValues)
        const concludes = [...specSet].every(x => dataSet.has(x))
        if (concludes) {
          if (this.batchEditForm.promo_price) data.promo_price = this.batchEditForm.promo_price
          if (this.batchEditForm.quantity) data.quantity = this.batchEditForm.quantity
          if (this.batchEditForm.code) data.code = this.batchEditForm.code
        }
        return data
      })
      this.$message.success('设置成功')
      this.$emit('change', this.tableData, this.spec_list)
    },
    spanMethod ({ row, column, rowIndex, columnIndex }) {
      const end = this.spec_list.length + 3
      const arr = []
      this.spec_list.map(item => {
        arr.push(item.value_list.length)
      })

      if (arr.length === 3) {
        const columnIndex0 = arr[1] * arr[2]
        const columnIndex1 = arr[2]
        if (columnIndex === 0) {
          if (rowIndex % columnIndex0 === 0) {
            return {
              rowspan: columnIndex0,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        } else if (columnIndex === 1) {
          if (rowIndex % columnIndex1 === 0) {
            return {
              rowspan: columnIndex1,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        } else if (columnIndex === end) {
          if (rowIndex % columnIndex0 === 0) {
            return {
              rowspan: columnIndex0,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }
      if (arr.length === 2) {
        const columnIndex0 = arr[1]
        if (columnIndex === 0) {
          if (rowIndex % columnIndex0 === 0) {
            return {
              rowspan: columnIndex0,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        } else if (columnIndex === end) {
          if (rowIndex % columnIndex0 === 0) {
            return {
              rowspan: columnIndex0,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }

      return {
        rowspan: 1,
        colspan: 1
      }
    }
  }
}
</script>
<style lang="less" scoped>
.SkuTable {
    /deep/ .cell-class-name {
        border-left: 1px solid #F2F2F2;
        padding:0;
        overflow: inherit;
        .cell {
            padding-top: 18px;
        }
    }
    .unit {
        position: absolute;
        left: 8px;
        top: 1px;
        z-index: 1;
        bottom: 0;
        margin: auto;
        line-height: 32px;
        font-size: 14px;
    }
    .promo_price {
        /deep/ .el-input__inner{
            padding-left: 20px;
        }
    }

    /deep/ .el-input__inner {
        &:hover,&:focus {
            border: 1px solid @color-primary;
        }
    }
}

</style>

<!--  -->
<template>
    <div class="SkuTable">

    <div @click="getForm">kjhkjhkj</div>
    <SkuSelect
        :specifications="specifications"
        @change="onSkuSelectChange"/>
        <el-form :rules="rules" ref="form" :model="tableData" size="small">
            <el-table
            :data="tableData"
            :span-method="spanMethod"
            cell-class-name="cell-class-name"
            style="width: 100%">
            <el-table-column
                v-for="(spec, index) in  spec_list"
                :key="index"
                prop="date"
                :label="spec.name"
                width="180">
                <template slot-scope="scope">
                    <span >{{getRowData(scope.row,index)}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="总库存"
                width="180">
                <template slot-scope="scope">
                    <el-form-item  :prop="`[${scope.row.index}].quantity`">
                        <el-input v-model="scope.row.quantity" placeholder="请输入内容"></el-input>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column
                prop="address"
                label="价格">
                <template slot-scope="scope">
                    <!-- <div class="relative"> -->
                    <el-form-item  class="relative" :prop="`[${scope.row.index}].price`">
                        <span class="unit">¥</span>
                        <el-input class="price" v-model="scope.row.price" placeholder="请输入内容"></el-input>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column
                prop="address"
                label="商品编码">
                <template slot-scope="scope">
                    <el-form-item  :prop="`[${scope.row.index}].code`">
                        <el-input v-model="scope.row.code" placeholder="请输入内容"></el-input>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column
                prop="address"
                label="预览图">
                <template slot-scope="scope">
                    <div class="preview" style="padding:4px" v-if="scope.row.img">
                        <el-image
                            slot="reference"
                            style="width: 40px; height: 40px"
                            class="pointer"
                            :src="scope.row.img"
                            :preview-src-list="[scope.row.img]">
                            </el-image>
                    </div>
                </template>
            </el-table-column>
            </el-table>
        </el-form>
    </div>
</template>

<script>
import utils from '@/common/utils'

export default {
  name: 'component_name',
  props: {
    sku_json: Object
  },
  data () {
    return {
      specifications: [],
      spec_list: [],
      spec_price_list: [],
      tableData: []
    }
  },
  computed: {
    rules () {
      const priceRules = {}

      this.tableData.forEach((item, index) => {
        const key = `[${index}].price`
        priceRules[key] = [
          { required: true, message: '请选择商品', trigger: ['blur', 'change'] }
        ]
      })
      return {
        ...priceRules
      }
    }
  },
  methods: {
    init (skuJson) {
      this.spec_list = skuJson.spec_list
      this.spec_price_list = skuJson.spec_price_list
      const tableData = []
      const specData = this.initTableData(skuJson.spec_list)
      specData.forEach((spec, index) => {
        let matchSpecData = {}
        skuJson.spec_price_list.forEach((data) => {
          const dataSet = new Set(data.spec_detail_id_list)
          const specSet = new Set(spec)
          const minus = [...dataSet].filter(x => !specSet.has(x))
          if (!minus.length) {
            matchSpecData = data
          }
        })
        matchSpecData.price = utils.fenToYuan(matchSpecData.price)
        matchSpecData.index = index
        tableData.push(matchSpecData)
      })
      this.tableData = tableData
      this.originTableData = tableData
    },
    initTableData (list) {
        // 获取阶乘后拼接完整的规格列表
      let specList = [...list]
      let index = 0
      let result = []
      while (specList.length) {
        const current = specList.pop()
        let originSpecs = []
        current.value_list.forEach((item) => {
          if (!index) {
            originSpecs.push([item.spec_detail_id])
          } else {
            result.forEach(specs => {
              const nextSpecs = [...specs]
              nextSpecs.push(item.spec_detail_id)
              originSpecs.push(nextSpecs)
            })
          }
        })
        index++
        result = originSpecs
      }
      return result
    },
    getForm () {
      this.$refs.form.validate((valid, object) => {
        console.log(valid, object)
      })
    },
    getRowData (row, index) {
      const specList = this.spec_list
      let text = ''
      specList.forEach(spec => {
        spec.value_list.forEach(value => {
          if (value.spec_detail_id === row.spec_detail_id_list[index]) {
            text = value.name
          }
        })
      })
      return text
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
    },
    onSkuSelectChange (specifications) {
      this.$set(this, 'specifications', specifications)
      this.handleSpecifications(specifications)
      this.product.model.skuShowList = this.skuShowList
      this.product.model.specifications = specifications
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
    .price {
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

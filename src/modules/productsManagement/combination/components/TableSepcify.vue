<!--  -->
<template>
    <div class="card left">
        <div  v-for="(item) in list" :key="item.id" class="">
            <h1>规格{{list.length>1 ? item.id:''}}</h1>
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
                            :max="99999999"
                            v-model="item.incr_diff"
                            class="price"
                        >
                        </el-input>
                      </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="单价"
                    align="center"
                    width="80">
                    <template slot-scope="scope">
                      ¥{{234}}
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
                          v-model="item.incr_diff"
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
                          :max="99999999"
                          v-model="item.incr_diff"
                          class="price"
                      >
                      </el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="关联库存"
                    width="90">
                    <template slot-scope="scope">
                      <el-switch
                        v-model="value1">
                      </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="操作"
                    width="90">
                    <template slot-scope="scope">
                      <el-button type="primary"   @click="deleteProducts">删除</el-button>
                    </template>
                </el-table-column>
                </el-table>
                <div style="border-left:1px solid #E5E5E5;border-right:1px solid #E5E5E5;border-bottom:1px solid #E5E5E5;border-top:0;height:44px;line-height:44px">
                  <el-button type="text"  icon="el-icon-plus" @click="open(item)" style="padding-left:10px">选择商品</el-button>
                </div>
            </el-form-item>
            <el-form-item  label="组合名称:"   class="item">
                <el-input :maxlength="50" :minlength="8" show-word-limit  v-model="item.default_recommend_remark"  placeholder="请填写商家推荐语设置,限8-50个汉字" clearable @clear="handleClear('default_recommend_remark')"></el-input>
            </el-form-item>

            <el-form-item  label="组合原价:" class="item">
               <span> {{item.price}}</span>
            </el-form-item>

             <el-form-item  label="最终价格:"  class="item">
                <el-input
                    style="width: 295px"
                    :max="99999999"
                    v-model="item.incr_diff"
                    class="price"
                >
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>

            <el-form-item  label="组合库存:" class="item">
                <span> {{item.number}}</span>
            </el-form-item>
        </div>
        <el-button type="primary" plain size="medium" icon="el-icon-plus" style="margin-left:100px" @click="add">添加规格</el-button>
      <DrawChooseProducts  ref="DrawChooseProducts" @submit="addProducts" />
    </div>
</template>

<script>
import DrawChooseProducts from './DrawChooseProducts'

export default {
  name: 'TableSepcify',
  components: {
    DrawChooseProducts
  },
  data () {
    return {
      activeSpecifiedActive: undefined,
      list: [{
        id: 1,
        tableData: [],
        default_recommend_remark: '',
        price: '¥600',
        incr_diff: '',
        number: 5
      }]

    }
  },
  methods: {
    add () {
      const defaultData = {
        id: this.list.length + 1,
        tableData: [],
        default_recommend_remark: '',
        price: '',
        incr_diff: '',
        number: 0
      }

      this.list.push(defaultData)
    },
    open (item) {
      console.log(this.$refs.DrawChooseProducts, 'this.$refs.DrawChooseProducts')
      this.$refs.DrawChooseProducts.open()
      this.activeSpecifiedActive = item
      console.log(item, this.activeSpecifiedActive, 'item')
    },
    addProducts (data) {
      // 有相同商品 是否替换
      // 无相同商品 直接加入
      // this.
      console.log(this.activeSpecifiedActive, 'this.activeSpecifiedActive')
      const index = this.activeSpecifiedActive.id
      const tableData = this.activeSpecifiedActive.tableData
      this.activeSpecifiedActive.tableData = [...tableData, ...data]
      this.$set(this.list, index - 1, this.activeSpecifiedActive)
      this.activeSpecifiedActive = undefined
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

</style>

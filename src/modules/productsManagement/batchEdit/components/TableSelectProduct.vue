<!-- 选择商品 -->
<template>
     <el-drawer
        :with-header="false"
        direction="rtl"
        :visible.sync="visible"
        @closed="toggleVisible"
        size="80%">
        <!-- 搜索 -->
        <el-form ref="form" :model="form" label-width="60px" :inline="true" size="small" label-position="left" class="left ml-20 mt-20">
           <el-form-item label="状态">
            <el-select v-model="form.status" placeholder="请选择商品状态"  class="w-200 mr-10 ">
                <el-option
                class="left dropdown"
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发货模式">
            <el-select v-model="form.presell_type" placeholder="请选择发货模式"  class="w-200 mr-10 ">
                <el-option
                class="left dropdown"
                v-for="item in presellTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否抓取">
            <el-select v-model="form.captureStatus" placeholder="请选择是否抓取"  class="w-200 mr-10 ">
                <el-option
                class="left dropdown"
                v-for="item in captureStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称" >
            <el-input v-model="form.name" class="w-200"></el-input>
          </el-form-item>
          <br/>
          <el-form-item label="商品ID">
            <el-input class="w-300" type="textarea" v-model="form.desc" :autosize="{minRows:1}" placeholder="输入多个商品ID,以换行分隔，最多可输入5000个"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit" size="medium">搜索</el-button>
          </el-form-item>
        </el-form>
        <!-- 列表 -->
        <div class="left pl-10 font-12">已选100</div>
        <el-table
            ref="multipleTable"
            :data="productListTableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-empty slot="empty"/>
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>

            <el-table-column
                label="图片"
                width="70"
                prop="id">
              <template slot-scope="scope">
                <el-image
                    style="height:50px;max-width:50px"
                    :src="scope.row.image_url"
                    fit="contain"
                    class="mr-10"
                    :preview-src-list="[scope.row.image_url]"
                    lazy>
                    <div slot="placeholder">
                        <hh-icon  type="iconwuzhaopian" style="font-size:50px" />
                    </div>
                    <div slot="error" class="flex align-c" style="height:100%">
                        <hh-icon  type="icontupianjiazaishibai03" style="font-size:30px" />
                    </div>
                </el-image>
              </template>
            </el-table-column>

            <el-table-column
              label="标题"
              width="">
              <template slot-scope="scope">
                  <el-link :underline="false" :href="'https://haohuo.jinritemai.com/views/product/detail?id=' + scope.row.goods_id" target="_blank" >
                    {{ scope.row.goods_name }}
                    </el-link><br>
                    <div class="font-12 flex align-c color-999 mt-5">
                        <span >商品ID{{ scope.row.goods_id }}</span>
                        <span class="ml-10 mr-10 presell_type jieti" v-if="scope.row.presell_type === 2">阶梯发货</span>
                        <span class="ml-10 mr-10 presell_type xianhuo" v-if="scope.row.presell_type === 0">现货发货</span>
                        <span class="ml-10 mr-10 presell_type yushou" v-if="scope.row.presell_type === 1">预售发货</span>
                    </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="category_show"
              label="类目"
              width="120">
            </el-table-column>
            <el-table-column
              prop="min_price"
              label="售卖价"
              width="120">
            </el-table-column>
            <el-table-column
              prop="market_price"
              label="市场价"
              width="120">
            </el-table-column>
            <el-table-column
              prop="status"
              label="销售状态"
              width="120">
            </el-table-column>
          </el-table>

        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          :current-page="productListPagination.page_index"
          :page-size="productListPagination.page_size"
          @size-change="handleSizeChange"
          :total="productListTotal">
        </el-pagination>

        <div class="flex justify-c align-c">
            <el-button type="primary" style="width:120px"  @click="edit">确认选择</el-button>
        </div>
    </el-drawer>
</template>

<script>
import common from '@/common/common.js'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'selectProduct',
  props: {
    visible: Boolean
  },
  data () {
    return {
      form: {},
      captureStatusOptions: [
        {value: -1, label: '全部'},
        {value: 0, label: '非抓取'},
        {value: 1, label: '抓取'}
      ],
      presellTypeOptions: [
        {value: -1, label: '全部发货模式'},
        {value: 0, label: '现货发货'},
        {value: 1, label: '预售发货'},
        {value: 2, label: '阶梯发货'}
      ],
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      multipleSelection: []
    }
  },
  computed: {
    ...mapState('productManagement/batchEdit', [
      'productListPagination',
      'productListSizes',
      'productListTableData',
      'productListTotal'
    ]),
    statusOptions () {
      const options = []
      Object.entries(common.dyProductStatusMap).forEach(([value, label]) => {
        if (!['草稿箱', '封禁中'].includes(label)) {
          options.push({ value, label })
        }
      })
      return options
    }
  },
  methods: {
    ...mapActions('productManagement/batchEdit', ['updateProduct']),
    toggleVisible (index) {
      this.$emit('update:visibleSelectProduct', false)
    }
  }
}
</script>
<style lang="less" scoped>
.dropdown {
  height: 32px;
  line-height: 32px;
  font-size: 12px;
}

.w-200 {
  width: 200px;
}

.w-300 {
  width: 300px;
}

.presell_type {
      width: 58px;
      height: 18px;
      display: inline-block;
      color:#fff;
      text-align: center;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      border-radius: 8px 0px 8px 0px;
  }

.jieti {
  background: linear-gradient(205deg, #F2D1C2 0%, #DC9E85 100%);
}

.xianhuo {
  background: linear-gradient(180deg, #757BC4 0%, #ADB7ED 100%);
}
.yushou {
  background: linear-gradient(180deg, #F9D6AF 0%, #D9A779 100%);
  border-radius: 8px 0px 8px 0px;
}
</style>

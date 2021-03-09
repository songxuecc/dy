<template>
  <div>
    <el-table ref="dyProductListTable" :data="dyProductModelList" row-key="originModel.goods_id" style="width: 100%"
              :row-style="{height:'68px'}" :cell-style="{padding:0}" :row-class-name="tableRowClassName"
              :header-cell-style="{padding: '9px 0', 'line-height': '30px'}" stripe
              @selection-change="handleSelectionChange" @cell-click="onCellClick"
    >
    <el-table-empty slot="empty"/>
      <el-table-column v-if="canSelect" type="selection" :reserve-selection="true" :key="Math.random()" :selectable="selectable">
      </el-table-column>
      <el-table-column label="商品">
        <!-- <template slot="header" slot-scope="scope">
          <span>已选择商品({{ Object.keys(selectProductDict).length }})</span>&nbsp;
          <span v-if="Object.keys(selectProductDict).length >= 100" style="color:red;">最多选择100个</span>
          <el-button v-if="canSelect && Object.keys(selectProductDict).length" size="mini" @click="clearSelection">
            取消选择
          </el-button>
        </template> -->
        <template slot-scope="scope">
          <div style="display: flex;">
            <div style="padding-right: 10px; margin: auto 0;">
              <img style="height:60px; width:60px;" :src="scope.row.originModel.image_url">
            </div>
            <div>
              <div @click.stop>
                <el-link type="primary" :underline="false" :href="'https://haohuo.jinritemai.com/views/product/detail?id=' + scope.row.originModel.goods_id" target="_blank" >
                  {{ scope.row.originModel.goods_name }}
                </el-link>
              </div>
              <div @click.stop style="display: inline-block">
                <el-link :underline="false" target="_blank" :href="'https://haohuo.jinritemai.com/views/product/detail?id=' + scope.row.originModel.goods_id">
                  <el-tag size="mini" effect="plain">{{ dyProductStatusMap[scope.row.originModel.status + '-' + scope.row.originModel.check_status] }}</el-tag>
                </el-link>&nbsp;
                <el-link v-if="scope.row.originModel.goods_commit_id" :underline="false" target="_blank">
                  <el-tag size="mini" effect="plain" type="info" >
                    {{ scope.row.originModel.goods_check_status === 3 ? '新版本已驳回' : '商品更改发布中'}}
                  </el-tag>
                </el-link>
              </div>
              <label class="text-small">
                {{scope.row.originModel.goods_id}}
              </label>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="activeTabName == 'title'" label="标题" :key="Math.random()">
        <template slot-scope="scope">
          <div>
            <div @click.stop>
              <el-input v-model="scope.row.model.goods_name" @focus="editCell(scope.row)" :disabled="!canOperate(scope.row)"></el-input>
            </div>
            <div style="display: flex; flex-direction: row; justify-content: space-between;">
              <span class="text-small">{{ getDyStrRealLength(scope.row.model.goods_name) }}/30</span>
              <div>
                <el-button @click.stop type="text" style="padding: 0; color: gray" @click="rollbackCell(scope.row)"
                >重置</el-button>
                <el-button @click.stop type="text" style="padding: 0" @click="saveCell(scope.row)" :disabled="isSaveDisabled(scope.row)"
                >保存</el-button>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-else-if="activeTabName == 'description'" label="描述" :key="Math.random()">
        <template slot-scope="scope">
          <div @click.stop>
            <el-input type="textarea" v-model="scope.row.model.goods_desc" size="mini" maxlength="500"
                      :autosize="{ minRows: 3, maxRows: 10}" style="min-width: 476px;" show-word-limit
                       @focus="editCell(scope.row)"
            ></el-input>
            <div style="text-align: right">
              <el-button @click.stop type="text" style="padding: 0; color: gray" @click="rollbackCell(scope.row)"
              >重置</el-button>
              <el-button @click.stop type="text" style="padding: 0" @click="saveCell(scope.row)" :disabled="isSaveDisabled(scope.row)"
              >保存</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-else-if="activeTabName == 'saleStatus'" label="上下架" :key="Math.random()" align="center">
        <template slot-scope="scope">
          <el-row>
            <el-col :offset="8" :span="8">
              <div @click.stop>
                <el-switch :value="scope.row.model.is_onsale" @change="editCellOnSale($event, scope.row, index)"
                           :active-value="0" active-text="上架"
                           :inactive-value="1" inactive-text="下架"
                           :disabled="scope.row.model.is_onsale === 'disabled'"
                ></el-switch>
              </div>
            </el-col>
            <el-col :span="8">
              <el-button @click.stop type="text" style="padding: 0" @click="saveCell(scope.row)" :disabled="isSaveDisabled(scope.row)"
              >保存</el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column v-else-if="activeTabName == 'banner'" label="轮播图" :key="Math.random()" align="left">
        <template slot-scope="scope">
          <edit-banner-list :bannerImage="Array.from(scope.row.model.carousel_gallery_list)"  :bannerEditProduct="[scope.row]">
          </edit-banner-list>
          <div style="text-align: right">
            <el-button @click.stop type="text" style="padding: 0; color: gray" @click="rollbackCell(scope.row)">重置</el-button>
            <el-button @click.stop type="text" style="padding: 0" @click="saveCell(scope.row)" :disabled="isSaveDisabled(scope.row)">保存</el-button>
          </div>
        </template>
      </el-table-column>
       <el-table-column v-else-if="activeTabName == 'stock'" label="库存" :key="Math.random()" align="left" width="700">
        <template slot-scope="scope">
         <edit-product-stock :product="scope.row"></edit-product-stock>
          <div style="text-align: right">
            <el-button @click.stop type="text" style="padding: 0; color: gray" @click="rollbackCell(scope.row)">重置</el-button>
            <el-button @click.stop type="text" style="padding: 0" @click="saveCell(scope.row)" :disabled="isSaveDisabled(scope.row)">保存</el-button>
          </div>
        </template>
      </el-table-column>
       <el-table-column v-else-if="activeTabName == 'price'" label="价格" :key="Math.random()" align="left" width="700">
        <template slot-scope="scope">
         <edit-product-price :product="scope.row"></edit-product-price>
          <div style="text-align: right">
            <el-button @click.stop type="text" style="padding: 0; color: gray" @click="rollbackCell(scope.row)">重置</el-button>
            <el-button @click.stop type="text" style="padding: 0" @click="saveCell(scope.row)" :disabled="isSaveDisabled(scope.row)">保存</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-else-if="activeTabName == 'outerSn'" label="编码" :key="Math.random()" align="left">
        <template slot-scope="scope">
         <edit-product-outer-sn :product="scope.row"></edit-product-outer-sn>
          <div style="text-align: right">
            <el-button @click.stop type="text" style="padding: 0; color: gray" @click="rollbackCell(scope.row)">重置</el-button>
            <el-button @click.stop type="text" style="padding: 0" @click="saveCell(scope.row)" :disabled="isSaveDisabled(scope.row)">保存</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="activeTabName == 'presellType'" label="发货模式" :key="Math.random()">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.model.presell_type === 0">
              现货发货
            </span>
            <span v-if="scope.row.model.presell_type === 1">
              预售发货 {{ presellDelay }}
            </span>
            <span v-if="scope.row.model.presell_type === 2">
              阶梯发货 {{ presellDelay }}
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import common from '@/common/common.js'
import utils from '@/common/utils'
import EditBannerList from '@productsManagement/batchEdit/EditBannerList.vue'
import EditProductStock from '@productsManagement/batchEdit/EditProductStock.vue'
import EditProductPrice from '@productsManagement/batchEdit/EditProductPrice.vue'
import EditProductOuterSn from '@productsManagement/batchEdit/EditProductOuterSn.vue'

export default {
  components: {
    EditBannerList,
    EditProductStock,
    EditProductPrice,
    EditProductOuterSn
  },
  props: {
    canSelect: {
      type: Boolean,
      default: true
    },
    activeTabName: String,
    dyProductModelList: Array,
    selectProductDict: Object,
    presellEndTime: '',
    presellDelay: ''
  },
  data () {
    return {
    }
  },
  computed: {
    dyProductStatusMap () {
      return common.dyProductStatusMap
    }
  },
  mounted () {
  },
  methods: {
    selectable (row, index) {
      if (!this.canOperate(row)) {
        return false
      }
      if (row.model.goods_id in this.selectProductDict) {
        return true
      }
      if (Object.keys(this.selectProductDict).length >= 100) {
        return false
      }
      return true
    },
    canOperate (row) {
      if (!row || !row.originModel) {
        return false
      }
      if ((row.originModel.status === 0 && row.originModel.check_status === 1) || // 草稿箱
        (row.originModel.status === 1 && row.originModel.check_status === 5) // 封禁中
      ) {
        return false
      }
      return true
    },
    getDyStrRealLength (str) {
      return utils.getDyStrRealLength(str)
    },
    tableRowClassName ({row, rowIndex}) {
      let retClass = ''
      if (this.getDyStrRealLength(row.model.goods_name) > 30) {
        retClass += ' edited-warn'
      } else if (row.isDiff()) {
        retClass += ' edited-row'
      }
      if (row.model.goods_id in this.selectProductDict) {
        retClass += ' select-row'
      }
      return retClass
    },
    editCell (row) {
      if (this.canSelect) {
        this.$refs.dyProductListTable.toggleRowSelection(row, true)
      }
    },
    editCellOnSale (event, row, index) {
      row.model.is_onsale = row.model.is_onsale === 1 ? 0 : 1
      this.$set(this.dyProductModelList, index, row)
      // if (this.canSelect) {
      //   this.$refs.dyProductListTable.toggleRowSelection(row, true)
      // }
    },
    saveCell (row) {
      this.$emit('saveCell', row)
    },
    rollbackCell (row) {
      row.rollback()
    },
    isSaveDisabled (row) {
      if (!this.canOperate(row)) {
        return true
      }
      if (this.getDyStrRealLength(row.model.goods_name) > 30) {
        return true
      } else if (row.isDiff()) {
        return false
      }
      return true
    },
    onCellClick (row, column, cell, event) {
      if (this.canSelect && this.canOperate(row)) {
        this.$refs.dyProductListTable.toggleRowSelection(row)
      }
    },
    handleSelectionChange (selection) {
      this.$emit('selectionChange', selection)
    },
    clearSelection () {
      this.$refs.dyProductListTable.clearSelection()
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/base.less';
</style>

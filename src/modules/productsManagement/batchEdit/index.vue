<!-- 批量修改 -->
<template>
    <div class="batchEdit">
        <div class="content left">
            <title class="flex">
                <div v-for="(icon,index) in iconList" :key="index" :class="[index === editType ? 'iconBoxActive':'iconBox' , 'center','pointer']" @click="toggleEditType(index)">
                <hh-icon :type="index === editType ? icon.primary :icon.info" class="icon"></hh-icon>
                <p class="font-12 color-4e yaHei">{{ icon.text }}</p> </div>
                <span class="click" style="margin-top:104px">查看修改记录</span>
            </title>

            <el-alert type="success" class="mt-10" :title="`有${jobs.length}组任务正在进行中...`" :closable="false" v-if="jobs.length"></el-alert>

            <div style="height:120px;margin-top: 30px;">
                <h1>修改范围</h1>
                <el-radio-group v-model="modifyMethods" class="mb-20">
                    <el-radio-button label="area">按范围</el-radio-button>
                    <el-radio-button label="product">按商品</el-radio-button>
                    <el-radio-button label="id">按ID</el-radio-button>
                </el-radio-group>
                <el-form
                    :model="form"
                    ref="form"
                    label-width="60px"
                    inline
                    size="medium"
                    v-show="modifyMethods === 'area'"
                    label-position="left"
                >
                    <el-form-item label="商品状态" prop="region">
                    <el-select v-model="form.status" placeholder="请选择商品状态"  class="w-200 mr-20">
                        <el-option
                        class="left dropdown"
                        v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"> </el-option>
                    </el-select>
                    </el-form-item>
                    <el-form-item label="发货模式" prop="region">
                    <el-select v-model="form.presell_type" placeholder="请选择发货模式"  class="w-200 mr-20">
                        <el-option
                        class="left dropdown"
                        v-for="item in presellTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"> </el-option>
                    </el-select>
                    </el-form-item>
                    <el-form-item label="是否抓取" prop="region">
                    <el-select v-model="form.captureStatus" placeholder="请选择是否抓取"  class="w-200 mr-20">
                        <el-option
                        class="left dropdown"
                        v-for="item in captureStatusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"> </el-option>
                    </el-select>
                    </el-form-item>
                </el-form>
                <div v-show="modifyMethods === 'product'">
                <el-button type="primary " class="w-120" @click="chooseProductList">选择修改商品</el-button> <span class="yaHei ml-10">已选 <span class="color-danger">{{hasSelectIds}}</span> 个商品</span>
                </div>
                <div class="flex align-c" v-show="modifyMethods === 'id'">
                <span class="color-4e yaHei font-12 mr-10">输入商品ID</span>
                <el-input
                    type="textarea"
                    autosize
                    placeholder="输入多个商品ID,以换行分隔，最多可输入5000个"
                    v-model="goods_ids"
                    style="flex:1">
                </el-input>
                <span class="click ml-10">确认</span>
                </div>
            </div>

            <h1 class="mt-30">修改内容</h1>
            <Shelves ref="Shelves" v-if="editType === 0"/>
            <TableShelves ref="TableShelves" :visible.sync="visible" v-if="editType === 0 && visible"/>
            <Title ref="Title" v-if="editType === 1"/>
            <Stocks ref="Stocks" v-if="editType === 2"/>
            <Price ref="Price" v-if="editType === 3"/>
            <TablePrice ref="TablePrice" :visible.sync="visible" v-if="editType === 3"/>
            <DeliverMode ref="DeliverMode" v-if="editType === 4"/>
        </div>
        <div class="flex justify-c mt-20">
            <el-button type="primary" class="w-120" @click="preview" :loading="loading">效果修改预览</el-button>
        </div>

        <ModalIdSearch
          :ids="lostGoodsIds"
          ref="ModalIdSearch"
          @continueIdProductList="continueIdProductList"/>
        <TableSelectProduct
          ref="TableSelectProduct"
          :visible.sync="visibleSelectProduct"
          @preview="previewTableSelectProduct" />

    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import common from '@/common/common.js'
import Api from '@/api/apis'

import Title from '@productsManagement/batchEdit/components/Title'
import Shelves from '@productsManagement/batchEdit/components/Shelves'
import DeliverMode from '@productsManagement/batchEdit/components/DeliverMode'
import Stocks from '@productsManagement/batchEdit/components/Stocks'
import Price from '@productsManagement/batchEdit/components/Price'
import TablePrice from '@productsManagement/batchEdit/components/TablePrice'
import TableShelves from '@productsManagement/batchEdit/components/TableShelves'
import TableSelectProduct from '@productsManagement/batchEdit/components/TableSelectProduct'
import ModalIdSearch from '@productsManagement/batchEdit/components/ModalIdSearch'

export default {
  components: {
    Title,
    Shelves,
    DeliverMode,
    Stocks,
    Price,
    TablePrice,
    TableShelves,
    ModalIdSearch,
    TableSelectProduct
  },
  data () {
    return {
      editType: 0,
      modifyMethods: 'area',
      loading: false,
      lostGoodsIds: undefined,
      hasSelectIds: 0,
      form: {
        status: '-',
        presell_type: -1,
        captureStatus: -1
      },
      goods_ids: '',
      visible: false,
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
      iconList: [
        {
          primary: 'iconshangxiajiaxuanzhong',
          info: 'iconshangxiajiaweixuanzhong',
          index: 0,
          text: '上下架'
        },
        {
          primary: 'iconbiaotixuanzhong',
          info: 'iconbiaotiweixuanzhong',
          index: 1,
          text: '标题'
        },
        {
          primary: 'iconkucunxuanzhong',
          info: 'iconkucunweixuanzhong',
          index: 2,
          text: '库存'
        },
        {
          primary: 'iconjiagexuanzhong',
          info: 'iconjiageweixuanzhong',
          index: 3,
          text: '价格'
        },
        {
          primary: 'iconfahuomoshixuanzhong',
          info: 'iconfahuomoshiweixuanzhong',
          index: 4,
          text: '发货模式'
        }
      ],
      visibleSelectProduct: false
    }
  },
  computed: {
    ...mapState('productManagement/batchEdit', ['jobs']),
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
  watch: {
    jobs (n, old) {
      if (old.length && !n.length) this.hasSelectIds = 0
    }
  },
  created () {},
  mounted () {},
  updated () {},
  methods: {
    ...mapActions('productManagement/batchEdit', ['fetchProductList', 'productListSetFilter']),
    ...mapMutations('productManagement/batchEdit', ['save']),
    // 事件名称
    toggleEditType (index) {
      this.editType = index
    },
    getEditData () {
      const editType = this.editType
      const isOnSale = this.$refs.Shelves.isOnSale

      return {
        editType,
        isOnSale
      }
    },
    preview (index) {
      if (this.modifyMethods === 'area') {
        this.hasSelectIds = 0
        this.areaProductList()
      } else if (this.modifyMethods === 'id') {
        this.hasSelectIds = 0
        this.idProductList()
      } else {
        this.previewProductList()
      }
    },
    async areaProductList () {
      this.loading = true
      const statusArray = this.form.status.split('-')
      let status = -1
      let checkStatus = -1
      if (statusArray.length > 1 && statusArray[0]) {
        status = parseInt(statusArray[0])
        checkStatus = parseInt(statusArray[1])
      }

      let filters = {
        status: status,
        check_status: checkStatus,
        capture_status: this.form.captureStatus,
        presell_type: this.form.presell_type,
        goods_ids: []
      }
      await this.fetchProductList({
        filters,
        editData: this.getEditData()
      })
      this.loading = false
      this.visible = true
    },
    async idProductList () {
      this.loading = true
      const goodsIds = this.goods_ids.split(/[\s\n]/).filter(item => item).map(item => item.trim())
      const goodsIdsSet = [...new Set(goodsIds)]
      const limit = 100
      if (!goodsIdsSet.length) {
        this.loading = false
        return this.$message.error(`请输入商品id`)
      } else if (goodsIdsSet.length > limit) {
        this.loading = false
        return this.$message.error(`搜索id不可以超过${limit}条！`)
      }
      const idsCheck = await Api.hhgjAPIs.productListCheck({
        goods_id_list: JSON.stringify(goodsIdsSet)
      })
      this.loading = false
      // 查询有违规id
      if (idsCheck && idsCheck.lost_goods_id_list.length) {
        const lostGoodsIds = idsCheck.lost_goods_id_list
        this.lostGoodsIds = lostGoodsIds
        const lostGoodsIdsSet = new Set(lostGoodsIds)
        const unionSets = goodsIdsSet.filter(item => !lostGoodsIdsSet.has(item))
        if (unionSets.length) {
          // 部分id可以用 弹出弹窗
          this.$refs.ModalIdSearch.visible = true
          return false
        } else {
          // 所有id都不能用
          return this.$message({
            message: '您输入的所有商品id都不能存在，请仔细核对重新输入～',
            type: 'error'
          })
        }
      // 所有id都能用
      } else {
        await this.fetchProductList({
          filters: {
            goods_ids: goodsIdsSet.length ? goodsIdsSet : ''
          },
          editData: this.getEditData()
        })
        this.visible = true
      }
    },
    async continueIdProductList () {
      const lostGoodsIdsSet = new Set(this.lostGoodsIds)
      const goodsIds = this.goods_ids.split(/[\s\n]/).filter(item => item).map(item => item.trim())
      const goodsIdsSet = [...new Set(goodsIds)]
      const unionSets = goodsIdsSet.filter(item => !lostGoodsIdsSet.has(item))
      await this.fetchProductList({
        filters: {
          goods_ids: unionSets.length ? unionSets : ''
        },
        editData: this.getEditData()
      })
      this.visible = true
    },
    // 当按商品选择时 预览
    async previewProductList () {
      if (!this.hasSelectIds) {
        this.$message.error('请选择需要修改的商品')
      } else {
        this.visible = true
      }
    },
    // 选择修改的商品
    chooseProductList () {
      this.toggleVisibleSelectProduct()
      this.$refs.TableSelectProduct && this.$refs.TableSelectProduct.getData()
    },
    toggleVisibleSelectProduct () {
      this.visibleSelectProduct = !this.visibleSelectProduct
    },
    async previewTableSelectProduct (ids, needPreview) {
      this.hasSelectIds = ids.length
      if (!needPreview) return
      await this.fetchProductList({
        filters: {
          goods_ids: ids
        },
        editData: this.getEditData()
      })
    }
  }

}
</script>

<style lang='less' scoped>
//@import url(); 引入公共css类
@import '~./index.less';
.dropdown {
  height: 32px;
  line-height: 32px;
  font-size: 12px;
}
</style>

<style>
  .batch-edit-custom-message {
    width: 900px;
  }

  .batch-edit-custom-message-btn {
    width: 120px;
    height: 40px;
    font-size: 14px;
  }

</style>

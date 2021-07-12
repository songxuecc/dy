<!-- 批量修改 -->
<template>
    <div class="batchEdit">

        <title class="flex title ">
            <div v-for="(icon,index) in iconList" :key="index" :class="[icon.index === editType ? 'iconBoxActive':'iconBox' , 'center','pointer' , 'relative']" @click="toggleEditType(icon.index)">
            <hh-icon :type="icon.index === editType ? icon.primary :icon.info" class="icon"></hh-icon>
            <hh-icon type="iconhot3" class="hot" v-if="index === 0"></hh-icon>
            <p class="font-12 color-4e yaHei">{{ icon.text }}</p> </div>
        </title>

        <div class=" left font-16 poniter " style="margin-top:20px;padding: 8px 16px;background-color: #f0f9eb;color: #67c23a;" >
          <span @click="examineEditRecord" @mouseenter="toggleEditRecordTip" @mouseleave="toggleEditRecordTip" style="font-weight: 700;text-decoration:underline;" class="pointer">
            <hh-icon type="icontishi-copy" ></hh-icon>点击查看修改记录
            <EditRecordTip v-show="showEditRecordTip" />
          </span>
        </div>
        <el-alert type="success" class="mt-10" :title="`有${jobs.length}组任务正在进行中...`" :closable="false" v-if="jobs.length"></el-alert>

        <div v-if="editType !== 999">
            <div class="content left" >
                <div style="min-height:120px;margin-top: 30px;">
                  <h1>修改范围<span class="right click" style="margin-left:30px;font-weight: 400" v-hh-open="'https://www.yuque.com/huxiao-rkndm/ksui6u/qyqwt0'"><hh-icon type="icontishi" ></hh-icon>点我查看教程视频</span></h1>
                  <div style="margin-top: -10px;"><span style="color: red">*</span><span style="color: #999999; font-size: 10px;">批量操作前请先点击软件右上角，同步后台商品按钮，商品同步完成后在进行下一步批量操作</span></div>
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
                    <el-button type="primary " class="w-120" @click="chooseProductList">选择修改商品</el-button> <span class="yaHei ml-10">已选 <span class="color-danger">{{selectIds.length}}</span> 个商品</span>
                    </div>
                    <div class="flex align-c" v-show="modifyMethods === 'id'">
                    <span class="color-4e yaHei font-12 mr-10">输入商品ID</span>
                    <el-input
                        type="textarea"
                        autosize
                        placeholder="输入多个商品ID,以换行分隔，最多可输入5000个"
                        v-model="goods_ids"
                        style="flex:1;margin-right:100px">
                    </el-input>
                    </div>
                </div>

                <h1 class="mt-30" >修改内容</h1>
                <Shelves ref="Shelves" v-if="editType === 1"/>
                <TableShelves ref="TableShelves"  />
                <Title ref="Title" v-if="editType === 2"/>
                <TableTitle ref="TableTitle"  />
                <Stocks ref="Stocks" v-if="editType === 3"/>
                <TableStock ref="TableStock" />
                <Price ref="Price" v-if="editType === 4"/>
                <TablePrice ref="TablePrice" />
                <DeliverMode ref="DeliverMode" v-if="editType === 5"/>
                <TableDeliverMode ref="TableDeliverMode" />
                <FareTemplate ref="FareTemplate" v-if="editType === 6"/>
                <TableFareTemplate ref="TableFareTemplate" />
                <ConsumerHotline ref="ConsumerHotline" v-if="editType === 7"/>
                <TableConsumerHotline ref="TableConsumerHotline" />
                <CountMethod ref="CountMethod" v-if="editType === 8"/>
                <TableCountMethod ref="TableCountMethod" />
                <ProductDelete ref="ProductDelete" v-if="editType === 9"/>
                <TableProductDelete ref="TableProductDelete" />

          </div>
          <div class="flex justify-c mt-20">
              <el-button type="primary" class="w-120" @click="preview" :loading="loading">效果修改预览</el-button>
          </div>
        </div>
        <TableRecord
          v-if="editType === 999"
          class="mt-10"/>
        <ModalIdSearch
          :ids="lostGoodsIds"
          ref="ModalIdSearch"
          @continueIdProductList="continueIdProductList"/>
        <TableSelectProduct
          ref="TableSelectProduct"
          @preview="previewTableSelectProduct" />

    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import common from '@/common/common.js'
import Api from '@/api/apis'
import debounce from 'lodash/debounce'

import Title from '@productsManagement/batchEdit/components/Title'
import Shelves from '@productsManagement/batchEdit/components/Shelves'
import DeliverMode from '@productsManagement/batchEdit/components/DeliverMode'
import Stocks from '@productsManagement/batchEdit/components/Stocks'
import Price from '@productsManagement/batchEdit/components/Price'
import FareTemplate from '@productsManagement/batchEdit/components/FareTemplate'
import ConsumerHotline from '@productsManagement/batchEdit/components/ConsumerHotline'
import CountMethod from '@productsManagement/batchEdit/components/CountMethod'
import ProductDelete from '@productsManagement/batchEdit/components/ProductDelete'

import TablePrice from '@productsManagement/batchEdit/components/TablePrice'
import TableShelves from '@productsManagement/batchEdit/components/TableShelves'
import TableSelectProduct from '@productsManagement/batchEdit/components/TableSelectProduct'
import ModalIdSearch from '@productsManagement/batchEdit/components/ModalIdSearch'
import EditRecordTip from '@productsManagement/batchEdit/components/EditRecordTip'
import TableTitle from '@productsManagement/batchEdit/components/TableTitle'
import TableRecord from '@productsManagement/batchEdit/components/TableRecord'
import TableStock from '@productsManagement/batchEdit/components/TableStock'
import TableDeliverMode from '@productsManagement/batchEdit/components/TableDeliverMode'
import TableFareTemplate from '@productsManagement/batchEdit/components/TableFareTemplate'
import TableConsumerHotline from '@productsManagement/batchEdit/components/TableConsumerHotline'
import TableCountMethod from '@productsManagement/batchEdit/components/TableCountMethod'
import TableProductDelete from '@productsManagement/batchEdit/components/TableProductDelete'

export default {
  components: {
    Title,
    Shelves,
    DeliverMode,
    Stocks,
    ConsumerHotline,
    FareTemplate,
    CountMethod,
    ProductDelete,
    Price,
    TablePrice,
    TableShelves,
    ModalIdSearch,
    TableSelectProduct,
    EditRecordTip,
    TableTitle,
    TableRecord,
    TableStock,
    TableDeliverMode,
    TableFareTemplate,
    TableConsumerHotline,
    TableCountMethod,
    TableProductDelete
  },
  beforeRouteLeave (to, from, next) {
    this.save({
      stopGetperprogress: true,
      getperprogressTimer: null
    })
    next()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.save({
        stopGetperprogress: false
      })
      vm.getperprogress && vm.getperprogress()
    })
  },
  data () {
    return {
      showEditRecordTip: false,
      editType: 1,
      modifyMethods: 'area',
      loading: false,
      lostGoodsIds: undefined,
      selectIds: [],
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
          index: 1,
          text: '上下架',
          ref: 'Shelves',
          tableRef: 'TableShelves',
          needExpand: false
        },
        {
          primary: 'iconbiaotixuanzhong',
          info: 'iconbiaotiweixuanzhong',
          index: 2,
          text: '标题',
          ref: 'Title',
          tableRef: 'TableTitle',
          needExpand: false
        },
        {
          primary: 'iconkucunxuanzhong',
          info: 'iconkucunweixuanzhong',
          index: 3,
          text: '库存',
          ref: 'Stocks',
          tableRef: 'TableStock',
          needExpand: true
        },
        {
          primary: 'iconjiagexuanzhong',
          info: 'iconjiageweixuanzhong',
          index: 4,
          text: '价格',
          ref: 'Price',
          tableRef: 'TablePrice',
          needExpand: true
        },
        {
          primary: 'iconfahuomoshixuanzhong',
          info: 'iconfahuomoshiweixuanzhong',
          index: 5,
          text: '发货模式',
          ref: 'DeliverMode',
          tableRef: 'TableDeliverMode',
          needExpand: false
        },
        {
          primary: 'icongaiyunfeimoban',
          info: 'icongaiyunfeimobanweixuanzhong',
          index: 6,
          text: '运费模版',
          ref: 'FareTemplate',
          tableRef: 'TableFareTemplate',
          needExpand: false
        },
        {
          primary: 'icongaikefudianhua',
          info: 'icongaikefudianhuaweixuanzhong',
          index: 7,
          text: '客服电话',
          ref: 'ConsumerHotline',
          tableRef: 'TableConsumerHotline',
          needExpand: false
        },
        {
          primary: 'icongaidingdanjishufangshi',
          info: 'icongaidingdanjishufangshiweixuanzhong',
          index: 8,
          text: '计数方式',
          ref: 'CountMethod',
          tableRef: 'TableCountMethod',
          needExpand: false
        },
        {
          primary: 'iconshanchuxuanzhong',
          info: 'iconshanchuweixuanzhong',
          index: 9,
          text: '删除',
          ref: 'ProductDelete',
          tableRef: 'TableProductDelete',
          needExpand: false
        }
      ],
      visibleSelectProduct: false
    }
  },
  computed: {
    ...mapState('productManagement/batchEdit', ['jobs', 'clearSelectId']),
    statusOptions () {
      const options = []
      Object.entries(common.dyProductStatusMap).forEach(([value, label]) => {
        if (!['封禁中'].includes(label)) {
          options.push({ value, label })
        }
      })
      return options
    }
  },
  watch: {
    jobs (n, old) {
      if (old.length && !n.length) this.selectIds = []
    },
    clearSelectId (n, o) {
      if (n !== o) {
        this.form = {
          status: '-',
          presell_type: -1,
          captureStatus: -1
        }
        this.selectIds = []
        this.goods_ids = ''
      }
    }
  },
  created () {
    if (this.editType === 999) {
      this.fetchHhTaskPage()
    }
  },
  mounted () {},
  updated () {},
  methods: {
    ...mapActions('productManagement/batchEdit', [
      'setFilterHhTaskProductOverview',
      'fetchHhTaskPage',
      'getperprogress'
    ]),
    ...mapMutations('productManagement/batchEdit', ['save']),
    // 事件名称
    toggleEditType (index) {
      this.editType = index
    },
    examineEditRecord: debounce(function () {
      this.editType = 999
      this.fetchHhTaskPage()
    }, 2000, {
      leading: true,
      trailing: false
    }),
    getEditJson () {
      const refName = this.iconList[this.editType - 1].ref
      const json = this.$refs[refName] && this.$refs[refName].getForm()
      return json
    },
    preview (index) {
      if (this.modifyMethods === 'area') {
        this.selectIds = []
        this.areaProductList()
      } else if (this.modifyMethods === 'id') {
        this.selectIds = []
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

      const extJson = this.getEditJson()
      if (!extJson) {
        this.loading = false
        return false
      }

      let filters = {
        task_type: 1,
        task_sub_type: this.editType,
        status: status,
        check_status: checkStatus,
        is_capture: this.form.captureStatus,
        presell_type: this.form.presell_type,
        goods_id_list: JSON.stringify([]),
        ext_json: JSON.stringify(this.getEditJson())
      }

      await this.setFilterHhTaskProductOverview({
        filters
      })
      this.save({previewDeleteGoodsIds: []})
      this.loading = false
      const tableRefName = this.iconList[this.editType - 1].tableRef
      this.$refs[tableRefName] && this.$refs[tableRefName].openVisible()
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
        this.loading = true

        const extJson = this.getEditJson()
        if (!extJson) {
          this.loading = false
          return false
        }

        let filters = {
          task_type: 1,
          task_sub_type: this.editType,
          goods_id_list: JSON.stringify(goodsIdsSet.length ? goodsIdsSet : ''),
          ext_json: JSON.stringify(this.getEditJson())
        }
        await this.setFilterHhTaskProductOverview({
          filters,
          pagination: {
            page_index: 1
          }
        })
        this.save({previewDeleteGoodsIds: []})
        this.loading = false
        const tableRefName = this.iconList[this.editType - 1].tableRef
        this.$refs[tableRefName] && this.$refs[tableRefName].openVisible()
      }
    },
    async continueIdProductList () {
      this.loading = true
      const lostGoodsIdsSet = new Set(this.lostGoodsIds)
      const goodsIds = this.goods_ids.split(/[\s\n]/).filter(item => item).map(item => item.trim())
      const goodsIdsSet = [...new Set(goodsIds)]
      const unionSets = goodsIdsSet.filter(item => !lostGoodsIdsSet.has(item))

      const extJson = this.getEditJson()
      if (!extJson) {
        this.loading = false
        return false
      }

      let filters = {
        task_type: 1,
        task_sub_type: this.editType,
        goods_id_list: JSON.stringify(unionSets.length ? unionSets : ''),
        ext_json: JSON.stringify(this.getEditJson())
      }
      await this.setFilterHhTaskProductOverview({
        filters
      })
      this.save({previewDeleteGoodsIds: []})
      this.loading = false
      const tableRefName = this.iconList[this.editType - 1].tableRef
      this.$refs[tableRefName] && this.$refs[tableRefName].openVisible()
    },
    // 当按商品选择时 预览
    async previewProductList () {
      if (!this.selectIds.length) {
        this.$message.error('请选择需要修改的商品')
      } else {
        this.visible = true
        this.loading = true
        const extJson = this.getEditJson()
        if (!extJson) {
          this.loading = false
          return false
        }

        let filters = {
          task_type: 1,
          task_sub_type: this.editType,
          goods_id_list: JSON.stringify(this.selectIds),
          ext_json: JSON.stringify(this.getEditJson())
        }

        await this.setFilterHhTaskProductOverview({
          filters,
          pagination: {
            page_index: 1
          }
        })
        this.save({previewDeleteGoodsIds: []})
        this.loading = false
        const tableRefName = this.iconList[this.editType - 1].tableRef
        this.$refs[tableRefName] && this.$refs[tableRefName].openVisible()
      }
    },
    // 选择修改的商品
    chooseProductList () {
      this.$refs.TableSelectProduct && this.$refs.TableSelectProduct.open()
    },
    async previewTableSelectProduct (ids, needPreview) {
      this.selectIds = ids
    },
    deleteSelectProduct (id) {
      if (this.selectIds.length) return false
      this.selectIds = this.selectIds.filter(item => item !== id)
    },
    toggleEditRecordTip () {
      this.showEditRecordTip = !this.showEditRecordTip
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

.hot {
    position: absolute;
    font-size: 39px;
    color: #FA6400;
    right: -1px;
    top: -2px;
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

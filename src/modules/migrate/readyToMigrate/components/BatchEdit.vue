<template>
  <div style="margin: 8px 0">
    <el-row type="flex" justify="start">
      <el-col style="text-align: left" class="flex justify-b ">
          <div class="flex">
            <div
                class="relative mr-10"
                v-for="item in dropdownOptions"
                :key="item.value">
              <el-button
                size="mini"
                class="left"
                :style="item.props.style"
                :type="item.props.type"
                :plain="item.props.plain"
                @click="handleClick(item.value,item.key)">
                {{item.label}}
              </el-button>
              <span v-if="item.numberKey ? (selecEditList && selecEditList.length) : (selectDeleteList && selectDeleteList.length)" class="badge bold">{{item.numberKey ? selecEditList.length : selectDeleteList.length}}</span>
            </div>
          </div>
          <RefershCategoryBtn style="align-content:flex-end"/>
      </el-col>
    </el-row>
    <EditTitle :visible.sync="visibleEditTitle" v-if="visibleEditTitle" @batchUpdate="batchUpdate" :loading="loading"
      :percentage="percentage" @onShutdown="onShutdown" :shutdown="shutdown" />
    <EditBrandId :visible.sync="visvileEditBrandId" v-if="visvileEditBrandId" @updateBrands="updateBrands"
      :loading="loading" :percentage="percentage" @onShutdown="onShutdown" :shutdown="shutdown" />
    <EditDelteRecord :visible.sync="visibleEditDelteRecord" v-if="visibleEditDelteRecord" @deleteRecord="deleteRecord"
      :loading="loading" :percentage="percentage" @onShutdown="onShutdown" :shutdown="shutdown" />
    <EditDeleteCarousel :visible.sync="visibleEditDeleteCarousel" v-if="visibleEditDeleteCarousel"
      @batchUpdate="batchUpdate" :loading="loading" :percentage="percentage" @onShutdown="onShutdown"
      :shutdown="shutdown" />
    <EditDelteDetailImage :visible.sync="visibleEditDelteDetailImage" v-if="visibleEditDelteDetailImage"
      @batchUpdate="batchUpdate" :loading="loading" :percentage="percentage" @onShutdown="onShutdown"
      :shutdown="shutdown" />

    <EditProperties :visible.sync="visibleProperties" v-if="visibleProperties" />

    <!-- 修改分类 -->
    <el-dialog class="dialog-tight" title="批量修改本页分类" width="800px" center :visible.sync="visvileCategory" v-hh-modal v-if="visvileCategory"
      :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <categorySelectView ref="categorySelectView" @changeCate="onChangeCate" >
        <template slot="footer">
          <div class="mt-10 mb-20">
            <div class="mb-10 flex justify-c" v-if="loading">
              <el-progress :percentage="percentage" :format="format"></el-progress>
            </div>
            <div class="flex justify-c">
              <el-button style="width:120px" @click="closeVisvileCategory" v-if="!loading" class="mt-10">取消</el-button>
              <el-button type="primary" style="width:120px" @click="confirmCategorySelectView " v-if="!loading" class="mt-10">确定</el-button>
              <div v-if="loading" class="flex column justify-c align-c ">
                <el-button @click="shutdownVisvileCategory" :loading="shutdown">更新中，点击中止操作</el-button>
                <div class="pl-10 info" style="margin-top:5px">已经更新的数据无法撤回</div>
              </div>
            </div>
          </div>
        </template>
      </categorySelectView>
    </el-dialog>
  </div>
</template>

<script>
import Api from '@/api/apis'
import skuHandler from '@/mixins/skuHandler.js'
import { productStatus } from '@/common/common'
import utils from '@/common/utils'

import categorySelectView from '@/components/CategorySelectView'
import RefershCategoryBtn from '@/components/RefershCategoryBtn'

import EditDelteRecord from '@migrate/readyToMigrate/components/EditDelteRecord'
import EditTitle from '@migrate/readyToMigrate/components/EditTitle'
import EditBrandId from '@migrate/readyToMigrate/components/EditBrandId'
import EditDeleteCarousel from '@migrate/readyToMigrate/components/EditDeleteCarousel'
import EditDelteDetailImage from '@migrate/readyToMigrate/components/EditDelteDetailImage'
import EditProperties from '@migrate/readyToMigrate/components/EditProperties'

export default {
  name: 'BatchEdit',
  mixins: [skuHandler],
  props: {
    pageSize: String,
    selectIdBatchEditList: Array,
    onSizeChange: Object,
    tpProductList: Array,
    reload: Object,
    isShopCapture: Boolean
  },
  components: {
    categorySelectView,
    EditDelteRecord,
    EditBrandId,
    EditTitle,
    EditDeleteCarousel,
    EditDelteDetailImage,
    EditProperties,
    RefershCategoryBtn
  },
  data () {
    return {
      activeIndex: 0,
      loading: false,
      options: [
        {
          value: 10,
          label: '10条/页'
        },
        {
          value: 20,
          label: '20条/页'
        },
        {
          value: 50,
          label: '50条/页'
        },
        {
          value: 100,
          label: '100条/页'
        }
      ],
      dropdownOptions: [
        {
          value: 0,
          label: '批量修改分类',
          key: 'visvileCategory',
          numberKey: true,
          props: {
            type: 'primary',
            style: 'text-align:center;width:110px'
          }
        },
        {
          value: 2,
          label: '批量修改属性',
          key: 'visibleProperties',
          numberKey: true,
          props: {
            type: 'primary',
            style: 'text-align:center;width:110px'
          }
        },
        {
          value: 1,
          label: '批量修改标题',
          key: 'visibleEditTitle',
          numberKey: true,
          props: {
            type: 'primary',
            style: 'text-align:center;width:110px'
          }
        },
        {
          value: 3,
          label: '批量删除轮播首图',
          key: 'visibleEditDeleteCarousel',
          numberKey: true,
          props: {
            type: 'primary',
            plain: true,
            style: 'text-align:center;width:130px'
          }
        },
        {
          value: 4,
          label: '批量删除详情尾图',
          key: 'visibleEditDelteDetailImage',
          numberKey: true,
          props: {
            type: 'primary',
            plain: true,
            style: 'text-align:center;width:130px'
          }
        },
        {
          value: 5,
          label: '批量删除记录',
          key: 'visibleEditDelteRecord',
          numberKey: false,
          props: {
            type: '',
            plain: true,
            style: 'text-align:center;width:110px'
          }
        },
        {
          value: 6,
          label: '批量重试复制',
          key: 'visibleEditDelteRecord',
          numberKey: false,
          props: {
            type: '',
            plain: true,
            style: 'text-align:center;width:110px'
          }
        }
      ],
      percentage: 0,
      shutdown: false,
      value: this.pageSize,
      visibleEditTitle: false,
      visibleEditDelteRecord: false,
      visibleEditDelteDetailImage: false,
      visibleProperties: false,
      visibleEditDeleteCarousel: false,
      visvileEditBrandId: false,
      visvileCategory: false,
      canEditStatus: [
        productStatus.WAIT_ONLINE,
        productStatus.REJECT,
        productStatus.FAILED,
        productStatus.WAIT_MODIFY,
        productStatus.SAVE_DRAFT,
        productStatus.ONLINE
      ],
      canDeleteStatus: [
        productStatus.WAIT_ONLINE,
        productStatus.WAIT_MIGRATE,
        productStatus.MIGRATING,
        productStatus.SAVE_DRAFT,
        productStatus.ONLINE,
        productStatus.FAILED,
        productStatus.WAIT_MODIFY,
        productStatus.CAPTURE_FAILED,
        productStatus.REJECT,
        productStatus.DY_APPROVING,
        productStatus.DELETED
      ]
    }
  },
  watch: {
    pageSize: function (newVal) {
      this.value = newVal
    }
  },
  computed: {
    selectDeleteList () {
      return this.tpProductList.filter(item => {
        return this.selectIdBatchEditList.includes(`${item.tp_product_id}`) && this.canDeleteStatus.includes(item.status)
      })
    },
    selecEditList () {
      return this.tpProductList.filter(item => {
        return this.selectIdBatchEditList.includes(`${item.tp_product_id}`) && this.canEditStatus.includes(item.status)
      })
    }
  },
  methods: {
    onChange (value) {
      this.$emit('onSizeChange', value)
    },
    handleClick (index, key) {
      this.activeIndex = index
      this[key] = !this[key]
    },
    handleCommand (command) {
      this.activeIndex = command
      const key = this.dropdownOptions[command || 0].key
      this[key] = !this[key]
    },
    handleClose (key) {
      this[key] = false
    },
    formatTitle (model, title) {
      if (!model) return title
      if (model.textPrefix) {
        title = `${model.textPrefix}${title}`
      }

      if (model.textSuffix) {
        title = `${title}${model.textSuffix}`
      }

      if (model.textReplaceOrigin && model.textReplaceNew) {
        let replaceStr = utils.transferRegStr(model.textReplaceOrigin)
        title = title.replace(new RegExp(replaceStr, 'g'), model.textReplaceNew)
      }

      if (model.textDelete) {
        let replaceStr = utils.transferRegStr(model.textDelete)
        title = title.replace(new RegExp(replaceStr, 'g'), '')
      }

      if (model.radio === 6) {
        title = title.substring(0, 30)
      }

      if (model.cut_type_list.includes('is_cut_digit')) {
        const reg = /[a-zA-Z]+/g
        title = title.replace(reg, '')
      }

      if (model.cut_type_list.includes('is_cut_alpha')) {
        const reg = /[0-9]+/g
        title = title.replace(reg, '')
      }

      if (model.cut_type_list.includes('is_cut_brackets')) {
        const reg = /\(.*?\)|\[.*?\]|\{.*?\}|\（.*?\）|\【.*?\】|\「.*?\」|\｛.*?\｝/g
        title = title.replace(reg, '')
      }

      if (model.radio === 3) {
        title = title.split('').reverse().slice(0, 30).reverse().join('')
      }

      return title.replace(/\s+/g, '')
    },
    polling (fn, succeesCallback, failCallback, step = 5) {
      let previous = 0
      let length = 0
      const vm = this
      let result = []
      return function () {
        var _this = this // 取debounce执行作用域的this
        var list = [...arguments][0]
        length = list.length
        let current = Math.min(previous + step, length)

        function promiseFn () {
          return new Promise(async (resolve, reject) => {
            try {
              const sliceList = list.slice(previous, current)
              const data = await fn.call(_this, sliceList)
              previous = current
              current = Math.min(previous + step, length)
              resolve(data)
            } catch (err) {
              reject(err)
            }
          })
        }

        const resultFn = () => promiseFn().then(data => {
          result = result.concat(data)
          if (vm.shutdown) {
            succeesCallback && succeesCallback(result)
            return false
          }
          const percentage = Math.floor(previous / length * 100)
          vm.percentage = percentage
          if (previous < length) {
            resultFn()
          } else {
            // 满足到达100%进度条的动画
            setTimeout(() => {
              succeesCallback && succeesCallback(result)
            }, 500)
          }
        }).catch(error => {
          if (error) {
            console.log(error)
          }
          current = length

          failCallback && failCallback(error)
        })

        resultFn()
      }
    },
    onShutdown () {
      this.shutdown = true
    },
    // 批量修改  移除轮播图首图 移除详情图尾图  标题
    async batchUpdate (options) {
      const carousel = options.carousel || false
      const detailImage = options.detailImage || false
      const title = options.title
      const list = this.selecEditList
        .map(item => {
          return ({
            tp_product_id: item.tp_product_id,
            category_id: item.category_id,
            title: this.formatTitle(title, item.title),
            tp_outer_iid: '',
            price: null,
            tp_property_json: {
              'remove_first_banner': carousel,
              'remove_last_desc': detailImage
            }
          })
        })
      if (!list.length) {
        return this.$message({
          message: '只可选择待上线、驳回、失败、待修改、保存到草稿箱、已上线的商品，请选择正确状态的商品进行批量修改',
          type: 'error',
          duration: 5000
        })
      }
      const fn = async (list) => {
        const data = await Api.hhgjAPIs.batchUpdateTPProduct({
          tp_product_list: JSON.stringify(list)
        })
        return data
      }
      this.loading = true
      this.polling(
        fn,
        () => {
          this.$message.success(!this.shutdown ? '更新成功' : '中止成功')
          this.visibleEditTitle = false
          this.visibleEditDelteDetailImage = false
          this.visibleEditDeleteCarousel = false
          this.loading = false
          this.percentage = 0
          this.shutdown = false
          this.activeIndex = 0
          this.$emit('reload')
        },
        (error) => {
          this.$message.error(`${error || error.message}`)
          this.visibleEditTitle = false
          this.visibleEditDelteDetailImage = false
          this.visibleEditDeleteCarousel = false
          this.loading = false
          this.percentage = 0
          this.shutdown = false
          this.activeIndex = 0
          this.$emit('reload')
        }
      )(list)
    },
    // 修改品牌
    async updateBrands (id) {
      const list = this.selecEditList
        .map(item => item.tp_product_id)
      if (!list.length) {
        return this.$message({
          message: '只可选择待上线、驳回、失败、待修改、保存到草稿箱、已上线的商品，请选择正确状态的商品进行批量修改',
          type: 'error',
          duration: 5000
        })
      }
      const fn = async (list) => {
        const data = await Api.hhgjAPIs.updateTpproductBrand({
          tp_product_id_list: JSON.stringify(list),
          brand_id: id
        })
        return data
      }
      this.loading = true
      this.polling(
        fn,
        (data) => {
          const successLists = data.filter(item => item.is_brand_update)
          const message = !this.shutdown && successLists.length === list.length ? '修改成功' : `成功数${successLists.length},失败数${list.length - successLists.length},失败可能原因是商品未填写类目或该类目不在品牌授权范围内`
          this.$message({
            message: !this.shutdown
              ? message
              : '中止成功',
            type: 'success',
            duration: 5000
          })
          this.visvileEditBrandId = false
          this.loading = false
          this.percentage = 0
          this.shutdown = false
          this.activeIndex = 0
          this.$emit('reload')
        },
        (error) => {
          this.$message.error(`${error || error.message}`)
          this.visvileEditBrandId = false
          this.loading = false
          this.percentage = 0
          this.shutdown = false
          this.activeIndex = 0
          this.$emit('reload')
        }
      )(list)
    },
    // 批量删除
    async deleteRecord () {
      if (!this.selectDeleteList.length) {
        return this.$message.error('请选择要批量删除的商品')
      }
      const list = this.selectDeleteList
        .map(item => item.tp_product_id)
      const fn = async (list) => {
        const data = await Api.hhgjAPIs.deleteTPProduct({
          tp_product_ids: list
        })
        return data
      }
      this.loading = true
      this.polling(
        fn,
        (data) => {
          this.$message.success(!this.shutdown
            ? `删除成功`
            : '中止成功')
          this.visibleEditDelteRecord = false
          this.loading = false
          this.percentage = 0
          this.shutdown = false
          this.activeIndex = 0
          this.$emit('reload')
        },
        (error) => {
          this.$message.error(`${error || error.message}`)
          this.visibleEditDelteRecord = false
          this.loading = false
          this.percentage = 0
          this.shutdown = false
          this.activeIndex = 0
          this.$emit('reload')
        }
      )(list)
    },
    closeVisvileCategory () {
      this.visvileCategory = false
    },
    shutdownVisvileCategory () {
      this.shutdown = true
    },
    confirmCategorySelectView () {
      this.$refs.categorySelectView.confirm()
    },
    // 批量修改分类
    async onChangeCate (category) {
      if (!this.selecEditList.length) {
        return this.$message({
          message: '只可选择待上线、驳回、失败、待修改、保存到草稿箱、已上线的商品，请选择正确状态的商品进行批量修改',
          type: 'error',
          duration: 5000
        })
      }
      if (!category || (category && !category.id)) {
        return this.$message.error('请选择分类')
      }
      const list = this.selecEditList
        .map(item => item.tp_product_id)
      const fn = async (list) => {
        const data = await Api.hhgjAPIs.batchUpdateCategory({
          tp_product_ids: list,
          cid: category.id
        })
        return data
      }
      this.loading = true
      this.polling(
        fn,
        () => {
          this.$message.success(!this.shutdown ? '更新成功' : '中止成功')
          this.visvileCategory = false
          this.loading = false
          this.percentage = 0
          this.shutdown = false
          this.activeIndex = 0
          this.$emit('reload')
        },
        (error) => {
          this.$message.error(`${error || error.message}`)
          this.visvileCategory = false
          this.loading = false
          this.percentage = 0
          this.shutdown = false
          this.activeIndex = 0
          this.$emit('reload')
        }
      )(list)
    },
    format (percentage) {
      return `已完成${percentage}%`
    }

  }
}
</script>
<style lang="less" scoped>
  .badge {
    background-color: #E6A23C;
    border-radius: 50%;
    color: #FFF;
    display: inline-block;
    font-size: 12px;
    height: 12px;
    line-height: 12px;
    padding: 2px 2px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid #FFF;
  }
  /deep/ .el-button--mini, .el-button--mini.is-round {
    padding: 0 8px;
    height: 28px;
  }

  /deep/ .el-dialog {
    .el-dialog__header {
      padding-top: 30px;
      margin-bottom:20px;
      font-weight:bold;
      .el-dialog__title {
        font-size:22px;
      }
    }
    .el-dialog__headerbtn {
      .el-dialog__close {
        position: absolute;
        top: 10px;
        right: 20px;
        height: 24px;
        width: 24px;
        line-height: 24px;
        font-size: 17px;
        border-radius: 50%;
        color: #fff;
        background: #d4d4d4;
        text-align: center;
        font-weight: bolder;
        z-index: 1999;
      }
      &:focus .el-dialog__close,
      &:hover .el-dialog__close {
        color: #fff;
      }
    }
    .el-dialog__body {
      padding-top: 0;
    }
  }
  /deep/ .el-dialog {
    border-radius: 10px;
  }
  /deep/ .el-progress-bar {
    // width: 80%;
    margin-right: -80px;
    padding-right: 80px;
  }
  /deep/ .el-progress__text{
    color:#999999;
    font-size:12px !important;
    margin-left: 0;
    padding-left:10px;
    box-sizing:border-box
  }
  /deep/ .el-progress{
    width:100%;
    display: flex;
    justify-content: center;
    margin-top:20px;
    align-items: center;
  }

  .badge{
    position:absolute;
    right:-10px;
    top:-10px;
    font-size:12px;
    transform:scale(0.7);
    background:#dc4041;
    border-radius:10px;
    height:20px;
    min-width:20px;
    box-sizing:border-box;
    line-height:16px;
    padding:2px 4px;
    color:#fff
  }
</style>

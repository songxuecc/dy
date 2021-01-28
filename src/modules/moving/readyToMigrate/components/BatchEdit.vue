<template>
  <div style="margin: 10px 0">
    <el-row type="flex" justify="start" style="margin-bottom: 4px">
      <el-col style="text-align: left">
        <el-dropdown @command="handleCommand">
          <el-button type="primary" size="mini">
            更多操作 <el-badge v-if="tpProductList.length" :value="tpProductList.length"></el-badge><i
              class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in dropdownOptions" :key="item.value" style="width:100px"
              :command="item.value" :style="{color: activeIndex === item.value ? 'black' : 'gray'}">
              {{item.label}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span style="margin-left: 10px; font-size: 12px">每页商品数
          <el-select v-model="value" placeholder="请选择" size="mini" style="width: 100px" @change="onChange">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </span>
      </el-col>
    </el-row>
    <div class="info left">注：批量修改本页勾选产品</div>
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
    <!-- 修改分类 -->
    <el-dialog class="dialog-tight" title="批量修改本页分类" width="800px" center :visible.sync="visvileCategory" v-hh-modal
      :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <categorySelectView ref="categorySelectView">
        <template slot="footer">
          <div class="mt-10 mb-20">
            <div class="mb-10 flex justify-c" v-if="loading">
              <el-progress :percentage="percentage" :format="format"></el-progress>
            </div>
            <div class="flex justify-c">
              <el-button style="width:120px" @click="closeVisvileCategory" v-if="!loading">取消</el-button>
              <el-button type="primary" style="width:120px" @click="onChangeCate" v-if="!loading">确定</el-button>
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
import categorySelectView from '@/components/CategorySelectView'
import EditDelteRecord from './EditDelteRecord'
import EditTitle from './EditTitle'
import EditBrandId from './EditBrandId'
import EditDeleteCarousel from './EditDeleteCarousel'
import EditDelteDetailImage from './EditDelteDetailImage'
import skuHandler from '@/mixins/skuHandler.js'
import { productStatus } from '@/common/common'

export default {
  inject: ['reload'],
  name: 'BatchEdit',
  mixins: [skuHandler],
  props: {
    pageSize: String,
    selections: Array,
    onSizeChange: Object,
    tpProductList: Array
  },
  components: {
    EditDelteRecord,
    EditBrandId,
    EditTitle,
    EditDeleteCarousel,
    EditDelteDetailImage,
    categorySelectView
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
          label: '修改分类',
          key: 'visvileCategory'
        },
        {
          value: 1,
          label: '修改标题',
          key: 'visibleEditTitle'
        },
        {
          value: 2,
          label: '修改品牌',
          key: 'visvileEditBrandId'
        },
        {
          value: 3,
          label: '删除轮播首图',
          key: 'visibleEditDeleteCarousel'
        },
        {
          value: 4,
          label: '删除详情尾图',
          key: 'visibleEditDelteDetailImage'
        },
        {
          value: 5,
          label: '删除记录',
          key: 'visibleEditDelteRecord'
        }
      ],
      percentage: 0,
      shutdown: false,
      value: this.pageSize,
      visibleEditTitle: false,
      visibleEditDelteRecord: false,
      visibleEditDelteDetailImage: false,
      visibleEditDeleteCarousel: false,
      visvileEditBrandId: false,
      visvileCategory: false,
      canEditStatus: [productStatus.WAIT_ONLINE, productStatus.SAVE_DRAFT, productStatus.ONLINE, productStatus.FAILED, productStatus.WAIT_MODIFY, productStatus.REJECT]
    }
  },
  watch: {
    pageSize: function (newVal) {
      this.value = newVal
    }
  },
  methods: {
    onChange (value) {
      this.$emit('onSizeChange', value)
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
        title = title.replace(model.textReplaceOrigin, model.textReplaceNew)
      }

      if (model.textDelete) {
        title = title.split(model.textDelete).join('')
      }

      if (model.radio === 6) {
        title = title.substring(0, 30)
      }

      if (model.radio === 3) {
        title = title.split('').reverse().slice(0, 30).reverse()
      }

      return title.replace(/\s+/g, '')
    },
    polling (fn, succeesCallback, step = 5) {
      let previous = 0
      let current = previous + step
      let length = 0
      const vm = this
      let result = []
      return function () {
        var _this = this // 取debounce执行作用域的this
        var list = [...arguments][0]
        length = list.length

        function promiseFn () {
          return new Promise(async (resolve, reject) => {
            try {
              const sliceList = list.slice(previous, current)
              const data = await fn.call(_this, sliceList)
              previous = current
              current = previous + step
              resolve(data)
            } catch (err) {
              reject(err)
            }
          })
        }

        const resultFn = () => promiseFn().then(data => {
          result = result.concat(data)
          if (vm.shutdown) {
            succeesCallback(result)
            return false
          }
          if (current < length) {
            resultFn()
            const percentage = Math.floor(current / length * 100)
            vm.percentage = percentage
          } else if (current >= length) {
            succeesCallback(result)
          }
        }).catch(error => {
          if (error) {
            console.log(error)
          }
          current = length
          // vm.$message.error(`${error || error.message}`)
          vm.$message.error(`更新失败，请稍后再试`)
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
      const list = this.tpProductList
        .filter(item => this.canEditStatus.includes(item.status))
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
        return this.$message.error('只可选择待上线、驳回、失败、待修改、保存到草稿箱、已上线的商品，请选择正确状态的商品进行批量修改')
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
          this.reload()
        }
      )(list)
    },
    // 修改品牌
    async updateBrands (id) {
      const list = this.tpProductList
        .filter(item => this.canEditStatus.includes(item.status))
        .map(item => item.tp_product_id)
      if (!list.length) {
        return this.$message.error('只可选择待上线、驳回、失败、待修改、保存到草稿箱、已上线的商品，请选择正确状态的商品进行批量修改')
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
          this.$message.success(!this.shutdown
            ? `成功数${successLists.length},失败数${list.length - successLists.length},失败可能原因是商品未填写类目或该类目不在品牌授权范围内`
            : '中止成功')
          this.visvileEditBrandId = false
          this.loading = false
          this.percentage = 0
          this.shutdown = false
          this.activeIndex = 0
          this.reload()
        }
      )(list)
    },
    // 批量删除
    async deleteRecord () {
      if (!this.tpProductList.length) {
        return this.$message.error('请选择要批量删除的商品')
      }
      const list = this.tpProductList
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
          this.reload()
        }
      )(list)
    },
    closeVisvileCategory () {
      this.visvileCategory = false
    },
    shutdownVisvileCategory () {
      this.shutdown = true
    },
    // 批量修改分类
    async onChangeCate (category) {
      if (!this.tpProductList.length) {
        return this.$message.error('只可选择待上线、驳回、失败、待修改、保存到草稿箱、已上线的商品，请选择正确状态的商品进行批量修改')
      }
      const list = this.tpProductList
        .filter(item => this.canEditStatus.includes(item.status))
        .map(item => {
          return ({
            tp_product_id: item.tp_product_id,
            category_id: item.category_id,
            title: item.title,
            tp_outer_iid: '',
            price: null,
            tp_property_json: {
              'remove_first_banner': false,
              'remove_last_desc': false
            }
          })
        })
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
          this.visvileCategory = false
          this.loading = false
          this.percentage = 0
          this.shutdown = false
          this.activeIndex = 0
          this.reload()
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
</style>

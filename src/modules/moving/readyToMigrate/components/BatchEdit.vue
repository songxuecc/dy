<template>
  <div style="margin: 10px 0">
    <el-row type="flex" justify="start" style="margin-bottom: 4px">
      <el-col style="text-align: left">
        <el-dropdown @command="handleCommand">
          <el-button type="primary" size="mini">
            更多操作 <span class="badge"> 10 </span><i class="el-icon-arrow-down el-icon--right"></i>
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
    <EditTitle :visible.sync="visibleEditTitle" v-if="visibleEditTitle" @batchUpdate="batchUpdate" :loading="loading" />
    <EditBrandId :visible.sync="visvileEditBrandId" v-if="visvileEditBrandId" @updateBrands="updateBrands"
      :loading="loading" />
    <EditDelteRecord :visible.sync="visibleEditDelteRecord" v-if="visibleEditDelteRecord" @deleteRecord="deleteRecord"
      :loading="loading" />
    <EditDeleteCarousel :visible.sync="visibleEditDeleteCarousel" v-if="visibleEditDeleteCarousel"
      @batchUpdate="batchUpdate" :loading="loading" />
    <EditDelteDetailImage :visible.sync="visibleEditDelteDetailImage" v-if="visibleEditDelteDetailImage"
      @batchUpdate="batchUpdate" :loading="loading"/>
    <!-- 修改分类 -->
    <el-dialog class="dialog-tight" title="批量修改本页分类" width="800px" center :visible.sync="visvileCategory" v-hh-modal>
      <categorySelectView ref="categorySelectView" @changeCate="onChangeCate">
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
      value: this.pageSize,
      visibleEditTitle: false,
      visibleEditDelteRecord: false,
      visibleEditDelteDetailImage: false,
      visibleEditDeleteCarousel: false,
      visvileEditBrandId: false,
      visvileCategory: false
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
    async batchUpdate (options) {
      const carousel = options.carousel || false
      const detailImage = options.detailImage || false
      const title = options.title
      const list = this.tpProductList
        .filter(item => [0, 3, 4, 5, 6, 8].includes(item.status))
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
      try {
        this.loading = true
        await Api.hhgjAPIs.batchUpdateTPProduct({
          tp_product_list: JSON.stringify(list)
        })
        this.$message.success('修改成功')
      } catch (err) {
        this.$message.error('修改失败，请稍后再试')
      }
      this.loading = false
      this.visibleEditTitle = false
      this.visibleEditDelteDetailImage = false
      this.visibleEditDeleteCarousel = false
      this.activeIndex = 0
      this.reload()
    },
    // 批量修改分类
    async onChangeCate (category) {
      if (!this.tpProductList.length) {
        return this.$message.error('只可选择待上线、驳回、失败、待修改、保存到草稿箱、已上线的商品，请选择正确状态的商品进行批量修改')
      }
      try {
        this.visvileCategory = false
        this.$emit('toggleLoadingCnt', 1)
        await Api.hhgjAPIs.batchUpdateCategory({
          tp_product_ids: this.selections,
          cid: category.id
        })
        this.$emit('toggleLoadingCnt', 0)
      } catch (err) {
        this.$message.error(err || err.message)
      }
      this.activeIndex = 0
      this.reload()
    },
    // 修改品牌
    async updateBrands (id) {
      const list = this.tpProductList
        .filter(item => [0, 3, 4, 5, 6, 8].includes(item.status))
        .map(item => item.tp_product_id)
      if (!list.length) {
        return this.$message.error('只可选择待上线、驳回、失败、待修改、保存到草稿箱、已上线的商品，请选择正确状态的商品进行批量修改')
      }
      try {
        this.loading = true
        const data = await Api.hhgjAPIs.updateTpproductBrand({
          tp_product_id_list: JSON.stringify(list),
          brand_id: id
        })
        const successLists = data.filter(item => item.is_brand_update)
        this.$message.success(`成功数${successLists.length},失败数${list.length - successLists.length},失败可能原因是商品未填写类目或该类目不在品牌授权范围内`)
      } catch (err) {
        console.log(err)
        this.$message.error('删除失败，请稍后再试')
      }
      this.loading = false
      this.visvileEditBrandId = false
      this.activeIndex = 0
      this.reload()
    },
    async deleteRecord () {
      if (!this.tpProductList.length) {
        return this.$message.error('请选择要批量删除的商品')
      }
      try {
        this.loading = true
        await Api.hhgjAPIs.deleteTPProduct({
          tp_product_ids: this.tpProductList
            .map(item => item.tp_product_id)
        })
        this.$message.success('删除成功')
      } catch (err) {
        console.log(err)
        this.$message.error('删除失败，请稍后再试')
      }
      this.loading = false
      this.visibleEditDelteRecord = false
      this.activeIndex = 0
      this.reload()
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
</style>

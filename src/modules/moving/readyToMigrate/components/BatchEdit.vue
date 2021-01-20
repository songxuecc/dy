<template>
  <div style="margin-bottom: 10px">
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
    <EditTitle :visible.sync="visibleEditTitle" />
    <EditBrandId :visible.sync="visvileEditBrandId" />
    <EditDelteRecord :visible.sync="visibleEditDelteRecord" />
    <EditDeleteCarousel :visible.sync="visibleEditDeleteCarousel" />
    <EditDelteDetailImage :visible.sync="visibleEditDelteDetailImage" />
    <!-- 修改分类 -->
    <el-dialog class="dialog-tight" title="批量修改本页分类" width="800px" center>
      <categorySelectView ref="categorySelectView" @changeCate="onChangeCate">
      </categorySelectView>
    </el-dialog>
  </div>
</template>

<script>
import categorySelectView from '@/components/CategorySelectView'
import EditDelteRecord from './EditDelteRecord'
import EditTitle from './EditTitle'
import EditBrandId from './EditBrandId'
import EditDeleteCarousel from './EditDeleteCarousel'
import EditDelteDetailImage from './EditDelteDetailImage'
import skuHandler from '@/mixins/skuHandler.js'

export default {
  name: 'BatchEdit',
  mixins: [skuHandler],
  props: {
    pageSize: String
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
      visibleEditTitle: true,
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
      console.log(command)
      this.activeIndex = command
      const key = this.dropdownOptions[command || 0].key
      this[key] = !this[key]
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
</style>

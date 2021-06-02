<template>
    <el-dialog
      title="选择需要导出的字段"
      :visible.sync="dialogExportVisible"
      @opened="dialogExportOpened"
      :before-close="closeDialog"
      v-hh-modal
    >
      <div v-loading="loadingCnt">
        <div>
          <el-checkbox
            v-model="isAllFieldSelected"
            @change="changeAllFieldSelected"
            >全选</el-checkbox
          >
          <el-button type="text" @click="switchFieldSelect">反选</el-button>
        </div>
        <br />
        <div style="text-align: left">
          <el-checkbox
            v-for="item in exportFieldList"
            :key="item.field"
            v-model="item.value"
            @change="checkAllFieldSelected"
            style="padding-bottom: 15px; margin: 0 15px"
          >
            {{ item.label }}
          </el-checkbox>
        </div>
        <div v-if="showDownloadFile" class="download-file">
          <div>{{ '最近生成时间：' + recentProductExcelTime }}</div>
          <el-link :key="val" type="primary" @click="onDownloadExcel()">
            {{ '商品列表.xlsx' }}
          </el-link>
        </div>
        <br />
        <div v-if="showProcess" style="text-align: center">
          <el-progress
            :text-inside="true"
            :stroke-width="14"
            :percentage="excelPercent"
            style="width: 300px; margin: auto"
          ></el-progress>
        </div>
        <el-button v-else size="small" @click="onGenProductsExcel">
          生成Excel
        </el-button>
      </div>
    </el-dialog>
</template>

<script>
import utils from '@/common/utils.js'
import request from '@/mixins/request.js'
export default {
  mixins: [request],
  props: {
    dialogExportVisible: Boolean
  },
  data () {
    return {
      isAllFieldSelected: false,
      exportFieldList: [
        { value: false, field: 'goods_id', label: '商品id' },
        { value: false, field: 'goods_url', label: '商品链接' },
        { value: false, field: 'origin_goods_url', label: '来源商品链接' },
        { value: false, field: 'goods_name', label: '商品名' },
        { value: false, field: 'goods_desc', label: '类目属性' },
        { value: false, field: 'goods_quantity', label: '商品库存' },
        { value: false, field: 'market_price', label: '划线价' },
        { value: false, field: 'discount_price', label: '售卖价' },
        { value: false, field: 'banner_image', label: '轮播图' },
        { value: false, field: 'detail_image', label: '详情图' },
        { value: false, field: 'category', label: '类目' },
        { value: false, field: 'pay_type_str', label: '支付方式' },
        { value: false, field: 'mobile', label: '客服手机' },
        { value: false, field: 'status_str', label: '商品状态' },
        { value: false, field: 'tp_outer_iid', label: '货号' },
        { value: false, field: 'presell_type', label: '发货模式' },
        { value: false, field: 'sku_id', label: 'skuid' },
        { value: false, field: 'spec_detail_names', label: 'sku规格' },
        { value: false, field: 'sku_code', label: 'sku编码' },
        { value: false, field: 'sku_quantity', label: 'sku现货或预售库存' },
        { value: false, field: 'sku_step_quantity', label: 'sku阶梯库存' },
        { value: false, field: 'sku_price', label: 'sku价格' }
      ],
      showDownloadFile: false,
      excelPercent: -1
    }
  },
  methods: {
    // openDialogExport () {
    //   this.dialogExportVisible = true
    //   // 百度统计打点
    //   if (window._hmt) {
    //     window._hmt.push(['_trackEvent', '全部商品', '点击', '商品导出'])
    //   }
    // },
    closeDialog () {
      this.$emit('update:dialogExportVisible', false)
    },
    dialogExportOpened () {
      // 查询最近一次商品导出的文件信息
      this.request('getExcelFile', {}, (data) => {
        this.showDownloadFile = true
        this.recentProductExcelTime = data['last_update_time']
      })
      this.checkAllFieldSelected()
      // 窗口打开，去查询当前导出任务的状态
      this.request(
        'genProductExcel',
        {
          goods_attr_list: JSON.stringify([]),
          is_new: 0
        },
        (data) => {
          // 如果导出状态为未开始，成功或失败，则允许用户重新导出新文件
          if (['unbegin', 'success', 'fail'].includes(data.status)) {
            if (data.status === 'success') {
              // this.$message.success('商品导出完成')
              this.showDownloadFile = true
            }
            this.isNew = 1
          } else {
            this.onGenProductsExcel()
          }
        }
      )
    },
    changeAllFieldSelected (val) {
      for (let i in this.exportFieldList) {
        this.exportFieldList[i].value = this.isAllFieldSelected
      }
    },
    switchFieldSelect () {
      for (let i in this.exportFieldList) {
        this.exportFieldList[i].value = !this.exportFieldList[i].value
      }
      this.checkAllFieldSelected()
    },
    checkAllFieldSelected () {
      let isAllSelected = true
      for (let i in this.exportFieldList) {
        if (!this.exportFieldList[i].value) {
          isAllSelected = false
        }
      }
      this.isAllFieldSelected = isAllSelected
    },
    onDownloadExcel () {
      this.request('getExcelDownloadUrl', {}, (data) => {
        utils.downloadURL(data.url, '')
      })
    },
    onGenProductsExcel () {
      let fieldList = []
      let self = this
      for (let i in this.exportFieldList) {
        const item = this.exportFieldList[i]
        if (item.value) {
          fieldList.push({
            key: item.field,
            name: item.label
          })
        }
      }
      if (this.isNew && fieldList.length === 0) {
        this.$message.error('请选择需要导出的字段')
        return
      }
      // this.setExportFields(fields)
      this.request(
        'genProductExcel',
        {
          goods_attr_list: JSON.stringify(fieldList),
          is_new: this.isNew
        },
        (data) => {
          if (data['total_nums'] === 0) {
            data['total_nums'] = 1
          }
          this.excelPercent = parseInt(
            (data['left_nums'] * 100) / data['total_nums']
          )
          this.showProcess = true
          if (['success', 'fail'].includes(data.status)) {
            // 如果导出状态是成功或者失败，则移除定时器
            if (data.status === 'success') {
              this.$message.success('商品导出完成')
              this.showDownloadFile = true
              this.recentProductExcelTime = data['last_update_time']
            } else if (data.status === 'fail') {
              this.$message.error('商品导出失败')
            }
            this.showProcess = false
            this.isNew = 1
            clearTimeout(this.syncTimer)
          } else if (['running', 'unbegin'].includes(data.status)) {
            this.isNew = 0
            // 如果任务还在进行中，则走定时器，继续请求这个接口
            this.syncTimer = setTimeout(function () {
              self.onGenProductsExcel()
            }, 2000)
          }
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.download-file {
  text-align: left;
  margin: 0 15px;
  padding: 10px 10px 20px 10px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  a {
    margin-right: 25px;
  }
}
</style>

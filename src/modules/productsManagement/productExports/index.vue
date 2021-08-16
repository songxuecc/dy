<!-- 我的页面 -->
<template>
  <div class="left" v-loading="loading">
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      style="margin-bottom: 10px"
    >
      <el-form-item label="导出类型">
        <el-radio v-model="radio" :label="1">按商品编号导出</el-radio>
        <el-radio v-model="radio" :label="2">导出全部商品</el-radio>
      </el-form-item>
      <el-form-item label="商品编号" v-if="radio === 1" class="relative">
        <el-input
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 10 }"
          placeholder="请输入商品编号, 支持批量搜索多个编号用逗号或换行分割(支持从Excel整列粘贴)"
          :value="goods_id_list"
          @input="handleChange"
          style="min-height: 200px; width: 700px"
        />
        <div class="size">{{ size }}/5000</div>
      </el-form-item>
      <el-form-item label="出售状态" v-if="radio === 2">
        <el-radio-group v-model="resource">
          <el-radio label="售卖中"></el-radio>
          <el-radio label="已下架"></el-radio>
          <el-radio label="全部商品"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="基本信息">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll1"
          @change="handleCheckAllChange($event, '1')"
          >全选</el-checkbox
        >
        <el-checkbox-group
          v-model="checkedCities1"
          @change="handleCheckedCitiesChange($event, '1')"
        >
          <el-checkbox v-for="city in cities1" :label="city" :key="city">{{
            city
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="sku信息">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll2"
          @change="handleCheckAllChange($event, '2')"
          >全选</el-checkbox
        >
        <el-checkbox-group
          v-model="checkedCities2"
          @change="handleCheckedCitiesChange($event, '2')"
        >
          <el-checkbox v-for="city in cities2" :label="city" :key="city">{{
            city
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="最近导出" v-if="showDownloadFile">
        <div>
          <el-link @click="onDownloadExcel()" :underline="false" type="primary"
            >商品列表.xlsx - {{ recentProductExcelTime }}</el-link
          >
        </div>
      </el-form-item>
    </el-form>

    <div v-if="showProcess" style="text-align: center" class="mb-20 mt-20">
      <el-progress
        :text-inside="true"
        :stroke-width="14"
        :percentage="excelPercent"
        style="width: 300px; margin: auto"
      ></el-progress>
    </div>

    <div class="flex align-c justify-c">
      <el-button type="primary" style="width: 120px" @click="onGenProductsExcel" :disabled="showProcess" :loading="showProcess"
        >确认导出</el-button
      >
    </div>
  </div>
</template>

<script>
import { cityOptions1, cityOptions2, exportFieldList, status } from './options'
import Api from '@/api/apis'
import utils from '@/common/utils.js'

export default {
  data () {
    return {
      checkAll1: false,
      checkAll2: false,
      checkAll3: false,
      checkedCities1: [],
      checkedCities2: [],
      cities1: cityOptions1,
      cities2: cityOptions2,
      isIndeterminate1: true,
      isIndeterminate2: true,
      isIndeterminate3: true,
      goods_id_list: '',
      resource: '全部商品',
      radio: 1,
      size: 0,
      exportFieldList,
      recentProductExcelTime: '',
      excelPercent: -1,
      showDownloadFile: false,
      showProcess: false,
      isNew: 0
    }
  },
  computed: {},
  watch: {},
  created () {
    this.init()
  },
  activated () {
    this.init()
  },
  methods: {
    async init () {
      try {
        // 查询最近一次商品导出的文件信息
        const excelFile = await Api.hhgjAPIs.getExcelFile()
        this.showDownloadFile = true
        this.recentProductExcelTime = excelFile['last_update_time']
      } catch (err) {
        console.log(err)
      }
      try {
        //   窗口打开，去查询当前导出任务的状态
        const productExcel = await Api.hhgjAPIs.genProductExcel({
          goods_attr_list: JSON.stringify([]),
          is_new: 0
        })
        this.loading = false
        // 如果导出状态为未开始，成功或失败，则允许用户重新导出新文件
        if (['unbegin', 'success', 'fail'].includes(productExcel.status)) {
          if (productExcel.status === 'success') {
            this.showDownloadFile = true
          }
          this.isNew = 1
        } else {
          this.onGenProductsExcel()
        }
      } catch (err) {
        console.log(err)
      }
    },
    handleCheckAllChange (val, key) {
      this[`checkedCities${key}`] = val ? this[`cities${key}`] : []
      this[`isIndeterminate${key}`] = false
    },
    handleCheckedCitiesChange (value, key) {
      let checkedCount = value.length
      this[`checkAll${key}`] = checkedCount === this[`cities${key}`].length
      this[`isIndeterminate${key}`] =
        checkedCount > 0 && checkedCount < this[`cities${key}`].length
    },
    handleChange (str) {
      let len = str.split(/[\n,，]/g).length
      this.size = str ? len : 0

      if (len <= 5000) {
        this.goods_id_list = str
      } else {
        this.$message.error('最多输入5000行')
      }
    },
    async onDownloadExcel () {
      const data = await Api.hhgjAPIs.getExcelDownloadUrl()
      utils.downloadURL(data.url, '')
    },
    async onGenProductsExcel () {
      const fieldList = [...this.checkedCities1, ...this.checkedCities2].map((key) => exportFieldList[key])
      if (this.isNew && fieldList.length === 0) {
        return this.$message.error('请选择需要导出的字段')
      }

      if ((!this.resource || !this.goods_id_list) && !this.radio) {
        return this.$message.error('请选择需要导出的类型')
      }
      const list = Object.assign(
        { goods_attr_list: JSON.stringify(fieldList) },
        { is_new: this.isNew },
        this.radio === 2 && status[this.resource],
        this.radio === 1 && {
          goods_id_list: this.goods_id_list ? JSON.stringify(this.goods_id_list.split(/[\n,，]/g)) : JSON.stringify([])
        },
        {}
      )
      const data = await Api.hhgjAPIs.genProductExcel(list)
      if (data.total_nums === 0) {
        data.total_nums = 1
      }
      this.excelPercent = parseInt((data.left_nums * 100) / data.total_nums)
      this.showProcess = true
      if (['success', 'fail'].includes(data.status)) {
        // 如果导出状态是成功或者失败，则移除定时器
        if (data.status === 'success') {
          this.$message.success('商品导出完成')
          this.showDownloadFile = true
          this.recentProductExcelTime = data.last_update_time
        } else if (data.status === 'fail') {
          this.$message.error('商品导出失败')
        }
        this.showProcess = false
        this.isNew = 1
        clearTimeout(this.syncTimer)
        this.syncTimer = null
      } else if (['running', 'unbegin'].includes(data.status)) {
        this.isNew = 0
        // 如果任务还在进行中，则走定时器，继续请求这个接口
        this.syncTimer = setTimeout(() => {
          clearTimeout(this.syncTimer)
          this.syncTimer = null
          this.onGenProductsExcel()
        }, 2000)
      }
    }
  }
}
</script>

<style lang='less' scoped>
//@import url(); 引入公共css类
/deep/ .el-checkbox__label {
  font-size: 14px;
  width: 100px;
}
/deep/ .el-form-item {
  margin-bottom: 0;
}

/deep/ .el-form-item__label {
  font-size: 14px;
}
/deep/ .el-radio__label {
  font-size: 14px;
  color: #000;
}
/deep/ .el-checkbox {
  color: #000;
}
.size {
  position: absolute;
  left: 625px;
  bottom: -5px;
}
</style>

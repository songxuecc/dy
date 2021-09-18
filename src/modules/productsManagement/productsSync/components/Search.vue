<!--  -->
<template>
  <div class="left search relative">
    <el-form
      :model="form"
      ref="form"
      label-width="65px"
      inline
      size="small"
      label-position="left"
    >
      <el-form-item style="width: 325px" label="商品状态" prop="region" class="">
        <el-select
          v-model="form.status"
          placeholder="请选择商品状态"
          class="w-235  mb-10"
          clearable
          @clear="handleClear('status')"
        >
          <el-option
            class="left dropdown"
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="width: 325px" label="发货模式" prop="region">
        <el-select
          v-model="form.presell_type"
          placeholder="请选择发货模式"
          class="w-235 mb-10"
          clearable
          @clear="handleClear('presell_type')"
        >
          <el-option
            class="left dropdown"
            v-for="item in presellTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <!-- <el-form-item style="width: 325px" label="是否抓取" prop="region">
        <el-select
          v-model="form.captureStatus"
          placeholder="请选择是否抓取"
          class="w-235 mb-10"
        >
          <el-option
            class="left dropdown"
            v-for="item in captureStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item style="width: 325px" label="抓取平台" prop="region">
        <el-select
          v-model="form.tp_id"
          placeholder="请选择抓取平台"
          class="w-235 mb-10"
          clearable
          @clear="handleClear('tp_id')"
        >
          <el-option
            class="left dropdown"
            v-for="item in captureTpId"
            :key="item.label"
            :value="item.value"
            :label="item.label"
          >
            <div class="flex align-c justify-b">
              <span style="">{{ item.label }}</span>
              <img style="width: 18px;height: 18px;" v-if="item.value !== -1" :src="getIcon(item.label)">
            </div>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="输入名称" prop="region" style="width: 325px">
        <el-input
          autosize
          placeholder="输入名称"
          v-model="form.keyword"
          class="w-235 mb-10"
          clearable
          @clear="handleClear('keyword')"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="搬家时间" prop="region" style="width: 325px">
        <el-date-picker
          style="width:235px"
          class="mb-10"
          v-model="form.captureTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          clearable
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item
        prop="region"
        class="product-id relative"
        style="width: 325px;"
      >
        <span slot="label" style="display:inline-block;">输入商品ID</span>
        <el-input
          type="textarea"
          autosize
          placeholder="输入多个商品ID,以换行分隔，最多可输入5000个"
          v-model="goods_ids"
          style="width:235px"
          class="mb-10 textarea-id"
        >
        </el-input>
      </el-form-item>

      <el-form-item prop="region" class="product-id " style="min-width:325px;margin-right:90px;display: inline-flex;">
        <span slot="label" style="display:inline-block;">商品分类</span>

        <span
          style="display: inline-flex; align-items: center; flex-wrap: wrap"
          v-if="!l"
        >
          <el-tag
            v-if="category && category.name"
            @click="chooseCategory(idx, category)"
            @close="handleClose(category)"
            v-for="(category, idx) in categorys"
            class="pointer"
            :key="category.name"
            closable
            style="
              margin-right: 10px;
              margin-bottom: 10px;
              display: inline-block;
            "
            :type="category.type"
          >
            {{ category.name }}
          </el-tag>
          <el-button
            class="button-new-tag"
            size="small"
            type="primary"
            plain
            @click="chooseCategory(-1)"
            v-if="categorys.length < 5"
            >+ 添加分类筛选</el-button
          >
          <el-button
            class="button-new-tag"
            size="small"
            @click="clearCategory"
            v-if="categorys.length"
            >- 清除全部</el-button
          >
        </span>
      </el-form-item>

       <el-form-item class="btn">
        <el-button
          type="primary"
          @click="handleFilterChange"
          style="width: 60px;margin-left:30px;"
        >
          <span class="font-12">查询</span>
        </el-button>
        <NewComer :type="'tipType'" ref="newComer" direction="bottom" :noAuth="true" class="nn">
          <div style="width:190px">
          <div  class="color-666 font-12 left mb-5">
              <hh-icon type="icontishi" ></hh-icon>&nbsp;小提醒：选择后请点击查询哦~
              <div class="ml-10 right">&nbsp;&nbsp;<span  class="right pointer underline primary" @click="tipTrigger">好的</span></div>
          </div>
          </div>
      </NewComer>
      </el-form-item>

    </el-form>

    <el-dialog
      class="dialog-tight"
      title="修改分类"
      width="800px"
      :visible.sync="categoryVislble"
      append-to-body
      center
      v-if="categoryVislble"
    >
      <category-select-view ref="categorySelectView" @changeCate="onChangeCate">
      </category-select-view>
    </el-dialog>
  </div>
</template>

<script>
import common from '@/common/common.js'
import categorySelectView from '@/components/CategorySelectView'

export default {
  components: {
    categorySelectView
  },
  name: 'Search',
  props: {
    tipType: String,
    originFilters: Object
  },
  data () {
    return {
      categorys: [],
      categoryActiveIdx: -1,
      l: false,
      categoryVislble: false,
      category: {},
      form: {
        status: '-',
        presell_type: -1,
        captureStatus: -1,
        tp_id: -1,
        goods_id_list: '',
        captureTime: [],
        keyword: ''
      },
      originForm: {
        status: '-',
        presell_type: -1,
        captureStatus: -1,
        tp_id: -1,
        goods_id_list: '',
        captureTime: [],
        keyword: ''
      },
      goods_ids: '',
      captureTpId: [
        { value: -1, label: '全部' },
        { value: 1001, label: '天猫' },
        { value: 1002, label: '淘宝' },
        { value: 1003, label: '1688' },
        { value: 1004, label: '京东' },
        { value: 1005, label: '苏宁' },
        { value: 1006, label: '网易考拉' },
        { value: 1007, label: '唯品会' },
        { value: 1012, label: 'vvic搜款网' },
        { value: 1014, label: '一起做网店17' },
        { value: 2002, label: '抖音' },
        { value: 2003, label: '拼多多' },
        { value: 2004, label: '有赞' }
      ],
      captureStatusOptions: [
        { value: -1, label: '全部' },
        { value: 0, label: '非抓取' },
        { value: 1, label: '抓取' }
      ],
      presellTypeOptions: [
        { value: -1, label: '全部发货模式' },
        { value: 0, label: '现货发货' },
        { value: 1, label: '预售发货' },
        { value: 2, label: '阶梯发货' }
      ]
    }
  },
  computed: {
    statusOptions () {
      const options = []
      Object.entries(common.dyProductStatusMap).forEach(([value, label]) => {
        if (!['封禁中', '回收站'].includes(label)) {
          options.push({ value, label })
        }
      })
      return options
    }
  },
  created () {
    // 查询初始化
    if (this.originFilters) {
      const form = this.originForm
      if (typeof this.originFilters.originCategorys !== 'undefined') this.categorys = JSON.parse(this.originFilters.originCategorys)
      if (typeof this.originFilters.originStatus !== 'undefined') form.status = this.originFilters.originStatus
      if (typeof this.originFilters.goods_id_list !== 'undefined') form.goods_id_list = this.originFilters.goods_id_list
      if (typeof this.originFilters.presell_type !== 'undefined') form.presell_type = this.originFilters.presell_type
      if (typeof this.originFilters.captureStatus !== 'undefined') form.captureStatus = this.originFilters.captureStatus
      if (typeof this.originFilters.tp_id !== 'undefined') form.tp_id = this.originFilters.tp_id
      if (typeof this.originFilters.keyword !== 'undefined') form.keyword = this.originFilters.keyword
      if (typeof this.originFilters.migrate_start_time !== 'undefined' && typeof this.originFilters.migrate_end_time !== 'undefined') {
        form.captureTime = [this.originFilters.migrate_start_time, this.originFilters.migrate_end_time]
      }
      console.log(this.originFilters, 'this.originFilters----')
      console.log(form, 'form----')
      this.originForm = form
      this.form = form
    } else {
      const o = {
        status: '-',
        presell_type: -1,
        captureStatus: -1,
        tp_id: -1,
        goods_id_list: '',
        captureTime: [],
        keyword: ''
      }
      this.categorys = []
      this.originForm = o
      this.form = o
    }

    console.log(this.form, 'this.form')
  },
  methods: {
    // 查询
    handleFilterChange () {
      const limit = 100
      const goodsIds = this.goods_ids.split(/[\s\n]/).filter(item => item).map(item => item.trim())
      const goodsIdsSet = [...new Set(goodsIds)]
      if (goodsIdsSet.length > limit) {
        this.loading = false
        return this.$message.error(`搜索id不可以超过${limit}条！`)
      }
      const statusArray = this.form.status.split('-')
      let status = -1
      let checkStatus = -1
      if (statusArray.length > 1 && statusArray[0]) {
        status = parseInt(statusArray[0])
        checkStatus = parseInt(statusArray[1])
      }
      const data = {
        status: status,
        check_status: checkStatus,
        presell_type: this.form.presell_type,
        category_leaf_id_list: JSON.stringify(this.categorys.map(item => item.id)),
        goods_id_list: JSON.stringify(goodsIdsSet.length ? goodsIdsSet : ''),
        tp_id: this.form.tp_id,
        keyword: this.form.keyword
      }
      if (this.form.captureTime) {
        const startTime = this.form.captureTime[0]
        const endTime = this.form.captureTime[1]
        if (startTime && endTime) {
          data.migrate_start_time = startTime
          data.migrate_end_time = endTime
        }
      }
      const originFilters = {
        originStatus: this.form.status,
        originCategorys: JSON.stringify(this.categorys)
      }
      this.$emit('filter', data, originFilters)
    },
    clearCategory () {
      this.categorys = []
    },
    chooseCategory (idx, category) {
      this.categoryVislble = true
      if (category) {
        this.categoryActiveIdx = idx
        this.category = category
      }
      if (category && category.id && category.id !== 0) {
        this.$refs.categorySelectView.initCate(category.id, category.name)
      }
    },
    handleClose (category) {
      this.categorys.splice(this.categorys.indexOf(category), 1)
    },
    onChangeCate (data) {
      const currentCategory = this.categorys.map((item) => item.name)
      if (currentCategory.includes(data.name)) {
        return this.$message.warning('已存在，请重新选择')
      }
      this.categoryVislble = false
      const arr = ['', 'success', 'info', 'warning', 'danger']
      let category = {}
      this.l = true
      if (this.category && this.categoryActiveIdx > -1) {
        category = this.category
        category = data
        category.type = this.category.type
        this.$nextTick(() => {
          this.$set(this.categorys, this.categoryActiveIdx, category)
          this.categoryActiveIdx = -1
          this.category = undefined
          this.l = false
        })
        return
      }
      this.l = false
      this.categorys.push({
        ...data,
        type: arr[this.categorys.length % 5]
      })
    },
    tipTrigger (e) {
      event.stopPropagation()
      const ref = this.$refs.newComer
      ref && ref.close && ref.close()
    },
    handleClear (key) {
      this.form[key] = this.originForm[key]
      console.log(this.form, 'this.form')
    },
    getIcon (name) {
      if (name === '淘宝') {
        return require('@/assets/images/taobao.png')
      } else if (name === '天猫') {
        return require('@/assets/images/tm.png')
      } else if (name === '1688') {
        return require('@/assets/images/1688.png')
      } else if (name === '京东') {
        return require('@/assets/images/jd.png')
      } else if (name === '苏宁') {
        return require('@/assets/images/sn.png')
      } else if (name === '网易考拉') {
        return require('@/assets/images/kaola.png')
      } else if (name === '唯品会') {
        return require('@/assets/images/vph.png')
      } else if (name === '一起做网店17') {
        return require('@/assets/images/17.png')
      } else if (name === '抖音') {
        return require('@/assets/images/dy.png')
      } else if (name === '拼多多') {
        return require('@/assets/images/pdd.png')
      } else if (name === '蝉妈妈') {
        return require('@/assets/images/chanmama.png')
      } else if (name === 'vvic搜款网') {
        return require('@/assets/images/soukuanwang.png')
      } else if (name === '有赞') {
        return require('@/assets/images/youzan.png')
      }

      return ''
    }
  }
}
</script>
<style lang="less" scoped>
.search {
  padding-top: 10px;
  background-color: #f9f9f9;
  border-radius: 3px;
  margin-top: 3px;
  padding: 10px 30px 0;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
  margin-bottom: 10px;
}

.w-235 {
  width: 235px;
}
/deep/ .el-form-item {
  margin-bottom: 2px;
}

.dropdown {
  height: 32px;
  line-height: 32px;
  font-size: 12px;
}

/deep/ .product-id {
  .el-form-item__label {
  padding-right: 0px;
  margin-right: 0px;
  flex-shrink: 0;

  }
}
.btn {
  position:absolute;
  right:20px;
  bottom:5px;
}

.textarea-id {
  position: absolute;
  z-index: 1;
}
</style>

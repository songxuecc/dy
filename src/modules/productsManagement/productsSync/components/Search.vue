<!--  -->
<template>
  <div class="left search">
    <el-form
      :model="form"
      ref="form"
      label-width="60px"
      inline
      size="small"
      label-position="left"
    >
      <el-form-item label="商品状态" prop="region" >
        <el-select
          v-model="form.status"
          placeholder="请选择商品状态"
          class="w-180 mr-10"
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
      <el-form-item label="发货模式" prop="region">
        <el-select
          v-model="form.presell_type"
          placeholder="请选择发货模式"
          class="w-180 mr-10"
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
      <el-form-item label="是否抓取" prop="region">
        <el-select
          v-model="form.captureStatus"
          placeholder="请选择是否抓取"
          class="w-180 mr-10"
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
      </el-form-item>

      <el-form-item
        label="输入名称"
        prop="region"
      >
        <el-input
          autosize
          placeholder="输入名称"
          v-model="goods_ids"
          class="w-180"
        >
        </el-input>
      </el-form-item>

      <el-form-item
        label="输入商品ID"
        prop="region"
        style="display: block"
        class="mt-10"
      >
        <el-input
          type="textarea"
          autosize
          placeholder="输入多个商品ID,以换行分隔，最多可输入5000个"
          v-model="goods_ids"
        >
        </el-input>
      </el-form-item>

      <el-form-item
        label="商品分类"
        prop="region"
        style="display: block"
      >
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
  name: 'component_name',
  props: {
    msg: String
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
        captureStatus: -1
      },
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
  methods: {
    clearCategory () {
      this.categorys = []
    },
    chooseCategory (idx, category) {
      this.categoryVislble = true
      // const category = this.category
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

.w-180 {
  width: 180px;
}
 /deep/ .el-form-item{
        margin-bottom: 2px;
    }
</style>

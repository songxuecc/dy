<!-- 商品属性 -->
<template>
  <div class=" " v-loading="loading">
    <div v-for="(data, idx) in arr" :key="idx">
      <span @click="chooseCategory(data, idx)"
        ><span class="click tip1">选择分类: </span
        ><span v-if="data.category" class="underline-hover pointer">{{
          data.category.name
        }}</span>
        <span class="pointer underline-hover" v-else>点击选择分类</span>
      </span>
      <span class="ml-10 mr-10">
        <span slot="reference" @click="chooseProperties(data, idx)">
          <span class="click tip"> 修改类目属性: </span>
          <span
            class="underline-hover pointer"
            v-if="!getPropertiesChooseText(data.properties)"
            >请选择属性</span
          >
          <span
            class="underline-hover pointer"
            v-if="getPropertiesChooseText(data.properties)"
            >{{ getPropertiesChooseText(data.properties) }}</span
          >
        </span>
      </span>
      <hh-icon
        type="iconzengjiatianjiajiajian"
        class="pointer icon"
        @click="add"
        v-if="idx === 0"
      ></hh-icon>
      <hh-icon
        type="iconshanchu1"
        class="pointer icon"
        @click="remove(idx)"
        v-if="idx !== 0"
      ></hh-icon>
    </div>

    <el-dialog
      class="dialog-tight"
      title="类目属性设置"
      width="858px"
      :visible.sync="visible"
      append-to-body
      center
      ref="PropertiesVislble"
    >
      <Properties ref="Properties" @close="handleClose" v-if="visible"/>
    </el-dialog>

    <el-dialog
      class="dialog-tight"
      title="修改分类"
      width="800px"
      :visible.sync="categoryVislble"
      append-to-body
      center
    >
      <category-select-view ref="categorySelectView" @changeCate="onChangeCate">
      </category-select-view>
    </el-dialog>
  </div>
</template>

<script>
import Properties from './Properties.vue'
import categorySelectView from '@/components/CategorySelectView'
import shortid from 'shortid'
import Apis from '@/api/apis.js'
export default {
  name: 'ProductDelete',
  props: {},
  data () {
    return {
      category: {},
      visible: false,
      categoryVislble: false,
      arr: [
        {
          id: shortid.generate(),
          category: undefined,
          properties: []
        }
      ],
      activeCategoryIndex: undefined,
      activeData: undefined,
      loading: false
    }
  },
  components: {
    Properties,
    categorySelectView
  },
  methods: {
    validData () {
      const arr = this.arr
      return arr.every(item => {
        const formValid = (item.properties || []).some(item => item.tp_value)
        return item.category !== -1 && formValid && item.properties.length
      })
    },
    getForm () {
      const bool = this.validData()
      if (!bool) {
        this.$message.warning('请选择分类或填写属性')
        return false
      }
      let obj = {}
      this.arr.forEach(item => {
        const id = item.category.id
        const value = item.properties.map(property => {
          return {
            options: property.options,
            name: property.name,
            value: property.tp_value
          }
        })
        obj[id] = value
      })
      return { category_dict: obj }
    },
    // 保存 修改的分类
    onChangeCate (data) {
      const categories = this.arr
        .filter((item) => item.category)
        .map((item) => item.category.id)
      const activeCategory = this.arr[this.activeCategoryIndex]
      if (activeCategory.category && data.id === activeCategory.category.id) {
        this.categoryVislble = false
        this.activeCategoryIndex = undefined
        this.activeData = undefined
        return false
      } else if (categories.includes(data.id)) {
        return this.$message.warning('已经选择过此分类')
      }

      activeCategory.category = data
      this.categoryVislble = false
      this.$set(this.arr, this.activeCategoryIndex, activeCategory)
      this.$nextTick(() => {
        this.chooseProperties(activeCategory, this.activeCategoryIndex)
        this.activeCategoryIndex = undefined
        this.activeData = undefined
      })
    },
    // 选择分类
    chooseCategory (data, idx) {
      this.categoryVislble = true
      const category = data.category
      if (category && category.id && category.id !== 0) {
        this.$refs.categorySelectView.initCate(category.id, category.name)
      }
      this.activeCategoryIndex = idx
      this.activeData = data
    },
    add () {
      const id = shortid.generate()
      const next = {
        id,
        category: undefined,
        properties: []
      }
      this.arr.push(next)
    },
    remove (idx) {
      this.arr.splice(idx, 1)
    },
    getPropertiesChooseText (properties) {
      let requireTotal = 0
      let requireNumber = 0
      let chooseTotal = 0
      let chooseNumber = 0

      properties.forEach((item) => {
        if (item.required) {
          requireTotal++
          if (item.tp_value) requireNumber++
        } else {
          chooseTotal++
          if (item.tp_value) chooseNumber++
        }
      })

      if (properties.length) {
        return `必填${requireNumber}/${requireTotal},选填${chooseNumber}/${chooseTotal}`
      }
      return false
    },
    async chooseProperties (data, idx) {
      console.log(data, idx, 'data, idx')
      if (data.category && data.category.id) {
        const id = data.category.id
        // 如果这次请求和上次请求的id相同 则不请求
        if (data.preCategoryId && data.preCategoryId === id) {
          this.visible = !this.visible
          this.$nextTick(() => {
            this.$refs.Properties && this.$refs.Properties.init(data, idx)
          })
          return false
        }
        this.loading = true
        const properties = await Apis.hhgjAPIs.getPropductCategoryProperty({
          category_id: id
        })
        data.properties = properties
        data.preCategoryId = id
        this.visible = !this.visible
        this.$nextTick(() => {
          this.$refs.Properties && this.$refs.Properties.init(data, idx)
          this.$set(this.arr, idx, data)
          this.loading = false
        })
      } else {
        return this.$message.warning('请点击左侧按钮，选择分类')
      }
    },
    handleClose (data, idx) {
      this.visible = !this.visible
      this.$set(this.arr, idx, data)
    }
  }
}
</script>
<style lang="less" scoped>
.tip {
  display: inline-block;
  width: 100px;
  text-align: right;
  margin-right: 5px;
}

.tip1 {
  width: 60px;
}

.icon {
  font-size: 16px;
  margin-left: 10px;
  // color:#FA6400;
  padding-top: 5px;
  line-height: 16px;
  display: inline-flex;
  align-items: center;
  &:hover {
    color: @color-primary;
  }
  &:active {
    color: @color-primary;
  }
}

.underline-hover {
  &:hover {
    text-decoration: underline;
  }
}
</style>

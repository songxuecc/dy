<!-- 商品属性 -->
<template>
  <div class=" ">
    <div v-for="(a,idx) in arr" :key="idx">
      <span @click="chooseCategory"><span class="click tip" >选择分类: </span><span v-if="category.name">{{ category.name }}</span>
        <span class="color-danger pointer" v-else>点击选择分类</span>
      </span>
      <span v-if="category.name">
        <span slot="reference" @click="visible = !visible">
          <span class="click tip"  >
            修改类目属性:
          </span>
          <span>必填(2/2) , 选填(1/5)</span>
        </span>
      </span>
      <hh-icon type="iconzengjiatianjiajiajian" class="pointer icon" @click="add" v-if="idx === 0"></hh-icon>
      <hh-icon type="iconshanchu1" class="pointer icon" @click="remove(idx)" v-if="idx !== 0"></hh-icon>
    </div>

    <el-dialog class="dialog-tight" title="类目属性设置" width="858px" :visible.sync="visible" append-to-body center>
        <Properties :properties="a" :category="category" @close="visible = !visible" v-if="visible"/>
    </el-dialog>

    <el-dialog class="dialog-tight" title="修改分类" width="800px" :visible.sync="categoryVislble" @opened="onOpenedCate" append-to-body center>
        <category-select-view ref="categorySelectView" @changeCate="onChangeCate">
        </category-select-view>
    </el-dialog>
  </div>
</template>

<script>
import { a } from './data'
import Properties from './Properties.vue'
import categorySelectView from '@/components/CategorySelectView'
import shortid from 'shortid'

export default {
  name: 'ProductDelete',
  props: {},
  data () {
    return {
      a,
      category: {},
      visible: false,
      categoryVislble: false,
      arr: [shortid.generate()]
    }
  },
  components: {
    Properties,
    categorySelectView
  },
  methods: {
    getForm () {
      return {}
    },
    // 保存 修改的分类
    onChangeCate (data) {
      this.categoryVislble = false
      console.log(data)
      this.category = data
    },
    chooseCategory () {
      this.categoryVislble = true
      if (this.category.id && this.category.id !== 0) {
        this.$refs.categorySelectView.initCate(this.category.id, this.category.name)
      }
    },
    add () {
      this.arr.push(shortid.generate())
    },
    remove (idx) {
      this.arr.splice(idx, 1)
    }
  }
}
</script>
<style lang="less" scoped>
.tip{
  display:inline-block;
  width:100px;
  text-align:right;
  margin-right:5px;
}
.icon {
  font-size: 16px;
  margin-left: 10px;
  &:hover{
    color: @color-primary;
  }
  &:active{
    color: @color-primary;
  }
}
</style>

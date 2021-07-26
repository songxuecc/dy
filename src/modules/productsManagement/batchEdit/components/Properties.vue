<!-- 属性设置表单 -->
<template>
  <div class="properties">
    <div style="color: #000; ">
      <span style="margin-right: 10px">当前类目:</span>
      <span style="font-weight: bold">{{ category.name }}</span>
    </div>
    <div class="flex mt-10">
      <span style="flex-shrink: 0; margin-right: 10px">类目属性:</span>
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
        size="small"
        :inline="true"
        style="background-color: #f9f9f9; padding: 15px 10px; border-radius: 2px"
      >
        <el-form-item
          :label="property.name"
          v-for="(property, idx) in properties"
          :key="idx"
          :required="property.required"
          style="margin-bottom: 5px"
        >
          <el-input
            v-model="form[property.id]"
            style="width: 220px"
            v-if="property.type === 'text'"
          ></el-input>
          <el-select
            v-model="form[property.id]"
            placeholder="请选择活动区域"
            style="width: 220px"
            v-else-if="property.type === 'select'"
            popper-class="select-popper-properties"
          >
            <el-option :label="option.name" :value="option.value" v-for="(option,idx) in property.options" :key="idx">
                {{option.name}}
            </el-option>
          </el-select>
          <el-checkbox-group
            v-model="form[property.id]"
            style="width: 220px"
            v-else-if="property.type === 'multi_select'"
          >
            <el-checkbox :label="option.name"  v-for="(option,idx) in options" :key="idx" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

    </div>
    <div
          style="
            display: flex;
            justify-content: center;
            margin-top: 5px;
            margin-bottom: 5px;
          "
        >
          <el-button style="width:120px;margin:10px 10px 20px 0;" @click="close">取消</el-button>
          <el-button type="primary" style="width:120px;margin:10px 0 20px 0;" @click="close">应用</el-button>
        </div>
  </div>
</template>

<script>
export default {
  name: 'Properties',
  props: {
    properties: Object,
    category: Object
  },
  data () {
    return {
      form: {},
      originForm: {}
    }
  },
  created () {
    console.log(this.properties)
    let originForm = {}
    this.properties.map(item => {
      originForm[item.id] = item.tp_value
    })
    this.form = {...originForm}
    this.originForm = {...originForm}
  },
//   watch: {
//     properties: {
//       handler: function (newVal) {
//         let originForm = {}
//         newVal.map(item => {
//           originForm[item.id] = item.tp_value
//         })
//         this.form = {...originForm}
//         this.originForm = {...originForm}
//       },
//       deep: true
//     }
//   },
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
.properties {
  width: 750px;
}
/deep/ .el-select-dropdown__item {
      text-align: left;
      padding: 6px 8px 6px 12px;
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
      height:32px;
      width: 170px;
    }
</style>
<style lang="less">
.select-popper-properties {
  .el-select-dropdown__item {
      text-align: left;
      padding: 6px 8px 6px 12px;
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
      height:32px;
    }
    .el-input__inner {
      padding: 0 4px;
    }
}
</style>

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
        :show-message="false"
        ref="form"
        :model="form"
        label-width="100px"
        size="small"
        :inline="true"
        style="background-color: #f9f9f9; padding: 15px 10px; border-radius: 2px"
        :rules="rules"
      >
        <el-form-item
          :label="property.name"
          v-for="(property, idx) in properties"
          :key="idx"
          :required="property.required"
          style="margin-bottom: 5px"
          :prop="`${property.id}`"
        >
          <el-input
            v-model="form[`${property.id}`]"
            style="width: 220px"
            v-if="property.type === 'text'"
            @clear="handleClear(property.id)"
            :clearable="true"
          ></el-input>
          <el-select
            v-model="form[`${property.id}`]"
            placeholder="请选择活动区域"
            style="width: 220px"
            v-else-if="property.type === 'select'"
            popper-class="select-popper-properties"
            :clearable="true"
            @clear="handleClear(property.id)"
          >
            <el-option :label="option.name" :value="option.value" v-for="(option,idx) in property.options" :key="idx">
                {{option.name}}
            </el-option>
          </el-select>
          <el-checkbox-group
            v-model="form[`${property.id}`]"
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
          <el-button style="width:120px;margin:10px 10px 20px 0;" @click="cancel">取消</el-button>
          <el-button type="primary" style="width:120px;margin:10px 0 20px 0;" @click="close">应用</el-button>
        </div>
  </div>
</template>

<script>
export default {
  name: 'Properties',
  data () {
    return {
      form: {},
      originForm: {},
      properties: [],
      category: {}
    }
  },
  computed: {
    rules () {
      if (!this.properties.length) return {}
      let obj = {}
      this.properties.filter(item => item.required).forEach(item => {
        obj[`${item.id}`] = [{
          required: true, message: `${item.name}不能为空`
        }]
      })
      return obj
    }
  },
  methods: {
    init (data, idx) {
      if (!data.properties.length || !data.category) return
      this.properties = data.properties
      this.category = data.category
      this.data = data
      this.idx = idx
      let originForm = {}
      this.properties.map(item => {
        originForm[`${item.id}`] = item.tp_value
      })
      this.form = {...originForm}
      this.originForm = {...originForm}
      this.$refs.form && this.$refs.form.clearValidate()
    },
    close () {
      this.$refs.form.validate((valid, object) => {
        if (valid) {
          for (const key in this.form) {
            this.data.properties = this.properties.map(property => {
              if (String(property.id) === String(key)) {
                property.tp_value = this.form[key]
              }
              return property
            })
          }
          this.$emit('close', this.data, this.idx)
          this.$refs.form && this.$refs.form.clearValidate()
        } else {
          const h = this.$createElement
          const messages = Object.values(object).map(item => item[0].message).map(m => h('div', null, m))
          this.$message({
            message: h('p', null, messages),
            type: 'error'
          })
        }
      })
    },
    cancel () {
      this.$emit('close', this.data, this.idx)
    },
    handleClear (id) {
      this.form[`${id}`] = ''
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

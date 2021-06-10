<!-- 运费模版 -->
<template>
  <el-form
    ref="form"
    :model="form"
    size="small"
    label-position="left"
  >
    <el-form-item label="运费模板:" >
      <el-select v-model="form.cost_template_id" placeholder="请选择运费模板" style="width:200px" class="mb-10">
        <el-option
          v-for="item in costTemplateList"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="text" @click="getCostTemplateList"><hh-icon type="iconjiazai" style="font-size:12px;"/>刷新</el-button>
      <el-button type="text" @click="open()">添加运费模版</el-button>
    </el-form-item>
    <el-form-item label="下架商品修改后:">
      <el-radio-group v-model="form.commit_type">
        <el-radio :label="0">直接上架</el-radio>
        <el-radio :label="1">保存到草稿箱</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script>
import Api from '@/api/apis'

export default {
  name: 'FareTemplate',
  props: {},
  data () {
    return {
      costTemplateList: [],
      form: {
        commit_type: 0,
        cost_template_id: ''
      }
    }
  },
  created () {
    this.getCostTemplateList()
  },
  methods: {
    open () {
      window.open('https://fxg.jinritemai.com/index.html#/ffa/morder/logistics/freight-list')
    },
    async getCostTemplateList () {
      const data = await Api.hhgjAPIs.getCostTemplateList()
      data.List.forEach(item => {
        this.costTemplateList.push({
          value: item.template.id,
          name: item.template.template_name
        })
      })
    },
    getForm () {
      const template = this.costTemplateList.find(item => item.value === this.form.cost_template_id)
      return { ...this.form, template_name: template.name }
    }
  }
}
</script>
<style lang="less" scoped>
</style>

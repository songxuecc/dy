<!-- 标题 -->
<template>
    <el-form ref="form" :model="form" label-width="70px" size="small" label-position="left">
        <el-checkbox style="display:block;margin-bottom:12px" v-model="form.is_replace">
            <el-form-item  label="名称加前缀" style="width:300px">
                <el-input clearable @clear="handleClear('prefix')"  v-model="form.prefix" @focus="handleCheck('is_replace')"></el-input>
            </el-form-item>
        </el-checkbox>
        <el-checkbox style="display:block;margin-bottom:12px" v-model="form.is_delete">
            <el-form-item  label="名称加后缀" style="width:300px">
                <el-input clearable @clear="handleClear('suffix')"  v-model="form.suffix" @focus="handleCheck('is_delete')"></el-input>
            </el-form-item>
        </el-checkbox>
        <el-checkbox style="display:block;margin-bottom:12px" v-model="form.is_prefix">
            <el-form-item  label="关键词替换" style="display:inline-block;width:300px">
                <el-input clearable @clear="handleClear('source_str')"  v-model="form.source_str" @focus="handleCheck('is_prefix')"></el-input>
            </el-form-item>
            <el-form-item  label="替换为" style="display:inline-block;width:300px" label-width="45px" class="ml-10">
                <el-input clearable @clear="handleClear('target_str')"  v-model="form.target_str" @focus="handleCheck('is_prefix')"></el-input>
            </el-form-item>
        </el-checkbox>
        <el-checkbox style="display:block;margin-bottom:12px" v-model="form.is_suffix">
            <el-form-item label="关键词删除" style="width:613px">
                <el-input clearable @clear="handleClear('delete_str')"  v-model="form.delete_str" @focus="handleCheck('is_suffix')"></el-input>
            </el-form-item>
        </el-checkbox>

        <el-form-item label-width="95px">
            <span slot="label">超过30个字：</span>
            <el-radio-group v-model="form.title_cut_type">
                <el-radio :label="1">自动去末尾</el-radio>
                <el-radio :label="2">自动去开头</el-radio>
                <el-radio :label="3">不处理</el-radio>
            </el-radio-group>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
  name: 'Title',
  props: {
    msg: String
  },
  data () {
    return {
      form: {
        is_replace: false,
        is_delete: false,
        is_prefix: false,
        is_suffix: false,
        prefix: '',
        suffix: '',
        source_str: '',
        target_str: '',
        delete_str: '',
        title_cut_type: 3
      }
    }
  },
  methods: {
    handleCheck (attribute) {
      this.form[attribute] = true
    },
    handleClear (attribute) {
      this.form[attribute] = ''
    },
    getForm () {
      return {
        ...this.form,
        is_replace: Number(this.form.is_replace),
        is_delete: Number(this.form.is_delete),
        is_prefix: Number(this.form.is_prefix),
        is_suffix: Number(this.form.is_suffix)
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>

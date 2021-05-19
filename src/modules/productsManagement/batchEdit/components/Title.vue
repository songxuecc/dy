<!-- 标题 -->
<template>
    <el-form ref="form" :model="form" label-width="70px" size="small" label-position="left">
        <el-checkbox-group v-model="checkList">
            <el-checkbox style="display:block;margin-bottom:12px">
                <el-form-item label="名称加前缀">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
            </el-checkbox>
            <el-checkbox style="display:block;margin-bottom:12px">
                <el-form-item label="名称加后缀">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
            </el-checkbox>
            <el-checkbox style="display:block;margin-bottom:12px">
                <el-form-item label="关键词替换" style="display:inline-block">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="替换为" style="display:inline-block" label-width="45px" class="ml-10">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
            </el-checkbox>
            <el-checkbox style="display:block;margin-bottom:12px">
                <el-form-item label="关键词删除">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
            </el-checkbox>
        </el-checkbox-group>

        <el-form-item label-width="95px">
            <span slot="label">超过30个字：</span>
            <el-radio-group v-model="radio">
                <el-radio :label="3">自动去末尾</el-radio>
                <el-radio :label="6">自动去开头</el-radio>
                <el-radio :label="9">不处理</el-radio>
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
      checkList: [],
      form: {}
    }
  }
}
</script>
<style lang="less" scoped>
</style>

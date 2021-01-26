<!--  -->
<template>
  <el-dialog :visible.sync="visible" width="700px" append-to-body v-hh-modal title="批量修改标题" center @close="close">
    <div>
      <div style="display:flex;margin-bottom:20px">
        <p style="margin-right:10px">
          <el-input v-model="model.textPrefix" placeholder="前缀" style="width: 290px;margin-right:10px"></el-input>
          <span style="font-size:12px">原标题</span>
        </p>
        <p>
          <el-input v-model="model.textSuffix" placeholder="后缀" style="width: 290px;"></el-input>
        </p>
      </div>
      <div style="display:flex;margin-bottom:20px">
        <p style="margin-right:10px">
          <el-input v-model="model.textReplaceOrigin" style="width: 290px;margin-right:10px"></el-input>
          <span style="font-size:12px">替换为</span>
        </p>
        <p>
          <el-input v-model="model.textReplaceNew" style="width: 290px;"></el-input>
        </p>
      </div>
      <div style="display:flex;align-items:center">
        <p style="margin-right:42px">
          <el-input v-model="model.textDelete" style="width: 290px;margin-right:13px" placeholder="输入删除关键字">
          </el-input>
        </p>
        <p style="width:300px;display:flex;flex:1">
          <span style="font-size: 12px;margin-right:4px">超过30个字:</span>
          <el-radio-group v-model="model.radio">
            <el-radio :label="3">自动去开头</el-radio>
            <el-radio :label="6">自动去末尾</el-radio>
            <el-radio :label="9">手动处理</el-radio>
          </el-radio-group>
        </p>
      </div>
    </div>
    <span slot="footer">
      <el-button type="primary" style="width:120px" @click="confirm" :loading="loading" :disabled="loading">{{loading?'处理中':'确定'}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'EditTitle',
  props: {
    visible: Boolean,
    loading: Boolean
  },
  data () {
    return {
      model: {
        textPrefix: '',
        textSuffix: '',
        textReplaceOrigin: '',
        textReplaceNew: '',
        textDelete: '',
        radio: 9
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false)
    },
    confirm () {
      if (this.model) {
        this.$emit('batchUpdate', {title: this.model})
      }
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .el-radio {
  margin:0 4px 0 0 ;
}
/deep/ .el-radio__label {
  font-size: 12px;
}
/deep/ .el-radio__label {
    padding-left: 4px;
}
</style>

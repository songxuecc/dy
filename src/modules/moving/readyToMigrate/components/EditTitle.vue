<!--  -->
<template>
  <el-dialog :visible.sync="visible" width="700px" append-to-body v-hh-modal title="批量修改标题" center>
    <div>
      <div style="display:flex;margin-bottom:20px">
        <p style="margin-right:10px">
          <el-input v-model="textPrefix" placeholder="前缀" style="width: 260px;margin-right:10px"></el-input>
          <span style="font-size:12px">原标题</span>
        </p>
        <p>
          <el-input v-model="textSuffix" placeholder="后缀" style="width: 260px;margin-right:13px"></el-input>
          <el-link type="primary" @click="applyTitleChangeToSelection(0)" style="font-size:12px" :underline="false">应用
          </el-link>
        </p>
      </div>
      <div style="display:flex;margin-bottom:20px">
        <p style="margin-right:10px">
          <el-input v-model="textReplace1" style="width: 260px;margin-right:10px"></el-input>
          <span style="font-size:12px">替换为</span>
        </p>
        <p>
          <el-input v-model="textReplace2" style="width: 260px;margin-right:13px"></el-input>
          <el-link type="primary" @click="applyTitleChangeToSelection(1)" style="font-size:12px" :underline="false">应用
          </el-link>
        </p>
      </div>
      <div style="display:flex;align-items:center">
        <p style="margin-right:20px">
          <el-input v-model="textDelete" style="width: 260px;margin-right:13px" placeholder="输入删除关键字">
          </el-input>
          <el-link type="primary" @click="applyTitleChangeToSelection(2)" style="font-size:12px" :underline="false">应用
          </el-link>
        </p>
        <p style="width:300px;display:flex;flex:1">
          <span style="font-size: 12px;margin-right:4px">超过30个字:</span>
          <el-radio-group v-model="radio" >
            <el-radio :label="3">自动去开头</el-radio>
            <el-radio :label="6">自动去末尾</el-radio>
            <el-radio :label="9">手动处理</el-radio>
          </el-radio-group>
        </p>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'EditTitle',
  props: {
    visible: Boolean
  },
  data () {
    return { 
      radio:1
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

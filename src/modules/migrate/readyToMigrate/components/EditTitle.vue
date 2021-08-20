<!-- 更新标题 -->
<template>
  <el-dialog :visible.sync="visible" width="700px" append-to-body v-hh-modal title="批量修改标题" center @close="close"
  :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
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
          <el-input v-model="model.textReplaceOrigin" style="width: 278px;margin-right:10px"></el-input>
          <span style="font-size:12px">全部替换为</span>
        </p>
        <p>
          <el-input v-model="model.textReplaceNew" style="width: 278px;"></el-input>
        </p>
      </div>
      <div style="display:flex;align-items:center">
          <el-input v-model="model.textDelete" style="margin-right:13px" placeholder="请输入需要全部删除的关键字">
          </el-input>
      </div>

      <p style="width:300px;display:flex;flex:1;margin-left:5px" class="mt-20">
          <span style="font-size: 12px;margin-right:4px">超过30个字:</span>
          <el-radio-group v-model="model.radio">
            <el-radio :label="6">自动去末尾</el-radio>
            <el-radio :label="3">自动去开头</el-radio>
            <el-radio :label="9">不处理</el-radio>
          </el-radio-group>
        </p>

      <p style="display:flex;flex:1;margin-left:5px" class="mt-20">
        <span style="font-size: 12px;margin-right:4px">删除指定内容:</span>
        <el-checkbox-group v-model="model.cut_type_list">
            <el-checkbox label="is_cut_digit" style="width:100px">删除英文</el-checkbox>
            <el-checkbox label="is_cut_alpha" style="width:100px">删除数字</el-checkbox>
            <el-checkbox label="is_cut_brackets">删除数字、删除括号以及括号里的内容字</el-checkbox>
        </el-checkbox-group>
      </p>

    </div>
    <div class="mt-10"  v-if="loading"><el-progress :percentage="percentage" :format="format" ></el-progress></div>
    <span slot="footer">
      <el-button style="width:120px" @click="close" v-if="!loading">取消</el-button>
      <el-button type="primary" style="width:120px" @click="confirm" v-if="!loading">确定</el-button>
      <div v-if="loading" class="flex column justify-c align-c "><el-button @click="onShutdown" :loading="shutdown">更新中，点击中止操作</el-button><div class="pl-10 info" style="margin-top:5px">已经更新的数据无法撤回</div></div>
    </span>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'

export default {
  name: 'EditTitle',
  props: {
    visible: Boolean,
    loading: Boolean,
    percentage: Number,
    shutdown: Boolean
  },
  data () {
    return {
      model: {
        textPrefix: '',
        textSuffix: '',
        textReplaceOrigin: '',
        textReplaceNew: '',
        textDelete: '',
        cut_type_list: [],
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
    },
    onShutdown: debounce(function () {
      if (this.model) {
        this.$emit('onShutdown', {title: this.model})
      }
    }, 300),
    format (percentage) {
      return `已完成${percentage}%`
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

<!--  -->
<template>
  <el-dialog title="批量修改本页品牌" :show-close="false" :visible.sync="visible" v-hh-modal width="30%" center>
    <el-select v-model="value" placeholder="请选择" style="width:100%">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <span slot="footer">
      <el-button type="plain" style="width:120px;margin-right:10px" @click="close">取消
      </el-button>
      <el-button type="primary" style="width:120px" @click="confirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'EditBrandId',
  props: {
    visible: Boolean
  },
  data () {
    return {
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: ''
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false)
    },
    confirm () {
      this.close()
    }
  }
}
</script>
<style lang="less" scoped></style>

<!-- SettingAlert -->
<template>
    <el-alert type="info" class="mb-10" :closable="false">
        <div slot="title" class="font-12 color-danger">
            搬家指引：请在复制前完成基本设置填写！填写后效率提升50% <hh-icon type="iconjiantou2" style="font-size:14px;margin-right:50px">
            </hh-icon> <span class="click" @click="gotoSetting">填写基本设置</span>
        </div>
    </el-alert>
</template>

<script>
export default {
  name: 'SettingAlert',
  props: {
    msg: String
  },
  data () {
    return {}
  },
  methods: {
    gotoSetting (e) {
      event.stopPropagation()
      this.$router.push({
        name: 'MigrateSetting'
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>

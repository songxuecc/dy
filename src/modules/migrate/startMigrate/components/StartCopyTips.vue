<!-- StartCopyTips -->
<template>
    <NewComer type="开始复制按钮" ref="newComer" direction="right" :noAuth="true">
        <div style="width:172px">
        <div  class="color-666 font-12 left mb-5">
            <hh-icon type="icontishi" ></hh-icon>&nbsp;小提醒：复制前请确保
            <div class="ml-10">&nbsp;&nbsp;完成了<span  class="right pointer underline primary" @click="gotoSetting">基础设置</span>~</div>
        </div>
        <div class="color-666 font-12 left">完成后效率提升500%<hh-icon type="iconjiantou2"></hh-icon></div>
        </div>
    </NewComer>
</template>

<script>

export default {
  name: 'StartCopyTips',
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
    gotoSetting (e) {
      event.stopPropagation()
      const ref = this.$refs.newComer
      ref && ref.close && ref.close()
      this.$router.push({
        name: 'MigrateSetting'
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>

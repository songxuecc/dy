<!-- StartCopyTips -->
<template>
    <NewComer type="绑定复制按钮" ref="newComer" direction="right" :noAuth="true">
        <div style="width:172px">
        <div  class="color-666 font-12 left mb-5">
            <hh-icon type="icontishi" ></hh-icon>&nbsp;小提醒：选择被复制的店铺后
            <div class="ml-10">&nbsp;&nbsp;请点击<span  class="right pointer  fail" >同步此店铺按钮</span></div>

        </div>
        <div class="color-666 font-12 left">同步完成后再操作哦~</div>
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

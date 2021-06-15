<!-- 查看修改记录 -->
<template>
    <NewComer type="批量处理查看修改记录" ref="newComer" direction="bottom" :noAuth="true" :noNewTips="true">
        <div style="width:172px">
        <div  class="color-4e font-12 left mb-5 yaHei">
            <hh-icon type="icondanxuanxuanzhong" ></hh-icon>&nbsp;提示
        </div>
        <div class="color-666 font-12 left">任务列表提交后...</div>
        <div class="color-666 font-12 left">您可以离开本页面进行其他操作，或在【查看修改记录】中查看进度</div>
        <div class="right"><span  class="right pointer underline primary" @click="gotoSetting">好的</span></div>
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
    }
  }
}
</script>
<style lang="less" scoped>
</style>

<!-- 新功能上线提醒 -->
<template>
    <div class="NewFeatureOnlineTip" v-bind="$attrs">
        <span @click="handleClose"></span>
        <span>我是提醒我是提醒{{msg}}</span>
        <span class="btn" @click="handleClick">立即设置</span>
    </div>
</template>

<script>
export default {
  name: 'NewFeatureOnlineTip',
  props: {
    msg: String,
    type: String
  },
  data () {
    return {
    }
  },
  methods: {
    handleClick () {
      this.$emit('click', this.type)
    },
    handleClose () {
      this.$emit('close', this.type)
    }
  }
}
</script>
<style lang="less" scoped>
    .NewFeatureOnlineTip {
        width:260px;
        height:92px;
        background:pink;
        // background-image: url("~@/assets/images/settingTip.png");
        // background-size: cover;
        .btn {
            width:100px;
        }
    }
</style>

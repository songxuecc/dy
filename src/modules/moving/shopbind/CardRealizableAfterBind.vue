<!-- 绑定后可实现 -->
<template>
    <div class="CardRealizableAfterBind">CardRealizableAfterBind</div>
</template>

<script>
export default {
  name: 'CardRealizableAfterBind',
  props: {
    msg: String
  },
  data () {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
.CardRealizableAfterBind{
  width: 444px;
  height: 333px;
  background: #FFFFFF;
  box-shadow: 0px 4px 14px 0px rgba(0, 0, 0, 0.04);
  border-radius: 10px;
  border: 1px solid #F2F2F2;
}
</style>

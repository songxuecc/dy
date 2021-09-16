<!-- 续订 -->
<template>
    <div class="Renew">
    </div>
</template>

<script>
import seniorVersion from '../images/seniorVersion.png'
export default {
  name: 'Renew',
  props: {
    msg: String
  },
  data () {
    return {
      seniorVersion
    }
  }
}
</script>
<style lang="less" scoped>
.Renew {
    width: 100%;
    background-image: url('../images/seniorVersion.png');
    background-size: 100% 100%;
    width: 100%;
    height: auto;
    aspect-ratio: 356/90;
    margin-bottom: 20px;
}
</style>

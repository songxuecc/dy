<template lang="html">
  <div class="tips-content">
    <icon-svg iconClass="icon-tips" style=""></icon-svg>
    <span class="tips">{{words}}</span>
  </div>
</template>

<script>
export default {
  props: {
    words: String
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped>
.tips-content {
  background: #FFF6ED;
  border-radius: 2px;
  border: 1px solid rgba(250, 100, 0, 0.2);
  text-align: left;
  padding-top: 4.5px;
  padding-bottom: 4px;
  padding-left: 7.5px;
}

.tips {
  font-size: 6px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #FA6400;
}
</style>

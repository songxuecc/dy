<!-- 新功能提示 -->
<template>
    <hh-icon type="icon60" class="left-translate">
        <span class="font-12 new-features">新功能</span>
    </hh-icon>
</template>

<script>
export default {
  name: 'NewFeatureTips',
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
.left-translate {
    margin-left:-2px;
    color:#ffffff;
    font-size:16px;
    padding:0 2px !important;
    line-height:14px;
    border-radius:2px;
    animation: slideLeft 1s infinite linear;
    @keyframes slideLeft {
    0% {
        transform: translate(0px);
    }

    25% {
        transform: translate(1px);
    }

    50% {
        transform: translate(3px);
    }

    75% {
        transform: translate(1px);
    }

    100% {
        transform: translate(0);
    }
    }
}

.new-features {
    padding:0 !important;
    font-size:12px;
    color:#d81e06;
    transform:scale(0.8);
    display:inline-block;
    margin-left: -6px;
    padding-top: 2px !important;
}

</style>

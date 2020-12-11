<template>
  <div class="hh-dialog" v-if="visible">
    <div class="cover-bg" @click="bgClose" :style="{zIndex: zIndex}"></div>
    <div class="dialog-box" :style="{width: width + 'px', marginLeft: -width/2 + 'px', zIndex: (zIndex+1)}">
      <div class="dialog-head" v-if="isHeadLine"></div>
      <div class="dialog-content">
        <div class="dialog-title">
          <div v-if='title' style="display:inline-block">{{title}}</div>
          <el-button v-if="isClose" class="dialog-close" @click="closeDialog" round>
            <icon-svg iconClass="icon-close" style=" width: 24px;height: 24px;"></icon-svg>
          </el-button>
        </div>
        <slot name="content"></slot>
      </div>
      <div class="dialog-foot">
        <slot name='foot'></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HhDialog',
  props: {
    width: Number,
    visible: Boolean,
    title: {
      type: String,
      default: ''
    },
    isClose: {
      type: Boolean,
      default: true
    },
    zIndex: {
      type: Number,
      default: 2000
    },
    isBgClose: {
      type: Boolean,
      default: true
    },
    isHeadLine: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    bgClose () {
      if (this.isBgClose) {
        this.closeDialog()
      }
    },
    closeDialog () {
      this.$emit('closeDialog')
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less" scoped>
.hh-dialog {
}
.cover-bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  // z-index: 3000;
}
.dialog-box {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 600px;
  margin-left: -300px;
  text-align: center;
  border-radius: 4px;
  // z-index: 3001;
  background: #6FB8FF;
  transform: translateY(-50%);
  -ms-transform: translateY(-50%);/* IE 9 */
  -moz-transform: translateY(-50%);/* Firefox */
  -webkit-transform: translateY(-50%);/* Safari 和 Chrome */
  -o-transform: translateY(-50%);/* Opera */
  .dialog-head {
    height: 12px;
    background: #6FB8FF;
    border-radius: 4px 4px 0 0;
  }
  .dialog-content {
    background: #ffffff;
    text-align: center;
    border-radius: 4px 4px 0 0;
    .dialog-title{
      width: 100%;
      font-size: 22px;
      font-weight: 500;
      color: #4E4E4E;
      padding-top:28px;
      display: inline-block;
      position: relative;
      .dialog-close{
        display: inline-block;
        position: absolute;
        right: 40px;
        padding: 0;
        border:0;
        height: 24px;
      }
    }

  }
  .dialog-foot {
    background: #ffffff;
    border-radius: 0 0 4px 4px;
    padding-bottom: 30px;
  }
}

</style>

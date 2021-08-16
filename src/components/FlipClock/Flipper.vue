<template>
  <div class="HH-Flipper" :class="[flipType, {'go': isFlipping}]">
    <div class="digital front" :class="_textClass(frontTextFromData)"></div>
    <div class="digital back" :class="_textClass(backTextFromData)"></div>
  </div>
</template>

<script>
export default {
  name: 'FlipClock',
  data () {
    return {
      isFlipping: false,
      flipType: 'down',
      frontTextFromData: 0,
      backTextFromData: 1
    }
  },
  props: {
    // front paper text
    // 前牌文字
    frontText: {
      type: [Number, String],
      default: 0
    },
    // back paper text
    // 后牌文字
    backText: {
      type: [Number, String],
      default: 1
    },
    // flipping duration, please be consistent with the CSS animation-duration value.
    // 翻牌动画时间，与CSS中设置的animation-duration保持一致
    duration: {
      type: Number,
      default: 600
    }
  },
  methods: {
    _textClass (number) {
      return 'number' + number
    },
    _flip (type, front, back) {
      // 如果处于翻转中，则不执行
      if (this.isFlipping) {
        return false
      }
      this.frontTextFromData = front
      this.backTextFromData = back
      // 根据传递过来的type设置翻转方向
      this.flipType = type
      // 设置翻转状态为true
      this.isFlipping = true
      setTimeout(() => {
        // 设置翻转状态为false
        this.isFlipping = false
        this.frontTextFromData = back
      }, this.duration)
    },
    // 下翻牌
    flipDown (front, back) {
      if (front !== back) {
        this._flip('down', front, back)
      }
    },
    // 上翻牌
    flipUp (front, back) {
      this._flip('up', front, back)
    },
    // 设置前牌文字
    setFront (text) {
      console.log(text, 'text1')
      this.frontTextFromData = text
    },
    // 设置后牌文字
    setBack (text) {
      console.log(text, 'text2')

      this.backTextFromData = text
    }
  },
  created () {
    this.frontTextFromData = this.frontText
    this.backTextFromData = this.backText
  }
}
</script>

<style>
.HH-Flipper {
  display: inline-block;
  position: relative;
  width: 33px;
  height: 46px;
  line-height: 46px;
  border-radius: 3px;
  font-size: 29px;
  color: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.6);
  /* box-shadow: 0px 1px 1px 0px rgba(94, 94, 94, 0.5); */
  text-align: center;
  font-family: FZLTTHK--GBK1-0, FZLTTHK--GBK1;
}

.HH-Flipper .digital:before,
.HH-Flipper .digital:after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  background: #262626;
  overflow: hidden;
  box-sizing: border-box;
}

.HH-Flipper .digital:before {
  top: 0;
  bottom: 50%;
  border-radius: 3px 3px 0 0;
  border-bottom: solid 1px #666;
}

.HH-Flipper .digital:after {
  top: 50%;
  bottom: 0;
  border-radius: 0 0 3px 3px;
  line-height: 0;
}

/*向下翻*/
.HH-Flipper.down .front:before {
  z-index: 3;
}

.HH-Flipper.down .back:after {
  z-index: 2;
  transform-origin: 50% 0%;
  transform: perspective(160px) rotateX(180deg);
}

.HH-Flipper.down .front:after,
.HH-Flipper.down .back:before {
  z-index: 1;
}

.HH-Flipper.down.go .front:before {
  transform-origin: 50% 100%;
  animation: frontFlipDown 0.6s ease-in-out both;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.9);
  backface-visibility: hidden;
}

.HH-Flipper.down.go .back:after {
  animation: backFlipDown 0.6s ease-in-out both;
}

/*向上翻*/
.HH-Flipper.up .front:after {
  z-index: 3;
}

.HH-Flipper.up .back:before {
  z-index: 2;
  transform-origin: 50% 100%;
  transform: perspective(160px) rotateX(-180deg);
}

.HH-Flipper.up .front:before,
.HH-Flipper.up .back:after {
  z-index: 1;
}

.HH-Flipper.up.go .front:after {
  transform-origin: 50% 0;
  animation: frontFlipUp 0.6s ease-in-out both;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.9);
  backface-visibility: hidden;
}

.HH-Flipper.up.go .back:before {
  animation: backFlipUp 0.6s ease-in-out both;
}

@keyframes frontFlipDown {
  0% {
    transform: perspective(160px) rotateX(0deg);
  }

  100% {
    transform: perspective(160px) rotateX(-180deg);
  }
}

@keyframes backFlipDown {
  0% {
    transform: perspective(160px) rotateX(180deg);
  }

  100% {
    transform: perspective(160px) rotateX(0deg);
  }
}

@keyframes frontFlipUp {
  0% {
    transform: perspective(160px) rotateX(0deg);
  }

  100% {
    transform: perspective(160px) rotateX(180deg);
  }
}

@keyframes backFlipUp {
  0% {
    transform: perspective(160px) rotateX(-180deg);
  }

  100% {
    transform: perspective(160px) rotateX(0deg);
  }
}

.HH-Flipper .number0:before,
.HH-Flipper .number0:after {
  content: '0';
}

.HH-Flipper .number1:before,
.HH-Flipper .number1:after {
  content: '1';
}

.HH-Flipper .number2:before,
.HH-Flipper .number2:after {
  content: '2';
}

.HH-Flipper .number3:before,
.HH-Flipper .number3:after {
  content: '3';
}

.HH-Flipper .number4:before,
.HH-Flipper .number4:after {
  content: '4';
}

.HH-Flipper .number5:before,
.HH-Flipper .number5:after {
  content: '5';
}

.HH-Flipper .number6:before,
.HH-Flipper .number6:after {
  content: '6';
}

.HH-Flipper .number7:before,
.HH-Flipper .number7:after {
  content: '7';
}

.HH-Flipper .number8:before,
.HH-Flipper .number8:after {
  content: '8';
}

.HH-Flipper .number9:before,
.HH-Flipper .number9:after {
  content: '9';
}
</style>

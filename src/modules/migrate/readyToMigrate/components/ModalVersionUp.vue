<!-- ModalVersionUp -->
<template>
    <div>
        <div>
            <div class="flex">
                <div class="trialVersion">
                    <p>{{text[key].left}}</p>
                    <p>试用版</p>
                    <p>10个/日</p>
                </div>
                <div class="trialVersion">
                    <p>版本升级</p>
                    <p>试用版</p>
                    <p>{{text[key].price}}</p>
                </div>
                <div class="trialVersion">
                    <p>{{text[key].right}}</p>
                    <p>高级版</p>
                    <p>无上限/日</p>
                </div>
            </div>
            <div>当前版本为试用版，每日搬家数限10个。今日已搬家9个商品，仅剩</div>
            <div>建议您升级为高级版，升级后每日搬家数 </div>
        </div>
        <div>再想想</div>
        <div>去升级</div>
    </div>
</template>

<script>
export default {
  name: 'ModalVersionUp',
  props: {
    key: {
      type: String,
      default: 'up'
    }
  },
  data () {
    return {

      text: {
        up: {
          price: '0.3元/天',
          tip: '版本升级',
          left: '升级前',
          right: '升级后'
        },
        order: {
          price: '15元/月',
          tip: '订购高级版',
          left: '订购前',
          right: '订购后'
        }

      }
    }
  }
}
</script>
<style lang="less" scoped>
.trialVersion {
    .tutorials{
      background-image: linear-gradient(164deg, #FF9527 0%, #EB2202 100%);
      border-radius: 8px 0 8px 0;
      font-size: 10px;
      color: #FFFFFF;
      display: inline-block;
      line-height: 18px;
      text-align: center;
      height: 18px;
      padding: 0 4px;
      margin-top: 3px;
      margin-left: 5px;
      cursor: pointer;
      &:hover {
        transition: 0.3s;
        transform: scale(1.05);
      }
    }
}
</style>

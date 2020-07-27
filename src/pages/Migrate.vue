<template lang="html">
    <div>
        <el-tabs type="border-card">
            <el-tab-pane v-loading="loadingCnt" label="链接抓取">
                <el-input type="textarea" :rows="10" placeholder="输入其他平台的商品链接地址，换行分隔多个链接，最多不超过10个" v-model="textCaptureUrls">
                </el-input>
                <div class="support">
                    <span>支持平台:</span>
                    <el-tooltip placement="bottom">
                      <div slot="content">淘宝</div>
                      <img class="icon" src="@/assets/images/u72.png">
                    </el-tooltip>
                    <el-tooltip placement="bottom">
                      <div slot="content">天猫</div>
                      <img class="icon" src="@/assets/images/u74.png">
                    </el-tooltip>
                    <el-tooltip placement="bottom">
                      <div slot="content">1688</div>
                      <img class="icon" src="@/assets/images/1688.png">
                    </el-tooltip>
                    <el-tooltip placement="bottom">
                      <div slot="content">京东</div>
                      <img class="icon" src="@/assets/images/jd.png">
                    </el-tooltip>
                    <el-tooltip placement="bottom">
                      <div slot="content">苏宁</div>
                      <img class="icon" src="@/assets/images/sn.png">
                    </el-tooltip>
                    <el-tooltip placement="bottom">
                      <div slot="content">唯品会</div>
                      <img class="icon" src="@/assets/images/vip.png">
                    </el-tooltip>
                    <el-tooltip placement="bottom">
                      <div slot="content">网易考拉</div>
                      <img class="icon" src="@/assets/images/kaola.png">
                    </el-tooltip>
                </div>
                <div  class="common-bottom">
                    <el-button type="primary" @click="onCapture(0)">开始抓取</el-button>
                </div>
            </el-tab-pane>
            <el-tab-pane v-loading="loadingCnt" label="整店抓取">
                <el-input type="textarea" :rows="10" placeholder="输入其他平台的店铺地址" v-model="textCaptureShopUrls">
                </el-input>
                <div class="support">
                    <span>支持平台:</span>
                    <el-tooltip placement="bottom">
                      <div slot="content">淘宝</div>
                      <img class="icon" src="@/assets/images/u72.png">
                    </el-tooltip>
                    <el-tooltip placement="bottom">
                      <div slot="content">天猫</div>
                      <img class="icon" src="@/assets/images/u74.png">
                    </el-tooltip>
                    <el-tooltip placement="bottom">
                      <div slot="content">1688</div>
                      <img class="icon" src="@/assets/images/1688.png">
                    </el-tooltip>
                    <el-tooltip placement="bottom">
                      <div slot="content">京东</div>
                      <img class="icon" src="@/assets/images/jd.png">
                    </el-tooltip>
                    <el-tooltip placement="bottom">
                      <div slot="content">苏宁</div>
                      <img class="icon" src="@/assets/images/sn.png">
                    </el-tooltip>
<!--                    <el-tooltip placement="bottom">-->
<!--                      <div slot="content">唯品会</div>-->
<!--                      <img class="icon" src="@/assets/images/vip.png">-->
<!--                    </el-tooltip>-->
                    <el-tooltip placement="bottom">
                      <div slot="content">网易考拉</div>
                      <img class="icon" src="@/assets/images/kaola.png">
                    </el-tooltip>
                </div>
                <div  class="common-bottom">
                    <el-button type="primary" @click="onCapture(1)">开始抓取</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import request from '@/mixins/request.js'
import { mapGetters, mapActions } from 'vuex'
import common from '@/common/common.js'

export default {
  mixins: [request],
  data () {
    return {
      textCaptureUrls: '',
      textCaptureShopUrls: ''
    }
  },
  computed: {
    ...mapGetters([
      'getCaptureIdList'
    ]),

    subscItemLevelMap () {
      return common.subscItemLevelMap
    }
  },
  methods: {
    ...mapActions([
      'setCaptureIdList'
    ]),
    ...mapGetters({
      subsc: 'getCurrentSubsc'
    }),

    onCapture (captureType) {
      let textUrls = ''
      let limit = 1
      let message = ''
      if (captureType === 0) {
        textUrls = this.textCaptureUrls
        limit = 10
        message = '链接抓取超过' + limit + '条限制'
      } else {
        textUrls = this.textCaptureShopUrls
        message = '整店抓取超过' + limit + '条限制'
      }
      let urls = textUrls.split('\n')
      urls = urls.map(s => s.trim()).filter(s => s !== '')
      if (urls.length === 0) {
        this.$message({
          message: '抓取链接未填写',
          type: 'warning'
        })
        return
      } else if (urls.length > limit) {
        this.$message({
          message: message,
          type: 'warning'
        })
        return
      }
      if (captureType === 0) {
        if (this.textCaptureUrls.search('yangkeduo.com') !== -1) {
          this.$message({
            message: '由于抖音规则限制，不支持抖音商品抓取',
            type: 'warning'
          })
          return
        }
        // for (var url of urls) {
        //   if (
        //     !url.match('detail.tmall.com/item.htm?\\S*id=\\d+') &&
        //     !url.match('detail.m.tmall.com/item.htm?\\S*id=\\d+') &&
        //     !url.match('detail.tmall.hk/hk/item.htm?\\S*id=\\d+') &&
        //     !url.match('detail.m.tmall.hk/item.htm?\\S*id=\\d+') &&
        //     !url.match('detail.yao.95095.com/item.htm?\\S*id=\\d+') &&
        //     !url.match('item.taobao.com/item.htm?\\S*id=\\d+') &&
        //     !url.match('h5.m.taobao.com/awp/core/detail.htm?\\S*id=\\d+') &&
        //     !url.match('detail.1688.com/offer/\\d+.html') &&
        //     !url.match('m.1688.com/offer/\\d+.html') &&
        //     !url.match('item.jd.com/\\d+.html') &&
        //     !url.match('item.m.jd.com/product/\\d+.html') &&
        //     !url.match('item.paipai.com/\\d+.html') &&
        //     !url.match('item.jd.hk/\\d+.html') &&
        //     !url.match('item.m.paipai.com/product/\\d+.html?') &&
        //     !url.match('goods.kaola.com/product/\\d+.html') &&
        //     !url.match('m-goods.kaola.com/product/\\d+.html') &&
        //     !url.match('product.suning.com/\\d+/\\d+.html') &&
        //     !url.match('m.suning.com/product/\\d+/\\d+.html') &&
        //     !url.match('detail.vip.com/detail-\\d+-\\d+.html') &&
        //     !url.match('m.vip.com/product-\\d+-\\d+.html') &&
        //     !url.match('item.jkcsjd.com/\\d+.html') &&
        //     !url.match('detail.liangxinyao.com/item.htm?\\S*id=\\d+')
        //   ) {
        //     this.$message({
        //       message: '请填写正确的商品链接 (错误链接:' + url + ')',
        //       type: 'warning'
        //     })
        //     return
        //   }
        // }
      } else {
        if (this.textCaptureShopUrls.search('yangkeduo.com') !== -1) {
          this.$message({
            message: '由于抖音规则限制，不支持抖音店铺抓取',
            type: 'warning'
          })
          return
        }
        // else if (
        //   this.textCaptureShopUrls.search('detail.1688') !== -1 ||
        //   this.textCaptureShopUrls.search('item.taobao') !== -1 ||
        //   this.textCaptureShopUrls.search('detail.tmall') !== -1 ||
        //   this.textCaptureShopUrls.search('item.jd') !== -1 ||
        //   this.textCaptureShopUrls.search('product.suning') !== -1 ||
        //   this.textCaptureShopUrls.search('goods.kaola') !== -1 ||
        //   this.textCaptureShopUrls.search('detail.vip') !== -1 ||
        //   this.textCaptureShopUrls.search('detail.yao.95095') !== -1 ||
        //   this.textCaptureShopUrls.search('m.1688') !== -1 ||
        //   // this.textCaptureShopUrls.search('m.taobao') !== -1 ||
        //   // this.textCaptureShopUrls.search('m.tmall') !== -1 ||
        //   this.textCaptureShopUrls.search('m.jd') !== -1 ||
        //   this.textCaptureShopUrls.search('m.suning') !== -1 ||
        //   this.textCaptureShopUrls.search('m-goods.kaola') !== -1 ||
        //   this.textCaptureShopUrls.search('m.vip') !== -1
        // ) {
        //   this.$message({
        //     dangerouslyUseHTMLString: true,
        //     message: '请填写店铺首页地址 <a href="/info?id=2&tabId=help">点击查看获取教程</a>',
        //     type: 'warning'
        //   })
        //   return
        // }
      }
      this.request('capture', { urls, capture_type: captureType }, data => {
        let captureId = data.capture_id
        this.$router.push({
          path: '/productList',
          query: {
            captureId: captureId
          }
        })
      })
    }
  }
}
</script>

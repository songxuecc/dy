<template lang="html">
    <div style="position: relative;">
        <help-tips v-if="activeName === 'shop'" helpLink="captureShop" words="怎么获取店铺链接？" positionT="10" positionR="10"></help-tips>
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane v-loading="loadingCnt" label="链接抓取" name="single">
                <el-input type="textarea" :rows="10" placeholder="输入其他平台的商品链接地址，换行分隔多个链接，最多不超过50个" @input="changeCaptureUrl" v-model="textCaptureUrls">
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
                    <el-tooltip placement="bottom">
                      <div slot="content">抖音</div>
                      <img class="icon" src="@/assets/images/douyin.jpg">
                    </el-tooltip>
                </div>
                <div  class="common-bottom">
                    <el-button type="primary" @click="onCapture(0)">
                      <span style="line-height:21px">开始抓取</span>
                      <el-badge :value="captureUrlNums"></el-badge>
                    </el-button>
                </div>
            </el-tab-pane>
            <el-tab-pane v-loading="loadingCnt" label="整店抓取" name="shop">
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
                    <el-tooltip placement="bottom">
                      <div slot="content">抖音</div>
                      <img class="icon" src="@/assets/images/douyin.jpg">
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
import helpTips from '@/components/HelpTips.vue'

export default {
  mixins: [request],
  data () {
    return {
      textCaptureUrls: '',
      textCaptureShopUrls: '',
      activeName: 'single',
      captureUrlNums: 0
    }
  },
  components: {
    helpTips
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
    changeCaptureUrl () {
      let urls = this.textCaptureUrls.split('\n')
      urls = urls.map(s => s.trim()).filter(s => s !== '')
      this.captureUrlNums = urls.length
    },
    onCapture (captureType) {
      let textUrls = ''
      let limit = 1
      let message = ''
      if (captureType === 0) {
        textUrls = this.textCaptureUrls
        limit = 50
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

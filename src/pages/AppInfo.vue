<template lang="html">
    <div>
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="基本介绍" name="basic">
              <div class="pay" v-if="true">
                  <div>
                      <div v-if="false">
                        <span style="width: 100px; display: block; float: left">价格：</span>
                        <span style="color: #ff7300;">{{subscRealPrice}}元</span>
                        <del style="color: #777777; font-size: 12px;">{{subscPrice}}元</del>
                      </div>
                      <template v-if="false">
                        <span v-if="selectCycleList.length > 0" style="width: 100px; display: block; float: left">周期：</span>
                        <el-radio-group v-model="selectCycleName">
                            <div v-for="item in selectCycleList" :key="item.cycle_name" style="float: left; width: 100px;">
                                <el-radio :label="item.cycle_name" :disabled="item.enable">{{item.cycle_name}}
                                </el-radio>
                            </div>
                        </el-radio-group>
                        <br/>
                      </template>
                      <template v-if="false">
                        <span v-if="selectLevelList.length > 0" style="width: 100px; display: block; float: left">服务版本：</span>
                        <el-radio-group v-model="selectLevelName">
                            <div v-for="item in selectLevelList" :key="item.item_level_name" style="float: left; width: 100px;">
                                <el-radio :label="item.item_level_name" :disabled="item.enable">{{item.item_level_name}}
                                </el-radio>
                            </div>
                        </el-radio-group>
                      </template>
                  </div>
                  <br/>
                  <div v-if="false">
                      <el-table border style="width: 100%" highlight-current-row :data="subscItem">
                          <el-table-column label="具体功能" prop="feature"></el-table-column>
                          <el-table-column label="高级版" width="150" prop="basic">
                              <template slot-scope="scope">
                                <div v-if="scope.row.type === 'bool'">
                                  <i v-if="scope.row.basic" class="el-icon-check"></i>
                                  <i v-if="!scope.row.basic" class="el-icon-close"></i>
                                </div>
                                <div v-else-if="scope.row.type === 'int'">
                                  <span v-if="scope.row.basic === -1">无限</span>
                                  <span v-else>{{scope.row.basic}}</span>
                                </div>
                              </template>
                          </el-table-column>
                          <el-table-column label="尊享版" width="150" prop="advance">
                              <template slot-scope="scope">
                                <div v-if="scope.row.type === 'bool'">
                                  <i v-if="scope.row.advanced" class="el-icon-check"></i>
                                  <i v-if="!scope.row.advanced" class="el-icon-close"></i>
                                </div>
                                <div v-else-if="scope.row.type === 'int'">
                                  <span v-if="scope.row.advanced === -1">无限</span>
                                  <span v-else>{{scope.row.advanced}}</span>
                                </div>
                              </template>
                          </el-table-column>
                      </el-table>
                      <br>
                  </div>
              </div>
              <br v-if="!isAuth">
                <div>
                  <div class="first-title">工具优势</div>
                  <div class="second-contain">
                      <span class="second-title">属性智能匹配</span>
                      <span class="second-title-desc">
                        商品主图、轮播图、类目、属性智能转换，白底图智能推荐
                      </span>
                  </div>
                  <div class="second-contain">
                      <span class="second-title">商品评分优化</span>
                      <span class="second-title-desc">
                        智能提供商品评分的优化方法，一键提高商品评分，优化排名
                      </span>
                  </div>
                  <div class="second-contain">
                      <span class="second-title">商品在线修图</span>
                      <span class="second-title-desc">
                        在线编辑主图水印、生成商品白底图
                      </span>
                  </div>
                  <div class="first-title" style="margin-top:20px;">功能介绍</div>
                  <div style="margin-top: 20px;">
                    <div class="second-title">商品管理/编辑优化</div>
                    <el-row class="second-contain">
                      <el-col :span="8">
                      <div>
                        商品各属性在线修改，商品上下架修改<br>
                        滞销商品一键查询<br>
                        查看商品评分，一键优化商品评分<br>
                        商品批量导出
                      </div>
                      </el-col>
                      <el-col :span="2">
                        </el-col>
                      <el-col :span="14">
                        <img class='second-img' src='http://t00img.yangkeduo.com/openapi/images/images/2019-09-26/ff8abd3b96965712646b007ef8c1aad3.jpeg' />
                      </el-col>
                    </el-row>
                  </div>
                   <div style="margin-top: 20px;">
                    <div class="second-title">店铺装修/白底图处理</div>
                    <el-row class="second-contain">
                      <el-col :span="8">
                      <div>
                        支持上传和链接两种图片编辑方式<br>
                        在线修图，并查看处理效果<br>
                        下载修改后的图片到本地<br>
                      </div>
                      </el-col>
                      <el-col :span="2">
                        </el-col>
                      <el-col :span="14">
                        <img class='second-img' src='http://t00img.yangkeduo.com/openapi/images/images/2019-09-26/ee9c46139ade06eda88a5e80eadb62e3.jpeg' />
                      </el-col>
                    </el-row>
                  </div>
                </div>
            </el-tab-pane>
          <el-tab-pane label="使用教程" class="my-help" name="help">
            <div v-for="(item, index) in docs" :key="index" v-if="helpId === index+1" style="width: 100%;">
              <el-page-header @back="goBack">
              </el-page-header>
              <iframe v-bind:src="'https://view.officeapps.live.com/op/embed.aspx?wdAccPdf=1&ui=zh-cn&rs=zh-cn&src=https://www.xiongxiongguanjia.com/manual/'+item" width='100%' height='800px;' frameborder='0'></iframe>
            </div>
            <div v-if="helpId === 0">
              <h2>虎虎抖音小店使用教程</h2>
              <br/>
              <el-row>
                <el-col :span="6"><div style="min-height: 36px;"></div></el-col>
                <el-col :span="18" style="text-align: left">
                  <div>
                    <el-link :underline="false" @click="showHelp(1)">1、怎么优化商品？</el-link><br/>
                    <el-link :underline="false" @click="showHelp(2)">2、怎么批量修改商品信息？</el-link><br/>
                    <el-link :underline="false" @click="showHelp(3)">3、怎么制作白底图？</el-link><br/>
                  </div>
                  <div>
                    <div style="max-width: 70%; float:left; font-size: 14px;">
                      如不能解决您的问题，联系微信客服：<img src="http://qncnd.huhuguanjia.com/qrcode.png" style="max-height: 100px;">
                    </div>
                    <div style="max-width: 30%; float:left; margin-left: 3%; font-size: 14px; ">
                      <p>客服上班时间：周一至周五(工作日)</p>
                      <p>早上 9:00 - 12:30 下午 13:30 - 18:00</p>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="关于我们" class="my-info" name="company">
            虎虎抖音小店属于上海虎正奔信息科技有限公司旗下品牌。
            <br/>
            上海虎正奔信息科技有限公司是一家为电商企业提供创新型店铺经营管理工具的互联网公司。致力于帮助企业降低运营成本、提升运营效率、促进交易转化。
            <br/>
            <br/>
            公司名称：上海虎正奔信息科技有限公司
            <br/>
            地址：上海浦东软件园15号楼504
            <br/>
            联系方式：huhu_yunying@taofengcai.com
          </el-tab-pane>
        </el-tabs>
        <div style="padding-top: 20px">
            <el-link href="http://www.beian.miit.gov.cn" target="_blank" >沪ICP备16034003号</el-link>
        </div>
    </div>
</template>
<script>
import request from '@/mixins/request.js'
import { mapGetters } from 'vuex'
import merge from 'webpack-merge'
import utils from '@/common/utils'
export default {
  mixins: [request],
  data () {
    return {
      activeName: 'basic',
      selectLevelName: '',
      selectCycleName: '',
      subscItemList: [],
      subscItem: [
      //   {
      //   'feature': '登录有奖',
      //   'type': 'bool',
      //   'free': true,
      //   'basic': true,
      //   'advanced': true
      // }, {
      //   'feature': '邀请',
      //   'type': 'bool',
      //   'free': true,
      //   'basic': true,
      //   'advanced': true
      // },
        {
          'feature': '链接抓取',
          'type': 'bool',
          'free': true,
          'basic': true,
          'advanced': true
        },
      // {
      //   'feature': '抓取数量/天',
      //   'type': 'int',
      //   'free': 5,
      //   'basic': -1,
      //   'advanced': -1
      // },
        {
          'feature': '整店抓取',
          'type': 'bool',
          'free': false,
          'basic': false,
          'advanced': true
        },
        {
          'feature': '商品管理',
          'type': 'bool',
          'free': false,
          'basic': true,
          'advanced': true
        }, {
          'feature': '白底图制作',
          'type': 'bool',
          'free': false,
          'basic': true,
          'advanced': true
        }, {
          'feature': '水印功能',
          'type': 'bool',
          'free': false,
          'basic': false,
          'advanced': true
        }],
      shareLinkCopied: false,
      loginDialogVisible: false,
      shareDialogVisible: false,
      helpId: 0,
      docs: [
        'manual2-怎么优化商品.docx',
        'manual2-怎么批量修改商品信息.docx',
        'manual2-怎么制作白底图.docx'
      ],
      priceMap: {}
    }
  },
  computed: {
    ...mapGetters({
      isAuth: 'getIsAuth',
      ownerId: 'getOwnerId',
      loginNum: 'getLoginNum',
      subsc: 'getCurrentSubsc',
      mallName: 'getMallName'
    }),
    leftDays () {
      return utils.diffDate(this.subsc.deadline) + 1
    },
    selectLevelList () {
      var selectLevelList = []
      for (var i = 0, len = this.subscItemList.length; i < len; i++) {
        if (this.subscItemList[i].cycle_name === this.selectCycleName) {
          selectLevelList.push({
            'item_level_name': this.subscItemList[i].item_level_name,
            'enable': !this.subscItemList[i].enable
          })
        }
      }
      return selectLevelList
    },
    selectCycleList () {
      var selectCycleList = []
      for (var i = 0, len = this.subscItemList.length; i < len; i++) {
        if (this.subscItemList[i].item_level_name === this.selectLevelName) {
          selectCycleList.push({
            'cycle_name': this.subscItemList[i].cycle_name,
            'enable': !this.subscItemList[i].enable
          })
        }
      }
      return selectCycleList
    },
    selectSubscItemId () {
      if (this.priceMap[this.selectLevelName + '-' + this.selectCycleName]) {
        return this.priceMap[this.selectLevelName + '-' + this.selectCycleName].subsc_item_cycle_id
      }
      return -1
    },
    subscPrice () {
      if (this.priceMap[this.selectLevelName + '-' + this.selectCycleName]) {
        return utils.fenToYuan(this.priceMap[this.selectLevelName + '-' + this.selectCycleName].subsc_price)
      }
      return 0
    },
    subscRealPrice () {
      if (this.priceMap[this.selectLevelName + '-' + this.selectCycleName]) {
        return utils.fenToYuan(this.priceMap[this.selectLevelName + '-' + this.selectCycleName].subsc_real_price)
      }
      return 0
    }
  },
  created () {
    if (this.$route.query.tabId) {
      if (this.$route.query.id && this.$route.query.id >= 1 && this.$route.query.id <= this.docs.length) {
        this.helpId = parseInt(this.$route.query.id)
      }
      this.activeName = this.$route.query.tabId
    } else {
      this.activeName = 'basic'
    }
  },
  mounted () {
  },
  activated () {
  },
  methods: {
    onLogin () {
      let host = encodeURI(window.location.protocol + '//' + window.location.host)
      let state = {}
      if (process.env.BUILD_ENV !== 'prod') {
        state['host'] = host
      }
      let shareId = this.$route.query.share_id
      if (shareId) {
        state['share_id'] = shareId
      }
      window.location.href = 'https://mms.pinduoduo.com/open.html?&state=' + JSON.stringify(state) + '&response_type=code&client_id=eb864d87975a4716878287d2855c8d55&redirect_uri=https://optimize.huhuguanjia.com/authorize'
    },
    createOrder () {
      this.request('createOrder', { 'subsc_item_cycle_id': this.selectSubscItemId }, data => {
        this.$router.push({
          path: '/payOrder/' + data['subsc_order_id']
        })
      })
    },
    goBack () {
      this.helpId = 0
      this.$router.push({
        query: merge(this.$route.query, {'id': 0, 'tabId': 'help'})
      })
    },
    showHelp (id) {
      this.helpId = id
      this.$router.push({
        query: merge(this.$route.query, {'id': id, 'tabId': 'help'})
      })
    },
    copyShareLink () {
      let aux = document.createElement('input')
      aux.setAttribute('value', window.location.protocol + '//' + window.location.host + '?share_id=' + this.ownerId)
      document.body.appendChild(aux)
      aux.select()
      document.execCommand('copy')
      document.body.removeChild(aux)
      this.shareLinkCopied = true
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/appinfo.less';
    .first-title {
      display: table;
      width: 100%;
      line-height: 32px;
      background-color: #fff;
      white-space: nowrap;
      border-spacing: .2rem 0;
      font-size:28px;
    }
    .first-title:before,
    .first-title:after {
        display: table-cell;
        content: '';
        width: 40%;
        background: -webkit-linear-gradient(#eee, #eee) repeat-x left center;
        background: linear-gradient(#eee, #eee) repeat-x left center;
        background-size: 0.1rem 0.1rem;
    }
    .second-contain{
      text-align: left;
      margin-left: 40px;
      margin-top: 15px;
    }
    .second-title{
      font-size: 28px;

      color: #56a2f3;
    }
    .second-title-desc {
      margin-left: 40px;
    }
    .second-img{
      margin-left: 60px;
      width: 550px;
      height: 350px;
    }

</style>

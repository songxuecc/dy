<template lang="html">
    <div class="info-page">
        <el-tabs v-model="activeName">
          <el-tab-pane label="关于我们" class="my-info" name="company">
            <div class="title">
              虎虎搬家助手
            </div>
            <p class="info">
              属于上海虎正奔信息科技有限公司旗下品牌。
            </p>
            <div>
              <span class="info describe-text">
                上海虎正奔信息科技有限公司是一家为电商企业提供新型店铺经营管理的互联网公司。致<br>力于帮助企业降低运营成本、提升运营效率、促进交易转化。
              </span>
            </div>
            <div class="flex justify-c">
              <div class="company-info">
                <p><hh-icon type="icongongsimingcheng" style="font-size:18px" /><span>公司名称：</span>上海虎正奔信息科技有限公司</p>
                <p><hh-icon type="icongongsidizhi" style="font-size:18px" /><span>地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：</span>上海浦东软件园22号楼310室</p>
                <p><hh-icon type="iconlianxifangshi" style="font-size:18px" /><span>联系方式：</span><a href="mailto:huhu_yunying@taofengcai.com?"><em>huhu_yunying@taofengcai.com</em></a></p>
                <p class="center"><el-link href="http://www.beian.gov.cn/portal/registerSystemInfo" target="_blank" :underline="false">沪ICP备16034003号</el-link></p>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      <br>
      <br>
    </div>
</template>
<script>
export default {
  data () {
    return {
      activeName: 'company'
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .el-button {
  vertical-align: middle;
  width: 100px;
}

/deep/ .desc-img {
  float: left;
}

.info {
  margin: 0 auto;
  .el-image {
    padding: 0;
    margin: 0;
    border: 0;
    display: block;
  }
}
.info-page {
  .my-info {
    text-align: center;
    color: #333333;
    padding-top: 30px;
    .info {
      font-size: 14px;
      margin-bottom: 20px;
    }
    .describe-text {
      text-align: left;
      margin: auto;
      display: inline-block;
    }
    .title {
      font-size: 24px;
      letter-spacing: 0;
      margin-bottom: 6px;
      font-weight: bold;
    }
    .company-info {
      text-align: left;
      padding-top: 18px;
      p {
        font-size: 14px;
        letter-spacing: 0;
        margin-bottom: 20px;
        span {
          padding-left: 3px;
        }
        svg {
          padding-right: 4px;
          position: relative;
          top: 1px;
        }
        em {
          color: #1d8fff;
          cursor: pointer;
          text-decoration: underline;
        }
      }
    }
  }
}
</style>

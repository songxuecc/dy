<!--  -->
<template>
    <div class="relative">
        <el-button size="mini" style="width:120px;align-content:flex-start" @click="reTry" >批量重试</el-button>
        <span v-if="selecReTryList && selecReTryList.length" class="badge bold">{{selecReTryList.length}}</span>
    </div>
</template>

<script>
import request from '@/mixins/request.js'

import {
  mapActions,
  mapMutations,
  mapState
} from 'vuex'
export default {
  mixins: [request],
  inject: ['reload'],
  name: 'ReCaptureBtn',
  props: {
    selecReTryList: Array
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState('migrate/readyToMigrate', ['userVersion'])
  },
  methods: {
    ...mapActions('migrate/readyToMigrate', ['userVersionQuery']),
    ...mapMutations('migrate/readyToMigrate', {
      'saveReadyToMigrate': 'save'
    }),
    reTry () {
      console.log(this.selecReTryList)
      const urls = this.selecReTryList.map(item => item.url)
      this.capture({
        capture_type: 0,
        urls
      })
    },
    async capture (parmas) {
      try {
        let self = this
        this.isStartCapture = true
        this.request(
          'capture',
          parmas,
          async data => {
            // 试用用户判断抓取是否有限制
            const userVersion =
              this.userVersion || (await this.userVersionQuery())
            console.log(userVersion, 'userVersion')
            const isFreeUpgrate = userVersion.is_free_upgrate
            const isSenior = userVersion.is_senior
            const versionTipType = userVersion.version_type
            if (
              !isFreeUpgrate &&
              !isSenior &&
              data.left_capture_nums_not_enough
            ) {
              // 3个月试用引导内部升级
              // 7天试用引导在服务市场
              if (versionTipType === 'free_three_months') {
                this.saveReadyToMigrate({
                  modalChargeData: data,
                  modalChargeTreeMonthVisible: true
                })
              } else {
                this.saveReadyToMigrate({
                  modalChargeData: data,
                  modalChargeSevenDaysVisible: true
                })
              }
              this.isStartCapture = false
              return false
            }
            // 高级版 充值限制
            if (data.left_capture_nums_not_enough) {
              this.saveReadyToMigrate({
                modalChargeData: data,
                modalChargeVisible: true
              })
              this.isStartCapture = false
              return false
            }

            this.isStartCapture = false
            let captureId = data.capture_id
            this.$router
              .replace({
                path: '/migrate/productList',
                query: {
                  captureId: captureId
                }
              })
              .catch(() => {})
            this.reload()
            // if (this.userBindList.length) {
            //   this.$refs.modelCopyForm &&
            //     this.$refs.modelCopyForm.resetFields &&
            //     this.$refs.modelCopyForm.resetFields()
            // }
          },
          err => {
            let el = ''
            if (this.activeName === 'bindCopy') {
              el = `<br/><a href='https://meideng.yuque.com/books/share/0b65c4cb-9f2a-4099-bb6e-9415844b7ccf/tm5odl' target='_blank' style="color:#1D8FFF;font-size:12px">点击查看帮助</a>`
            }
            this.$alert(`${err.message}` + el, '警告', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确定',
              type: 'error',
              callback: action => {
                self.isStartCapture = false
              }
            })
          },
          true
        )
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.badge {
    background-color: #E6A23C;
    border-radius: 50%;
    color: #FFF;
    display: inline-block;
    font-size: 12px;
    height: 12px;
    line-height: 12px;
    padding: 2px 2px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid #FFF;
  }
  /deep/ .el-button--mini, .el-button--mini.is-round {
    padding: 0 8px;
    height: 28px;
  }

  /deep/ .el-dialog {
    .el-dialog__header {
      padding-top: 30px;
      margin-bottom:20px;
      font-weight:bold;
      .el-dialog__title {
        font-size:22px;
      }
    }
    .el-dialog__headerbtn {
      .el-dialog__close {
        position: absolute;
        top: 10px;
        right: 20px;
        height: 24px;
        width: 24px;
        line-height: 24px;
        font-size: 17px;
        border-radius: 50%;
        color: #fff;
        background: #d4d4d4;
        text-align: center;
        font-weight: bolder;
        z-index: 1999;
      }
      &:focus .el-dialog__close,
      &:hover .el-dialog__close {
        color: #fff;
      }
    }
    .el-dialog__body {
      padding-top: 0;
    }
  }
  /deep/ .el-dialog {
    border-radius: 10px;
  }
  /deep/ .el-progress-bar {
    // width: 80%;
    margin-right: -80px;
    padding-right: 80px;
  }
  /deep/ .el-progress__text{
    color:#999999;
    font-size:12px !important;
    margin-left: 0;
    padding-left:10px;
    box-sizing:border-box
  }
  /deep/ .el-progress{
    width:100%;
    display: flex;
    justify-content: center;
    margin-top:20px;
    align-items: center;
  }

  .badge{
    position:absolute;
    right:-10px;
    top:-10px;
    font-size:12px;
    transform:scale(0.7);
    background:#dc4041;
    border-radius:10px;
    height:20px;
    min-width:20px;
    box-sizing:border-box;
    line-height:16px;
    padding:2px 4px;
    color:#fff
  }
</style>

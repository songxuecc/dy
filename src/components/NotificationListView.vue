<template lang="html">
    <div>
        <el-table :data="notificationList" :show-header="false" stripe row-key="id"
                  style="max-height: 450px; overflow: auto; overflow-x: hidden;"
        >
            <el-table-column>
                <template slot-scope="scope">
                    <el-row style="padding-bottom: 10px; display:flex;">
                        <el-col :span="21" style="font-size: 18px;">
                            <strong><span>{{ scope.row.title === '-' ? '通知' : scope.row.title }}</span></strong>
                        </el-col>
                        <el-col :span="3" style="margin-right:0">
                            <span>{{ scope.row.start_time.substr(0, 10) }}</span>
                        </el-col>
                    </el-row>
                    <div :ref="'notification'+scope.row.id" style="padding-bottom: 10px;"></div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {},
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      notificationList: 'getNotificationList',
      ignoreNotiList: 'getIgnoreNotiList'
    })
  },
  mounted () {
  },
  methods: {
    ...mapActions([
      'ignoreNotification'
    ]),
    init () {
      let dicIgnore = {}
      for (let i in this.ignoreNotiList) {
        dicIgnore[this.ignoreNotiList[i]] = 1
      }
      this.$nextTick(function () {
        for (let i in this.notificationList) {
          let notification = this.notificationList[i]
          if (notification.id in dicIgnore) {
            notification['is_ignore'] = dicIgnore[notification.id]
          } else {
            notification['is_ignore'] = 0
          }
          this.$set(this.notificationList, i, notification)
          this.$refs['notification' + notification.id].innerHTML = notification.data
        }
      })
    },
    didRead (notification) {
      for (let i in this.notificationList) {
        let n = this.notificationList[i]
        if (n.id === notification.id) {
          notification['is_ignore'] = 1
          this.$set(this.notificationList, i, notification)
        }
      }
      this.ignoreNotification(notification.id.toString())
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/base.less';
</style>

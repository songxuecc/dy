<template>
  <div style="text-align: left;">
    <el-container>
      <el-header>
        <el-button @click="doCmd('all')">
          重启所有队列
        </el-button>
        <el-button @click="doCmd('django_code')">
          重启django-web
        </el-button>
        <el-button @click="doCmd('fe')">
          重启前端fe
        </el-button>
      </el-header>
      <el-main>
        <div style="display: inline-block;" v-for="(item, index) in queueList" :key="index">
          <el-card class="box-card" style="width: 320px; height:300px">
            <div slot="header" class="clearfix">
              <span>{{item.queue_group_name}}</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="doCmd(item.queue_group_name)">重启队列</el-button>
            </div>
            <div v-for="(queue_item, index) in item.queue_item_list" :key="index" class="text item">
              {{ queue_item.queue + ': ' + queue_item.task_nums }}
            </div>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import request from '@/mixins/request.js'
export default {
  mixins: [request],
  data () {
    return {
      queueList: []
    }
  },
  mounted () {
    this.refreshTask()
  },
  methods: {
    refreshTask () {
      let self = this
      this.request('getTaskNums', {}, data => {
        self.queueList = data
        // 5秒刷新一次任务数
        setTimeout(function () {
          self.refreshTask()
        }, 5000)
      })
    },
    doCmd (cmd) {
      let self = this
      self.request('doCmd', {'cmd': cmd}, data => {
        self.$message.success(data)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 280px;
  display: inline-block;
  margin-left: 10px;
}
</style>

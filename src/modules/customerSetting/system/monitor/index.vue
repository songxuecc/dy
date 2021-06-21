<template>
  <div>
    <el-card v-for="(item, index) in queueList" :key="index" class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ item.queue }}</span>
      </div>
      {{ item.task_nums }}
    </el-card>
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

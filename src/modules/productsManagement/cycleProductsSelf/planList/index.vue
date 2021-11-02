<!-- 同步计划记录 -->
<template>
  <div class='left cycleProductsSelf'>
    <div class="alert">
            <div>
              <hh-icon type="icontishi" ></hh-icon>
              什么是定时上下架？
              <span class="right click" style="margin-left:auto;margin-right:10px;font-weight: 400; font-size: 12px;" v-hh-open="'https://www.yuque.com/huxiao-rkndm/ksui6u/qyqwt0'">
                点我查看教程视频
              </span>
            </div>
            <p>提前设置上下架类型及上下架时间，系统会根据你的设置按时进行上下架操作</p>

      </div>
      <div class="flex align-c mb-10">
        <el-button type="primary" size="medium" @click="createPlan">创建定时上下架计划</el-button>
        <span style="margin-left:5px;font-weight:normal" class="syncProducts flex align-c">
          <span v-if="getSyncButtonStatus === 'ready'"><hh-icon type="iconjingshi1"></hh-icon> 在操作前请先同步后台商品，正在准备同步后台商品... <i class="el-icon-loading"></i></span>
          <span v-else-if="getSyncButtonStatus === 'running'"><hh-icon type="iconjingshi1"></hh-icon> 在操作前请先同步后台商品，正在同步后台商品...<span class="bold">{{getSyncButtonText}}</span> <i class="el-icon-loading"></i></span>
          <span v-else><hh-icon type="iconjingshi1"></hh-icon> 在操作前请先<span class="underline pointer" @click="handleSyncProducts">同步后台商品</span>（最近同步时间：<span class="bold">{{getSyncButtonText}}</span>），待商品更新至最新再操作</span>
        </span>
        <span class="right click" style="margin-left:auto;margin-right:10px;font-weight: 400; font-size: 12px;" v-hh-open="'https://www.yuque.com/huxiao-rkndm/ksui6u/qyqwt0'">
          <hh-icon type="icontishi" ></hh-icon>
          点我查看教程视频
        </span>
      </div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading || loadingPost">
      <el-table-empty slot="empty"/>
      <el-table-column prop="task_name" label="计划名称"></el-table-column>
      <el-table-column prop="task_type_str" label="计划类型"  align="center" width="145">
        <template slot-scope="scope">
          <div>
            {{scope.row.task_type_str}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="task_name" label="上下架时间" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.on_shelf_time">上架: {{scope.row.on_shelf_time}}</div>
          <div v-if="scope.row.off_shelf_time">下架: {{scope.row.off_shelf_time}}</div>
        </template>
      </el-table-column>

      <el-table-column prop="expected_goods_nums" label="预计上下架商品数" align="center" width="125"></el-table-column>
      <el-table-column prop="expected_goods_nums" label="实际上下架商品数" align="center" width="125">
        <template slot-scope="scope">
          <div v-if="scope.row.on_shelf_goods_nums">上架: {{scope.row.on_shelf_goods_nums}}</div>
          <div v-if="scope.row.off_shelf_goods_nums">下架: {{scope.row.off_shelf_goods_nums}}</div>
          <div v-if="[5,6].includes(scope.row.task_type) && [1,2].includes(scope.row.status)" @click="handleDetailShelfProducts(scope.row)" class="primary">点击查看</div>
          <div v-else>-</div>
        </template>
      </el-table-column>

       <el-table-column prop="status" label="状态"   align="center" width="95">
        <template slot-scope="scope">
          <el-link :underline="false" class="font-12 no-decoration" type="info" v-if="scope.row.status === 0">未开始</el-link>
          <el-link :underline="false" class="font-12 no-decoration" type="warning" v-if="scope.row.status === 1">进行中</el-link>
          <el-link :underline="false" class="font-12 no-decoration" type="danger" v-if="scope.row.status === 2">已结束</el-link>
          <el-link :underline="false" class="font-12 no-decoration" type="danger" v-if="scope.row.status === 3">已终止</el-link>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150"  align="center">
         <template slot-scope="scope">
          <a class="pramiry pointer pl-5" @click="onEditPlan(scope.row,2)" v-if="scope.row.status === 0">编辑计划</a>
          <a class="pramiry pointer pl-5" @click="onDetail(scope.row)" v-if="[1,2].includes(scope.row.status)">查看详情</a>
          <a class="pramiry pointer pl-5" @click="onOpenPlan(scope.row)" v-if="scope.row.status === 3">恢复计划</a>
          <a class="fail pointer pl-5" @click="onClose(scope.row)" v-if="[0,1].includes(scope.row.status)">终止计划</a>
          <a class="fail pointer pl-5" @click="onDelete(scope.row)" v-if="[2,3].includes(scope.row.status)">删除计划</a>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.page_index"
      class=" pt-20 right mr-20"
      :page-size="pagination.page_size"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <el-dialog
      title="实际上下架商品数"
      :visible.sync="visible"
      width="500px"
      :append-to-body="true"
    >
       <div class="left cycleProductsSelf-planList-dialog" v-for="(item,index) in activeDetailShelfProductsData.sub_task_list" :key="index">
        <h1>第{{index + 1}}次循环</h1>
        <div class="c">
          <div class="width-190">
            <div class="text mb-4">上架时间：{{item.on_shelf_time}}</div>
            <div class="text">实际上架商品数：{{item.on_shelf_nums}}</div>
          </div>
          <el-divider direction="vertical" style="height:32px"></el-divider>
          <div class="pl-40">
            <div class="text mb-4">下架时间：{{item.off_shelf_time}}</div>
            <div class="text">实际下架商品数：{{item.on_shelf_nums}}</div>
          </div>
        </div>
        </div>
    </el-dialog>

  </div>
</template>

<script>
// import DrawerSyncDetail from './DrawerSyncDetail'
import services from '@servises'
import debounce from 'lodash/debounce'

import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters
} from 'vuex'
export default {
  name: 'planList',
  props: {
  },
  data () {
    return {
      visible: false,
      loadingPost: false,
      activeDetailShelfProductsData: {}
    }
  },
  created () {
    this.fetch()
  },
  activated () {
    this.fetch()
  },
  components: {
    // DrawerSyncDetail
  },
  computed: {
    ...mapGetters(['getSyncStatus', 'getIsAuth', 'getSyncing', 'getSyncButtonText', 'getSyncButtonStatus']),
    ...mapState('productManagement/cycleProductsSelf/planList', [
      'tableData',
      'total',
      'pagination',
      'filters',
      'form'
    ]),
    ...mapState({
      loading: state => state['@@loading'].effects['productManagement/cycleProductsSelf/planList/query']
    })
  },
  methods: {
    ...mapMutations('productManagement/cycleProductsSelf/chooseProducts', ['save']),
    ...mapActions('productManagement/cycleProductsSelf/chooseProducts', ['clear']),
    ...mapActions('productManagement/cycleProductsSelf/planList', [
      'fetch',
      'handleCurrentChange',
      'handleSizeChange'
    ]),
    ...mapActions('productManagement/cycleProductsSelf/chooseProducts', {
      setFilter_tableProductList: 'setFilter'
    }),
    ...mapActions(['handleSyncProducts']),
    createPlan () {
      this.$router.push({
        name: 'cycleProductsSelf_CreatePlan'
      })
    },
    onOpenPlan (row) {
      this.loadingPost = true
      const parmas = {
        task_id: row.task_id
      }
      services.productAutoShelfOpen(parmas)
        .then(data => {
          this.fetch()
          this.loadingPost = false
        })
        .catch(err => {
          this.$message.error(`${err}`)
          this.loadingPost = false
        })
    },
    onClose (row) {
      const h = this.$createElement
      this.$confirm('', {
        message: h('div', null, [
          h('div', {
            class: 'center'
          }, [
            h('hh-icon', {
              props: {
                type: 'iconjinggao1'
              },
              class: 'planList-icon'
            })
          ]),
          h('div', {
            class: 'planList-text'
          }, '确认终止该计划？终止后系统将不再执行任何操作?')
        ]),
        type: 'warning',
        confirmButtonText: '确认终止',
        cancelButtonText: '点错了',
        customClass: 'planList-customClass',
        cancelButtonClass: 'planList-cancelButtonClass',
        confirmButtonClass: 'planList-confirmButtonClass',
        showClose: false
      })
        .then(_ => {
          const parmas = {
            task_id: row.task_id
          }
          this.loadingPost = true
          services.productAutoShelfClose(parmas)
            .then(data => {
              this.fetch()
              this.loadingPost = false
            })
            .catch(err => {
              this.$message.error(`${err}`)
              this.loadingPost = false
            })
        })
        .catch(_ => {
          return false
        })
    },
    onDelete (row) {
      const h = this.$createElement
      this.$confirm('', {
        message: h('div', null, [
          h('div', {
            class: 'center'
          }, [
            h('hh-icon', {
              props: {
                type: 'iconjinggao1'
              },
              class: 'planList-icon'
            })
          ]),
          h('div', {
            class: 'planList-text'
          }, '确定删除该计划?')
        ]),
        type: 'warning',
        customClass: 'planList-customClass',
        cancelButtonClass: 'planList-cancelButtonClass',
        confirmButtonClass: 'planList-confirmButtonClass',
        showClose: false
      })
        .then(_ => {
          const parmas = {
            task_id: row.task_id
          }
          this.loadingPost = true
          services.productAutoShelfDelete(parmas)
            .then(data => {
              this.fetch()
            })
            .catch(err => {
              this.$message.error(`${err}`)
            })
            .finally(() => {
              this.loadingPost = false
            })
        })
        .catch(_ => {
          return false
        })
    },
    handleCreateSyncPlan () {
      this.$emit('go')
    },
    handleGo (row, type) {
      this.clear()
      this.$emit('go', row, type)
    },
    onDetail: debounce(function (row) {
      this.$router.push({
        name: 'cycleProductsSelf_PlanDetail',
        query: {
          task_id: row.task_id
        }
      })
    },
    1000,
    {
      leading: true
    }),
    // 修改计划
    onEditPlan (row) {
      this.$router.push({
        name: 'cycleProductsSelf_CreatePlan',
        query: {
          task_id: row.task_id
        },
        params: row.ext
      })
    },
    // 点击查看
    handleDetailShelfProducts (row) {
      services.productAutoShelfDetail({task_id: row.task_id})
        .then((data) => {
          console.log(data, 'data')
          this.activeDetailShelfProductsData = data
          this.visible = true
        })
    },
    objToStrMap (obj) {
      let strMap = new Map()
      for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k])
      }
      return strMap
    },
    // 修改商品 我是一件全选
    async handleChangeProduct (row, type) {
      const filters = {
        ...row.style.filters,
        capture_status: 1
      }
      const form = row.style.form
      const selectParmas = row.style.selectParmas
      const originFilters = row.style.originFilters
      const multipleSelection = row.style.multipleSelection
      this.setFilter_tableProductList({filters}).then(() => {
        this.save({
          form,
          selectParmas,
          originFilters,
          filters,
          multipleSelection,
          task_id: row.task_id
        })
        this.$emit('go', row, type)
      })
    },
    // 开始检测
    onStartSync: debounce(function (row) {
      const parmas = {
        task_id: row.task_id,
        from: 'index'
      }
      this.loadingPost = true
      services.productSourceSyncDetailRun(parmas)
        .then(data => {
          console.log(data, 'data')
          this.$message.success('开始检测了！')
          this.fetch()
        })
        .catch(err => {
          this.$message.error(`${err}`)
        })
        .finally(() => {
          this.loadingPost = false
        })
    },
    1000,
    {
      leading: true
    })
  }
}
</script>
<style lang="less" scoped>
.cycleProductsSelf {
  padding: 20px 30px;
  .alert {
    padding:12px 16px;
    height: 48px;
    background: #FFF6ED;
    border-radius: 4px;
    border: 1px solid rgba(250, 100, 0, 0.2);
    margin-bottom: 16px;
    p {
      width: 648px;
      height: 16px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #666666;
      line-height: 16px;
      margin-top: 10px;
      margin-left: 17px;
    }
  }
}

.disbaled {
  color: #999999;
  cursor: no-drop;
}
.syncProducts {
    height: 30px;
    background: #EAEDFA;
    border-radius: 15px;
    line-height: 30px;
    font-size: 12px;
    color: #999999;
    padding: 0 12px;
  }
</style>
<style lang="less">
.planList-cancelButtonClass{
  font-size: 12px;
  margin-right: 10px;
  width: 120px;
  padding: 12px;
  border-color: #1D8FFF;
  color: #1D8FFF;
  font-size: 14px;
}

.planList-confirmButtonClass{
  font-size: 12px;
  width: 140px;
  padding: 12px;
  font-size: 14px;
  background: #1D8FFF;
}

.planList-icon {
  width: 50px;
  height: 50px;
  font-size: 50px;
}

.planList-text {
  width: 364px;
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4E4E4E;
  line-height: 20px;
  text-align: center;
  margin-top: 16px;
  margin-bottom: 20px;
}

.planList-customClass {
    padding-bottom: 20px;
    .el-message-box__header {
      padding-top: 0;
    }
    .el-message-box__btns {
      text-align: center;
    }
    .el-message-box__content {
      .el-message-box__message {
        padding-left: 0;
      }
      p {
        font-size: 18px;
        margin: 15px 0 10px;
        text-align: center;
      }
      .el-icon-warning {
        display: none;
      }
    }
}

.cycleProductsSelf-planList-dialog {
  h1 {
    height: 19px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #4E4E4E;
    line-height: 19px;
  }
  .c {
    height: 60px;
    background: #EAEDFA;
    align-items: center;
    display: flex;
    margin-top: 8px;
    padding: 0 30px;
    justify-content: space-between;
  }
  .text {
    height: 16px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #4E4E4E;
    line-height: 16px;
    width: 190px;
  }
  .mb-4 {
    margin-bottom: 4px;
  }
  .width-190 {
    width: 190px;
    box-sizing: border-box;
  }
  .pl-40 {
  }
  .el-divider--vertical {
    height: 32px;
    margin:0;
  }
}
</style>

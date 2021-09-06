<!-- 同步计划记录 -->
<template>
  <div class='left productsSync'>
    <div class="alert">
            <div>
              <hh-icon type="icontishi" ></hh-icon>
              什么是商品源同步？
              <span class="right click" style="margin-left:auto;margin-right:10px;font-weight: 400; font-size: 12px;" v-hh-open="'https://www.yuque.com/huxiao-rkndm/ksui6u/qyqwt0'">
                点我查看教程视频
              </span>
            </div>
            <p>当货源方的价格、库存、标题、上下架信息发生变化时，系统将检测变化并做出修改。避免因货源方的信息变化造成损失。</p>
      </div>
      <el-button type="primary" size="medium" class="mb-10" @click="handleGo(undefined,2)">创建商品源同步计划</el-button>

    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="task_title" label="计划名称" >
        <template slot-scope="scope">
          <div>
            我是计划名称最多20个 字最多两行字最多两行
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sync_type" label="计划类型"  align="center" width="195">
        <template slot-scope="scope">
          <div>
            {{sync_type[scope.row.sync_type || 2]}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="total_nums" label="商品数" align="center" width="65">
      </el-table-column>
      <el-table-column   label="检测结果" align="center" width="195">
        <template slot-scope="scope">
          <div>
            <div class="color-4e font-13 mb-5">
              <span>成功{{scope.row.success_nums}}</span>
              <span>失败{{scope.row.fail_nums}}</span>
            </div>
            <div class="color-999 font-12">2021-08-25 22:42:58 完成检测</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态"   align="center" width="65">
        <template slot-scope="scope">
          <div>
            {{status[scope.row.status]}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="310"   align="center">
         <template slot-scope="scope">
          <a class="pramiry pointer " @click="onDelete(scope.row)" v-if="scope.row.sync_type === 1">开始检测</a>
          <a class="pramiry pointer " @click="onDelete(scope.row)" v-else>开始检测修改</a>
          <a class="pramiry pointer pl-5" @click="handleOpen(scope.row)" >检测详情</a>
          <a class="pramiry pointer pl-5" @click="handleGo(scope.row,3)" >修改商品</a>
          <a class="pramiry pointer pl-5" @click="handleGo(scope.row,2)" >编辑计划</a>
          <a class="fail pointer pl-5" @click="onDelete(scope.row)" >删除</a>
        </template>
      </el-table-column>
    </el-table>

    <DrawerSyncDetail ref="DrawerSyncDetail" />
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

  </div>
</template>

<script>
import DrawerSyncDetail from './DrawerSyncDetail'
import {
  mapActions,
  mapState
} from 'vuex'
export default {
  name: 'TableSyncRecord',
  props: {
    msg: String
  },
  data () {
    return {
      status: {
        0: '未开始',
        1: '进行中',
        2: '已完成',
        3: '失败'
      },
      sync_type: {
        1: '检测变化并提交修改',
        2: '仅检测变化，需人工提交修改'
      }
    }
  },
  created () {
    this.fetch()
  },
  watch: {
  },
  components: {
    DrawerSyncDetail
  },
  computed: {
    ...mapState('productManagement/productsSync/tableSyncRecord', [
      'tableData',
      'total',
      'pagination',
      'filters'
    ]),
    ...mapState({
      loading: state => state['@@loading'].effects['productManagement/productsSync/tableSyncRecord/query']
    })
  },
  methods: {
    ...mapActions('productManagement/productsSync/tableSyncRecord', [
      'fetch',
      'handleCurrentChange',
      'handleSizeChange'
    ]),
    onDelete () {
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
              class: 'TableSyncRecord-icon'
            })
          ]),
          h('div', {
            class: 'TableSyncRecord-text'
          }, '确定删除该计划?')
        ]),
        type: 'warning',
        customClass: 'TableSyncRecord-customClass',
        cancelButtonClass: 'TableSyncRecord-cancelButtonClass',
        confirmButtonClass: 'TableSyncRecord-confirmButtonClass',
        showClose: false
      })
        .then(_ => {
          console.log('00000')
        })
        .catch(_ => {
          return false
        })
    },
    handleCreateSyncPlan () {
      this.$emit('go')
    },
    handleOpen (row) {
      this.$nextTick(() => {
        this.$refs.DrawerSyncDetail && this.$refs.DrawerSyncDetail.open(row)
      })
    },
    handleGo (row, type) {
      this.$emit('go', row, type)
    }
  }
}
</script>
<style lang="less" scoped>
.productsSync {
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
</style>
<style lang="less">
.TableSyncRecord-cancelButtonClass{
  font-size: 12px;
  margin-right: 10px;
  width: 120px;
  padding: 12px;
}

.TableSyncRecord-confirmButtonClass{
  font-size: 12px;
  width: 120px;
  padding: 12px;
}

.TableSyncRecord-icon {
  width: 50px;
  height: 50px;
  font-size: 50px;
}

.TableSyncRecord-text {
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

.TableSyncRecord-customClass {
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
</style>

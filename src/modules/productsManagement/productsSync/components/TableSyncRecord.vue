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

    <el-table :data="tableData" style="width: 100%" v-loading="loading || loadingPost">
      <el-table-empty slot="empty"/>
      <el-table-column prop="task_title" label="计划名称" ></el-table-column>
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
            <div class="color-999 font-12" v-if="scope.row.last_sync_time">{{ scope.row.last_sync_time }} 完成检测</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态"   align="center" width="65">
        <template slot-scope="scope">
          <el-link :underline="false" class="font-12 flex column justify-c align-c no-decoration" type="primary" v-if="scope.row.status === 1">
            <span>进行中 <span v-if="scope.row.percent !== 100"> - {{scope.row.percent || 0}}%</span></span>
            <el-progress :percentage="scope.row.percent" :show-text="false" style="width:80px" :stroke-width="10"></el-progress>
          </el-link>
          <el-link :underline="false" class="font-12 no-decoration" type="warning" v-if="scope.row.status === 2">已完成</el-link>
          <el-link :underline="false" class="font-12 no-decoration" type="danger" v-if="scope.row.status === 3">失败</el-link>
          <el-link :underline="false" class="font-12 no-decoration" type="info" v-if="scope.row.status === 0">未开始</el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="310"   align="center">
         <template slot-scope="scope">
          <a class="pramiry pointer " @click="onStartSync(scope.row)" v-if="scope.row.sync_type === 1">开始检测修改</a>
          <a class="pramiry pointer " @click="onStartSync(scope.row)" v-else>开始检测</a>
          <a class="pramiry pointer pl-5" @click="handleDetail(scope.row)" >检测详情</a>
          <a class="pramiry pointer pl-5" @click="handleChangeProduct(scope.row,3)" >修改商品</a>
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
import services from '@servises'
import debounce from 'lodash/debounce'

import {
  mapActions,
  mapState,
  mapMutations
} from 'vuex'
export default {
  name: 'TableSyncRecord',
  props: {
    msg: String
  },
  data () {
    return {
      loadingPost: false,
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
      'filters',
      'form'
    ]),
    ...mapState({
      loading: state => state['@@loading'].effects['productManagement/productsSync/tableSyncRecord/query']
    })
  },
  methods: {
    ...mapMutations('productManagement/productsSync/tableProductList', ['save']),
    ...mapActions('productManagement/productsSync/tableSyncRecord', [
      'fetch',
      'handleCurrentChange',
      'handleSizeChange'
    ]),
    ...mapActions('productManagement/productsSync/tableProductList', {
      setFilter_tableProductList: 'setFilter'
    }),
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
          const parmas = {
            task_id: row.task_id
          }
          this.loadingPost = true
          services.productSourceSyncDelete(parmas)
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
      this.$emit('go', row, type)
    },
    handleDetail: debounce(function (row) {
      this.$nextTick(() => {
        this.$refs.DrawerSyncDetail && this.$refs.DrawerSyncDetail.open(row)
      })
    }, 1000),
    // 修改商品
    handleChangeProduct (row, type) {
      console.log(row, 'row')
      // this.$emit('go', row, type)
      const filters = row.goods_query_params
      // const form = {
      //   task_title:
      // }
      this.setFilter_tableProductList({filters})
      this.$emit('go', row, type)
    },
    // 开始检测
    onStartSync: debounce(function (row) {
      console.log(row, 'row')
      const style = row.style
      const parmas = {
        task_id: row.task_id,
        status: row.status,
        goods_id_list: style.selectParmas.goods_id_list,
        keyword: style.filters.keyword,
        delete_goods_id_list: style.selectParmas.delete_goods_id_list,
        is_all: style.selectParmas.is_all
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
    }, 1000)
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

<!-- 同步计划记录 -->
<template>
  <div class='left productsSync'>
    <div class="alert">
            <div>
              <hh-icon type="icontishi" ></hh-icon>
              什么是商品源同步？ <span class="font-12 warning">仅能选择2021.10.9后搬家上线的商品</span>
            </div>
            <p>当货源方的价格、库存、标题信息发生变化时，系统将检测变化并做出修改。避免因货源方的信息变化造成损失。</p>

      </div>
      <div class="flex align-c mb-10">
        <el-button type="primary" size="medium" @click="handleGo(undefined,2)">创建商品源同步计划</el-button>
        <span style="margin-left:5px;font-weight:normal" class="syncProducts flex align-c">
          <span v-if="getSyncButtonStatus === 'ready'"><hh-icon type="iconjingshi1"></hh-icon> 在操作前请先同步后台商品，正在准备同步后台商品... <i class="el-icon-loading"></i></span>
          <span v-else-if="getSyncButtonStatus === 'running'"><hh-icon type="iconjingshi1"></hh-icon> 在操作前请先同步后台商品，正在同步后台商品...<span class="bold">{{getSyncButtonText}}</span> <i class="el-icon-loading"></i></span>
          <span v-else><hh-icon type="iconjingshi1"></hh-icon> 在操作前请先<span class="underline pointer" @click="handleSyncProducts">同步后台商品</span>（最近同步时间：<span class="bold">{{getSyncButtonText}}</span>），待商品更新至最新再操作</span>
        </span>
        <span class="right click" style="margin-left:auto;margin-right:10px;font-weight: 400; font-size: 12px;" v-hh-open="'https://www.yuque.com/huxiao-rkndm/ksui6u/rnezxr'">
          <hh-icon type="icontishi-dengpao" ></hh-icon>
          商品源同步教程
        </span>
      </div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading || loadingPost">
      <el-table-empty slot="empty"/>
      <el-table-column prop="task_title" label="计划名称"></el-table-column>
      <el-table-column prop="style" label="计划内容" width="105">
        <template slot-scope="scope">
          <div>
            {{scope.row.style.form.config_json.is_sync_price ? '价格':''}}
            {{scope.row.style.form.config_json.is_sync_stock ? '库存':''}}
            {{scope.row.style.form.config_json.is_sync_title ? '标题':''}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sync_type" label="计划类型"  align="center" width="145">
        <template slot-scope="scope">
          <div>
            {{sync_type[scope.row.sync_type || 2]}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="total_nums" label="商品数" align="center" width="65">
      </el-table-column>
      <el-table-column   label="检测结果" align="center"  width="185">
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
      <el-table-column prop="status" label="状态"   align="center" width="95">
        <template slot-scope="scope">
          <el-link :underline="false" class="font-12 flex column justify-c align-c no-decoration" type="warning" v-if="scope.row.status === 1">
            <span>进行中 <span v-if="scope.row.percent !== 100"> - {{scope.row.percent || 0}}%</span></span>
            <el-progress :percentage="scope.row.percent" :show-text="false" style="width:64px" :stroke-width="10"></el-progress>
          </el-link>
          <el-link :underline="false" class="font-12" type="primary" v-if="scope.row.status === 2 && scope.row.sync_type !== 1" @click="handleDetail(scope.row)">
            <div>检测完成</div>
            <div>提交修改</div>
          </el-link>
          <el-link :underline="false" class="font-12" type="primary" v-if="scope.row.status === 2 && scope.row.sync_type === 1" @click="handleDetail(scope.row)">
            <div>检测完成</div>
            <div>查看修改结果</div>
          </el-link>
          <el-link :underline="false" class="font-12 no-decoration" type="danger" v-if="scope.row.status === 3">失败</el-link>
          <el-link :underline="false" class="font-12 no-decoration" type="info" v-if="scope.row.status === 0">未开始</el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300"  align="center">
         <template slot-scope="scope">
          <a class="pramiry pointer" @click="onStartSync(scope.row)" v-if="scope.row.sync_type === 1">开始检测修改</a>
          <a class="pramiry pointer" @click="onStartSync(scope.row)" v-else style="padding-left:22px">开始检测</a>
          <a class="pl-5" :class="scope.row.status === 0 ? 'disbaled' : 'pramiry pointer'" @click="handleDetail(scope.row)">检测详情</a>
          <!-- <a class="pramiry pointer pl-5" @click="handleChangeProduct(scope.row,3)" >修改商品</a> -->
          <a class="pramiry pointer pl-5" @click="handleEditPlan(scope.row,2)" >编辑计划</a>
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
  mapMutations,
  mapGetters
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
    ...mapGetters(['getSyncStatus', 'getIsAuth', 'getSyncing', 'getSyncButtonText', 'getSyncButtonStatus']),
    ...mapState('productManagement/productsSync/tableSyncRecord', [
      'tableData',
      'total',
      'pagination',
      'filters',
      'form'
    ]),
    ...mapState('productManagement/productsSync/tableSyncRecord', [
      'tableData',
      'total',
      'pagination',
      'filters',
      'form'
    ]),
    // ...mapState([
    //   'syncButtonText'
    // ]),
    ...mapState({
      loading: state => state['@@loading'].effects['productManagement/productsSync/tableSyncRecord/query']
    })
  },
  methods: {
    ...mapMutations('productManagement/productsSync/tableProductList', ['save']),
    ...mapActions('productManagement/productsSync/tableProductList', ['clear']),
    ...mapActions('productManagement/productsSync/tableSyncRecord', [
      'fetch',
      'handleCurrentChange',
      'handleSizeChange'
    ]),
    ...mapActions('productManagement/productsSync/tableProductList', {
      setFilter_tableProductList: 'setFilter'
    }),
    ...mapActions(['handleSyncProducts']),
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
              class: 'custome-confirm-icon'
            })
          ]),
          h('div', {
            class: 'custome-confirm-text'
          }, '确定删除该计划?')
        ]),
        type: 'warning',
        customClass: 'custome-confirm-customClass',
        cancelButtonClass: 'custome-confirm-cancelButtonClass',
        confirmButtonClass: 'custome-confirm-confirmButtonClass',
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
      this.clear()
      this.$emit('go', row, type)
    },
    handleDetail: debounce(function (row) {
      if (row.status === 0) return false
      this.$nextTick(() => {
        this.$refs.DrawerSyncDetail && this.$refs.DrawerSyncDetail.open(row)
      })
    },
    1000,
    {
      leading: true
    }),
    // 修改计划
    handleEditPlan (row, type) {
      console.log(row, 'row')
      const form = row.style.form
      const selectParmas = row.style.selectParmas
      const filters = row.style.filters
      const originFilters = row.style.originFilters
      const multipleSelection = row.style.multipleSelection

      this.save({
        form,
        selectParmas,
        originFilters,
        filters,
        multipleSelection,
        task_id: row.task_id
      })

      this.$emit('go', row, type)
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

      console.log(row, 'row')

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

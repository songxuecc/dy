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
      <el-button type="primary" size="medium" class="mb-10" @click="handleCreateSyncPlan">创建商品原同步计划</el-button>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="task_title" label="计划名称" >
      </el-table-column>
      <el-table-column prop="task_title" label="计划类型" >
      </el-table-column>
      <el-table-column prop="success_nums" label="商品数">
      </el-table-column>
      <el-table-column prop="date" label="同步结果" >
      </el-table-column>
      <el-table-column prop="create_time" label="状态" >
      </el-table-column>
      <el-table-column label="操作" width="270">
         <template slot-scope="scope">
          <a class="pramiry pointer " @click="onDelete(scope.row)">开始同步</a>
          <a class="pramiry pointer pl-5" @click="onDelete(scope.row)" >检测详情</a>
          <a class="pramiry pointer pl-5" @click="onDelete(scope.row)" >修改商品</a>
          <a class="pramiry pointer pl-5" @click="onDelete(scope.row)" >编辑计划</a>
          <a class="fail pointer pl-5" @click="onDelete(scope.row)" >删除</a>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="pagination.page_index" class=" pt-20 right mr-20" :page-size="pagination.page_size"  :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

  </div>
</template>

<script>
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
    }
  },
  created () {
    this.fetch()
  },
  computed: {
    ...mapState('productManagement/productsSync/tableSyncRecord', [
      'tableData',
      'total',
      'pagination',
      'filters'
    ])
  },
  methods: {
    ...mapActions('productManagement/productsSync/tableSyncRecord', [
      'fetch',
      'handleCurrentChange',
      'handleSizeChange'
    ]),
    onDelete () {

    },
    handleCreateSyncPlan () {
      this.$emit('handleCreateSyncPlan')
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

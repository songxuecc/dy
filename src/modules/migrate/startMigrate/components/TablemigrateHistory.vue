<!--  -->
<template>
    <div  class="TablemigrateHistory" v-if="visible">
        <el-table
        :data="tableData"
        cell-style="padding:5px"
        style="padding:0"
        v-loading="loading">
        <el-table-empty slot="empty"/>
        <el-table-column
            prop="shop_name"
            label="店铺名称"
            >
            <template slot-scope="scope">
              <el-link  :href="scope.row.url" target="_blank" :underline="false"  class="font-13">
                  {{ scope.row.shop_name }}
              </el-link>
            </template>
        </el-table-column>
        <el-table-column
            prop="source"
            label="平台"
            width="150">
        </el-table-column>
        <el-table-column
            prop="create_time"
            label="上次搜索时间"
            align="center"
            width="180">
        </el-table-column>
        <el-table-column
            prop="edit"
            label="操作"
            width="250"
            align="center">
            <template slot-scope="scope">
            <span class="primary " @click="handleUse(scope.$index, scope.row)">使用</span>
            <el-divider direction="vertical"></el-divider>
            <span class="primary " slot="reference" @click="handleDelete(scope.row)">删除</span>
          </template>
        </el-table-column>
        </el-table>
        <div class="relative" style="">
          <el-pagination
            @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pagination.page_index" class="right mr-20"
            :page-sizes="sizes"
            :page-size="pagination.page_size"
            layout="total, prev, pager, next, jumper"
            :total="total" ></el-pagination>
            <div class="refresh click" @click="refresh">刷新店铺复制记录</div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'TablemigrateHistory',
  data () {
    return {
      visible: false
    }
  },
  created () {
    this.fetchDetail({
      pagination: {
        page_size: 4,
        page_index: 1
      }
    })
  },
  computed: {
    ...mapState('migrate/startMigrate', ['pagination', 'sizes', 'total', 'tableData']),
    ...mapState({
      loading: state => {
        return state['@@loading'].effects['migrate/startMigrate/fetchDetail'] || state['@@loading'].effects['migrate/startMigrate/deleteCaptureId']
      }
    })
  },
  methods: {
    ...mapActions('migrate/startMigrate', ['fetchDetail', 'deleteCaptureId']),
    open () {
      this.visible = true
    },
    close () {
      this.visible = false
    },
    handleCurrentChange (pageIndex) {
      this.fetchDetail({
        pagination: {
          page_index: pageIndex
        }
      })
    },
    async handleDelete (row) {
      console.log(row, 'row')
      await this.deleteCaptureId({
        capture_id: row.capture_id
      })
      this.refresh()
    },
    handleUse (index, row) {
      this.visible = false
      this.$emit('change', row.url)
    },
    refresh () {
      this.fetchDetail({
        pagination: {
          page_size: 4,
          page_index: 1
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.refresh {
  position: absolute;
  top:5px;
  left:15px;
}

.TablemigrateHistory{
  position: absolute;
          width:100%;
          box-sizing:border-box;
          left: 0;
          top: 91px;
          padding-bottom:10px;
          box-shadow: 0 2px 6px 0 rgb(0 0 0 / 10%);
          border: 1px solid #E5E5E5;
          border-radius: 0 0 4px 4px;
          background:#fff;
          z-index:9;
}
</style>

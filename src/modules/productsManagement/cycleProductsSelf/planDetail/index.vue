<!-- 我的页面 -->
<template>
  <div class='left'>
      <div class="color-4e font-12 mb-12">
        <span class="mr-8">计划名称</span>
        <span class="mr-40">{{detail.task_name}}</span>
        <span class="mr-8">计划类型</span>
        <span class="mr-40">{{detail.task_type_str}}</span>
      </div>
      <div class="color-4e font-12 mb-20">
        <span v-if="[1].includes(detail.task_type)">
            <span class="mr-8">下架时间</span>
            <span class="mr-40">{{detail.off_shelf_time}}</span>
            <span class="mr-8">下架商品数</span>
            <span class="mr-40">{{detail.off_shelf_nums  || '—'}}</span>
        </span>
        <span v-if="[2].includes(detail.task_type)">
            <span class="mr-8">上架时间</span>
            <span class="mr-40">{{detail.on_shelf_time}}</span>
            <span class="mr-8">上架商品数</span>
            <span class="mr-40">{{detail.on_shelf_nums  || '—'}}</span>
        </span>
        <span v-if="[3,5].includes(detail.task_type)">
            <span class="mr-8">下架时间</span>
            <span class="mr-40">{{detail.off_shelf_time}}</span>
            <span class="mr-8">下架商品数</span>
            <span class="mr-40">{{detail.off_shelf_nums  || '—'}}</span>
            <span class="mr-8">上架时间</span>
            <span class="mr-40">{{detail.on_shelf_time}}</span>
            <span class="mr-8">上架商品数</span>
            <span class="mr-40">{{detail.on_shelf_nums  || '—'}}</span>
        </span>
        <span v-if="[4,6].includes(detail.task_type)">
            <span class="mr-8">上架时间</span>
            <span class="mr-40">{{detail.on_shelf_time}}</span>
            <span class="mr-8">上架商品数</span>
            <span class="mr-40">{{detail.on_shelf_nums  || '—'}}</span>
            <span class="mr-8">下架时间</span>
            <span class="mr-40">{{detail.off_shelf_time}}</span>
            <span class="mr-8">下架商品数</span>
            <span class="mr-40">{{detail.off_shelf_nums  || '—'}}</span>
        </span>
      </div>
      <div class="flex wrap font-12" v-if="[5,6].includes(detail.task_type)">
        <span
            v-for="(subTask,idx) in (!isOpen ? subTaskList.slice(0,18): subTaskList)"
            :key="idx"
            class="idx"
            :class="[carouselIndex === idx && 'primary', 'pointer underline']"
            @click="changeSubTask(idx)"
          >第{{idx+1}}次轮播</span>
      </div>
      <div  v-if="[5].includes(detail.task_type)" class="flex justify-b mb-15 mt-5" >
        <span v-if="!isOpen" class="info"  @click="open">
          <span class="mr-20">下架时间：{{shelf.on_shelf_time || '—'}}</span>
          <span class="mr-20">上架时间：{{shelf.off_shelf_time || '—'}}</span>
        </span>
        <span v-if="subTaskList.length > 18 && !isOpen">展开</span>
        <span v-if="subTaskList.length > 18 && isOpen">关闭</span>
      </div>

      <div  v-if="[6].includes(detail.task_type)" class="flex justify-b mb-15 mt-5" >
        <span v-if="!isOpen" class="info"  @click="open">
          <span class="mr-20">上架时间：{{shelf.off_shelf_time || '—'}}</span>
          <span class="mr-20">下架时间：{{shelf.on_shelf_time || '—'}}</span>
        </span>
        <span v-if="subTaskList.length > 18 && !isOpen">展开</span>
        <span v-if="subTaskList.length > 18 && isOpen">关闭</span>
      </div>

      <div class="mb-20">
        <el-radio-group v-model="shelfRadio" v-if="[3,4,5,6].includes(detail.task_type)" @change="handleChangeShelfRadio">
          <el-radio-button :label="shelf.off_shelf_task_id">下架操作</el-radio-button>
          <el-radio-button :label="shelf.on_shelf_task_id">上架操作</el-radio-button>
        </el-radio-group>
      </div>
      <div v-if="shelfRadio === shelf.off_shelf_task_id" class="mb-18">
        <span class="mr-20" @click="getStatusProducts(0)" :class="[status === 0 && shelfRadio === shelf.off_shelf_task_id && 'primary', 'pointer underline']">待下架</span>
        <span class="mr-20" @click="getStatusProducts(3)" :class="[status === 3 && shelfRadio === shelf.off_shelf_task_id && 'primary', 'pointer underline']">下架成功</span>
        <span class="mr-20" @click="getStatusProducts(4)" :class="[status === 4 && shelfRadio === shelf.off_shelf_task_id && 'primary', 'pointer underline']">下架失败</span>
      </div>
      <div v-if="shelfRadio === shelf.on_shelf_task_id" class="mb-18">
        <span class="mr-20" @click="getStatusProducts(0)" :class="[status === 0 && shelfRadio === shelf.on_shelf_task_id && 'primary', 'pointer underline']">待上架</span>
        <span class="mr-20" @click="getStatusProducts(3)" :class="[status === 3 && shelfRadio === shelf.on_shelf_task_id && 'primary', 'pointer underline']">上架成功</span>
        <span class="mr-20" @click="getStatusProducts(4)" :class="[status === 4 && shelfRadio === shelf.on_shelf_task_id && 'primary', 'pointer underline']">上架失败</span>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @select="handleSelection"
        highlight-current-row
        @select-all="handleSelectionAll"
        v-loading="loading"
        row-key="goods_id"
      >
        <el-table-empty slot="empty"/>
        <el-table-column label="图片" width="70" align="center" prop="id" >
          <template slot-scope="scope" v-if="scope.row.ext_json">
            <el-image
              style="height: 50px; max-width: 50px; border-radius: 2px"
              :src="scope.row.ext_json.image_url"
              fit="contain"
              :preview-src-list="[scope.row.ext_json.image_url]"
            >
              <div slot="placeholder">
                <hh-icon type="iconwuzhaopian" style="font-size: 50px" />
              </div>
              <div slot="error" class="flex align-c" style="height: 100%">
                <hh-icon
                  type="icontupianjiazaishibai03"
                  style="font-size: 30px"
                />
              </div>
            </el-image>
          </template>
        </el-table-column>

        <el-table-column label="标题" width="">
          <template slot-scope="scope"  v-if="scope.row.ext_json">
            <span>
              <el-link
              :underline="false"
              :href="
                'https://haohuo.jinritemai.com/views/product/detail?id=' +
                scope.row.ext_json.goods_id
              "
              target="_blank"
            >
              {{ scope.row.ext_json.goods_name }}
              </el-link>
              <hh-icon
                type="iconfuzhi "
                style="font-size: 12px"
                class="pointer "
                @click="
                  copy(scope.row.ext_json.goods_name, '商品名称 复制成功')
                "
              ></hh-icon>

            </span>
            <br />
            <div class="font-12 flex align-c color-999" style="margin-top: 3px">
              <span>商品ID: {{ scope.row.ext_json.goods_id }}
                  <hh-icon
                    type="iconfuzhi "
                    style="font-size: 12px"
                    class="pointer "
                    @click="
                      copy(scope.row.ext_json.goods_id, '商品ID 复制成功')
                    "
                  ></hh-icon>
                </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="fail_reason" label="原因" width="120">
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.page_index"
        class="pt-20 right mr-20"
        :page-size="pagination.page_size"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import servises from '@servises'

export default {
  data () {
    return {
      shelf: 0,
      detail: {},
      shelfRadio: 0,
      subTaskList: [],
      isOpen: false,
      carouselIndex: 0
    }
  },
  computed: {
    ...mapState({
      loading: (state) => state['@@loading'].effects['productManagement/cycleProductsSelf/planDetail/query']
    }),
    ...mapState('productManagement/cycleProductsSelf/planDetail', [
      'tableData',
      'total',
      'pagination',
      'filters',
      'form'
    ])
  },
  watch: {},
  activated () {
    this.init()
  },
  methods: {
    ...mapActions('productManagement/cycleProductsSelf/planDetail', [
      'fetch',
      'handleCurrentChange',
      'handleSizeChange',
      'setFilter',
      'clear'
    ]),
    async init () {
      // 查询初始化
      const taskId = this.$route.query.task_id
      this.taskId = taskId
      servises.productAutoShelfDetail({
        task_id: taskId
      }).then(data => {
        let carouselIndex = 0
        if (data.sub_task_list[carouselIndex]) {
          this.detail = data
          this.subTaskList = data.sub_task_list
          this.carouselIndex = carouselIndex
          this.shelf = data.sub_task_list[carouselIndex]
          this.status = 0

          if (data.task_type === 1) {
            this.shelfRadio = this.shelf.off_shelf_task_id
          } else if (data.task_type === 2) {
            this.shelfRadio = this.shelf.on_shelf_task_id
          } else if ([3, 5].includes(data.task_type)) {
            this.shelfRadio = this.shelf.off_shelf_task_id
          } else if ([4, 6].includes(data.task_type)) {
            this.shelfRadio = this.shelf.on_shelf_task_id
          }
          this.fetch({
            filters: {
              parent_id: this.shelfRadio,
              status: 0
            }
          })
        }
      })
    },
    copy: async function (id, text) {
      try {
        await this.$copyText(id)
        this.$message({
          message: text,
          type: 'success',
          duration: 1000
        })
      } catch (err) {
        this.$message({
          message: err,
          type: 'error',
          duration: 1000
        })
      }
    },
    getStatusProducts (status) {
      this.setFilter({
        filters: {
          status,
          parent_id: this.shelfRadio
        }
      })
      this.status = status
    },
    handleChangeShelfRadio (val) {
      this.setFilter({
        filters: {
          status: 0,
          parent_id: val
        }
      })
      this.status = 0
    },
    changeSubTask (idx) {
      this.carouselIndex = idx
      this.shelf = this.detail.sub_task_list[idx]
      this.status = 0
      this.fetch({
        filters: {
          parent_id: this.taskId,
          status: 0
        }
      })
    },
    open () {
      this.isOpen = !this.isOpen
    }
  }
}
</script>

<style lang='less' scoped>
//@import url(); 引入公共css类
.mr-8 {
  margin-right: 8px;
  display: inline-block;
  width: 60px;
}
.mr-40 {
  margin-right: 40px;
  display: inline-block;
  width: 160px;
}
.width-156 {
  width: 156px;
  display: inline-block;
}
.mb-12 {
  margin-bottom: 12px;
}

.mb-18 {
  margin-bottom: 18px;
  font-size: 12px;
}

.idx {
  display: inline-block;
  width: 70px;
  margin-right: 30px;
}
</style>

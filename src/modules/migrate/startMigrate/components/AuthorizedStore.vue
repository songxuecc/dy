<!--  -->
<template>
    <div v-loading="loading">
        <div v-if="!userBindTpBindLists.length" >
          <el-row class="flex mb-20" style="flex:1">
            <el-col :span="18" ><el-input v-model="tp_code" placeholder="根据抖音新规，跨店复制需要授权才以操作。如何授权点击下面的教程链接查看操作。"></el-input></el-col>
            <el-col :span="3"><el-button class="ml-10" @click="handleBind" type="primary" style="width:120px">授权店铺</el-button></el-col>
          </el-row>
          <div>
            <div  class="click" @click="gotoShouquan">教程链接: https://meideng.yuque.com/docs/share/730a3a18-0df7-4ea4-99a0-93f2c87e49c1?# </div>
            <div  class="click" @click="gotoPdd">点击进入源授权平台</div>
          </div>
        </div>
        <div v-if="userBindTpBindLists.length">
          <div class="mb-10 flex" v-if="tableData">
            授权店铺：
            <el-select v-model="bindShopId" size="mini" @change="handleSelect">
              <el-option
                v-for="item in userBindTpBindLists"
                :key="item.tp_user_id"
                :label="item.shop_name"
                :value="item.tp_user_id">
              </el-option>
            </el-select>
            <span class="click ml-10 flex align-c" @click="manageBindShop" >
              <hh-icon type="iconjibenshezhixuanzhong"></hh-icon>
              授权店铺管理
              <div  class="click ml-20" v-if="!tableData.length" @click="gotoPdd">点击进入源授权平台</div>  </span>
          </div>

          <el-table :data="tableData" style="width: 100%" >
            <el-table-empty slot="empty" >
              <div>您还未创建云商品库，<span @click="gotoPdd" class="click">点击我,进入源授权平台</span>,创建云商品库</div>
            </el-table-empty>
            <el-table-column prop="name" label="云商品库名称"></el-table-column>
            <el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>
            <el-table-column prop="shop_name" label="店铺名称" align="center"></el-table-column>
            <el-table-column prop="platform_name" label="平台" align="center"></el-table-column>
            <el-table-column label="操作" width="250"  align="center">
              <template slot-scope="scope">
                <div class="color-warning pointer pl-5 mb-5" @click="startCapture(scope.row)">跳过设置，直接复制</div>
                <div class="color-primary pointer pl-5" @click="goSettings(scope.row)">下一步：复制设置</div>
                <div class="color-danger pointer pl-5" @click="deleteClowndStore(scope.row)">删除</div>
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
        </div>

        <el-dialog title="授权店铺列表" :visible.sync="dialogTableVisible">
          <el-row class="flex mb-20" style="flex:1">
            <el-col :span="18" ><el-input v-model="tp_code" placeholder="请先输入授权码"></el-input></el-col>
            <el-col :span="3"><el-button class="ml-10" @click="addBindShop" type="primary" style="width:120px">添加授权店铺</el-button></el-col>
          </el-row>
          <el-table :data="userBindTpBindLists">
            <el-table-column property="shop_name" label="店铺名称"></el-table-column>
            <el-table-column property="shop_name" label="平台">拼多多</el-table-column>
            <el-table-column label="操作" width="150"  align="center">
              <template slot-scope="scope">
                <div class="color-warning pointer pl-5" @click="deleteBindShop(scope.row)">删除</div>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
    </div>
</template>

<script>
import services from '@services'

import {
  mapActions,
  mapState,
  mapMutations
} from 'vuex'

export default {
  name: 'AuthorizedStore',
  props: {
  },
  data () {
    return {
      tp_code: '',
      userBindTpBindLists: [],
      dialogTableVisible: false,
      bindShopId: ''
    }
  },
  created () {
    this.init()
  },
  computed: {
    ...mapState('migrate/startMigrate/authorizedStore', [
      'tableData',
      'total',
      'pagination',
      'filters'
    ]),
    ...mapState({
      loading: state => state['@@loading'].effects['migrate/startMigrate/authorizedStore/query']
    })
  },
  methods: {
    ...mapActions('migrate/startMigrate/authorizedStore', [
      'fetch',
      'handleCurrentChange',
      'handleSizeChange'
    ]),
    ...mapMutations('migrate/startMigrate/authorizedStore', [
      'save'
    ]),
    init () {
      this.save({
        loading: true
      })
      services.userBindTpBindList().then(data => {
        this.userBindTpBindLists = data
        this.bindShopId = data[0].tp_user_id
        this.fetch({
          filters: {
            tp_user_id: data[0].tp_user_id
          }
        }).then(data => {
          this.save({
            loading: false
          })
        })
      })
    },
    handleBind () {
      if (!this.tp_code) {
        const h = this.$createElement
        this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, '您未填写授权码？是否查看授权教程')
          ]),
          showCancelButton: true,
          confirmButtonText: '查看授权教程',
          cancelButtonText: '取消'
        }).then(action => {
          window.open('https://dy.huhuguanjia.com/migrate/startMigrate')
        })
        return false
      }
      const parmas = {
        tp_code: this.tp_code
      }
      services.userBindTpBindCreate(parmas).then(() => {
        this.$message.success('绑定成功')
        services.userBindTpBindList().then(data => {
          this.userBindTpBindLists = data
          this.bindShopId = data[0].tp_user_id
          this.fetch({
            filters: {
              tp_user_id: data[0].tp_user_id
            }
          })
        })
      }).catch(err => {
        console.log(err)
        this.$message.error(`${err}`)
      })
    },
    goSettings (row) {
      this.$emit('goSettings', row)
    },
    startCapture (row) {
      this.$emit('startCapture', row)
    },
    gotoShouquan () {
      window.open('https://meideng.yuque.com/docs/share/730a3a18-0df7-4ea4-99a0-93f2c87e49c1?#')
    },
    gotoPdd () {
      window.open('https://pdd.huhuguanjia.com/migrate')
    },
    manageBindShop () {
      this.dialogTableVisible = true
    },
    addBindShop () {
      const parmas = {
        tp_code: this.tp_code
      }
      services.userBindTpBindCreate(parmas).then(() => {
        this.$message.success('绑定成功')
        services.userBindTpBindList().then(data => {
          this.userBindTpBindLists = data
        })
      }).catch(err => {
        console.log(err)
        this.$message.error(`${err}`)
      })
    },
    handleSelect (id) {
      console.log(id)
      this.save({
        loading: true
      })
      this.bindShopId = id
      this.fetch({
        filters: {
          tp_user_id: id
        }
      }).then(data => {
        this.save({
          loading: false
        })
      })
    },
    deleteBindShop (row) {
      const parmas = {
        tp_user_id: row.tp_user_id
      }
      services.userBindTpBindUnbind(parmas).then(() => {
        this.$message.success('删除成功')
        this.init()
      }).catch(err => {
        console.log(err)
        this.$message.error(`${err}`)
      })
    },
    gobind (url) {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '打开新网址链接', '点击', url])
      }
      window.open(url)
    },
    deleteClowndStore (row) {
      const parmas = {
        cloud_goods_id: row.id,
        tp_user_id: this.filters.tp_user_id
      }
      services.userBindTpBindDeleteCloudGoods(parmas).then(() => {
        this.$message.success('删除成功')
        this.fetch({
          filters: this.filters
        }).then(data => {
          this.save({
            loading: false
          })
        })
      }).catch(err => {
        console.log(err)
        this.$message.error(`${err}`)
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>

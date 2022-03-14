<!--  -->
<template>
    <div>
        <div v-if="!userBindTpBindLists.length" v-loading="loading">
          <el-row class="flex mb-20" style="flex:1">
            <el-col :span="18" ><el-input v-model="tp_code" placeholder="您未绑定店铺，请先输入授权码，绑定其他平台店铺后，再进行复制。如何授权点击查看操作教程可联系客服"></el-input></el-col>
            <el-col :span="3"><el-button class="ml-10" @click="handleBind" type="primary" style="width:120px">授权店铺</el-button></el-col>
            <el-col :span="3"><el-button class="ml-10" @click="gotoShouquan" type="warning" style="width:120px">查看教程</el-button></el-col>
          </el-row>
        </div>
        <div v-if="userBindTpBindLists.length">
          <div @click="gotoPdd" class="click" v-if="tableData && tableData.length">点击我,进入源授权平台</div>
          <el-table :data="tableData && tableData.length" style="width: 100%" v-loading="loading" >
            <el-table-empty slot="empty" >
              <div>您还未创建云商品库，<span @click="gotoPdd" class="click">点击我,进入源授权平台</span>,创建云商品库</div>
            </el-table-empty>
            <el-table-column prop="name" label="云商品库名称"></el-table-column>
            <el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>
            <el-table-column prop="shop_name" label="店铺名称" align="center"></el-table-column>
            <el-table-column prop="platform_name" label="平台" align="center"></el-table-column>
            <el-table-column label="操作" width="250"  align="center">
              <template slot-scope="scope">
                <div class="color-primary pointer pl-5 mb-5" @click="startCapture(scope.row)">跳过设置，直接复制</div>
                <div class="color-warning pointer pl-5" @click="goSettings(scope.row)">下一步：复制设置</div>
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
    </div>
</template>

<script>
import services from '@services'

import {
  mapActions,
  mapState
} from 'vuex'

export default {
  name: 'AuthorizedStore',
  props: {
    msg: String
  },
  data () {
    return {
      tp_code: '',
      userBindTpBindLists: []
    }
  },
  created () {
    this.fetch()
    services.userBindTpBindList().then(data => {
      this.userBindTpBindLists = data
    })
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
        })
        this.fetch()
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
    }
  }
}
</script>
<style lang="less" scoped>
</style>

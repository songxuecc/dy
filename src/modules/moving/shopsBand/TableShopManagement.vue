<!-- 店铺绑定列表 -->
<template>
    <div class="TableShopManagement">
    <el-button
      v-for="(isMainShop,index) in isMainShops"
      :key="index"
      @click="handleClick(index)"
      class="radio"
      :type="active===index ? 'primary':'default'"
    >{{isMainShop.shop_name}}</el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="shop_name"
        label="店铺名称"
        width="250">
        <template slot-scope="scope" >
          <span class="shop_name">{{scope.row.shop_name}}</span>
          <span :class="['tag', scope.row.is_main ? 'main-shop ':'child-shop']">{{scope.row.is_main ?'主店铺':'子店铺'}}</span>
          <span class="current-shop tag" v-if="scope.row.is_self ">当前店铺</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="auth_status"
        label="授权状态"
        width="180">
        <span slot-scope="scope" :class="scope.row.auth_status === 'expire' ? 'expire':'auth'">{{scope.row.auth_status === 'expire' ? '已过期' : '授权中' }}</span>
      </el-table-column>
      <el-table-column
        prop="auth_deadline"
        label="到期时间">
      </el-table-column>
      <el-table-column
        prop="editBtns"
        label="操作">
          <template slot-scope="scope">
            <div v-if="scope.row.editBtns.length">
              <span v-for="(btn,index) in scope.row.editBtns" :key="index" >
                <el-link
                  @click="btn.handle"
                  class="btn"
                  type="primary"
                  :underline="false"
                >{{btn.text}}</el-link>
              </span>
            </div>
            <el-link v-else type="primary" class="btn">—</el-link>
          </template>
      </el-table-column>
    </el-table>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const {
  mapState,
  mapActions,
  mapGetters,
  mapMutations
} = createNamespacedHelpers('moving/shopsBand')

export default {
  name: 'TableShopManagement',
  props: {
    msg: String
  },
  data () {
    return {
      radio1: this.isMainShops
    }
  },
  created () {
    this.getUserBindList({})
  },
  methods: {
    ...mapActions(['getUserBindList', 'changeActive']),
    ...mapMutations(['save']),
    handleClick (active) {
      this.changeActive({active})
    }
  },
  computed: {
    ...mapState(['active']),
    ...mapGetters(['isMainShops', 'tableData'])
  }

}
</script>
<style lang="less" scoped>
  .TableShopManagement {
    /deep/ .el-button {
      border-radius: 0;
    }
    .el-button+.el-button {
      border-left: 0;
      margin-left: 0;
    }
    .btn {
      margin-right: 5px;
      font-size: 12px;
    }
    .shop_name {
      font-size: 14px;
      color: #333333;
    }
    .tag {
      font-size: 10px;
      color: #FFFFFF;
      display: inline-block;
      width: 50px;
      line-height: 18px;
      text-align: center;
    }
    .current-shop {
      background-image: linear-gradient(164deg, #FFB307 0%, #FF6E0C 100%);
      border-radius: 0 6px 0 6px;
    }
    .main-shop {
      background-image: linear-gradient(164deg, #FF7200 0%, #E92000 100%);
      border-radius: 0 6px 0 6px;
    }
    .child-shop {
      background-image: linear-gradient(164deg, #27AFFF 0%, #0268EB 100%);
      border-radius: 0 6px 0 6px;
    }
    .auth {
      font-size: 12px;
      color: #FA6400;
    }
    .expire {
      font-size: 12px;
      color: #E02020;
    }

  }
</style>

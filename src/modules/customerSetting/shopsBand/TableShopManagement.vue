<!-- 店铺绑定列表 -->
<template>
    <div class="TableShopManagement">
    <el-button
      v-for="(isMainShop) in isMainShops"
      :key="isMainShop.user_id"
      @click="handleClick(isMainShop.user_id)"
      class="radio"
      :type="active===isMainShop.user_id ? 'primary':'default'"
    >{{isMainShop.shop_name}}是主店铺</el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-empty slot="empty"/>
      <el-table-column
        prop="shop_name"
        label="店铺名称"
        width="250">
        <template slot-scope="scope" >
          <span class="shop_name">{{scope.row.shop_name}}</span>
          <span :class="['tag','ml-5', scope.row.is_main ? 'main-shop ':'child-shop']">{{scope.row.is_main ?'主店铺':'子店铺'}}</span>
          <span class="current-shop tag ml-5" v-if="scope.row.is_self ">当前店铺</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="auth_status"
        label="授权状态"
        width="220">
        <span slot-scope="scope" :class="['expire', 'un_login'].includes(scope.row.auth_status) ? 'expire':'auth'">
          <span v-if="scope.row.auth_status === 'auth'">授权中</span>
          <span v-if="scope.row.auth_status === 'un_login'">登录过期
            <span
            style="display:inline;font-size:12px;margin-left:5px"
            :underline="false"
            >请用该店铺账号登录虎虎</span>
          </span>
          <span v-if="scope.row.auth_status === 'expire'">订购过期
            <el-link
            type="primary"
            style="display:inline;font-size:12px;margin-left:5px"
            @click="openDinggou"
            :underline="false"
            >去续订></el-link>
          </span>

        </span>
      </el-table-column>
      <el-table-column
        prop="auth_deadline"
        label="到期时间">
      </el-table-column>
      <el-table-column
        prop="editBtns"
        label="操作" class-name="cell-class">
          <template slot-scope="scope">
            <div v-if="scope.row.editBtns.length">
              <span v-for="(btn,index) in scope.row.editBtns" :key="index" >
                <el-tooltip popper-class="shopsBand-tooltip" :manual="true" effect="light"  placement="top-start" :value="btn.text === '切换成TA' && !btn.diabled && showTooltip" v-if="scope.row.idx === 0">
                  <div slot="content" >
                    <div style="width:172px" class="color-666 font-12 left mt-10" >
                      点我切换店铺哦~
                    </div>
                    <div @click="closeNewComer" class="right pointer underline primary mb-10" >我知道了</div>
                  </div>
                  <el-link
                    @click="btn.handle"
                    :class="['btn',btn.diabled ? 'diabled' : '']"
                    type="primary"
                    :underline="false" >{{btn.text}}
                  </el-link>
                </el-tooltip>

                <el-link
                  v-else
                  @click="btn.handle"
                  :class="['btn',btn.diabled ? 'diabled' : '']"
                  type="primary"
                  :underline="false" >{{btn.text}}
                </el-link>

              </span>
            </div>
            <el-link v-else type="primary" class="btn">—</el-link>
          </template>
      </el-table-column>
    </el-table>
    </div>
</template>

<script>
import { createNamespacedHelpers, mapActions as vueMapActions } from 'vuex'
import common from '@/common/common'
const {
  mapState,
  mapActions,
  mapGetters,
  mapMutations
} = createNamespacedHelpers('customerSetting/shopsBand')

export default {
  name: 'TableShopManagement',
  props: {
    msg: String
  },
  data () {
    return {
      radio1: this.isMainShops,
      showTooltip: true
    }
  },
  mounted () {
    this.getUserBindList()
  },
  methods: {
    ...mapActions(['getUserBindList', 'changeActive']),
    ...vueMapActions(['triggerChangeShop']),
    ...mapMutations(['save']),
    handleClick (active) {
      this.changeActive({active})
    },
    openDinggou () {
      window.open(common.DY_SERVICE_LINK)
      return false
    },
    closeNewComer () {
      this.showTooltip = false
    }
  },
  computed: {
    ...mapState(['active', 'tableData']),
    ...mapGetters(['isMainShops'])
  }

}
</script>
<style lang="less" scoped>
  .TableShopManagement {
    /deep/ .el-button {
      border-radius: 0;
    }
    .radio {
      margin-bottom: 5px;
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
    .diabled {
      color: #cdcdcd;
    }

  }

     /deep/ .el-drawer__body {
      height: 100%;
    }
   /deep/ .cell-class {
      .cell {
        overflow: inherit;
      }
    }

    /deep/ .table-cal-2 {
      overflow: inherit !important;
      min-height: 200px;
      .el-table__body-wrapper {
        overflow: inherit !important;
      }
    }

    .triangle{
        position: absolute;
        content:"";
        width: 0;
        height: 0;
        border: 9px solid transparent;
    }

    .triangle-top {
      left: 50%;
      transform: translateX(-50%);
      bottom: -17px;
      border-top: 6px solid #1D8FFF;
    }
    .triangle-white-top {
      left: 50%;
      transform: translateX(-50%);
      bottom: -14px;
      border-top: 6px solid #ffffff;
    }
    .triangle-white{
        position: absolute;
        content:"";
        width: 0;
        height: 0;
        border: 9px solid transparent;
    }

</style>
<style lang="less">
    .shopsBand-tooltip.is-light {
        border:0;
        border-bottom: 10px solid #1D8FFF;
        position: relative;
        z-index: 1;
        box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
        width: 208px;
        padding:10px 14px 0;
    }
    .shopsBand-tooltip.is-light[x-placement^=top] .popper__arrow::after {
      position: absolute;
      content:"";
      width: 0;
      height: 0;
      border-top: 5px solid #ffffff;
      bottom:4px;
    }
    .shopsBand-tooltip[x-placement^=top] .popper__arrow {
      bottom: -15px;
      border-top-color: #1D8FFF;
      border-bottom-width: 0;
    }
    .shopsBand-tooltip.is-light[x-placement^=top] .popper__arrow {
        border-top-color: #1D8FFF;
    }
    .shopsBand-tooltip .popper__arrow {
        border-width: 9px;
    }

    .shopsBand-tooltip[x-placement^=top] .popper__arrow {
      bottom: -16px;
      border-top-color: #1D8FFF;
      border-bottom-width: 0;
    }
    .shopsBand-tooltip::after {
      content:"";
      position: absolute;
      left: 0;
      right: 0;
      bottom: -7px;
      top: 0;
      margin:auto;
      background:#fff;
      border-radius: 3px;
      z-index: -1;
    }

</style>

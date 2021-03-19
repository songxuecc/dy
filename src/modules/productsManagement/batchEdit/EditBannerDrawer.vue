<template>
  <div class="drawer-container">
    <el-row class="drawer-title  pt-10">
      <el-col :span="8">
        <span>批量设置</span>
      </el-col>
      <el-col :span="16" style="text-align: right">
        <!-- <el-button type="info" size="small" @click="rollbackChange">全部重置</el-button> -->
        <div v-if="Object.keys(selectProductDict).length === 0" style="display: inline-block; margin-left: 10px;">
          <el-tooltip class="item" effect="dark" placement="top" content="请选择需要修改的商品">
            <span class="button-wrapper">
              <el-button type="primary" size="small" disabled>全部保存</el-button>
            </span>
          </el-tooltip>
        </div>
        <el-button v-else type="primary" size="small" @click="confirmChange">全部保存</el-button>
      </el-col>
    </el-row>
    <div class="drawer-content">
      <edit-banner-list :bannerImage=bannerImage :bannerEditProduct="selectProductList"></edit-banner-list>
    </div>
  </div>
</template>

<script>
// import common from '@/common/common.js'
import { mapGetters } from 'vuex'
import EditBannerList from '@productsManagement/batchEdit/EditBannerList.vue'
export default {
  components: {
    EditBannerList
  },
  props: {
    field: String,
    dyProductModelList: Array,
    selectProductDict: Object
  },
  data () {
    return {
      bannerImage: Array(10).fill('')
    }
  },
  computed: {
    ...mapGetters({
      getTokenHeaders: 'getTokenHeaders'
    }),
    selectProductList () {
      let self = this
      return Object.keys(self.selectProductDict).map(function (key) {
        return self.selectProductDict[key]
      })
    }
  },
  mounted () {
  },
  methods: {
    confirmChange () {
      for (let i = 0; i < this.bannerImage.length; i++) {
        this.$set(this.bannerImage, i, '')
      }
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="less" scoped>
</style>

<template lang="html">
    <div>
      <el-form ref="form" :model="search" :inline="true" style="text-align: left; margin-top:20px">
            <el-form-item>
                <el-input v-model="search.key" size="small" placeholder="商品名称、ID" @keyup.enter.native="onSearchChange" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-select v-model="search.status" placeholder="请选择" size="small" @change="onSearchChange"
                           popper-class="select-long" style="width: 100px"
                >
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" size="small" @click="onSearchChange">搜索</el-button>
            </el-form-item>
        </el-form>
        <div style="text-align: left;font-size: 12px;margin-bottom: 5px;">* 温馨提示: 制作完白底图，需要手动下载后去抖音上传</div>
        <el-table ref="pddProductListTable" :data="pddProductList" row-key="goods_id" border style="width: 100%"
                  :row-style="{height:'68px'}" :cell-style="{padding:0}"
        >
            <el-table-column label="图片" width="120" align="center">
                <template slot-scope="scope">
                    <el-image :src="scope.row.image_url">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline" style="font-size:30px"></i>
                      </div>
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column label="标题">
                <template slot-scope="scope">
                    <el-link type="primary" :underline="false" :href="'https://mobile.yangkeduo.com/goods.html?goods_id=' + scope.row.goods_id" target="_blank" >
                        {{ scope.row.goods_name }}
                    </el-link><br>
                    <div>
                       <label style="font-size:12px" v-if="scope.row.outer_goods_id">商家编码: {{scope.row.outer_goods_id}}</label>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="制作的白底图" width="120" align="center">
                 <template slot-scope="scope">
                    <el-image :src="scope.row.white_bg_pic" v-if="scope.row.white_bg_pic == ''">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                    </el-image>

                     <el-popover v-if="scope.row.white_bg_pic != ''"
                      placement="left"
                      title=""
                      trigger="hover">
                      <el-image slot="reference" :src="scope.row.white_bg_pic" :alt="scope.row.white_bg_pic" ></el-image>
                      <img :src="scope.row.white_bg_pic" style="max-height: 300px;max-width: 300px">
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <div>
                    <el-button style="margin-top: 5px;"  type="primary" size="mini" @click="openMattingProductDialog(scope.row)">制作</el-button>
                    <el-button  v-if="scope.row.white_bg_pic!=''" type="primary" size="mini" @click="openEditDialog(scope.row)">编辑</el-button>
                  </div>
                  <div style="margin-top:8px">
                    <el-button  v-if="scope.row.white_bg_pic!=''" type="primary" size="mini" @click="downloadMattingImage(scope.row.white_bg_pic, scope.row.goods_id)">下载</el-button>
                    <el-button  v-if="scope.row.white_bg_pic!=''" type="primary" size="mini" @click="openPddUploadUrl(scope.row.goods_id)">上传</el-button>
                  </div>
                </template>
            </el-table-column>
        </el-table>
        <br>
        <el-pagination
                    v-show="loadingCnt == 0"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pagination.index"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pagination.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pagination.total">
         </el-pagination>

         <el-dialog title="制作白底图" class="product-dialog" :visible.sync="dialogMattingVisible" @opened="dialogMattingOpened">
            <product-matting-view ref="productMattingView" @changeProduct="onChangeProduct"></product-matting-view>
        </el-dialog>
        <el-dialog title="" :visible.sync="dialogEditVisible" width="770px" @closed="dialogEditClosed" :before-close="dialogEditBeforeClose">
            <white-bg-edit-view ref="whiteBgEditView" :product="curProduct" @closeDialog='closeEditDialog'></white-bg-edit-view>
        </el-dialog>
    </div>
</template>
<script>

import productMattingView from '@/components/ProductMattingView.vue'
import request from '@/mixins/request.js'
import utils from '@/common/utils.js'
import { mapGetters, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import whiteBgEditView from '@/components/WhiteBgEditView.vue'

export default {
  mixins: [request],
  components: {
    productMattingView,
    whiteBgEditView
  },
  data () {
    return {
      pagination: {
        index: 1,
        size: 10,
        total: 0
      },
      search: {
        key: '',
        status: '1'
      },
      statusOptions: [{value: '1', label: '在售中'}, {value: '2', label: '已下架'}],
      dialogMattingVisible: false,
      curProduct: {
        'original_pic': '',
        'white_bg_pic': ''
      },
      asynMattingJobId: -1,
      syncMattingStatusInterval: false,
      loadingInstance: undefined,
      dialogEditVisible: false
    }
  },
  activated () {
    this.getWhiteBgProductList()
    this.setSelectedPictureUrl('')
  },
  mounted () {
  },
  computed: {
    ...mapGetters({
      isAuth: 'getIsAuth',
      selectedPictureUrl: 'getSelectedPictureUrl'
    })
  },
  watch: {
    selectedPictureUrl (pictureUrl) {
      if (pictureUrl) {
        this.dialogMattingVisible = false
        this.startMatting(pictureUrl)
      }
    }
  },
  methods: {
    ...mapActions([
      'setSelectedPictureUrl'
    ]),
    ...mapGetters({
    }),
    getWhiteBgProductList (isResetIndex = true, isSilent = false) {
      if (isResetIndex) {
        this.pagination.index = 1
      }
      let params = {
        keyword: this.search.key,
        status: this.search.status
      }
      params['page_index'] = this.pagination.index
      params['page_size'] = this.pagination.size

      this.request('getWhiteBgProductList', params, data => {
        this.pddProductList = data.items
        this.pagination.total = data.total
      }, undefined, isSilent)
    },
    onSearchChange () {
      this.getWhiteBgProductList(true)
    },
    handleSizeChange (val) {
      this.pagination.size = val
      this.getWhiteBgProductList()
    },
    handleCurrentChange (val) {
      this.pagination.index = val
      this.getWhiteBgProductList(false)
    },
    openMattingProductDialog (product) {
      this.curProduct = product
      this.dialogMattingVisible = true
    },
    dialogMattingOpened () {
      if (this.curProduct.goods_id) {
        this.$refs.productMattingView.setProduct(this.curProduct)
      }
    },
    onChangeProduct (data) {
      let dicKeys = {
        status: 'status',
        migration_msg: 'migration_msg',
        price: 'max_price',
        title: 'title',
        category_id: 'category_id',
        category_show: 'category_show'
      }
      for (let key in data) {
        if (!data.hasOwnProperty(key)) continue
        if (key in dicKeys) {
          this.curTPProduct[ dicKeys[key] ] = data[key]
        }
      }
    },
    startMatting (url) {
      let params = {
        image_url: url,
        goods_id: this.curProduct.goods_id
      }
      this.request('startProductMatting', params, data => {
        this.asynMattingJobId = data['job_id']
        this.loadingInstance = Loading.service({
          lock: true,
          text: '正在制作白底图，请稍等',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        this.syncMattingStatusInterval = setInterval(this.syncMattingStatus, 1000)
      }, data => {})
    },
    syncMattingStatus () {
      let params = {
        job_id: this.asynMattingJobId
      }
      this.request('getMattingStatus', params, data => {
        let status = data.status
        if (status === 'succ') {
          this.$message({
            message: '制作成功',
            type: 'success'
          })
          clearInterval(this.syncMattingStatusInterval)
          this.loadingInstance.close()

          this.getWhiteBgProductList(false)
        } else if (status === 'fail') {
          clearInterval(this.syncMattingStatusInterval)
          this.loadingInstance.close()
          this.requestFail(new Error('后台处理错误，请重试'))
        }
      }, data => { this.loadingInstance.close(); clearInterval(this.syncMattingStatusInterval) })
    },
    downloadMattingImage (url, goodsId) {
      url = url.split(':')[1]
      this.$http({
        method: 'get',
        url: url,
        responseType: 'arraybuffer'
      })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          utils.downloadURL(url, goodsId + '.jpeg')
          URL.revokeObjectURL(url)
        })
        .catch(() => console.log('error occured'))
    },
    openEditDialog (product) {
      this.curProduct = product
      this.dialogEditVisible = true
    },
    closeEditDialog () {
      this.dialogEditVisible = false
    },
    dialogEditClosed () {
      this.curProduct = ''
    },
    dialogEditBeforeClose (done) {
      if (this.$refs.whiteBgEditView.hasChangeImage()) {
        this.$confirm('确认不保存更新就退出吗？')
          .then(_ => {
            done()
          })
          .catch(_ => {})
      } else {
        done()
      }
    },
    openPddUploadUrl (goodsId) {
      window.open('https://mms.pinduoduo.com/goods/goods_materials?goods_id=' + goodsId)
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/base.less';
    @import '~@/assets/css/whitebackgroundview.less';
    .action-button{
      display: block;
    margin-bottom: 5px;
    margin-left: 12px;
    }
</style>

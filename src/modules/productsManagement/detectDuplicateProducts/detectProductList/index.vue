<!-- 检测商品列表 -->
<template>
    <div class='left detectProductList'>
      <div class="alert">
            <div style="margin-left:16px">
              <hh-icon type="icontishi" ></hh-icon>什么是重复铺货检测？
            </div>
            <p>
              帮助店铺检测标题完全相同的商品。避免商品
              <span class="fail">标题完全相同</span>
              <span>的商品。避免商品或店铺因重复铺货受到官方处罚。</span>
              <span class="click" v-hh-open="'https://school.jinritemai.com/doudian/web/article/aHKK3UGTKQ29?rank=0&fromPage=search_result&searchInfo=3411068771490959798%3A0%3A0&query=%E9%87%8D%E5%A4%8D%E9%93%BA%E8%B4%A7'">点击查看</span>
              <span>重复铺货的危害</span>
            </p>
      </div>

      <div class="mb-10 flex">
        <span>选择检测商品</span>
        <el-radio-group v-model="status" class="ml-10 mr-10">
          <el-radio label="0">全部商品</el-radio>
          <el-radio label="1">仅上架商品</el-radio>
          <el-radio label="2">仅下架商品</el-radio>
        </el-radio-group>
        <SyncProduct />
      </div>
      <div class="flex align-c mb-22">
        <el-button style="width:120px" type="primary" @click="startDetect" class="mr-10" >{{!detectDetail.repeat_check_time ? '开始检测' : '再次检测'}}</el-button>
        <div>
          <span class="color-4e">最近检测结果：</span> <span class="fail mr-30">{{detectDetail.group_nums}}组重复商品，共{{detectDetail.goods_nums}}个商品</span>
          <span class="color-4e">最近检测时间：</span> <span class="color-999">{{detectDetail.repeat_check_time}}</span>
        </div>
      </div>

      <div class="flex align-c mb-10 justify-b">
        <div class="font-12 ">
          <el-button type="primary" size="small" class="" @click="handleQuikeSelectOnSale">保留售卖中的商品</el-button>
          <el-button type="primary" size="small" class="" @click="handleQuikeSelectQuetity">保留库存高的商品</el-button>
          <el-button type="primary" size="small" class="" @click="handleQuikeSelectSkuMax">保留价格最高的商品</el-button>
          <el-button type="primary" size="small" class="" @click="handleQuikeSelectSkuMin">保留价格最低的商品</el-button>
        </div >
        <div class="click" @click="goToRecord">查看批量操作记录</div>
      </div>

      <div v-loading="loading || loadingPost">
          <div class="flex font-12 color-333" style="background-color: #F9F9F9;padding:8px 0;">
            <div style="width:100px">
              <el-checkbox style="margin-left:10px;margin-right:10px" @change="handleAllCheckChange" v-model="allChecked"></el-checkbox>全选/反选
            </div>
            <div style="flex:1;padding-left:30px" class="center">商品信息</div>
            <div style="width:80px" class="center">类目</div>
            <div style="width:80px" class="center">售卖价</div>
            <div style="width:80px" class="center">库存</div>
            <div style="width:80px" class="center">销售状态</div>
            <div style="width:150px" class="center">操作</div>
          </div>
          <el-table-empty  v-if="!tableList.length"/>
          <div v-for="(data,idx) in tableList" :key="idx" v-else>
              <el-table
                v-if="data.goods_list && data.goods_list.length"
                :data="data.goods_list"
                :show-header="false" >
                <el-table-column
                  align="center"
                  prop="category_name"
                  label="类目"
                  width="100">
                    <template slot-scope="scope">
                      <div class="flex align-c">
                        <el-checkbox style="margin-right:10px" v-model="scope.row.is_checked" @change="handleCheckChange($event,`[${idx}].goods_list[${scope.row.index}].is_checked`)"></el-checkbox>
                        <HhImage :src="scope.row.image_url" style="height:50px;max-width:65px;"/>
                      </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="id"
                    label="商品信息">
                    <template slot-scope="scope">
                        <div>
                          <el-link :underline="false" :href="'https://haohuo.jinritemai.com/views/product/detail?id=' +scope.row.goods_id"  class="font-13">
                            {{ scope.row.goods_name }} </el-link><br />
                          <div class="font-12 flex align-c color-999" style="margin-top:3px">
                            <span>{{ scope.row.goods_id }}</span>
                            <span class="ml-10 mr-10 presell_type jieti" v-if="scope.row.presell_type === 2" >阶梯发货</span>
                            <span class="ml-10 mr-10 presell_type xianhuo" v-if="scope.row.presell_type === 0" >现货发货</span>
                            <span class="ml-10 mr-10 presell_type yushou" v-if="scope.row.presell_type === 1" >预售发货</span>
                          </div>
                        </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="category_name"
                    label="类目"
                    width="80">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="discount_price"
                    label="售卖价"
                    width="80">
                    <template slot-scope="scope">
                      <span >{{fenToYuan(scope.row.discount_price)}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="goods_quantity"
                    label="库存"
                    width="80">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="address"
                    label="销售状态"
                    width="80">
                    <template slot-scope="scope">
                      <el-link type="primary" :underline="false" :href="dyGoodsLink(scope.row.goods_id)" target="view_window" class="font-13">{{ dyProductStatusMap[scope.row.status + '-' + scope.row.check_status] }}</el-link>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="address"
                    label="操作"
                    width="150">
                    <template slot-scope="scope">
                      <span class="click pointer mr-5" @click="handleOnshelf(scope.row,data)">下架</span>
                      <span class="click pointer mr-5" @click="productDelete(scope.row,data)">删除</span>
                      <span class="click pointer" @click="productEdit(scope.row)">修改</span>
                    </template>
                  </el-table-column>
                </el-table>
                <div style="height:2px;background:#97CBFF" v-if="data.goods_list && data.goods_list.length"></div>
          </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.page_index"
        class=" pt-20 right mr-20 pagination"
        :page-size="pagination.page_size"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      </div>

      <div class="btn flex align-c justify-c" :style="{'margin-right': (40 + scrollWidth)  + 'px'}">
        <el-button type="primary" class="relative" :disabled="!hasCheckedLength" @click="handleBatchDelete">
          批量删除商品
          <span class="badge" v-if="hasCheckedLength">{{hasCheckedLength}}</span>
        </el-button>
        <el-button type="primary" class="relative" :disabled="!hasCheckedLength"  @click="handleBatchOnShelf">
          批量下架商品
          <span class="badge" v-if="hasCheckedLength">{{hasCheckedLength}}</span>
        </el-button>
      </div>

    </div>

</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import utils from '@/common/utils'
import common from '@/common/common.js'
import set from 'lodash/set'
import services from '@services'
import debounce from 'lodash/debounce'
import checkSyncProducts from '@/mixins/checkSyncProducts.js'

export default {
  name: 'detectProductList',
  mixins: [
    checkSyncProducts('detectProductList')
  ],
  props: {
    msg: String
  },
  data () {
    return {
      status: '0',
      checked: false,
      utils,
      dyProductStatusMap: common.dyProductStatusMap,
      allChecked: false,
      percent: 0,
      timer: null,
      detectDetail: {},
      loadingPost: false,
      loadingInstantence: null,
      scrollWidth: 0,
      tableList: []
    }
  },
  created () {
    // this.init()
  },
  activated () {
    this.init()
  },
  mounted () {
    const scrollEl = document.querySelector('.page-component__scroll')
    scrollEl.addEventListener('scroll', this.scroll)
  },
  beforeDestroy () {
    const scrollEl = document.querySelector('.page-component__scroll')
    scrollEl.removeEventListener('scroll', this.scroll)
  },
  computed: {
    ...mapState('productManagement/detectDuplicateProducts/detectProductList', [
      'tableData',
      'total',
      'pagination',
      'filters',
      'form'
    ]),
    ...mapState({
      loading: state => state['@@loading'].effects['productManagement/detectDuplicateProducts/detectProductList/query']
    }),
    hasCheckedLength () {
      const AllGoods = this.tableData
        .reduce((target, current) => target.concat(current.goods_list), [])
      const hasChecked = AllGoods
        .filter(item => item.is_checked)
      return hasChecked.length
    }
  },
  watch: {
    tableData (n) {
      const tableList = n.map(item => {
        item.goods_list = item.goods_list.map((goods, index) => {
          goods.index = index
          goods.is_checked = Boolean(goods.is_checked)
          return goods
        })
        return item
      })
      this.tableList = tableList
    }
  },
  methods: {
    ...mapActions('productManagement/detectDuplicateProducts/detectProductList', [
      'fetch',
      'handleCurrentChange',
      'handleSizeChange'
    ]),
    ...mapMutations('productManagement/detectDuplicateProducts/detectProductList', ['save']),
    fenToYuan: utils.fenToYuan,
    dyGoodsLink (dyGoodsId) {
      return 'https://fxg.jinritemai.com/index.html#/ffa/g/create?product_id=' + dyGoodsId
    },
    async init () {
      this.loadingInstantence = this.$loading({
        lock: true,
        text: `拼命加载中`,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      services.productRepeatQuery().then(data => {
        if (data.status === 2) {
          clearTimeout(this.timer)
          this.loadingInstantence.close()
          this.timer = null
          this.detectDetail = data
          this.fetch().then(item => {
            this.scroll()
          })
        } else {
          this.percent = data.percent
          clearTimeout(this.timer)
          this.loadingInstantence.close()
          this.timer = setTimeout(() => {
            this.init()
          }, 2000)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    scroll: debounce(function () {
      // 判断是否有滚动条的方法
      function hasScrolled (el, direction = 'vertical') {
        if (direction === 'vertical') {
          return el.scrollHeight > el.clientHeight
        } else if (direction === 'horizontal') {
          return el.scrollWidth > el.clientWidth
        }
      }
      function getScrollbarWidth (el) {
        el = el || document.body
        var scrollDiv = document.createElement('div')
        scrollDiv.style.cssText =
          'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;'
        el.appendChild(scrollDiv)
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
        el.removeChild(scrollDiv)
        return scrollbarWidth
      }
      const scrollEl = document.querySelector('.page-component__scroll')
      const isScroll = hasScrolled(scrollEl)
      if (isScroll) {
        const scrollWidth = getScrollbarWidth(scrollEl)
        this.scrollWidth = scrollWidth
      }
    }, 30),
    // 快速勾选
    handleQuikeSelect () {
      const tableData = this.tableData.map(item => {
        item.goods_list = item.goods_list.map((goods, index) => {
          if (index < item.goods_list.length - 1) {
            goods.is_checked = true
          } else {
            goods.is_checked = false
          }
          return goods
        })
        return item
      })
      this.save({tableData})
    },
    // 保留售卖中的商品
    handleQuikeSelectOnSale () {
      const tableData = this.tableData.map(item => {
        item.goods_list = item.goods_list.map((goods, index) => {
          const status = this.dyProductStatusMap[goods.status + '-' + goods.check_status]
          if (status === '售卖中') {
            goods.is_checked = false
          } else {
            goods.is_checked = true
          }
          return goods
        })
        return item
      })
      this.save({tableData})
      this.checkAllStatus()
    },
    // 保留库存高的商品
    handleQuikeSelectQuetity () {
      const tableData = this.tableData.map(item => {
        // let quantity = item.goods_list[0].goods_quantity
        let index = 0
        item.goods_list.forEach((goods, idx) => {
          if (goods.goods_quantity >= item.goods_list[index].goods_quantity) {
            index = idx
          }
        })
        item.goods_list = item.goods_list.map((goods, idx) => {
          if (index === idx) {
            goods.is_checked = false
          } else {
            goods.is_checked = true
          }
          return goods
        })
        return item
      })
      this.save({tableData})
      this.checkAllStatus()
    },
    // 保留价格最高的商品
    handleQuikeSelectSkuMax () {
      const tableData = this.tableData.map(item => {
        let index = 0
        item.goods_list.forEach((goods, idx) => {
          if (goods.discount_price >= item.goods_list[index].discount_price) {
            index = idx
          }
        })
        item.goods_list = item.goods_list.map((goods, idx) => {
          if (index === idx) {
            goods.is_checked = false
          } else {
            goods.is_checked = true
          }
          return goods
        })
        return item
      })
      this.save({tableData})
      this.checkAllStatus()
    },
    // 保留价格最低的商品
    handleQuikeSelectSkuMin () {
      const tableData = this.tableData.map(item => {
        let index = 0
        item.goods_list.forEach((goods, idx) => {
          if (goods.discount_price <= item.goods_list[index].discount_price) {
            index = idx
          }
        })
        item.goods_list = item.goods_list.map((goods, idx) => {
          if (index === idx) {
            goods.is_checked = false
          } else {
            goods.is_checked = true
          }
          return goods
        })
        return item
      })
      this.save({tableData})
      this.checkAllStatus()
    },
    // 全选
    handleAllCheckChange (value) {
      const tableData = this.tableData.map(item => {
        item.goods_list = item.goods_list.map((goods, index) => {
          goods.is_checked = value
          return goods
        })
        return item
      })
      this.save({tableData})
    },
    // 单选
    handleCheckChange (value, path) {
      set(this.tableData, path, value)
      this.save({tableData: this.tableData})
      this.checkAllStatus()
    },
    checkAllStatus () {
      // 如果全部勾选 则 全选
      const AllGoods = this.tableData
        .reduce((target, current) => target.concat(current.goods_list), [])
      const hasChecked = AllGoods
        .filter(item => item.is_checked)
      if (AllGoods.length === hasChecked.length) {
        this.allChecked = true
      } else {
        this.allChecked = false
      }
    },
    // 开始检测
    startDetect () {
      this.loadingInstantence = this.$loading({
        lock: true,
        text: `拼命加载中`,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const status = this.status
      const obj = {
        0: { check_status: -1, status: -1 },
        1: { check_status: 3, status: 0 },
        2: { check_status: 1, status: 1 }
      }
      services.productRepeatCheck(obj[status]).then(data => {
        if (data) {
          this.init()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    goToRecord () {
      this.$router.push({
        name: 'detectDuplicateProducts_Record'
      })
    },
    handleOnshelf (row, data) {
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
          }, '确认批量下架勾选商品')
        ]),
        type: 'warning',
        confirmButtonText: '确认下架',
        cancelButtonText: '点错了',
        customClass: 'custome-confirm-customClass',
        cancelButtonClass: 'custome-confirm-cancelButtonClass',
        confirmButtonClass: 'custome-confirm-confirmButtonClass',
        showClose: false
      })
        .then(_ => {
          const parmas = {
            goods_id: row.goods_id
          }
          this.loadingPost = true
          services.productOffshelf(parmas)
            .then(data => {
              this.fetch()
              this.$message.success('下架成功')
              this.loadingPost = false
            })
            .catch(err => {
              this.$message.error(`${err}`)
              this.loadingPost = false
              this.fetch()
            })
        })
        .catch(_ => {
          return false
        })
    },
    productDelete (row, data) {
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
          }, '确认批量删除勾选商品')
        ]),
        type: 'warning',
        confirmButtonText: '确认删除',
        cancelButtonText: '点错了',
        customClass: 'custome-confirm-customClass',
        cancelButtonClass: 'custome-confirm-cancelButtonClass',
        confirmButtonClass: 'custome-confirm-confirmButtonClass',
        showClose: false
      })
        .then(_ => {
          const parmas = {
            goods_id: row.goods_id,
            group_id: data.group_id
          }
          this.loadingPost = true
          services.productRepeatGoodsGroupDelete(parmas)
            .then(data => {
              this.fetch()
              this.$message.success('删除成功')
              this.loadingPost = false
            })
            .catch(err => {
              this.$message.error(`${err}`)
              this.loadingPost = false
              this.fetch()
            })
        })
        .catch(_ => {
          return false
        })
    },
    productEdit (product) {
      window.open('https://fxg.jinritemai.com/index.html#/ffa/g/create?product_id=' + product.goods_id)
    },
    // 批量删除
    async handleBatchDelete () {
      try {
        const AllGoods = this.tableData
          .reduce((target, current) => target.concat(current.goods_list), [])
        const ids = AllGoods
          .filter(item => item.is_checked)
          .map(item => item.goods_id)
        const parmas = {
          task_type: 1,
          task_sub_type: 102,
          goods_id_list: JSON.stringify(ids),
          ext_json: JSON.stringify({}),
          delete_goods_id_list: JSON.stringify([])
        }
        await services.hhTaskCreate(parmas)
        const h = this.$createElement
        this.$confirm('', {
          message: h('div', null, [
            h('div', {
              class: 'center'
            }, [
              h('hh-icon', {
                props: {
                  type: 'iconchenggong'
                },
                class: 'custome-confirm-icon'
              })
            ]),
            h('div', {
              class: 'custome-confirm-text'
            }, '批量删除开始')
          ]),
          type: 'warning',
          confirmButtonText: '查看批量删除记录',
          cancelButtonText: '我知道了',
          customClass: 'custome-confirm-customClass',
          cancelButtonClass: 'custome-confirm-cancelButtonClass',
          confirmButtonClass: 'custome-confirm-confirmButtonClass',
          showClose: false
        })
          .then(_ => {
            this.goToRecord()
          })
          .catch(_ => {
            return false
          })
      } catch (error) {
        this.$message.error(`${error}`)
      }
    },
    // 批量下架
    async handleBatchOnShelf () {
      try {
        const AllGoods = this.tableData
          .reduce((target, current) => target.concat(current.goods_list), [])
        const ids = AllGoods
          .filter(item => item.is_checked)
          .map(item => item.goods_id)

        const parmas = {
          task_type: 1,
          task_sub_type: 103,
          goods_id_list: JSON.stringify(ids),
          ext_json: JSON.stringify({
            onshelf: 0
          }),
          delete_goods_id_list: []
        }
        await services.hhTaskCreate(parmas)
        const h = this.$createElement
        this.$confirm('', {
          message: h('div', null, [
            h('div', {
              class: 'center'
            }, [
              h('hh-icon', {
                props: {
                  type: 'iconchenggong'
                },
                class: 'custome-confirm-icon'
              })
            ]),
            h('div', {
              class: 'custome-confirm-text'
            }, '批量下架开始')
          ]),
          type: 'warning',
          confirmButtonText: '查看批量下架记录',
          cancelButtonText: '我知道了',
          customClass: 'custome-confirm-customClass',
          cancelButtonClass: 'custome-confirm-cancelButtonClass',
          confirmButtonClass: 'custome-confirm-confirmButtonClass',
          showClose: false
        })
          .then(_ => {
            this.goToRecord()
          })
          .catch(_ => {
            return false
          })
      } catch (error) {
        this.$message.error(`${error}`)
      }
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~./index.less';
</style>

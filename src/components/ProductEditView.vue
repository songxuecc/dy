<template lang="html">
    <div style="height: 530px">
        <el-tabs v-loading="loadingCnt" v-model="activityTab">
            <el-tab-pane label="商品属性" name="info">
                <span slot="label" v-if=" product.model.check_error_msg_static  && '0' in product.model.check_error_msg_static">商品属性
                  <el-tooltip effect="dark"  placement="top-start">
                    <div slot="content">
                         <ul style="padding: 0; margin: 0;" v-for="(v,i) in product.model.check_error_msg_static['0']['info']" :key="i">{{v}}</ul>
                    </div>
                    <el-badge v-if="false" :value="product.model.check_error_msg_static['0'].num" ></el-badge>
                </el-tooltip>
                </span>
                <el-form class="setting-content" ref="form" :model="product.model" label-width="90px" style="height: 400px">
                    <el-form-item label="商品分类:">
                        <span>{{ product.model.category_show }}</span>
                        <el-button size="mini" @click="showSelectCateView" :type="categoryBtnType">修改分类</el-button>
                    </el-form-item>
                    <el-form-item label="商品标题:">
                        <el-input v-model="product.model.title" size="mini"  style="width:70%"
                                  :class="['input-text-left', {'warn': (isTitleWarn || isTitleInfoWarn())}]"
                        >
<!--                            <span slot="append" class="hint">{{ getStrRealLength(product.model.title) }} / 60</span>-->
                            <span slot="append" class="hint">{{ getStrRealLength(product.model.title) }}</span>
                        </el-input>
                        <span style="font-size: 10px;">（已自动删除平台违禁词）</span>

                    </el-form-item>
                    <el-form-item label="市场价:">
                        <el-input v-model="product.model.price" size="mini" class="input-price"></el-input> 元
                    </el-form-item>
                    <el-form-item label="商品描述:">
                        <el-input type="textarea" v-model="product.model.description" size="mini"
                                  :autosize="{ minRows: 1, maxRows: 10}" maxlength="500" show-word-limit>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="商品编码:" style="width:300px" v-if="product.model.outer_id">
                        <el-input v-model="product.model.outer_id" size="mini" class="input-text-left"></el-input>
                    </el-form-item>
                    <el-form-item v-show="haveAttr" label="抖音属性:">
                        <attribute-view ref="attributeView" @selectFilter="selectFilter" @onAttrChanged="onAttrChanged"
                        ></attribute-view>
                    </el-form-item>
                </el-form>
                <div class="common-bottom">
                    <el-checkbox v-if="isShowShelvesCheck" v-model="checkedShelves" style="margin-left:-127px">
                        保存并上架
                    </el-checkbox>
                    <el-tooltip v-if="!isRequiredComplete || isTitleWarn" class="item" effect="dark" placement="top"
                                :content="isTitleWarn ? '标题过长' : '缺少必填属性'"
                    >
                        <span class="button-wrapper">
                            <el-button type="primary" @click="onSaveProduct" disabled> {{ saveBtnText }} </el-button>
                        </span>
                    </el-tooltip>
                    <el-button v-else type="primary" @click="onSaveProduct"> {{ saveBtnText }}</el-button>
                </div>
            </el-tab-pane>

            <el-tab-pane label="SKU信息" name="sku">
               <span slot="label" v-if=" product.model.check_error_msg_static  && '1' in product.model.check_error_msg_static">SKU信息

                  <el-tooltip effect="dark" placement="top-start">
                    <div slot="content">
                         <ul style="padding: 0; margin: 0;" v-for="(v,i) in product.model.check_error_msg_static['1']['info']" :key="i">{{v}}</ul>
                    </div>
                    <el-badge :value="product.model.check_error_msg_static['1'].num"></el-badge>
                </el-tooltip>
                </span>

                <el-table :data="skuRealShowList" height="400" border style="width: 100%" :header-cell-style="cellStyle">
                    <el-table-column v-for="(item, index) in skuPropertyList" :key="index+':'+item.id">
                        <template slot="header" slot-scope="scope">
                            <span :style="{color: (item.filter ? '#409EFF' : '#909399')}">{{ item.name }}</span>
                            <el-dropdown v-if="skuPropertyValueMap[item.id] && skuPropertyList.length > 1"
                                         style="line-height:0px; padding-left: 0px; cursor:pointer; vertical-align: middle;"
                                         trigger="click" :hide-on-click="false"  placement="bottom" :ref="'sku-property-'+item.id"
                            >
                                <span class="el-dropdown-link" style="color:#909399">
                                  ({{Object.keys(skuPropertyValueMap[item.id]).length}})<i class="el-icon-edit" style="color: #409EFF"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown" style="max-height: 250px; overflow: auto; overflow-x:hidden;">
                                    <el-dropdown-item v-for="(ele, vid) in skuPropertyValueMap[item.id]" :key="vid">
                                        <div style="display:flex">
                                            <el-checkbox v-model="ele.checked" @change="onSkuFilter" style="margin-right: 0">
                                              <span v-if="isPddProduct || skuPropertyList.length === 1">{{ele.value}}</span>
                                              <el-input style="width:340px" v-else v-model="ele.value" size="mini" @input="handlePropertyNameChange(item.id, vid, ele)"
                                                        :class="['input-text-left', {'warn': isSkuNameWarn(ele.value, item.id) }]">
                                                <span slot="append" class="hint">{{ ele.value.length }} / 18</span>
                                              </el-input>
                                            </el-checkbox>
                                            <el-button v-if="Object.keys(skuPropertyValueMap[item.id]).length > 1" size="mini" type="text" style="color:#F56C6C;margin-left:auto;padding-left: 10px"
                                                       @click="onDeleteSku(item.id,vid)"
                                            > 删除 </el-button>
                                        </div>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <el-button v-if="item.filter" size="small" type="text" class="table-header-btn" @click="cancelSkuFilter(item.id)">
                                取消筛选
                            </el-button>
                        </template>
                        <template slot-scope="scope">
                          <span v-if="isPddProduct || (skuPropertyList.length === 1 && skuPropertyList[0].id === 0) || skuPropertyList.length > 1">{{scope.row.property_list[index].name}}</span>
                          <el-input v-else v-model="scope.row.property_list[index].name" size="mini"
                                    :class="['input-text-left', {'warn': isSkuNameWarn(scope.row.property_list[index].name, item.id) }]">
                            <span slot="append" class="hint">{{ scope.row.property_list[index].name.length }} / 18</span>
                          </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column key="2" width="100">
                        <template slot="header" slot-scope="scope">
                            <span>库存</span>
                            <el-button type="text" class="table-header-btn" @click="dialogQuantityVisible=true"> <i class="el-icon-edit"></i> </el-button>
                        </template>
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.quantity" size="mini"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column key="3" v-if="isPddProduct" width="100">
                        <template slot="header" slot-scope="scope">
                            <span>团购价</span>
                            <el-tooltip effect="dark" placement="top" content="团购价设置调整后再上线">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                            <!--<el-button type="text" class="table-header-btn" @click="dialogPromoPriceVisible=true"> <i class="el-icon-edit"></i> </el-button>-->
                        </template>
                        <template slot-scope="scope">
                            <!--<el-input v-model="scope.row.promo_price" size="mini"></el-input>-->
                            <span>{{ scope.row.promo_price }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column key="4" width="100">
                        <template slot="header" slot-scope="scope">
                            <span v-if="isPddProduct">单买价</span>
                            <span v-else>价格</span>
                            <el-tooltip v-if="!isPddProduct" manua="true" class="item" effect="dark" placement="top" style="vertical-align: middle">
                                <div slot="content">
                                  <ul style="padding: 0; margin: 0;">其他平台SKU价格，请在上传抖音时设置单买价与团购价</ul>
                                </div>
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                            <el-button v-if="isPddProduct" type="text" class="table-header-btn" @click="dialogPriceVisible=true">
                              <i class="el-icon-edit"></i>
                            </el-button>
                        </template>
                        <template slot-scope="scope">
                            <el-input v-if="isPddProduct" v-model="scope.row.price" size="mini"></el-input>
                            <el-input v-else-if="scope.row.promo_price===0" v-model="scope.row.promo_price" size="mini"></el-input>
                            <span v-else>{{scope.row.promo_price}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column key="5" label="预览图" width="100" align="center" class-name="cell-tight">
                        <template slot-scope="scope">
                            <img style="height:40px" :src="scope.row.img">
                        </template>
                    </el-table-column>
                    <el-table-column key="6" v-if="skuPropertyList.length === 1 && skuRealShowList.length > 1" label="操作" width="80">
                      <template slot-scope="scope">
                          <el-button size="mini" @click="onDeleteSingleSku(scope.$index)" type="danger" plain>删除</el-button>
                      </template>
                    </el-table-column>
                </el-table>
                <div class="common-bottom">
                    <el-checkbox v-if="isShowShelvesCheck" v-model="checkedShelves" style="margin-left:-127px">
                        保存并上架
                    </el-checkbox>
                    <el-button type="primary" @click="onSaveProduct">{{ saveBtnText }}</el-button>
                </div>
            </el-tab-pane>

            <el-tab-pane label="轮播页" name="carousel">
               <span slot="label" v-if=" product.model.check_error_msg_static  && '2' in product.model.check_error_msg_static">轮播页
                   <el-tooltip effect="dark"  placement="top-start">
                    <div slot="content">
                         <ul style="padding: 0; margin: 0;" v-for="(v,i) in product.model.check_error_msg_static['2']['info']" :key="i">{{v}}</ul>
                    </div>
                    <el-badge :value="product.model.check_error_msg_static['2'].num" ></el-badge>
                </el-tooltip>
                </span>
                <div style="height: 400px; overflow: auto;">
                    <div style="padding: 0 70px 5px; color: gray"> * 打勾的为白底图 </div>
                    <pictures-upload-view ref="bannerPicListView" :belongType="0" :containLimit="10" :pictureUrlList="bannerPicUrlList">
                    </pictures-upload-view>
                </div>
                <div class="common-bottom">
                    <el-checkbox v-if="isShowShelvesCheck" v-model="checkedShelves" style="margin-left:-127px">
                        保存并上架
                    </el-checkbox>
                    <el-button type="primary" @click="onSaveProduct">{{ saveBtnText }}</el-button>
                </div>
            </el-tab-pane>

            <el-tab-pane label="详情页" name="detail">
              <span slot="label" v-if=" product.model.check_error_msg_static  && '3' in product.model.check_error_msg_static">详情页
                   <el-tooltip effect="dark"  placement="top-start">
                    <div slot="content">
                         <ul style="padding: 0; margin: 0;" v-for="(v,i) in product.model.check_error_msg_static['3']['info']" :key="i">{{v}}</ul>
                    </div>
                    <el-badge :value="product.model.check_error_msg_static['3'].num" ></el-badge>
                </el-tooltip>
                </span>
                <pictures-upload-view style="height: 400px" ref="descPicListView" :belongType="1" :containLimit="20" :pictureUrlList="descPicUrlList">
                </pictures-upload-view>
                <div class="common-bottom">
                    <el-checkbox v-if="isShowShelvesCheck" v-model="checkedShelves" style="margin-left:-127px">
                        保存并上架
                    </el-checkbox>
                    <el-button type="primary" @click="onSaveProduct">{{ saveBtnText }}</el-button>
                </div>
            </el-tab-pane>

            <el-tab-pane v-if="isShowTemplateTab" label="模板信息">
                <el-form class="setting-content" ref="form" :model="template.model" label-width="90px" style="height: 400px">
                    <el-form-item label="运费模板:">
                        <el-select v-model="template.model.cost_template_id" placeholder="请选择" size="mini">
                            <el-option v-for="item in template.model.template_list" :label="item.cost_template_name"
                                       :key="item.cost_template_id" :value="item.cost_template_id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否预售:">
                        <el-radio v-model="template.model.is_pre_sale" :label="1">预售</el-radio>
                        <el-radio v-model="template.model.is_pre_sale" :label="0">非预售</el-radio>
                    </el-form-item>
                    <el-form-item label="发货时间:">
                        <el-radio v-model="template.model.shipment_limit_second" :label="172800">48小时</el-radio>
                        <el-radio v-model="template.model.shipment_limit_second" :label="86400">24小时</el-radio>
                    </el-form-item>
                    <el-form-item label="承诺服务:">
                        <el-checkbox v-model="checkedRefundable" @change="onChangeTemplateCheckbox($event, 'is_refundable')">
                            7天无理由退货
                        </el-checkbox>
                        <el-checkbox v-model="checkedFolt" @change="onChangeTemplateCheckbox($event, 'is_folt')">
                            假一赔十
                        </el-checkbox>
                    </el-form-item>
                </el-form>
                <div class="common-bottom">
                    <el-checkbox v-if="isShowShelvesCheck" v-model="checkedShelves" style="margin-left:-127px">
                        保存并上架
                    </el-checkbox>
                    <el-button type="primary" @click="onSaveProduct">{{ saveBtnText }}</el-button>
                </div>
            </el-tab-pane>

            <el-tab-pane v-if="Object.keys(origionAttr).length > 0" label="来源数据">
                <el-form class="setting-content" style="height: 460px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item v-for="(val, key, index) in origionAttr" :key="index" :label="key + ':'"
                                          v-if="index < Object.keys(origionAttr).length/2"
                            >
                                <el-tooltip class="item" effect="light" placement="bottom">
                                    <div slot="content" style="max-width: 300px">{{ val }}</div>
                                    <span> {{ cutOrigionAttrStr(key, val) }} </span>
                                </el-tooltip>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item v-for="(val, key, index) in origionAttr" :key="index" :label="key + ':'"
                                          v-if="index >= Object.keys(origionAttr).length/2"
                            >
                                <el-tooltip class="item" effect="light" placement="bottom">
                                    <div slot="content" style="max-width: 300px">{{ val }}</div>
                                    <span> {{ cutOrigionAttrStr(key, val) }} </span>
                                </el-tooltip>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-tab-pane>
        </el-tabs>

        <el-dialog class="dialog-tight" title="修改分类" width="800px" :visible.sync="dialogVisible" @opened="onOpenedCate" append-to-body center>
            <category-select-view ref="categorySelectView" @changeCate="onChangeCate">
            </category-select-view>
        </el-dialog>

        <el-dialog title="批量修改库存" width="400px" :visible.sync="dialogQuantityVisible" append-to-body center>
            <div>
                <el-radio v-model="stockHandler.radio" label="1">
                    <span style="display:inline-block; width:100px">统一库存为</span>
                    <el-input v-model="stockHandler.textStock" size="mini" style="width:100px"
                              @focus="stockHandler.radio='1'"
                    ></el-input>
                </el-radio><br>
                <el-radio v-model="stockHandler.radio" label="2">
                    <span style="display:inline-block; width:100px">每个SKU库存加</span>
                    <el-input v-model="stockHandler.textStockAdd" size="mini" style="width:100px"
                              @focus="stockHandler.radio='2'"
                    ></el-input>
                </el-radio><br>
                <el-radio v-model="stockHandler.radio" label="3">
                    <span style="display:inline-block; width:100px">每个SKU库存减</span>
                    <el-input v-model="stockHandler.textStockSub" size="mini" style="width:100px"
                              @focus="stockHandler.radio='3'"
                    ></el-input>
                    <span class="explain">&nbsp; 小于 0 设为 0</span>
                </el-radio>
                <div style="text-align: center; padding-top: 20px">
                    <el-button type="primary" @click="handleBatchQuantity">确定</el-button>
                    <el-button @click="dialogQuantityVisible = false">取消</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="批量修改团购价" width="400px" :visible.sync="dialogPromoPriceVisible" append-to-body center>
            <div>
                <el-radio v-model="promoPriceHandler.radio" label="1">
                    <span style="display:inline-block; width:100px">统一价格为</span>
                    <el-input v-model="promoPriceHandler.textPrice" size="mini" style="width:100px"
                              @focus="promoPriceHandler.radio='1'"
                    ></el-input>
                    <span style="display:inline-block;">元</span>
                </el-radio><br>
                <el-radio v-model="promoPriceHandler.radio" label="2">
                    <span style="display:inline-block; width:100px">每个SKU价格加</span>
                    <el-input v-model="promoPriceHandler.textPriceAdd" size="mini" style="width:100px"
                              @focus="promoPriceHandler.radio='2'"
                    ></el-input>
                    <span style="display:inline-block;">元</span>
                </el-radio><br>
                <el-radio v-model="promoPriceHandler.radio" label="3">
                    <span style="display:inline-block; width:100px">每个SKU价格减</span>
                    <el-input v-model="promoPriceHandler.textPriceSub" size="mini" style="width:100px"
                              @focus="promoPriceHandler.radio='3'"
                    ></el-input>
                    <span style="display:inline-block;">元</span>
                    <span class="explain">&nbsp; 小于 0 设为 0</span>
                </el-radio>
                <el-radio v-model="promoPriceHandler.radio" label="4">
                    <span style="display:inline-block; width:100px">每个SKU价格加</span>
                    <el-input v-model="promoPriceHandler.textPricePercentAdd" size="mini" style="width:100px"
                              @focus="promoPriceHandler.radio='4'"
                    ></el-input>
                    <span style="display:inline-block;">%</span>
                </el-radio>
                <el-radio v-model="promoPriceHandler.radio" label="5">
                    <span style="display:inline-block; width:100px">每个SKU价格减</span>
                    <el-input v-model="promoPriceHandler.textPricePercentSub" size="mini" style="width:100px"
                              @focus="promoPriceHandler.radio='5'"
                    ></el-input>
                    <span style="display:inline-block;">%</span>
                    <span class="explain">&nbsp; 小于 0 设为 0</span>
                </el-radio>
                <div style="text-align: center; padding-top: 20px">
                    <el-button type="primary" @click="handleBatchPromoPrice">确定</el-button>
                    <el-button @click="dialogPromoPriceVisible = false">取消</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="批量修改单买价" width="400px" :visible.sync="dialogPriceVisible" append-to-body center>
            <div>
                <el-radio v-model="priceHandler.radio" label="1">
                    <span style="display:inline-block; width:100px">统一价格为</span>
                    <el-input v-model="priceHandler.textPrice" size="mini" style="width:100px"
                              @focus="priceHandler.radio='1'"
                    ></el-input>
                    <span style="display:inline-block;">元</span>
                </el-radio><br>
                <el-radio v-model="priceHandler.radio" label="2">
                    <span style="display:inline-block; width:100px">每个SKU价格加</span>
                    <el-input v-model="priceHandler.textPriceAdd" size="mini" style="width:100px"
                              @focus="priceHandler.radio='2'"
                    ></el-input>
                    <span style="display:inline-block;">元</span>
                </el-radio><br>
                <el-radio v-model="priceHandler.radio" label="3">
                    <span style="display:inline-block; width:100px">每个SKU价格减</span>
                    <el-input v-model="priceHandler.textPriceSub" size="mini" style="width:100px"
                              @focus="priceHandler.radio='3'"
                    ></el-input>
                    <span style="display:inline-block;">元</span>
                    <span class="explain">&nbsp; 小于 0 设为 0</span>
                </el-radio>
                <el-radio v-model="priceHandler.radio" label="4">
                    <span style="display:inline-block; width:100px">每个SKU价格加</span>
                    <el-input v-model="priceHandler.textPricePercentAdd" size="mini" style="width:100px"
                              @focus="priceHandler.radio='4'"
                    ></el-input>
                    <span style="display:inline-block;">%</span>
                </el-radio>
                <el-radio v-model="priceHandler.radio" label="5">
                    <span style="display:inline-block; width:100px">每个SKU价格减</span>
                    <el-input v-model="priceHandler.textPricePercentSub" size="mini" style="width:100px"
                              @focus="priceHandler.radio='5'"
                    ></el-input>
                    <span style="display:inline-block;">%</span>
                    <span class="explain">&nbsp; 小于 0 设为 0</span>
                </el-radio>
                <div style="text-align: center; padding-top: 20px">
                    <el-button type="primary" @click="handleBatchPrice">确定</el-button>
                    <el-button @click="dialogPriceVisible = false">取消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import picturesUploadView from '@/components/PicturesUploadView'
import categorySelectView from '@/components/CategorySelectView'
import attributeView from '@/components/AttributeView.vue'
import request from '@/mixins/request.js'
import skuHandler from '@/mixins/skuHandler.js'
import utils from '@/common/utils'
import FormModel from '@/common/formModel'

export default {
  inject: ['reload'],
  mixins: [request, skuHandler],
  components: {
    picturesUploadView,
    categorySelectView,
    attributeView
  },
  data () {
    return {
      dialogVisible: false,
      dialogQuantityVisible: false,
      dialogPromoPriceVisible: false,
      dialogPriceVisible: false,
      product: new FormModel([
        'title', 'price', 'cat_id', 'outer_id', 'description', 'skuMap', 'bannerPicUrlList', 'descPicUrlList', 'attrs'
      ]),
      template: new FormModel(),
      bannerPicUrlList: [],
      descPicUrlList: [],
      origionAttr: {},
      isPddProduct: false,
      isShowTemplateTab: false,
      saveBtnText: '保存',
      checkedRefundable: false,
      checkedFolt: false,
      haveAttr: false,
      isRequiredComplete: false,
      isShowShelvesCheck: false,
      checkedShelves: false,
      activityTab: 'info'
    }
  },
  computed: {
    isTitleWarn () {
      // if (utils.getStrRealLength(this.product.model.title) > 60) {
      //   return true
      // }
      // if(this.product.model.check_error_msg_static){
      //   if('0' in this.product.model.check_error_msg_static){
      //     if('1005' in this.product.model.check_error_msg_static['0']['code']){
      //       return true
      //     }
      //   }
      // }
      return false
    },
    categoryBtnType () {
      if (this.product.model.check_error_msg_static && '0' in this.product.model.check_error_msg_static && '1012' in this.product.model.check_error_msg_static['0']['code']) {
        return 'danger'
      }
      return ''
    }
  },
  mounted () {

  },
  updated () {
    if (this.activityTab === 'sku') {
      let self = this
      this.skuPropertyList.forEach(item => {
        if (self.skuPropertyValueMap[item.id]) {
          for (let vid in self.skuPropertyValueMap[item.id]) {
            let ele = self.skuPropertyValueMap[item.id][vid]
            if (self.isSkuNameWarn(ele.value, item.id)) {
              if (self.$refs['sku-property-' + item.id]) {
                self.$refs['sku-property-' + item.id][0].show()
              }
            }
          }
        }
      })
    }
  },
  methods: {
    setProduct (tpProduct) {
      this.product.assign({
        tp_product_id: tpProduct.tp_product_id,
        title: tpProduct.title,
        price: utils.fenToYuan(tpProduct.max_price),
        cat_id: tpProduct.category_id,
        category_show: tpProduct.category_show,
        outer_id: tpProduct.tp_outer_iid,
        description: '',
        check_error_msg_static: tpProduct.check_error_msg_static
      })
      this.activityTab = this.setActiveTab()
      this.updateProperty()
    },
    setActiveTab () {
      if (this.product.model.check_error_msg_static) {
        if ('0' in this.product.model.check_error_msg_static) {
          return 'info'
        }
        if ('1' in this.product.model.check_error_msg_static) {
          return 'sku'
        }
        if ('2' in this.product.model.check_error_msg_static) {
          return 'carousel'
        }
        if ('3' in this.product.model.check_error_msg_static) {
          return 'detail'
        }
      }
      return 'info'
    },
    isTitleInfoWarn () {
      if (this.product.model.check_error_msg_static) {
        if ('0' in this.product.model.check_error_msg_static) {
          if ('1005' in this.product.model.check_error_msg_static['0']['code']) {
            return true
          }
        }
      }
      return false
    },
    updateProperty (catId = -1) {
      let params = { tp_product_id: this.product.model.tp_product_id, cat_id: catId }
      this.request('getTPProductProperty', params, data => {
        this.origionAttr = data.raw_attribute_json ? data.raw_attribute_json : {}
        this.haveAttr = this.$refs.attributeView.initAttribute(data.attribute_json)

        if (catId === -1) { // 首次初始化
          this.bannerPicUrlList = data.banner_json
          this.descPicUrlList = data.desc_json
          this.product.assign({description: data.desc_text})
          this.initSku(data.sku_json, data.tp_id)
          this.updateIsSingleSku()

          this.product.assign({skuMap: this.getSkuUploadObj().sku_map})
          this.product.assign({bannerPicUrlList: this.bannerPicUrlList.map(val => val['url'])})
          this.product.assign({descPicUrlList: this.descPicUrlList.map(val => val['url'])})
          this.product.assign({attrs: JSON.parse(JSON.stringify(this.$refs.attributeView.getAttrUploadList()))})
        }
      })
    },
    onDeleteSku (pId, pVid) {
      this.deleteSkus(pId, pVid)
    },
    onDeleteSingleSku (idx) {
      this.deleteSingleSku(idx)
    },
    onClose () {
      this.bannerPicUrlList = []
      this.descPicUrlList = []
      this.origionAttr = {}
      this.skuPropertyList = []
      this.skuShowList = []
      this.$refs['bannerPicListView'].clear()
      this.$refs['descPicListView'].clear()
      this.$refs['attributeView'].clear()
    },
    showSelectCateView () {
      this.dialogVisible = true
    },
    onOpenedCate () {
      // this.$refs.categorySelectView.initCate(this.product.model.cat_id, this.product.model.category_show)
    },
    onChangeCate (data) {
      this.dialogVisible = false
      this.product.model.cat_id = data.id
      this.product.model.category_show = data.name
      this.updateProperty(this.product.model.cat_id)
    },
    onChangeTemplateCheckbox (value, field) {
      this.template.model[field] = (value ? 1 : 0)
    },
    onSaveProduct () {
      let productParams = {
        tp_product_id: this.product.model.tp_product_id,
        category_id: this.product.model.cat_id,
        title: this.product.model.title,
        price: utils.yuanToFen(this.product.model.price),
        tp_outer_iid: this.product.model.outer_id,
        tp_property_json: JSON.stringify({
          attribute_json: this.$refs.attributeView.getAttrUploadList(),
          desc_text: this.product.model.description,
          sku_json: this.getSkuUploadObj()
        }),
        banner_pic_list: this.$refs['bannerPicListView'].curPictureUrlList,
        desc_pic_list: this.$refs['descPicListView'].curPictureUrlList
      }
      this.request('updateTPProduct', productParams, data => {
        this.$emit('changeProduct', {
          status: data.status,
          migration_msg: data.migration_msg,
          price: utils.yuanToFen(this.product.model.price),
          title: this.product.model.title,
          category_id: this.product.model.cat_id,
          category_show: this.product.model.category_show
        })
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        // this.reload()
        this.$emit('closeDialog')
      })
    },
    getStrRealLength (str) {
      return utils.getStrRealLength(str)
    },
    cutOrigionAttrStr (key, val) {
      let len = 50 - utils.getStrRealLength(key)
      let retStr = utils.getStrRealPrefix(val, len)
      if (val.length !== retStr.length) {
        retStr += '...'
      }
      return retStr
    },
    selectFilter (templatePid, key, callback) {
      let params = {
        cat_id: this.product.model.cat_id,
        template_pid: templatePid,
        key: key
      }
      this.request('selectFilter', params, data => {
        callback(data)
      }, undefined, true)
    },
    onAttrChanged (isRequiredComplete) {
      this.isRequiredComplete = isRequiredComplete
    },
    handleBatchQuantity () {
      this.batchEditQuantity()
      this.dialogQuantityVisible = false
    },
    handleBatchPromoPrice () {
      this.batchEditPromoPrice()
      this.dialogPromoPriceVisible = false
    },
    handleBatchPrice () {
      this.batchEditPrice()
      this.dialogPriceVisible = false
    },
    handlePropertyNameChange (pid, vid, ele) {
      this.updateNameOfSkuPropertyValueMap(pid, vid, ele['value'])
    },
    isSkuNameWarn (skuName, idx) {
      let cnt = 0
      for (let key in this.skuPropertyValueMap[idx]) {
        if (this.skuPropertyValueMap[idx][key]['value'].trim() === skuName.trim()) {
          cnt += 1
        }
      }
      if (cnt > 1) {
        return true
      }
      return skuName.length > 18
    },
    cellStyle ({row, column, rowIndex, columnIndex}) {
      return 'line-height: 26px;'
    },
    refreshProduct () {
      this.product.model.skuMap = this.getSkuUploadObj().sku_map
      this.product.model.bannerPicUrlList = this.$refs['bannerPicListView'].curPictureUrlList
      this.product.model.descPicUrlList = this.$refs['descPicListView'].curPictureUrlList
      this.product.model.attrs = JSON.parse(JSON.stringify(this.$refs.attributeView.getAttrUploadList()))
    },
    isProductChange () {
      this.refreshProduct()
      return this.product.isDiff()
    }
  }
}
// 注意修改该控件的继承 PddProductEditView.vue
</script>
<style lang="less" scoped>
    @import '~@/assets/css/base.less';
</style>

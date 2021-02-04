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
                        <el-button size="mini" @click="showSelectCateView">修改分类</el-button>
                    </el-form-item>
                    <el-form-item label="商品标题:">
                        <el-input v-model="product.model.title" size="mini"  style="width:70%"
                                  :class="['input-text-left', {'warn': (isTitleWarn || isTitleInfoWarn())}]"
                        >
                            <span slot="append" class="hint">{{ getTitleLength(product.model.title)}} / 30</span>
                        </el-input>
                        <span style="font-size: 10px;">（已自动删除平台违禁词）</span>

                    </el-form-item>
                    <el-form-item label="市场价:">
                        <el-input v-model="product.model.price" size="mini" class="input-price"></el-input> 元
                    </el-form-item>
                    <el-form-item v-if="!isDyProduct" label="商品描述:">
                        <el-input type="textarea" v-model="product.model.description" size="mini"
                                  :autosize="{ minRows: 1, maxRows: 10}" maxlength="500" show-word-limit>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="品牌:">
                      <div v-if="isDyProduct">
                        <span>{{ brandName }}</span>
                      </div>
                      <div v-else>
                        <el-select v-model="product.model.brand_id" placeholder="请选择" size="small" @change="changeBrand" clearable>
                          <el-option v-for="item in shopBrandList" :key="item.id" :value="item.id"
                                     :label="item.brand_chinese_name || item.brand_english_name"
                          ></el-option>
                        </el-select>
                        <el-button type="text" @click="reloadBrandList">
                            <i class="el-icon-refresh"></i>
                        </el-button>
                        <el-link v-if="product.model.cat_id !== 0" type="primary" target="_blank" :underline="false" style="margin-left: 10px;"
                                 :href="'https://fxg.jinritemai.com/index.html#/ffa/goods/qualification/edit?type=2&cid=' + product.model.cat_id"
                        >添加品牌</el-link>
                      </div>
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
                  <el-table-empty slot="empty"/>
                    <el-table-column v-for="(item, index) in skuPropertyList" :key="index+':'+item.id" width="130">
                        <template slot="header" slot-scope="scope">
                            <span :style="{color: (item.filter ? '#409EFF' : '#909399')}" >{{ item.name }}</span>
                            <el-dropdown v-if="skuPropertyValueMap[item.id] && skuPropertyList.length > 1"
                                         style="line-height:0px; padding-left: 0px; cursor:pointer; vertical-align: middle;"
                                         trigger="click" :hide-on-click="false"  placement="bottom" :ref="'sku-property-'+item.id"
                            >
                                <span class="el-dropdown-link" style="color:#909399">
                                  ({{Object.keys(skuPropertyValueMap[item.id]).length}})<hh-icon type="iconbianji" style="font-size:14px;margin-left:4px" /> <span style="color:#999999;font-size:12px;font-family:Arial;font-weight:bold">修改</span>
                                </span>
                                <el-dropdown-menu slot="dropdown" style="max-height: 250px; overflow: auto; overflow-x:hidden;">
                                    <el-dropdown-item v-for="(ele, vid) in skuPropertyValueMap[item.id]" :key="vid">
                                        <div style="display:flex">
                                            <el-checkbox v-model="ele.checked" @change="onSkuFilter" style="margin-right: 0">
                                              <span v-if="isDyProduct || skuPropertyList.length === 1">{{ele.value}}</span>
                                              <el-input style="width:340px" v-else v-model="ele.value" size="mini" @input="handlePropertyNameChange(item.id, vid, ele)"
                                                        :class="['input-text-left', {'warn': isSkuNameWarn(ele.value, item.id) }]">
                                                <span slot="append" class="hint">{{ ele.value.length }}</span>
                                              </el-input>
                                            </el-checkbox>
                                            <el-button v-if="Object.keys(skuPropertyValueMap[item.id]).length > 1 && !isDyProduct" size="mini" type="text" style="color:#F56C6C;margin-left:auto;padding-left: 10px"
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
                          <span v-if="isDyProduct || (skuPropertyList.length === 1 && skuPropertyList[0].id === 0) || skuPropertyList.length > 1">
                            {{scope.row.property_list[index].name}}
                          </span>
                          <el-input v-else v-model="scope.row.property_list[index].name" size="mini"
                                    :class="['input-text-left', {'warn': isSkuNameWarn(scope.row.property_list[index].name, item.id) }]">
                            <span slot="append" class="hint">{{ scope.row.property_list[index].name.length }} / 18</span>
                          </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column key="2" width="130">
                        <template slot="header" slot-scope="scope">
                            <span>总库存</span>
                            <el-button type="text" class="table-header-btn" @click="dialogQuantityVisible=true" style="padding:0">
                              <hh-icon type="iconbianji" style="font-size:14px" /> <span style="color:#999999;font-size:12px;font-family:Arial;font-weight:bold">修改</span>
                            </el-button>
                        </template>
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.quantity" size="mini"></el-input>
                        </template>
                    </el-table-column>
<!--                    <el-table-column key="3" v-if="isDyProduct" width="100">-->
<!--                        <template slot="header" slot-scope="scope">-->
<!--                            <span>结算价</span>-->
<!--                            <el-button type="text" class="table-header-btn" @click="dialogPromoPriceVisible=true"> <hh-icon type="iconbianji" style="font-size:14px" /> <b style="color:#999999;font-size:12px;font-family:Arial">修改</b> </el-button>-->
<!--                        </template>-->
<!--                        <template slot-scope="scope">-->
<!--                            <el-input v-model="scope.row.promo_price" size="mini"></el-input>-->
<!--                        </template>-->
<!--                    </el-table-column>-->
                    <el-table-column key="4" width="130">
                        <template slot="header" slot-scope="scope">
                            <span>价格</span>
                            <el-tooltip v-if="!isDyProduct" manua="true" class="item" effect="dark" placement="top" style="vertical-align: middle">
                                <div slot="content">
                                  <ul style="padding: 0; margin: 0;">其他平台SKU价格，请在上传抖音时设置市场价与结算价</ul>
                                </div>
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                            <el-button v-if="isDyProduct" type="text" class="table-header-btn" @click="dialogPriceVisible=true"  style="padding:0">
                              <hh-icon type="iconbianji" style="font-size:14px" /> <span style="color:#999999;font-size:12px;font-family:Arial;font-weight:bold">修改</span>
                            </el-button>
                        </template>
                        <template slot-scope="scope">
                            <el-input v-if="isDyProduct" v-model="scope.row.price" size="mini"></el-input>
                            <el-input v-else-if="scope.row.promo_price===0" v-model="scope.row.promo_price" size="mini"></el-input>
                            <span v-else>{{scope.row.promo_price}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column key="6" >
                        <template slot="header" slot-scope="scope">
                            <span>sku编码</span>
                        </template>
                        <template slot-scope="scope">
                            <el-input v-if="isDyProduct" v-model="scope.row.sku_id" size="mini"></el-input>
                            <el-input v-else-if="scope.row.sku_id===0" v-model="scope.row.sku_id" size="mini"></el-input>
                            <span v-else>{{scope.row.sku_id}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column key="6" width="130" v-if="Number(product.model.presell_type) === 0">
                        <template slot="header" slot-scope="scope">
                            <span>现货库存(现货模式)</span>
                        </template>
                        <template slot-scope="scope">
                            <el-input v-if="isDyProduct" v-model="scope.row.step_quantity" size="mini"></el-input>
                            <el-input v-else-if="scope.row.step_quantity===0" v-model="scope.row.step_quantity" size="mini"></el-input>
                            <span v-else>{{scope.row.step_quantity}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column key="6" width="130" v-if="Number(product.model.presell_type) === 1">
                        <template slot="header" slot-scope="scope">
                            <span>预售库存(预售模式)</span>
                        </template>
                        <template slot-scope="scope">
                            <el-input v-if="isDyProduct" v-model="scope.row.step_quantity" size="mini"></el-input>
                            <el-input v-else-if="scope.row.step_quantity===0" v-model="scope.row.step_quantity" size="mini"></el-input>
                            <span v-else>{{scope.row.step_quantity}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column key="6" width="130" v-if="Number(product.model.presell_type) === 2">
                        <template slot="header" slot-scope="scope">
                            <span>现货库存(阶梯模式)</span>
                        </template>
                        <template slot-scope="scope">
                            <el-input v-if="isDyProduct" v-model="scope.row.quantity" size="mini"></el-input>
                            <el-input v-else-if="scope.row.quantity===0" v-model="scope.row.quantity" size="mini"></el-input>
                            <span v-else>{{scope.row.quantity}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column key="6" width="130" v-if="Number(product.model.presell_type) === 2">
                        <template slot="header" slot-scope="scope">
                            <span>阶梯库存(阶梯模式)</span>
                        </template>
                        <template slot-scope="scope">
                            <el-input v-if="isDyProduct" v-model="scope.row.step_quantity" size="mini"></el-input>
                            <el-input v-else-if="scope.row.step_quantity===0" v-model="scope.row.step_quantity" size="mini"></el-input>
                            <span v-else>{{scope.row.step_quantity}}</span>
                        </template>
                    </el-table-column> -->

                    <el-table-column key="5" label="预览图" width="100" align="center" class-name="cell-tight">
                        <template slot-scope="scope">
                            <img style="height:40px" :src="scope.row.img">
                        </template>
                    </el-table-column>
                    <el-table-column key="6" v-if="skuPropertyList.length === 1 && skuRealShowList.length > 1 && !isDyProduct" label="操作" width="80">
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
                    <pictures-upload-view ref="bannerPicListView" :belongType="0" :containLimit="5" :pictureUrlList="bannerPicUrlList">
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
                <div style="height: 400px; overflow: auto;">
                  <pictures-upload-view style="height: 400px" ref="descPicListView" :belongType="1" :containLimit="-1" :pictureUrlList="descPicUrlList">
                  </pictures-upload-view>
                </div>
                <div class="common-bottom">
                    <el-checkbox v-if="isShowShelvesCheck" v-model="checkedShelves" style="margin-left:-127px">
                        保存并上架
                    </el-checkbox>
                    <el-button type="primary" @click="onSaveProduct">{{ saveBtnText }}</el-button>
                </div>
            </el-tab-pane>

            <el-tab-pane v-if="isShowTemplateTab" label="模板信息">
                <el-form class="setting-content" ref="form" :model="template.model" label-width="100px" style="height: 400px">
                    <el-form-item label="付款方式:">
                        <el-radio-group v-model="template.model.pay_type">
                            <el-radio :label="0">货到付款</el-radio>
                            <el-radio :label="1">在线支付</el-radio>
                            <el-radio :label="2">两者都支持</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="客服号码:" prop="mobile">
                        <el-input v-model="template.model.mobile" size="medium" class="input-num" @input="check"></el-input>
                    </el-form-item>
                    <el-form-item label="承诺发货时间:" prop="delivery_delay_day">
                        <el-select v-model="template.model.delivery_delay_day" placeholder="请选择" size="small" @change="check">
                            <el-option label="2天" :value="2"></el-option>
                            <el-option label="3天" :value="3"></el-option>
                            <el-option label="5天" :value="5"></el-option>
                            <el-option label="7天" :value="7"></el-option>
                            <el-option label="10天" :value="10"></el-option>
                            <el-option label="15天" :value="15"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否预售:" prop="is_pre_sale">
                        <el-select v-model="template.model.is_pre_sale" placeholder="请选择" size="small" @change="check">
                            <el-option label="是" :value="1"></el-option>
                            <el-option label="否" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="template.model.is_pre_sale" label="预售结束时间:" prop="preSaleDate">
                      <el-date-picker v-model="preSaleDate"
                                      type="datetime"
                                      placeholder="选择日期" size="small" class="input-date-left"
                                      style="width: 190px;"
                                      :picker-options="pickerOptions"
                                      @change="check"
                      > </el-date-picker>
                    </el-form-item>
                    <el-form-item v-if="template.model.is_pre_sale" label="预售结束后几天发货:" prop="presell_delay">
                      <el-select v-model="template.model.presell_delay" placeholder="请选择" size="small" @change="check">
                        <el-option v-for="item in dateRange" :key="item" :label="item" :value="item"></el-option>
                      </el-select>
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

        <el-dialog title="批量修改价格" width="400px" :visible.sync="dialogPriceVisible" append-to-body center>
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
import moment from 'moment'

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
        'title', 'price', 'cat_id', 'outer_id', 'description', 'skuMap', 'bannerPicUrlList', 'descPicUrlList', 'attrs', 'brand_id'
      ]),
      template: new FormModel(),
      bannerPicUrlList: [],
      descPicUrlList: [],
      shopBrandList: [],
      origionAttr: {},
      isDyProduct: false,
      isShowTemplateTab: false,
      preSaleDate: null,
      pickerOptions: this.disabledDate(),
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
      if (this.getTitleLength(this.product.model.title) > 30) {
        return true
      }
      return false
    },
    brandName () {
      let brandName = ''
      for (let i in this.shopBrandList) {
        let item = this.shopBrandList[i]
        if (this.product.model.brand_id === item.id) {
          brandName = item.brand_chinese_name || item.brand_english_name
          break
        }
      }
      return brandName
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
          this.shopBrandList = data.shop_brand_list
          this.product.assign({description: data.desc_text})
          this.initSku(data.sku_json, data.tp_id)
          this.updateIsSingleSku()

          this.product.assign({skuMap: this.getSkuUploadObj().sku_map})
          this.product.assign({bannerPicUrlList: this.bannerPicUrlList.map(val => val['url'])})
          this.product.assign({descPicUrlList: this.descPicUrlList.map(val => val['url'])})
          this.product.assign({attrs: JSON.parse(JSON.stringify(this.$refs.attributeView.getAttrUploadList()))})
          if (data.brand_id) {
            this.product.assign({brand_id: data.brand_id})
          }
        }
      })
    },
    reloadBrandList () {
      this.request('getShopBrandList', {}, data => {
        this.shopBrandList = data
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
      if (this.product.model.cat_id !== 0) {
        this.$refs.categorySelectView.initCate(this.product.model.cat_id, this.product.model.category_show)
      } else {
        this.$refs.categorySelectView.initCate()
      }
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
          sku_json: this.getSkuUploadObj(),
          brand_id: this.product.model.brand_id || 0
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
    getTitleLength (title) {
      return utils.getDyStrRealLength(title)
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
      return (false && (skuName.length > 18))
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
    },
    disabledDate (time) {
      let self = this
      return {
        disabledDate (time) {
          let curTime = time.getTime()
          // “预售时间不能小于当前时间+承诺发货时间+1天之和”
          // “预售时间不可超过30天”（今天为1天，最后1天也为1天，29天）
          return curTime < moment().startOf('day').add(1, 'days').valueOf() + self.template.model.delivery_delay_day * 1000 ||
            curTime > moment().startOf('day').add(28, 'days').valueOf()
        }
      }
    }
  }
}
// 注意修改该控件的继承 DyProductEditView.vue
</script>

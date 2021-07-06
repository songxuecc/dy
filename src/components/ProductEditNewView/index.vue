<template lang="html">
  <div style="height: 100%" >
    <el-row :gutter="20" style="height: 100%">
      <el-col :span="7" style="height: 100%; padding-right: 0px; padding-bottom: 80px;">
        <el-table ref="productList" :data="productList" row-key="tp_product_id" border :show-header="false" :cell-style="productListCellStyle"
                  :row-style="{height:'68px'}"
                  @current-change="handleProductSelect"
                  style="height: 100%; overflow-y: scroll;"
                  @cell-mouse-enter="handleMouseEnter" @cell-mouse-leave="handleMouseOut" @selection-change="handleSelectionChange"
        >
            <el-table-column width="1">
              <template slot-scope="scope">
                <el-tooltip manual :value="scope.row.index === mouseOverIndex"  v-if="scope.row.status === 5 || scope.row.status === 6 || scope.row.status === 8" :disabled="scope.row.status !== 5 && scope.row.status !== 6 && scope.row.status !== 8" class="item" effect="dark" placement="left">
                    <div slot="content" style="max-width: 180px;" >
                      <ul style="padding: 0; margin: 0; margin-top: 6px;" v-for="(v,i) in scope.row.migration_msg" :key="i">{{v}}</ul>
                    </div>
                    <i></i>
                </el-tooltip>
                <el-tooltip style="max-width: 50px;" manual :value="scope.row.index === mouseOverIndex" v-if="scope.row.status === 7" :disabled="scope.row.status !== 7" class="item" effect="dark" placement="left">
                    <div slot="content" style="max-width: 180px;">
                      <ul v-if="scope.row.migration_msg.length!=0" style="padding: 0; margin: 0;" v-for="(v,i) in scope.row.migration_msg" :key="i">{{v}}</ul>
                      <ul v-if="scope.row.migration_msg.length===1 && scope.row.migration_msg[0].length===0" style="padding: 0; margin: 0;">如需帮助请 <a href="/service" style="color: white;">联系客服</a>。</ul>
                    </div>
                    <i></i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column type="selection">
            </el-table-column>
            <el-table-column label="图片" width="80" align="center">
                <template slot-scope="scope">
                  <el-badge class="item" :value="Object.values(scope.row.check_error_msg_static).map(item => item.num).reduce((total, num) => total + num)"
                            v-if="scope.row.check_error_msg_static && Object.keys(scope.row.check_error_msg_static).length > 0">
                    <img style="height:60px; max-width: 60px;" :src="scope.row.thumbnail">
                  </el-badge>
                  <img v-else style="height:60px" :src="scope.row.thumbnail">
                  <div v-if="scope.row.isEdit" style="height: 20px; width: 100%; background-color: #fecf23; bottom: 0; left: 0; position: absolute;" >已编辑</div>
                </template>
            </el-table-column>
            <el-table-column label="标题">
                <template slot-scope="scope">
                    <el-link type="primary" target="_blank" :underline="false">
                        {{ productTitleDic[scope.row.tp_product_id] }}
                    </el-link>
                </template>
            </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="17" style="height: 100%; padding-bottom: 100px;">
          <el-tabs v-loading="loadingCnt" v-model="activityTab" type="card" style="height: 100%;" @tab-click="handleTabClick">
              <el-tab-pane label="商品属性" name="info">
                  <span slot="label" v-if=" product.model.check_error_msg_static  && '0' in product.model.check_error_msg_static">商品属性
                    <el-tooltip effect="dark"  placement="top-start">
                      <div slot="content">
                           <ul style="padding: 0; margin: 0;" v-for="(v,i) in product.model.check_error_msg_static['0']['info']" :key="i">{{v}}</ul>
                      </div>
                      <el-badge :value="product.model.check_error_msg_static['0'].num" ></el-badge>
                  </el-tooltip>
                  </span>
                  <el-form class="setting-content" ref="form" :model="product.model" label-width="90px" :rules="rules">
                      <el-form-item label="商品分类:" required>
                          <span>{{ product.model.category_show }}</span>
                          <el-button size="mini" @click="showSelectCateView">修改分类</el-button>
                          <el-button size="mini"  @click="onApplySelectCateToSelection()" :disabled="product.model.cat_id === 0">批量修改选中商品</el-button>
                      </el-form-item>
                      <el-form-item label="商品标题:" style="margin-right: 20px;" required>
                          <div style="display:flex">
                            <el-input
                              v-model="product.model.title"
                              size="mini"
                              style="margin-right:4px"
                              :class="['input-text-left', {'warn': (isTitleWarn || isTitleInfoWarn())}]"
                              @input="onProductTitleChange">
                              <span slot="append" class="hint">{{ getTitleLength(product.model.title) }} / 30</span>
                          </el-input>
                          <el-button size="mini"  @click="onApplyTitleEditToSelection()">批量修改选中商品</el-button>
                          </div>
                          <!-- <span style="font-size: 10px;">（已自动删除平台违禁词） </span> -->
                        </el-form-item>
                        <el-form-item label="推荐语:" prop="recommend_remark" :inline-message="true" class="mr-20 mt-5">
                            <el-input
                              type="textarea"
                              size="mini"
                              maxlength="50"
                              minlength="8"
                              show-word-limit
                              v-model="product.model.recommend_remark"
                              :class="['input-text-left']"
                              placeholder="请填写商家推荐语设置"></el-input>
                        </el-form-item>
                        <el-form-item label="品牌:" :required="product.model.brand_id_require" style="display:none">
                          <el-select v-model="product.model.brand_id" placeholder="请选择" size="small" @change="changeBrand" clearable :disabled="true">
                            <el-option v-for="item in shopBrandList" :key="item.id" :value="item.id"
                                      :label="getBrandName(item)"
                            ></el-option>
                          </el-select>
                          <el-button type="text" @click="reloadBrandList" :loading="loadingBrandList">
                              <hh-icon type="iconjiazai" style="font-size:12px;" v-if="!loadingBrandList"/>
                          </el-button>
                          <el-link v-if="product.model.cat_id !== 0" type="primary" target="_blank" :underline="false" style="margin-left: 10px;"
                                  :href="'https://fxg.jinritemai.com/index.html#/ffa/goods/qualification/edit?type=2&cid=' + product.model.cat_id"
                          >添加品牌</el-link>
                          <el-button size="mini" type="primary" @click="applySelectBrandToSelection()">应用到选中的商品</el-button>
                        </el-form-item>

                        <el-form-item  label="抖音属性:">
                            <property-set
                              @change="handlePropertyset"
                              :catId="product.model.cat_id"
                              :productModel="product.model.attrList"
                              ref="propertySet"
                              :propertyBatchMapSelect="propertyBatchMap.get(product.model.tp_product_id)"
                              @applySelectBrandToSelection="applySelectBrandToSelection()"
                              @applyPropertiesToSelection="applyPropertiesToSelection"
                              @reloadBrandList="reloadBrandList"
                              :forceUpdateKey="forceUpdatePropertySet"
                              ></property-set>
                        </el-form-item>
                      </el-form>
                      <div class="common-bottom">
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

                  <SkuSelect
                    :specifications="specifications"
                    @change="onSkuSelectChange"/>
                            <!-- :span-method="objectSpanMethod" -->

                  <el-table :data="skuRealShowList" border style="width: 100%" :header-cell-style="cellStyle" class="setting-content"
                            :cell-class-name="cellClassName"
                            row-class-name="rowClass"
                            :span-method="objectSpanMethod"
                            row-key="keys"
                  >
                      <el-table-column v-for="(item, index) in getSpecifications(specifications)" :key="index+':'+item.id">
                          <template slot="header" slot-scope="scope">
                              <span :style="{color: (item.filter ? '#409EFF' : '#909399')}">{{ item.specificationName }}</span>
                              <el-dropdown v-if="skuPropertyValueMap[item.spec_id] && specifications.length > 1"
                                           style="line-height:0px; padding-left: 0px; cursor:pointer; vertical-align: middle;"
                                           trigger="click" :hide-on-click="false"  placement="bottom" :ref="'sku-property-'+item.id"
                              >
                                  <span class="el-dropdown-link" style="color:#909399">
                                    ({{item.specificationValueList.length}})<hh-icon type="iconbianji" style="font-size:12px;margin-left:4px" /> <span style="color:#999999;font-size:12px;font-family:Arial">修改</span>
                                  </span>
                                  <el-dropdown-menu slot="dropdown" style="max-height: 250px; overflow: auto; overflow-x:hidden;">
                                      <el-dropdown-item v-for="(ele, vid) in item.specificationValueList" :key="vid">
                                          <div style="display:flex">
                                              <el-checkbox v-model="ele.checked" @change="onSkuFilter" style="margin-right: 0">
                                                <span v-if="specifications.length === 1">{{ele.value}}</span>
                                                <el-input style="width:340px" v-else v-model="ele.value" size="mini" @input="handlePropertyNameChange(item.id, vid, ele)"
                                                          :class="['input-text-left']">
                                                  <!-- <span slot="append" class="hint">{{ ele.value.length }} / 18</span> -->
                                                </el-input>
                                              </el-checkbox>
                                              <el-button v-if="item.specificationValueList.length > 1" size="mini" type="text" style="color:#F56C6C;margin-left:auto;padding-left: 10px"
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
                          <template slot-scope="scope" >
                            <span style="display: block;width: 100%;height: 100%;box-sizing: border-box;padding:10px;" v-if="scope.row.property_list[index]">{{scope.row.property_list[index].value}}</span>
                            <!-- <span style="display: block;width: 100%;height: 100%;box-sizing: border-box;padding:10px;"
                            v-if="(skuPropertyList.length === 1 && skuPropertyList[0].id === 0) || skuPropertyList.length > 1">{{scope.row.property_list[index].name}}</span>
                            <el-input v-else v-model="scope.row.property_list[index].name" size="mini"
                                      :class="['input-text-left']"> -->
                              <!-- <span slot="append" class="hint">{{ scope.row.property_list[index].name.length }} / 18</span> -->
                            <!-- </el-input> -->
                          </template>
                      </el-table-column>
                      <el-table-column key="2" width="130">
                          <template slot="header" slot-scope="scope">
                              <span>总库存</span>
                              <el-button type="text" class="table-header-btn" @click="dialogQuantityVisible=true" style="padding:0display: inline-flex;
    align-items: center;
    justify-content: center;"> <hh-icon type="iconbianji" style="font-size:12px" /> <span style="color:#999999;font-size:12px;font-family:Arial">修改</span></el-button>
                          </template>
                          <template slot-scope="scope">
                              <!-- <el-toolTip :content="scope.row.quantityBorder ? '只可以输入0-1000000的数字':''" effect="dark" placement="top">
                                <el-input v-model.number="scope.row.quantity" size="mini" type="textarea"  class="my-textarea" :class="[scope.row.quantityBorder ?'red':'']"
                              @input="getStyle($event,scope.row,'quantityBorder','quantity')"></el-input>
                              </el-toolTip> -->

                              <el-tooltip effect="light" placement="top" v-if="scope.row.quantityBorder" popper-class="ProductEditNewView-popper-class">
                                  <div slot="content" >
                                    <ul style="padding: 0; margin: 0;" class="fail">只可以输入0-1000000的数字</ul>
                                  </div>
                                  <el-input @input="getPriceStyle($event,scope.row,'quantityBorder','quantity')" v-model="scope.row.quantity" size="mini" :class="[scope.row.quantityBorder ?'red':'']" type="textarea"  class="my-textarea"></el-input>
                              </el-tooltip>
                              <el-input v-if="!scope.row.quantityBorder" @input="getPriceStyle($event,scope.row,'quantityBorder','quantity')" v-model="scope.row.quantity" size="mini" :class="[scope.row.promo_priceBorder ?'red':'']" type="textarea"  class="my-textarea"></el-input>
                          </template>
                      </el-table-column>
                      <el-table-column key="4" width="130">
                          <template slot="header" slot-scope="scope">
                              <span>价格</span>
                            <el-button type="text" class="table-header-btn" @click="dialogPromoPriceVisible=true" style="padding:0">
                              <hh-icon type="iconbianji" style="font-size:12px" />
                              <span style="color:#999999;font-size:12px;">修改</span>
                            </el-button>
                              <el-tooltip manua="true" class="item" effect="dark" placement="top" style="vertical-align: middle">
                                  <div slot="content">
                                    <ul style="padding: 0; margin: 0;margin-bottom:5px">其他平台SKU价格，请在上传抖音时设置价格</ul>
                                    <ul style="padding: 0; margin: 0;">请设置为初始价格，并非价格公示计算的价格</ul>
                                  </div>
                                  <i class="el-icon-question"></i>
                              </el-tooltip>
                          </template>
                          <template slot-scope="scope">
                             <el-tooltip effect="light" placement="top" v-if="scope.row.promo_priceBorder" popper-class="ProductEditNewView-popper-class">
                                  <div slot="content" >
                                    <ul style="padding: 0; margin: 0;" class="fail">只可以输入0.01-9999999.99 的数字,最多保留2位小数</ul>
                                  </div>
                                  <el-input @input="getPriceStyle($event,scope.row,'promo_priceBorder','promo_price')" v-model="scope.row.promo_price" size="mini" :class="[scope.row.promo_priceBorder ?'red':'']" type="textarea"  class="my-textarea"></el-input>
                              </el-tooltip>
                              <el-input v-if="!scope.row.promo_priceBorder" @input="getPriceStyle($event,scope.row,'promo_priceBorder','promo_price')" v-model="scope.row.promo_price" size="mini" :class="[scope.row.promo_priceBorder ?'red':'']" type="textarea"  class="my-textarea"></el-input>
                          </template>
                      </el-table-column>
                      <el-table-column key="5" width="150">
                          <template slot="header" slot-scope="scope">
                            <div class="center">
                              <span @click="toggleVisibleSkuImport" >商品编码</span>
                            <el-button type="text" class="table-header-btn" @click="dialogCodeVisible=true" style="padding:0display: inline-flex;align-items: center;justify-content: center;">
                              <hh-icon type="iconbianji" style="font-size:12px" />
                              <span style="color:#999999;font-size:12px;">修改</span>
                            </el-button>
                            <br/>
                            <span class="info pointer" @click="toggleVisibleSkuImport"><i class="el-icon-question" style="color:red"></i>无法抓取</span>
                            </div>
                          </template>
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.code" size="mini" :class="['input-text-left']" type="textarea"  class="my-textarea"></el-input>
                          </template>
                      </el-table-column>
                      <el-table-column key="6" label="预览图" width="100" align="center" class-name="cell-tight">
                          <template slot-scope="scope">
                            <div class="preview" style="padding:4px" v-if="scope.row.img">
                              <el-image
                                slot="reference"
                                style="width: 40px; height: 40px"
                                class="pointer"
                                :src="scope.row.img"
                                :preview-src-list="[scope.row.img]">
                              </el-image>
                            </div>

                          </template>
                      </el-table-column>
                      <el-table-column key="7" v-if="skuPropertyList.length === 1 && skuRealShowList.length > 1" label="操作" width="80">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="onDeleteSingleSku(scope.$index)" type="danger" plain>删除</el-button>
                        </template>
                      </el-table-column>
                  </el-table>
                  <div class="common-bottom">
                </div>
              </el-tab-pane>

              <el-tab-pane label="轮播页" name="carousel">
                <div style="width: 100%; text-align: left;">
                  <el-button size="mini" sytle="" type="primary" @click="applyRemoveFirstBannerToSelection()">批量去除选中商品轮播图首图</el-button>
                  <el-button v-if="product.originModel.bannerPicUrlList && product.originModel.bannerPicUrlList.length > 1 && productRemoveFirstBannerDic[product.model.tp_product_id]" size="mini" sytle="" type="error" @click="cancelRemoveFirstBanner()">还原本商品轮播图</el-button>
                </div>
                 <span slot="label" v-if=" product.model.check_error_msg_static  && '2' in product.model.check_error_msg_static">轮播页
                     <el-tooltip effect="dark"  placement="top-start">
                      <div slot="content">
                           <ul style="padding: 0; margin: 0;" v-for="(v,i) in product.model.check_error_msg_static['2']['info']" :key="i">{{v}}</ul>
                      </div>
                      <el-badge :value="product.model.check_error_msg_static['2'].num" ></el-badge>
                  </el-tooltip>
                  </span>
                  <div style="overflow: auto;">
                      <div style="padding: 0 70px 5px; color: gray"> * 拖动可调整顺序 </div>
                      <pictures-upload-view @imageChanged="onBannerImageChanged" ref="bannerPicListView" :belongType="0" :containLimit="5" :pictureUrlList="bannerPicUrlList">
                      </pictures-upload-view>
                  </div>
                  <div class="common-bottom">
                  </div>
              </el-tab-pane>

              <el-tab-pane label="详情页" name="detail">
                <div style="width: 100%; text-align: left;">
                  <el-button size="mini" sytle="" type="primary" @click="applyRemoveLastDescToSelection()">批量去除选中商品详情图尾图</el-button>
                  <el-button v-if="product.originModel.descPicUrlList && product.originModel.descPicUrlList.length > 1 && productRemoveLastDescDic[product.model.tp_product_id]" size="mini" sytle="" type="error" @click="cancelRemoveLastDesc()">还原本商品详情图</el-button>
                </div>
                <span slot="label" v-if=" product.model.check_error_msg_static  && '3' in product.model.check_error_msg_static">详情页
                     <el-tooltip effect="dark"  placement="top-start">
                      <div slot="content">
                           <ul style="padding: 0; margin: 0;" v-for="(v,i) in product.model.check_error_msg_static['3']['info']" :key="i">{{v}}</ul>
                      </div>
                      <el-badge :value="product.model.check_error_msg_static['3'].num" ></el-badge>
                  </el-tooltip>
                  </span>
                  <div style="overflow: auto;">
                      <div style="padding: 0 70px 5px; color: gray"> * 拖动可调整顺序 </div>
                      <pictures-upload-view @imageChanged="onDescImageChanged" ref="descPicListView" :belongType="1" :containLimit="45" :pictureUrlList="descPicUrlList">
                      </pictures-upload-view>
                  </div>
                  <div class="common-bottom">
                  </div>
              </el-tab-pane>
              <el-tab-pane v-if="Object.keys(origionAttr).length > 0" label="源商品属性">
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
              <el-tab-pane v-if="qualityList.length" label="服务与资质">
                  <el-form class="setting-content">
                      <PictureQualification :qualitys="qualityList"  @change="handlePictureQualificationChange"/>
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
                    <el-button @click="dialogQuantityVisible = false" style="width:100px">取消</el-button>
                    <el-button type="primary" @click="handleBatchQuantity" style="width:100px">确定</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="批量修改价格" width="500px" :visible.sync="dialogPromoPriceVisible" append-to-body center v-hh-modal>
            <div>
                <div class="fail center mb-5">此价格为初始价格，并非价格公示计算的价格</div>
                <div class="fail center mb-10">真实的售卖价请在后续价格页面设置</div>
                <el-radio v-model="promoPriceHandler.radio" label="1">
                    <span style="display:inline-block; width:150px">统一价格为</span>
                    <el-input v-model="promoPriceHandler.textPrice" size="mini" style="width:150px"
                              @focus="promoPriceHandler.radio='1'"
                    ></el-input>
                    <span style="display:inline-block;">元</span>
                </el-radio><br>
                <el-radio v-model="promoPriceHandler.radio" label="2">
                    <span style="display:inline-block; width:150px">每个SKU价格加数字：</span>
                    <el-input v-model="promoPriceHandler.textPriceAdd" size="mini" style="width:150px"
                              @focus="promoPriceHandler.radio='2'"
                    ></el-input>
                    <span style="display:inline-block;">元</span>
                </el-radio><br>
                <el-radio v-model="promoPriceHandler.radio" label="3">
                    <span style="display:inline-block; width:150px">每个SKU价格减数字：</span>
                    <el-input v-model="promoPriceHandler.textPriceSub" size="mini" style="width:150px"
                              @focus="promoPriceHandler.radio='3'"
                    ></el-input>
                    <span style="display:inline-block;">元</span>
                    <span class="explain">&nbsp; 小于 0 设为 0</span>
                </el-radio>
                <el-radio v-model="promoPriceHandler.radio" label="4">
                    <span style="display:inline-block; width:150px">每个SKU价格加百分比：</span>
                    <el-input v-model="promoPriceHandler.textPricePercentAdd" size="mini" style="width:150px"
                              @focus="promoPriceHandler.radio='4'"
                    ></el-input>
                    <span style="display:inline-block;">%</span>
                </el-radio>
                <el-radio v-model="promoPriceHandler.radio" label="5">
                    <span style="display:inline-block; width:150px">每个SKU价格减百分比：</span>
                    <el-input v-model="promoPriceHandler.textPricePercentSub" size="mini" style="width:150px"
                              @focus="promoPriceHandler.radio='5'"
                    ></el-input>
                    <span style="display:inline-block;">%</span>
                    <span class="explain">&nbsp; 小于 0 设为 0</span>
                </el-radio>
                <div style="text-align: center; padding-top: 20px">
                    <el-button @click="dialogPromoPriceVisible = false"  style="width:100px">取消</el-button>
                    <el-button type="primary" @click="handleBatchPromoPrice"  style="width:100px">确定</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="批量修改编码" width="400px" :visible.sync="dialogCodeVisible" append-to-body center>
            <div>
                <el-input v-model="batchCodeInput" size="mini" ></el-input>
                <div style="text-align: center; padding-top: 20px">
                    <el-button @click="dialogCodeVisible = false" style="width:100px">取消</el-button>
                    <el-button type="primary" @click="handleBatchCode" style="width:100px">确定</el-button>
                </div>
            </div>
        </el-dialog>

      </el-col>
      <div style="display: flex; box-sizing: border-box; background-color: #EBEEF5; width: 100%; height: 80px; position: fixed; bottom: 0px; z-index: 999; margin-left: 10px;">
        <div style="width: 100%; height: 100%; padding-top: 20px; padding-left: 30px; text-align:right;">
            <el-button type="warning" style="display: block; " @click="onRevertSelection">全选/清空</el-button>
            <el-button type="warning" style="display: block; position: fixed; bottom: 20px; right: 140px; " @click="onRevertProduct">还原</el-button>
            <el-button type="primary" style="display: block; position: fixed; bottom: 20px; right: 20px; width: 100px;" @click="onSaveProduct">保存编辑</el-button>
        </div>
      </div>
    </el-row>
    <el-dialog
      title="保存中"
      :show-close="false"
      :visible.sync="isProductEditSaving"
      :closeOnClickModal="false"
      :append-to-body="true"
      width="30%">
       <el-progress :text-inside="true" :stroke-width="26" :percentage="productEditSavingPercent"></el-progress>
    </el-dialog>
    <el-dialog
      :visible.sync="applySelectCateToAllVisible"
      width="30%"
      :append-to-body="true">
      <span slot="title" style="font-size: large;"><i class="el-icon-warning" style="color: #fecf23"></i> 批量修改分类</span>
      <span>该操作会自动保存当前的所有编辑，改变本页被选中的商品的分类，并进行商品属性及sku的重新匹配（原先对属性及sku的编辑将被覆盖），是否继续？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="applySelectCateToAllVisible = false">取 消</el-button>
        <el-button type="primary" @click="applySelectCateToAll">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="batchEditTitleVisible"
      width="500px"
      :append-to-body="true">
      <span slot="title" style="font-size: large;"><i class="el-icon-warning" style="color: #fecf23"></i> 批量修改标题</span>
      <div>
        <div style="width: 440px;">
          <el-input v-model="textHandler.textPrefix" size="small" placeholder="前缀" style="width: 160px;"></el-input>
          <span>原标题</span>
          <el-input v-model="textHandler.textSuffix" size="small" placeholder="后缀" style="width: 160px;"></el-input>
          <el-button type="primary" size="small" @click="applyTitleChangeToSelection(0)" style="margin-left: 10px;">应用</el-button>
        </div>
      </div><br/>
      <div>
        <div style="width: 440px;">
          <el-input v-model="textHandler.textReplace1" size="small" style="width: 160px;"></el-input>
          <span>替换为</span>
          <el-input v-model="textHandler.textReplace2" size="small" style="width: 160px;"></el-input>
          <el-button type="primary" size="small" @click="applyTitleChangeToSelection(1)" style="margin-left: 10px;">应用</el-button>
        </div>
      </div><br/>
      <div>
        <div style="width: 440px;">
          <el-input v-model="textHandler.textDelete" size="small" style="width: 160px;" placeholder="输入删除关键字"></el-input>
          <el-button type="primary" size="small" @click="applyTitleChangeToSelection(2)" style="margin-left: 10px;">应用</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="visibleSkuImport" width="30%"
      :append-to-body="true" v-hh-modal>
      <div slot="title" class="center" style="font-size: large;text-align:center">提示</div>
      <div style="text-align:center">
        <p>因商品编码属于商家后台的字段，故无法获取。</p>
        <p>您可在搬家上线成功后在【导入修改】中导入"规格名称-</p>
        <p>sku编码"对应表格进行修改。</p>
        <div class="flex  justify-c align-c skuImportDialoag">
          <img :src="skuImport"  style="width:176px;"/>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'
import request from '@/mixins/request.js'
import skuHandlerProductNewEdit from '@/mixins/skuHandlerProductNewEdit.js'
import utils from '@/common/utils'
import FormModel from '@/common/formModel'
import { TextHandler } from '@/common/batchEditHandler'
import skuImport from '@/assets/images/sku_import.png'
import categorySelectView from '@/components/CategorySelectView'
import picturesUploadView from '@/components/PicturesUploadView'
import PropertySet from './PropertySet.vue'
import SkuSelect from './SkuSelect.vue'
import PictureQualification from './PictureQualification.vue'
import shortid from 'shortid'
export default {
  inject: ['reload'],
  mixins: [request, skuHandlerProductNewEdit],
  components: {
    categorySelectView,
    picturesUploadView,
    PropertySet,
    SkuSelect,
    PictureQualification
  },
  props: {
    belongType: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      skuImport,
      dialogVisible: false,
      dialogQuantityVisible: false,
      dialogPromoPriceVisible: false,
      dialogCodeVisible: false,
      batchCodeInput: '',
      dialogPriceVisible: false,
      product: new FormModel([
        'title', 'price', 'cat_id', 'outer_id', 'description', 'skuMap', 'bannerPicUrlList', 'descPicUrlList', 'attrs', 'brand_id', 'specifications', 'skuShowList', 'quality_list'
      ]),
      template: new FormModel(),
      bannerPicUrlList: [],
      descPicUrlList: [],
      shopBrandList: [],
      origionAttr: {},
      qualityList: [],
      isShowTemplateTab: false,
      saveBtnText: '保存',
      checkedRefundable: false,
      checkedFolt: false,
      haveAttr: false,
      isRequiredComplete: false,
      isShowShelvesCheck: false,
      checkedShelves: false,
      isShowPromoPriceEditBtn: false,
      msgSkuError: '',
      activityTab: 'info',
      products: {},
      // rawProducts: {},
      productList: [],
      productTitleDic: {},
      productRemoveFirstBannerDic: {},
      productRemoveLastDescDic: {},
      productBrandDic: {},
      productDic: {},
      attrApplyCatMap: {},
      saveAll: false,
      isProductEditSaving: false,
      productEditSavingPercent: 0,
      mouseOverIndex: -1,
      isLoading: false,
      applySelectCateToAllVisible: false,
      applySelectBrandToAllVisible: false,
      hasSelection: false,
      selectedProductIds: [],
      batchEditTitleVisible: false,
      textHandler: new TextHandler(),
      closeAfterSave: false,
      // 属性商品应用到所有 的数据记录
      propertyBatchMap: new Map(),
      visibleSkuImport: false,
      forceUpdatePropertySet: 0,
      skuPropertyList: [],
      // 属性设置
      specifications: [
        {
          specificationName: '',
          newSpecificationName: '',
          addSkuImage: false,
          skuSelectCheckList: [],
          addSpecificationValue: '',
          specificationValueList: [],
          specificationNameVisible: false,
          date: new Date()
        }
      ],
      priceEditError: false,
      stockEditError: false
    }
  },
  watch: {
    product: {
      handler (val, oldVal) {
        if (oldVal.model.tp_product_id !== val.model.tp_product_id) {
          return
        }
        if (!this.productDic[val.model.tp_product_id]) {
          return
        }
        if (val.isDiff() || this.attrApplyCatMap[val.model.cat_id]) {
          this.productDic[val.model.tp_product_id].isEdit = true
        } else {
          this.productDic[val.model.tp_product_id].isEdit = false
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters({
      getTokenHeaders: 'getTokenHeaders'
    }),
    isTitleWarn () {
      if (this.getTitleLength(this.product.model.title) > 30) {
        return true
      }
      return false
    },
    showTooltip (idx) {
      return idx === this.mouseOverIndex
    },
    rules () {
      const checkDefaultRecommendRremark = (rule, value, callback) => {
        if (value) {
          if (
            value.split('').length < 8 || value.split('').length > 50
          ) {
            return callback(new Error('商家推荐语只可以填写8-50个字符！'))
          }
        }

        callback()
      }

      return {
        recommend_remark: [
          { validator: checkDefaultRecommendRremark, trigger: 'change' }
        ]
      }
    },
    disabledAddSkuImage () {
      // 没有一个sku设置 返回true
      // 有sku设置 且有一个sku内已经设置图片 返回true
      // 有sku 且没有一个sku内有图片 返回false
      return true
    }
  },
  mounted () {

  },
  updated () {
  },
  methods: {
    ...mapActions([
      'setIsShowFloatView'
    ]),
    ...mapGetters({
      subsc: 'getCurrentSubsc'
    }),
    getSpecifications (specifications) {
      return specifications.filter(item => {
        return item.specificationValueList.some(v => v.checked)
      })
    },
    onSkuSelectChange (specifications) {
      this.$set(this, 'specifications', specifications)
      this.handleSpecifications(specifications)
      this.product.model.skuShowList = this.skuShowList
      this.product.model.specifications = specifications
    },
    initList (tpProduct, tpProductList = []) {
      this.setIsShowFloatView(false)
      this.productList = tpProductList
      for (let i in this.productList) {
        this.productDic[this.productList[i].tp_product_id] = this.productList[i]
        this.productTitleDic[this.productList[i].tp_product_id] = this.productList[i].title
        this.productRemoveFirstBannerDic[this.productList[i].tp_product_id] = false
      }
      this.$refs.productList.setCurrentRow(tpProduct)
      let self = this
      setTimeout(function () {
        self.$refs.productList.$el.scrollTop = 85 * tpProduct.index
      }, 100)
      this.$refs.productList.toggleAllSelection()
      this.hasSelection = true
    },
    setProduct (tpProduct) {
      if (!(tpProduct.tp_product_id in this.products)) {
        this.product = new FormModel([
          'title', 'price', 'cat_id', 'outer_id', 'description',
          'skuMap', 'skuShowList', 'bannerPicUrlList', 'descPicUrlList', 'attrs', 'attrDic', 'attrList', 'brand_id', 'recommend_remark', 'specifications', 'quality_list'
        ])
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
        this.products[tpProduct.tp_product_id] = this.product
        this.updateProperty(tpProduct.tp_product_id)
      } else {
        this.product = this.products[tpProduct.tp_product_id]
        this.skuPropertyList = this.product.model.skuPropertyList
        this.skuPropertyValueMap = this.product.model.skuPropertyValueMap
        this.skuShowList = this.product.model.skuShowList
        this.specifications = this.product.model.specifications
        this.bannerPicUrlList = [...this.product.model.bannerPicUrlList]
        // this.$refs['bannerPicListView'].curPictureList = this.product.model.bannerPicUrlList
        this.descPicUrlList = [...this.product.model.descPicUrlList]
        // this.$refs['descPicListView'].curPictureList = this.product.model.descPicUrlList
        this.origionAttr = this.product.model.originAttr
        this.qualityList = [...this.product.model.qualityList]
        this.updateTitleChange()
        this.updateRemoveFirstBanner()
      }
    },
    handleProductSelect (val, old) {
      if (this.isLoading) {
        return false
      }
      if (old) {
        this.updateProductEditStatus()
      }
      this.setProduct(val)
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
    updateAttributeProperty (tpProductId) {
      this.isLoading = true
      const catId = this.product.originModel.cat_id !== this.product.model.cat_id ? this.product.model.cat_id : -1
      let params = { tp_product_id: tpProductId, cat_id: catId }
      this.request('getTPProductProperty', params, data => {
        this.product.assign({attrList: !isEmpty(data.attribute_json) ? data.attribute_json : []})
        const brand = (!isEmpty(data.attribute_json) ? data.attribute_json : []).find(item => item.name === '品牌')
        // 设置品牌是否必填
        if (brand && brand.required) {
          this.product.assign({brand_id_require: brand.required})
        }
        if (data.brand_id) {
          this.product.assign({brand_id: data.brand_id})
        }
        this.isLoading = false
      }, data => {
        this.isLoading = false
      })
    },
    formatqualityList (qualityList) {
      return qualityList.map(item => {
        item.quality_attachments = item.quality_attachments.map(i => {
          i.uid = item.url
          return i
        })
        return item
      })
    },
    updateProperty (tpProductId) {
      this.isLoading = true
      const catId = this.product.originModel.cat_id !== this.product.model.cat_id ? this.product.model.cat_id : -1
      let params = { tp_product_id: tpProductId, cat_id: catId }
      this.request('getTPProductProperty', params, data => {
        this.origionAttr = data.raw_attribute_json ? data.raw_attribute_json : {}
        // this.qualityList = data.quality_list ? data.quality_list : []
        const qualityList = data.quality_list ? data.quality_list : []
        this.qualityList = this.formatqualityList(qualityList)
        this.attribute_json = isEmpty(data.attribute_json) ? [] : data.attribute_json
        this.bannerPicUrlList = data.banner_json
        this.descPicUrlList = data.desc_json
        this.shopBrandList = data.shop_brand_list
        this.product.assign({description: data.desc_text})
        this.initSku(data.sku_json, data.tp_id)
        this.updateIsSingleSku()
        this.product.assign({skuMap: this.getSkuUploadObj().sku_map})
        this.product.assign({bannerPicUrlList: data.banner_json})
        this.product.assign({descPicUrlList: data.desc_json})
        this.product.assign({recommend_remark: data.recommend_remark})
        this.product.assign({skuPropertyList: [...this.skuPropertyList]})
        this.product.assign({skuPropertyValueMap: {...this.skuPropertyValueMap}})
        this.product.assign({sortSkuKeys: this.sortSkuKeys})
        this.product.assign({specifications: this.specifications})
        this.product.assign({skuShowList: [...this.skuShowList]})
        this.product.assign({originAttr: {...this.origionAttr}})
        this.product.assign({qualityList: [...this.qualityList]})
        this.product.assign({attrList: !isEmpty(data.attribute_json) ? data.attribute_json : []})
        const brand = (!isEmpty(data.attribute_json) ? data.attribute_json : []).find(item => item.name === '品牌')
        // 设置品牌是否必填
        if (brand && brand.required) {
          this.product.assign({brand_id_require: brand.required})
        }
        if (data.brand_id) {
          this.product.assign({brand_id: data.brand_id})
        }
        this.skuPropertyList = this.product.model.skuPropertyList
        this.skuPropertyValueMap = this.product.model.skuPropertyValueMap
        this.skuShowList = this.product.model.skuShowList
        this.sortSkuKeys = this.product.model.sortSkuKeys
        this.specifications = this.product.model.specifications
        this.qualityList = this.product.model.qualityList
        console.log(this.qualityList, 'this.qualityList')

        this.updateTitleChange()
        this.updateRemoveFirstBanner()

        if (this.productBrandDic.hasOwnProperty(this.product.model.tp_product_id)) {
          this.product.model.brand_id = this.productBrandDic[this.product.model.tp_product_id]
        }
        this.isLoading = false
      }, data => {
        if (tpProductId in this.products) {
          delete this.products[tpProductId]
        }
        this.isLoading = false
      })
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
    getTitleLength (title) {
      return utils.getDyStrRealLength(title)
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
    // 保存 修改的分类
    onChangeCate (data) {
      this.dialogVisible = false
      Object.assign(this.product.model, {cat_id: data.id})
      this.product.model.category_show = data.name
      this.updateAttributeProperty(this.product.model.tp_product_id)
      // 重置属性设置
      this.$refs.propertySet && this.$refs.propertySet.resetForm()
    },
    onBannerImageChanged (bannerPicUrlList) {
      Object.assign(this.product.model, {bannerPicUrlList: [...bannerPicUrlList]})
    },
    onDescImageChanged (descPicUrlList) {
      Object.assign(this.product.model, {descPicUrlList: [...descPicUrlList]})
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
    updateAttrApplyCat (attrApplyCat) {
      this.attrApplyCatMap = Object.assign({}, attrApplyCat)
      this.updateProductEditStatus()
    },
    handleBatchQuantity () {
      this.batchEditQuantity()
      this.product.model.skuShowList = this.skuShowList
      this.dialogQuantityVisible = false
    },
    handleBatchPromoPrice () {
      this.batchEditPromoPrice()
      this.product.model.skuShowList = this.skuShowList
      this.dialogPromoPriceVisible = false
    },
    handleBatchCode () {
      this.batchEditCode(this.batchCodeInput)
      this.product.model.skuShowList = this.skuShowList
      this.dialogCodeVisible = false
    },
    handlePropertyNameChange (pid, vid, ele) {
      this.updateNameOfSkuPropertyValueMap(pid, vid, ele['value'])
    },
    // isSkuNameWarn (skuName, idx) {
    //   let cnt = 0
    //   for (let key in this.skuPropertyValueMap[idx]) {
    //     if (this.skuPropertyValueMap[idx][key]['value'].trim() === skuName.trim()) {
    //       cnt += 1
    //     }
    //   }
    //   if (cnt > 1) {
    //     return true
    //   }
    //   return skuName.length > 18
    // },
    reloadBrandList () {
      this.loadingBrandList = true
      this.request('getShopBrandList', {}, data => {
        this.loadingBrandList = false
        this.shopBrandList = data
        const attrList = this.product.model.attrList.map(item => {
          if (item.name === '品牌') {
            item.options = data.map(item => ({
              value: `${item.id}`,
              name: this.getBrandName(item)
            }))
            if (data.length) {
              item.tp_value = `${data[0].id}`
            }
          }
          return item
        })
        Object.assign(this.product.model, {attrList})
        this.$message({
          message: '刷新成功',
          type: 'success'
        })
      })
    },
    onDeleteSku (pId, pVid) {
      console.log(pId, pVid, 'pId, pVid')
      this.deleteSkus(pId, pVid)
    },
    onDeleteSingleSku (idx) {
      this.deleteSingleSku(idx)
    },
    onChangeSingleSku (idx) {
      this.changeSingleSku(idx)
    },
    cutOrigionAttrStr (key, val) {
      let len = 50 - utils.getStrRealLength(key)
      let retStr = utils.getStrRealPrefix(val, len)
      if (val.length !== retStr.length) {
        retStr += '...'
      }
      return retStr
    },
    productListCellStyle ({row, column, rowIndex, columnIndex}) {
      if (
        this.productList.length > 0 &&
        this.productList[rowIndex].tp_product_id !== this.product.model.tp_product_id &&
        this.productList[rowIndex].category_id === this.product.model.cat_id) {
        return 'background-color:rgb(236, 245, 255);'
      }
      if (
        this.productList.length > 0 &&
        this.productList[rowIndex].tp_product_id === this.product.model.tp_product_id) {
        return 'background-color:rgb(179, 216, 255);'
      }
    },
    // 保存编辑
    async onSaveProduct () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '复制商品', '点击', '完成批量修改商品'])
      }

      let error = ''
      this.productList.forEach(item => {
        let tpProductId = item.tp_product_id
        if (tpProductId in this.products) {
        // 检验推荐语
          const product = this.products[tpProductId]
          const recommendRemark = product.model.recommend_remark
          if (recommendRemark) {
            if (recommendRemark.split('').length > 50 || recommendRemark.split('').length < 8) {
              error = '商家推荐语只可以填写8-50个字符！'
            }
          }
          // 检验价格 & 库存
          const skuShowList = product.model.skuShowList
          skuShowList
            .filter(sku => sku.quantity)
            .forEach(sku => {
              if (sku.quantity > 1000000 || sku.quantity < 0) {
                error = 'sku库存必填，且只可以输入0-1000000的数字'
              }
              if (sku.promo_price > 9999999.99 || sku.promo_price < 0.01) {
                error = 'sku价格必填，且只可以输入0.01-9999999.99 的数字,最多保留2位小数'
              }
            })
        }
      })

      if (error) {
        return this.$message.error(error)
      }
      try {
        const propertySetValid = this.$refs.propertySet && await this.$refs.propertySet.validate()
        if (propertySetValid) {
        // 没有修改分类时不用传参数
          this.productEditSavingPercent = 0
          this.isProductEditSaving = true
          this.saveProducts()
        }
      } catch (err) {
        return this.$message.error(err)
      }
    },
    saveProducts (catId = -1, updateCategoryTPProductIds = []) {
      let tpProductList = []
      let tpProductIdList = []
      const propertyBatchCatIdMap = this.propertyBatchCatIdMap || new Map()
      for (let i in this.productList) {
        let tpProductId = this.productList[i].tp_product_id
        if (this.products[tpProductId] && this.products[tpProductId].isDiff()) {
          if (tpProductId in this.products) {
            let product = this.products[tpProductId]
            // 品牌和属性内的品牌是同一个值
            let brandId = 0
            const brand = (product.model.attrList || []).find(item => item.name === '品牌')
            if (brand) {
              brandId = brand.tp_value
            }

            let productParams = {
              tp_product_id: product.model.tp_product_id,
              category_id: product.model.cat_id,
              title: product.model.title,
              price: utils.yuanToFen(product.model.price),
              tp_outer_iid: product.model.outer_id,
              tp_property_json: {
                // 属性设置数据
                attribute_json: product.model.attrList,
                desc_text: product.model.description,
                sku_list: product.model.skuShowList
                  .filter(item => item.quantity)
                  .map(item => {
                    return {
                      ...item,
                      price: utils.yuanToFen(item.price),
                      promo_price: utils.yuanToFen(item.promo_price)
                    }
                  }),
                spec_list: product.model.specifications,
                banner_json: product.model.bannerPicUrlList.map(val => val['url']),
                desc_json: product.model.descPicUrlList.map(val => val['url']),
                brand_id: brandId,
                recommend_remark: product.model.recommend_remark,
                quality_list: product.model.quality_list
              }
            }
            tpProductList.push(productParams)
          }
        } else {
          let productParams = {
            tp_product_id: this.productList[i].tp_product_id,
            category_id: this.productList[i].category_id,
            title: this.productList[i].title,
            price: utils.yuanToFen(this.productList[i].price),
            tp_outer_iid: this.productList[i].tp_outer_iid,
            tp_property_json: {}
          }
          let isChange = false
          if (this.productList[i].title !== this.productTitleDic[tpProductId]) {
            productParams['title'] = this.productTitleDic[this.productList[i].tp_product_id]
            isChange = true
          }
          if (this.productRemoveFirstBannerDic[tpProductId] && !this.products[tpProductId]) {
            productParams['tp_property_json'].remove_first_banner = true
            isChange = true
          }
          if (this.productBrandDic.hasOwnProperty(tpProductId) && !this.products[tpProductId]) {
            productParams['tp_property_json'].brand_id = this.productBrandDic[tpProductId] || 0
            isChange = true
          }
          if (this.productRemoveLastDescDic[tpProductId] && !this.products[tpProductId]) {
            productParams['tp_property_json'].remove_last_desc = true
            isChange = true
          }

          if (isChange) {
            tpProductList.push(productParams)
          }
        }
        const categoryId = this.productList[i].category_id
        const selectedProductIds = this.selectedProductIds
        // 处理批量修改属性的商品
        if (propertyBatchCatIdMap.get(categoryId) && selectedProductIds.includes(tpProductId)) {
          tpProductIdList.push(tpProductId)
        }
      }
      let attrApplyCatMap = {}
      const entries = [...propertyBatchCatIdMap.entries()]
      entries.forEach(([key, value]) => {
        attrApplyCatMap[key] = value
      })
      this.requestBatchUpdateTPProduct(tpProductList, tpProductIdList, attrApplyCatMap, 0, 0, catId, updateCategoryTPProductIds)
    },
    requestBatchUpdateTPProduct (tpProductList, tpProductIdList, attrApplyCatMap, tpProductListIdx, tpProductIdListIdx, catId, updateCategoryTPProductIds) {
      let tpProductListSlice = []
      let tpProductIdListSlice = []
      let attrApplyCatMapTemp = {}
      // 应用到全部商品属性时候
      if (tpProductListIdx < tpProductList.length) {
        tpProductListSlice = tpProductList.slice(tpProductListIdx, tpProductListIdx + 5)
      } else if (tpProductIdListIdx < tpProductIdList.length) {
        tpProductIdListSlice = tpProductIdList.slice(tpProductIdListIdx, tpProductIdListIdx + 5)
        attrApplyCatMapTemp = attrApplyCatMap
      }

      let self = this
      this.request('batchUpdateTPProduct', {
        tp_product_list: JSON.stringify(tpProductListSlice),
        tp_product_id_list: tpProductIdListSlice,
        attr_apply_map: JSON.stringify(attrApplyCatMapTemp)
      }, data => {
        // 更新商品列表信息
        self.changeProducts(data)
        self.propertyBatchMap = new Map()
        self.propertyBatchCatIdMap = new Map()
        // 更新已经保存的商品信息
        for (let i in tpProductListSlice) {
          let tpProductId = tpProductListSlice[i].tp_product_id
          if (self.products && tpProductId in self.products) {
            self.products[tpProductId].saveNow()
          }
        }
        if (tpProductListIdx >= tpProductList.length && tpProductIdListIdx >= tpProductIdList.length) {
          if (catId !== -1) {
            this.requestApplySelectCateToAll(this.product.model.cat_id, updateCategoryTPProductIds, 0, 50)
            return
          }
          // 批量保存完成
          self.productEditSavingPercent = 100
          self.products = {}
          self.productBrandDic = {}
          self.updateAttrApplyCat({})
          for (let i in this.productList) {
            this.productTitleDic[this.productList[i].tp_product_id] = this.productList[i].title
            this.productRemoveFirstBannerDic[this.productList[i].tp_product_id] = false
            this.productRemoveLastDescDic[this.productList[i].tp_product_id] = false
          }

          self.setProduct(self.productDic[self.product.model.tp_product_id])
          this.updateProductEditStatus()
          this.isProductEditSaving = false
          if (self.closeAfterSave) {
            this.$emit('triggerDialogClose')
            self.closeAfterSave = false
          }
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        } else {
          // 批量保存没完成继续处理
          let cnt = Math.min(tpProductListIdx + 5, tpProductList.length) + Math.min(tpProductIdListIdx + 5, tpProductIdList.length)
          if (catId !== -1) {
            self.productEditSavingPercent = parseInt(50 * cnt / (tpProductList.length + tpProductIdList.length))
          } else {
            self.productEditSavingPercent = parseInt(100 * cnt / (tpProductList.length + tpProductIdList.length))
          }
          if (tpProductListIdx < tpProductList.length) {
            self.requestBatchUpdateTPProduct(tpProductList, tpProductIdList, attrApplyCatMap, tpProductListIdx + 5, tpProductIdListIdx, catId, updateCategoryTPProductIds)
          } else {
            self.requestBatchUpdateTPProduct(tpProductList, tpProductIdList, attrApplyCatMap, tpProductListIdx, tpProductIdListIdx + 5, catId, updateCategoryTPProductIds)
          }
        }
      }, data => {
        this.isProductEditSaving = false
        if (data.message.includes('无法获取锁')) {
          this.$message({
            message: '已有任务在运行',
            type: 'warning'
          })
        } else {
          this.$message({
            message: '保存失败',
            type: 'error'
          })
        }
      }, true)
    },
    changeProducts (data, changeCid = false) {
      let arrTPProduct = []
      for (let i in data) {
        let tpProductId = data[i].tp_product_id
        if (tpProductId in this.products) {
          let tpProduct = {
            status: data[i].status,
            migration_msg: data[i].migration_msg,
            check_error_msg_static: data[i].check_error_msg_static,
            price: utils.yuanToFen(this.products[tpProductId].model.price),
            title: this.products[tpProductId].model.title,
            category_id: this.products[tpProductId].model.cat_id,
            category_show: this.products[tpProductId].model.category_show,
            tp_product_id: tpProductId
          }
          if (changeCid) {
            tpProduct['price'] = data[i].price
            tpProduct['title'] = data[i].title
            tpProduct['category_id'] = data[i].category_id
            tpProduct['category_show'] = data[i].category_show
          }
          this.products[tpProductId].model.check_error_msg_static = data[i].check_error_msg_static
          this.products[tpProductId].model.migration_msg = data[i].migration_msg
          arrTPProduct.push(tpProduct)
        } else if (tpProductId in this.productDic) {
          let tpProduct = {
            status: data[i].status,
            migration_msg: data[i].migration_msg,
            check_error_msg_static: data[i].check_error_msg_static,
            price: this.productDic[tpProductId].max_price,
            title: this.productTitleDic[tpProductId],
            category_id: this.productDic[tpProductId].category_id,
            category_show: this.productDic[tpProductId].category_show,
            tp_product_id: tpProductId
          }
          if (changeCid) {
            tpProduct['price'] = data[i].price
            tpProduct['title'] = data[i].title
            tpProduct['category_id'] = data[i].category_id
            tpProduct['category_show'] = data[i].category_show
          }
          arrTPProduct.push(tpProduct)
        }
      }
      this.$emit('changeProducts', arrTPProduct)
    },
    isProductChange () {
      return this.updateProductEditStatus()
    },
    // 还原
    onRevertProduct () {
      for (let i in this.products) {
        this.products[i].rollback()
      }
      for (let i in this.productList) {
        this.productTitleDic[this.productList[i].tp_product_id] = this.productList[i].title
        this.productRemoveFirstBannerDic[this.productList[i].tp_product_id] = false
        this.productRemoveLastDescDic[this.productList[i].tp_product_id] = false
      }
      this.productBrandDic = {}
      this.updateAttrApplyCat({})
      this.propertyBatchMap = new Map()
      this.propertyBatchCatIdMap = new Map()
      this.skuPropertyList = this.product.model.skuPropertyList
      this.skuPropertyValueMap = this.product.model.skuPropertyValueMap
      this.skuShowList = this.product.model.skuShowList
      this.$refs['bannerPicListView'].setCurPictureList(this.product.model.bannerPicUrlList)
      this.$refs['descPicListView'].setCurPictureList(this.product.model.descPicUrlList)
    },
    onClose () {
      this.setIsShowFloatView(true)
      for (let i in this.productList) {
        this.productList[i].isEdit = false
      }
      this.productDic = {}
      this.productList = []
      this.products = {}
      this.skuPropertyList = []
      this.skuShowList = []
      this.productTitleDic = {}
      this.productRemoveFirstBannerDic = {}
      this.productBrandDic = {}
      this.updateAttrApplyCat({})
      this.$refs['bannerPicListView'].clear()
      this.$refs['descPicListView'].clear()
      this.$refs['propertySet'].clearData()
    },
    handleMouseEnter (row, column, cell, event) {
      if (this.mouseOverIndex === row.index) {
        return
      }
      this.mouseOverIndex = row.index
    },
    handleMouseOut (row, column, cell, event) {
      this.mouseOverIndex = -1
    },
    onApplySelectCateToSelection () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '复制商品', '点击', '点击批量修改类别'])
      }
      this.applySelectCateToAllVisible = true
    },
    checkedPropertyBatchMapHasValue (tpProductId) {
      const propertyBatch = this.propertyBatchMap.get(tpProductId)
      if (!propertyBatch) return false
      // 只要有一个属性选中全选应用 就相当于编辑过
      const bool = Object.values(propertyBatch).some(item => {
        const product = Object.values(this.productList).find(product => product.tp_product_id === tpProductId)
        if (product && product.category_id === item.catId && item.checked) {
          return true
        }
        return false
      })
      return bool
    },
    updateProductEditStatus () {
      let isChanged = false
      for (let i in this.productList) {
        let tpProductId = this.productList[i].tp_product_id
        if (
          this.productDic[tpProductId].title !== this.productTitleDic[tpProductId] ||
          // 单个商品修改
          (this.products[tpProductId] && this.products[tpProductId].isDiff()) ||
          // 商品属性
          this.attrApplyCatMap[this.productList[i].category_id] ||
          // banner修改
          (this.productRemoveFirstBannerDic[tpProductId] && (!this.products[tpProductId] || (this.products[tpProductId] && this.products[tpProductId].model.bannerPicUrlList.length > 1))) ||
          // 详情图修改
          (this.productRemoveLastDescDic[tpProductId] && (!this.products[tpProductId] || (this.products[tpProductId] && this.products[tpProductId].model.descPicUrlList.length > 1))) ||
          // 品牌详情修改
          (this.productBrandDic.hasOwnProperty(tpProductId) && !this.products[tpProductId]) ||
          // 批量修改属性商品
          this.checkedPropertyBatchMapHasValue(tpProductId)
        ) {
          this.productDic[tpProductId].isEdit = true
          isChanged = true
        } else {
          this.productDic[tpProductId].isEdit = false
        }
      }
      return isChanged
    },
    cancelRemoveFirstBanner () {
      this.product.rollbackPart('bannerPicUrlList')
      this.bannerPicUrlList = [...this.product.model.bannerPicUrlList]
      this.productRemoveFirstBannerDic[this.product.model.tp_product_id] = false
    },
    /**
     * 取消当前商品的详情图批量去尾图
     */
    cancelRemoveLastDesc () {
      this.product.rollbackPart('descPicUrlList')
      this.descPicUrlList = [...this.product.model.descPicUrlList]
      this.productRemoveLastDescDic[this.product.model.tp_product_id] = false
    },
    applyRemoveFirstBannerToSelection () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '复制商品', '点击', '点击批量去除轮播图首图'])
      }
      for (let i in this.selectedProductIds) {
        let tpProductId = this.selectedProductIds[i]
        this.productRemoveFirstBannerDic[tpProductId] = true
      }
      this.updateProductEditStatus()
      this.updateRemoveFirstBanner()
    },
    /**
     * 批量去除详情图尾图
     */
    applyRemoveLastDescToSelection () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '复制商品', '点击', '点击批量去除详情图尾图'])
      }
      for (let i in this.selectedProductIds) {
        let tpProductId = this.selectedProductIds[i]
        this.productRemoveLastDescDic[tpProductId] = true
      }
      this.updateProductEditStatus()
      this.updateRemoveLastDesc()
    },
    updateRemoveLastDesc () {
      for (let i in this.productList) {
        let tpProductId = this.productList[i].tp_product_id
        if (tpProductId in this.products) {
          let product = this.products[tpProductId]
          let descLength = product.model.descPicUrlList.length
          if (this.productRemoveLastDescDic[tpProductId] && descLength > 0) {
            let lastImg = product.originModel.descPicUrlList[product.originModel.descPicUrlList.length - 1]
            let delIdx = -1
            while (descLength >= 0) {
              if (product.model.descPicUrlList[descLength - 1].url === lastImg.url) {
                delIdx = descLength - 1
                break // 可能会有相同 URL 图片
              }
              descLength -= 1
            }
            if (delIdx !== -1 && product.model.descPicUrlList.length > 1) {
              product.model.descPicUrlList.splice(delIdx, 1)
              if (this.product.model.tp_product_id === tpProductId) {
                this.descPicUrlList = [...product.model.descPicUrlList]
              }
            }
          }
        }
      }
    },
    // 批量应用属性
    applyPropertiesToSelection (checked, name, propertyValue) {
      const propertyBatchMap = this.propertyBatchMap || new Map()
      const propertyBatchCatIdMap = this.propertyBatchCatIdMap || new Map()
      const catId = this.product.model.cat_id
      const originAttrList = this.product.model.attrList
      const originAttr = originAttrList.find(attr => attr.name === name)
      for (let i in this.selectedProductIds) {
        let tpProductId = this.selectedProductIds[i]
        const propertyies = propertyBatchMap.get(tpProductId)
        propertyBatchMap.set(tpProductId, {
          ...propertyies,
          [name]: {
            checked,
            propertyValue,
            catId,
            originAttr // 记录初始的 attr数据
          }
        })
      }
      this.propertyBatchMap = cloneDeep(propertyBatchMap)
      console.log(this.propertyBatchMap, 'this.propertyBatchMap')
      // 批量应用到全部 的值
      const propertyBatchCatIdMapValue = propertyBatchCatIdMap.get(catId) || {}
      if (checked) {
        propertyBatchCatIdMapValue[originAttr.id] = {...originAttr, tp_value: propertyValue}
      } else {
        delete propertyBatchCatIdMapValue[originAttr.id]
      }

      console.log('9999912312312')
      propertyBatchCatIdMap.set(catId, propertyBatchCatIdMapValue)
      this.propertyBatchCatIdMap = cloneDeep(propertyBatchCatIdMap)
      this.updateProductEditStatus()
      this.forceUpdatePropertySet = ++this.forceUpdatePropertySet
    },
    updateRemoveFirstBanner () {
      for (let i in this.productList) {
        let tpProductId = this.productList[i].tp_product_id
        if (tpProductId in this.products) {
          let product = this.products[tpProductId]
          if (this.productRemoveFirstBannerDic[tpProductId] && product.originModel.bannerPicUrlList.length > 0) {
            let firstImg = product.originModel.bannerPicUrlList[0]
            let delIdx = -1
            for (let i in product.model.bannerPicUrlList) {
              if (product.model.bannerPicUrlList[i].url === firstImg.url) {
                delIdx = i
                break // 可能会有相同 URL 图片
              }
            }
            if (delIdx !== -1 && product.model.bannerPicUrlList.length > 1) {
              product.model.bannerPicUrlList.splice(delIdx, 1)
              if (this.product.model.tp_product_id === tpProductId) {
                this.bannerPicUrlList = [...product.model.bannerPicUrlList]
              }
            }
          }
        }
      }
    },
    onApplyTitleEditToSelection () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '复制商品', '点击', '点击批量修改标题'])
      }
      this.batchEditTitleVisible = true
    },
    updateTitleChange () {
      if (this.product.model.title !== this.productTitleDic[this.product.model.tp_product_id]) {
        Object.assign(this.product.model, {title: this.productTitleDic[this.product.model.tp_product_id]})
      }
    },
    applyTitleChangeToSelection (type) {
      for (let i in this.selectedProductIds) {
        let tpProductId = this.selectedProductIds[i]
        this.productTitleDic[tpProductId] = this.textHandler.handle(this.productTitleDic[tpProductId], type)
      }
      this.updateProductEditStatus()
      this.updateTitleChange()
      this.textHandler.reset()
      this.batchEditTitleVisible = false
      this.$message({
        message: '应用成功',
        type: 'success'
      })
    },
    onProductTitleChange (val) {
      if (this.product) {
        this.productTitleDic[this.product.model.tp_product_id] = val
      }
    },
    // 批量修改分类
    applySelectCateToAll () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '复制商品', '点击', '完成批量修改类别'])
      }
      this.productEditSavingPercent = 0
      this.isProductEditSaving = true
      this.applySelectCateToAllVisible = false
      let tpProductIdList = []
      for (let i in this.selectedProductIds) {
        if (this.selectedProductIds[i] !== this.product.model.tp_product_id) {
          tpProductIdList.push(this.selectedProductIds[i])
        }
      }
      this.saveProducts(this.product.model.cat_id, tpProductIdList)
    },
    requestApplySelectCateToAll (cid, tpProductIdList, tpProductIdListIdx, minPercent) {
      let tpProductIdListSlice = []

      if (tpProductIdListIdx < tpProductIdList.length) {
        tpProductIdListSlice = tpProductIdList.slice(tpProductIdListIdx, tpProductIdListIdx + 5)
      }
      let self = this
      this.request('batchUpdateCategory', {
        cid: cid,
        tp_product_ids: tpProductIdListSlice
      }, data => {
        // 更新商品列表信息
        self.changeProducts(data, true)

        // 更新已经保存的商品信息
        for (let i in tpProductIdListSlice) {
          let tpProductId = tpProductIdListSlice[i].tp_product_id
          if (tpProductId !== self.product.model.tp_product_id && self.products && tpProductId in self.products) {
            delete self.products[tpProductId]
          }
        }

        if (tpProductIdListIdx >= tpProductIdList.length) {
          // 批量保存完成
          self.productEditSavingPercent = 100
          self.products = {}
          self.updateAttrApplyCat({})
          self.setProduct(self.productDic[self.product.model.tp_product_id])
          this.isProductEditSaving = false
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        } else {
          // 批量保存没完成继续处理
          let cnt = Math.min(tpProductIdListIdx + 5, tpProductIdList.length)
          self.productEditSavingPercent = parseInt(minPercent + (100 - minPercent) * cnt / tpProductIdList.length)
          if (tpProductIdListIdx < tpProductIdList.length) {
            self.requestApplySelectCateToAll(cid, tpProductIdList, tpProductIdListIdx + 5, minPercent)
          }
        }
      }, data => {
        this.isProductEditSaving = false
        if (data.message.includes('无法获取锁')) {
          this.$message({
            message: '已有任务在运行',
            type: 'warning'
          })
        } else {
          this.$message({
            message: '保存失败',
            type: 'error'
          })
        }
      }, true)
    },
    onRevertSelection () {
      if (this.hasSelection) {
        this.$refs.productList.clearSelection()
        this.hasSelection = false
      } else {
        this.$refs.productList.toggleAllSelection()
        this.hasSelection = true
      }
    },
    handleSelectionChange (selection) {
      this.selectedProductIds = []
      for (let i in selection) {
        this.selectedProductIds.push(selection[i].tp_product_id)
      }
      if (this.selectedProductIds.length === 0) {
        this.hasSelection = false
      } else {
        this.hasSelection = true
      }
    },
    handleBeforeUpload (file) {
      let type = file.type
      let size = file.size / 1024 / 1024
      if (type !== 'image/jpeg' && type !== 'image/png') {
        this.$message.error('只能上传jpg/jpeg/png文件')
        return false
      }
      if (size > 8) {
        this.$message.error('上传文件超过8M')
        return false
      }
    },
    handleUploadSuccess (response, file, fileList, row) {
      if (parseInt(response.code) !== 0) {
        if (response.msg) {
          this.$message.error(response.msg)
        }
        return
      }
      row.img = response.data.url
    },
    handleUploadError (err, file, fileList) {
      this.$message.error(err.message)
    },
    handlemouseover (item) {
      this.$set(item, 'maskShow', true)
    },
    handlemouseleave (item) {
      this.$set(item, 'maskShow', false)
    },
    // 属性设置 回调
    handlePropertyset: function (attrList) {
      attrList.forEach(attr => {
        if (attr.name === '品牌') {
          Object.assign(this.product.model, {brand_id: attr.tp_value})
        }
      })
      Object.assign(this.product.model, {attrList})
    },
    // sku抓取
    toggleVisibleSkuImport: function () {
      this.visibleSkuImport = !this.visibleSkuImport
    },
    getBrandName (item) {
      if (item.brand_english_name.trim() && item.brand_chinese_name.trim()) {
        return `${item.brand_english_name.trim()}/${item.brand_chinese_name}`
      } else if (item.brand_english_name.trim() && !item.brand_chinese_name.trim()) {
        return item.brand_english_name.trim()
      } else {
        return item.brand_chinese_name.trim()
      }
    },
    getStyle (number, row, borderKey, key) {
      if (number > 1000000 || number <= 0) {
        this.$set(row, borderKey, true)
        this.stockEditError = true
      } else if (number <= 1000000 && number > 0) {
        const originSkuShowList = []
        this.originSkuShowList.forEach(item => {
          if (
            item.keys === row.keys &&
          row.specDetailIds.every(str => item.specDetailIds.includes(str)) &&
          row.specDetailIds.length === item.specDetailIds.length
          ) {
            item[key] = number
          }
          originSkuShowList.push(item)
        })
        this.originSkuShowList = cloneDeep(originSkuShowList)
        this.$set(row, borderKey, false)
        this.stockEditError = false
      }
    },
    getPriceStyle (number, row, borderKey, key) {
      if (number > 9999999.99 || number < 0.01) {
        this.$set(row, borderKey, true)
        this.priceEditError = true
      } else if (number <= 9999999.99 && number >= 0.01) {
        const originSkuShowList = []
        this.originSkuShowList.forEach(item => {
          if (
            item.keys === row.keys &&
          row.specDetailIds.every(str => item.specDetailIds.includes(str)) &&
          row.specDetailIds.length === item.specDetailIds.length
          ) {
            item[key] = number
          }
          originSkuShowList.push(item)
        })
        this.originSkuShowList = cloneDeep(originSkuShowList)
        this.$set(row, borderKey, false)
        this.priceEditError = false
      }
    },
    handlePictureQualificationChange (data) {
      Object.assign(this.product.model, {quality_list: data})
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      const end = this.specifications.length + 3
      if (this.isLoading) return false
      const arr = []
      this.specifications.map(item => {
        const skuLength = item.specificationValueList.filter(item => item.checked).length
        arr.push(skuLength || 1)
      })

      if (arr.length === 3) {
        const columnIndex0 = arr[1] * arr[2]
        const columnIndex1 = arr[2]
        if (columnIndex === 0) {
          if (rowIndex % columnIndex0 === 0) {
            return {
              rowspan: columnIndex0,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        } else if (columnIndex === 1) {
          if (rowIndex % columnIndex1 === 0) {
            return {
              rowspan: columnIndex1,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        } else if (columnIndex === end) {
          if (rowIndex % columnIndex0 === 0) {
            return {
              rowspan: columnIndex0,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }
      if (arr.length === 2) {
        const columnIndex0 = arr[1]
        if (columnIndex === 0) {
          if (rowIndex % columnIndex0 === 0) {
            return {
              rowspan: columnIndex0,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        } else if (columnIndex === end) {
          if (rowIndex % columnIndex0 === 0) {
            return {
              rowspan: columnIndex0,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }

      return {
        rowspan: 1,
        colspan: 1
      }
    }

  }
}
</script>
<style lang="less" scoped>
  /deep/ .el-tabs__content {
    height: 100%;
    overflow-y: auto;
  }
  /deep/ .el-table__body tr.current-row>td {
    background-color: rgb(179, 216, 255);
  }
  /deep/ .cell {
    overflow: unset;
    height: 100%;
    width: 100%;
    padding: 0 !important;
    line-height: 16px;
  }
  /deep/ .cell-tight {
    .cell {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  /deep/ .rowClass {

    td {
      padding: 0;
      height: 59px;
    }

  }
  .preview {
    position: relative;
    width: 50px;
    height: 50px;
    .mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity:0;
      font-size: 20px;
      background-color: rgba(0,0,0,.5);
      transition: opacity .3s;
      line-height: 40px;
    }
    .show {
      opacity: 1;
    }
  }

  .skuImportDialoag {
    width: 260px;
    height: 184px;
    background: #FFFFFF;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    margin:auto;
    margin-top:20px;
  }

  .skuText {
    font-size: 14px;
    height: 20px;
    margin-bottom: 4px;
    color: #55585c;
    font-family: -apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei','Helvetica Neue',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';
  }
  .index_count{
    color: #85878a;
  }

  /deep/ .my-textarea {
    height: 59px;
    textarea {
      resize: none !important;
      outline: none;
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      background: #fff;
      font-size: 14px;
      font-weight: 400;
      color: #19191a;
      line-height: 16px;
      padding: 10px;
      border: 1px solid transparent;
      overflow: auto;
      touch-action: manipulation;
      cursor: text;
      white-space: pre-wrap;
      overflow-wrap: break-word;
      column-count: initial !important;
      -webkit-rtl-ordering: logical;
      flex-direction: column;
      letter-spacing: normal;
      word-spacing: normal;
      text-transform: none;
      text-indent: 0px;
      text-shadow: none;
      display: inline-block;
      text-align: start;
      text-rendering: auto;
      border-radius: 0;
      transition: none;
      // border: 1px solid #1966ff;
    }
    textarea:active {
      border: 1px solid #1966ff;
    }
    textarea:hover {
      border: 1px solid #1966ff;
    }
    textarea:focus {
      border: 1px solid #1966ff;
    }

  }

  /deep/ .red {
    textarea:active {
      border: 1px solid red;
    }
    textarea:hover {
      border: 1px solid red;
    }
    textarea:focus {
      border: 1px solid red;
    }
    }

    /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
      background:none
    }
    /deep/ .el-table .el-table__header td{
      padding-left: 10px;
    }
    /deep/ .el-table .el-table__header th {
      padding-left: 10px;
    }

</style>

<style >
  .ProductEditNewView-popper-class {
      border:none !important;
      background-color: #fff;
      background-clip: padding-box;
      border-radius: 4px;
      box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
    }
</style>

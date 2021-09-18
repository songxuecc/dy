<template lang="html">
    <div>
        <el-table ref="productListTable" :data="tpProductList" row-key="tp_product_id" style="width: 100%" :class="tpProductList.length < 3 ? 'table-cal-2' : ''"
                  :row-style="{height:'68px'}"
                  @select-all="handleSelectAll" @select="handleSelect"
                  @selection-change="handleSelectionChange"  @cell-mouse-enter="handleMouseEnter" @cell-mouse-leave="handleMouseOut"
        >
        <el-table-empty slot="empty"/>
            <el-table-column type="selection" :selectable="isSelectionEnable">
            </el-table-column>
            <el-table-column label="图片" width="78" align="center">
                <template slot-scope="scope">

                    <el-image
                      style="height:50px;max-width:50px"
                      :src="scope.row.thumbnail"
                      fit="contain"
                      :preview-src-list="[scope.row.thumbnail]"
                      lazy>
                      <div slot="placeholder">
                        <hh-icon  type="iconwuzhaopian" style="font-size:50px" />
                      </div>
                      <div slot="error" class="flex align-c" style="height:100%">
                        <hh-icon  type="icontupianjiazaishibai03" style="font-size:30px" />
                      </div>
                    </el-image>
                    <!-- <img v-if="scope.row.thumbnail" style="height:50px;max-width:50px" class="border-2"  :src="scope.row.thumbnail"> -->
                </template>
            </el-table-column>
            <el-table-column label="基本信息"  width="330">
                <template slot-scope="scope">
                    <el-link  :href="scope.row.url" target="_blank" :underline="false"  class="font-13">
                        {{ scope.row.title }}
                    </el-link><br>
                    <div>
                      <div class="flex align-c " style="height:28px">
                          <span class="mr-5">类目:
                            <span v-if="scope.row.category_show" class="info">{{getCategoryShow(scope.row.category_show)}}</span>
                            <span v-if="!scope.row.category_show" class="info">无</span>
                          </span>
                          <hh-icon type="iconbianji-primary" class="pointer" style="font-size:12px;margin-top:4px" v-if="default_category && !default_category.name" @click="chooseCategory(scope.row)"/>
                      </div>
                      <div class="font-12 flex align-c" v-if="scope.row.origin_category_name">
                        <span class="flex align-c" style="flex:1">
                          <span style="flex-shrink: 0;" >来源类目: </span>
                          <el-tooltip :content="scope.row.origin_category_name"  placement="top" v-if="scope.row.origin_category_name">
                            <span class="info ellipsis " style="max-width:235px">{{scope.row.origin_category_name}}</span>
                          </el-tooltip>
                          <div v-else class="info">无</div>
                        </span>
                        <div style="flex-shrink: 0;" ><span class="primary pointer" @click="handleMatchCategory(scope.row)" v-if="scope.row.origin_category_name">类目设置</span></div>
                      </div>

                    </div>
                    <div class="flex align-c wrap">
                      <span class="flex align-c" style="margin-right:27px">
                        <img style="width: 14px; height: 14px;margin-right:2px;" :src="getIcon(scope.row)">
                        <label class="info">{{scope.row.source}}</label>
                      </span>
                      <span class="info" v-if="scope.row.tp_outer_iid">商家编码: {{scope.row.tp_outer_iid}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="源sku售价" width="100" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.price_range}}</span>
                </template>
            </el-table-column>
            <el-table-column v-if="isSyncSource" label="最近同步" width="100">
                <template slot-scope="scope">
                    {{ getSyncStatus(scope.row) }}
                    <i v-if="scope.row.sync_source_status.status == taskResultStatus['running'] ||
                        scope.row.sync_source_status.status == taskResultStatus['ready']"
                       class="el-icon-loading"
                    ></i>
                    <el-tooltip manua="true" v-if="scope.row.sync_source_status.status == taskResultStatus['fail']"
                                class="item" effect="dark" placement="top" :content="scope.row.sync_source_status.msg"
                    >
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </template>
            </el-table-column>
             <el-table-column v-if="!isSyncSource" label="状态" width="130" style="overflow:auto"  align="center" class-name="cell-class">
                <template slot-scope="scope">
                    <el-link :underline="false" style="text-decoration:none;" type="info" size="mini" round v-if="[0,1].includes(scope.row.capture_status)">复制中</el-link>
                    <el-link :underline="false" style="text-decoration:none;"  :type="getStatusType(scope.row.status)" size="mini" round v-else-if="scope.row.status!==2" :disabled="scope.row.status === 9">
                      {{ productStatusMap[scope.row.status] }}
                      <i v-if="scope.row.isMigrating && scope.row.status!==2" class="el-icon-loading"></i>
                    </el-link>
                    <el-link v-else :underline="false"  style="text-decoration:none;;display:block" type="warning">
                      {{ productStatusMap[scope.row.status] }}
                      <el-progress  :text-inside="true" :stroke-width="14" :percentage="scope.row.migrate_process" status="success"></el-progress>
                    </el-link>
                    <!-- 驳回失败 -->
                    <span class="tutorials" v-if="[5,8].includes(scope.row.status)">根据原因再试一次</span>
                    <!-- 待修改 -->
                    <span class="tutorials" v-if="[6].includes(scope.row.status)">根据原因进行修改</span>
                    <NewComer type="失败" ref="newComerFail" :direction="[0,1].includes(scope.row.index) ? 'bottom' : 'top'" v-if="getFirstShow(5,scope.row.index,scope.row.status)">
                      <div>
                        <div style="width:172px" class="color-666 font-12 left">
                          搬家操作<span class="fail"> 失败</span>，请查看【失败理由】，并在对应页面进行修改后再次搬家上架～
                        </div>
                        <div @click="closeNewComerFail($event,'newComerFail')" class="right pointer underline primary">好的</div>
                      </div>
                    </NewComer>

                </template>
            </el-table-column>
             <el-table-column v-if="!isSyncSource" label="原因" align="center">
                <template slot-scope="scope">
                    <div style="text-decoration:none;"  class="font-13">
                      <span manual :value="scope.row.index === mouseOverIndex"  v-if="[productStatus.FAILED, productStatus.WAIT_MODIFY, productStatus.REJECT].includes(scope.row.status)" :disabled="![productStatus.FAILED, productStatus.WAIT_MODIFY, productStatus.REJECT].includes(scope.row.status)" class="item" effect="dark" placement="top">
<!--                        <div slot="content"  v-if="scope.row.migration_msg[0].indexOf('发生未知错误') > -1 && scope.row.status === 5"  >-->
<!--                            <ul style="padding: 0; margin: 0; margin-top: 6px;" :key="0">-->
<!--                              <hh-icon type="iconjinggao1"></hh-icon>-->
<!--                               搬家失败可能是接口不稳定导致。建议15分钟后重新进行搬家，若再次失败请联系客服解决</ul>-->
<!--                        </div>-->
                        <div slot="content"  v-if="scope.row.migration_msg && scope.row.migration_msg[0] && scope.row.migration_msg[0].indexOf('商品创建失败31,承诺发货时间不在合理范围内') > -1 && scope.row.status === 5"  >
                            <ul style="padding: 0; margin: 0; margin-top: 6px;" :key="0">
                              <p style="">
                                <hh-icon type="iconjinggao1"></hh-icon>
                                当前选择的发货模式或承诺发货时间不符合官方规定，请根据官方规则进行调整。</p>
                              <p><a style="color: #409EFF;" target="view_window" href="https://school.jinritemai.com/doudian/web/article/101706">点击查询规则</a ></p>
                            </ul>
                        </div>
                        <div slot="content"  v-else-if="scope.row.migration_msg && scope.row.migration_msg[0] && scope.row.migration_msg[0].indexOf('商品创建失败31,请重新选择品牌') > -1 && scope.row.status === 5"  >
                            <ul style="padding: 0; margin: 0; margin-top: 6px;" :key="0">
                              <p style="">
                                <hh-icon type="iconjinggao1"></hh-icon>
                                根据官方规定，该类目需要填写品牌，请上传品牌</p>
                              <p><a  style="color: #409EFF;" target="view_window" href="https://school.jinritemai.com/doudian/web/article/101810">点击查询哪些类目需填品牌</a ></p>
                            </ul>
                        </div>
                        <div slot="content"  v-else-if="scope.row.migration_msg && scope.row.migration_msg[0] && scope.row.migration_msg[0].indexOf('商品创建失败31,品牌不属于该类目') > -1 && scope.row.status === 5"  >
                            <ul style="padding: 0; margin: 0; margin-top: 6px;" :key="0">
                              <p style="">
                                <hh-icon type="iconjinggao1"></hh-icon>
                                商品所选品牌没有授权所选类目，建议根据品牌授权情况更换类目后再次搬家</p>
                              <p><a style="color: #409EFF;" target="view_window" href="https://fxg.jinritemai.com/index.html#/ffa/mshop/qualification/list">点击查询品牌授权情况</a></p>
                            </ul>
                        </div>
                        <div slot="content"  v-else-if="scope.row.migration_msg && scope.row.migration_msg[0] && scope.row.migration_msg[0].indexOf('品牌为必填属性且上传的品牌该店铺未授权') > -1 && scope.row.status === 5"  >
                            <ul style="padding: 0; margin: 0; margin-top: 6px;" :key="0">
                              <hh-icon type="iconjinggao1"></hh-icon>
                              虎虎建议点击“修改”按钮，刷新品牌后重新选择品牌，进行再次搬家
                            </ul>
                        </div>
                        <div slot="content"  v-else-if="scope.row.migration_msg && scope.row.migration_msg[0] && scope.row.migration_msg[0].indexOf('商品创建失败31,该类目下无品牌') > -1 && scope.row.status === 5"  >
                            <ul style="padding: 0; margin: 0; margin-top: 6px;" :key="0">
                              <p style="">
                                <hh-icon type="iconjinggao1"></hh-icon>
                                商品所选品牌没有授权所选类目，建议根据品牌授权情况更换类目后再次搬家</p>
                              <p><a style="color: #409EFF;" target="view_window" href="https://fxg.jinritemai.com/index.html#/ffa/mshop/qualification/list">点击查询品牌授权情况</a></p>
                            </ul>
                        </div>
                        <div slot="content"  v-else-if="scope.row.migration_msg && scope.row.migration_msg[0] && scope.row.migration_msg[0].match('规格值不能重复') && scope.row.status === 5"  >
                            <ul style="padding: 0; margin: 0; margin-top: 6px;" :key="0"  class="font-13">
                              <hh-icon type="iconjinggao1"></hh-icon>
                              {{getSkuDuplicateFormatText(scope.row.migration_msg && scope.row.migration_msg[0] && scope.row.migration_msg[0])}}
                            </ul>
                        </div>
                        <div slot="content"  v-else-if="scope.row.migration_msg && scope.row.migration_msg[0] && scope.row.migration_msg[0].indexOf('商品创建失败30-2, transImgToLocal failed 图片转链失败') > -1 && scope.row.status === 5"  >
                            <ul style="padding: 0; margin: 0; margin-top: 6px;" :key="0" class="font-13">
                              <hh-icon type="iconjinggao1"></hh-icon>
                              抖音官方下载图片失败，请稍后重新尝试搬家
                            </ul>
                        </div>
                        <div slot="content"  v-else-if="scope.row.migration_msg && scope.row.migration_msg[0] && scope.row.migration_msg[0].indexOf('商品创建失败31,非叶子节点不允许，创建或编辑商品') > -1 && scope.row.status === 5"  >
                            <ul style="padding: 0; margin: 0; margin-top: 6px;" :key="0" class="font-13">
                              <hh-icon type="iconjinggao1"></hh-icon>
                              请刷新分类后重新搬家
                            </ul>
                        </div>
                        <div slot="content"  v-else-if="scope.row.migration_msg && scope.row.migration_msg[0] && scope.row.migration_msg[0].indexOf('商品创建失败31,规格图片和规格值数量不匹配') > -1 && scope.row.status === 5"  >
                            <ul style="padding: 0; margin: 0; margin-top: 6px;" :key="0" class="font-13">
                              <hh-icon type="iconjinggao1"></hh-icon>
                              规格图片和规格值数量不匹配,虎虎建议重新尝试搬家
                            </ul>
                        </div>
                        <div slot="content"  v-else-if="scope.row.migration_msg && scope.row.migration_msg[0] && scope.row.migration_msg[0].indexOf('商品创建失败31,上传主图有缺失，请重新上传') > -1 && scope.row.status === 5"  >
                            <ul style="padding: 0; margin: 0; margin-top: 6px;" :key="0" class="font-13">
                              <hh-icon type="iconjinggao1"></hh-icon>
                              上传主图有缺失，请重新上传,虎虎建议重新尝试搬家
                            </ul>
                        </div>
                        <div slot="content"  v-else-if="scope.row.migration_msg && scope.row.migration_msg[0] && scope.row.migration_msg[0].indexOf('商品创建失败31,上传产品详情有缺失，请重新上传') > -1 && scope.row.status === 5"  >
                            <ul style="padding: 0; margin: 0; margin-top: 6px;" :key="0" class="font-13">
                              <hh-icon type="iconjinggao1"></hh-icon>
                              上传产品详情有缺失，请重新上传,虎虎建议重新尝试搬家
                            </ul>
                        </div>
                        <div slot="content"  v-else-if="scope.row.migration_msg && scope.row.migration_msg[0] && scope.row.migration_msg[0].indexOf('brand_id格式错误') > -1 && scope.row.status === 5"  >
                            <ul style="padding: 0; margin: 0; margin-top: 6px;" :key="0"  class="font-13">
                              <hh-icon type="iconjinggao1"></hh-icon>
                              请刷新品牌后重新搬家
                            </ul>
                        </div>
                        <div slot="content"  v-else-if="scope.row.migration_msg && scope.row.migration_msg[0] && scope.row.migration_msg[0].indexOf('店铺未授权该类目') > -1 && scope.row.status === 5"  >
                            <ul style="padding: 0; margin: 0; margin-top: 6px;" :key="0"  class="font-13">
                              <hh-icon type="iconjinggao1"></hh-icon>
                              若店铺未授权当前类目，请先去抖店后台检查。若已开通，则重新刷新类目后再搬家
                            </ul>
                        </div>
                        <div slot="content"  v-else-if="scope.row.migration_msg && scope.row.migration_msg[0] && scope.row.migration_msg[0].indexOf('商品创建失败31,设置商品库存，现货库存数必须大于阶梯库存数') > -1 && scope.row.status === 5"  >
                            <ul style="padding: 0; margin: 0; margin-top: 6px;" :key="0"  class="font-13">
                              <hh-icon type="iconjinggao1"></hh-icon>
                              现货库存必须大于阶梯库存数
                            </ul>
                        </div>
                        <div slot="content"  v-else-if="scope.row.migration_msg && scope.row.migration_msg[0] && scope.row.migration_msg[0].indexOf('商品创建失败31,发货模式暂不支持阶梯发货') > -1 && scope.row.status === 5"  >
                            <ul style="padding: 0; margin: 0; margin-top: 6px;" :key="0"  class="font-13">
                              <hh-icon type="iconjinggao1"></hh-icon>
                              <p>发货模式暂不支持阶梯发货</p>
                              <p><a style="color: #409EFF;" target="view_window" href="https://school.jinritemai.com/doudian/web/article/113081">点击查询阶梯发货规则</a></p>
                            </ul>
                        </div>
                        <div slot="content"  v-else-if="scope.row.migration_msg && scope.row.migration_msg[0] && scope.row.migration_msg[0].indexOf('商品创建失败31,商品标题未明确描述商品品名') > -1 && scope.row.status === 5"  >
                            <ul style="padding: 0; margin: 0; margin-top: 6px;" :key="0"  class="font-13">
                              <hh-icon type="iconjinggao1"></hh-icon>
                              <p>商品标题不符合抖音填写规范，请按照商品标题填写规范进行修改</p>
                              <p><a style="color: #409EFF;" target="view_window" href="https://school.jinritemai.com/doudian/web/article/101800?from=shop_article">商品标题填写规范</a></p>
                            </ul>
                        </div>
                        <div slot="content"  v-else-if="scope.row.migration_msg && scope.row.migration_msg[0] && scope.row.migration_msg[0].indexOf('现货库存数必须大于阶梯库存数') > -1 && scope.row.status === 5"  >
                            <ul style="padding: 0; margin: 0; margin-top: 6px;" :key="0"  class="font-13">
                              <hh-icon type="iconjinggao1"></hh-icon>
                              <p>官方规定现货库存需大于阶梯库存。由于该商品总库存为0，无法满足该要求。请修改商品库存或者调整发货方式。</p>
                            </ul>
                        </div>
                        <div slot="content"  v-else>
                            <hh-icon type="iconjinggao1"></hh-icon>
                            <span style="padding: 0; margin: 0; margin-top: 6px;" v-for="(v,i) in scope.row.migration_msg" :key="i">
                              <span v-html="v"  class="font-13">{{v}}</span> <br/>
                            </span>
                        </div>
                      </span>
                      <span style="max-width: 50px;" manual :value="scope.row.index === mouseOverIndex" v-else-if="scope.row.status === 7" :disabled="scope.row.status !== 7" class="item" effect="dark" placement="top">
                          <div slot="content">
                            <hh-icon type="iconjinggao1"></hh-icon>
                            <span v-if="scope.row.migration_msg.length !== 0" style="padding: 0; margin: 0;" v-for="(v,i) in scope.row.migration_msg" :key="i" class="font-13">{{v}}</span>
                            <span v-if="scope.row.migration_msg.length === 1 && scope.row.migration_msg[0].length===0" style="padding: 0; margin: 0;" class="font-13">如需帮助请 <a href="/service" style="color: #409EFF;">联系客服</a>。</span>
                          </div>
                      </span>

                      <span v-if="[0,1,2,3,4,9].includes(Number(scope.row.status))" class="font-13">无</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="" :width="140" align="center">
               <template slot="header" slot-scope="scope">
                   <el-dropdown trigger="click" @command="handleCommandSort">
                      <span class="font-12">
                        {{commandSortText}}<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="a" class="font-12">按复制时间降序</el-dropdown-item>
                        <el-dropdown-item command="b" class="font-12">按复制时间升序</el-dropdown-item>
                        <el-dropdown-item command="c" class="font-12">按搬家时间降序</el-dropdown-item>
                        <el-dropdown-item command="d" class="font-12" >按搬家时间升序</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                </template>
              <template slot-scope="scope">
                {{['按复制时间降序','按复制时间升序'].includes(commandSortText) ? scope.row.create_time:(scope.row.migrate_time || '无')}}
              </template>
            </el-table-column>

            <el-table-column prop="" label="操作" :width="isSyncSource ? 90 : 90" align="center" v-if="hasShowOperate ? showOperate : true" class-name="cell-class">
                <template slot-scope="scope">
                    <div v-if="[0,1].includes(scope.row.capture_status)" class="font-13"></div>
                    <div v-else-if="isSyncSource"  class="font-13" style="line-height:20px">
                        <el-dropdown split-button type="primary" trigger="click" v-if="scope.row.sync_setting" size="small" @click="btnSyncClick(scope.row)" @command="handleCommand">
                          立即同步
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :command="beforeHandleCommand('btnSettingClick', scope.row)" size="small">查看设置</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                        <el-button type="primary" v-if="!scope.row.sync_setting" size="small" @click="btnSettingClick(scope.row)"> 设置同步 </el-button>
                    </div>
                    <el-link  class="font-13" v-else v-for="(item,index) in getButtonNames(scope.row)" :key="index" @click="item.handle" :underline="false" type="primary" style="display:block;margin-right:4px;line-height:20px">{{item.text}}
                      <NewComer type="待修改" ref="newComerEdit"   :direction="[0,1].includes(scope.row.index) ? 'bottom' : 'top'"  :left="25" v-if="getFirstShow(6,scope.row.index,scope.row.status) && item.text== '修改'">
                        <div>
                          <div style="width:172px" class="color-666 font-12 left">
                            请点击【修改】按钮，按照【修改理由】进行修改。
                            修改正确后商品状态会变成 <span class="warning">待上线</span>，接着您可进行下一步操作～
                          </div>
                          <div @click="closeNewComer($event,'newComerEdit')" class="right pointer underline primary">好的</div>
                        </div>
                      </NewComer>
                      <NewComer type="驳回" ref="newComerExit"   :direction="[0,1].includes(scope.row.index) ? 'bottom' : 'top'"   :left="45" v-if="getFirstShow(8,scope.row.index,scope.row.status) && item.text== '后台'">
                        <div>
                          <div style="width:172px" class="color-666 font-12 left">
                            这是抖音官方返回的<span class="fail">驳回</span>信息，请点击【后台】按钮跳转到抖音商家后台，按照官方指示进行修改后再上传。
                          </div>
                          <div @click="closeNewComer($event,'newComerExit')" class="right pointer underline primary">好的</div>
                        </div>
                      </NewComer>
                    </el-link>
                </template>
            </el-table-column>
        </el-table>

<!--        <el-dialog title="商品编辑" class="product-dialog" :visible.sync="dialogEditVisible" @opened="dialogOpened" @close="dialogClose" :before-close="dialogBeforeClose">-->
<!--            <product-edit-view ref="productEditView" @changeProduct="onChangeProduct" @closeDialog="closeDialog"></product-edit-view>-->
<!--        </el-dialog>-->
        <el-drawer
          title="商品编辑"
          :visible.sync="dialogEditVisible"
          :with-header="false"
          size="85%"
          @opened="dialogOpened"
          @close="dialogClose"
          :before-close="dialogBeforeClose"
        >
          <product-edit-new-view ref="productEditNewView" @changeProducts="onChangeProducts" @triggerDialogClose="triggerDialogClose"></product-edit-new-view>
        </el-drawer>
        <div class="closeBtn pointer" v-show="dialogEditVisible" @click="triggerDialogClose">
          <hh-icon type="iconguanbi1" class="iconguanbi"></hh-icon>
        </div>
        <el-dialog
          title="删除复制记录"
          :show-close="false"
          :visible.sync="deleteProductVisible"
          width="30%">
          <p>只删除软件的记录，对小店后台商品没影响，删除后已复制的商品可进行再次复制搬家，您确定要操作吗？</p>
          <span slot="footer" class="dialog-footer">
            <el-button type="plain" @click="deleteProductVisible=false">取消</el-button>
            <el-button type="primary" @click="confirmDeleteProduct">确定</el-button>
          </span>
        </el-dialog>
        <el-dialog class="dialog-tight" title="选择复制后的类目" width="800px" center :visible.sync="visvileCategory" v-hh-modal>
          <categorySelectView ref="categorySelectView" @changeCate="onChangeCate"  v-loading="changeCategoryLoading"/>
        </el-dialog>
        <ModalSourceCategory  ref="ModalSourceCategory" @onChange="onChangeModalSourceCategory"/>
    </div>
</template>
<script>

import common from '@/common/common.js'
import utils from '@/common/utils.js'
import request from '@/mixins/request.js'
import CategorySelectView from '@/components/CategorySelectView'
import ModalSourceCategory from './ModalSourceCategory'
import Api from '@/api/apis'
import isEmpty from 'lodash/isEmpty'

export default {
  inject: ['reload'],
  mixins: [request],
  components: {
    productEditNewView: () => import('@/components/ProductEditNewView'),
    CategorySelectView,
    ModalSourceCategory
  },
  props: {
    tpProductList: Array,
    isSyncSource: {
      type: Boolean,
      default: false
    },
    showOperate: Boolean,
    hasShowOperate: Boolean
  },
  data () {
    return {
      sourceCategoryVisible: false,
      deleteProductId: -1,
      deleteProductVisible: false,
      dialogEditVisible: false,
      curTPProduct: {},
      dicSelectId: {},
      validProductIdsList: [],
      isCheckboxSelect: false,
      isSelectAll: false,
      mouseOverIndex: -1,
      commandSortText: '按复制时间降序',
      order_by: 1,
      visvileCategory: false,
      default_category: {},
      default_category_id: undefined,
      sourceCategory: {},
      changeCategoryLoading: false
    }
  },
  computed: {
    productStatus () {
      return common.productStatus
    },
    productStatusMap () {
      return common.productStatusMap
    },
    taskResultStatus () {
      return common.taskResultStatus
    },
    isSelectIndeterminate () {
      let selectCnt = 0
      for (let id in this.dicSelectId) {
        if (this.dicSelectId[id]) {
          selectCnt++
        }
      }
      return selectCnt !== this.validProductIdsList.length && selectCnt !== 0
    },
    showTooltip (idx) {
      return idx === this.mouseOverIndex
    }
  },
  watch: {
    tpProductList: {
      handler: function (arrNew, arrOld) {
        this.$nextTick(function () {
          for (let i in arrNew) {
            let product = arrNew[i]
            if (this.dicSelectId[product.tp_product_id]) {
              this.$refs.productListTable.toggleRowSelection(product, true)
            } else {
              this.$refs.productListTable.toggleRowSelection(product, false)
            }
          }
        })
      },
      deep: true
    }
  },
  methods: {
    getshow () {
      if (!this.nubk) {
        this.nubk = true
        return true
      }
    },
    getSkuDuplicateFormatText (msg) {
      msg = msg.replace('添加规格失败err=', '')
      msg = msg.replace('对应的规格值不能重复，请核对', '')
      return msg + '对应的sku名称重复，建议删除重复规格'
    },
    getLastCategory (category) {
      return utils.getLastCategory(category)
    },
    getStatusType (status) {
      if (status === 5 || status === 7 || status === 8) {
        return 'danger'
      } else if (status === 6) {
        return 'warning'
      } else if (status === 3 || status === 4) {
        return 'success'
      } else if (status === 10) {
        return 'info'
      }
    },
    beforeHandleCommand (command, product) {
      return {
        'command': command,
        'product': product
      }
    },
    handleCommand (command) {
      if (command.command === 'deleteProduct') {
        this.deleteProductVisible = true
        this.deleteProductId = command.product.tp_product_id
      } else if (command.command === 'btnSettingClick') {
        this.$emit('btnSettingClick', command.product)
      }
    },
    productDelete (product) {
      this.deleteProductVisible = true
      this.deleteProductId = product.tp_product_id
    },
    confirmDeleteProduct () {
      if (this.deleteProductId !== -1) {
        this.request('deleteTPProduct', { tp_product_ids: [this.deleteProductId] }, data => {
          // this.reload()
          // 删除操作不刷新页面
          let idx = this.tpProductList.findIndex(item => item.tp_product_id === this.deleteProductId)
          if (idx !== -1) {
            this.tpProductList.splice(idx, 1)
          }
        })
      }
      this.deleteProductVisible = false
    },
    getIcon (product) {
      if (product.source === '淘宝') {
        return require('@/assets/images/taobao.png')
      } else if (product.source === '天猫') {
        return require('@/assets/images/tm.png')
      } else if (product.source === '1688') {
        return require('@/assets/images/1688.png')
      } else if (product.source === '京东') {
        return require('@/assets/images/jd.png')
      } else if (product.source === '苏宁') {
        return require('@/assets/images/sn.png')
      } else if (product.source === '网易考拉') {
        return require('@/assets/images/kaola.png')
      } else if (product.source === '唯品会') {
        return require('@/assets/images/vph.png')
      } else if (product.source === '一起做网店17zwd') {
        return require('@/assets/images/17.png')
      } else if (product.source === '抖音') {
        return require('@/assets/images/dy.png')
      } else if (product.source === '拼多多') {
        return require('@/assets/images/pdd.png')
      } else if (product.source === '蝉妈妈') {
        return require('@/assets/images/chanmama.png')
      } else if (product.source === 'vvic搜款网') {
        return require('@/assets/images/soukuanwang.png')
      } else if (product.source === '有赞') {
        return require('@/assets/images/youzan.png')
      }
      return ''
    },
    getButtonName (product) {
      if (product.status === 8) {
        return '处理'
      } else if (product.status === 9) {
        return '查看'
      } else if (product.status === 7) {
        return '重试'
      } else if (product.status === 0 || product.status === 10) {
        return '编辑'
      } else if (product.status === 3 || product.status === 4) {
        return '删除'
      } else {
        return '修改'
      }
    },
    //  待上线 0
    //  等待搬迁
    //  搬迁中

    getButtonNames (product) {
      const refs = this.$refs
      const edit = {
        handle: () => {
          if (refs.newComerEdit && refs.newComerEdit[0]) {
            refs.newComerEdit[0].close && refs.newComerEdit[0].close()
          }
          this.productEditOpen(product)
        },
        text: '修改'
      }
      const houtai = {
        handle: () => {
          if (refs.newComerExit && refs.newComerExit[0]) {
            refs.newComerExit[0].close && refs.newComerExit[0].close()
          }
          this.productHoutai(product)
        },
        text: '后台'
      }
      const tryAgian = {
        handle: () => this.productEdit(product),
        text: '重试'
      }
      const deleteItem = {
        handle: () => this.productDelete(product),
        text: '删除'
      }
      const productStatusMap = {
        [common.productStatus.WAIT_ONLINE]: [edit, deleteItem],
        [common.productStatus.WAIT_MIGRATE]: [deleteItem],
        [common.productStatus.MIGRATING]: [deleteItem],
        [common.productStatus.SAVE_DRAFT]: [edit, houtai, deleteItem],
        [common.productStatus.ONLINE]: [edit, houtai, deleteItem],
        [common.productStatus.FAILED]: [edit, deleteItem],
        [common.productStatus.WAIT_MODIFY]: [edit, deleteItem],
        [common.productStatus.CAPTURE_FAILED]: [tryAgian, deleteItem],
        [common.productStatus.REJECT]: [edit, houtai, deleteItem],
        [common.productStatus.DY_APPROVING]: [deleteItem]
      }
      return productStatusMap[product.status]
    },

    getSyncStatus (product) {
      if (parseInt(product.sync_source_status.status) === common.taskResultStatus['success']) {
        return product.sync_source_status.complete_time
      } else if (parseInt(product.sync_source_status.status) === common.taskResultStatus['fail']) {
        return '同步任务失败'
      } else if (parseInt(product.sync_source_status.status) === common.taskResultStatus['ready']) {
        return '同步任务准备中'
      } else if (parseInt(product.sync_source_status.status) === common.taskResultStatus['running']) {
        return '同步任务进行中'
      }
      return ''
    },
    productEdit (product, isStatus = false, needJump = true) {
      if ([this.productStatus.CAPTURE_FAILED, this.productStatus.DELETED].includes(product.status) && isStatus) {
        return true
      } else if ([this.productStatus.REJECT, this.productStatus.DY_APPROVING].includes(product.status)) {
        if (product.status === this.productStatus.REJECT && !isStatus) {
          this.curTPProduct = product
          this.dialogEditVisible = true
          if (window._hmt) {
            window._hmt.push(['_trackEvent', '复制商品', '点击', '编辑复制商品'])
          }
        } else {
          if (window._hmt) {
            window._hmt.push(['_trackEvent', '复制商品', '点击', '前往抖音后台查看提交的商品'])
          }
          if (product.goods_commit_id) {
            window.open('https://fxg.jinritemai.com/index.html#/ffa/goods/create?product_id=' + product.goods_commit_id)
          }
        }
      } else if (product.status === this.productStatus.CAPTURE_FAILED) {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '复制商品', '点击', '重新复制新商品'])
        }
        let self = this
        this.request('capture', { urls: [product.url], capture_type: 0, tp_product_id: product.tp_product_id }, data => {
          let params = {}
          if (data.parent_id !== 0 && data.page_id !== 0) {
            params['captureId'] = data.parent_id
            params['pageId'] = data.page_id
          } else {
            params['captureId'] = data.capture_id
          }
          self.$router.push({
            path: '/migrate/productList',
            query: params
          })
          self.reload()
        })
      } else if ([3, 4, 8].includes(product.status)) {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '复制商品', '点击', '删除复制商品'])
        }
        if (needJump === true) {
          window.open('https://fxg.jinritemai.com/index.html#/ffa/g/create?product_id=' + product.goods_commit_id)
        } else if ([this.productStatus.ONLINE, this.productStatus.SAVE_DRAFT].includes(product.status)) {
          this.deleteProductVisible = true
          this.deleteProductId = product.tp_product_id
        }
      } else {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '复制商品', '点击', '编辑复制商品'])
        }
        this.curTPProduct = product
        this.dialogEditVisible = true
      }
    },

    productEditOpen (product) {
      this.curTPProduct = product
      this.dialogEditVisible = true
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '复制商品', '点击', '编辑复制商品'])
      }
    },
    productHoutai (product) {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '复制商品', '点击', '前往抖音后台查看提交的商品'])
      }
      if (product.goods_commit_id) {
        window.open('https://fxg.jinritemai.com/index.html#/ffa/goods/create?product_id=' + product.goods_commit_id)
      }
    },
    productTryAgian (product) {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '复制商品', '点击', '重新复制新商品'])
      }
      let self = this
      this.request('capture', { urls: [product.url], capture_type: 0, tp_product_id: product.tp_product_id }, data => {
        let params = {}
        if (data.parent_id !== 0 && data.page_id !== 0) {
          params['captureId'] = data.parent_id
          params['pageId'] = data.page_id
        } else {
          params['captureId'] = data.capture_id
        }
        self.$router.push({
          path: '/migrate/productList',
          query: params
        })
        self.reload()
      })
    },
    isSelectionEnable (row) {
      if (this.isSyncSource) {
        return true
      }
      // if (parseInt(row.status) === 0) {
      //   return true
      // }
      // if (parseInt(row.check) === 0 && (parseInt(row.status) === 5 || parseInt(row.status) === 10)) {
      //   return true
      // }
      return true
    },
    isModifyEnable (row) {
      // 兼容之前数据
      // if (row.status === 8 && !row.goods_commit_id) {
      //   return false
      // }
      if (row.status === 9) {
        return false
      }
      if ([1, 2].includes(parseInt(row.status))) {
        return false
      }
      return true
    },
    handleSelectionChange (selection) {
      this.$nextTick(function () {
        this.$emit('selectChange')
      })
    },
    handleSelect (selection, row) {
      let isSelect = false
      for (let i in selection) {
        if (selection[i].tp_product_id === row.tp_product_id) {
          isSelect = true
          break
        }
      }
      if (isSelect) {
        this.$set(this.dicSelectId, row.tp_product_id, 1)
      } else {
        this.$set(this.dicSelectId, row.tp_product_id, 0)
      }
    },
    handleSelectAll (selection) {
      if (selection.length === 0) {
        for (let i in this.tpProductList) {
          let id = this.tpProductList[i].tp_product_id
          this.$set(this.dicSelectId, id, 0)
        }
      } else {
        for (let i in selection) {
          let id = selection[i].tp_product_id
          this.$set(this.dicSelectId, id, 1)
        }
      }
    },
    toggleSelectAll (isSelect) {
      this.isSelectAll = !this.isSelectAll
      if (this.isSelectIndeterminate) {
        this.isSelectAll = true
//        this.isCheckboxSelect = true
      }
      if (this.isCheckboxSelect !== this.isSelectAll) {
        this.isCheckboxSelect = this.isSelectAll
      }
      for (let id in this.dicSelectId) {
        this.$set(this.dicSelectId, id, 0)
      }
      this.$refs.productListTable.clearSelection()
      if (this.isSelectAll) {
        for (let i in this.validProductIdsList) {
          let id = this.validProductIdsList[i]
          this.$set(this.dicSelectId, id, 1)
        }
        if (this.tpProductList.length > 0) { // 以免和 watch 中 tpProductList 冲突
          this.$refs.productListTable.toggleAllSelection()
        }
      }
    },
    clearSelect () {
      this.dicSelectId = {}
    },
    selectAll () {
      this.$nextTick(function () {
        this.isCheckboxSelect = true
        this.isSelectAll = true
        let dicProduct = {}
        for (let i in this.tpProductList) {
          let product = this.tpProductList[i]
          dicProduct[product.tp_product_id] = product
        }
        // 选中新商品，保持旧商品状态
        let dicValidProductId = {}
        for (let i in this.validProductIdsList) {
          let id = this.validProductIdsList[i]
          dicValidProductId[id] = 1
          if (!(id in this.dicSelectId)) {
            this.$set(this.dicSelectId, id, 1)
            if (id in dicProduct) {
              this.$refs.productListTable.toggleRowSelection(dicProduct[id], true)
            }
          }
        }
        // 处理本来在 validProductIdsList 中，后来不在的情况
        for (let id in this.dicSelectId) {
          if (this.dicSelectId[id] && !(id in dicValidProductId)) {
            this.$set(this.dicSelectId, id, 0)
          }
        }
      })
    },
    dialogOpened () {
      const selectId = Object.entries(this.dicSelectId).filter(([key, value]) => value).map(([key, value]) => Number(key))
      let showProducts = this.tpProductList
      selectId.push(Number(this.curTPProduct.tp_product_id))
      showProducts = this.tpProductList.filter(item => selectId.includes(item.tp_product_id))
      // if ([...new Set(selectId)].length !== 1) {
      // }

      if (this.curTPProduct.tp_product_id) {
        this.$refs.productEditNewView
          .initList(this.curTPProduct, showProducts
            .filter(product => [
              common.productStatus.WAIT_ONLINE,
              common.productStatus.SAVE_DRAFT,
              common.productStatus.ONLINE,
              common.productStatus.FAILED,
              common.productStatus.WAIT_MODIFY,
              common.productStatus.REJECT].includes(product.status)))
      }
    },
    dialogClose () {
      this.$refs.productEditNewView.onClose()
    },
    triggerDialogClose () {
      this.dialogEditVisible = false
      this.$refs.productEditNewView.onClose()
    },
    dialogBeforeClose (done) {
      let self = this
      if (this.$refs.productEditNewView.isProductChange()) {
        this.$confirm('有未保存的修改，是否保存?', '提示', {
          confirmButtonText: '保存',
          cancelButtonText: '不保存'
        }).then(_ => {
          self.$refs.productEditNewView.closeAfterSave = true
          self.$refs.productEditNewView.onSaveProduct()
          // 保存完成后再触发关闭
          // done()
        }).catch(_ => { done() })
      } else {
        done()
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
    onChangeProducts (data) {
      let dicProduct = {}
      for (let i in this.tpProductList) {
        dicProduct[this.tpProductList[i].tp_product_id] = this.tpProductList[i]
      }
      let dicKeys = {
        status: 'status',
        migration_msg: 'migration_msg',
        check_error_msg_static: 'check_error_msg_static',
        price: 'max_price',
        title: 'title',
        category_id: 'category_id',
        category_show: 'category_show'
      }
      for (let i in data) {
        let dataItem = data[i]
        for (let key in dataItem) {
          if (!dataItem.hasOwnProperty(key)) continue
          if (key in dicKeys && dataItem.tp_product_id in dicProduct) {
            dicProduct[dataItem.tp_product_id][ dicKeys[key] ] = dataItem[key]
          }
        }
      }
    },
    btnSyncClick (item) {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '复制商品', '点击', '商品源立即同步'])
      }
      this.$emit('btnSyncClick', item)
    },
    btnSettingClick (item) {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '复制商品', '点击', '设置商品源同步'])
      }
      this.$emit('btnSettingClick', item)
    },
    cellStyle ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        var status = this.tpProductList[rowIndex].status
        var captureStatus = this.tpProductList[rowIndex].capture_status
        if ([0, 1].includes(captureStatus)) {
          return 'background-color:#909399; padding:0;'
        } else if ([5, 7, 8].includes(status)) {
          return 'background-color:#F56C6C; padding:0;'
        } else if (status === 6) {
          return 'background-color:#E6A23C; padding:0;'
        } else if ([3, 4].includes(status)) {
          return 'background-color:#67C23A; padding:0;'
        } else if (status === 10) {
          return 'background-color:#909399; padding:0;'
        }
      }
      return 'padding:0;'
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
    closeNewComer (event, key) {
      event.stopPropagation()
      const ref = this.$refs[key]
      ref && ref[0] && ref[0].close && ref[0].close()
    },
    closeNewComerFail (event, key) {
      event.stopPropagation()
      const ref = this.$refs[key]
      ref && ref.close && ref.close()
    },
    getFirstShow (status, idx, dataStatus) {
      const index = this.tpProductList.findIndex((product, index) => {
        return product.status === status
      })
      return idx === index && status === dataStatus
    },
    handleCommandSort (command) {
      const obj = {
        a: {
          text: '按复制时间降序',
          order_by: 1
        },
        b: {
          text: '按复制时间升序',
          order_by: 3
        },
        c: {
          text: '按搬家时间降序',
          order_by: 2
        },
        d: {
          text: '按搬家时间升序',
          order_by: 4
        }
      }
      const text = obj[command].text
      this.commandSortText = text
      this.order_by = obj[command].order_by
      this.$emit('sortByTime', obj[command].order_by)
    },
    async onChangeCate (category) {
      if (!category || (category && !category.id)) {
        return this.$message.error('请选择分类')
      } else if (isEmpty(this.selectCategoryRow)) {
        return this.$message.error('没有要修改的数据')
      }
      this.changeCategoryLoading = true
      const list = [this.selectCategoryRow.tp_product_id]
      try {
        await Api.hhgjAPIs.batchUpdateCategory({
          tp_product_ids: list,
          cid: category.id
        })
        this.visvileCategory = false
        this.changeCategoryLoading = false
        this.tpProductList.forEach((item, index) => {
          if (item.tp_product_id === this.selectCategoryRow.tp_product_id) {
            this.selectCategoryRow = {}
            this.reload()
            this.$message.success('修改成功')
          }
        })
      } catch (err) {
        this.changeCategoryLoading = false
        this.$message.error(`${err}`)
      }
    },
    chooseCategory (row) {
      this.visvileCategory = true
      this.selectCategoryRow = row
    },
    removeCategory () {
      this.default_category = {}
      this.default_category_id = 0
    },
    handleMatchCategory (row) {
      this.selectCategoryRow = row
      this.$refs.ModalSourceCategory.open(row)
    },
    onChangeModalSourceCategory (category) {
      this.reload()
    },
    getCategoryShow (categoryName) {
      if (categoryName.includes('>')) {
        return categoryName.split('>').pop()
      }
      return categoryName
    }
  }
}
</script>
<style lang="less" scoped>
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

    .closeBtn {
      position: fixed;
      left:9%;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 36px;
      height: 36px;
      z-index: 9999;
      transition: all 0.8s;
      border-radius: 50%;
      background:#c7c7c7;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      &:active {
        background: @color-text-placeholder;
      }
      .iconguanbi {
        font-size: 18px;
        color:#ffffff;
      }
    }
</style>

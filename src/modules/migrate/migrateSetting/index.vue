<template lang="html">
  <div class="migrateSetting">

    <el-tabs tab-position="top"  v-model="activeTab" :style="{width: `calc(100% - ${scrollWidth + 290}px)`}" class="tab" @tab-click="tabClick" ref="tab">
      <el-tab-pane :label="tab.label" v-for="(tab) in tabs" :key="tab.label"></el-tab-pane>
    </el-tabs>
    <el-dialog class="dialog-tight" title="选择复制后的类目" width="800px" center :visible.sync="visvileCategory" v-hh-modal>
      <categorySelectView ref="categorySelectView" @changeCate="onChangeCate" />
    </el-dialog>

    <div :style="{'text-align': 'left', 'font-size': '14px','padding-bottom': mBottom,'padding-top': '30px'}" class="migrateSettingForm">
      <el-form ref="template" :rules="rules" style="width: 100%;" size="mini" :model="$data">
        <!-- 类目 -->
        <el-form-item required label="类目统一为:" style="max-width:379px;margin-bottom: 20px;" class="migrateSetting-category">
          <div class="flex align-c " style="height:28px">
            <el-button size="mini" v-if="default_category && !default_category.name" @click="chooseCategory"
              type="text">点击选择类目</el-button>
            <a class="skeleton skeleton-item" v-if="!default_category" style="width:100px;height:18px"/>

            <div class="flex align-c" style="height:28px" v-if="default_category && default_category.name">
              <el-tooltip :content="default_category && default_category.name"
                :disabled="default_category.name && default_category.name.length < 18">
                <el-button size="mini" type="text" @click="chooseCategory" class="brand">
                  {{default_category && default_category.name}}</el-button>
              </el-tooltip>
              <el-button size="mini" @click="removeCategory" type="text" class="ml-5">删除</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" class="migrateSetting-category">
          <span slot="label" style="display:inline">
            <div>淘宝\天猫\拼多多</div>
            <div>商品类目匹配:</div>
          </span>
          <div class="flex column left" v-loading="loadingCategoryMap">
            <div v-for="category in showCategoryMap" :key="category.id" class="flex align-c" v-if="categoryMap.length">
              <span class="flex align-c font-12 color-333">
                <img style="width: 14px; height: 14px;margin-right:2px;" :src="getIcon(category)">
                {{category.source}}-
              </span>
              <span class="info">
                {{category.tp_category_name}}
              </span>
              <span class="mr-10 ml-10 font-12">对应抖店分类</span>
              <span class="primary mr-10" @click="changeCategory(category)">{{category.dy_category_name}}</span>
              <el-switch v-model="category.is_open" class="ml-5 mr-10" @change="changeCategoryOpen(category)"/>
              <span class="primary" @click="deleteCategory(category)" >删除</span>
            </div>
            <span style="align-self: flex-end;width:70%" class="primary" v-if="categoryMap.length &&  categoryMap.length > 2 && !categoryVisible" @click="categoryVisible = true">点击展开类目匹配</span>
            <span style="align-self: flex-end;width:70%" class="primary" v-if="categoryMap.length &&  categoryMap.length > 2 &&  categoryVisible" @click="categoryVisible = false">点击合并类目匹配</span>
            <div v-if="!categoryMap.length">无，可以在 搬家列表-基本信息 中设置</div>
          </div>
        </el-form-item>
        <!-- 品牌 -->
        <el-form-item required label="品牌统一为:" style="margin-bottom: 20px;" class="migrateSetting-brand">
          <el-select v-model="default_brand_id" placeholder="默认无品牌设置" style="width:280px;margin-right:12px"
            clearable @clear="clear">
            <el-option label="默认无品牌" :value="0"></el-option>
            <el-option v-for="item in brandList" :key="item.id" :label="getBrandName(item)" :value="item.id" />
          </el-select>
          <el-button type="text" @click="loadData" :loading="loadingBrandList">
            <hh-icon type="iconjiazai" style="font-size:10px;margin-right:3px" v-if="!loadingBrandList" />
            <span>{{!loadingBrandList ? '刷新':'加载中'}}</span>
          </el-button>
        </el-form-item>
        <!-- 商家推荐语 -->
        <el-form-item required label="推荐语统一为:"  style="margin-bottom: 20px;" class="flex migrateSetting-recommend" >
          <div style="display:flex;margin-bottom:5px" class="align-c">
            <el-form-item style="display:inline;margin-bottom:0" prop="default_recommend_remark"  class="mr-5">
                <el-input :maxlength="50" :minlength="8" show-word-limit  v-model="default_recommend_remark" style="width: 650px;" class="ml-5" placeholder="请填写商家推荐语设置" clearable @clear="handleClear('default_recommend_remark')"></el-input>
            </el-form-item>
            <el-form-item style="display:inline;margin-bottom:0" prop="is_open_recommend_remark">
                <el-switch v-model="is_open_recommend_remark"/>
            </el-form-item>
          </div>
        </el-form-item>
        <!-- 属性设置 -->
        <el-form-item required label="属性设置:"  style="margin-bottom: 20px;" class="flex migrateSetting-attribute" >
          <div style="display:flex;margin-bottom:5px" class="align-c">
            <p class="font-12">
              必填属性未填写时，若需输入属性值，则默认填写值为<el-input v-model="default_attr_value" style="width: 280px;" class="ml-5" placeholder="类目属性默认值设置"  clearable @clear="handleClear('default_attr_value')"></el-input>
            </p>
            <el-switch v-model="is_use_default_attr_value" class="ml-5 mr-5"/>

            <el-popover
              width="400"
              trigger="hover">
              <img style="width:400px"
              src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/717803240fbd43868db89dddd4f2a540~tplv-k3u1fbpfcp-watermark.image" />
              <span class="pointer flex align-c" slot="reference">
                <hh-icon type="iconquestion" style="font-size:18px;color:#FA6400"></hh-icon>
                <span class="info">填写帮助</span>
              </span>
            </el-popover>

          </div>
          <div style="display:flex;margin-bottom:5px" class="align-c font-12">
            必填属性未填写时，若需选择属性值，则默认选择第一个属性选项
            <el-switch v-model="is_select_first_options_attr"  class="ml-5 mr-5"/>

            <el-popover
              width="400"
              trigger="hover">
              <img style="width:400px"
              src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/397681ce02154a2b9ad2541ef83b62a9~tplv-k3u1fbpfcp-watermark.image" />
              <span class="pointer flex align-c" slot="reference">
                <hh-icon type="iconquestion" style="font-size:18px;color:#FA6400"></hh-icon>
                <span class="info">填写帮助</span>
              </span>
            </el-popover>
          </div>
        </el-form-item>
        <!-- 库存 -->
        <el-form-item required label="SKU库存:"  style="margin-bottom: 20px;" class="flex migrateSetting-stock" >
            <p class="mb-10 flex align-c mb-10">
              <span class="font-12 mr-5">SKU库存最高值为</span>
              <span class="font-12">（若超过该值，系统会自动调为最高值）</span>
              <el-form-item style="display:inline;margin-bottom:0" prop="max_sku_stock"  class="mr-5">
                  <el-input-number v-model="max_sku_stock" placeholder="请输入数字" style="width: 140px;"  :min="0" :max="1000000"/>
              </el-form-item>
              <el-form-item style="display:inline;margin-bottom:0" prop="is_use_max_sku_stock">
                  <el-switch v-model="is_use_max_sku_stock" @change="handleIsUseMaxSkuStock"/>
              </el-form-item>
            </p>

            <p class="mb-10 flex align-c mb-10">
              <span class="font-12 mr-5">所有SKU库存均为</span>
              <el-form-item style="display:inline;margin-bottom:0" prop="default_sku_stock"  class="mr-5">
                  <el-input-number v-model="default_sku_stock" placeholder="请输入数字" style="width: 140px;"  :min="0" :max="1000000"/>
              </el-form-item>
              <el-form-item style="display:inline;margin-bottom:0" prop="is_use_default_sku_stock">
                  <el-switch v-model="is_use_default_sku_stock" @change="handleIsUseDefaultSkuStock"/>
              </el-form-item>
            </p>
        </el-form-item>

        <el-form-item required  label="SKU编码:"  style="margin-bottom: 20px;" class="flex align-c migrateSetting-code">
            <p class="font-12">用ID代替SKU编码<el-switch class="ml-5" v-model="goods_code_type" /></p>
        </el-form-item>

        <!-- <el-form-item required label="SKU规格:"  style="margin-bottom: 20px;" class="flex align-c migrateSetting-spec">
            <p class="font-12">SKU规格值超过20个自动截断<el-switch class="ml-5" v-model="is_cut_sku_spec" /></p>
        </el-form-item> -->

        <el-form-item required label="详情图:"  style="margin-bottom: 20px;" class="flex migrateSetting-detail" >
            <p class="font-12 mb-10 mt-5">轮播图+详情图+规格图片超过50张自动删除详情图(否则官方会驳回)<el-switch class="ml-5" v-model="detail_img_cut" /></p>
            <p class="font-12 mb-10">删除详情首图<el-switch class="ml-5" v-model="is_cut_detail_first" /></p>
            <p class="font-12 mb-10">删除详情尾图<el-switch class="ml-5" v-model="is_cut_detail_last" /></p>
            <p class="font-12 mb-10">如果是天猫商品，优先抓天猫 &nbsp;
              <el-radio-group v-model="is_tmall_pc_first">
                <el-radio :label="1">电脑端详情图</el-radio>
                <el-radio :label="0">移动端详情图</el-radio>
              </el-radio-group>
            </p>
            <p class="font-12 mb-10">如果是淘宝商品，优先抓淘宝 &nbsp;
              <el-radio-group v-model="is_taobao_pc_first">
                <el-radio :label="1">电脑端详情图</el-radio>
                <el-radio :label="0">移动端详情图</el-radio>
              </el-radio-group>
            </p>
            <p class="font-12" style="display: flex;align-items: center;">批量增加详情首图
            <el-upload
              class="avatar-uploader"
              action="/api/image/create"
              :headers="getTokenHeaders"
              :data="getImageFirstData"
              :show-file-list="false"
              :on-success="handleAvatarSuccessFirst">
              <img v-if="detail_first_image_url" :src="detail_first_image_url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon">
                上传详情首图
              </i>
            </el-upload>
            <el-switch class="ml-5" v-model="is_batch_add_detail_first" />
            </p>
            <p class="font-12" style="display: flex;align-items: center;">批量增加详情尾图
              <el-upload
                class="avatar-uploader"
                action="/api/image/create"
                :headers="getTokenHeaders"
                :data="getImageLastData"
                :show-file-list="false"
                :on-success="handleAvatarSuccessLast">
                <img v-if="detail_last_image_url" :src="detail_last_image_url" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon">
                  上传详情尾图
                </i>
              </el-upload>
              <el-switch class="ml-5" v-model="is_batch_add_detail_last" />
            </p>
            <p class="font-12" style="display: flex;align-items: center;">
            </p>
        </el-form-item>

        <el-form-item required label="轮播图:"  style="margin-bottom: 20px;" class="flex migrateSetting-banner" >
            <p class="font-12 mb-10">仅保留前5张轮播图(否则官方会驳回)<el-switch class="ml-5" v-model="is_banner_auto_5" /></p>
            <p class="font-12 mb-10">删除轮播首图<el-switch class="ml-5" v-model="is_cut_banner_first" /></p>
            <p class="font-12 mb-10">删除轮播尾图<el-switch class="ml-5" v-model="is_cut_banner_last" /></p>
            <p class="font-12"><span style="margin-right: 5px">随机打乱轮播图顺序 (首图不变位置</span><el-checkbox v-model="is_keep_main_banner"></el-checkbox>)<el-switch class="ml-5" v-model="is_mix_banner" /></p>
        </el-form-item>

        <el-form-item required label="标题:"  style="margin-bottom: 20px;" class="flex migrateSetting-title" >

          <div style="display:flex;margin-bottom:5px" class="align-c">
            <p style="margin-right:10px">
              <el-input clearable @clear="handleClear('title_prefix')" v-model="title_prefix" placeholder="前缀" style="width: 280px;margin-right:10px"></el-input>
              <span style="font-size:12px;margin-right:24px">原标题</span>
            </p>
            <p>
              <el-input clearable @clear="handleClear('title_suffix')" v-model="title_suffix" placeholder="后缀" style="width: 280px;"></el-input>
            </p>
            <el-switch v-model="is_open_title_prefix_suffix"  class="ml-5"/>
          </div>
          <div style="display:flex;margin-bottom:5px" class="align-c">
            <p style="margin-right:10px">
              <el-input clearable @clear="handleClear('source_title_str')" v-model="source_title_str" style="width: 280px;margin-right:10px"></el-input>
              <span style="font-size:12px">全部替换为</span>
            </p>
            <p>
              <el-input clearable @clear="handleClear('target_title_str')" v-model="target_title_str" style="width: 280px;"></el-input>
            </p>
            <el-switch v-model="is_open_title_replace" class="ml-5"/>
          </div>

          <p class="flex align-c mb-5">
            <span style="font-size: 12px;margin-right:10px">超过30个字</span>
            <el-radio-group v-model="title_cut_type">
              <el-radio :label="1">自动去末尾</el-radio>
              <el-radio :label="2">自动去开头</el-radio>
              <el-radio :label="3">不处理</el-radio>
            </el-radio-group>
          </p>

          <p style="display:flex;flex:1" class="mb-10">
            <span style="font-size: 12px;margin-right:10px">删除指定内容</span>
            <el-checkbox-group v-model="cut_type_list">
                <el-checkbox label="is_cut_alpha" style="width:100px;color:333">删除英文</el-checkbox>
                <el-checkbox label="is_cut_digit" style="width:100px;color:333">删除数字</el-checkbox>
                <el-checkbox label="is_cut_brackets">删除括号以及括号里的内容</el-checkbox>
            </el-checkbox-group>
          </p>

        </el-form-item>

        <el-form-item required label="重复搬家设置"  class="flex migrateProductsFilter migrateSetting-choose" style="height:25px;margin-bottom: 20px;">
          <!-- <el-checkbox-group v-model="able_migrate_status_list" class="flex ml-5">
            <el-checkbox :label="common.productStatus.WAIT_ONLINE">待上线</el-checkbox>
            <el-checkbox :label="common.productStatus.FAILED">失败</el-checkbox>
            <el-checkbox :label="common.productStatus.REJECT">驳回</el-checkbox>
            <el-checkbox :label="common.productStatus.ONLINE">已上线</el-checkbox>
            <el-checkbox :label="common.productStatus.SAVE_DRAFT">保存草稿箱</el-checkbox>
          </el-checkbox-group>；其余状态商品会自动过滤 -->
          <p class="font-12" style="line-height:30px">已上线、草稿箱商品支持再次搬家<el-switch class="ml-5" v-model="is_able_migrate_status_list" @change="handleIsAbleMigrateStatusList" /></p>
        </el-form-item>

        <el-form-item required label="违规信息:"  style="margin-bottom: 20px;" class="flex migrateSetting-rule" >
            <div>
              <span style="font-size: 12px;"><span style="color: red;">*</span>商品标题、SKU规格名违规词自动删除</span>
              <el-switch v-model="is_cut_black_word" />
            </div>
            <div style="display:flex;flex:1" >
                <p style="width: 280px;text-align:right;position:relative" >
                    <el-input v-model="back_words" @input="formatBlackWords" type="textarea"
                    size="small" :placeholder="pt"
                    :autosize="{ minRows: 10,maxRows: 15}"
                    style="width: 100%;" >
                    </el-input>
                    <el-button size="small" style="margin-top:10px;position:absolute;bottom:5px;right:10px" type="primary" :disabled="!this.black_word_list.length" @click="createBlackWords" :loading="createBlackWordsLoading">添加</el-button>
                </p>
                <div style="flex:1;max-width:550px;max-height:250px;overflow-y:auto;border: 1px solid #DCDFE6;border-radius: 4px;margin-left:15px" v-loading="wordsTagLoading">
                    <el-tag v-for="(tag,index) in defaultBlackWords" :disable-transitions="true" :key="tag"  :type="typeList[index%5]" >
                        {{tag}}
                    </el-tag>
                    <el-tag  v-for="(tag,index) in blackWords" :disable-transitions="true" :key="tag"  :type="typeList[index%5]" @close="handleCloseWords(tag)">
                        <span class="tag">{{tag}}</span> <span @click="handleCloseWords(tag)" :class="`pointer el-tag__close el-icon-close ${typeList[index%5]}`" ></span>
                    </el-tag>
                </div>
            </div>
            <div style="margin-top: 10px;">
              <span style="font-size: 12px;"><span style="color: red;">*</span>轮播首图、详情尾图违规词自动删除</span>
              <el-switch v-model="is_cut_image_black_word" />
            </div>
            <div style="display:flex;" >
                <p style="width: 280px;text-align:right;position:relative" >
                    <el-input v-model="image_back_words" @input="formatImageBlackWords" type="textarea"
                    size="small" :placeholder="placeholder"
                    :autosize="{ minRows: 10,maxRows: 15}"
                    style="width: 100%;" >
                    </el-input>
                    <el-button size="small" style="margin-top:10px;position:absolute;bottom:5px;right:10px" type="primary" :disabled="!this.image_black_word_list.length" @click="createImageBlackWords" :loading="createBlackWordsLoading">添加</el-button>
                </p>
                <div style="flex:1;max-width:550px;border: 1px solid #DCDFE6;max-height:250px;overflow-y:auto;border-radius: 4px;margin-left:15px" v-loading="imgTagLoading">
                    <el-tag v-for="(tag,index) in defaultImageBlackWords" :disable-transitions="true" :key="tag"  :type="typeList[index%5]" >
                        {{tag}}
                    </el-tag>
                    <el-tag v-for="(tag,index) in imageBlackWords" :disable-transitions="true" :key="tag" closable :type="typeList[index%5]" @close="handleCloseImages(tag)">
                        {{tag}}
                    </el-tag>
                </div>
            </div>
        </el-form-item>
      </el-form>
      <div class="color-danger">注：价格、运费模版、发货模式等重要信息的填写是在商品复制后再填写。这里不用设置哦～</div>
    </div>

    <div class="saveBtn" :style="{width: `calc(100% - ${scrollWidth + 290}px)`}">
      <el-button type="primary" @click="saveSetting()" :loading="createBlackWordsLoading" class="mt-10" style="width:120px"
        :disabled="shouldUpdate || loadingSettings">保存设置</el-button>
      <el-link @click="gotoStartCopy" v-if="shouldUpdate || loadingSettings" :underline="false" type="primary" class="font-12 ml-5 " style="margin-top:25px">已设置，去复制商品。点击跳转开始复制页。</el-link>
    </div>

  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import request from '@/mixins/request.js'
import common from '@/common/common.js'
import Api from '@/api/apis.js'
import categorySelectView from '@/components/CategorySelectView'

export default {
  mixins: [request],
  components: {
    categorySelectView
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    if (this.shouldUpdate || this.loadingSettings) {
      next()
    } else {
      this.$confirm('您未保存，是否先保存再关闭？')
        .then(_ => {
          this.saveSetting().then(() => {
            next()
          })
        })
        .catch(_ => {
          this.revertData()
          next()
        })
    }
  },
  data () {
    return {
      categoryVisible: false,
      tabs: [
        { label: '类目', className: '.migrateSetting-category' },
        { label: '品牌', className: '.migrateSetting-brand' },
        { label: '商家推荐语', className: '.migrateSetting-recommend' },
        { label: '属性设置', className: '.migrateSetting-attribute' },
        { label: 'SKU库存', className: '.migrateSetting-stock' },
        { label: 'SKU编码', className: '.migrateSetting-code' },
        { label: '详情图', className: '.migrateSetting-detail' },
        { label: '轮播图', className: '.migrateSetting-banner' },
        { label: '标题', className: '.migrateSetting-title' },
        { label: '搬家商品选择', className: '.migrateSetting-choose' },
        { label: '违规信息', className: '.migrateSetting-rule' }
      ],
      detail_first_image_url: '',
      detail_last_image_url: '',
      mBottom: `150px`,
      activeTab: '0',
      scrollWidth: 0,
      brandList: [],
      model: {},
      loadingBrandList: false,
      visvileCategory: false,
      common,
      title_cut_off: undefined,
      title_ban_words: undefined,
      // banner_completion: undefined,
      detail_img_cut: undefined,
      // is_cut_sku_spec: undefined,
      is_cut_black_word: undefined,
      is_cut_image_black_word: undefined,
      is_banner_auto_5: undefined,

      is_select_first_options_attr: undefined,
      is_use_default_attr_value: undefined,
      default_attr_value: '',
      default_recommend_remark: '',
      is_open_recommend_remark: undefined,
      is_open_title_prefix_suffix: undefined,
      is_open_title_replace: undefined,
      default_sku_stock: '',
      is_use_default_sku_stock: undefined,
      max_sku_stock: '',
      is_use_max_sku_stock: undefined,
      is_cut_banner_first: undefined,
      is_cut_banner_last: undefined,
      is_cut_detail_last: undefined,
      is_cut_detail_first: undefined,
      is_tmall_pc_first: undefined,
      is_taobao_pc_first: undefined,
      is_batch_add_detail_first: undefined,
      is_batch_add_detail_last: undefined,
      is_keep_main_banner: undefined,
      is_mix_banner: undefined,
      title_cut_type: 3,
      cut_type_list: [],
      title_prefix: '',
      title_suffix: '',
      source_title_str: '',
      target_title_str: '',
      default_category: {},
      default_category_id: undefined,
      default_brand_id: 0,
      property_radio: '1',
      goods_property_selected: '',
      goods_code_type: 0,
      goods_property_value: '',
      goods_property_options: [],
      goods_property_options_dic: {},
      goods_property_list: [],
      goods_code_prefix: '',
      goods_code_suffix: '',
      goods_code_type_options: [
        {
          value: 0,
          label: '留空'
        },
        {
          value: 1,
          label: '使用{商品ID}'
        }
      ],
      blackWords: [],
      back_words: '',
      imageBlackWords: [],
      image_back_words: '',
      auto_delete: '',
      wordsTagLoading: false,
      imgTagLoading: false,
      loadingSettings: true,
      typeList: ['default', 'success', 'info', 'warning', 'danger'],
      black_word_list: [],
      image_black_word_list: [],
      createBlackWordsLoading: false,
      originMigrateSetting: undefined,
      customerBlackWords: [],
      customerImageBlackWords: [],
      defaultBlackWords: [],
      defaultImageBlackWords: [],
      placeholder: `请输入自定义违规词，换行或空格或逗号分隔多个违规词\n\n商品轮播首图、详情尾图中含有该违规词，则自动去除该图片\n\n检测图片会影响抓取速度，若抓取抖音商品则不检测`,
      pt: `请输入自定义违规词，换行或空格或逗号，分隔多个违规词\n\n表中已有的违禁词是默认违禁词，不可删除，是抖音官方判定的违禁词`,
      able_migrate_status_list: [
        common.productStatus.WAIT_ONLINE,
        common.productStatus.FAILED,
        common.productStatus.REJECT
      ],
      settingKeys: [],
      categoryMap: [],
      loadingCategoryMap: false,
      changeCategoryVisible: false
    }
  },
  created () {
    this.getSetting()

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
    const scrollWidth = getScrollbarWidth(scrollEl)
    this.scrollWidth = scrollWidth
  },
  mounted () {
    const tab = this.tabs
    let maxPaddingBottom = 0
    const height =
      document.documentElement.offsetHeight || document.body.offSetHeight
    const nextTab = tab.map((item, index) => {
      const className = item.className
      const el = document.querySelector(className)
      // if (el) {
      const rect = el.getBoundingClientRect()
      // 移动的距离 是滚动距离
      // pt的距离是 整个盒子可见部分
      const top = rect.top
      const elHeight = rect.height
      const dist = 130
      if (tab.length - 1 === index) {
        maxPaddingBottom = height - elHeight - 130 - 80
      }
      return {
        ...item,
        scrollTop: top - dist,
        top
      }
      // }
    })
    this.tabs = nextTab
    this.bindScroll()

    this.$nextTick(() => {
      this.mBottom = `${maxPaddingBottom}px`
    })
  },
  beforeMount () {
    this.unBindScroll()
  },
  activated () {
    if (this.shouldUpdate) {
      this.getSetting()
    }
    this.bindScroll()
    this.activeTab = '0'
    window.addEventListener('beforeunload', this.beforeunloadFn)
  },
  deactivated () {
    this.unBindScroll()
    window.removeEventListener('beforeunload', this.beforeunloadFn)
  },
  computed: {
    ...mapGetters({
      getTokenHeaders: 'getTokenHeaders'
    }),
    getImageFirstData () {
      return {
        'file_name': 'detail_first'
      }
    },
    getImageLastData () {
      return {
        'file_name': 'detail_last'
      }
    },
    showCategoryMap () {
      if (this.categoryVisible) return this.categoryMap
      let categoryMap = this.categoryMap
      categoryMap = categoryMap.slice(0, 2)
      return categoryMap
    },
    rules () {
      const checkMaxSkuStock = (rule, value, callback) => {
        if (this.is_use_max_sku_stock) {
          if (this.max_sku_stock < 0 || this.max_sku_stock > 1000000) {
            return callback(new Error('范围设置:0~1000000'))
          }
        }
        callback()
      }

      const checkUseMaxSkuStock = (rule, value, callback) => {
        if (this.is_use_max_sku_stock) {
          this.$refs.template.validateField('max_sku_stock')
        }
        callback()
      }

      const checkDefaultSkuStock = (rule, value, callback) => {
        if (this.is_use_default_sku_stock) {
          if (this.default_sku_stock < 0 || this.default_sku_stock > 1000000) {
            return callback(new Error('范围设置:0~1000000'))
          }
        }
        callback()
      }

      const checkUseDefaultSkuStock = (rule, value, callback) => {
        if (this.is_use_default_sku_stock) {
          this.$refs.template.validateField('default_sku_stock')
        }
        callback()
      }

      const checkIsOpenDefaultRecommendRremark = (rule, value, callback) => {
        if (this.is_open_recommend_remark) {
          this.$refs.template.validateField('default_recommend_remark')
        }
        callback()
      }

      const checkDefaultRecommendRremark = (rule, value, callback) => {
        if (value) {
          if (
            value.split('').length < 8 ||
            value.split('').length > 50
          ) {
            return callback(new Error('商家推荐语只可以填写8-50个字符！'))
          }
        }
        this.$refs.template.clearValidate('default_recommend_remark')
        callback()
      }

      return {
        max_sku_stock: [
          { validator: checkMaxSkuStock, trigger: 'change' }
        ],
        is_use_max_sku_stock: [
          { validator: checkUseMaxSkuStock, trigger: 'change' }
        ],
        default_sku_stock: [
          { validator: checkDefaultSkuStock, trigger: 'change' }
        ],
        is_use_default_sku_stock: [
          { validator: checkUseDefaultSkuStock, trigger: 'change' }
        ],
        default_recommend_remark: [
          { validator: checkDefaultRecommendRremark, trigger: 'change' }
        ],
        is_open_recommend_remark: [
          { validator: checkIsOpenDefaultRecommendRremark, trigger: 'change' }
        ]
      }
    },
    shouldUpdate () {
      const product = cloneDeep(this.getFormatSettings()) || {}
      // 搬家状态
      const originMigrateSetting = cloneDeep(this.originMigrateSetting) || {}
      const migrateStatus = originMigrateSetting.able_migrate_status_list || []
      const currentMigrateStatus = this.able_migrate_status_list || []
      delete product.able_migrate_status_list
      delete originMigrateSetting.able_migrate_status_list
      const isEqualSetting = isEqual(originMigrateSetting, product)
      var isEqualStatusList = migrateStatus.length === currentMigrateStatus.length &&
      migrateStatus.sort().toString() === currentMigrateStatus.sort().toString()
      // 搬家标题-删除指定内容
      const cutTypeList = originMigrateSetting.cut_type_list || []
      const currentCutTypeList = this.cut_type_list || []
      delete product.cut_type_list
      delete originMigrateSetting.cut_type_list
      const isEqualCutTypeList = cutTypeList.length === currentCutTypeList.length &&
      cutTypeList.sort().toString() === currentCutTypeList.sort().toString()

      const blackWords = new Set(this.blackWords)
      const originBlackWords = new Set([
        ...this.customerBlackWords,
        ...this.defaultBlackWords
      ])
      const newBlackWords = [...blackWords].filter(
        (item) => !originBlackWords.has(item)
      )
      const imageBlackWords = new Set(this.imageBlackWords)
      const originImageBlackWords = new Set([
        ...this.customerImageBlackWords,
        ...this.defaultImageBlackWords
      ])
      const newImageBlackWords = [...imageBlackWords].filter(
        (item) => !originImageBlackWords.has(item)
      )

      // 分类
      return (
        isEqualSetting && !newBlackWords.length && !newImageBlackWords.length && isEqualStatusList && isEqualCutTypeList
      )
    }
  },
  methods: {
    handleAvatarSuccessFirst (res, file) {
      this.detail_first_image_url = res.data.url
    },
    handleAvatarSuccessLast (res, file) {
      this.detail_last_image_url = res.data.url
    },
    revertData () {
      Object.keys(this.originMigrateSetting).forEach(key => {
        this[key] = this.originMigrateSetting[key]
      })
    },
    beforeunloadFn (e) {
      if (this.shouldUpdate) return false
      let msg = '离开后本页面更改不会被保存'
      if (e) {
        e.returnValue = msg
      }
      return msg
    },
    bindScroll () {
      const scrollEl = document.querySelector('.page-component__scroll')
      scrollEl.addEventListener('scroll', this.scroll)
    },
    unBindScroll () {
      const scrollEl = document.querySelector('.page-component__scroll')
      scrollEl && scrollEl.removeEventListener('scroll', this.scroll)
    },
    scroll: debounce(function (e) {
      const scrollTop = e.target.scrollTop
      let active = 0
      this.tabs.forEach((item, index) => {
        if (scrollTop >= item.scrollTop) {
          active = index
        }
      })
      this.changeActive(active)
    }, 300),
    changeActive: function (active) {
      this.activeTab = active.toString()
    },
    updateMigrateSettingData (data) {
      let boolPropertys = [
        'is_cut_black_word',
        'is_cut_image_black_word',
        'is_banner_auto_5',
        // 'is_cut_sku_spec',
        'detail_img_cut',
        'is_use_default_sku_stock',
        'is_use_max_sku_stock',
        'is_cut_banner_first',
        'is_cut_banner_last',
        'is_cut_detail_last',
        'is_cut_detail_first',
        'is_keep_main_banner',
        'is_mix_banner',
        'is_batch_add_detail_first',
        'is_batch_add_detail_last',
        'is_open_title_prefix_suffix',
        'is_open_title_replace',
        'goods_code_type',
        'is_select_first_options_attr',
        'is_use_default_attr_value',
        'is_open_recommend_remark'
      ]
      Object.keys(data).forEach((key) => {
        this[key] = boolPropertys.includes(key) ? Boolean(data[key]) : data[key]
      })
    },
    async getSetting () {
      try {
        this.loadingSettings = true
        const self = this
        let [ setting, blackWords, imgBlackWords ] = await Promise.all([
          Api.hhgjAPIs.getMigrateSetting({}),
          Api.hhgjAPIs.getBlackWordList({}),
          Api.hhgjAPIs.getBlackWordList({
            use_type: 1
          }),
          self.loadData(),
          self.loadCategoryMapList()
        ])
        let originMigrateSetting = {}
        let settingKeys = []
        // 记录本页需要的setting 过滤不需要的数据
        Object.keys(setting).map(key => {
          if (this.$data.hasOwnProperty(key)) {
            originMigrateSetting[key] = setting[key]
            settingKeys.push(key)
          }
        })
        this.originMigrateSetting = originMigrateSetting
        if (setting.able_migrate_status_list) {
          this.is_able_migrate_status_list = !!(setting.able_migrate_status_list.length === 5)
        }
        this.updateMigrateSettingData(originMigrateSetting)
        this.settingKeys = settingKeys
        // 默认设置
        if (setting.default_category) {
          this.default_category = setting.default_category
        }
        if (typeof setting.default_brand_id !== 'undefined') {
          this.default_brand_id = setting.default_brand_id || 0
        }
        if (setting.default_category_id && setting.default_category) {
          setting.default_category.name = setting.default_category.levels
            .map((item) => item.name)
            .join(' > ')
          setting.default_category.id = setting.default_category_id
        }

        // 违规词
        this.blackWords = blackWords.customer
        this.customerBlackWords = blackWords.customer
        this.defaultBlackWords = blackWords.default
        // 违规图片
        this.imageBlackWords = imgBlackWords.customer
        this.customerImageBlackWords = imgBlackWords.customer
        this.defaultImageBlackWords = imgBlackWords.default

        this.loadingSettings = false
      } catch (error) {
        this.$message.error(`${error}`)
      }
    },
    getFormatSettings () {
      const product = {
        ...this.originMigrateSetting,
        title_cut_off: Number(this.title_cut_off),
        title_ban_words: Number(this.title_ban_words),
        detail_img_cut: Number(this.detail_img_cut),
        // is_cut_sku_spec: Number(this.is_cut_sku_spec),
        is_cut_black_word: Number(this.is_cut_black_word),
        is_cut_image_black_word: Number(this.is_cut_image_black_word),
        is_banner_auto_5: Number(this.is_banner_auto_5),
        goods_code_type: Number(this.goods_code_type),
        property_radio: this.property_radio,
        goods_code_prefix: this.goods_code_prefix,
        goods_code_suffix: this.goods_code_suffix,
        goods_property: this.goods_property_options,
        able_migrate_status_list: this.able_migrate_status_list,
        default_sku_stock: this.default_sku_stock,
        is_use_default_sku_stock: Number(this.is_use_default_sku_stock),
        is_use_max_sku_stock: Number(this.is_use_max_sku_stock),
        max_sku_stock: this.max_sku_stock,
        is_cut_banner_first: Number(this.is_cut_banner_first),
        is_cut_banner_last: Number(this.is_cut_banner_last),
        is_cut_detail_last: Number(this.is_cut_detail_last),
        is_cut_detail_first: Number(this.is_cut_detail_first),
        is_tmall_pc_first: Number(this.is_tmall_pc_first),
        is_taobao_pc_first: Number(this.is_taobao_pc_first),
        is_keep_main_banner: Number(this.is_keep_main_banner),
        is_mix_banner: Number(this.is_mix_banner),
        is_batch_add_detail_first: Number(this.is_batch_add_detail_first),
        is_batch_add_detail_last: Number(this.is_batch_add_detail_last),
        detail_first_image_url: this.detail_first_image_url,
        detail_last_image_url: this.detail_last_image_url,
        is_open_title_prefix_suffix: Number(this.is_open_title_prefix_suffix),
        is_open_title_replace: Number(this.is_open_title_replace),
        title_cut_type: this.title_cut_type,
        cut_type_list: this.cut_type_list,
        title_prefix: this.title_prefix,
        title_suffix: this.title_suffix,
        source_title_str: this.source_title_str,
        target_title_str: this.target_title_str,
        default_category_id: Number(this.default_category_id),
        default_brand_id: Number(this.default_brand_id),
        default_attr_value: this.default_attr_value,
        is_select_first_options_attr: Number(this.is_select_first_options_attr),
        is_use_default_attr_value: Number(this.is_use_default_attr_value),
        is_open_recommend_remark: Number(this.is_open_recommend_remark),
        default_recommend_remark: this.default_recommend_remark
      }

      // 只比较本页需要的数据配置
      Object.keys(product).map(key => {
        if (!this.settingKeys.includes(key)) {
          delete product[key]
        }
      })

      return product
    },
    saveSetting () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '店铺设置', '点击', '保存设置'])
      }
      const product = this.getFormatSettings()
      console.log(product, 'product')

      this.$refs.template.validate(async (valid) => {
        if (valid) {
          let productParams = {
            json: JSON.stringify(product)
          }
          const blackWords = new Set(this.blackWords)
          const originBlackWords = new Set([
            ...this.customerBlackWords,
            ...this.defaultBlackWords
          ])
          const params = [...blackWords].filter(
            (item) => !originBlackWords.has(item)
          )
          const imageBlackWords = new Set(this.imageBlackWords)
          const originImageBlackWords = new Set([
            ...this.customerImageBlackWords,
            ...this.defaultImageBlackWords
          ])
          const imageParams = [...imageBlackWords].filter(
            (item) => !originImageBlackWords.has(item)
          )
          this.createBlackWordsLoading = true
          try {
            const updateBlackWords = params.length
              ? Api.hhgjAPIs.createBlackWords({
                black_word_list: JSON.stringify(params)
              })
              : Promise.resolve([])
            const updateImageBlackWords = imageParams.length
              ? Api.hhgjAPIs.createBlackWords({
                black_word_list: JSON.stringify(imageParams),
                use_type: 1
              })
              : Promise.resolve([])
            const isEqualSetting = isEqual(this.originMigrateSetting, product)
            const updateSetting = !isEqualSetting
              ? Api.hhgjAPIs.updateMigrateSetting(productParams)
              : Promise.resolve(this.originMigrateSetting)
            await Promise.all([
              updateBlackWords,
              updateImageBlackWords,
              updateSetting
            ])
            this.$message.success('保存成功')
            this.createBlackWordsLoading = false
            this.back_words = ''
            this.image_back_words = ''
            this.getSetting()
            return true
          } catch (error) {
            if (error) {
              console.error(error)
            }
            this.createBlackWordsLoading = false
            this.$message.error(`${error}`)
          }
        } else {
          this.$nextTick(() => {
            let isError = document.getElementsByClassName('is-error')
            isError[0].scrollIntoView({
                // 滚动到指定节点
                // 值有start,center,end，nearest，当前显示在视图区域中间
              block: 'center',
                // 值有auto、instant,smooth，缓动动画（当前是慢速的）
              behavior: 'smooth'
            })
          })
          return this.$message.error('请提示要求填写基础设置')
        }
      })
    },
    formatBlackWords () {
      let value = this.back_words.split(/[\s\n,，]/)
      value = value.map((s) => s.trim()).filter((s) => s !== '')
      this.black_word_list = [...new Set(value)]
    },
    formatImageBlackWords () {
      let value = this.image_back_words.split(/[\s\n,，]/)
      value = value.map((s) => s.trim()).filter((s) => s !== '')
      this.image_black_word_list = [...new Set(value)]
    },
    async createBlackWords () {
      this.blackWords = [
        ...new Set(this.blackWords.concat(this.black_word_list))
      ]
      this.back_words = ''
    },
    async createImageBlackWords () {
      this.imageBlackWords = [
        ...new Set(this.imageBlackWords.concat(this.image_black_word_list))
      ]
      this.image_back_words = ''
    },
    async handleCloseWords (word) {
      this.wordsTagLoading = true
      try {
        await Api.hhgjAPIs.deleteBlackWords({
          word: word,
          use_type: 0
        })
        Api.hhgjAPIs.getBlackWordList({}).then((data) => {
          this.blackWords = data.customer
          this.customerBlackWords = data.customer
          this.defaultBlackWords = data.default
        })
      } catch (error) {
        if (error) {
          console.error(error)
        }
        this.$message.error(`${error}`)
      }
      this.wordsTagLoading = false
    },
    async handleCloseImages (word) {
      this.imgTagLoading = true
      try {
        await Api.hhgjAPIs.deleteBlackWords({
          word: word,
          use_type: 1
        })
        Api.hhgjAPIs
          .getBlackWordList({
            use_type: 1
          })
          .then((data) => {
            this.imageBlackWords = data.customer
            this.customerImageBlackWords = data.customer
            this.defaultImageBlackWords = data.default
          })
      } catch (error) {
        if (error) {
          console.error(error)
        }
        this.$message.error(`${error}`)
      }
      this.imgTagLoading = false
    },
    async onChangeCate (category) {
      // 修改类目预设
      if (this.changeCategoryVisible) {
        try {
          const categoryMap = {
            tp_id: this.changeCategorydata.tp_id,
            tp_cid: this.changeCategorydata.tp_cid,
            dy_cid: category.id,
            is_open: Number(this.changeCategorydata.is_open)
          }
          await Api.hhgjAPIs.userCategoryMapCreate({
            category_map_list: JSON.stringify([categoryMap])
          })
          this.$message.success('修改成功')
          this.visvileCategory = false
          this.changeCategoryVisible = false
          this.loadCategoryMapList()
        } catch (err) {
          this.$message.error(`${err}`)
        }
      // 修改统一类目
      } else {
        if (!category || (category && !category.id)) {
          return this.$message.error('请选择分类')
        }
        this.visvileCategory = false
        this.default_category = category
        this.default_category_id = category.id
      }
    },
    chooseCategory () {
      this.visvileCategory = true
    },
    removeCategory () {
      this.default_category = {}
      this.default_category_id = 0
    },
    async loadData () {
      this.loadingBrandList = true
      try {
        const data = await Api.hhgjAPIs.getShopBrandList()
        this.brandList = data
        this.loadingBrandList = false
      } catch (err) {
        this.loadingBrandList = false
        this.$message.error(`${err}`)
      }
      return Promise.resolve(true)
    },
    async loadCategoryMapList () {
      this.loadingCategoryMap = true
      try {
        const categoryMap = await Api.hhgjAPIs.userCategoryMapList({})
        // 类目匹配
        this.categoryMap = categoryMap.map(item => {
          return {
            ...item,
            is_open: Boolean(item.is_open)
          }
        })
        this.loadingCategoryMap = false
      } catch (err) {
        this.loadingCategoryMap = false
        this.$message.error(`${err}`)
      }
      return Promise.resolve(true)
    },
    getBrandName (item) {
      if (item.brand_english_name.trim() && item.brand_chinese_name.trim()) {
        return `${item.brand_english_name.trim()}/${item.brand_chinese_name}`
      } else if (
        item.brand_english_name.trim() &&
        !item.brand_chinese_name.trim()
      ) {
        return item.brand_english_name.trim()
      } else {
        return item.brand_chinese_name.trim()
      }
    },
    clear () {
      this.default_brand_id = 0
    },
    tabClick (index) {
      this.unBindScroll()
      const n = this.activeTab
      const scrollTop = this.tabs[n].scrollTop
      this.$nextTick(() => {
        const elScroll = document.querySelector('.page-component__scroll')
        elScroll.scrollTo({
          top: scrollTop,
          left: 0,
          behavior: 'smooth'
        })
        this.bindScroll()
      })
    },
    handleIsUseMaxSkuStock (value) {
      if (value && this.is_use_default_sku_stock) {
        this.is_use_default_sku_stock = !value
      }
    },
    handleIsUseDefaultSkuStock (value) {
      if (value && this.is_use_default_sku_stock) {
        this.is_use_max_sku_stock = !value
      }
    },
    handleClear (property) {
      this[property] = ''
    },
    handleIsAbleMigrateStatusList (value) {
      if (value) {
        this.able_migrate_status_list = [
          common.productStatus.WAIT_ONLINE,
          common.productStatus.FAILED,
          common.productStatus.REJECT,
          common.productStatus.ONLINE,
          common.productStatus.SAVE_DRAFT
        ]
      } else {
        this.able_migrate_status_list = [
          common.productStatus.WAIT_ONLINE,
          common.productStatus.FAILED,
          common.productStatus.REJECT
        ]
      }
    },
    changeCategory (category) {
      this.changeCategorydata = category
      console.log(this.changeCategorydata)
      this.visvileCategory = true
      this.changeCategoryVisible = true
    },
    async changeCategoryOpen (category) {
      try {
        const categoryMap = {
          tp_id: category.tp_id,
          tp_cid: category.tp_cid,
          dy_cid: category.dy_cid,
          is_open: Number(category.is_open)
        }
        await Api.hhgjAPIs.userCategoryMapCreate({
          category_map_list: JSON.stringify([categoryMap])
        })
        this.$message.success('修改成功')
        this.visvileCategory = false
        this.changeCategoryVisible = false
        this.loadCategoryMapList()
      } catch (err) {
        this.$message.error(`${err}`)
      }
    },
    async deleteCategory (category) {
      try {
        await Api.hhgjAPIs.userUserCategoryMapDelete({
          id_list: JSON.stringify([category.id])
        })
        this.$message.success('删除成功')
        this.loadCategoryMapList()
      } catch (err) {
        this.$message.error(`${err}`)
      }
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
      }
      return ''
    },
    gotoStartCopy () {
      this.$router.push({
        name: 'StartMigrate'
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '~./index.less';
</style>
<style>
  .avatar-uploader {
    margin-left: 10px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    /*font-size: 28px;*/
    font-size: 10px;
    color: #8c939d;
    width: 90px;
    height: 90px;
    line-height: 90px;
    text-align: center;
  }
  .avatar {
    object-fit:contain;
    object-position:center;
    width: 90px;
    height: 90px;
    display: block;
  }

</style>

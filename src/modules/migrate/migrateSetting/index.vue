<template lang="html">
    <div style="text-align: left; font-size: 14px;" class="migrateSetting">
        <el-form ref="template" :rules="rules" style="width: 100%;">
            <el-form-item size="small" label="sku编码:" required style="margin-bottom: 0px;">
                <el-select v-model="goods_code_type" placeholder="请选择生成方式" style="width: 350px;">
                    <el-option v-for="item in goods_code_type_options" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品总图片超过50张自动截断详情图" required style="margin-bottom: 0px;">
                <el-checkbox v-model="detail_img_cut"></el-checkbox>
            </el-form-item>
            <el-form-item label="sku规格值超过20个自动截断" required style="margin-bottom: 0px;">
                <el-checkbox v-model="is_cut_sku_spec"></el-checkbox>
            </el-form-item>
            <el-form-item label="仅保留前5张轮播图" required style="margin-bottom: 0px;">
                <el-checkbox v-model="is_banner_auto_5"></el-checkbox>
            </el-form-item>
            <el-form-item label="商品标题、sku规格违规词自动删除" required style="margin-bottom: 0px;">
                <el-checkbox v-model="is_cut_black_word"></el-checkbox>
            </el-form-item>

            <el-form-item label="搬家仅针对" required class="flex migrateProductsFilter" style="height:25px">
              <el-checkbox-group v-model="able_migrate_status_list" class="flex ml-5">
                <el-checkbox :label="common.productStatus.WAIT_ONLINE">待上线</el-checkbox>
                <el-checkbox :label="common.productStatus.FAILED">失败</el-checkbox>
                <el-checkbox :label="common.productStatus.REJECT">驳回</el-checkbox>
                <el-checkbox :label="common.productStatus.ONLINE">已上线</el-checkbox>
                <el-checkbox :label="common.productStatus.SAVE_DRAFT">保存草稿箱</el-checkbox>
              </el-checkbox-group>；其余状态商品会自动过滤
            </el-form-item>

        </el-form>
        <div style="display:flex" >
            <p style="width: 35%;text-align:right;position:relative" >
                <el-input v-model="back_words" @input="formatBlackWords" type="textarea"
                 size="small" placeholder="请输入自定义违规词，换行或空格，分隔多个违规词"
                :autosize="{ minRows: 4}"
                style="width: 100%;" >
                </el-input>
                <el-button size="small" style="margin-top:10px;position:absolute;bottom:5px;right:10px" type="primary" :disabled="!this.black_word_list.length" @click="createBlackWords" :loading="createBlackWordsLoading">添加</el-button>
            </p>
            <div style="width:55%;border: 1px solid #DCDFE6;border-radius: 4px;margin-left:10px" v-loading="wordsTagLoading">
                <el-tag v-for="(tag,index) in defaultBlackWords" :disable-transitions="true" :key="tag"  :type="typeList[index%5]" >
                    {{tag}}
                </el-tag>
                <el-tag v-for="(tag,index) in blackWords" :disable-transitions="true" :key="tag" closable :type="typeList[index%5]" @close="handleCloseWords(tag)">
                    {{tag}}
                </el-tag>
            </div>
        </div>
        <div style="margin-top: 10px;">
          <span style="font-size: 12px;"><span style="color: red;">*</span>轮播首图、详情尾图违规词自动删除</span>
          <el-checkbox v-model="is_cut_image_black_word"></el-checkbox>
        </div>
        <div style="display:flex;margin-top: 10px;" >
            <p style="width: 35%;text-align:right;position:relative" >
                <el-input v-model="image_back_words" @input="formatImageBlackWords" type="textarea"
                 size="small" :placeholder="placeholder"
                :autosize="{ minRows: 4}"
                style="width: 100%;" >
                </el-input>
                <el-button size="small" style="margin-top:10px;position:absolute;bottom:5px;right:10px" type="primary" :disabled="!this.image_black_word_list.length" @click="createImageBlackWords" :loading="createBlackWordsLoading">添加</el-button>
            </p>
            <div style="width:55%;border: 1px solid #DCDFE6;border-radius: 4px;margin-left:10px" v-loading="imgTagLoading">
                <el-tag v-for="(tag,index) in defaultImageBlackWords" :disable-transitions="true" :key="tag"  :type="typeList[index%5]" >
                    {{tag}}
                </el-tag>
                <el-tag v-for="(tag,index) in imageBlackWords" :disable-transitions="true" :key="tag" closable :type="typeList[index%5]" @close="handleCloseImages(tag)">
                    {{tag}}
                </el-tag>
            </div>
        </div>
        <br />
        <el-button type="primary" @click="saveSetting()" style="margin-top: 20px;" :loading="createBlackWordsLoading" :disabled="shouldUpdate">保存设置</el-button>
    </div>
</template>

<script>
import request from '@/mixins/request.js'
import Api from '@/api/apis.js'
import isEqual from 'lodash/isEqual'
import common from '@/common/common.js'

export default {
  mixins: [request],
  components: {

  },
  mounted () {
  },
  activated () {
    this.getSetting()
  },
  data () {
    return {
      common,
      title_cut_off: true,
      title_ban_words: true,
      banner_completion: true,
      detail_img_cut: true,
      is_cut_sku_spec: true,
      is_cut_black_word: true,
      is_cut_image_black_word: true,
      is_banner_auto_5: true,
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
      typeList: ['default', 'success', 'info', 'warning', 'danger'],
      black_word_list: [],
      image_black_word_list: [],
      createBlackWordsLoading: false,
      originMigrateSetting: undefined,
      customerBlackWords: [],
      customerImageBlackWords: [],
      defaultBlackWords: [],
      defaultImageBlackWords: [],
      placeholder: `请输入自定义违规词，换行或空格分隔对个违规词\n商品轮播首图、详情尾图中含有该违规词，则自动去除该图片\n检测图片会影响抓取速度，若抓取抖音商品则不检测`,
      able_migrate_status_list: [
        common.productStatus.WAIT_ONLINE,
        common.productStatus.FAILED,
        common.productStatus.REJECT
      ]
    }
  },
  computed: {
    shouldUpdate () {
      const product = {
        ...this.originMigrateSetting,
        title_cut_off: Number(this.title_cut_off),
        title_ban_words: Number(this.title_ban_words),
        detail_img_cut: Number(this.detail_img_cut),
        is_cut_sku_spec: Number(this.is_cut_sku_spec),
        is_cut_black_word: Number(this.is_cut_black_word),
        is_cut_image_black_word: Number(this.is_cut_image_black_word),
        is_banner_auto_5: Number(this.is_banner_auto_5),
        banner_completion: Number(this.banner_completion),
        property_radio: this.property_radio,
        goods_code_prefix: this.goods_code_prefix,
        goods_code_suffix: this.goods_code_suffix,
        goods_code_type: Number(this.goods_code_type),
        goods_property: this.goods_property_options,
        able_migrate_status_list: this.able_migrate_status_list
      }
      const isEqualSetting = isEqual(this.originMigrateSetting, product)
      const blackWords = new Set(this.blackWords)
      const originBlackWords = new Set([...this.customerBlackWords, ...this.defaultBlackWords])
      const newBlackWords = [...blackWords].filter(item => !originBlackWords.has(item))
      const imageBlackWords = new Set(this.imageBlackWords)
      const originImageBlackWords = new Set([...this.customerImageBlackWords, ...this.defaultImageBlackWords])
      const newImageBlackWords = [...imageBlackWords].filter(item => !originImageBlackWords.has(item))
      return isEqualSetting && !newBlackWords.length && !newImageBlackWords.length
    }
  },
  methods: {
    updateMigrateSettingData (data) {
      let boolPropertys = [
        'is_cut_black_word',
        'is_cut_image_black_word',
        'is_banner_auto_5',
        'is_cut_sku_spec',
        'detail_img_cut'
      ]
      Object.keys(data).forEach(key => {
        this[key] = boolPropertys.includes(key) ? Boolean(data[key]) : data[key]
      })
    },
    async getSetting () {
      try {
        const [setting, blackWords, imgBlackWords] = await Promise.all([
          Api.hhgjAPIs.getMigrateSetting({}),
          Api.hhgjAPIs.getBlackWordList({}),
          Api.hhgjAPIs.getBlackWordList({use_type: 1})])
        this.originMigrateSetting = setting
        this.updateMigrateSettingData(setting)
        // 违规词
        this.blackWords = blackWords.customer
        this.customerBlackWords = blackWords.customer
        this.defaultBlackWords = blackWords.default
        // 违规图片
        this.imageBlackWords = imgBlackWords.customer
        this.customerImageBlackWords = imgBlackWords.customer
        this.defaultImageBlackWords = imgBlackWords.default
      } catch (error) {
        this.$message.error(`${error}`)
      }
    },
    async saveSetting () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '店铺设置', '点击', '保存设置'])
      }
      const product = {
        ...this.originMigrateSetting,
        title_cut_off: Number(this.title_cut_off),
        title_ban_words: Number(this.title_ban_words),
        detail_img_cut: Number(this.detail_img_cut),
        is_cut_sku_spec: Number(this.is_cut_sku_spec),
        is_cut_black_word: Number(this.is_cut_black_word),
        is_cut_image_black_word: Number(this.is_cut_image_black_word),
        is_banner_auto_5: Number(this.is_banner_auto_5),
        banner_completion: Number(this.banner_completion),
        property_radio: this.property_radio,
        goods_code_prefix: this.goods_code_prefix,
        goods_code_suffix: this.goods_code_suffix,
        goods_code_type: Number(this.goods_code_type),
        goods_property: this.goods_property_options,
        able_migrate_status_list: this.able_migrate_status_list
      }

      let productParams = {
        json: JSON.stringify(product)
      }

      const blackWords = new Set(this.blackWords)
      const originBlackWords = new Set([...this.customerBlackWords, ...this.defaultBlackWords])
      const params = [...blackWords].filter(item => !originBlackWords.has(item))
      const imageBlackWords = new Set(this.imageBlackWords)
      const originImageBlackWords = new Set([...this.customerImageBlackWords, ...this.defaultImageBlackWords])
      const imageParams = [...imageBlackWords].filter(item => !originImageBlackWords.has(item))
      this.createBlackWordsLoading = true
      try {
        const updateBlackWords = params.length
          ? Api.hhgjAPIs.createBlackWords({black_word_list: JSON.stringify(params)})
          : Promise.resolve([])
        const updateImageBlackWords = imageParams.length
          ? Api.hhgjAPIs.createBlackWords({black_word_list: JSON.stringify(imageParams), use_type: 1})
          : Promise.resolve([])

        const isEqualSetting = isEqual(this.originMigrateSetting, product)
        const updateSetting = !isEqualSetting
          ? Api.hhgjAPIs.updateMigrateSetting(productParams)
          : Promise.resolve(this.originMigrateSetting)
        await Promise.all([updateBlackWords, updateImageBlackWords, updateSetting])
        this.$message.success('保存成功')
        this.createBlackWordsLoading = false
        this.back_words = ''
        this.image_back_words = ''
        this.getSetting()
      } catch (error) {
        if (error) {
          console.error(error)
        }
        this.createBlackWordsLoading = false
        this.$message.error(`${error}`)
      }
    },
    formatBlackWords () {
      let value = this.back_words.split(/[\s\n]/)
      value = value.map(s => s.trim()).filter(s => s !== '')
      this.black_word_list = [...new Set(value)]
    },
    formatImageBlackWords () {
      let value = this.image_back_words.split(/[\s\n]/)
      value = value.map(s => s.trim()).filter(s => s !== '')
      this.image_black_word_list = [...new Set(value)]
    },
    async createBlackWords () {
      this.blackWords = [...new Set(this.blackWords.concat(this.black_word_list))]
      this.back_words = ''
    },
    async createImageBlackWords () {
      this.imageBlackWords = [...new Set(this.imageBlackWords.concat(this.image_black_word_list))]
      this.image_back_words = ''
    },
    async handleCloseWords (word) {
      this.wordsTagLoading = true
      try {
        await Api.hhgjAPIs.deleteBlackWords({
          word: word,
          use_type: 0
        })
        Api.hhgjAPIs.getBlackWordList({}).then(data => {
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
        Api.hhgjAPIs.getBlackWordList({use_type: 1}).then(data => {
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
    }
  }
}
</script>
<style lang="less" scoped>
    .migrateSetting {
      .el-tag {
        margin: 5px;
      }
      .info {
        margin-top:10px;
      }
      .title {
        font-size: 14px;
      }
      /deep/ .el-textarea{
        height: 100%;
        /deep/  .el-textarea__inner {
          min-height: 100% !important;
          box-sizing: border-box;
          padding-bottom: 20px;
        }
      }
    }

    /deep/ .el-checkbox {
        color: #606266;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
        user-select: none;
        margin-right: 5px;
    }
    /deep/ .el-checkbox__label {
        display: inline-block;
        /* padding-left: 10px; */
        line-height: 19px;
        font-size: 12px;
        padding-left: 2px;
        color:#999999;

    }

    .migrateProductsFilter {
      /deep/ .el-form-item__content{
        display: flex;
        font-size: 12px;
      }
    }

</style>

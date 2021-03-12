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
            <div style="width:55%;border: 1px solid #DCDFE6;border-radius: 4px;margin-left:10px" v-loading="tagLoading">
                <el-tag v-for="(tag,index) in defaultBlackWords" :disable-transitions="true" :key="tag"  :type="typeList[index%5]" >
                    {{tag}}
                </el-tag>
                <el-tag v-for="(tag,index) in blackWords" :disable-transitions="true" :key="tag" closable :type="typeList[index%5]" @close="handleClose(tag)">
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
import apis from '@/api/apis.js'
import isEqual from 'lodash/isEqual'

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
      title_cut_off: true,
      title_ban_words: true,
      banner_completion: true,
      detail_img_cut: true,
      is_cut_sku_spec: true,
      is_cut_black_word: true,
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
      auto_delete: '',
      tagLoading: false,
      typeList: ['default', 'success', 'info', 'warning', 'danger'],
      black_word_list: [],
      createBlackWordsLoading: false,
      originMigrateSetting: undefined,
      customerBlackWords: [],
      defaultBlackWords: []
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
        is_banner_auto_5: Number(this.is_banner_auto_5),
        banner_completion: Number(this.banner_completion),
        property_radio: this.property_radio,
        goods_code_prefix: this.goods_code_prefix,
        goods_code_suffix: this.goods_code_suffix,
        goods_code_type: Number(this.goods_code_type),
        goods_property: this.goods_property_options
      }
      const isEqualSetting = isEqual(this.originMigrateSetting, product)
      const blackWords = new Set(this.blackWords)
      const originBlackWords = new Set([...this.customerBlackWords, ...this.defaultBlackWords])
      const newBlackWords = [...blackWords].filter(item => !originBlackWords.has(item))
      return isEqualSetting && !newBlackWords.length
    }
  },
  methods: {
    updateMigrateSettingData (data) {
      let boolPropertys = [
        'title_cut_off', 'title_ban_words',
        'banner_completion', 'detail_img_cut', 'is_cut_sku_spec', 'is_cut_black_word', 'is_banner_auto_5'
      ]
      for (let key in boolPropertys) {
        if (data.hasOwnProperty(boolPropertys[key])) {
          this[boolPropertys[key]] = Boolean(data[boolPropertys[key]])
        }
      }
      let strPropertys = [
        'property_radio', 'goods_code_prefix', 'goods_code_suffix', 'goods_code_type'
      ]
      for (let key in strPropertys) {
        if (data.hasOwnProperty(strPropertys[key])) {
          this[strPropertys[key]] = data[strPropertys[key]]
        }
      }
      if (data.hasOwnProperty('goods_property')) {
        this.goods_property_options = []
        this.goods_property_options_dic = {}
        this.goods_property_list = []
        for (let i in data['goods_property']) {
          let item = {
            'val': data['goods_property'][i]['val'],
            'desc': data['goods_property'][i]['desc'],
            'key': data['goods_property'][i]['key']
          }
          this.goods_property_options.push(item)
          this.goods_property_options_dic[data['goods_property'][i]['key']] = item
          if (data['goods_property'][i]['val'] !== '') {
            this.goods_property_list.push({
              'key': data['goods_property'][i]['key'],
              'val': data['goods_property'][i]['val'],
              'desc': data['goods_property'][i]['desc']
            })
          }
        }
      }
    },
    getSetting () {
      apis.hhgjAPIs.getMigrateSetting({}).then(data => {
        this.originMigrateSetting = data
        this.updateMigrateSettingData(data)
      })
      this.getBlackWords()
      // this.request('getMigrateSetting', {}, data => {
      //   this.updateMigrateSettingData(data)
      // })
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
        is_banner_auto_5: Number(this.is_banner_auto_5),
        banner_completion: Number(this.banner_completion),
        property_radio: this.property_radio,
        goods_code_prefix: this.goods_code_prefix,
        goods_code_suffix: this.goods_code_suffix,
        goods_code_type: Number(this.goods_code_type),
        goods_property: this.goods_property_options
      }
      let productParams = {
        json: JSON.stringify(product)
      }

      const blackWords = new Set(this.blackWords)
      const originBlackWords = new Set([...this.customerBlackWords, ...this.defaultBlackWords])
      const params = [...blackWords].filter(item => !originBlackWords.has(item))
      this.createBlackWordsLoading = true
      try {
        const updateBlackWords = params.length
          ? apis.hhgjAPIs.createBlackWords({black_word_list: JSON.stringify(params)})
          : Promise.resolve([])
        const isEqualSetting = isEqual(this.originMigrateSetting, product)
        const updateSetting = !isEqualSetting
          ? apis.hhgjAPIs.updateMigrateSetting(productParams)
          : Promise.resolve(this.originMigrateSetting)
        await Promise.all([updateBlackWords, updateSetting])
        this.$message.success('保存成功')
        this.createBlackWordsLoading = false
        this.back_words = ''
        this.getSetting()
      } catch (error) {
        if (error) {
          console.error(error)
        }
        this.createBlackWordsLoading = false
        this.$message.error(`${error}`)
      }
    },
    onChangePropertySelect () {
      if (this.goods_property_selected !== '') {
        this.goods_property_value = this.goods_property_options_dic[this.goods_property_selected]['val']
      }
    },
    onChangePropertyInput () {
      for (let i in this.goods_property_options) {
        if (this.goods_property_options[i]['key'] === this.goods_property_selected) {
          this.goods_property_options[i]['val'] = this.goods_property_value
        }
      }
    },
    updateGoodsProperty () {
      let idx = -1
      let exist = false
      for (let i in this.goods_property_list) {
        if (this.goods_property_list[i]['key'] === this.goods_property_selected) {
          exist = true
          if (this.goods_property_value === '') {
            idx = i
          } else {
            this.goods_property_list[i]['val'] = this.goods_property_value
          }
        }
      }
      if (idx !== -1) {
        this.goods_property_list.splice(idx, 1)
      }
      if (exist === false) {
        this.goods_property_list.push(this.goods_property_options_dic[this.goods_property_selected])
      }
    },
    onCloseGoodsProperty (item, idx) {
      for (let i in this.goods_property_options) {
        if (this.goods_property_options[i]['key'] === item['key']) {
          this.goods_property_options[i]['val'] = ''
        }
      }
      this.goods_property_list.splice(idx, 1)
    },
    formatBlackWords () {
      let value = this.back_words.split(/[\s\n]/)
      value = value.map(s => s.trim()).filter(s => s !== '')
      this.black_word_list = [...new Set(value)]
    },
    getBlackWords () {
      apis.hhgjAPIs.getBlackWordList({}).then(data => {
        this.blackWords = data.customer
        this.customerBlackWords = data.customer
        this.defaultBlackWords = data.default
      })
    },
    async createBlackWords () {
      this.blackWords = [...new Set(this.blackWords.concat(this.black_word_list))]
      this.back_words = ''
    },
    async handleClose (word) {
      console.log(word)
      console.log(this.$loading)
      this.tagLoading = true

      try {
        await apis.hhgjAPIs.deleteBlackWords({
          word
        })
        this.getBlackWords()
      } catch (error) {
        if (error) {
          console.error(error)
        }
        this.$message.error(`${error}`)
      }
      this.tagLoading = false
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/base.less';
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

</style>

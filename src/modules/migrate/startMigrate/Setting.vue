<!-- 搬家前的设置 -->
<template>
    <div>
        <el-form :inline="true" :model="model" class="start-migrate-setting  flex justify-b" size="medium">
          <el-form-item label="复制后的品牌">
                <el-select v-model="model.default_brand_id" placeholder="默认无品牌设置" style="width:230px;margin-right:12px" clearable @clear="clear">
                    <el-option label="默认无品牌" :value="0"></el-option>
                    <el-option v-for="item in brandList" :key="item.id" :label="getBrandName(item)" :value="item.id" />
                </el-select>
                <el-button type="text" @click="loadData" :loading="loadingBrandList" size="small">
                    <hh-icon type="iconjiazai" style="font-size:10px;margin-right:3px" v-if="!loadingBrandList"/><span>{{!loadingBrandList ? '刷新':'加载中'}}</span>
                </el-button>
            </el-form-item>
            <el-form-item label="复制后的类目" style="max-width:379px">
                <div>
                  <el-button size="mini" v-if="model.default_category &&  !model.default_category.name" @click="chooseCategory" type="text">点击选择类目</el-button>
                <div class="flex align-c" style="height:36px" v-if="model.default_category && model.default_category.name">
                    <el-tooltip :content="model.default_category && model.default_category.name" :disabled="model.default_category.name && model.default_category.name.length < 18">
                        <el-button  size="mini" type="text" @click="chooseCategory" class="brand">{{model.default_category && model.default_category.name}}</el-button>
                    </el-tooltip>
                    <el-button size="mini"  @click="removeCategory" type="text" class="ml-5">删除</el-button>
                </div>
                </div>
            </el-form-item>
            <el-form-item label="仅保留5张轮播图">
                <el-radio-group v-model="model.is_banner_auto_5">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-button type="text" @click="moreSetting" size="small"  style="margin-right:4px"><i class="el-icon-s-tools" style="margin-right:3px"></i>更多设置</el-button>
        </el-form>
        <el-dialog class="dialog-tight" title="选择复制后的类目" width="800px" center :visible.sync="visvileCategory" v-hh-modal>
            <categorySelectView ref="categorySelectView" @changeCate="onChangeCate" />
        </el-dialog>
    </div>
</template>

<script>
import categorySelectView from '@/components/CategorySelectView'
import Api from '@/api/apis'
import isEqual from 'lodash/isEqual'

export default {
  name: 'setting',
  props: {
    msg: String
  },
  components: {
    categorySelectView
  },
  data () {
    return {
      brandList: [],
      loadingBrandList: false,
      visvileCategory: false,
      props: { multiple: true },
      options: [{
        value: 1,
        label: '全选',
        children: []
      }],
      model: {
        default_brand_id: 0,
        default_category: {},
        is_banner_auto_5: false
      }
    }
  },
  async activated () {
    await this.loadData()
    this.getMigrateSetting()
  },
  methods: {
    async getMigrateSetting () {
      try {
        this.$emit('loading', true)
        const setting = await Api.hhgjAPIs.getMigrateSetting()
        this.$emit('loading', false)
        if (typeof setting.is_banner_auto_5 !== 'undefined') {
          this.model.is_banner_auto_5 = setting.is_banner_auto_5
        }
        if (setting.default_brand_id) {
          this.model.default_brand_id = setting.default_brand_id
        }
        if (setting.default_category_id && setting.default_category) {
          setting.default_category.name = setting.default_category.levels.map(item => item.name).join(' > ')
          setting.default_category.id = setting.default_category_id
          this.model.default_category_id = setting.default_category.id
        }
        if (setting.default_category) {
          this.model.default_category = setting.default_category
        }
        this.originSetting = setting
      } catch (err) {
        this.$message.error(`${err}`)
      }
    },
    async updateMigrateSetting () {
      try {
        const params = {...this.originSetting, ...this.model}
        if (!this.model.default_category) {
          delete params.default_category
        } else {
          params.default_category_id = params.default_category.id
        }
        if (!isEqual(params, this.originSetting)) {
          await Api.hhgjAPIs.updateMigrateSetting({json: JSON.stringify(params)})
          return 'update'
        } else {
          return 'equal'
        }
      } catch (err) {
        this.$message.error(`搬家设置更新失败，失败原因：${err}`)
        return 'error'
      }
    },
    clear () {
      this.model.default_brand_id = 0
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
    },
    onChangeCate (category) {
      if (!category || (category && !category.id)) {
        return this.$message.error('请选择分类')
      }
      this.visvileCategory = false
      this.model.default_category = category
    },
    chooseCategory () {
      this.visvileCategory = true
    },
    removeCategory () {
      this.model.default_category = {}
    },
    moreSetting () {
      this.$router.push({
        name: 'MigrateSetting'
      })
    }
  }
}
</script>
<style lang="less" scoped>
    .start-migrate-setting {
        text-align: left;
        .ml-5 {
            margin-left: 5px;
        }
        /deep/ .el-form-item {
            margin-bottom: 0;
        }

        .brand {
            max-width: 222px;
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .el-radio {
          margin-right: 10px;
        }
    }

</style>

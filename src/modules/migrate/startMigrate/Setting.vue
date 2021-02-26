<!-- 搬家前的设置 -->
<template>
    <div>
        <el-form :inline="true" :model="model" class="start-migrate-setting" size="medium">
          <el-form-item label="复制后的品牌">
                <el-select v-model="model.brandId" placeholder="默认无品牌设置" style="width:200px;margin-right:5px">
                    <el-option label="默认无品牌" value="shanghai"></el-option>
                    <el-option v-for="item in brandList" :key="item.id" :label="item.brand_chinese_name" :value="item.id" />
                </el-select>
                <el-button type="text" @click="loadData" :loading="loadingBrandList" size="small">
                    <hh-icon type="iconjiazai" style="font-size:10px;margin-right:3px" v-if="!loadingBrandList"/>刷新</el-button>
            </el-form-item>
            <el-form-item label="复制后的类目:" style="max-width:374px">
                <el-button size="mini" v-if="!category" @click="chooseCategory" type="text">选择类目</el-button>
                <div class="flex align-c" style="height:36px" v-if="category">
                    <el-tooltip :content="category && category.name" :disabled="category.name.length < 20">
                        <el-button  size="mini" type="text" @click="chooseCategory" class="brand">{{category && category.name}}</el-button>
                    </el-tooltip>
                    <el-button size="mini"  @click="removeCategory" type="text" class="ml-5">删除</el-button>
                </div>
            </el-form-item>
            <el-form-item label="仅保留5张轮播图">
                <el-radio-group v-model="model.radio">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="text" @click="moreSetting" size="small" ><i class="el-icon-s-tools"
                    style="margin-right:3px"></i>更多设置</el-button>
            </el-form-item>
        </el-form>
        <el-dialog class="dialog-tight" title="选择复制后的类目" width="800px" center :visible.sync="visvileCategory" v-hh-modal
            >
            <categorySelectView ref="categorySelectView" @changeCate="onChangeCate" />

        </el-dialog>
    </div>
</template>

<script>
import categorySelectView from '@/components/CategorySelectView'
import Api from '@/api/apis'

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
      category: undefined,
      props: { multiple: true },
      options: [{
        value: 1,
        label: '全选',
        children: [{
          value: 2,
          label: '上海'
        }, {
          value: 7,
          label: '江苏'
        }, {
          value: 12,
          label: '浙江'
        }]
      }],
      model: {
        brandId: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        radio: 1
      }
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      this.loadingBrandList = true
      Api.hhgjAPIs.getShopBrandList().then(data => {
        this.brandList = data
        if (data.length) {
          this.value = data[0].id
        }
        this.loadingBrandList = false
      })
    },
    onChangeCate (category) {
      console.log(category)
      if (!category || (category && !category.id)) {
        return this.$message.error('请选择分类')
      }
      this.visvileCategory = false
      this.category = category
    },
    chooseCategory () {
      this.visvileCategory = true
    },
    removeCategory () {
      this.category = undefined
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

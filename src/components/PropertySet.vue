<!-- PropertySet 商品属性设置 -->
<template>
    <el-form :model="model" :rules="rules" ref="propertySet" class="demo-ruleForm">
        <el-form-item
            v-for="(item,index) in attribute_json || []"
            :error="item.required && item.value === ''"
            :key="index"
            :label="item.name"
            :prop="item.name"
            :required="item.required"
            :inline-message="true"
            label-width="84px"
            label-style="font-size:12px">
             <el-select
                size="small"
                :style="{width: item.name !== '品牌' ? '220px' : '180px'}"
                :placeholder="`请选择${item.name}`"
                v-model="model[item.name]"
                v-if="item.options.length && item.name !== '品牌'"
                :default-first-option="true">
                <el-option
                    v-for="option in item.options"
                    :key="option.value"
                    :label="option.name"
                    :value="option.value">
                </el-option>
            </el-select>
            <!-- 除去品牌 属性可选值列表，为空时需要手动填写 -->
            <el-input
                size="small"
                style="width:220px"
                :placeholder="`请输入${item.name}`"
                v-model="model[item.name]"
                v-else
              />
            <span v-if="item.name === '品牌'">
                <el-button type="text" @click="reloadBrandList"><i class="el-icon-refresh"></i></el-button>
                <el-link
                    type="primary"
                    target="_blank"
                    :underline="false"
                    :href="`https://fxg.jinritemai.com/index.html#/ffa/goods/qualification/edit?type=2&cid=${catId}`">
                    添加品牌
                </el-link>
            </span>
        </el-form-item>
        <div class="tip">
          <span >(带 <span style="color: red">*</span> 为必填属性</span>
            <!-- 二期会实现本功能 -->
            <!-- <span v-if="catId!==0">，勾选应用到本页相同分类商品，蓝色高亮</span> -->
          <span>)</span>
        </div>
    </el-form >
</template>

<script>
import request from '@/mixins/request.js'

export default {
  name: 'property-set',
  mixins: [request],
  props: {
    attribute_json: {
      type: Array
    },
    catId: {
      type: Number | String,
      default: -1
    },
    ref: {
      type: String
    }
  },
  data () {
    return {
      model: {}
    }
  },
  computed: {
    rules () {
      return (this.attribute_json || []).reduce((target, item) => {
        const current = {[item.name]: [{required: !!item.required, message: `请选择${item.name}`, trigger: 'change'}]}
        return {...target, ...current}
      }, {})
    }
  },
  watch: {
    attribute_json: {
      handler (n, o) {
        this.model = {}
        const result = n.reduce((target, current) => {
          return {...target, [current.name]: current.tp_value}
        }, {})
        this.model = result
      },
      deep: true
    },
    model: {
      handler (newVal, o) {
        const newAttributeJson = (this.attribute_json || [])
          .filter(item => newVal[item.name])
          .map(item => {
            const tpValue = newVal[item.name]
            return {...item, tp_value: tpValue}
          })
        if (Object.values(newAttributeJson).some(item => item)) this.$emit('change', newAttributeJson)
      },
      deep: true
    }
  },
  methods: {
    reloadBrandList () {
      this.request('getShopBrandList', {}, data => {
        this.shopBrandList = data
      })
    },
    // 验证
    validate () {
      return new Promise((resolve) => {
        this.$refs.propertySet.validate((valid) => {
          if (valid) {
            resolve(true)
          } else {
            return false
          }
        })
      })
    },
    // 重置
    resetForm () {
      this.$refs.propertySet.resetFields()
    },
    clear () {
      this.data = {}
    }
  }
}
</script>
<style lang="less" scoped>
.tip{
  color: rgb(153, 153, 153);
}
/deep/ .el-input__inner{
  text-align: left !important;
  padding-left: 10px !important;
}
</style>

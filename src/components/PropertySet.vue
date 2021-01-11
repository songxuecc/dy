<!-- PropertySet 商品属性设置 -->
<template>
    <el-form :model="model" :rules="rules" ref="propertySet" >
        <el-form-item
            v-for="(item,index) in productModel"
            :key="index"
            :label="item.name"
            :prop="item.name"
            :error="item.required && item.value === ''"
            :show-message="item.name !== '品牌'"
            :inline-message="true"
            label-width="84px"
            label-style="font-size:12px">
             <el-select
                clearable
                @clear="handleClear(item.name)"
                @change="handleChange($event,item.name)"
                size="small"
                :style="{width: item.name !== '品牌' ? '220px' : '180px'}"
                :placeholder="`请选择${item.name}`"
                v-model="model[item.name]"
                v-if="item.options.length || item.name === '品牌'"
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
                clearable
                @clear="handleClear(item.name)"
                @change="handleChange($event,item.name)"
                size="small"
                style="width:220px"
                :placeholder="`请输入${item.name}`"
                v-model="model[item.name]"
                v-else
              />
            <slot name="error" v-if="item.name == '品牌' && validation['品牌']">
                <div >
                    <p style="color:red;font-size:12px">当前商品所选类目根据官方要求必须填写品牌。</p>
                    <p style="color:red;font-size:12px">查询哪些类目需要填写品牌 <a href="https://school.jinritemai.com/doudian/web/article/101810" style="color:red;font-size:12px;cursor: pointer">请点击我</a> </p>
                </div>
            </slot>
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
    catId: {
      type: Number | String,
      default: -1
    },
    ref: {
      type: String
    },
    productModel: {
      type: Object
    }
  },
  data () {
    return {
      model: {},
      validation: {}
    }
  },
  computed: {
    rules () {
      return (this.productModel || []).reduce((target, item) => {
        let message = item.options.length ? `请选择${item.name}` : `请输入${item.name}`
        if (item.name === '品牌') message = ''
        const current = {[item.name]: [{required: !!item.required, message, trigger: 'change'}]}
        return {...target, ...current}
      }, {})
    }
  },
  watch: {
    productModel: {
      handler (newVal, o) {
        this.resetForm()
        // 移除表单项的校验结果
        const result = (newVal || []).reduce((target, current) => {
          return {...target, [current.name]: current.tp_value}
        }, {})
        this.model = result
      },
      deep: true
    }
  },
  methods: {
    // 重置 品牌列表
    reloadBrandList () {
      this.request('getShopBrandList', {}, data => {
        this.shopBrandList = data
      })
    },
    // 验证
    validate () {
      return new Promise((resolve, reject) => {
        this.$refs.propertySet.validate((valid, object) => {
          if (valid) {
            resolve(true)
          } else {
            this.$message.error(`${Object.keys(object).join('、')} 输入错误`)
            this.validation = object
            reject(object)
          }
        })
      })
    },
    // 清除数据
    clearData () {
      this.data = {}
    },
    // 重置
    resetForm () {
      this.$refs.propertySet.resetFields()
      this.$refs.propertySet.clearValidate()
      this.validation = {}
    },
    // 清空
    handleClear (name) {
      delete this.model[name]
    },
    handleChange (value, name) {
      const newModal = Object.assign(this.model, {[name]: value})
      const newAttributeJson = (this.productModel || [])
        .map(item => {
          const tpValue = newModal[item.name] || ''
          return {...item, tp_value: tpValue}
        })
      this.$emit('change', newAttributeJson)
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

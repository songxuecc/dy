<!-- PropertySet 商品属性设置 -->
<template>
    <el-form :model="model" ref="propertySet" v-if="productModel && productModel.length">
        <el-form-item
            v-for="(item,index) in productModel"
            :key="index"
            :prop="item.name"
            :error="item.required && item.value === ''"
            :show-message="item.name !== '品牌'"
            :inline-message="true"
            label-style="font-size:12px">
            <div style="diplay:flex">
             <span slot="label" style="width:120px;display:inline-block;text-align:right;padding-right:4px">
               {{item.name}}
               <i v-if="item.required && item.name === '品牌'" class="el-icon-warning-outline" style="color:#f56c6c"></i>
               <i v-if="item.required && item.name !== '品牌'" class="el-icon-warning-outline" style="color:#e6a23c"></i>
              </span>
             <el-select
                clearable
                @clear="handleClear(item.name)"
                @change="handleChange($event,item.name)"
                size="small"
                :style="{width: item.name !== '品牌' ? '300px' : '190px'}"
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
                style="width:300px;"
                :placeholder="`请输入${item.name}`"
                v-model="model[item.name]"
                v-else
              />
            <span v-if="item.name === '品牌'" style="">
                <el-button type="text" @click="reloadBrandList"><i class="el-icon-refresh"></i>刷新</el-button>
                <el-button type="text" @click="open(catId)"> 添加品牌 </el-button>
                <el-checkbox
                  border
                  :value="selected && selected[item.name]? selected[item.name]: false"
                  @change="applyPropertiesToSelection($event,item.name)"
                  size="small"
                  class="batch" >
                  批量修改同分类商品
                </el-checkbox>
            </span>
            <el-checkbox
              v-if="item.name !== '品牌'"
              border
              @change="applyPropertiesToSelection($event,item.name)"
              :value="selected && selected[item.name]? selected[item.name] : false"
              size="small"
              class="batch">
              批量修改同分类商品
            </el-checkbox>
            <slot name="error" v-if="item.name == '品牌' && validation['品牌']">
                <div >
                    <p style="color:red;font-size:12px">当前商品所选类目根据官方要求必须填写品牌。</p>
                    <p style="color:red;font-size:12px">查询哪些类目需要填写品牌 <a href="https://school.jinritemai.com/doudian/web/article/101810" style="color:red;font-size:12px;cursor: pointer">请点击我</a> </p>
                </div>
            </slot>
            </div>

        </el-form-item>
        <div class="tip">
          <p >1、带<span style="color:#f56c6c">红色感叹号</span> 为必填属性，不填写会导致<span style="color:#f56c6c">商品上传失败</span></p>
          <p >2、带<span style="color:#e6a23c">黄色感叹号</span> 为抖音官方后台必填属性，在本软件内<span style="color:#e6a23c">可不填写</span></p>
            <!-- 二期会实现本功能 -->
            <!-- <span v-if="catId!==0">，勾选应用到本页相同分类商品，蓝色高亮</span> -->
        </div>
    </el-form >
    <div v-else style="color:#e6a23c">请选择商品分类 填写抖音属性</div>
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
    },
    propertyBatchMapSelect: {
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
    },
    listenChange () {
      const {productModel, propertyBatchMapSelect, catId} = this
      return {productModel, propertyBatchMapSelect, catId}
    }
  },
  watch: {
    listenChange: {
      handler (newVal, o) {
        const {productModel, propertyBatchMapSelect, catId} = newVal
        const model = (productModel || []).reduce((target, current) => {
          const key = current.name
          let value = current.tp_value
          // 如果有全选到应用
          if (propertyBatchMapSelect && propertyBatchMapSelect[key] && propertyBatchMapSelect[key].checked) {
            const checkCatId = propertyBatchMapSelect[key].catId
            if (checkCatId === catId) {
              value = propertyBatchMapSelect[key].propertyValue
            }
          }
          return {...target, [key]: value}
        }, {})
        this.model = model
        if (propertyBatchMapSelect && Object.keys(propertyBatchMapSelect).length) {
          const selected = Object.keys(propertyBatchMapSelect).reduce((target, key) => {
            if (!propertyBatchMapSelect[key]) return target
            const checked = propertyBatchMapSelect[key].checked
            const checkCatId = propertyBatchMapSelect[key].catId
            if (checkCatId === catId) {
              return {...target, [key]: checked}
            } else {
              return target
            }
          }, {})
          this.selected = {...selected}
        } else {
          this.selected = {}
        }
      },
      deep: true
    }
  },
  methods: {
    // 重置 品牌列表
    reloadBrandList () {
      this.$emit('reloadBrandList')
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
      if (this.$refs && this.$refs.propertySet) {
        this.$refs.propertySet.resetFields()
        this.$refs.propertySet.clearValidate()
      }
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
      this.$emit('applyPropertiesToSelection', false, name, '')
    },
    applyPropertiesToSelection (value, name) {
      const propertyValue = this.model[name]
      this.$emit('applyPropertiesToSelection', value, name, propertyValue)
    },
    open (catId) {
      window.open(`https://fxg.jinritemai.com/index.html#/ffa/goods/qualification/edit?type=2&cid=${catId}`)
    }
  }
}
</script>
<style lang="less" scoped>
.tip{
  color: rgb(153, 153, 153);
  margin-top: 10px;
}
/deep/ .el-input__inner{
  text-align: left !important;
  padding-left: 10px !important;
}
/deep/ .el-button+.el-button {
  margin-left: 0px !important;
}
/deep/ .el-form-item__content{
  display:flex;
  align-items:center;
}
.batch {
  margin-left: 4px;
}

</style>

<!-- PropertySet 商品属性设置 -->
<template>
    <el-form :model="model" ref="propertySet" v-if="productModel && productModel.length" :rules="rules">
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
               <i v-if="item.required && item.name === '品牌'"  style="color:#E02020">*</i>
               <i v-if="item.required && item.name !== '品牌'"  style="color:#E02020">*</i>
               {{item.name}}
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
                    v-for="(option,index) in item.options"
                    :key="index"
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
            <span>
              <span v-if="item.name === '品牌'" style="">
                  <el-button type="text" @click="reloadBrandList" ><hh-icon type="iconjiazai" style="font-size:12px;"/>刷新</el-button>
                  <el-button type="text" @click="open(catId)"> 添加品牌 </el-button>
                  <el-checkbox
                    border
                    :value="!!selected[item.name]"
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
                :value="!!selected[item.name]"
                size="small"
                class="batch">
                批量修改同分类商品
              </el-checkbox>
              <NewComer type="批量修改同分类商品" ref="newComer" v-if="index === 0"
              :style="{top:'-14px',left:'48%'}">
                <div style="line-height:16px">
                  <div style="width:172px" class="color-666 font-12 left">
                    勾选此处可以批量修改同分类商品的属性哦 ～
                  </div>
                  <div @click="closeNewComer" class="right pointer underline primary">好的</div>
                </div>
              </NewComer>
            </span>
            <slot name="error" v-if="item.name == '品牌' && validation['品牌']">
                <div >
                    <p style="color:red;font-size:12px">当前商品所选类目根据官方要求必须填写品牌。</p>
                    <p style="color:red;font-size:12px">查询哪些类目需要填写品牌 <a href="https://school.jinritemai.com/doudian/web/article/101810" style="color:red;font-size:12px;cursor: pointer">请点击我</a> </p>
                </div>
            </slot>
            </div>

        </el-form-item>
        <div class="tip">
          <p >带<span style="color:#f56c6c">红色 &nbsp;*&nbsp;符号</span> 为必填属性，所有属性都不可以输入{{'I,^,&,@'}}字符。不填写会导致<span style="color:#f56c6c">商品上传失败</span></p>
            <!-- 二期会实现本功能 -->
            <!-- <span v-if="catId!==0">，勾选应用到本页相同分类商品，蓝色高亮</span> -->
        </div>
    </el-form >
    <div v-else style="color:#e6a23c">请选择商品分类 填写抖音属性</div>
</template>

<script>

export default {
  name: 'property-set',
  components: {
  },
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
    },
    forceUpdateKey: {
      type: Number
    }
  },
  data () {
    return {
      model: {},
      validation: {},
      selected: {}
    }
  },
  computed: {
    rules () {
      const validatePass = name => (rule, value, callback) => {
        const patrn = /&|@|\^|\|/
        if (patrn.test(value)) {
          callback(new Error(`${name}: 不可以输入特殊字符`))
        } else {
          callback()
        }
      }

      return (this.productModel || []).reduce((target, item) => {
        let message = item.options.length ? `请选择${item.name}` : `请输入${item.name}`
        if (item.name === '品牌') message = ''
        const current = {[item.name]: [
          {required: !!item.required, message, trigger: 'change'},
          { validator: validatePass(item.name), trigger: 'blur' }
        ]}
        return {...target, ...current}
      }, {})
    },
    listenChange () {
      const {productModel, propertyBatchMapSelect, catId, forceUpdateKey} = this
      return {productModel, propertyBatchMapSelect, catId, forceUpdateKey}
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
        if (!this.$refs.propertySet) {
          const msg = '请选择商品属性-修改分类'
          return reject(msg)
        } else {
          this.$refs.propertySet.validate((valid, object) => {
            if (valid) {
              resolve(true)
            } else {
              const error = `${Object.keys(object).join('、')} 输入错误`
              this.validation = object
              reject(error)
            }
          })
        }
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
      this.closeNewComer()
      const propertyValue = this.model[name]
      this.$emit('applyPropertiesToSelection', value, name, propertyValue)
    },
    open (catId) {
      window.open(`https://fxg.jinritemai.com/index.html#/ffa/goods/qualification/edit?type=2&cid=${catId}`)
    },
    closeNewComer () {
      const ref = this.$refs.newComer
      ref[0] && ref[0].close && ref[0].close()
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
  margin-bottom: 10px;
}
/deep/ .el-form-item__error--inline {

    position: absolute;
    left: 130px;
    bottom: -10px;

}
.batch {
  margin-left: 4px;
}

</style>

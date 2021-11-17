<!-- 属性设置表单 -->
<template>
  <div class="properties">
    <div style="color: #000; ">
      <span style="margin-right: 10px">当前类目:</span>
      <span style="font-weight: bold">{{ category.name }}</span>
      <span class="font-14 ml-10 mt-5 mb-5 warning">(带<span class=" ml-10 mr-5 color-danger">*</span>为抖音必填属性, 不填写默认不修改,不可以输入{{'|,^,&,@'}}字符)</span>
    </div>

    <div class="flex mt-10">
      <span style="flex-shrink: 0; margin-right: 10px">类目属性:</span>
      <el-form
        :show-message="false"
        ref="form"
        :model="form"
        size="small"
        :inline="true"
        style="background-color: #f9f9f9; padding: 15px 10px; border-radius: 2px;width:100%"
        :rules="rules"
      >
        <el-form-item
          v-for="(property, idx) in properties"
          :key="idx"
          :style="{'margin-bottom':'5px', display: property.type==='multi_select'? 'block':'inline-block'}"
          :prop="`${property.id}`"
        >
          <span solt="label"><span style="display:inline-block;width:95px;text-align:right;padding-right:5px"><span v-if="property.required" class="fail">*</span>{{property.name}}</span></span>
          <el-input
            v-model="form[`${property.id}`]"
            style="width: 220px"
            v-if="property.type === 'text'"
            @clear="handleClear(property.id)"
            :clearable="true"
          ></el-input>
          <span v-else-if="property.type === 'select' && property.name === '品牌'" class="relative">
            <el-select
              filterable
              remote
              reserve-keyword
              v-model="form[`${property.id}`]"
              placeholder="请输入需要关联的品牌"
              style="width: 220px"
              popper-class="select-popper-properties"
              :clearable="true"
              :remote-method="(query) => remoteMethod(query,property,idx)"
              @clear="handleClear(property.id)"
              :loading="loading"
            >
              <el-option :label="option.name" :value="option.value" v-for="(option,idx) in property.options" :key="idx">
                  {{option.name}}
              </el-option>
              <div class="info ml-10">请输入关键词检索品牌</div>
            </el-select>
            <hh-icon type="iconsousuo1" class=" search info"></hh-icon>
            <span class="ml-10">
              <el-tooltip content="未搜到需要的品牌？点击申请" placement="top" >
                <el-button type="text" @click="open(category.id)" class="mr-10"> 添加品牌 </el-button>
              </el-tooltip>
            </span>
          </span>

          <el-select
            filterable
            v-model="form[`${property.id}`]"
            placeholder="请选择"
            style="width: 220px"
            v-else-if="property.type === 'select' && property.name !== '品牌'"
            popper-class="select-popper-properties"
            :clearable="true"
            @clear="handleClear(property.id)"
          >
            <el-option :label="option.name" :value="option.value" v-for="(option,idx) in property.options" :key="idx">
                {{option.name}}
            </el-option>
          </el-select>

          <el-checkbox-group
            v-model="form[`${property.id}`]"
            v-else-if="property.type === 'multi_select'"
            style="margin-top:7px"
          >
            <el-checkbox
              class="checkbox"
              :label="option.value"
              v-for="(option,idx) in property.options"
              :key="idx">
              <el-tooltip :content="option.name" class="item" effect="dark" placement="top-start" v-if="option.name.length > 6">
                    <span>{{option.name}}</span>
              </el-tooltip>
              <span v-else>{{option.name}}</span>
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

    </div>
    <div
      style="
        display: flex;
        justify-content: center;
        margin-top: 5px;
        margin-bottom: 5px;
      "
    >
      <el-button style="width:120px;margin:10px 10px 20px 0;" @click="cancel">取消</el-button>
      <el-button type="primary" style="width:120px;margin:10px 0 20px 0;" @click="close">应用</el-button>
    </div>
  </div>
</template>

<script>
import servises from '@servises'

export default {
  name: 'Properties',
  data () {
    return {
      form: {},
      originForm: {},
      properties: [],
      category: {},
      loading: false
    }
  },
  computed: {
    rules () {
      if (!this.properties.length) return {}
      const validatePass = name => (rule, value, callback) => {
        const patrn = /&|@|\^|\|/
        if (patrn.test(value)) {
          callback(new Error(`${name}: 不可以输入特殊字符I,^,&,@`))
        } else {
          callback()
        }
      }
      let obj = {}
      this.properties.forEach(item => {
        obj[`${item.id}`] = [{ validator: validatePass(item.name), trigger: 'blur' }]
      })
      return obj
    }
  },
  methods: {
    init (data, idx) {
      if (!data.properties.length || !data.category) return
      this.properties = data.properties
      this.category = data.category
      this.data = data
      this.idx = idx
      let originForm = {}
      this.properties.map(item => {
        let value = item.tp_value
        if (item.type === 'multi_select') {
          if (!Array.isArray(value)) {
            value = []
          }
        }

        originForm[`${item.id}`] = value
      })
      this.form = {...originForm}
      this.originForm = {...originForm}
      this.$refs.form && this.$refs.form.clearValidate()
    },
    close () {
      const isChange = Object.values(this.form).some(value => value)

      if (isChange) {
        this.$refs.form.validate((valid, object) => {
          if (valid) {
            for (const key in this.form) {
              this.data.properties = this.properties.map(property => {
                if (String(property.id) === String(key)) {
                  property.tp_value = this.form[key]
                }
                return property
              })
            }

            console.log(this.data, this.properties, this.idx, 'this.data')
            this.$emit('close', this.data, this.idx)
            this.$refs.form && this.$refs.form.clearValidate()
          } else {
            const h = this.$createElement
            const messages = Object.values(object).map(item => item[0].message).map(m => h('div', {
              style: {'text-align': 'left'}
            }, m))
            this.$message({
              message: h('p', null, messages),
              type: 'error'
            })
          }
        })
      } else {
        this.$message({
          message: '至少填写一个属性设置',
          type: 'warning'
        })
      }
    },
    cancel () {
      this.form = {}
      this.$emit('close', this.data, this.idx)
    },
    handleClear (id) {
      this.form[`${id}`] = ''
    },
    open (catId) {
      window.open(`https://fxg.jinritemai.com/index.html#/ffa/goods/qualification/edit?type=2&cid=${catId}`)
    },
    remoteMethod (query, item, index) {
      if (query) {
        this.loading = true
        servises.productCategoryBrandList({
          category_id: this.category.id,
          keyword: query
        }).then(data => {
          this.$set(item, 'options', data)
          this.loading = false
        })
      } else {
        this.options = []
      }
    }
  }
}
</script>
<style lang="less" scoped>
.properties {
  width: 750px;
}
/deep/ .el-select-dropdown__item {
      text-align: left;
      padding: 6px 8px 6px 12px;
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
      height:32px;
      width: 170px;
    }
    /deep/ .el-form-item__content{
      display: flex;
    }
    /deep/ .checkbox {
      width: 115px;
      margin-right: 10px;
      display: inline-flex;
      align-items: center;
      // overflow: hidden;
      // white-space: nowrap;
      // text-overflow: ellipsis;

      .el-checkbox__label {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 95px;
      }
    }

    .checkbox-form-item {
      /deep/ .el-form-item__content{

        line-height: 20px;
      }
    }
    .search {
      position: absolute;
      right:84px;
      top:10px;
    }
</style>
<style lang="less">
.select-popper-properties {
  .el-select-dropdown__item {
      text-align: left;
      padding: 6px 8px 6px 12px;
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
      height:32px;
    }
    .el-input__inner {
      padding: 0 4px;
    }
}
</style>

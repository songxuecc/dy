<!--  -->
<template>
  <div class="left" style="padding-left: 10px">
    <p class="title">创建计划</p>
    <el-divider></el-divider>

    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="计划名称" size="small" prop="task_title">
        <el-input
          v-model="form.task_title"
          style="width: 365px"
          maxlength="20"
          show-word-limit
          clearable
          @clear=" ()=> form.task_title = ''"
          placeholder="请输入计划名称"
        ></el-input>
      </el-form-item>

      <el-form-item label="计划类型">
        <el-radio-group v-model="form.sync_type">
          <el-radio :label="1">检测变化并提交修改</el-radio>
          <el-radio :label="2">仅检测变化，需人工提交修改</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="配置内容" >

        <!-- <el-form-item prop="config_json.is_sync_shelf">
          <el-checkbox
            v-model="form.config_json.is_sync_shelf"
            name="type"
            style="display: block"
            @change="validCheckContent"
          >
            同步上下架
          </el-checkbox>
        </el-form-item> -->

        <el-form-item prop="config_json.is_sync_stock">
          <el-checkbox
            v-model="form.config_json.is_sync_stock"
            name="type"
            style="display: block"
            @change="validCheckContent"
          >
            同步商品库存
          </el-checkbox>
        </el-form-item>

        <el-form-item style="margin-left: 15px" v-if="form.config_json.is_sync_stock">
          <el-radio-group v-model="form.config_json.step_stock_sync_type">
            <el-radio :label="1" style="display: block"
              >若是阶梯发货，按照搬家时的设置分配现货库</el-radio
            >
            <el-radio :label="2" style="display: block"
              >若是阶梯发货，重新设置分配现货库存和阶梯</el-radio
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item style="margin-left: 40px" v-if="form.config_json.step_stock_sync_type === 2" prop="config_json.current_stock_rate">
          <span class="font-12 color-4e">现货库存设置为原库存的</span>
          <el-input v-model="form.config_json.current_stock_rate" class="price-sku-input"></el-input>
          <span class="font-12 color-4e">%（原商品库存=现货库存+阶梯库存，
            <span class="warning">{{tip}}</span>
            ）</span>
        </el-form-item>

        <el-form-item prop="config_json.is_sync_price">
          <el-checkbox
            v-model="form.config_json.is_sync_price"
            name="type"
            style="display: block"
            @change="validCheckContent"
          >同步商品价格</el-checkbox>
        </el-form-item>

        <el-form-item style="margin-left: 15px" v-if="form.config_json.is_sync_price">
          <el-radio-group v-model="form.config_json.price_sync_type">
            <el-radio :label="1" style="display: block"
              >按照搬家时的设置调整价格</el-radio
            >
            <el-radio :label="2" style="display: block"
              >重新设置公式调整价格</el-radio
            >

            <div class="price price-text" v-if="form.config_json.price_sync_type === 2">
              <el-form-item style="display: inline-block">
                sku价格 = 原价 -
                <el-input
                  class="price-sku-input"
                  v-model="form.config_json.sku_price_diff"
                ></el-input>
                x
                <el-input
                  class="price-sku-input"
                  v-model="form.config_json.sku_price_rate"
                ></el-input>
                -
                <el-input
                  class="price-sku-input"
                  v-model="form.config_json.out_price_diff"
                ></el-input>
              </el-form-item>

              <el-form-item
                style="display: inline-block;"
                label="售卖价"
                class="mr-20 shoumaijia"
              >
                <el-radio-group v-model="form.config_json.is_max_discount_price">
                  <el-radio :label="0" style="width: 40px">最低价</el-radio>
                  <el-radio :label="1" style="width: 40px">最高价</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item style="display: inline-block" class="ml-20">
                划线价 = 原划线价 x
                <el-input
                  class="price-sku-input"
                  v-model="form.config_json.market_price_rate"
                ></el-input>
                -
                <el-input
                  class="price-sku-input"
                  v-model="form.config_json.market_price_diff"
                ></el-input>
              </el-form-item>
              <el-form-item style="display: inline-block">
                <span class="color-primary pointer" @click="toggleIsShowSample">
                  查看示例
                </span>
              </el-form-item>
            </div>
          </el-radio-group>
        </el-form-item>

        <el-form-item prop="config_json.is_sync_title">
          <el-checkbox
            label="同步商品标题"
            v-model="form.config_json.is_sync_title"
            name="type"
            style="display: block"
            @change="validCheckContent"
          ></el-checkbox>
        </el-form-item>

        <el-form-item style="margin-left: 30px" v-if="form.config_json.is_sync_title">
          <el-radio-group v-model="form.config_json.title_sync_type">
            <el-radio :label="1" style="display: block"
              >按照搬家时的设置调整标题</el-radio
            >
            <el-radio :label="2" style="display: block"
              >重新设置公式调整标题</el-radio
            >
          </el-radio-group>

          <div style="margin-left: 30px" v-if="form.config_json.title_sync_type === 2">
            <div>
              <el-form-item
                style="display: inline-block; width: 300px"
                size="small"
              >
                <el-input
                  clearable
                  @clear="handleClear('config_json.prefix')"
                  placeholder="前缀"
                  v-model="form.config_json.prefix"
                ></el-input>
              </el-form-item>

              <el-form-item
                label="原标题"
                style="display: inline-block; width: 300px"
                label-width="65px"
                class="ml-10"
                size="small"
              >
                <el-input
                  clearable
                  @clear="handleClear('config_json.suffix')"
                  placeholder="后缀"
                  v-model="form.config_json.suffix"
                ></el-input>
              </el-form-item>

              <el-form-item
                style="display: inline-block; width: 300px"
                class="ml-10"
                size="small"
              >
                <el-switch
                  v-model="form.config_json.is_open_ps"
                  active-color="#1D8FFF"
                  inactive-color="#E5E5E5">
                </el-switch>
              </el-form-item>

            </div>

            <div>
              <el-form-item
                style="display: inline-block; width: 300px"
                size="small"
              >
                <el-input
                  clearable
                  @clear="handleClear('config_json.source_str')"
                  v-model="form.config_json.source_str"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="替换为"
                style="display: inline-block; width: 300px"
                label-width="65px"
                class="ml-10"
                size="small"
              >
                <el-input
                  clearable
                  @clear="handleClear('config_json.target_str')"
                  v-model="form.config_json.target_str"
                ></el-input>
              </el-form-item>

              <el-form-item
                style="display: inline-block; width: 300px"
                class="ml-10"
                size="small"
              >
                <el-switch
                  v-model="form.config_json.is_open_replace"
                  active-color="#1D8FFF"
                  inactive-color="#E5E5E5">
                </el-switch>
              </el-form-item>

            </div>
            <el-form-item
              label="关键词删除"
              size="small"
              style="width: 613px; margin-top: 2px"
            >
              <el-input clearable v-model="form.config_json.delete_str" placeholder="多个字符用逗号隔开"></el-input>
            </el-form-item>

            <el-form-item label-width="95px" size="small">
              <span slot="label">超过30个字：</span>
              <el-radio-group v-model="form.config_json.title_cut_type">
                <el-radio :label="1" style="width: 100px">自动去末尾</el-radio>
                <el-radio :label="2" style="width: 100px">自动去开头</el-radio>
                <el-radio :label="3" style="width: 100px">不处理</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label-width="95px" size="small">
              <span slot="label">删除指定内容</span>
              <el-checkbox-group v-model="form.config_json.cut_type_list">
                <el-checkbox label="is_cut_alpha" style="width: 100px"
                  >删除英文</el-checkbox
                >
                <el-checkbox label="is_cut_digit" style="width: 100px"
                  >删除数字</el-checkbox
                >
                <el-checkbox label="is_cut_brackets"
                  >删除括号以及括号里的内容</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </div>
        </el-form-item>
      </el-form-item>
    </el-form>

    <el-dialog
      title="价格示例"
      :visible.sync="isShowSample"
      width="30%"
      :append-to-body="true"
    >
      <el-image
        src="https://sf1-ttcdn-tos.pstatp.com/obj/ecom-luban-cdn/shopfxg3/images/Z9gCP.png"
      >
        <div slot="placeholder" class="image-slot">
          <hh-icon type="iconwuzhaopian" style="font-size: 390px"></hh-icon>
          <div class="info mt-20">加载中...</div>
        </div>
      </el-image>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isShowSample = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <div class="center btn">
      <el-button @click="goback" plain type="primary" style="width: 120px"
        >取消</el-button
      >
      <el-button @click="go" type="primary" style="width: 140px" v-if="prevStep == 3 ||  !originForm"
        >下一步，添加商品</el-button
      >
      <el-button @click="updatePlan" type="primary" style="width: 140px" v-else :loading="loadingPost" :disabled="loadingPost"
        >确定修改模版</el-button
      >
    </div>
  </div>
</template>

<script>

import {mapMutations, mapActions, mapState} from 'vuex'
import utils from '@/common/utils'
import debounce from 'lodash/debounce'
import services from '@servises'
import moment from 'moment'

export default {
  name: 'CreateSyncPlan',
  props: {
    prevStep: Number
  },
  data () {
    const checkContent = (rule, value, callback) => {
      // !this.form.config_json.is_sync_shelf &&
      if (
        !this.form.config_json.is_sync_stock &&
        !this.form.config_json.is_sync_price &&
        !this.form.config_json.is_sync_title
      ) {
        return callback(new Error('至少选择一个配置内容'))
      }
      callback()
    }

    const validatePass = (rule, value, callback) => {
      if (this.form.config_json.step_stock_sync_type === 2) {
        if (!utils.isNumber(value) || (utils.isNumber(value) && value % 1) || (utils.isNumber(value) && value < 51)) {
          console.log(value, 'value')
          callback(new Error('必须大于等于51, 小于等于100，且为整数'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    return {
      isShowSample: false,
      loadingPost: false,
      tip: '51% <= 现货库存设置 <= 100%',
      form: {
        task_title: `商品源同步计划${moment().format('YYYY-MM-DD')}`,
        content: [],
        sync_type: 1,
        config_json: {
          cut_type_list: ['is_cut_brackets'],
          title_sync_type: 1,
          is_sync_stock: true,
          step_stock_sync_type: 1,
          current_stock_rate: 51,
          is_sync_price: true,
          price_sync_type: 1,
          sku_price_diff: 0,
          sku_price_rate: 100,
          out_price_diff: 0,
          is_max_discount_price: 0,
          market_price_rate: 100,
          market_price_diff: 0,
          title_cut_type: 3,
          prefix: '',
          suffix: '',
          is_open_ps: '',
          source_str: '',
          target_str: '',
          is_open_replace: true
        }
      },
      rules: {
        task_title: [
          { required: true, message: '请输入计划名称', trigger: ['blur', 'change'] }
        ],
        // 'config_json.is_sync_shelf': [
        //   { validator: checkContent, trigger: ['blur', 'change'] }
        // ],
        'config_json.is_sync_stock': [
          { validator: checkContent, trigger: ['blur', 'change'] }
        ],
        'config_json.is_sync_price': [
          { validator: checkContent, trigger: ['blur', 'change'] }
        ],
        'config_json.is_sync_title': [
          { validator: checkContent, trigger: ['blur', 'change'] }
        ],
        'config_json.current_stock_rate': [
          { validator: validatePass, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.init()
  },
  computed: {
    ...mapState('productManagement/productsSync/tableProductList', {
      originForm: state => {
        return state.form
      },
      task_id: state => {
        return state.task_id
      },
      selectParmas: state => {
        return state.selectParmas
      },
      filters: state => {
        return state.filters
      },
      multipleSelection: state => {
        return state.multipleSelection
      },
      originFilters: state => {
        return state.originFilters
      }
    })
  },
  methods: {
    ...mapActions('productManagement/productsSync/tableProductList', [
      'fetch'
    ]),
    ...mapMutations('productManagement/productsSync/tableProductList', ['save']),
    async init () {
      // 查询初始化
      if (this.originForm) {
        this.form = this.originForm
      } else {
        // 取模版旧数据
        const template = await services.getTemplate()
        // 库存
        this.form.config_json.current_stock_rate = template.step_stock_num_percentage
        // 标题
        this.form.config_json.is_open_ps = template.is_open_title_prefix_suffix
        this.form.config_json.is_open_replace = template.is_open_title_replace
        this.form.config_json.prefix = template.title_prefix
        this.form.config_json.suffix = template.title_suffix
        this.form.config_json.source_str = template.source_title_str
        this.form.config_json.target_str = template.target_title_str
        // sku
        this.form.config_json.sku_price_diff = template.origin_price_diff
        this.form.config_json.sku_price_rate = template.group_price_rate
        this.form.config_json.out_price_diff = template.group_price_diff
        // 划线价
        this.form.config_json.market_price_rate = template.price_rate
        this.form.config_json.market_price_diff = template.price_diff
        // 售卖价
        this.form.config_json.is_sale_price_show_max = template.is_sale_price_show_max
      }
    },
    validCheckContent () {
      this.$refs.form.validateField(['config_json.is_sync_stock', 'config_json.is_sync_price', 'config_json.is_sync_title'])
    },
    updatePlan () {
      this.loadingPost = true
      const parmas = {
        style: JSON.stringify({
          form: this.form,
          selectParmas: this.selectParmas,
          filters: this.filters,
          multipleSelection: this.multipleSelection,
          originFilters: this.originFilters
        }),
        task_id: this.task_id
      }
      services.productSourceSyncUpdate(parmas)
        .then(data => {
          this.$message.success('修改模版成功！')
          this.$emit('go', null, 1)
        })
        .catch(err => {
          this.$message.error(`${err}`)
        })
        .finally(() => {
          this.loadingPost = false
        })
    },
    goback () {
      this.$emit('go', null, 1)
    },
    go: debounce(function () {
      this.$refs.form.validate((valid, object) => {
        if (valid) {
          this.fetch({
            filters: {
              capture_status: 1
            }
          })
          this.save({form: this.form})
          this.$emit('go', null, 3)
          console.log(this.form, 'this.form')
        }
      })
      // 验证
      // const data = this.getForm()
      // servises.hhgjAPIs.productSourceSyncCreate(data=>{

      // })
      // this.$emit('go')
    },
    300,
    {
      leading: true
    }),
    toggleIsShowSample () {
      this.isShowSample = true
    }

  }
}
</script>
<style lang="less" scoped>
.price {
  height: 44px;
  background: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #e5e5e5;
  padding: 2px 18px 0;
  margin-left: 25px;
}

.price-text {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #4e4e4e;
  line-height: 19px;
  display: flex;
  align-items: center;
}
.price-sku-input {
  display: inline;
  margin: 0 5px;
  /deep/ .el-input__inner {
    padding: 2px;
    width: 44px;
    height: 24px;
    border-radius: 4px;
    border: 1px solid #1d8fff;
    font-weight: bold;
  }
}
.price-sale-input {
  /deep/ .el-input__inner {
    padding: 5px;
    width: 110px;
    height: 38px;
    border-radius: 4px;
    border: 1px solid #ebebeb;
    font-size: 18px;
    font-family: MicrosoftYaHei;
    color: #4e4e4e;
    line-height: 24px;
    font-weight: bold;
  }
}
/deep/ .el-form-item {
  margin-bottom: 2px;
}
.title {
  width: 84px;
  height: 19px;
  font-size: 14px;
  font-family: MicrosoftYaqiHeiLight;
  color: #333333;
  line-height: 19px;
  margin-top: 30px;
}

/deep/ .el-divider--horizontal {
  margin: 14px 0;
}

.btn {
  margin-top: 40px;
}

.shoumaijia {
  /deep/ .el-form-item__label{
    font-size: 14px;
  }
}
</style>

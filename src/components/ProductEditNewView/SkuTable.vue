<!--  -->
<template>
    <div class="SkuTable left">
    <h1 class="mb-10">商品规格 <span class="warning"><hh-icon type="icontishi" ></hh-icon>注意：每次编辑完价格后商品单独保存，以免数据丢失！</span></h1>

    <!-- 规格 -->
    <SkuSelect
      ref="SkuSelect"
      :specifications="spec_list"
      @change="onSkuSelectChange"/>

    <!-- 时效设置 -->
    <div v-if="presellRuleListData.length">
      <el-button @click="addPresell" size="medium" style="margin-left:13px" v-if="!addPresellVisible" type="primary">添加发货模式</el-button>
      <el-button @click="removePresell" size="medium"  style="margin-left:13px" v-else  type="primary" plain>移除发货模式</el-button>
    </div>
    <div v-if="addPresellVisible && presellRuleListData.length">
      <div class="pt-10">
        <h1 class="mb-10 mr-10">发货模式</h1>
        <div class="bg">
          <el-radio-group v-model="presell" @change="presellChange" >
            <el-radio label="default" class="pb-10">不设置</el-radio>
            <el-radio label="time_sku_pure_presell_rule" class="pb-10">新预售发货模式规则</el-radio>
            <el-radio label="time_sku_presell_with_normal_rule">现货+预售发货规则</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="pt-10" v-if="presellRuleLists.length">
        <h1 class="mb-10 mr-10">发货时效</h1>
        <div class="bg">
          <el-checkbox-group v-model="presellRuleList"  @change="presellRuleListChange">
              <el-checkbox :label="p.spec_value" v-for="p in presellRuleLists" :key="p.spec_value" :disabled="p.spec_value === '48小时内发货'">{{p.spec_value}}</el-checkbox>
          </el-checkbox-group>
          <div class="font-12 mt-5">发货时效计算起点：买家支付后开始计算发货时效 (例：买家支付后7天发货)</div>
        </div>
      </div>
    </div>

    <!-- 批量设置 -->
    <h1 class="mb-10" style="margin-top:20px">{{'批量设置 - 价格、库存、编码'}}  <span class="warning"><hh-icon type="icontishi" ></hh-icon>可对指定规格批量设置哦</span></h1>
    <el-form class="mb-10 flex wrap" style="padding-left:15px" size="small" ref="batchEditForm" :model="batchEditForm" :rules="rulesBatchEditForm">
      <el-form-item>
        <el-select
          v-model="batchEditForm[spec.spec_id]"
          placeholder="请选择"
          v-for="(spec, index) in  spec_list"
          :key="index"
          style="width:130px"
          class="mr-5">
          <el-option
            :label="`全部-${spec.name}`"
            :value="-1">
          </el-option>
          <el-option
            v-for="item in spec.value_list"
            :key="item.spec_detail_id"
            :label="item.name"
            :value="item.spec_detail_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="quantity">
        <el-input  class="mr-5" style="width:130px" v-model="batchEditForm.quantity" placeholder="批量改库存"></el-input>
      </el-form-item>
      <el-form-item prop="promo_price">
        <el-input  class="mr-5" style="width:130px" v-model="batchEditForm.promo_price" placeholder="批量改货源方原价"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input  class="mr-5" style="width:130px" v-model="batchEditForm.code" placeholder="批量改编码"></el-input>
      </el-form-item>
      <el-form-item>
          <el-button size="medeium" type="primary" plain style="width:130px;height:32px;padding:0;margin-right:5px" @click="handleBatchEdit">批量设置</el-button>
      </el-form-item>

      <el-form-item>
          <el-button size="medeium" type="success" plain style="width:130px;height:32px;padding:0" @click="handleBatchEditStock">
            <hh-icon type="iconcangkukucun"></hh-icon> 统一增减库存</el-button>
          <el-button size="medeium" type="warning" plain style="width:130px;height:32px;padding:0;margin-left:3px" @click="handleBatchEditPrice">
            <hh-icon type="iconjiagebaohu"></hh-icon> 统一增减价格</el-button>
      </el-form-item>
    </el-form>

    <!-- sku表格 -->
    <h1 class="mb-10" style="margin-top:10px">货源方原价与库存</h1>
        <el-form ref="form" :rules="rules" :model="tableData" size="small" style="padding-left:15px">
            <el-table
            :data="tableData"
            :span-method="spanMethod"
            cell-class-name="cell-class-name"
            style="width: 100%">
            <el-table-empty slot="empty"/>
            <el-table-column
                v-for="(spec, index) in  spec_list"
                :prop="spec.name"
                fixed
                :key="index"
                :label="spec.name"
                width="120">
                <template slot-scope="scope">
                    <span >{{getRowData(scope.row,index)}}</span>
                </template>
            </el-table-column>

            <el-table-column
                v-if="presellRuleList.length"
                prop="time_sku_spec_name"
                label="时效规格"
                width="130">
            </el-table-column>

            <el-table-column
                prop="quantity"
                label="总库存"
                width="130">
                <template slot-scope="scope">
                    <el-form-item  :prop="`[${scope.row.index}].quantity`">
                        <el-input v-model="scope.row.quantity" placeholder="请输入" @input="handleEdit"></el-input>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column
                prop="address"
                width="130">
                <template slot="header" slot-scope="scope">
                    <span>货源方原价</span>
                    <el-tooltip manua="true" class="item" effect="dark" placement="top" style="vertical-align: middle">
                        <div slot="content">
                          <ul style="padding: 0; margin: 0;margin-bottom:5px;text-align:left" class="left">此处为货源方的原价,如果要进行调价不用在此处修改</ul>
                          <ul style="padding: 0; margin: 0;text-align:left" class="left">您可以在下一步统一进行价格调整</ul>
                        </div>
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </template>

                <template slot-scope="scope">
                    <el-form-item  class="relative" :prop="`[${scope.row.index}].promo_price`">
                        <span class="unit">¥</span>
                        <el-input class="price" v-model="scope.row.promo_price" placeholder="请输入" @input="handleEdit"></el-input>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column
                label="商品编码"
                >
                 <template slot="header" slot-scope="scope">
                  <div class="center">
                    <span @click="toggleVisibleSkuImport" >商品编码</span>
                    <el-tooltip content="点击查看抓取方法" effect="dark" placement="top">
                      <span class="pointer" @click="toggleVisibleSkuImport"><i class="el-icon-question"></i></span>
                    </el-tooltip>
                  </div>
                </template>
                <template slot-scope="scope">
                    <el-input v-model="scope.row.code" placeholder="请输入" @input="handleEdit" size="small"></el-input>
                </template>
            </el-table-column>
            <el-table-column
                prop="address"
                label="预览图"
                width="90"
                align="center" >
                <template slot-scope="scope">
                    <div class="preview imgWrapper" style="padding:4px" v-if="scope.row.img">
                      <el-popover
                        placement="left"
                        width="270"
                        trigger="hover">
                        <img :src="scope.row.img" style="width: 270px;"/>
                        <div
                          slot="reference">
                          <el-image
                            slot="reference"
                            style="width: 60px; height: 60px"
                            class="pointer"
                            :src="scope.row.img">
                          </el-image>
                        </div>
                        </el-popover>
                    </div>
                </template>
            </el-table-column>
            </el-table>
        </el-form>
        <el-dialog :visible.sync="visibleSkuImport" width="30%"
          :append-to-body="true" v-hh-modal>
          <div slot="title" class="center" style="font-size: large;text-align:center">提示</div>
          <div style="text-align:center">
            <p>因商品编码属于商家后台的字段，故无法获取。</p>
            <p>您可在搬家上线成功后在【导入修改】中导入"规格名称-</p>
            <p>sku编码"对应表格进行修改。</p>
            <div class="flex  justify-c align-c skuImportDialoag">
              <img :src="skuImport"  style="width:176px;"/>
            </div>
          </div>
        </el-dialog>
        <el-dialog title="批量修改库存" width="400px" :visible.sync="dialogQuantityVisible" center :append-to-body="true" v-hh-modal>
            <div>
                <el-radio v-model="stockModel.radio" label="1">
                    <span style="display:inline-block; width:100px">统一库存为</span>
                    <el-input v-model="stockModel.textStock" size="mini" style="width:100px"
                              @focus="stockModel.radio='1'"
                    ></el-input>
                </el-radio><br>
                <el-radio v-model="stockModel.radio" label="2">
                    <span style="display:inline-block; width:100px">每个SKU库存加</span>
                    <el-input v-model="stockModel.textStockAdd" size="mini" style="width:100px"
                              @focus="stockModel.radio='2'"
                    ></el-input>
                </el-radio><br>
                <el-radio v-model="stockModel.radio" label="3">
                    <span style="display:inline-block; width:100px">每个SKU库存减</span>
                    <el-input v-model="stockModel.textStockSub" size="mini" style="width:100px"
                              @focus="stockModel.radio='3'"
                    ></el-input>
                    <span class="explain">&nbsp; 小于 0 设为 0</span>
                </el-radio>
                <div style="text-align: center; padding-top: 20px">
                    <el-button @click="dialogQuantityVisible = false" style="width:100px">取消</el-button>
                    <el-button type="primary" @click="handleBatchQuantity" style="width:100px">确定</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="批量修改价格" width="500px" :visible.sync="dialogPromoPriceVisible" center :append-to-body="true" v-hh-modal>
            <div>
                <div class="fail center mb-5">此价格为初始价格，并非价格公示计算的价格</div>
                <div class="fail center mb-10">真实的售卖价请在后续价格页面设置</div>
                <el-radio v-model="priceModel.radio" label="1">
                    <span style="display:inline-block; width:150px">统一价格为</span>
                    <el-input v-model="priceModel.textPrice" size="mini" style="width:150px"
                              @focus="setRadio('1')"
                    ></el-input>
                    <span style="display:inline-block;">元</span>
                </el-radio><br>
                <el-radio v-model="priceModel.radio" label="2">
                    <span style="display:inline-block; width:150px">每个SKU价格加数字：</span>
                    <el-input v-model="priceModel.textPriceAdd" size="mini" style="width:150px"
                              @focus="priceModel.radio='2'"
                    ></el-input>
                    <span style="display:inline-block;">元</span>
                </el-radio><br>
                <el-radio v-model="priceModel.radio" label="3">
                    <span style="display:inline-block; width:150px">每个SKU价格减数字：</span>
                    <el-input v-model="priceModel.textPriceSub" size="mini" style="width:150px"
                              @focus="priceModel.radio='3'"
                    ></el-input>
                    <span style="display:inline-block;">元</span>
                    <span class="explain">&nbsp; 小于 0 设为 0</span>
                </el-radio>
                <el-radio v-model="priceModel.radio" label="4">
                    <span style="display:inline-block; width:150px">每个SKU价格加百分比：</span>
                    <el-input v-model="priceModel.textPricePercentAdd" size="mini" style="width:150px"
                              @focus="priceModel.radio='4'"
                    ></el-input>
                    <span style="display:inline-block;">%</span>
                </el-radio>
                <el-radio v-model="priceModel.radio" label="5">
                    <span style="display:inline-block; width:150px">每个SKU价格减百分比：</span>
                    <el-input v-model="priceModel.textPricePercentSub" size="mini" style="width:150px"
                              @focus="priceModel.radio='5'"
                    ></el-input>
                    <span style="display:inline-block;">%</span>
                    <span class="explain">&nbsp; 小于 0 设为 0</span>
                </el-radio>
                <div style="text-align: center; padding-top: 20px">
                    <el-button @click="dialogPromoPriceVisible = false"  style="width:100px">取消</el-button>
                    <el-button type="primary" @click="handleBatchPromoPrice"  style="width:100px">确定</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import SkuSelect from './SkuSelect'
import omit from 'lodash/omit'
import cloneDeep from 'lodash/cloneDeep'
import skuImport from '@/assets/images/sku_import.png'
import utils from '@/common/utils'

export default {
  name: 'component_name',
  props: {
    sku_json: Object
  },
  components: {
    SkuSelect
  },
  data () {
    const validateQuantity = (rule, value, callback) => {
      if (value) {
        if (!utils.isNumber(value)) {
          callback(new Error('0-1000000'))
        } else if (utils.isNumber(value) && value % 1) {
          callback(new Error('必须为整数'))
        } else if (value && (value > 1000000 || value < 0)) {
          callback(new Error('0-1000000'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const validatePrice = (rule, value, callback) => {
      if (value) {
        if (!utils.isNumber(value)) {
          callback(new Error('0.01-9999999.99'))
        } else if ((value > 9999999.99 || value < 0.01)) {
          callback(new Error('0.01-9999999.99'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      priceModel: {
        radio: '1',
        textPrice: '',
        textPriceAdd: '',
        textPriceSub: '',
        textPricePercentAdd: '',
        textPricePercentSub: ''
      },
      stockModel: {
        radio: '1',
        textStockAdd: '',
        textStockSub: '',
        textStock: ''
      },
      dialogPromoPriceVisible: false,
      dialogQuantityVisible: false,
      spec_list: [],
      tableData: [],
      spec_price_list: [],
      batchEditForm: {
        promo_price: '',
        quantity: '',
        code: ''
      },
      skuImport,
      visibleSkuImport: false,
      rulesBatchEditForm: {
        promo_price: [
          { validator: validatePrice, trigger: ['change'] }
        ],
        quantity: [
          { validator: validateQuantity, trigger: ['change'] }
        ]
      },
      presellRuleList: [],
      presell: 3,
      presellRuleListData: [],
      presellRuleLists: [],
      addPresellVisible: true
    }
  },
  watch: {
    spec_list (n) {
      if (n) {
        const batchEditForm = {}
        this.spec_list.forEach(spec => {
          batchEditForm[spec.spec_id] = -1
        })
        this.batchEditForm = cloneDeep(batchEditForm)
      }
    }
  },
  computed: {
    rules () {
      const priceRules = {}
      const quantityRules = {}
      const validatePrice = (rule, value, callback) => {
        if (!utils.isNumber(value)) {
          callback(new Error('0.01-9999999.99'))
        } else if ((value > 9999999.99 || value < 0.01)) {
          callback(new Error('0.01-9999999.99'))
        } else {
          callback()
        }
      }

      this.tableData.forEach((item, index) => {
        const key = `[${index}].promo_price`
        priceRules[key] = [
          { validator: validatePrice, trigger: ['blur', 'change'] }
        ]
      })

      const validateQuantity = (rule, value, callback) => {
        if (!utils.isNumber(value)) {
          callback(new Error('0-1000000'))
        } else if (utils.isNumber(value) && value % 1) {
          callback(new Error('必须为整数'))
        } else if (value && (value > 1000000 || value < 0)) {
          callback(new Error('0-1000000'))
        } else {
          callback()
        }
      }
      this.tableData.forEach((item, index) => {
        const key = `[${index}].quantity`
        quantityRules[key] = [
          { validator: validateQuantity, trigger: ['blur', 'change'] }
        ]
      })

      return {
        ...priceRules,
        ...quantityRules
      }
    }
  },
  methods: {
    init (skuJson, presellRuleListData) {
      // 批量修改表单初始化
      if (!skuJson) {
        return
      }
      // 如需设置发货时效 则
      if (presellRuleListData && presellRuleListData.length) {
        this.presellRuleListData = presellRuleListData
        // 数据回显
        let checkedPresellRuleLists, checkedPresell, checkedPresellRuleList
        presellRuleListData.forEach(item => {
          if (item.is_checked) {
            checkedPresellRuleLists = item.data.time_sku_spec_detial
            checkedPresell = item.presell_rule_type
            checkedPresellRuleList = checkedPresellRuleLists.filter(item => item.is_checked).map(item => item.spec_value)
          }
        })
        console.log(checkedPresellRuleLists, checkedPresellRuleLists, checkedPresell, checkedPresellRuleList, 'checkedPresellRuleLists')
        if (checkedPresellRuleLists) {
          this.presellRuleLists = checkedPresellRuleLists
          this.presell = checkedPresell
          this.presellRuleList = checkedPresellRuleList
        } else {
          // 设置默认值
          this.presellRuleLists = presellRuleListData[0].data.time_sku_spec_detial
          this.presell = presellRuleListData[0].presell_rule_type
          this.presellRuleList = this.presellRuleLists.map(item => item.spec_value)
        }
      }

      this.spec_list = cloneDeep(skuJson.spec_list).map(item => {
        return {
          ...item,
          addSkuImage: item.value_list.some(v => v.image)
        }
      })
      // this.spec_list = cloneDeep(skuJson.spec_list)
      this.spec_price_list = cloneDeep(skuJson.spec_price_list)
      let tableData = []
      const specData = this.initTableData(this.spec_list)
      const allSkuSpec = this.spec_price_list.map(item => item.spec_detail_id_list)
      let recordFirstPromoPrice = false
      let recordFirstPrice = false
      specData.forEach((spec, index) => {
        let matchSpecData = {}
        this.spec_price_list.forEach((data, index) => {
          const dataSet = new Set(data.spec_detail_id_list)
          const specSet = new Set(spec)
          const isEqual = [...dataSet].every(x => specSet.has(x))
          if (data.spec_detail_id_list.length && isEqual) {
            matchSpecData = data
            matchSpecData.promo_price = matchSpecData.promo_price
            if (!recordFirstPromoPrice && matchSpecData.promo_price) {
              recordFirstPromoPrice = matchSpecData.promo_price
              recordFirstPrice = matchSpecData.price
            }
          }
        })
        // 当用户抓取的商品缺少sku时，库存=0，价格取第一个sku价格（库存既然是0了所以价格是多少不重要，只要不是0就行）。从而解决价格=0的问题
        const matchspecsPrice = allSkuSpec.some(item => spec.every(s => item.includes(s)))

        if (!matchspecsPrice) {
          matchSpecData.promo_price = recordFirstPromoPrice
        }

        // 数据初始化默认值
        if (!matchSpecData.code) matchSpecData.code = ''
        if (!matchSpecData.price) matchSpecData.price = recordFirstPrice
        if (!matchSpecData.sku_id) matchSpecData.sku_id = ''
        if (!matchSpecData.img) matchSpecData.img = ''
        if (!matchSpecData.quantity) matchSpecData.quantity = 0
        if (!matchSpecData.promo_price) matchSpecData.promo_price = ''

        matchSpecData.index = index
        matchSpecData.spec_detail_id_list = spec
        tableData.push(matchSpecData)
      })
      tableData = tableData.map(item => {
        if (item.time_sku_spec_name) delete item.time_sku_spec_name
        return item
      })

      this.tableData = cloneDeep(tableData)
      if (this.presellRuleList.length > 0) {
        tableData = this.presellRuleListChange(this.presellRuleList)
      }
      this.originTableData = cloneDeep(tableData)
      this.$nextTick(() => {
        this.$refs.SkuSelect && this.$refs.SkuSelect.init(this.spec_list)
      })
      this.$emit('change', this.tableData, this.spec_list)
      return {
        tableData,
        spec_list: this.spec_list
      }
    },
    initTableData (list) {
      // 获取阶乘后拼接完整的规格列表
      let specList = [...list]
      let result = [[]]
      while (specList.length) {
        const currentData = specList.shift()
        if (currentData.value_list.length) {
          let originResult = []
          result.forEach((r = []) => {
            currentData.value_list.forEach(spec => {
              const nextSpecs = [...r]
              nextSpecs.push(spec.spec_detail_id)
              originResult.push(nextSpecs)
            })
          })
          result = originResult
        }
      }
      return result
    },
    addPresell () {
      this.addPresellVisible = true
      if (this.presellRuleListData && this.presellRuleListData.length) {
        const presellRuleListData = this.presellRuleListData
        this.presellRuleLists = presellRuleListData[0].data.time_sku_spec_detial
        this.presell = presellRuleListData[0].presell_rule_type
        this.presellRuleList = this.presellRuleLists.filter(item => item.is_presell_spec).map(item => item.spec_value)
        this.presellRuleListChange(this.presellRuleList)
      }
    },
    removePresell () {
      this.addPresellVisible = false
      this.presellRuleList = []
      this.presellRuleListChange(this.presellRuleList)
    },
    validForm () {
      this.$refs.form.validate((valid, object) => {
      })
    },
    getRowData (row, index) {
      const specList = this.spec_list
      let text = ''
      specList.forEach(spec => {
        (spec.value_list || []).forEach(value => {
          if (row.spec_detail_id_list && row.spec_detail_id_list[index] && value.spec_detail_id === row.spec_detail_id_list[index]) {
            text = value.name
          }
        })
      })
      return text
    },
    handleEdit () {
      this.$nextTick(() => {
        this.$emit('change', this.tableData, this.spec_list)
      })
    },
    // 格式化数据
    onSkuSelectChange (specifications, type) {
      // 当用户删除sku时，剩下的sku原本是多少价格、库存就展示多少价格、库存；
      // 当用户修改sku名称时，价格不变；
      // 当用户新增sku时，价格、库存为空，用户点击【保存编辑】需toast提示用户填写价格、库存，若不填写则无法保存
      const specData = this.initTableData(specifications)
      let tableData = []
      // 匹配当前编辑列表数据价格
      specData.forEach((spec, index) => {
        let matchSpecData = {}
        this.tableData.forEach((data) => {
          const dataSet = new Set(data.spec_detail_id_list)
          const specSet = new Set(spec)
          // 元数据内规格包含 新的规格 获取原始数据
          const minus = [...dataSet].filter(x => !specSet.has(x))
          if (!minus.length) {
            matchSpecData = data
          }
        })
        // 将元数据规格更新为新的规格
        if (!matchSpecData.code) matchSpecData.code = ''
        if (!matchSpecData.img) matchSpecData.img = ''
        if (!matchSpecData.promo_price) matchSpecData.promo_price = ''
        if (!matchSpecData.sku_id) matchSpecData.sku_id = ''
        matchSpecData.spec_detail_id_list = spec
        matchSpecData.promo_price = typeof matchSpecData.promo_price !== 'undefined' ? matchSpecData.promo_price : ''
        matchSpecData.quantity = typeof matchSpecData.quantity !== 'undefined' ? matchSpecData.quantity : ''
        matchSpecData.price = typeof matchSpecData.price !== 'undefined' ? matchSpecData.price : ''
        matchSpecData.index = index
        tableData.push(matchSpecData)
      })
      // 如果没价格就匹配=初始化价格
      tableData = tableData.map((t, index) => {
        this.originTableData.forEach((data) => {
          const dataSet = new Set(data.spec_detail_id_list)
          const specSet = new Set(t.spec_detail_id_list)
          // 元数据内规格包含 新的规格 获取原始数据
          const conclude = [...specSet].every(x => dataSet.has(x))
          if (conclude && !t.promo_price && data.promo_price) {
            data.spec_detail_id_list = t.spec_detail_id_list
            t = data
          }
        })
        return t
      })

      // 图片
      if (specifications.every(item => !item.addSkuImage)) {
        tableData = tableData.map(item => {
          item.img = ''
          return item
        })
      } else {
        const valueList = specifications.find(item => item.addSkuImage).value_list
        tableData = tableData.map(data => {
          valueList.forEach(value => {
            if (data.spec_detail_id_list.includes(value.spec_detail_id)) {
              data.img = value.image
            }
          })
          return data
        })
      }
      // 删除time_sku_spec_name 初始化有发货模式设置的数据
      tableData = tableData.map(item => {
        if (item.time_sku_spec_name) delete item.time_sku_spec_name
        return item
      })
      this.tableData = cloneDeep(tableData)
      console.log(tableData, 'tableData-onSkuSelectChange')
      this.presellRuleListChange(this.presellRuleList)
      this.spec_list = cloneDeep(specifications)
      this.$emit('change', this.tableData, this.spec_list)
      this.$nextTick(() => {
        this.$refs.form.validate((valid, object) => {
        })
      })
    },
    // sku抓取
    toggleVisibleSkuImport: function () {
      this.visibleSkuImport = !this.visibleSkuImport
    },
    // 批量设置
    handleBatchEdit () {
      this.$refs.batchEditForm.validate((valid, object) => {
        if (valid) {
          const specArrays = omit(this.batchEditForm, ['promo_price', 'quantity', 'code'])
          const specValues = (Object.values(specArrays) || []).filter(item => Number(item) !== -1)
          this.tableData = this.tableData.map(data => {
            const dataSet = new Set(data.spec_detail_id_list)
            const specSet = new Set(specValues)
            const concludes = [...specSet].every(x => dataSet.has(x))
            if (concludes) {
              if (this.batchEditForm.promo_price) data.promo_price = this.batchEditForm.promo_price
              if (this.batchEditForm.quantity) data.quantity = this.batchEditForm.quantity
              if (this.batchEditForm.code) data.code = this.batchEditForm.code
            }
            return data
          })
          this.$message.success('设置成功')
          this.$emit('change', this.tableData, this.spec_list)
        }
      })
    },
    handleBatchQuantity () {
      this.tableData = this.tableData.map(sku => {
        if (parseInt(this.stockModel.radio) === 1 && utils.isNumber(this.stockModel.textStock)) {
          sku.quantity = parseInt(this.stockModel.textStock)
        } else if (parseInt(this.stockModel.radio) === 2 && utils.isNumber(this.stockModel.textStockAdd)) {
          sku.quantity = parseInt(sku.quantity) + parseInt(this.stockModel.textStockAdd)
        } else if (parseInt(this.stockModel.radio) === 3 && utils.isNumber(this.stockModel.textStockSub)) {
          sku.quantity = Math.max(parseInt(sku.quantity) - parseInt(this.stockModel.textStockSub), 0)
        }
        return sku
      })

      this.dialogQuantityVisible = false
      this.priceModel = {
        radio: '1',
        textStockAdd: '',
        textStockSub: '',
        textStock: ''
      }
      this.$message.success('设置成功')
      this.$emit('change', this.tableData, this.spec_list)
    },
    setRadio (radio) {
      this.priceModel.radio = radio
    },
    handleBatchPromoPrice () {
      this.tableData = this.tableData.map(sku => {
        if (parseInt(this.priceModel.radio) === 1 && utils.isNumber(this.priceModel.textPrice)) {
          sku.promo_price = parseFloat(this.priceModel.textPrice)
        } else if (parseInt(this.priceModel.radio) === 2 && utils.isNumber(this.priceModel.textPriceAdd)) {
          sku.promo_price = parseFloat(sku.promo_price || 0) + parseFloat(this.priceModel.textPriceAdd)
        } else if (parseInt(this.priceModel.radio) === 3 && utils.isNumber(this.priceModel.textPriceSub)) {
          sku.promo_price = parseFloat(sku.promo_price || 0) - parseFloat(this.priceModel.textPriceSub)
        } else if (parseInt(this.priceModel.radio) === 4 && utils.isNumber(this.priceModel.textPricePercentAdd)) {
          sku.promo_price = parseFloat(sku.promo_price || 0) * (1 + parseFloat(this.priceModel.textPricePercentAdd) / 100)
        } else if (parseInt(this.priceModel.radio) === 5 && utils.isNumber(this.priceModel.textPricePercentSub)) {
          sku.promo_price = parseFloat(sku.promo_price || 0) * (1 - parseFloat(this.priceModel.textPricePercentSub) / 100)
        }
        sku.promo_price = Math.max(sku.promo_price, 0)
        sku.promo_price = Math.round(sku.promo_price * 100) / 100
        return sku
      })
      this.dialogPromoPriceVisible = false
      this.priceModel = {
        radio: '1',
        textPrice: '',
        textPriceAdd: '',
        textPriceSub: '',
        textPricePercentAdd: '',
        textPricePercentSub: ''
      }
      this.$message.success('设置成功')
      this.$emit('change', this.tableData, this.spec_list)
    },
    handleBatchEditStock () {
      this.dialogQuantityVisible = true
    },
    handleBatchEditPrice () {
      this.dialogPromoPriceVisible = true
    },
    presellChange (value) {
      const presellRule = this.presellRuleListData.find(item => String(item.presell_rule_type) === String(value))
      if (presellRule) {
        this.presellRuleLists = presellRule.data.time_sku_spec_detial
        this.presellRuleList = this.presellRuleLists.filter(item => item.is_presell_spec).map(item => item.spec_value)
        this.presellRuleListChange(this.presellRuleList)
      }
      console.log(this.presellRuleLists, 'presellRuleLists')
    },
    handlePresellRuleListData () {
      const presellRuleListData = this.presellRuleListData.map(item => {
        if (String(item.presell_rule_type) === String(this.presell)) {
          item.is_checked = true
          item.data.time_sku_spec_detial = item.data.time_sku_spec_detial
            .map(specDetial => {
              if (this.presellRuleList.includes(specDetial.spec_value)) {
                specDetial.is_checked = true
              } else {
                specDetial.is_checked = false
              }
              return specDetial
            })
          return item
        } else {
          delete item.is_checked
          item.data.time_sku_spec_detial = item.data.time_sku_spec_detial
            .map(specDetial => {
              delete specDetial.is_checked
              return specDetial
            })
          return item
        }
      })
      console.log(presellRuleListData, 'presellRuleListData')
      this.$emit('presellRuleList', presellRuleListData)
    },
    presellRuleListChange (presells) {
      let length = presells.length
      if (this.oldPresells) {
        length = this.oldPresells.length
      }
      if (!presells.length && !length) {
        this.$nextTick(() => {
          this.handlePresellRuleListData()
        })
        return false
      }
      if (!presells.length && length) {
        const tableData = []
        this.tableData.map((item, index) => {
          if (index % length === 0) {
            tableData.push(omit(item, ['time_sku_spec_name']))
          }
        })

        this.oldPresells = presells
        this.$nextTick(() => {
          this.tableData = tableData
          this.handlePresellRuleListData()
        })
        return false
      }

      const tableData = []
      // 没有设置过 时效 记录tabledata初始值
      let shouldAddColumn = false
      if (this.tableData.every(item => !item.time_sku_spec_name)) {
        shouldAddColumn = true
      }
      this.tableData.map((item, index) => {
        presells.forEach(presell => {
          if (shouldAddColumn) {
            tableData.push({
              ...item,
              time_sku_spec_name: presell
            })
          } else {
            if (index % length === 0) {
              tableData.push({
                ...item,
                time_sku_spec_name: presell
              })
            }
          }
        })
      })
      this.oldPresells = presells
      this.tableData = tableData
      this.handlePresellRuleListData()
      return this.tableData
    },
    spanMethod ({ row, column, rowIndex, columnIndex }) {
      let end = this.spec_list.length + 3
      // 有时效规格的设置

      const arr = []

      this.spec_list.map(item => {
        arr.push(item.value_list.length)
      })
      if (this.presellRuleList.length > 0) {
        end = end + 1
        arr.push(this.presellRuleList.length)
      }

      if (arr.length === 4) {
        const columnIndex0 = arr[1] * arr[2] * arr[3]
        const columnIndex1 = arr[2] * arr[3]
        const columnIndex2 = arr[3]
        if (columnIndex === 0) {
          if (rowIndex % columnIndex0 === 0) {
            return {
              rowspan: columnIndex0,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        } else if (columnIndex === 1) {
          if (rowIndex % columnIndex1 === 0) {
            return {
              rowspan: columnIndex1,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        } else if (columnIndex === 2) {
          if (rowIndex % columnIndex2 === 0) {
            return {
              rowspan: columnIndex2,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        } else if (columnIndex === 3) {
          if (rowIndex % columnIndex0 === 0) {
            return {
              rowspan: columnIndex0,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }

      if (arr.length === 3) {
        const columnIndex0 = arr[1] * arr[2]
        const columnIndex1 = arr[2]
        if (columnIndex === 0) {
          if (rowIndex % columnIndex0 === 0) {
            return {
              rowspan: columnIndex0,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        } else if (columnIndex === 1) {
          if (rowIndex % columnIndex1 === 0) {
            return {
              rowspan: columnIndex1,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        } else if (columnIndex === end) {
          if (rowIndex % columnIndex0 === 0) {
            return {
              rowspan: columnIndex0,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }
      if (arr.length === 2) {
        const columnIndex0 = arr[1]
        if (columnIndex === 0) {
          if (rowIndex % columnIndex0 === 0) {
            return {
              rowspan: columnIndex0,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        } else if (columnIndex === end) {
          if (rowIndex % columnIndex0 === 0) {
            return {
              rowspan: columnIndex0,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }

      return {
        rowspan: 1,
        colspan: 1
      }
    }
  }
}
</script>
<style lang="less" scoped>
.SkuTable {
    /deep/ .cell-class-name {
        border-left: 1px solid #F2F2F2;
        padding:0;
        overflow: inherit;
        .el-form-item {
          margin-bottom: 0;
          margin:10px 0;
        }
    }
    .unit {
        position: absolute;
        left: 8px;
        top: 1px;
        z-index: 1;
        bottom: 0;
        margin: auto;
        line-height: 32px;
        font-size: 14px;
    }
    .promo_price {
        /deep/ .el-input__inner{
            padding-left: 20px;
        }
    }

    /deep/ .el-input__inner {
        &:hover,&:focus {
            border: 1px solid @color-primary;
        }
    }

    /deep/ .el-radio{
      display: block;
      margin:0;
    }

    /deep/ .el-checkbox{
      // display: block;
    }
    .bg {
      background: rgb(249, 249, 250);
      padding: 16px 12px;
      margin-right: 30px;
      border-radius: 4px;
      margin-bottom: 10px;
    }
}

</style>

<template lang="html">
    <div>
      <span>(带 <span style="color: red">*</span> 为必填属性</span><span v-if="catId!==0">，勾选应用到本页相同分类商品，蓝色高亮</span><span>)</span>
        <br>
        <el-form class="setting-content" style="overflow: hidden;">
            <el-form-item v-for="(item, index) in attrShowList" :key="index" :label="item.name" :required="item.required"
                          v-show="item.show" label-width="110px" :error="item.required && item.value === ''" :show-message="false"
            >
                <div  v-if="item.control_type == controlTypeMap['multi_select']">
                    <span>(最多选{{item.group_select_max}}, 已选{{item.group_select.length}}个)</span>
                    <el-checkbox-group
                            v-model="item.group_select"
                            :min="0"
                            :max="item.group_select_max" @change="onChangeMultiSelect(index,item)">
                        <el-checkbox v-for="(opt, index) in item.options" :key="index" :label="opt.value" :value="opt.value">{{opt.label}}</el-checkbox>
                    </el-checkbox-group>

                </div>
                <div v-else-if="item.control_type == controlTypeMap['un_editable']" style="display: inline">
                    {{attrShowList[index].value}}
                </div>
                <el-select v-else-if="item.control_type == controlTypeMap['select']" v-model="item.vid_matched" size="mini" placeholder="请选择"
                           class="input-text-left" style="width: 180px" :disabled="item.disabled" clearable @change="onChangeSelect(index, item)"
                           :filterable="item.options.length >= 10" :remote="item.options.length >= 100"
                           :remote-method="data => selectRemoteFilter(data, item)"
                           :loading="item.loading"
                >
                    <el-option v-for="opt in (item.filter ? item.filterOptions : item.options)"
                               :key="opt.value" :label="opt.label" :value="opt.value">
                    </el-option>
                </el-select>
                <el-date-picker v-else-if="[5, 7].includes(item.control_type)" v-model="attrShowList[index].value"
                                :type="getDatePickerType(item.control_type)" placeholder="选择日期" size="mini" class="input-date-left"
                                style="width: 180px" @change="onChangeDate($event, item)"
                >
                </el-date-picker>
                <div v-else style="display: inline">
                    <el-tooltip placement="right" effect="dark" class="item" :open-delay="500"
                                :disabled="item.max_value === '' && item.min_value === '' && (item.value_precision !== 0 || item.value_type !== valueTypeMap['number'])"
                    >
                        <div slot="content" v-if="item.value_type === valueTypeMap['number']">
                            <span v-if="item.value_precision ===0">整数, </span>
                            <span v-if="item.min_value!==''">&gt;={{item.min_value}}</span>
                            <span v-if="item.min_value!=='' && item.max_value !=='' ">,</span>
                            <span v-if="item.max_value!==''">&lt;={{item.max_value}}</span>
                        </div>
                        <div slot="content" v-if="item.value_type === valueTypeMap['text']">
                            <span v-if="item.min_value!==''">大于{{item.min_value}}字符</span>
                            <span v-if="item.min_value!=='' && item.max_value !=='' ">,</span>
                            <span v-if="item.max_value!==''">小于{{item.max_value}}字符</span>
                        </div>
                        <div v-if="[11,12,13].includes(item.control_type)" style="display: inline-block;">
                            <span v-for="(v,i) in attrShowList[index].group_input" :key="i">
                                <label v-if="i!=0 && [12,13].includes(item.control_type)"> x </label>
                                <label v-if="i!=0 && [11].includes(item.control_type)"> ~ </label>
                                <el-input v-if="i===(attrShowList[index].group_input.length-1)"
                                          v-model="attrShowList[index].group_input[i]" size="mini"
                                          class="input-text-left" style="width: 120px;vertical-align:middle;"
                                          @input="onChangeProductInput(index,item)">
                                    <template v-if="attrShowList[index].value_unit.length === 1" slot="append">
                                        {{ attrShowList[index].unit_matched }}
                                    </template>
                                    <template v-else-if="attrShowList[index].value_unit.length > 1" slot="append">
                                        <el-select v-model="attrShowList[index].unit_matched"  style="min-width: 53px">
                                            <el-option v-for="(unit, index) in attrShowList[index].value_unit" :key="index"
                                                       :label="unit" :value="unit">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-input>
                                <el-input v-else
                                          v-model="attrShowList[index].group_input[i]" size="mini"
                                          class="input-text-left" style="width: 60px"
                                          @input="onChangeProductInput(index,item)">
                                </el-input>
                            </span>
                        </div>
                        <el-input v-else v-model="attrShowList[index].value" size="mini"
                                  class="input-text-left" style="width: 180px;vertical-align:middle;"
                                  @input="onChangeInput(index, item)">
                            <template v-if="attrShowList[index].value_unit.length === 1" slot="append">
                                {{ attrShowList[index].unit_matched }}
                            </template>
                            <template v-else-if="attrShowList[index].value_unit.length > 1" slot="append">
                                <el-select v-model="attrShowList[index].unit_matched" style="min-width: 53px">
                                    <el-option v-for="(unit, index) in attrShowList[index].value_unit" :key="index"
                                               :label="unit" :value="unit">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-input>
                    </el-tooltip>
                </div>
                <el-tooltip v-if="catId!==0" effect="dark" content="勾选应用到本页相同分类商品，蓝色高亮" placement="right">
                  <el-checkbox size="mini" v-model="item.apply_cat" border @change="handleApplyCatChecked(item)">
                    <span>应用</span>
                  </el-checkbox>
                </el-tooltip>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import utils from '@/common/utils'
import common from '@/common/common.js'
import moment from 'moment'

export default {
  components: {},
  data () {
    return {
      isRequiredComplete: false,
      attrRawDic: {},
      attrShowList: [],
      attrApplyCatMap: {},
      catId: 0
    }
  },
  computed: {
    controlTypeMap () {
      return common.controlTypeMap
    },
    valueTypeMap () {
      return common.valueTypeMap
    }
  },
  mounted () {
  },
  methods: {
    clear () {
      this.attrShowList = []
    },
    setAttrRawDic (dic) {
      if (dic) {
        this.attrRawDic = {...dic}
      }
    },
    setAttrShowList (list) {
      if (list) {
        this.attrShowList = [...list]
      }
    },
    setAttrApplyCatMap (dic) {
      if (dic) {
        this.attrApplyCatMap = {...dic}
      }
    },
    reloadAttrShowList () {
      this.attrShowList = []
      this.isRequiredComplete = true
      this.dfsAttrRaw(0)
      this.updateRequiredRule()
    },
    // 每个 attribute 加上 child_ids 和 vid 字段，转换成字典
    initAttribute (attributeJson, catId = 0) {
      this.attrRawDic = {
        0: { id: 0, child_ids: [], vid_matched: '' }
      }
      for (let i in attributeJson) {
        let attrRaw = attributeJson[i]
        attrRaw.child_ids = []
        if (typeof attrRaw.tp_value === 'string') {
          attrRaw.tp_value_list = attrRaw.tp_value.split(',')
        } else {
          attrRaw.tp_value_list = [attrRaw.tp_value]
        }
        if (attrRaw.tp_value_list.length === 1) {
          if (attrRaw.control_type === common.CONTROL_TWO_PRODUCT) {
            attrRaw.tp_value_list = ['', '']
          } else if (attrRaw.control_type === common.CONTROL_RANGE) {
            attrRaw.tp_value_list = ['', '']
          } else {
            attrRaw.tp_value_list = ['', '', '']
          }
        }
        attrRaw.apply_cat = false
        attrRaw.cat_id = catId
        this.catId = catId
        this.attrRawDic[attrRaw.id] = attrRaw
      }
      // 按照后端传到前端的顺序进行处理，因为属性默认有一定的重要性区别
      // for (let id in this.attrRawDic) {
      for (let i in attributeJson) {
        let item = attributeJson[i]
        let id = item.id
        if (parseInt(id) === 0) {
          continue
        }
        this.attrRawDic[item.parent_id].child_ids.push(id)
      }

      this.attrShowList = []
      this.isRequiredComplete = true
      this.dfsAttrRaw(0)
      this.updateRequiredRule()
      this.$emit('onAttrChanged', this.isRequiredComplete)

      return this.attrShowList.length > 0
    },
    inputAtter (id, value, unit = '') {
      this.attrRawDic[id].tp_value = value
      this.attrRawDic[id].unit_matched = unit
      this.attrShowList = []
      this.isRequiredComplete = true
      this.dfsAttrRaw(0)
      this.updateRequiredRule()
      this.$emit('onAttrChanged', this.isRequiredComplete)
    },
    selectAttr (id, vid, value) {
      this.attrRawDic[id].vid_matched = vid
      this.attrRawDic[id].tp_value = value
      if (vid === '') {
        this.attrRawDic[id].tp_value = ''
      }
      this.attrShowList = []
      this.isRequiredComplete = true
      this.dfsAttrRaw(0, id)
      this.updateRequiredRule()
      this.$emit('onAttrChanged', this.isRequiredComplete)
    },
    multiSelectAttr (id, selectValueList) {
      this.attrRawDic[id].vid_matched_list = selectValueList
      this.attrShowList = []
      this.isRequiredComplete = true
      this.dfsAttrRaw(0, id)
      this.updateRequiredRule()
      this.$emit('onAttrChanged', this.isRequiredComplete)
    },
    inputProductAtter (id, groupInputValueList) {
      this.attrRawDic[id].tp_value_list = groupInputValueList
      // 如果都为空，或者每个维度都不为空，才更新tp_value的值
      let temp = []
      for (let value of this.attrRawDic[id].tp_value_list.values()) {
        if (value !== '') {
          temp.push(value)
        }
      }
      if (temp.length === 0 || temp.length === groupInputValueList.length) {
        this.attrRawDic[id].tp_value = groupInputValueList.join(',')
      }
      this.attrShowList = []
      this.isRequiredComplete = true
      this.dfsAttrRaw(0, id)
      this.updateRequiredRule()
      this.$emit('onAttrChanged', this.isRequiredComplete)
    },
    updateRequiredRule () {
      let attrRefMap = {}
      for (let i in this.attrShowList) {
        attrRefMap[this.attrShowList[i].ref_pid] = this.attrShowList[i]
      }
      for (let idx in this.attrShowList) {
        let attrShow = this.attrShowList[idx]
        let isOrRequired = false
        if (!attrShow.required_rule_type || attrShow.required_rule_type.toString() !== '1') {
          continue
        }
        for (let i in attrShow.required_rule) {
          let isAndRequired = true
          for (let j in attrShow.required_rule[i]) {
            let obj = attrShow.required_rule[i][j]
            if (!(attrRefMap[obj['ref_pid']] && attrRefMap[obj['ref_pid']].vid_matched === obj.vid)) {
              isAndRequired = false
            }
          }
          if (isAndRequired) {
            isOrRequired = true
          }
        }
        if (isOrRequired) {
          this.attrShowList[idx].required = true
        } else {
          this.attrShowList[idx].required = false
        }
      }
    },
    dfsAttrRaw (id, updateId = -1, isReset = false) {
      let curAttrRaw = this.attrRawDic[id]
      if (parseInt(id) !== 0) {
        if (isReset && curAttrRaw.control_type !== common.CONTROL_INPUT) {
          this.attrRawDic[id].vid_matched = ''
          this.attrRawDic[id].tp_value = ''
          this.attrRawDic[id].vid_matched_list = []
        }
        let attrShow = this.genAttrShow(curAttrRaw)
        if (
          curAttrRaw.cat_id !== 0 &&
          this.attrApplyCatMap[curAttrRaw.cat_id] &&
          this.attrApplyCatMap[curAttrRaw.cat_id][curAttrRaw.id] &&
          this.attrApplyCatMap[curAttrRaw.cat_id][curAttrRaw.id].apply_cat
        ) {
          attrShow = this.attrApplyCatMap[curAttrRaw.cat_id][curAttrRaw.id]
        } else {
          attrShow.apply_cat = false
        }
        this.attrShowList.push(attrShow)
        if (attrShow.required && attrShow.show && attrShow.value === '') {
          this.isRequiredComplete = false
        }
      }
      for (let i in curAttrRaw.child_ids) {
        let childId = curAttrRaw.child_ids[i]
        isReset = (isReset || id.toString() === updateId.toString()) // updateId 的子节点重置
        this.dfsAttrRaw(childId, updateId, isReset)
      }
    },
    genAttrShow (attrRaw) {
      if (parseInt(attrRaw.id) === 0) {
        return {}
      }
      let parentVid = this.attrRawDic[attrRaw.parent_id].vid_matched
      let attrShow = {
        id: attrRaw.id,
        ref_pid: attrRaw.ref_pid,
        name: attrRaw.name,
        required: attrRaw.required,
        control_type: attrRaw.control_type,
        vid_matched: attrRaw.vid_matched,
        value: attrRaw.tp_value,
        options: [],
        value_unit: attrRaw.value_unit,
        unit_matched: '',
        disabled: false,
        show: true,
        group_select: attrRaw.vid_matched_list,
        group_select_max: attrRaw.vid_matched_list_max_len,
        max_value: attrRaw.max_value,
        min_value: attrRaw.min_value,
        value_type: attrRaw.value_type,
        value_precision: attrRaw.value_precision,
        loading: false,
        filter: false,
        filterOptions: [],
        cat_id: attrRaw.cat_id,
        apply_cat: attrRaw.apply_cat
      }
      if (attrRaw.required_rule_type && attrRaw.required_rule) {
        attrShow['required_rule_type'] = attrRaw.required_rule_type
        attrShow['required_rule'] = attrRaw.required_rule
      }
      if (attrRaw.is_condition_show && attrRaw.show_vids) {
        attrShow['is_condition_show'] = attrRaw.is_condition_show
        attrShow['show_vids'] = attrRaw.show_vids
      }
      if ([common.CONTROL_ONE_DATE_YMD, common.CONTROL_ONE_DATE_YM].includes(parseInt(attrRaw.control_type))) {
        if (!utils.isDate(attrRaw.tp_value)) {
          attrShow.value = ''
        } else if (parseInt(attrRaw.control_type) === common.CONTROL_ONE_DATE_YM) {
          attrShow.value = moment(attrRaw.tp_value).format('YYYY-MM')
        }
      }
      if (attrRaw.value_unit && attrRaw.value_unit.length > 0) {
        if (attrRaw.unit_matched) {
          attrShow.unit_matched = attrRaw.unit_matched
        } else {
          attrShow.unit_matched = attrShow.value_unit[0]
        }
      }
      let isInOptions = false
      for (let i in attrRaw.values) {
        let item = attrRaw.values[i]
        if (item.vid === attrShow.vid_matched) {
          attrShow.value = item.value
          isInOptions = true
        }
        if (parseInt(attrRaw.parent_id) === 0 || (item.parent_vids && item.parent_vids.includes(parentVid))) {
          attrShow.options.push({
            value: item.vid,
            label: item.value
          })
        }
      }
      if (!isInOptions && attrShow.value) {
        attrShow.options.push({
          value: attrShow.vid_matched,
          label: attrShow.value
        })
      }
      if (attrShow.options.length === 1) {
        this.attrRawDic[attrRaw.id].vid_matched = attrShow.options[0].value
        this.attrRawDic[attrRaw.id].tp_value = attrShow.options[0].label
        attrShow.vid_matched = attrShow.options[0].value
        attrShow.value = attrShow.options[0].label
        attrShow.disabled = true
      }
      if (parseInt(attrRaw.parent_id) !== 0 &&
        (parentVid === '' || (attrShow.control_type === common.CONTROL_SELECT && attrShow.options.length === 0))
      ) {
        attrShow.show = false
      }
      if (parseInt(attrRaw.parent_id) !== 0 && attrRaw.is_condition_show && !attrShow.show_vids.includes(parentVid)) {
        attrShow.show = false
      }
      if (attrShow.control_type === common.controlTypeMap['un_editable'] && attrShow.vid_matched === '') {
        attrShow.show = false
      }
      if (attrRaw.control_type === common.CONTROL_TWO_PRODUCT || attrRaw.control_type === common.CONTROL_THREE_PRODUCT ||
        attrRaw.control_type === common.CONTROL_RANGE) {
        attrShow.group_input = attrRaw.tp_value_list
      }
      return attrShow
    },
    getAttrUploadList (needMatchedListDetail = false) {
      let attrUploadList = []
      for (let i in this.attrShowList) {
        let attrShow = this.attrShowList[i]
        let vidMatchedList = attrShow.group_select
        if (needMatchedListDetail && vidMatchedList.length > 0) {
          vidMatchedList = []
          for (let j in attrShow.options) {
            let option = attrShow.options[j]
            if (attrShow.group_select.includes(option.value)) {
              vidMatchedList.push(option)
            }
          }
        }
        attrUploadList.push({
          id: attrShow.id,
          ref_pid: attrShow.ref_pid,
          tp_value: attrShow.value,
          unit_matched: attrShow.unit_matched,
          vid_matched: attrShow.vid_matched,
          vid_matched_list: vidMatchedList
        })
      }
      return attrUploadList
    },
    getAttrUploadListByShowList (attrShowList, needMatchedListDetail = false) {
      let attrUploadList = []
      for (let i in attrShowList) {
        let attrShow = attrShowList[i]
        let vidMatchedList = attrShow.group_select
        if (needMatchedListDetail && vidMatchedList.length > 0) {
          vidMatchedList = []
          for (let j in attrShow.options) {
            let option = attrShow.options[j]
            if (attrShow.group_select.includes(option.value)) {
              vidMatchedList.push(option)
            }
          }
        }
        attrUploadList.push({
          id: attrShow.id,
          ref_pid: attrShow.ref_pid,
          tp_value: attrShow.value,
          unit_matched: attrShow.unit_matched,
          vid_matched: attrShow.vid_matched,
          vid_matched_list: vidMatchedList
        })
      }
      return attrUploadList
    },
    getDatePickerType (controlType) {
      switch (parseInt(controlType)) {
        case common.CONTROL_ONE_DATE_YMD: return 'date'
        case common.CONTROL_ONE_DATE_YM: return 'month'
      }
      return 'date'
    },
    onChangeInput (index, item) {
      if (item.apply_cat) {
        this.clearApplyCat(item)
      }
      this.inputAtter(item.id, item.value, item.unit_matched)
    },
    onChangeDate (val, item) {
      if (item.apply_cat) {
        this.clearApplyCat(item)
      }
      let date = moment(val).format('L')
      this.inputAtter(item.id, date)
    },
    onChangeSelect (index, item) {
      if (item.apply_cat) {
        this.clearApplyCat(item)
      }
      let options = (item.filter ? item.filterOptions : item.options)
      let value = ''
      for (let i in options) {
        if (options[i].value === item.vid_matched) {
          value = options[i].label
          break
        }
      }
      this.selectAttr(item.id, item.vid_matched, value)
      item.filter = false
    },
    onChangeMultiSelect (index, item) {
      if (item.apply_cat) {
        this.clearApplyCat(item)
      }
      this.multiSelectAttr(item.id, item.group_select)
    },
    onChangeProductInput (index, item) {
      if (item.apply_cat) {
        this.clearApplyCat(item)
      }
      this.inputProductAtter(item.id, item.group_input)
    },
    selectRemoteFilter (query, item) {
      if (query === '') {
        item.filter = false
        return
      }
      item.loading = true
      this.$emit('selectFilter', item.id, query, data => {
        item.loading = false
        item.filter = true
        item.filterOptions = []
        for (let i in data) {
          item.filterOptions.push({
            value: data[i].vid,
            label: data[i].value
          })
        }
      })
    },
    handleApplyCatChecked (item) {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '复制商品', '点击', '批量应用商品属性'])
      }
      if (item.cat_id === 0) {
        return
      }
      if (item.apply_cat === true) {
        item.apply_cat = true
        if (!this.attrApplyCatMap[item.cat_id]) {
          this.attrApplyCatMap[item.cat_id] = {}
        }
        this.attrApplyCatMap[item.cat_id][item.id] = item
      } else {
        delete this.attrApplyCatMap[item.cat_id][item.id]
        if (Object.keys(this.attrApplyCatMap[item.cat_id]).length === 0) {
          delete this.attrApplyCatMap[item.cat_id]
        }
      }
      this.$emit('updateAttrApplyCat', this.attrApplyCatMap)
    },
    clearApplyCat (item) {
      delete this.attrApplyCatMap[item.cat_id][item.id]
      if (this.attrApplyCatMap[item.cat_id].length === 0) {
        delete this.attrApplyCatMap[item.cat_id]
      }
      this.$emit('updateAttrApplyCat', this.attrApplyCatMap)
    }
  }
}
</script>
<style lang="less" scoped>
</style>

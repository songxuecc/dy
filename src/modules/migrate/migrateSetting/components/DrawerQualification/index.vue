<!--  -->
<template>
    <div>
        <el-drawer
            :visible.sync="drawer"
            :with-header="false"
            direction="rtl"
            size="80%">
            <div class="content">
                <div class="left">
                  <el-input v-model="search" placeholder="搜索类目关键词" style="width:340px;" size="small" @input="onSearch"> </el-input>
                  <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane :label="tab.label" :name="tab.name" v-for="tab in tabs" :key="tab.name">
                      <div class="list">
                        <div v-for="(l,idx) in list" :key="l.value">
                          <p @click="setActiveQualification(l,idx)" :class="[activeQualification.value === l.value ? 'active':'']">{{l.label}}</p>
                          <div class="border" v-if="idx !== list.length -1"></div>
                        </div>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </div>
                <div class="right">
                  <el-alert type="warning" style="height:30px"  :closable="false">
                    <span slot="title" class="color-333 font-12"><span class="fail">* </span>该类目下的所有商品都统一为以下资质</span>
                  </el-alert>
                  <PictureQualification :qualitys="qualityList"  @change="handlePictureQualificationChange"/>
                </div>
            </div>

            <div class="footer">
              <el-button
                type="primary"
                plain
                style="width: 120px"
                @click="toggleVisible"
                >暂不修改</el-button>
              <el-button
                type="primary"
                style="width: 120px"
                @click="edit">
                开始批量修改</el-button>
            </div>
        </el-drawer>

    </div>
</template>

<script>
import debounce from 'lodash/debounce'
import PictureQualification from '../PictureQualification'
export default {
  name: 'Qualification',
  components: {
    PictureQualification
  },
  props: {
    msg: String
  },
  data () {
    return {
      activeQualification: {},
      drawer: false,
      search: '',
      activeName: 'all',
      tabs: [
        {label: '全部', name: 'all', type: [true, false]},
        {label: '已配置', name: 'hasSet', type: [true]},
        {label: '未配置', name: 'noSet', type: [false]}
      ],
      originList: [
        {label: '智能设备>XR设备0', hasSet: false, value: 0},
        {label: '智能设备>XR设备1', hasSet: true, value: 1},
        {label: '智能设备>XR设备2', hasSet: false, value: 2},
        {label: '智能设备>XR设备3', hasSet: false, value: 3},
        {label: '智能设备>XR设备4', hasSet: false, value: 4},
        {label: '智能设备>XR设备5', hasSet: false, value: 5},
        {label: '智能设备>XR设备6', hasSet: false, value: 6},
        {label: '智能设备>XR设备7', hasSet: true, value: 7},
        {label: '智能设备>XR设备8', hasSet: false, value: 8},
        {label: '智能设备>XR设备9', hasSet: false, value: 9},
        {label: '智能设备>XR设备10', hasSet: false, value: 10},
        {label: '智能设备>XR设备11', hasSet: false, value: 11},
        {label: '智能设备>XR设备12', hasSet: false, value: 12},
        {label: '智能设备>XR设备13', hasSet: true, value: 13},
        {label: '智能设备>XR设备14', hasSet: false, value: 14},
        {label: '智能设备>XR设备15', hasSet: false, value: 15},
        {label: '智能设备>XR设备16', hasSet: false, value: 16},
        {label: '智能设备>XR设备17', hasSet: false, value: 17},
        {label: '智能设备>XR设备18', hasSet: false, value: 18}
      ],
      list: [],
      qualityList: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    open () {
      this.drawer = true
    },
    init () {
      this.handleClick()
    },
    handleClick () {
      const activeName = this.activeName
      let tab = this.tabs[0]
      tab = this.tabs.find(item => item.name === activeName)
      console.log(activeName, 'activeName')
      this.list = this.originList.filter(item => tab.type.includes(item.hasSet))
    },
    onSearch: debounce(function (value) {
      let tab = this.tabs[0]
      const activeName = this.activeName
      tab = this.tabs.find(item => item.name === activeName)
      const list = this.originList.filter(item => tab.type.includes(item.hasSet))
      this.list = list.filter(item => item.label.includes(value))
    }, 300),
    async setActiveQualification (qualification, idx) {
      this.activeQualification = qualification
      // const data = await this.getQualification({
      //   id: qualification.value
      // })
      let data = [
        {is_required: 0, quality_attachments: [], quality_key: '6921664838028542215', quality_name: 'CCC安全认证证书'},
        {is_required: 0, quality_attachments: [], quality_key: '3457058919409648559', quality_name: '报关单'},
        {is_required: 0, quality_attachments: [], quality_key: '3457058936748903145', quality_name: '委托进口协议'},
        {is_required: 0, quality_attachments: [], quality_key: '3457058945162709852', quality_name: '质检报告'}
      ]
      console.log(data, 'data')
      this.qualityList = data
    },
    handlePictureQualificationChange (value) {
      console.log(value, 'value')
    }
  }
}
</script>
<style lang="less" scoped>
@import '~./index.less';

</style>

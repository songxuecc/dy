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
                          <p @click="setActiveQualification(l,idx)" :class="[activeQualification.category_id === l.category_id ? 'active':'']">{{l.full_name}}</p>
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
                >返回</el-button>
              <el-button
                type="primary"
                style="width: 120px"
                @click="edit">
                保存</el-button>
            </div>
        </el-drawer>

    </div>
</template>

<script>
import debounce from 'lodash/debounce'
import PictureQualification from '../PictureQualification'
import servises from '@servises'

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
        {label: '全部', name: 'all', type: [1, 0]},
        {label: '已配置', name: 'is_config', type: [1]},
        {label: '未配置', name: 'is_no_config', type: [0]}
      ],
      originList: [
        {full_name: '智能设备>XR设备0', is_config: 0, category_id: 0},
        {full_name: '智能设备>XR设备1', is_config: 1, category_id: 1},
        {full_name: '智能设备>XR设备2', is_config: 0, category_id: 2},
        {full_name: '智能设备>XR设备3', is_config: 0, category_id: 3},
        {full_name: '智能设备>XR设备4', is_config: 0, category_id: 4},
        {full_name: '智能设备>XR设备5', is_config: 0, category_id: 5},
        {full_name: '智能设备>XR设备6', is_config: 0, category_id: 6},
        {full_name: '智能设备>XR设备7', is_config: 1, category_id: 7},
        {full_name: '智能设备>XR设备8', is_config: 0, category_id: 8},
        {full_name: '智能设备>XR设备9', is_config: 0, category_id: 9},
        {full_name: '智能设备>XR设备10', is_config: 0, category_id: 10},
        {full_name: '智能设备>XR设备11', is_config: 0, category_id: 11},
        {full_name: '智能设备>XR设备12', is_config: 0, category_id: 12},
        {full_name: '智能设备>XR设备13', is_config: 1, category_id: 13},
        {full_name: '智能设备>XR设备14', is_config: 0, category_id: 14},
        {full_name: '智能设备>XR设备15', is_config: 0, category_id: 15},
        {full_name: '智能设备>XR设备16', is_config: 0, category_id: 16},
        {full_name: '智能设备>XR设备17', is_config: 0, category_id: 17},
        {full_name: '智能设备>XR设备18', is_config: 0, category_id: 18}
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
    async init () {
      this.handleClick()
      this.setActiveQualification(this.originList[0])
      const catQualityList = await servises.userCatQualityList()
      console.log(catQualityList, 'catQualityList')
      this.originList = catQualityList
      // if (this.originList.length) {
      //   this.setActiveQualification(this.originList[0])
      // }
    },
    handleClick () {
      const activeName = this.activeName
      let tab = this.tabs[0]
      tab = this.tabs.find(item => item.name === activeName)
      console.log(activeName, 'activeName')
      this.list = this.originList.filter(item => tab.type.includes(item.is_config))
    },
    onSearch: debounce(function (id) {
      let tab = this.tabs[0]
      const activeName = this.activeName
      tab = this.tabs.find(item => item.name === activeName)
      const list = this.originList.filter(item => tab.type.includes(item.is_config))
      this.list = list.filter(item => item.full_name.includes(id))
    }, 300),
    async setActiveQualification (qualification, idx) {
      this.activeQualification = qualification
      // const data = await this.getQualification({
      //   id: qualification.category_id
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
    formatqualityList (qualityList) {
      return qualityList.map(item => {
        item.quality_attachments = item.quality_attachments.map(i => {
          i.uid = item.url
          return i
        })
        return item
      })
    },
    handlePictureQualificationChange (id) {
      // const list = this.formatqualityList(id)
      console.log(id, 'category_id')
    }
  }
}
</script>
<style lang="less" scoped>
@import '~./index.less';

</style>

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
                  <el-input v-model="search" placeholder="搜索类目关键词" style="width:340px;" size="small" @input="onSearch" clearable @clear="onClear"> </el-input>
                  <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane :label="tab.label" :name="tab.name" v-for="tab in tabs" :key="tab.name" v-loading="loadingCatQualityList">
                      <div class="list">
                        <div v-if="list.length > 0">
                          <div v-for="(l,idx) in list" :key="l.value" >
                            <p @click="setActiveQualification(l,idx)" :class="[activeQualification.category_id === l.category_id ? 'active':'']">
                              <span>{{l.full_name}}</span>
                              <span @click.stop="handleDelete(l)" class="delete" v-if="activeName === 'is_config'">删除</span>
                            </p>
                            <div class="border" v-if="idx !== list.length -1"></div>
                          </div>
                        </div>
                        <ElTableEmpty v-else/>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </div>
                <div class="right" v-loading="loadingQualityList">
                  <el-alert type="warning" style="height:30px"  :closable="false">
                    <span slot="title" class="color-333 font-12"><span class="fail">* </span>该类目下的所有商品都统一为以下资质</span>
                  </el-alert>
                  <PictureQualification :qualitys="qualityList"  @change="handlePictureQualificationChange" v-if="qualityList.length"/>
                  <ElTableEmpty v-else/>
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
                :loading="loadingSubmit"
                :disabled="loadingSubmit"
                @click="handleEdit">
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
      originList: [],
      list: [],
      qualityList: [],
      loadingQualityList: false,
      loadingCatQualityList: false,
      loadingSubmit: false,
      dataMap: new Map()
    }
  },
  created () {
    // this.init()
  },
  methods: {
    open () {
      this.drawer = true
      this.init()
    },
    async init () {
      this.dataMap = new Map()
      this.list = []
      this.qualityList = []
      this.activeName = 'all'
      this.search = ''
      this.activeQualification = {}
      this.loadingCatQualityList = true
      const catQualityList = await servises.userCatQualityList()
      this.originList = catQualityList
      this.loadingCatQualityList = false
      if (this.originList.length) {
        this.setActiveQualification(this.originList[0])
        this.handleClick()
      }
    },
    async refresh () {
      const catQualityList = await servises.userCatQualityList()
      this.originList = catQualityList
      this.handleClick()
      this.setActiveQualification(this.activeQualification)
    },
    handleClick () {
      const activeName = this.activeName
      let tab = this.tabs[0]
      tab = this.tabs.find(item => item.name === activeName)
      this.list = this.originList.filter(item => tab.type.includes(item.is_config))
    },
    onSearch: debounce(function (id) {
      let tab = this.tabs[0]
      const activeName = this.activeName
      tab = this.tabs.find(item => item.name === activeName)
      const list = this.originList.filter(item => tab.type.includes(item.is_config))
      this.list = list.filter(item => item.full_name.includes(id))
    }, 300),
    onClear () {
      let tab = this.tabs[0]
      const activeName = this.activeName
      tab = this.tabs.find(item => item.name === activeName)
      const list = this.originList.filter(item => tab.type.includes(item.is_config))
      this.list = list
    },
    async setActiveQualification (qualification) {
      this.activeQualification = qualification
      this.loadingQualityList = true
      const data = await servises.userCatQualityDetail({
        category_id: qualification.category_id
      })
      this.qualityList = data
      this.loadingQualityList = false
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
    handlePictureQualificationChange (qualification) {
      const id = this.activeQualification.category_id
      const dataMap = new Map(this.dataMap)
      dataMap.set(id, {
        category_id: id,
        quality_list: qualification
      })
      this.dataMap = dataMap
    },
    handleDelete (qualification) {
      const h = this.$createElement
      this.$confirm('', {
        message: h('div', null, [
          h('div', {
            class: 'center'
          }, [
            h('hh-icon', {
              props: {
                type: 'iconjinggao1'
              },
              class: 'DrawerQualification-icon'
            })
          ]),
          h('div', {
            class: 'DrawerQualification-text'
          }, '确定删除该类目下已配置的资质图片吗？')
        ]),
        type: 'warning',
        confirmButtonText: '确认',
        cancelButtonText: '点错了',
        customClass: 'DrawerQualification-customClass',
        cancelButtonClass: 'DrawerQualification-cancelButtonClass',
        confirmButtonClass: 'DrawerQualification-confirmButtonClass',
        showClose: false
      })
        .then(async (_) => {
          try {
            this.loadingCatQualityList = true
            await servises.userCatQualityDelete({
              category_id: qualification.category_id
            })
            this.refresh()
            this.loadingCatQualityList = false
            this.$message.success('删除配置成功')
          } catch (err) {
            this.$message.error(`${err}`)
            this.loadingCatQualityList = false
          }
        })
        .catch(_ => {
          return false
        })
    },
    async handleEdit () {
      try {
        const parmas = [...this.dataMap.values()]
        if (!parmas.length) return this.$message.warning('没有需要修改的资质配置')
        this.loadingSubmit = true
        await servises.userCatQualityCreate({
          cat_quality_list: JSON.stringify(parmas)
        })
        this.refresh()
        this.loadingSubmit = false
        this.$message.success('保存成功')
      } catch (err) {
        this.loadingSubmit = false
        this.$message.error(`${err}`)
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import '~./index.less';

</style>
<style lang="less">
.DrawerQualification-cancelButtonClass{
  font-size: 12px;
  margin-right: 10px;
  width: 120px;
  padding: 12px;
  border-color: #1D8FFF;
  color: #1D8FFF;
  font-size: 14px;
}

.DrawerQualification-confirmButtonClass{
  font-size: 12px;
  width: 140px;
  padding: 12px;
  font-size: 14px;
  background: #1D8FFF;
}

.DrawerQualification-icon {
  width: 50px;
  height: 50px;
  font-size: 50px;
}

.DrawerQualification-text {
  width: 364px;
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4E4E4E;
  line-height: 20px;
  text-align: center;
  margin-top: 16px;
  margin-bottom: 20px;
}

.DrawerQualification-customClass {
    padding-bottom: 20px;
    .el-message-box__header {
      padding-top: 0;
    }
    .el-message-box__btns {
      text-align: center;
    }
    .el-message-box__content {
      .el-message-box__message {
        padding-left: 0;
      }
      p {
        font-size: 18px;
        margin: 15px 0 10px;
        text-align: center;
      }
      .el-icon-warning {
        display: none;
      }
    }
}
</style>

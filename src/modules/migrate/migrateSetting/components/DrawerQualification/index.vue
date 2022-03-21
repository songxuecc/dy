<!--  -->
<template>
    <div>
        <el-drawer
            :visible.sync="drawer"
            :with-header="false"
            direction="rtl"
            :before-close="dialogBeforeClose"
            append-to-body
            size="80%">
            <div class="content">
                <div class="close" @click="triggerDrawerClose" v-show="drawer && !loadingCatQualityList"><hh-icon type="iconguanbi1" class="iconguanbi"></hh-icon></div>
                <div class="left">
                  <el-input v-model="search" placeholder="搜索类目关键词" style="width:340px;" size="small" @input="onSearch" clearable @clear="onClear"> </el-input>
                  <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane :label="tab.label" :name="tab.name" v-for="tab in tabs" :key="tab.name" v-loading="loadingCatQualityList">
                      <div class="list">
                        <div v-if="list.length > 0">
                          <div v-for="(l,idx) in getList(tab)" :key="l.value">
                            <p @click="setActiveQualification(l,idx)" :class="[activeQualification.category_id === l.category_id ? 'active':'']">
                              <span>{{l.full_name}}</span>
                              <span @click.stop="handleDelete(l,idx)" class="delete" v-if="activeName === 'is_config'">删除</span>
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
                    <span slot="title" class="color-333 font-12" v-if="activeQualification && activeQualification.category_id !== -1"><span class="fail">* </span>该类目下的所有商品都统一为以下资质</span>
                    <span slot="title" class="color-333 font-12" v-if="activeQualification && activeQualification.category_id === -1"><span class="fail">* </span>设置了通用类目资质图片后，默认会上传至拥有该资质的所有商品</span>
                  </el-alert>
                  <PictureQualification :qualitys="qualityList"  @change="handlePictureQualificationChange" v-if="qualityList.length" />
                  <ElTableEmpty v-else/>
                </div>
            </div>
            <div class="footer">
              <el-button
                type="primary"
                plain
                style="width: 120px"
                @click="triggerDrawerClose"
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
import services from '@services'
import cloneDeep from 'lodash/cloneDeep'

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
      originDataList: [],
      list: [],
      qualityList: [],
      loadingQualityList: false,
      loadingCatQualityList: false,
      loadingSubmit: false,
      dataMap: new Map(),
      deleteQualifications: []
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
      const catQualityList = await services.userCatQualityList()
      this.originDataList = cloneDeep(catQualityList)
      this.originList = cloneDeep(catQualityList)
      this.loadingCatQualityList = false
      if (this.originList.length) {
        this.handleClick()
      }
    },
    async refresh () {
      const catQualityList = await services.userCatQualityList()
      this.originList = catQualityList
      this.handleClick()
      this.deleteQualifications = []
      this.dataMap = new Map()
    },
    handleClick () {
      this.search = ''
      const activeName = this.activeName
      let tab = this.tabs[0]
      tab = this.tabs.find(item => item.name === activeName)
      const originList = this.originList
      // 点击tab的时候 更新数据的is_config 获取最新tab需要展示的list数据
      const dataMap = this.dataMap
      this.originList = originList.map(item => {
        if (dataMap.has(item.category_id)) {
          item.is_config = 1
        }
        return item
      })
      this.list = this.originList.filter(item => tab.type.includes(item.is_config))
      this.setActiveQualification(this.list[0])
    },
    getList (tab) {
      if (this.search) {
        const list = this.list.filter(item => tab.type.includes(item.is_config))
        return list
      } else {
        const list = this.originList.filter(item => tab.type.includes(item.is_config))
        return list
      }
    },
    onSearch: debounce(function (id) {
      let tab = this.tabs[0]
      const activeName = this.activeName
      tab = this.tabs.find(item => item.name === activeName)
      const list = this.originList.filter(item => tab.type.includes(item.is_config))
      this.list = list.filter(item => item.full_name.includes(id))
      console.log(this.list, 'this.list')
    }, 300),
    onClear () {
      let tab = this.tabs[0]
      const activeName = this.activeName
      tab = this.tabs.find(item => item.name === activeName)
      const list = this.originList.filter(item => tab.type.includes(item.is_config))
      this.list = list
    },
    async setActiveQualification (qualification) {
      if (!qualification) {
        this.qualityList = []
        return false
      }
      this.activeQualification = qualification
      const dataMap = new Map(this.dataMap)
      // 本地已经存在的配置数据就不请求
      if (dataMap.has(qualification.category_id)) {
        this.qualityList = dataMap.get(qualification.category_id).quality_list
      } else {
        this.loadingQualityList = true
        const data = await services.userCatQualityDetail({
          category_id: qualification.category_id,
          is_config: qualification.is_config
        })
        this.qualityList = data
        this.loadingQualityList = false
      }
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
    handlePictureQualificationChange (qualityList) {
      let isAdd = true
      if (qualityList.every(item => !item.quality_attachments.length)) {
        isAdd = false
      }
      console.log(isAdd, 'isAdd')
      // 添加资质
      if (isAdd) {
        const id = this.activeQualification.category_id
        const dataMap = new Map(this.dataMap)
        dataMap.set(id, {
          category_id: id,
          quality_list: qualityList
        })
        this.dataMap = dataMap
        const deleteQualifications = [...new Set(this.deleteQualifications)]
        this.deleteQualifications = deleteQualifications.filter(item => item !== id)
      } else {
        // 资质图片全部被删除
        this.handleDelete(this.activeQualification)
      }
      console.log(this.dataMap, 'this.dataMap')
      console.log(this.deleteQualifications, 'this.deleteQualifications ')
    },
    handleDelete (qualification) {
      const originList = this.originList
      originList.map((item, index) => {
        if (qualification.category_id === item.category_id) item.is_config = 0
        return item
      })
      this.originList = originList
      const activeName = this.activeName
      let tab = this.tabs[0]
      tab = this.tabs.find(item => item.name === activeName)
      this.list = originList.filter(item => tab.type.includes(item.is_config))
      const deleteQualifications = [...new Set(this.deleteQualifications)]
      deleteQualifications.push(qualification.category_id)
      this.deleteQualifications = deleteQualifications
      const dataMap = new Map(this.dataMap)
      if (dataMap.has(qualification.id)) {
        dataMap.delete(qualification.id)
        this.dataMap = dataMap
      }
      console.log(this.dataMap, 'this.dataMap')
      console.log(this.deleteQualifications, 'this.deleteQualifications ')
    },
    async handleEdit () {
      try {
        // 添加资质的参数
        const parmas = [...this.dataMap.values()]
        // 删除资质的参数
        const deleteQualifications = [...new Set(this.deleteQualifications)]
        console.log(parmas, '添加资质的参数')
        console.log(deleteQualifications, '删除资质的参数')
        if (!parmas.length && !deleteQualifications.length) {
          this.$message.warning('没有需要修改的资质配置')
          return false
        }
        // 不能超过20条图片上传的数据验证
        let isValid = true
        let validCategoryIdIndex
        let validCategoryIdlist

        parmas.forEach((item, idx) => {
          validCategoryIdIndex = idx
          validCategoryIdlist = item
          item.quality_list.forEach((list, index) => {
            if (list.quality_attachments.length > 20) {
              isValid = false
            }
          })
        })

        console.log(isValid, 'isValid')
        if (!isValid) {
          this.activeName = 'all'
          this.setActiveQualification(validCategoryIdlist, validCategoryIdIndex)
          this.$message.warning('每个属性最多上传20张，请重新修改')
          this.$nextTick(() => {
            let isError = document.getElementsByClassName('is-error')
            isError[0] && isError[0].scrollIntoView({
                // 滚动到指定节点
                // 值有start,center,end，nearest，当前显示在视图区域中间
              block: 'center',
                // 值有auto、instant,smooth，缓动动画（当前是慢速的）
              behavior: 'smooth'
            })
          })
          return false
        }
        if (parmas.length) {
          this.loadingSubmit = true
          await services.userCatQualityCreate({
            cat_quality_list: JSON.stringify(parmas)
          })
        }
        if (deleteQualifications.length) {
          this.loadingSubmit = true
          await services.userCatQualityDelete({
            category_id_list: JSON.stringify(this.deleteQualifications)
          })
        }
        this.refresh()
        this.loadingSubmit = false
        this.$message.success('保存成功')
      } catch (err) {
        this.loadingSubmit = false
        this.$message.error(`${err}`)
      }
    },
    triggerDrawerClose () {
      this.dialogBeforeClose(() => {
        this.drawer = false
      })
    },
    dialogBeforeClose (done) {
      const parmas = [...this.dataMap.values()]
      const deleteQualifications = [...new Set(this.deleteQualifications)]
      let b = parmas.length || deleteQualifications.length
      if (b) {
        this.$confirm('有未保存的修改，是否保存?', '提示', {
          confirmButtonText: '保存',
          cancelButtonText: '不保存'
        }).then(_ => {
          // 保存
          const e = this.handleEdit()
          if (e) {
            done()
          }
        }).catch(_ => { done() })
      } else {
        done()
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import '~./index.less';
</style>

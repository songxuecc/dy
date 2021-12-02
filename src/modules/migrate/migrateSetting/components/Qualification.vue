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
                      <div v-for="l in list" :key="l.value">
                        {{l.label}}
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </div>
                <div class="right">
                  <el-alert type="warning" style="height:30px" :closable="false">
                    <span slot="title" class="color-333 font-12"><span class="fail">* </span>该类目下的所有商品都统一为以下资质</span>
                  </el-alert>
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

export default {
  name: 'Qualification',
  props: {
    msg: String
  },
  data () {
    return {
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
        {label: '智能设备>XR设备6', hasSet: false, value: 6}
      ],
      list: []
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
    }, 300)
  }
}
</script>
<style lang="less" scoped>
.content {
  overflow: hidden;
  display: flex;
  padding: 37px 30px 0 33px;
  box-sizing: border-box;
  height: 100%;
  padding-bottom: 60px;
  .left {
    width: 340px;
  }
  .right {
    flex:1;
    overflow-y: scroll;
    padding-left: 30px;
  }
}

.footer {
  // flex justify-c align-c
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding:10px;
  // background:#fff;

}
</style>

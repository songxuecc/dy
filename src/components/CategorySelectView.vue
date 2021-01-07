<template lang="html">
    <div style="height: 450px;">
        <el-row v-loading="loadingCnt">
            <el-input v-model="cateSearchStr" size="mini" prefix-icon="el-icon-search" placeholder="请输入关键词搜索分类"
                      @keyup.enter.native="searchCategory"
            >
                <el-button slot="append" icon="el-icon-search" @click="searchCategory"></el-button>
            </el-input>
            <br><br>
            <el-card v-show="!searchTableVisible" shadow="never" :body-style="{ padding: '0px', display: 'flex' }">
                <div class="el-cascader-panel cate-content">
                    <el-scrollbar :ref="'cate' + i + 'List'" v-for="i in maxLevel" :key="i">
                        <ul class="el-scrollbar__view el-cascader-menu__list">
                            <li v-for="(item) in cateMultiList[i-1]" :key="item.id" @click="selectCategory(i, item.id, item.name, item.leaf)"
                                :class="['el-cascader-node', {'in-active-path': cateFamilyList[i-1].id == item.id }]"
                            >
                                <span> {{ item.name }} </span>
                                <i v-if="!item.leaf" class="el-icon-arrow-right el-cascader-node__postfix"></i>
                            </li>
                        </ul>
                    </el-scrollbar>
                </div>
            </el-card>
            <div v-show="searchTableVisible">
                <el-button type="text" icon="el-icon-arrow-left" @click="backToCateMultiList">返回选择</el-button>
                <ul ref="selectList" class="select-list" style="height: 220px;width: 750px">
                    <li v-for="(item, index) in searchRetList" :key="item.id" @click="selectSearchRet(index)"
                        class="select-list-item" :class="{'current-item': selectIndex == index }"
                    >
                        {{ item.categoryName }}
                    </li>
                </ul>
            </div>
            <div v-if="selectCate.name" class="el-select-dropdown el-popper tip-content" style="width: 728px" x-placement="bottom-start">
                <div x-arrow="true" class="popper__arrow" style="left: 35px;"></div>
                {{ "已选：" + selectCate.name }}
            </div>
            <br>
            <div  class="common-bottom">
                <el-button :disabled="selectCate.leaf !== 1" type="primary" @click="confirm">保存</el-button>
            </div>
        </el-row>
    </div>
</template>
<script>
import request from '@/mixins/request.js'
import { mapGetters, mapActions } from 'vuex'
export default {
  mixins: [request],
  components: {
  },
  data () {
    return {
      categoryId: 0,
      maxLevel: 4,
      cateSearchStr: '',
      cateMultiList: [],
      cateFamilyList: [],
      searchTableVisible: false,
      searchRetList: [],
      selectIndex: -1,
      selectCate: {}
    }
  },
  computed: {
    ...mapGetters({
      recentCatId: 'getRecentCatId',
      recentCatName: 'getRecentCatName',
      firstCategoryList: 'getFirstCategoryList'
    })
  },
  mounted () {
    this.resetCateFrom(1)
    this.getCategoryList(1, 0)
  },
  methods: {
    ...mapActions([
      'setRecentCat'
    ]),
    initCate (cateId = 0, cateName = '') {
      if (cateId === 0) {
        cateId = parseInt(this.recentCatId)
        cateName = this.recentCatName
      }
      if (cateId === 0) {
        return
      }
      this.categoryId = cateId
      this.request('getCategoryDetail', { category_id: cateId }, data => {
        data.id = cateId
        data.name = cateName
        this.toSelectCate(data)
        this.updateBySelectCate()
        // 如果商品的三级类目不在店铺的一级类目中，则不继续刷新二、三、四级类目
        let firstCategoryIdList = []
        for (let category of this.firstCategoryList) {
          firstCategoryIdList.push(category['id'])
        }
        for (let level of data.levels) {
          if (level.level === 1 && firstCategoryIdList.includes(level.id)) {
            this.updateBySelectCate()
            break
          }
        }
      }, function () {}, true)
    },
    resetCateFrom (level) {
      for (let i = level - 1; i < this.maxLevel; ++i) {
        this.$set(this.cateFamilyList, i, { id: -1, name: '' })
        this.$set(this.cateMultiList, i, {})
      }
    },
    getCategoryList (level, parentId) {
      this.request('getCategoryList', { parent_id: parentId }, data => {
        let dic = {}
        for (let key in data) {
          dic[ data[key].id ] = data[key]
        }
        this.$set(this.cateMultiList, level - 1, dic)
        this.updateScrollTop(level)
      })
    },
    selectCategory (level, id, name, leaf) {
      this.$set(this.cateFamilyList, level - 1, {id, name})
      this.resetCateFrom(level + 1)
      if (!leaf) {
        this.getCategoryList(level + 1, id)
      }

      let cate = {
        id,
        leaf,
        level,
        family_list: []
      }
      let fullName = ''
      for (let i = 0; i < level; ++i) {
        cate['family_list'][i] = this.cateFamilyList[i]
        fullName += i ? ' > ' : ''
        fullName += this.cateFamilyList[i].name
      }
      cate['name'] = fullName
      this.selectCate = cate
    },
    searchCategory () {
      if (!this.cateSearchStr) {
        return
      }
      this.searchTableVisible = true
      this.selectIndex = -1

      this.request('searchCategory', { keyword: this.cateSearchStr }, data => {
        this.$refs.selectList.scrollTop = 0
        if (data.length > 0) {
          data.forEach((item) => {
            for (let key in item) {
              if (key === 'levels' && (item[key].length > 0)) {
                item[key].forEach((em, index) => {
                  if (index !== (item[key].length - 1) && item.categoryName) {
                    item.categoryName += em.name + ' > '
                  } else if (index !== (item[key].length - 1) && !item.categoryName) {
                    item.categoryName = em.name + ' > '
                  } else {
                    item.categoryName += em.name
                  }
                })
              }
            }
          })
        }
        this.searchRetList = data
      })
    },
    selectSearchRet (index) {
      this.selectIndex = index
      let item = this.searchRetList[index]
      this.toSelectCate(item)
    },
    toSelectCate (item) {
      let cate = {
        id: item.id,
        leaf: 1,
        level: item.level,
        levels: item.levels,
        name: '',
        family_list: []
      }
      for (let i = 0; i < item.level; ++i) {
        if (i !== (item.level - 1)) {
          cate['name'] += item.levels[i].name + ' > '
        } else {
          cate['name'] += item.levels[i].name
        }
        cate['family_list'][i] = {
          id: item.levels[i].id,
          name: item.levels[i].name
        }
      }
      this.selectCate = cate
    },
    backToCateMultiList () {
      this.searchTableVisible = false
      if (this.selectIndex !== -1) {
        this.updateBySelectCate()
      }
    },
    updateBySelectCate () {
      // 小优化：第一级分类不去重新请求
      this.resetCateFrom(2)
      let parentId = 0
      for (let i = 0; i < this.selectCate.level; ++i) {
        this.$set(this.cateFamilyList, i, this.selectCate.family_list[i])
        if (i === 0) {
          this.updateScrollTop(1)
        } else {
          this.getCategoryList(i + 1, parentId)
        }
        parentId = this.selectCate.family_list[i].id
      }
    },
    updateScrollTop (level) {
      let cnt = 0
      let rowOffset = 0
      for (let key in this.cateMultiList[level - 1]) {
        let item = this.cateMultiList[level - 1][key]
        if (item.id === this.cateFamilyList[level - 1].id) {
          rowOffset = cnt
          break
        }
        cnt++
      }

      this.$nextTick(() => {
        let refName = 'cate' + level + 'List'
        if (level <= this.maxLevel && this.$refs[refName].length > 0) {
          this.$refs[refName][0].$refs['wrap'].scrollTop = (rowOffset - 4) * 30
        }
      })
    },
    confirm () {
      this.searchTableVisible = false
      this.cateSearchStr = ''
      this.setRecentCat(this.selectCate)
      this.$emit('changeCate', this.selectCate)
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/category.less';
</style>

<!-- 批量修改 -->
<template>
    <div class="batchEdit">
        <div class="content left">
        <title class="flex">
            <div v-for="(icon,index) in iconList" :key="index" :class="[index === editType ? 'iconBoxActive':'iconBox' , 'center','pointer']" @click="toggleEditType(index)">
            <hh-icon :type="index === editType ? icon.primary :icon.info" class="icon"></hh-icon>
            <p class="font-12 color-4e yaHei">{{ icon.text }}</p> </div>
            <!-- <span class="click" style="margin-top:104px">查看修改记录</span> -->
        </title>

        <div style="height:120px">
            <h1>修改范围</h1>
            <el-radio-group v-model="modifyMethods" class="mb-20">
                <el-radio-button label="area">按范围</el-radio-button>
                <el-radio-button label="product">按商品</el-radio-button>
                <el-radio-button label="id">按ID</el-radio-button>
            </el-radio-group>
            <el-form
                :model="ruleForm"
                ref="ruleForm"
                label-width="60px"
                class="demo-ruleForm"
                inline
                size="medium"
                v-show="modifyMethods === 'area'"
                label-position="left"
            >
                <el-form-item label="商品状态" prop="region">
                <el-select v-model="ruleForm.region" placeholder="请选择活动区域"  class="w-200 mr-20">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="发货模式" prop="region">
                <el-select v-model="ruleForm.region" placeholder="请选择活动区域"  class="w-200 mr-20">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="是否抓取" prop="region">
                <el-select v-model="ruleForm.region" placeholder="请选择活动区域"  class="w-200 mr-20">
                    <el-option label="是" value="shanghai"></el-option>
                    <el-option label="否" value="beijing"></el-option>
                </el-select>
                </el-form-item>
            </el-form>
            <div v-show="modifyMethods === 'product'">
            <el-button type="primary " class="w-120">选择修改商品</el-button> <span class="yaHei ml-10">已选 <span class="color-danger">0</span> 个商品</span>
            </div>
            <div class="flex align-c" v-show="modifyMethods === 'id'">
            <span class="color-4e yaHei font-12 mr-10">输入商品ID</span>
            <el-input
                type="textarea"
                autosize
                placeholder="输入多个商品ID,以换行分隔，最多可输入5000个"
                v-model="textarea1"
                style="flex:1">
            </el-input>
            <span class="click ml-10">确认</span>
            </div>
        </div>

        <h1 class="mt-30">修改内容</h1>
        <Shelves v-if="editType === 0"/>
        <Title v-if="editType === 1"/>
        <Stocks v-if="editType === 2"/>
        <Price v-if="editType === 3"/>
        <DeliverMode v-if="editType === 4"/>
        </div>
        <div class="flex justify-c mt-20"><el-button type="primary" class="w-120" @click="toggleVisible">效果修改预览</el-button></div>

        <TablePrice :visible.sync="visible" />
    </div>
</template>

<script>

import Title from '@productsManagement/batchEdit/components/Title'
import Shelves from '@productsManagement/batchEdit/components/Shelves'
import DeliverMode from '@productsManagement/batchEdit/components/DeliverMode'
import Stocks from '@productsManagement/batchEdit/components/Stocks'
import Price from '@productsManagement/batchEdit/components/Price'
import TablePrice from '@productsManagement/batchEdit/components/TablePrice'

export default {
  components: {
    Title,
    Shelves,
    DeliverMode,
    Stocks,
    Price,
    TablePrice
  },
  data () {
    return {
      editType: 0,
      modifyMethods: 'area',
      ruleForm: {},
      visible: false,
      iconList: [
        {
          primary: 'iconshangxiajiaxuanzhong',
          info: 'iconshangxiajiaweixuanzhong',
          index: 0,
          text: '上下架'
        },
        {
          primary: 'iconbiaotixuanzhong',
          info: 'iconbiaotiweixuanzhong',
          index: 1,
          text: '标题'
        },
        {
          primary: 'iconkucunxuanzhong',
          info: 'iconkucunweixuanzhong',
          index: 2,
          text: '库存'
        },
        {
          primary: 'iconjiagexuanzhong',
          info: 'iconjiageweixuanzhong',
          index: 3,
          text: '价格'
        },
        {
          primary: 'iconfahuomoshixuanzhong',
          info: 'iconfahuomoshiweixuanzhong',
          index: 4,
          text: '发货模式'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  updated () {},
  methods: {
    // 事件名称
    toggleEditType (index) {
      this.editType = index
    },
    toggleVisible (index) {
      this.visible = true
    }
  }
}
</script>

<style lang='less' scoped>
//@import url(); 引入公共css类
@import '~./index.less';
</style>

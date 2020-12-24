<!-- /setting/shopbind 绑定店铺-->
<template>
  <div class='setting-shopbind'>
    <el-row>
        <el-col :span="12"><CardRealizableAfterBind /></el-col>
        <el-col :span="12"><EditHowToBindStore /></el-col>
    </el-row>
    <TableShopManagement />
  </div>
</template>

<script>
import CardRealizableAfterBind from './CardRealizableAfterBind'
import EditHowToBindStore from './EditHowToBindStore'
import TableShopManagement from './TableShopManagement'
export default {
  data () {
    return {

    }
  },
  components: {
    CardRealizableAfterBind,
    EditHowToBindStore,
    TableShopManagement
  },
  computed: {},
  watch: {},
  created () {

  },
  mounted () {
  },
  updated () { },
  methods: {
    // 事件名称
    methodsName () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang='less' scoped>

.setting-shopbind {
    // padding: 40px 0 30px 28px;
}

</style>

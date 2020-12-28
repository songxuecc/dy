<!-- /setting/shopbind 绑定店铺-->
<template>
  <div class='setting-shopbind'>
    <div class="section">
      <CardRealizableAfterBind class="CardRealizableAfterBind"/>
      <EditHowToBindStore />
    </div>
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
  text-align:left;
    .section{
      display: flex;
      margin-bottom: 30px;
      .CardRealizableAfterBind {
        margin-right: 20px;
      }
    }
    .radio {
      margin-bottom: 14px;
    }
}

</style>

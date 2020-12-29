<template slot="empty">
  <div class="table-empty">
    <hh-icon type="icon-table-empty" style="font-size:300px;"/>
    <div class="empty-text">这里暂时什么都没有哦～</div>
    <hh-icon type="icon-quxiao1" style="font-size:300px;"/>
  </div>
</template>

<script>
import '@/assets/icon/icons/icon-table-empty.svg'
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="less" >
 .hhgj-table {
  .table-empty {
    svg {
      width:154px;
      height:120px;
      margin-top:60px
    }
    .empty-text{
      font-size: 14px;
      color: #969696;
      line-height: 20px;
    }
  }
  /deep/ .el-table__body tr:hover>td {
    background-color: #F2F8FF;
  }
  /deep/ th.is-leaf {
    border-bottom: 0;
  }

  /deep/ .cell-padding-zero {
    /deep/ .cell{
      padding-left:0;
      padding-right: 0;
    }
  }

  /deep/ .cell {
    font-size: 13px;
    color: #333333;
    font-weight: 400;
  }

  /deep/ .is-leaf {
      padding: 0;
      .cell {
        text-align: center;
          height: 40px;
          background: #F9F9F9;
          font-size: 12px;
          font-weight: normal;
          color: #1A1A1A;
          padding-top: 8px;
          padding-bottom: 8px;
      }
  }
}
</style>

<!--  -->
<template>
    <div class="ModalSingleSkuList">
      <div class="priceChange">
        <el-radio v-model="radio" label="1">
          <span>(原sku价-</span>
          <el-input
            size="mini"
            style="width:100px;"
            v-model="subtraction1 "
            @focus="radio='1'"/>
          <span>) x</span>
          <el-input
            size="mini"
            style="width:100px;"
            v-model="subtraction2"
            @focus="radio='1'"/>
          <span>% -</span>
          <el-input
            size="mini"
            style="width:100px;"
            v-model="subtraction3"
            @focus="radio='1'"/>
        </el-radio>
        <el-radio v-model="radio" label="2">
          <span>统一价格为</span>
          <el-input
            size="mini"
            style="width:100px;"
            v-model="textPrice"
            @focus="radio='2'" />
        </el-radio>
      </div>

      <!-- sku价格表 -->
        <el-table
          ref="skuListTable"
          :data="data"
          row-key="tp_product_id"
          style="width: 100%"
          :cell-class-name="cellClassName">
            <el-table-empty slot="empty"/>
            <el-table-column v-for="(item, index) in skuPropertyList" :key="index+':'+item.id">
                <template slot="header" slot-scope="scope">
                    <span :style="{color: (item.filter ? '#409EFF' : '#909399')}">{{ item.name }}</span>
                    <!-- <el-dropdown v-if="skuPropertyValueMap[item.id] && Object.keys(skuPropertyValueMap[item.id]).length > 1"
                                 style="line-height:0px; padding-left: 0px; cursor:pointer; vertical-align: middle;"
                                 trigger="click" :hide-on-click="false"  placement="bottom"
                    >
                                <span class="el-dropdown-link">
                                  <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                        <el-dropdown-menu slot="dropdown" style="max-height: 250px; overflow: auto; overflow-x:hidden;">
                            <el-dropdown-item v-for="(ele, vid) in skuPropertyValueMap[item.id]" :key="vid">
                                <div style="display:flex">
                                    <el-checkbox v-model="ele.checked" @change="onSkuFilter">{{ele.value}}</el-checkbox>
                                </div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown> -->
                </template>
                <template slot-scope="scope">
                    {{ scope.row.property_list[index].name }}
                </template>
            </el-table-column>
            <el-table-column key="3" width="150" align="center">
                <template slot="header" slot-scope="scope">
                    <span>sku价格</span>
                </template>
                <template slot-scope="scope">
                    <div style="display: flex">
                        <div >
                            <el-input
                              v-model="scope.row.promo_price"
                              size="mini"
                              @input="inputChange(scope.row,'promo_price')"
                              :class="['input-medium', promoPriceClass(scope.row,scope.$index)]"
                              style="width: 100%; "
                            >
                                <i class="el-icon-error el-input__icon"
                                   v-if="isEdited(scope.row, 'promo_price')"
                                   slot="suffix"
                                   @click="handleCancelEdit(scope.row, 'promo_price')">
                                </i>
                            </el-input>
                        </div>
                        <div style="width: 16px; display:flex; align-items:center;">
                            <el-tooltip v-if="scope.row.msgGroupError !== ''" placement="top" :content="scope.row.msgGroupError">
                                <span style="display:inline-block; height:16px; line-height:16px; font-size: 16px;">
                                    <i class="el-icon-warning warn" style=""></i>
                                </span>
                            </el-tooltip>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column key="3" width="250" align="center">
                <template slot="header" slot-scope="scope">
                    <span>原划线价</span>
                </template>
                <template slot-scope="scope">
                    <div style="display: flex">
                        <div class="great" style="width: 100%; padding-left: 18px; font-size: 16px;">
                          {{scope.row.originPrice}}
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column key="5" label="预览图" width="100" align="center" class-name="cell-tight">
                <template slot-scope="scope">
                    <img style="height:40px" :src="scope.row.img">
                </template>
            </el-table-column>
        </el-table>
        <div class="btns">
          <el-button style="width: 120px" @click="handleCancelBatchEdit">取消</el-button>
          <el-button style="width: 120px" type="primary" @click="handleSureBatchEdut">确定</el-button>
        </div>

    </div>
</template>

<script>
export default {
  name: 'ModalSingleSkuList',
  props: {
    data: Object
  },
  data () {
    return {
    }
  }
}
</script>
<style lang="less" scoped>

.ModalSingleSkuList {
  /deep/ .el-table td, .el-table th{
    padding: 2px 0 !important;
  }
  .priceChange{
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #F3F9FF;
    border: 1px dashed #1D8FFF;
    margin-bottom: 20px;
    padding-bottom: 20px;
    padding-top: 20px;
    margin-top: 20px;
    span {
      font-size: 12px;
      color: #4E4E4E;
    }
    /deep/ .el-input__inner{
      font-size:18px;
      color:#1D8FFF;
    }

  }
  .btns{
    margin-top: 20px ;
    display: flex;
    justify-content: center;
  }
}

</style>

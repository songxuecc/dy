<!--  -->
<template>
    <div class="card">
        <h1>服务与资质</h1>
        <el-form-item class="item" label="运费模版:" prop="cost_template_id">
            <el-select v-model="cost_template_id" placeholder="请选择" size="small" @change="check" style="width:150px">
                <el-option
                :label="template_name"
                :value="id"
                v-for="(costTemplate,index) in costTemplateList"
                :key="index"></el-option>
            </el-select>
            <el-button type="text" @click="getCostTemplateList"><hh-icon type="iconjiazai" style="font-size:12px;"/>刷新</el-button>
            <el-button type="text" @click="open()">添加运费模版</el-button>
        </el-form-item>

        <el-form-item class="item" label="售后服务:"  prop="supply_7day_return">
            <el-radio-group v-model="supply_7day_return">
                <el-radio :label="1">支持7天无理由退换货</el-radio>
                <el-radio :label="2">支持7天无理由退换货(拆封后不支持)</el-radio>
                <el-radio :label="0">不支持7天无理由退换货</el-radio>
<!--                    <el-radio :label="2">支持（拆封后不支持）</el-radio>-->
            </el-radio-group>
            <!-- <div style="position: absolute;top: 17px;left: 352px;color: #E02020; font-size: 1px;color:#FA6400" v-if="!supply_7day_return">仅少数商品可选，一般商品不要选择此项</div>
            <el-link  :underline="false" style="margin-left: 130px; color: #1D8FFF; font-size: 1px;" @click="dySupplyImgVisible = !dySupplyImgVisible" v-if="!supply_7day_return">什么商品可以不支持7天无理由退换货</el-link>
            <el-dialog :visible.sync="dySupplyImgVisible">
                <el-image
                :src="dySupplyImg"
                fit="fit">
                </el-image>
            </el-dialog> -->

        </el-form-item>

         <el-form-item class="item" label="客服电话:" prop="mobile" >
            <el-input v-model="mobile"  class="input-num" @input="check" style="width:150px"></el-input>
        </el-form-item>

        <el-form-item class="item"  label="商家备注">
            <el-input type="textarea" :autosize="{ minRows: 4}" placeholder="请输入内容" v-model="remark" style="width:590px"></el-input>
        </el-form-item>
    </div>
</template>

<script>
export default {
  name: 'component_name',
  props: {
    msg: String
  },
  data () {
    return {
      dySupplyImg: 'https://img.pddpic.com/mms-material-img/2021-04-21/091fb3a4-fa82-49eb-9821-229aaa330567.png.a.jpeg',
      dySupplyImgVisible: false
    }
  }
}
</script>
<style lang="less" scoped>
.item {
        padding-bottom: 10px;
        box-sizing: border-box;
    }

    .card {
      background: #f9f9fa;
      border-radius: 4px;
      margin-bottom: 16px;
      padding: 24px 24px 1px;
    }
    h1 {
        color: #333;
        font-size: 16px;
        margin-bottom: 20px;
        font-family: yahei;
    }
</style>

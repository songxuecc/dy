<!--  -->
<template>
  <div class="left">
    <p>创建商品计划</p>
    <el-divider></el-divider>

    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="计划名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="计划类型">
        <el-radio-group v-model="form.resource">
          <el-radio label="检测变化并提交修改"></el-radio>
          <el-radio label="仅检测变化，需人工提交修改"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="配置内容">
        <el-checkbox-group v-model="form.type">
          <el-checkbox
            label="同步上下架"
            name="type"
            style="display: block"
          ></el-checkbox>
          <el-checkbox
            label="同步商品库存"
            name="type"
            style="display: block"
          ></el-checkbox>

          <el-form-item style="margin-left: 15px">
            <el-radio-group v-model="form.resource">
              <el-radio
                label="若是阶梯发货，按照搬家时的设置分配现货库"
                style="display: block"
              ></el-radio>
              <el-radio
                label="若是阶梯发货，重新设置分配现货库存和阶梯"
                style="display: block"
              ></el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item style="margin-left: 40px">
            <span class="font-12 color-4e">现货库存设置为原库存的</span>
            <el-input v-model="form.name" class="price-sku-input"></el-input>
            <span class="font-12 color-4e"
              >%（原商品库存=现货库存+阶梯库存</span
            >
          </el-form-item>

          <el-checkbox
            label="同步商品价格"
            name="type"
            style="display: block"
          ></el-checkbox>

          <el-form-item style="margin-left: 15px">
            <el-radio-group v-model="form.resource">
              <el-radio
                label="按照搬家时的设置调整价格"
                style="display: block"
              ></el-radio>
              <el-radio
                label="重新设置公式调整价格"
                style="display: block"
              ></el-radio>

              <div class="price price-text">
                <el-form-item style="display: inline-block">
                  sku价格 = 原价 -
                  <el-input
                    class="price-sku-input"
                    v-model="form.name"
                  ></el-input>
                  x
                  <el-input
                    class="price-sku-input"
                    v-model="form.name"
                  ></el-input>
                  -
                  <el-input
                    class="price-sku-input"
                    v-model="form.name"
                  ></el-input>
                </el-form-item>

                <el-form-item style="display: inline-block" label="售卖价" class="mr-20">
                  <el-radio-group v-model="form.resource">
                    <el-radio label="最低价" style="width:40px"></el-radio>
                    <el-radio label="最高价" style="width:40px"></el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item style="display: inline-block" class="ml-20">
                  划线价 = 原划线价 x
                  <el-input
                    class="price-sku-input"
                    v-model="form.name"
                  ></el-input>
                  -
                  <el-input
                    class="price-sku-input"
                    v-model="form.name"
                  ></el-input>
                </el-form-item>
                <el-form-item style="display: inline-block">
                  <span
                    class="color-primary pointer"
                    @click="toggleIsShowSample"
                  >
                    查看示例
                  </span>
                </el-form-item>
              </div>
            </el-radio-group>
          </el-form-item>

          <el-checkbox
            label="同步商品标题"
            name="type"
            style="display: block"
          ></el-checkbox>

          <el-form-item style="margin-left: 15px">
            <el-radio-group v-model="form.resource" style="margin-left: 15px">
              <el-radio
                label="按照搬家时的设置调整标题"
                style="display: block"
              ></el-radio>
              <el-radio
                label="重新设置公式调整标题"
                style="display: block"
              ></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-checkbox-group>
      </el-form-item>
    </el-form>

    <el-dialog
      title="价格示例"
      :visible.sync="isShowSample"
      width="30%"
      :append-to-body="true"
    >
      <el-image
        src="https://sf1-ttcdn-tos.pstatp.com/obj/ecom-luban-cdn/shopfxg3/images/Z9gCP.png"
      >
        <div slot="placeholder" class="image-slot">
          <hh-icon type="iconwuzhaopian" style="font-size: 390px"></hh-icon>
          <div class="info mt-20">加载中...</div>
        </div>
      </el-image>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isShowSample = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <div>
      <el-button @click="goback" plain type="primary" style="width: 120px"
        >取消</el-button
      >
      <el-button @click="goback" type="primary" style="width: 120px"
        >创建同步任务</el-button
      >
    </div>
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
      isShowSample: false,
      form: {
        type: []
      }
    }
  },
  methods: {
    goback () {
      this.$emit('goback')
    },
    toggleIsShowSample () {
      this.isShowSample = true
    }
  }
}
</script>
<style lang="less" scoped>
.price {
  height: 44px;
  background: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #e5e5e5;
  padding: 2px 18px 0;
  margin-left: 25px;
}

.price-text {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #4e4e4e;
  line-height: 19px;
}
.price-sku-input {
  display: inline;
  margin: 0 5px;
  /deep/ .el-input__inner {
    padding: 2px;
    width: 44px;
    height: 24px;
    border-radius: 4px;
    border: 1px solid #1d8fff;
    font-weight: bold;
  }
}
.price-sale-input {
  /deep/ .el-input__inner {
    padding: 5px;
    width: 110px;
    height: 38px;
    border-radius: 4px;
    border: 1px solid #ebebeb;
    font-size: 18px;
    font-family: MicrosoftYaHei;
    color: #4e4e4e;
    line-height: 24px;
    font-weight: bold;
  }
}

// .price {
//   width: 103px;
//   height: 24px;
//   font-size: 18px;
//   font-family: MicrosoftYaHei;
//   color: #4e4e4e;
//   line-height: 24px;
//   font-weight: bold;
// }
</style>

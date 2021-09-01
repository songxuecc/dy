<!--  -->
<template>
  <div class="left" style="padding-left: 10px">
    <p class="title">创建商品计划</p>
    <el-divider></el-divider>

    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="计划名称" size="small">
        <el-input v-model="form.name" style="width: 300px"></el-input>
      </el-form-item>

      <el-form-item label="计划类型">
        <el-radio-group v-model="form.type">
          <el-radio label="检测变化并提交修改"></el-radio>
          <el-radio label="仅检测变化，需人工提交修改"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="配置内容">
        <el-checkbox-group v-model="form.content">
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
            <el-radio-group v-model="form.store_template">
              <el-radio :label="0" style="display: block"
                >若是阶梯发货，按照搬家时的设置分配现货库</el-radio
              >
              <el-radio :label="1" style="display: block"
                >若是阶梯发货，重新设置分配现货库存和阶梯</el-radio
              >
            </el-radio-group>
          </el-form-item>

          <el-form-item style="margin-left: 40px" v-if="form.store_template">
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
            <el-radio-group v-model="form.price_template">
              <el-radio :label="0" style="display: block"
                >按照搬家时的设置调整价格</el-radio
              >
              <el-radio :label="1" style="display: block"
                >重新设置公式调整价格</el-radio
              >

              <div class="price price-text" v-if="form.price_template">
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

                <el-form-item
                  style="display: inline-block"
                  label="售卖价"
                  class="mr-20"
                >
                  <el-radio-group v-model="form.resource">
                    <el-radio label="最低价" style="width: 40px"></el-radio>
                    <el-radio label="最高价" style="width: 40px"></el-radio>
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

          <el-form-item style="margin-left: 30px">
            <el-radio-group v-model="form.title_template">
              <el-radio :label="0" style="display: block"
                >按照搬家时的设置调整标题</el-radio
              >
              <el-radio :label="1" style="display: block"
                >重新设置公式调整标题</el-radio
              >
            </el-radio-group>

            <div style="margin-left: 30px" v-if="form.title_template">
              <div>
                <el-form-item
                  style="display: inline-block; width: 300px"
                  size="small"
                >
                  <el-input
                    clearable
                    @clear="handleClear('source_str')"
                    v-model="form.source_str"
                    @focus="handleCheck('is_replace')"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="原标题"
                  style="display: inline-block; width: 300px"
                  label-width="65px"
                  class="ml-10"
                  size="small"
                >
                  <el-input
                    clearable
                    @clear="handleClear('target_str')"
                    v-model="form.target_str"
                    @focus="handleCheck('is_replace')"
                  ></el-input>
                </el-form-item>
              </div>

              <div>
                <el-form-item
                  style="display: inline-block; width: 300px"
                  size="small"
                >
                  <el-input
                    clearable
                    @clear="handleClear('source_str')"
                    v-model="form.source_str"
                    @focus="handleCheck('is_replace')"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="替换为"
                  style="display: inline-block; width: 300px"
                  label-width="65px"
                  class="ml-10"
                  size="small"
                >
                  <el-input
                    clearable
                    @clear="handleClear('target_str')"
                    v-model="form.target_str"
                    @focus="handleCheck('is_replace')"
                  ></el-input>
                </el-form-item>
              </div>
              <el-form-item
                label="关键词删除"
                size="small"
                style="width: 613px; margin-top: 2px"
              >
                <el-input
                  clearable
                  v-model="form.delete_str"
                ></el-input>
              </el-form-item>

              <el-form-item label-width="95px" size="small">
                <span slot="label">超过30个字：</span>
                <el-radio-group v-model="form.title_cut_type">
                  <el-radio :label="1" style="width: 100px"
                    >自动去末尾</el-radio
                  >
                  <el-radio :label="2" style="width: 100px"
                    >自动去开头</el-radio
                  >
                  <el-radio :label="3" style="width: 100px">不处理</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label-width="95px" size="small">
                <span slot="label">删除指定内容</span>
                <el-checkbox-group v-model="form.cut_type_list">
                  <el-checkbox label="is_cut_alpha" style="width: 100px"
                    >删除英文</el-checkbox
                  >
                  <el-checkbox label="is_cut_digit" style="width: 100px"
                    >删除数字</el-checkbox
                  >
                  <el-checkbox label="is_cut_brackets"
                    >删除括号以及括号里的内容</el-checkbox
                  >
                </el-checkbox-group>
              </el-form-item>
            </div>
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

    <div class="center btn">
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
        content: [],
        cut_type_list: []
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
/deep/ .el-form-item {
  margin-bottom: 2px;
}
.title {
  width: 84px;
  height: 19px;
  font-size: 14px;
  font-family: MicrosoftYaqiHeiLight;
  color: #333333;
  line-height: 19px;
  margin-top: 30px;
}

/deep/ .el-divider--horizontal {
  margin: 14px 0;
}

.btn {
  margin-top: 40px;
}
</style>

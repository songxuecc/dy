<!-- 库存 -->
<template>
    <div>
        <div class="flex">
            <el-form ref="form" :model="form" size="small" label-position="left">
                <el-radio-group v-model="presell_type" class="mb-10 flex column" style="width:280px">
                    <el-radio :label="0">
                        <el-form-item class="block">
                            原价*
                            <el-input-number controls-position="right" @change="handleChange"
                                :picker-options="pickerOptions" :min="3" :max="15" class="input-number" />%+
                            <el-input-number controls-position="right" @change="handleChange"
                                :picker-options="pickerOptions" :min="3" :max="15" class="input-number" />-
                            <el-input-number controls-position="right" @change="handleChange"
                                :picker-options="pickerOptions" :min="3" :max="15" class="input-number" />
                        </el-form-item>
                    </el-radio>
                    <el-radio :label="1">
                        <el-form-item class="block">
                            价格统一为
                            <el-input-number controls-position="right" @change="handleChange"
                                :picker-options="pickerOptions" :min="3" :max="15" class="input-number" />
                        </el-form-item>
                    </el-radio>
                </el-radio-group>

                <el-form-item class="block" label="误操作防范：">
                    <el-form-item>
                        <el-checkbox-group v-model="checkList">
                            <el-checkbox label="复选框 A">
                                <el-form-item label="新价格不低于">
                                    <el-input-number controls-position="right" :min="3" :max="15"
                                        class="input-number" />
                                </el-form-item>
                            </el-checkbox>
                            <el-checkbox label="复选框 A">
                                <el-form-item label="新价格不低于原价的">
                                    <el-input-number controls-position="right" :min="3" :max="15"
                                        class="input-number" />
                                </el-form-item>
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form-item>
            </el-form>
        </div>
        <p class="tip"> <span class="fail">*</span>注：为保证审核通过，修改后划线价自动调为sku最高价，售卖价调为sku最低价。</p>
    </div>

</template>

<script>
export default {
  name: 'Stocks',
  props: {
    msg: String
  },
  data () {
    return {
      form: {},
      checkList: []
    }
  }
}
</script>
<style lang="less" scoped>
    .block {
        display: inline-block;
    }

    .tip{
        width: 441px;
        height: 16px;
        font-size: 12px;
        font-family: MicrosoftYaqiHeiLight;
        color: #4E4E4E;
        line-height: 16px;
    }
</style>

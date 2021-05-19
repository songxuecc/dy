<!-- 库存 -->
<template>
    <div class="flex">
        <div >
            <p class="font-12">若商品是现货或预售发货模式</p>
            <el-form ref="form" :model="form" size="small" label-position="left" >
                    <el-radio-group v-model="presell_type" class="mb-10 flex column" style="width:280px">
                        <el-radio  :label="0">
                            <el-form-item label-width="80px" class="block" label="库存统一增加">
                                <el-input-number
                                    controls-position="right"
                                    @change="handleChange"
                                    :picker-options="pickerOptions"
                                    :min="3"
                                    :max="15"
                                    class="input-number" />
                            </el-form-item>
                        </el-radio>
                        <el-radio  :label="1">
                            <el-form-item label-width="80px" class="block" label="库存统一减少">
                                <el-input-number
                                    controls-position="right"
                                    @change="handleChange"
                                    :picker-options="pickerOptions"
                                    :min="3"
                                    :max="15"
                                    class="input-number" />
                            </el-form-item>
                        </el-radio>
                        <el-radio  :label="2">
                            <el-form-item label-width="80px" class="block" label="库存统一为">
                                <el-input-number
                                    controls-position="right"
                                    @change="handleChange"
                                    :picker-options="pickerOptions"
                                    :min="3"
                                    :max="15"
                                    class="input-number" />
                            </el-form-item>
                        </el-radio>
                    </el-radio-group>
            </el-form>
        </div>

        <div>
            <p class="font-12">若商品是现货或预售发货模式</p>
            <el-form ref="form" :model="form" size="small" label-position="left" class="flex" >
                    <el-radio-group v-model="presell_type" class="mb-10  flex column" style="width:250px">
                        <el-radio  :label="0">
                            <el-form-item label-width="80px" class="block" label="库存统一增加">
                                <el-input-number
                                    controls-position="right"
                                    @change="handleChange"
                                    :picker-options="pickerOptions"
                                    :min="3"
                                    :max="15"
                                    class="input-number" />
                            </el-form-item>
                        </el-radio>
                        <el-radio  :label="1">
                            <el-form-item label-width="80px" class="block" label="库存统一减少">
                                <el-input-number
                                    controls-position="right"
                                    @change="handleChange"
                                    :picker-options="pickerOptions"
                                    :min="3"
                                    :max="15"
                                    class="input-number" />
                            </el-form-item>
                        </el-radio>
                        <el-radio  :label="2">
                            <el-form-item label-width="80px" class="block" label="库存统一为">
                                <el-input-number
                                    controls-position="right"
                                    @change="handleChange"
                                    :picker-options="pickerOptions"
                                    :min="3"
                                    :max="15"
                                    class="input-number" />
                            </el-form-item>
                        </el-radio>
                    </el-radio-group>

                    <el-radio-group v-model="presell_type" class="mb-10 flex column" style="width:280px">
                        <el-radio  :label="0">
                            <el-form-item label-width="105px" class="block" label="阶梯库存统一增加">
                                <el-input-number
                                    controls-position="right"
                                    @change="handleChange"
                                    :picker-options="pickerOptions"
                                    :min="3"
                                    :max="15"
                                    class="input-number" />
                            </el-form-item>
                        </el-radio>
                        <el-radio  :label="1">
                            <el-form-item label-width="105px" class="block" label="阶梯库存统一减少">
                                <el-input-number
                                    controls-position="right"
                                    @change="handleChange"
                                    :picker-options="pickerOptions"
                                    :min="3"
                                    :max="15"
                                    class="input-number" />
                            </el-form-item>
                        </el-radio>
                        <el-radio  :label="2">
                            <el-form-item label-width="105px" class="block" label="阶梯库存统一为">
                                <el-input-number
                                    controls-position="right"
                                    @change="handleChange"
                                    :picker-options="pickerOptions"
                                    :min="3"
                                    :max="15"
                                    class="input-number" />
                            </el-form-item>
                        </el-radio>
                    </el-radio-group>
            </el-form>
        </div>

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
      form: {}
    }
  }
}
</script>
<style lang="less" scoped>

.block {
    display: inline-block;
}
</style>

<!--  -->
<template>
  <el-image
      :style="style"
      :src="src"
      fit="contain"
      v-bind="$attrs"
      :preview-src-list="[src]"
      >
      <div slot="error" class="flex align-c" style="height:100%">
          <hh-icon  type="icontupianjiazaishibai03" style="font-size:30px" />
      </div>
  </el-image>
</template>

<script>
export default {
  name: 'HhImage',
  props: {
    style: Object,
    src: String
  },
  data () {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
</style>

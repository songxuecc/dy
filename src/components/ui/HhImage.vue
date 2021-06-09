<!--  -->
<template>
    <el-image
        :style="style"
        :src="url"
        fit="contain"
        :preview-src-list="[url]"
        >
        <div slot="placeholder">
            <hh-icon  type="iconwuzhaopian" style="font-size:50px" />
        </div>
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
    url: String
  },
  data () {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
</style>

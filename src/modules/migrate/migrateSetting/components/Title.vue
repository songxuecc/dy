<template>
    <el-steps :icon="true" :active="2" class="left title">
        <el-step >
            <div slot="icon"><hh-icon type="iconfuzhi1" style="font-size:40px" /> </div>
            <div slot="title" class="color-4e font-12 ml">选择复制</div>
        </el-step>
        <el-step >
            <div slot="icon"><hh-icon type="iconshezhi" style="font-size:40px" /> </div>
            <div slot="title"  class="color-primary font-12 ml" >复制设置</div>
        </el-step>
        <el-step >
            <div slot="icon"><hh-icon type="iconzhuaqu" style="font-size:40px" /> </div>
            <div slot="title"  class="color-4e font-12 ml">开始复制</div>
        </el-step>
    </el-steps>
</template>

<script>
export default {
  name: 'title',
  props: {
    msg: String
  },
  data () {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
.ml {
    margin-left: -10px;
}

.title {
  padding: 20px 30px 0;
}
</style>

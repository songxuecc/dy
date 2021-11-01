<!-- 详情首尾图 -->
<template>
  <el-form
    ref="form"
    :model="form"
    size="small"
    label-position="right"
    label-width="120px"
  >
    <el-form-item label="订单计数方式:">
      <el-radio-group v-model="form.is_add">
        <el-radio :label="1">批量增加详情图</el-radio>
        <el-radio :label="0">批量删除详情图</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="下架商品修改后:" v-if="form.is_add">
      <el-upload
        class="batchEdit-addimages-avatar-uploader"
        action="/api/image/create"
        :headers="getTokenHeaders"
        :data="getImageLastData"
        :show-file-list="false"
        :on-success="handleAvatarSuccessLast">
        <img v-if="form.img_url" :src="form.img_url" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon">
            选择图片
        </i>
    </el-upload>
    </el-form-item>
    <el-form-item label="新增详情图的位置:">
      <el-select v-model="form.value" placeholder="请选择">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <el-input-number v-model="form.index" :min="1" placeholder="请输入正整数" style="width:160px"></el-input-number>
    </el-form-item>

  </el-form>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'Phone',
  props: {},
  data () {
    return {
      options: [{
        value: '+',
        label: '正数'
      }, {
        value: '-',
        label: '倒数'
      }],
      form: {
        is_add: 1,
        img_url: 0,
        value: '+',
        index: 1
      }
    }
  },
  computed: {
    ...mapGetters({
      getTokenHeaders: 'getTokenHeaders'
    }),
    getImageLastData () {
      return {
        'file_name': 'detail_last'
      }
    }
  },
  methods: {
    getForm () {
      if (this.form.is_add && !this.form.img_url) {
        this.$message.error('上传图片')
        return false
      }
      let result = {}
      result.is_add = this.form.is_add
      if (this.form.value === '-') {
        result.index = `-${this.form.index}`
      } else {
        result.index = this.form.index
      }
      if (this.form.is_add) {
        result.img_url = this.form.img_url
      }
      console.log(result, 'result')
      return result
    },
    handleAvatarSuccessLast (res, file) {
      this.form.img_url = res.data.url
    }
  }
}
</script>
<style lang="less" scoped>
</style>
<style lang="less">
  .batchEdit-addimages-avatar-uploader {
    .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        /*font-size: 28px;*/
        font-size: 10px;
        color: #8c939d;
        width: 90px;
        height: 90px;
        line-height: 90px;
        text-align: center;
    }
    .avatar {
        object-fit:contain;
        object-position:center;
        width: 90px;
        height: 90px;
        display: block;
    }
  }

</style>

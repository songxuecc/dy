<template>
    <div class="edit-gaoding" v-show="visibleDrawingBoard" v-loading="loading">
      <div class="edit-gaoding-container">
          <!-- <el-button v-show="show" style="position:absolute;right:95px;top:7px;z-index:10000;height:42px;width:80px" @click="close">取消</el-button>
          <div v-show="show" style="position:absolute;left:13px;top:4px;z-index:10000;height: 50px;line-height:50px;font-size:18px;font-weight:bold;background:#fff;width:110px">虎虎管家</div> -->
      </div>

    </div>
</template>

<script>

// import { createImageEditor } from '@gaoding/editor-sdk'
import services from '@services'

export default {
  name: 'ImageEdit',
  props: {
    msg: String
  },
  data () {
    return {
      visibleDrawingBoard: false,
      loading: false,
      show: false
    }
  },
  created () {
    this.createImage()
  },
  methods: {
    createImage () {
      if (this.editor) return false
      const editor = window.gaoding.createImageEditor({
        appId: 'LHCXOH948273',
        container: '.edit-gaoding-container'
      })
      editor.on('load', () => {
        setTimeout(() => {
          console.log('99999')
          this.show = true
        }, 500)
      })

      editor.on('editor.load', () => {
        console.log('editor.load')
      })

      editor.on('template.load', () => {
        console.log('template.load')
      })
      this.editor = editor
    },
    close () {
      this.editor.close()
      this.visibleDrawingBoard = false
    },
    async init (url) {
      if (!this.editor) {
        this.createImage()
      }
      this.visibleDrawingBoard = true
      this.editor.importImage(
        [url],
        {disableModules: ['panel.template', 'panel.element', 'panel.upload']}
      )

      this.editor.onSave(({ files, workId, type, title }) => {
        this.loading = true
        // 直接关闭编辑器
        // 对结果进行下载
        const file = files[0]
        console.log(file, 'file')
        let form = new FormData()
        form.append('file', file, 'jpeg')
        services.imageCreate(form, {
          'Content-Type': 'multipart/form-data;'
        }).then(d => {
          const url = d.url
          console.log('裁剪图片地址：', url)
          this.$emit('change', url)
          this.$message.success('修改成功')
          this.loading = false

          this.editor.close()
          this.visibleDrawingBoard = false
        }).catch(() => {
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>

.edit-gaoding {
  position: fixed;
  top: 0%;
  left: 0%;
  right: 0%;
  bottom: 0%;
  margin: auto;
  z-index: 999999;
  background: rgba(0,0,0,0.5);
  .edit-gaoding-container {
    position: absolute;
    top: 2%;
    left: 2%;
    right: 2%;
    bottom: 2%;
    margin: auto;
    z-index: 999999;
  }
}

</style>

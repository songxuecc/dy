
<script>
import services from '@services'
import { mapMutations } from 'vuex'

export default {
  name: 'ImageEdit',
  props: {
    msg: String
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    ...mapMutations('gaodingEdit', ['save']),
    async init (urls) {
      this.save({
        visibleDrawingBoard: true
      })
      console.log(this.$gaodingEditor, 'this.$gaodingEditor')
      this.$gaodingEditor.importImage(
        urls,
        {disableModules: ['panel.template', 'panel.element', 'panel.upload']}
      )

      const createPromise = (file) => {
        let form = new FormData()
        form.append('file', file, 'jpeg')
        return services.imageCreate(form, {
          'Content-Type': 'multipart/form-data;'
        })
      }
      this.$gaodingEditor.onSave(({ files, workId, type, title }) => {
        this.save({
          visibleDrawingBoard: false
        })
        this.save({
          gaodingEditLoading: true
        })
        // 直接关闭编辑器
        // 对结果进行下载

        console.log(files, 'files')
        Promise
          .all(files.map(item => createPromise(item)))
          .then(data => {
            console.log('裁剪图片地址：', data)
            this.$emit('change', data.map(d => d.url))
            this.$message.success('修改成功')
            this.$gaodingEditor.onClose()
            this.save({
              gaodingEditLoading: false
            })
          }).catch(() => {
          })
      })
    }
  }
}
</script>

<!-- 基础信息 -->
<template>
    <div class="card BasicInfo">
        <h1>基础信息</h1>
        <el-form ref="form" size="mini" :model="$data" label-width="100px" :rules="rules">
          <el-form-item  label="商品标题:" class="item" prop="goods_name">
            <el-input :maxlength="30" show-word-limit  v-model="goods_name"  placeholder="请填写" clearable @clear="handleClear('goods_name')"></el-input>
          </el-form-item>
          <el-form-item  label="推荐语:"  >
              <el-input :maxlength="50" :minlength="8" show-word-limit  v-model="default_recommend_remark"  placeholder="请填写商家推荐语设置,限8-50个汉字" clearable @clear="handleClear('default_recommend_remark')"></el-input>
          </el-form-item>
        </el-form>
    </div>
</template>

<script>
import utils from '@/common/utils'
export default {
  name: 'component_name',
  props: {
    msg: String
  },
  data () {
    const checkDefaultRecommendRremark = (rule, value, callback) => {
      if (
        (value && utils.getDyStrRealLength(value) < 8) ||
        (value && utils.getDyStrRealLength(value) > 50)
      ) {
        return callback(new Error('商家推荐语只可以填写8-50个字符！'))
      } else {
        callback()
      }
    }

    const checkWordsLength = (rule, value, callback) => {
      if (
        value && utils.getDyStrRealLength(value) > 30
      ) {
        return callback(new Error('商品标题最多可以填写30个字符！'))
      } else {
        callback()
      }
    }

    return {
      form: {
        goods_name: '',
        default_recommend_remark: ''
      },
      goods_name: '',
      default_recommend_remark: '',
      rules: {
        goods_name: [
          { required: true, message: '请填写商品标题', trigger: 'change' },
          { validator: checkWordsLength, trigger: 'change' }
        ],
        default_recommend_remark: [
          { validator: checkDefaultRecommendRremark, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    handleClear (key) {
      this[key] = ''
    },
    getForm () {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid, object) => {
          if (!valid) {
            reject(object)
          } else {
            resolve({
              goods_name: this.goods_name,
              default_recommend_remark: this.default_recommend_remark
            })
          }
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.item {
        padding-bottom: 10px;
        box-sizing: border-box;
    }

    .card {
      background: #f9f9fa;
      border-radius: 4px;
      margin-bottom: 16px;
      padding: 24px 24px 1px;
    }
    h1 {
        color: #333;
        font-size: 16px;
        margin-bottom: 20px;
        font-family: yahei;
    }
</style>

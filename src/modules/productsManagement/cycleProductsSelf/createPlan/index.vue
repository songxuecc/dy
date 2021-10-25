<!-- 创建计划 -->
<template>
  <div class="left" style="padding-left: 10px">
    <p class="title">创建计划</p>
    <el-divider></el-divider>

    <el-form ref="form" :model="form" label-width="120px" :rules="rules" size="medium">
      <el-form-item label="计划名称" size="small" prop="task_name">
        <el-input
          v-model="form.task_name"
          style="width: 365px"
          maxlength="20"
          show-word-limit
          clearable
          @clear=" ()=> form.task_name = ''"
          placeholder="请输入计划名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="计划类型">
        <el-radio-group v-model="form.task_type">
          <el-radio :label="1">仅下架</el-radio>
          <el-radio :label="2">仅上架</el-radio>
          <el-radio :label="3">先下架后上架，仅1次</el-radio>
          <el-radio :label="4">先上架后下架，仅1次</el-radio>
          <br/>
          <el-radio :label="5">先下架后上架，每日循环</el-radio>
          <el-radio :label="6">先上架后下架，每日循环</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上架时间" v-if="[2,3,4,5,6].includes(form.task_type)">
        <el-date-picker
          v-model="form.on_shelf_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="下架时间" v-if="[1,3,4,5,6].includes(form.task_type)">
        <el-date-picker
          v-model="form.off_shelf_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="第一次上架开始时间" v-if="[5,6].includes(form.task_type)">
        <el-date-picker
          v-model="form.on_shelf_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="第一次下架开始时间" v-if="[5,6].includes(form.task_type)">
        <el-date-picker
          v-model="form.off_shelf_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="循环次数" v-if="[5,6].includes(form.task_type)">
        <el-input v-model="form.repeat_count" placeholder="填写1-X的正整数, 如填写100则重复操作100次" style="width:308px"></el-input>
      </el-form-item>
    </el-form>

    <div class="center btn">
      <el-button @click="goback" plain type="primary" style="width: 120px">取消</el-button>
      <el-button @click="chooseProducts" type="primary" style="width: 140px">下一步，选择商品</el-button>
      <!-- <el-button @click="updatePlan" type="primary" style="width: 140px" :loading="loadingPost" :disabled="loadingPost">确定修改模版</el-button> -->
    </div>
  </div>
</template>

<script>

import {mapMutations, mapActions, mapState} from 'vuex'
import debounce from 'lodash/debounce'
import services from '@servises'
import moment from 'moment'

export default {
  name: 'CreateSyncPlan',
  props: {
  },
  data () {
    return {
      isShowSample: false,
      loadingPost: false,
      form: {
        task_name: `定时上下架计划: ${moment().format('YYYY-MM-DD')}`,
        task_type: 1,
        on_shelf_time: '',
        off_shelf_time: ''
      },
      rules: {
        task_name: [
          { required: true, message: '请输入计划名称', trigger: ['blur', 'change'] }
        ]
      },
      pickerOptions: {
        disabledDate: (time) => {
          const value = moment(time)
          const now = moment()
          return value.isBefore(now, 'days')
        }
      }
    }
  },
  created () {
    this.init()
  },
  computed: {
    ...mapState('productManagement/productsSync/tableProductList', {
      originForm: state => {
        return state.form
      },
      task_id: state => {
        return state.task_id
      },
      selectParmas: state => {
        return state.selectParmas
      },
      filters: state => {
        return state.filters
      },
      multipleSelection: state => {
        return state.multipleSelection
      },
      originFilters: state => {
        return state.originFilters
      }
    })
  },
  methods: {
    ...mapActions('productManagement/productsSync/tableProductList', [
      'fetch'
    ]),
    ...mapMutations('productManagement/productsSync/tableProductList', ['save']),
    async init () {
      // 查询初始化
      // this.form = this.originForm
    },
    goback () {
      this.$router.back()
    },
    // 选择商品
    chooseProducts () {
      this.save({
        form: this.form
      })
      this.$router.push({
        name: 'cycleProductsSelf_ChooseProducts'
      })
    },
    updatePlan () {
      this.loadingPost = true
      const parmas = this.form
      services.productAutoShelfUpdate(parmas)
        .then(data => {
          this.$message.success('修改模版成功！')
          this.goback()
        })
        .catch(err => {
          this.$message.error(`${err}`)
        })
        .finally(() => {
          this.loadingPost = false
        })
    },
    go: debounce(function () {
      this.$refs.form.validate((valid, object) => {
        if (valid) {
          this.fetch({
            filters: {
              capture_status: 1
            }
          })
          this.save({form: this.form})
          this.$emit('go', null, 3)
          console.log(this.form, 'this.form')
        }
      })
    },
    300,
    {
      leading: true
    })

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
  display: flex;
  align-items: center;
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
  margin-bottom: 12px;
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

.shoumaijia {
  /deep/ .el-form-item__label{
    font-size: 14px;
  }
}
</style>

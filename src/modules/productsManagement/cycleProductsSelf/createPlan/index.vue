<!-- 创建计划 -->
<template>
  <div class="left" style="padding-left: 10px">
    <p class="title">{{isEdit ? '编辑':'创建'}}计划</p>
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
          <el-radio :label="5">先下架后上架，每日循环</el-radio>
          <el-radio :label="6">先上架后下架，每日循环</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上架时间" v-if="[2,4].includes(form.task_type)">
        <el-date-picker
          v-model="form.on_shelf_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="下架时间" v-if="[1,4].includes(form.task_type)">
        <el-date-picker
          v-model="form.off_shelf_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>

      <div v-if="[3].includes(form.task_type)">
         <el-form-item label="下架时间">
          <el-date-picker
            v-model="form.off_shelf_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上架时间" >
          <el-date-picker
            v-model="form.on_shelf_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
      </div>

      <div v-if="[5].includes(form.task_type)">
        <el-form-item label="下架时间">
         <el-time-picker
            v-model="form.first_shelf_time_hours"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择下架时间"
            align="right"
            :picker-options="pickerOptions">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="上架时间" v-if="form.first_shelf_time_hours">
           <el-time-picker
            v-model="form.second_shelf_time_hours"
            @blur="onChangeOffShelfTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择上架时间">
          </el-time-picker>
          <span class="color-warning ml-5">{{getFirstShelfTimeText}}</span>
        </el-form-item>
        <el-form-item label="第一次下架开始时间"  v-if="form.first_shelf_time_hours">
          <el-date-picker
            v-model="form.first_shelf_time_day"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择第一次下架开始时间"
            align="right"
            default-time="12:00:00"
            :picker-options="pickerOptions"
            @blur="handleChangeOnShelfTime">
          </el-date-picker>
          <span class="ml-5">{{form.first_shelf_time_hours.substring(10,19)}}</span>
        </el-form-item>
        <el-form-item label="第一次上架开始时间"  v-if="form.first_shelf_time_hours">
           {{getSecondShelfTime}}
        </el-form-item>
        <el-form-item label="循环次数"  v-if="form.first_shelf_time_hours">
          <el-input v-model="form.repeat_count" placeholder="填写1-X的正整数, 如填写100则重复操作100次" style="width:308px"></el-input>
        </el-form-item>
      </div>

      <div v-if="[6].includes(form.task_type)">
         <el-form-item label="上架时间">
          <el-time-picker
            v-model="form.first_shelf_time_hours"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择上架时间"
            align="right"
            :picker-options="pickerOptions">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="下架时间" v-if="form.first_shelf_time_hours">
          <el-time-picker
            v-model="form.second_shelf_time_hours"
            @blur="onChangeOffShelfTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择下架时间">
          </el-time-picker>
          <span class="color-warning ml-5">{{getFirstShelfTimeText}}</span>
        </el-form-item>
        <el-form-item label="第一次上架开始时间" v-if="form.first_shelf_time_hours">
          <el-date-picker
            v-model="form.first_shelf_time_day"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择第一次上架开始时间"
            align="right"
            default-time="12:00:00"
            :picker-options="pickerOptions"
            @blur="handleChangeOnShelfTime">
          </el-date-picker>
          <span class="ml-5">{{form.first_shelf_time_hours.substring(10,19)}}</span>
        </el-form-item>
        <el-form-item label="第一次下架开始时间" v-if="form.first_shelf_time_hours">
          {{getSecondShelfTime}}
        </el-form-item>
        <el-form-item label="循环次数" v-if="form.first_shelf_time_hours">
          <el-input v-model="form.repeat_count" placeholder="填写1-X的正整数, 如填写100则重复操作100次" style="width:365px"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="center btn">
      <el-button @click="goback" plain type="primary" style="width: 120px">取消</el-button>
      <el-button @click="chooseProducts" type="primary" style="width: 140px" v-if="!isEdit">下一步，选择商品</el-button>
      <el-button @click="updatePlan" type="primary" style="width: 140px" :loading="loadingPost" :disabled="loadingPost" v-if="isEdit">确定修改模版</el-button>
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
      isEdit: false,
      isShowSample: false,
      loadingPost: false,
      moment,
      form: {
        task_name: `定时上下架计划: ${moment().format('YYYY-MM-DD')}`,
        task_type: 1,
        on_shelf_time: '',
        off_shelf_time: '',
        repeat_count: '',
        first_shelf_time_day: '',
        first_shelf_time_hours: ''
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
  activated () {
    this.init()
  },
  computed: {
    ...mapState('productManagement/cycleProductsSelf/chooseProducts', {
      originForm: state => {
        return state.form
      }
    }),
    getSecondShelfTime () {
      const a = moment(this.form.second_shelf_time_hours)
      const b = moment(this.form.first_shelf_time_hours)
      const isBefore = a.isBefore(b)
      if (isBefore && this.form.first_shelf_time_hours && this.form.first_shelf_time_day) {
        const days = moment(this.form.first_shelf_time_day).add({days: 1}).format('YYYY-MM-DD HH:mm:ss').substring(0, 10)
        const hours = this.form.second_shelf_time_hours.substring(10, 19)
        return `${days}${hours}`
      } else if (!isBefore && this.form.first_shelf_time_hours && this.form.first_shelf_time_day) {
        const days = moment(this.form.first_shelf_time_day).add({days: 0}).format('YYYY-MM-DD HH:mm:ss').substring(0, 10)
        const hours = this.form.second_shelf_time_hours.substring(10, 19)
        return `${days}${hours}`
      }
      return '请选择第一次上架开始时间'
    },
    getFirstShelfTimeText () {
      const a = moment(this.form.second_shelf_time_hours)
      const b = moment(this.form.first_shelf_time_hours)
      const isBefore = a.isBefore(b)
      if (isBefore && this.form.first_shelf_time_hours) return '次日'
      if (this.form.second_shelf_time_hours) return '当日'
      return ''
    }
  },
  methods: {
    ...mapActions('productManagement/cycleProductsSelf/chooseProducts', [
      'fetch'
    ]),
    ...mapMutations('productManagement/cycleProductsSelf/chooseProducts', ['save']),
    async init () {
      // 查询初始化
      const taskId = this.$route.query.task_id
      if (taskId) {
        this.form = {
          task_id: taskId,
          ...this.form,
          ...this.$route.params
        }
        this.isEdit = true
      } else {
        this.isEdit = false
        if (this.originForm && this.originForm.ext) {
          this.form = JSON.parse(this.originForm.ext)
        } else {
          this.form = {
            task_name: `定时上下架计划: ${moment().format('YYYY-MM-DD')}`,
            task_type: 1,
            on_shelf_time: '',
            off_shelf_time: '',
            repeat_count: '',
            first_shelf_time_day: '',
            first_shelf_time_hours: ''
          }
        }
      }
    },
    getFormdata () {
      if ([5, 6].includes(this.form.task_type)) {
        return {
          task_name: this.form.task_name,
          task_type: this.form.task_type,
          off_shelf_time: this.getSecondShelfTime,
          on_shelf_time: `${this.form.first_shelf_time_day.substring(0, 10)}${this.form.first_shelf_time_hours.substring(10, 19)}`,
          repeat_count: this.form.repeat_count,
          ext: JSON.stringify(this.form)
        }
      }

      if ([1, 2, 3, 4].includes(this.form.task_type)) {
        return {...this.form, ext: JSON.stringify(this.form)}
      }
    },
    onChangeOffShelfTime () {
      const a = moment(this.form.second_shelf_time_hours).format('yyyy-MM-dd HH:mm:ss')
      const b = moment(this.form.first_shelf_time_hours).format('yyyy-MM-dd HH:mm:ss')
      console.log(a, b)
      if (a === b) {
        this.$message.warning('不可以选择同一时间')
      }
    },
    goback () {
      this.$router.back()
    },
    // 更新
    updatePlan () {
      this.loadingPost = true
      const taskId = this.$route.query.task_id
      const params = this.getFormdata()
      console.log(params)
      services.productAutoShelfUpdate({...params, task_id: taskId})
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
    // 选择商品
    chooseProducts: debounce(function () {
      const params = this.getFormdata()
      console.log(params, 'params')
      // todo 各种情况的数据校验
      if (params.repeat_count && params.repeat_count > 30) {
        return this.$message.error('循环次数不可以大于30')
      }
      this.$refs.form.validate((valid, object) => {
        if (valid) {
          this.fetch()
          this.save({form: params})
          this.$router.push({
            name: 'cycleProductsSelf_ChooseProducts'
          })
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

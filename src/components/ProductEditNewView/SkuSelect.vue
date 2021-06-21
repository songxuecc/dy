<!--  -->
<template>
  <div>
    <div
      class="left"
      style="
        background: rgb(249, 249, 250);
        padding: 16px 12px;
        margin-right: 30px;
        border-radius: 4px;
				margin-bottom: 16px
      "
			v-for="(specification,index) in specifications"
			:key="index"
    >
      <div>
        <div class="left mb-10">
          <div class="skuText flex justify-b">
						<span>规格名</span>
						<span class="font-12 pointer" v-if="specifications.length > 1" @click="deleteSpecifications(index)">
							<hh-icon type="iconshanchu1" class="font-12"></hh-icon>
							删除</span>
					</div>

          <el-select
            size="mini"
            style="width: 170px; margin-right: 10px"
            :value="specification.specificationName"
            popper-class="skuAddSelect"
            @change="handleSpecificationNameChange($event,index,specification)"
          >
            <el-option
              v-for="item in specificationNameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
            <el-option style="height: 40px; padding: 0; line-height: 40px">
              <!-- 可以创建并选中选项中不存在的条目 用这个组建 -->
              <div
                v-if="!specification.specificationNameVisible"
                @click.stop="specification.specificationNameVisible = true"
                style="padding-left: 12px"
                class="color-primary pointer"
              >
                新建规格名
              </div>
              <div
                v-if="specification.specificationNameVisible"
                style="padding-left: 2px; padding-right: 4px"
              >
                <el-input
                  :value="specification.newSpecificationName"
                  @click.native="handleNewSpecificationNameClick"
                  @input="changeNewSpecificationName($event,index,specification)"
                  @focus.stop=""
                  size="mini"
                  placeholder="请输入内容"
                  style="width: 130px"
                ></el-input>
                <hh-icon
                  type="iconduigou"
                  class="fail"
                  style="color: green; margin-left: 2px; font-size: 11px"
                  @click.native="addNewSpecificationName($event,index,specification)"
                ></hh-icon>
                <hh-icon
                  type="iconguanbi1"
                  class="fail"
                  style="color: #e02020; margin-left: 2px; font-size: 11px"
                  @click.native="cancelNewSpecificationName($event,index,specification)"
                ></hh-icon>
              </div>
            </el-option>
          </el-select>
          <el-checkbox
            v-model="addSkuImage"
            size="mini"
            @change="handleAddSkuImage"
            :disabled="disabledAddSkuImage"
            >添加规格图片
          </el-checkbox>
        </div>
        <div class="selectedLength" v-if="specification.specificationName">
          规格值<span class="index_count"
            >(已选{{ specification.skuSelectCheckList.length }}个)</span
          >
        </div>
        <el-checkbox-group
					v-if="specification.specificationName"
          v-model="specification.skuSelectCheckList"
          class="flex mb-15 wrap"
          @change="handleSkuSelectCheckListChange($event, index, specification)"
        >
          <el-checkbox
            v-for="(specificationValue, index) in specification.specificationValueList"
            :key="index"
            :label="specificationValue.value"
            class="relative"
            style="
              display: inline-flex;
              align-items: center;
              margin-bottom: 8px;
              flex: 0 0 25%;
              max-width: 25%;
            "
          >
            <span v-if="specificationValue.edit" class="skuValue"
              >{{ specificationValue.value }}
              <hh-icon
                type="iconbianji-primary"
                class="font-12 pointer iconbianji-primary"
                @click.native.prevent="
                  editSpecificationValue($event, index, specification)
                "
              ></hh-icon
            ></span>
            <span v-if="!specificationValue.edit">
              <el-input
                :value="specificationValue.value"
                size="mini"
                placeholder="请输入内容"
                style="width: 136px"
                @input="
                  changeSpecificationValue($event, index, specification)
                "
              ></el-input>
              <hh-icon
                type="iconhuanyuan"
                class="fail ml-5"
                style="color: green; font-size: 11px"
                @click.native.prevent="
                  revertSpecificationValue($event, index, specification)
                "
              ></hh-icon>
              <hh-icon
                type="iconguanbi1"
                class="fail ml-5"
                style="color: #e02020; font-size: 11px"
                @click.native.prevent="
                  cancelSpecificationValue($event, index, specification)
                "
              ></hh-icon>
            </span>
          </el-checkbox>
        </el-checkbox-group>
        <div style="margin-top: 10px" v-if="specification.specificationName">
          <el-input
            v-model="specification.addSpecificationValue"
            size="mini"
            placeholder="请输入内容"
            style="width: 170px; margin-right: 10px"
          ></el-input>
          <span
            @click="handleAddSpecificationValue($event, index, specification)"
            :class="[
              specification.addSpecificationValue ? 'color-primary' : 'color-767989',
              'font-12',
              'pointer',
            ]"
            >添加</span
          >
          <el-divider direction="vertical"></el-divider>
          <span
            :class="[
              specification.skuSelectCheckList.length > 1 ? 'color-primary' : 'color-767989',
              'font-12',
              'pointer',
            ]"
            @click="handleSortAddSpecificationValue($event, index, specification)"
            >自定义排序</span
          >
        </div>
      </div>
    </div>

    <div class="left mt-10 mb-10" v-if="this.specifications.length < 3 && specificationName">
      <el-button type="primary" icon="el-icon-plus" size="medium" plain @click="addSpecifications"
        >添加规格</el-button
      >
    </div>

    <el-dialog
      title="自定义排序"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      custom-class="skuSelect-dialog"
      :modal="false"
    >
      <div class="left sortDesc">
        <span class="sortName">{{ specifications[activeIndex].specificationName }}</span
        ><span class="sortDescInfo">请拖动规格值进行排序</span>
      </div>
      <draggable
        v-model="dragList"
        group="people"
        class="sortGround"
        @start="drag = true"
        @end="drag = false"
        v-bind="dragOptions"
        chosenClass="chosenClass"
      >
        <transition-group type="transition" name="flip-list" tag="span">
          <span
            class="sortItem list-group-item"
            v-for="specificationValue in dragList"
            :key="specificationValue.value"
            >{{ specificationValue.value }}</span
          >
        </transition-group>
      </draggable>
      <span slot="footer" class="flex justify-b align-c">
        <span class="color-primary pointer" @click="resetSort">重置</span>
        <div>
          <el-button
            type="primary"
            @click="sort"
            size="medium"
            style="width: 74px"
            >确 定</el-button
          >
          <el-button
            @click="dialogVisible = false"
            size="medium"
            style="width: 74px"
            >取 消</el-button
          >
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'component_name',
  props: {
    msg: String
  },
  components: {
    draggable
  },
  data () {
    return {
      dialogVisible: false,
      specificationNameOptions: [],
      skuNameList: [],
      specificationNameVisible: false,
      activeIndex: 0,
      addSkuImage: false,
      specificationName: '',
      skuSelectCheckList: [],
      addSpecificationValue: '',
      specificationValueList: [],
      drag: false,
      dragList: [],
      specifications: [{
        specificationName: '',
        newSpecificationName: '',
        addSkuImage: false,
        skuSelectCheckList: [],
        addSpecificationValue: '',
        specificationValueList: [],
        specificationNameVisible: false
      }]
    }
  },
  computed: {
    dragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  methods: {
    // addNewSpecificationName () {
    //   const skuNameList = this.skuNameList
    // skuNameList.push({
    //   value: NewSpecificationName,
    //   label: NewSpecificationName
    // })
    // this.skuNameList = skuNameList
    // },
    handleNewSpecificationNameClick (e) {
      e.stopPropagation()
    },
    changeNewSpecificationName (e, index, row) {
      console.log(e, index, row)
      row.newSpecificationName = e

      // this.newSpecificationName = e
    },
    cancelNewSpecificationName (e, index, row) {
      e.stopPropagation()
      row.specificationNameVisible = false
    },
    addNewSpecificationName (e, index, row) {
      e.stopPropagation()
			// 该规格名已经存在，请勿重复创建
      if (
        this.specificationNameOptions.find(
          (item) => item.label === row.newSpecificationName
        )
      ) {
        return this.$message.warning('该规格名已经存在，请勿重复创建')
      }
      const newOption = {
        value: row.newSpecificationName,
        label: row.newSpecificationName
      }
      this.specificationNameOptions = [
        newOption,
        ...this.specificationNameOptions
      ]
      row.newSpecificationName = ''
      row.specificationNameVisible = false
      console.log(
        this.specificationNameOptions,
        'this.specificationNameOptions'
      )
    },
    handleAddSkuImage (value) {
      this.addSkuImage = value
    },
    handleSpecificationNameChange (value, index) {
      this.specifications[index].specificationName = value
    },
    // 添加规格值
    handleAddSpecificationValue (e, index, row) {
      console.log(row, 'row')
      if (
        row.specificationValueList.find(
          (item) => item.value === row.addSpecificationValue
        )
      ) {
        return this.$message.warning('规格值不能重复')
      }
      const newOption = {
        value: row.addSpecificationValue,
        originValue: row.addSpecificationValue,
        edit: true,
        editBtnVisible: false,
        order: row.specificationValueList.length,
        checked: true
      }
      this.$nextTick(() => {
        row.specificationValueList.push(newOption)
        row.skuSelectCheckList = row.specificationValueList
          .filter((item) => item.checked)
          .map((item) => item.value)
        row.addSpecificationValue = ''
        console.log(row.skuSelectCheckList, 'this.skuSelectCheckList')
      })
    },
    handleSkuSelectCheckListChange (list, index, row) {
      row.specificationValueList = row.specificationValueList.map((item) => {
        if (list.includes(item.value)) {
          return { ...item, checked: true }
        } else {
          return { ...item, checked: false }
        }
      })
    },
    handleSortAddSpecificationValue (e, index, row) {
      this.dialogVisible = true
      this.dragList = row.specificationValueList.filter((item) => item.checked)
      this.activeIndex = index
    },
    editSpecificationValue (e, index, row) {
      console.log(row, 'row')
      row.edit = false
    },
    cancelSpecificationValue (e, index, row) {
      e.stopPropagation()
      console.log(row, 'row')
      row.edit = true
    },
    revertSpecificationValue (e, index, row) {
      e.stopPropagation()
      console.log(row, 'row')
      row.value = row.originValue
      row.edit = true
    },
    changeSpecificationValue (value, index, row) {
      // e.stopPropagation()
      console.log(value, 'value')
      row.value = value
    },
    mouseoverSpecificationValue (e, index, row) {
      e.stopPropagation()
      console.log(row, 'row')
      row.editBtnVisible = true
    },
    mouseoutSpecificationValue (e, index, row) {
      e.stopPropagation()
      console.log(row, 'row')
      row.editBtnVisible = false
    },
    resetSort () {
      this.dragList = this.dragList.sort((a, b) => a.order - b.order)
    },
    sort () {
      const activeSpecifications = this.specifications[this.activeIndex]
      const checkedList = this.dragList.map((item, index) => {
        return { ...item, order: index + 1 }
      })
      const noCheckedList = activeSpecifications.specificationValueList
        .filter((item) => !item.checked)
        .map((item, index) => {
          return { ...item, order: index + checkedList.length }
        })
      activeSpecifications.specificationValueList = [...checkedList, ...noCheckedList]
      console.log(activeSpecifications.specificationValueList)
      this.dialogVisible = false
    },
    cancelSort () {
      this.dialogVisible = false
    },
    addSpecifications () {
      const activeSpecifications = this.specifications[this.activeIndex]
      activeSpecifications.specifications = [...activeSpecifications.specifications, new Date()]
    },
    deleteSpecifications (index) {
      this.$confirm('确定删除该规格么？', '', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const activeSpecifications = this.specifications[this.activeIndex]
        activeSpecifications.specifications.splice(index, 1)
      }).catch(() => {

      })
    }
  }
}
</script>
<style lang="less" scoped>
.skuValue {
  width: calc(100% - 20px);
  max-width: 160px;
  padding-right: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  size: 14px;
  height: 20px;
  line-height: 20px;
  color: #12141a;
  display: block;
  justify-content: space-between;
  position: relative;
  .iconbianji-primary {
    position: absolute;
    right: 0;
    top: 4px;
    display: none;
  }
  &:hover {
    .iconbianji-primary {
      position: absolute;
      right: 0;
      top: 4px;
      display: block;
    }
  }
}
.selectedLength {
  margin-top: 24px;
  font-size: 14px;
  color: #55585c;
  height: 20px;
  line-height: 20px;
  margin-bottom: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial,
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}
/deep/ .el-checkbox {
  margin-right: 0;
}
/deep/ .el-checkbox__input {
  padding-top: 2px;
}
/deep/ .el-checkbox__label {
  width: 100%;
  padding-left: 4px;
}
/deep/ .el-input__inner {
  padding: 0 6px;
}

.skuSelect-dialog {
  .sortDesc {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
      'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial,
      sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    .sortName {
      color: #55585c;
      font-size: 14px;
      font-weight: 600;
    }
    .sortDescInfo {
      color: #85878a;
      font-size: 12px;
      margin-left: 8px;
    }
  }
  .sortGround {
    display: flex;
    justify-self: flex-start;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    text-align: left;
    .sortItem {
      display: inline-block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
        'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica,
        Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
        'Segoe UI Symbol';
      word-wrap: break-word;
      background: #f3f4f6;
      border-radius: 4px;
      margin-right: 12px;
      margin-bottom: 12px;
      padding: 6px 23px;
      font-size: 14px;
      line-height: 16px;
      color: #12141a;
      cursor: pointer;
    }
    .chosenClass {
      background-color: none !important;
    }
    .flip-list-move {
      transition: transform 0s;
    }
    .no-move {
      transition: transform 0s;
    }
    .list-group-item {
      cursor: move;
    }
    .list-group-item i {
      cursor: pointer;
    }
    .ghost {
      opacity: 0.3;
    }
    .sortable-chosen {
      background: none !important;
    }
  }
}
</style>
<style lang="less">
.skuAddSelect {
  .el-select-dropdown__item {
    text-align: left;
    padding: 6px 8px 6px 12px;
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    height: 32px;
    width: 170px;
  }
  .el-input__inner {
    padding: 0 4px;
  }
}
</style>

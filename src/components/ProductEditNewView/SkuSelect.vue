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
        margin-bottom: 16px;
      "
      v-for="(specification, index) in specifications"
      :key="index"
    >
      <div>
        <!-- 规格名 -->
        <div class="left mb-10">
          <div class="skuText flex justify-b">
            <span>规格名</span>
            <span
              class="font-12 pointer"
              v-if="specifications.length > 1"
              @click="deleteSpecifications(index)"
            >
              <hh-icon type="iconshanchu1" class="font-12"></hh-icon>
              删除</span
            >
          </div>

          <el-select
            size="mini"
            style="width: 170px; margin-right: 10px"
            :value="specification.specificationName"
            popper-class="skuAddSelect"
            filterable
            @change="
              handleSpecificationNameChange($event, index, specification)
            "
          >
            <el-option
              v-for="item in specificationNameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
            <el-option style="height: 40px; padding: 0; line-height: 40px">
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
                  @input="
                    changeNewSpecificationName($event, index, specification)
                  "
                  @focus.stop=""
                  size="mini"
                  placeholder="请输入内容"
                  style="width: 130px"
                ></el-input>
                <hh-icon
                  type="iconduigou"
                  class="fail"
                  style="color: green; margin-left: 2px; font-size: 11px"
                  @click.native="
                    addNewSpecificationName($event, index, specification)
                  "
                ></hh-icon>
                <hh-icon
                  type="iconguanbi1"
                  class="fail"
                  style="color: #e02020; margin-left: 2px; font-size: 11px"
                  @click.native="
                    cancelNewSpecificationName($event, index, specification)
                  "
                ></hh-icon>
              </div>
            </el-option>
            <!-- 规格名搜索为空时 -->
            <div slot="empty" class="left">
              <div
                class="center"
                style="
                  height: 60px;
                  line-height: 60px;
                  padding-left: 12px;
                  color: #999999;
                "
              >
                暂无数据
              </div>
            </div>
          </el-select>
          <el-checkbox
            v-model="specification.addSkuImage"
            size="mini"
            v-if="index === 0"
            >添加规格图片
          </el-checkbox>
        </div>
        <!-- 规格值 -->
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
          <div
            class="preview"
            v-for="(
              specificationValue, idx
            ) in specification.specificationValueList"
            :key="idx"
            style="flex: 0 0 25%; max-width: 25%; margin-bottom: 8px"
          >
            <el-checkbox
              :label="specificationValue.checkedValue"
              :value="specificationValue.checkedValue"
              class="relative"
              style="
                display: inline-flex;
                align-items: center;
                margin-bottom: 5px;
                width: 100%;
              "
            >
						<el-tooltip :content="specificationValue.value" :disabled="specificationValue.value && specificationValue.value.length < 20" placement="top">
              <span v-if="specificationValue.edit" class="skuValue">

                  {{ specificationValue.value }}
                <!-- {{ specificationValue.value }} -->
                <hh-icon
                  type="iconbianji-primary"
                  class="font-12 pointer iconbianji-primary"
                  @click.native.prevent="
                    editSpecificationValue(
                      $event,
                      idx,
                      specification,
                      specificationValue
                    )
                  "
                ></hh-icon
              ></span>
              <span v-if="!specificationValue.edit">
                <el-input
                  :value="specificationValue.value"
                  size="mini"
                  placeholder="请输入内容"
                  style="width: 136px"
                  ref="inputs"
                  @input="
                    changeSpecificationValue(
                      $event,
                      idx,
                      specificationValue,
                      specification
                    )
                  "
                ></el-input>
                <hh-icon
                  type="iconduigou"
                  class="fail ml-5"
                  style="color: green; font-size: 11px"
                  @click.native.prevent="
                    setSpecificationValue($event, idx, specificationValue)
                  "
                ></hh-icon>
                <hh-icon
                  type="iconguanbi1"
                  class="fail ml-5"
                  style="color: #e02020; font-size: 11px"
                  @click.native.prevent="
                    cancelSpecificationValue($event, idx, specificationValue)
                  "
                ></hh-icon>
              </span>
                </el-tooltip>
            </el-checkbox>
            <el-upload
              v-if="specification.addSkuImage && !specificationValue.image"
              slot="reference"
              :class="[
                'skuSelect-el-upload--picture-card ',
                'hover-skuSelect-el-upload--picture-card'
              ]"
              :show-file-list="false"
              :on-success="
                (response, file, fileList) =>
                  handleUploadSuccess(
                    response,
                    file,
                    fileList,
                    specificationValue
                  )
              "
              :on-error="handleUploadError"
              :before-upload="handleBeforeUpload"
              action="/api/image/create"
              :headers="getTokenHeaders"
              :data="{ belong_type: belongType }"
              :multiple="false"
            >
              <span class="flex column align-c justify-c">
                <span><i class="el-icon-plus avatar-uploader-icon"></i></span>
                <span class="uploader-text">(0/1)</span>
              </span>
            </el-upload>

            <div
              v-if="specification.addSkuImage && specificationValue.image"
              :class="[
                'skuSelect-el-upload--picture-card ',
              ]"
            >
              <div class="imgWrapper">
                <el-image
                  :src="specificationValue.image"
                  class="avatar"
                  :ref="`img${specificationValue.skuString}-${idx}`"
                  :preview-src-list="[specificationValue.image]"
                  v-on:mouseover.self="handlemouseover(specificationValue)"
                />
                <div
                  :class="[
                    'mask',
                    specificationValue.maskShow ? 'show' : '',
                    'flex',
                    'justify-b',
                    'align-c'
                  ]"
                  v-on:mouseleave.self="handlemouseleave(specificationValue)"
                >
                  <hh-icon
                    type="iconshanchu1"
                    style="font-size: 13px;"
                    class="iconshanchu1"
                    @click="deleteImage(specificationValue)"
                  />
                  <hh-icon
                    type="iconreview"
                    style="font-size: 15px"
                    class="iconreview"
                    @click="previewImage(specificationValue,`img${specificationValue.skuString}-${idx}`)"
                  />
                </div>
              </div>
            </div>

          </div>
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
              specification.addSpecificationValue
                ? 'color-primary'
                : 'color-767989',
              'font-12',
              'pointer',
            ]"
            >添加</span
          >
          <el-divider direction="vertical"></el-divider>
          <span
            :class="[
              specification.skuSelectCheckList.length > 1
                ? 'color-primary'
                : 'color-767989',
              'font-12',
              'pointer',
            ]"
            @click="
              handleSortAddSpecificationValue($event, index, specification)
            "
            >自定义排序</span
          >
        </div>
      </div>
    </div>

    <div class="left mt-10 mb-10" v-if="showAddSpecifications">
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="medium"
        plain
        @click="addSpecifications"
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
        <span class="sortName">{{
          specifications && specifications[activeIndex]
            ? specifications[activeIndex].specificationName
            : ''
        }}</span
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
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import shortid from 'shortid'

export default {
  name: 'component_name',
  props: {
    msg: String,
    belongType: {
      type: Number,
      default: 0
    },
    specifications: {
      type: Array,
      default: [
        {
          specificationName: '',
          newSpecificationName: '',
          addSkuImage: false,
          skuSelectCheckList: [],
          addSpecificationValue: '',
          specificationValueList: [],
          specificationNameVisible: false
        }
      ]
    },
    skuPropertyValueMap: Object
  },
  components: {
    draggable
  },
  data () {
    return {
      dialogVisible: false,
      specificationNameOptions: [],
      activeIndex: 0,
      drag: false,
      dragList: []
    }
  },
  watch: {
    specifications (n) {
      const nextSpecificationNames = n.map(item => item.specificationName)
      const specificationNames = this.specificationNameOptions.map(item => item.value)
      this.specificationNameOptions = [...new Set([...nextSpecificationNames, ...specificationNames])].filter(item => item).map(item => ({
        value: item,
        label: item
      }))
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
    },
    ...mapGetters(['getTokenHeaders']),
    showAddSpecifications () {
      return (
        this.specifications.length < 3 &&
        this.specifications.some(
          (specification) => specification.specificationName
        )
      )
    }
  },
  methods: {
    getDisabledAddSkuImage () {
      return this.specifications.some((specification) => {
        return (
          specification &&
          (specification.specificationValueList || []).some(
            (specificationValue) =>
              specificationValue && specificationValue.image
          )
        )
      })
    },
    handleNewSpecificationNameClick (e) {
      e.stopPropagation()
    },
    changeNewSpecificationName (e, index, row) {
      row.newSpecificationName = e
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
    },
    // 规格名字添加
    handleSpecificationNameChange (value, index) {
      const specificationNames = this.specifications.map(
        (item) => item.specificationName
      )
      if (specificationNames.includes(value)) {
        return this.$message.error('规格名不能重复')
      }
      this.specifications[index].specificationName = value
      this.$nextTick(() => {
        this.$emit('change', this.specifications)
      })
    },
    // 添加规格值
    handleAddSpecificationValue (e, index, row) {
      if (!row.addSpecificationValue) {
        return false
      }
      if (
        row.specificationValueList.find(
          (item) => item.value === row.addSpecificationValue
        )
      ) {
        return this.$message.warning('规格值不能重复')
      }
      const specId = `specId-${shortid.generate()}`
      const skuValueKey = `skuString-${shortid.generate()}`
      const newOption = {
        image: '',
        value: row.addSpecificationValue,
        skuKey: specId,
        skuValueKey: skuValueKey,
        skuString: `${specId}:${skuValueKey}`,
        originValue: row.addSpecificationValue,
        checkedValue: row.addSpecificationValue,
        edit: true,
        editBtnVisible: false,
        order: row.specificationValueList.length,
        checked: true,
        maskShow: false
      }
      this.$nextTick(() => {
        row.specificationValueList.push(newOption)
        row.skuSelectCheckList = row.specificationValueList
          .filter((item) => item.checked)
          .map((item) => item.checkedValue)
        row.addSpecificationValue = ''
        row.spec_id = specId
        row.id = `id-${shortid.generate()}`
        this.$nextTick(() => {
          this.$emit('change', this.specifications)
        })
      })
    },
    // 增加单个sku
    handleSkuSelectCheckListChange (list, index, row) {
      console.log(list, index, row, 'list, index, row')
      row.specificationValueList = row.specificationValueList.map((item) => {
        if (list.includes(item.value)) {
          return { ...item, checked: true }
        } else {
          return { ...item, checked: false }
        }
      })
      this.$nextTick(() => {
        this.$emit('change', this.specifications)
      })
    },
    // 排序
    handleSortAddSpecificationValue (e, index, row) {
      if (row.skuSelectCheckList && row.skuSelectCheckList.length > 1) {
        this.dialogVisible = true
        this.dragList = row.specificationValueList.filter(
          (item) => item.checked
        )
        this.activeIndex = index
      }
      this.$nextTick(() => {
        this.$emit('change', this.specifications)
      })
    },
    editSpecificationValue (e, index, row, specificationValue) {
      specificationValue.edit = false
    },
    cancelSpecificationValue (e, index, row) {
      e.stopPropagation()
      row.value = row.originValue
      row.edit = true
    },
    setSpecificationValue (e, index, row) {
      e.stopPropagation()
      row.originValue = row.value
      row.edit = true
    },
    changeSpecificationValue (value, index, row, specification) {
      if (!value) {
        this.$message.error('请输入规格值')
      }
      this.$set(row, 'value', value)
    },
    mouseoverSpecificationValue (e, index, row) {
      e.stopPropagation()
      row.editBtnVisible = true
    },
    mouseoutSpecificationValue (e, index, row) {
      e.stopPropagation()
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
      activeSpecifications.specificationValueList = [
        ...checkedList,
        ...noCheckedList
      ]
      this.dialogVisible = false
      this.$nextTick(() => {
        this.$emit('change', this.specifications)
      })
    },
    cancelSort () {
      this.dialogVisible = false
    },
    addSpecifications () {
      this.specifications = [
        ...this.specifications,
        {
          specificationName: '',
          newSpecificationName: '',
          addSkuImage: false,
          skuSelectCheckList: [],
          addSpecificationValue: '',
          specificationValueList: [],
          specificationNameVisible: false,
          image: ''
        }
      ]
    },
    deleteSpecifications (index) {
      this.$confirm('确定删除该规格么？', '', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.specifications.splice(index, 1)
          this.$nextTick(() => {
            this.$emit('change', this.specifications)
          })
        })
        .catch(() => {})
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleBeforeUpload (file) {
      console.log(file)
      let type = file.type
      let size = file.size / 1024 / 1024
      if (type !== 'image/jpeg' && type !== 'image/png') {
        this.$message.error('只能上传jpg/jpeg/png文件')
        return false
      }
      if (size > 8) {
        this.$message.error('上传文件超过8M')
        return false
      }
    },
    handleUploadSuccess (response, file, fileList, row) {
      if (parseInt(response.code) !== 0) {
        if (response.msg) {
          this.$message.error(response.msg)
        }
        return
      }
      this.$set(row, 'image', response.data.url)
      this.$nextTick(() => {
        this.$emit('change', this.specifications)
      })
    },
    handleUploadError (err, file, fileList) {
      this.$message.error(err.message)
    },
    handlemouseover (item) {
      this.$set(item, 'maskShow', true)
    },
    handlemouseleave (item) {
      this.$set(item, 'maskShow', false)
    },
    deleteImage (item) {
      if (!item.maskShow) return false
      this.$set(item, 'image', '')
    },
    previewImage (item, refName) {
      if (!item.maskShow) return false
      this.$nextTick(() => {
        this.$set(item, 'maskShow', false)
      })
      if (this.$refs[refName] && this.$refs[refName][0] && this.$refs[refName][0].clickHandler) {
        this.$refs[refName][0].clickHandler()
      }
    },
    // 更新单个sku维度信息
    handleChangeSingleSku () {
      this.$emit('onChangeSingleSku')
    },
    // 排序单个sku
    handleSortSingleSku () {
      this.$emit('onSortSingleSku')
    },
    // 增加单个sku
    handleAddSingleSku () {
      this.$emit('onAddSingleSku')
    },
    // 删除单个sku维度
    handleDeleteSingleSku () {
      this.$emit('onDeleteSingleSku')
    },
    // 删除整个sku维度
    handleDeleteSku () {
      this.$emit('onDeleteSku')
    },
    // 增加一个维度的sku
    handleAddSku () {
      this.$emit('onAddSku')
    },
    // 选中单个sku
    handleCheckedSkuFilter () {
      this.$emit('onCheckedSkuFilter')
    }
  }
}
</script>
<style lang="less" scoped>
@import '~./SkuSelect.less';
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

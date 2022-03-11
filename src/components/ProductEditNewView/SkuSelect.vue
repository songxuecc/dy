<!--  -->
<template>
  <div >
    <el-form size="mini" :inline="true" :rules="rules" :model="specifications" style="padding-left:15px">
    <div
      class="left"
      style="
        background: rgb(249, 249, 250);
        padding: 16px 12px;
        margin-right: 30px;
        border-radius: 4px;
        margin-bottom: 10px;
      "
      v-for="(specification, index) in specifications"
      :key="specification.spec_id"
    >
      <div>
        <!-- 规格名 -->
        <div class="flex justify-b mb-16 ">
          <span style="line-height:29px">
            <el-form-item  :prop="`[${index}].name`">
              <el-input
                v-model="specification.name"
                style="width:200px"
                placeholder="请填写规格名字"
                @input="handleChangeSpecifications($event,specification)"></el-input>
            </el-form-item>
              <el-checkbox
                v-model="specification.addSkuImage"
                @change="handleChangeAddImage($event,specification)"
                size="mini"
                v-if="index === 0"
                >添加规格图片
                <span class="warning">(若为用户自定义上传的图片，系统仅能保存7天，请尽快上传该商品到抖音!)</span>
              </el-checkbox>
          </span>
          <hh-icon
            @click="deleteSpecifications(index)"
            v-if="specifications.length > 1"
            type="iconshanchu1"
            style="line-height:29px"
            class="font-14 pointer hover-light">
          </hh-icon>
        </div>

        <div class="flex justify-b mb-5">
          <span>规格值(已选{{specification.value_list.length}})</span>
          <span
              :class="[ true > 1 ? 'color-primary' : 'color-767989', 'font-12', 'pointer', 'hover-light']"
              @click="handleSortAddSpecificationValue(index, specification)"
            >
            <hh-icon type="iconpaixu"></hh-icon>
            自定义排序
          </span>
        </div>

        <!-- 规格值列表 -->
        <div class="flex wrap">
          <div
            v-for="(
              specificationValue, idx
            ) in specification.value_list"
            :key="specificationValue.skuString"
            style="flex: 0 0 25%; max-width: 25%;"
            class="mb-10"
          >
              <div class="flex align-c mb-10">
                <el-form-item :prop="`[${index}].value_list[${idx}].name`">
                  <el-input
                    v-model="specificationValue.name"
                    @input="handleChangeSpecificationValues"
                    size="mini"
                    placeholder="请填写规格值"
                  ></el-input>
                </el-form-item>
                <hh-icon
                  type="iconshanchu1"
                  class="pointer hover-light"
                  style="font-size: 12px"
                  @click="
                    handleDeleteSingleSku(idx,index,specification.value_list)
                  "
                ></hh-icon>
              </div>

            <!-- 图片上传 -->
            <el-form-item :prop="`[${index}].value_list[${idx}].image`" class="form-image" >
              <div v-if="specification.addSkuImage" class="mt-15 relative">
                <el-upload
                  v-if="!specificationValue.image"
                  slot="reference"
                  :class="[
                    'skuSelect-el-upload--picture-card ',
                    'hover-skuSelect-el-upload--picture-card',
                  ]"
                  :show-file-list="false"
                  :on-success="
                    (response, file, fileList) =>
                      handleUploadSuccess(
                        response,
                        file,
                        fileList,
                        idx,
                        specificationValue,
                        index
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
                  v-else
                  :class="['skuSelect-el-upload--picture-card ']"
                >
                  <div class="imgWrapper">
                      <el-image
                        :src="specificationValue.image"
                        :class="`avatar validImageSIze `"
                        :ref="`img${specificationValue.skuString}-${idx}`"
                        :preview-src-list="[specificationValue.image]"
                        referrerPolicy="no-referrer"
                      />
                      <el-popover
                        placement="left"
                        width="270"
                        popper-class="SkuSelect-popper-class"
                        trigger="hover">
                        <img :src="specificationValue.image" style="width: 270px;" referrerPolicy="no-referrer"/>
                        <div
                          slot="reference"
                            :class="[
                              'mask',
                              'flex',
                              'justify-b',
                              'align-c'
                            ]"
                        >
                          <hh-icon
                            type="iconxiazai1"
                            style="font-size: 15px;"
                            class="iconshanchu1"
                            @click="downloadIamge(specificationValue.image,`${specification.name}-${specificationValue.name}-${idx}`)"
                          />
                          <hh-icon
                            type="iconcaijian1"
                            style="font-size: 15px;"
                            class="iconshanchu1"
                            @click="clipIamge(
                              specificationValue.image,
                              idx,
                              specificationValue,
                              specification,
                              index
                            )"
                          />
                          <hh-icon
                            type="iconshanchu1"
                            style="font-size: 13px;"
                            class="iconshanchu1"
                            @click="deleteImage(
                              idx,
                              specificationValue,
                              specification,
                              index
                            )"
                          />
                        </div>
                      </el-popover>
                  </div>
                </div>
              </div>
            </el-form-item>

          </div>

          <el-input
            size="mini"
            placeholder="输入新的sku规格值"
            style="width:150px"
            class="mb-10"
            v-model="specification.addSpecificationValue"
            @change="handleAddSpecificationValue($event, index, specification)"
          ></el-input>
        </div>
      </div>
    </div>

    <div class="left mb-10" v-if="showAddSpecifications">
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="medium"
        plain
        @click="addSpecifications"
        >添加规格</el-button>
    </div>

    <el-dialog
      title="自定义排序"
      :visible.sync="dialogVisible"
      width="30%"
      custom-class="skuSelect-dialog"
      :modal="false"
    >
      <div class="left sortDesc">
        <span class="sortName">{{
          specifications && specifications[activeIndex]
            ? specifications[activeIndex].name
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
            :key="specificationValue.name"
            >{{ specificationValue.name }}</span
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
    </el-form>

    <ClipImage ref="ClipImage" @submit="ClipImageSubmit" ></ClipImage>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import shortid from 'shortid'
import cloneDeep from 'lodash/cloneDeep'
import ClipImage from '@/components/ClipImage'

export default {
  name: 'SkuSelect',
  props: {
    msg: String,
    belongType: {
      type: Number,
      default: 0
    },
    // specifications: {
    //   type: Array,
    //   default: [
    //     {
    //       specificationName: '',
    //       newSpecificationName: '',
    //       addSkuImage: false,
    //       skuSelectCheckList: [],
    //       addSpecificationValue: '',
    //       value_list: [],
    //       specificationNameVisible: false
    //     }
    //   ]
    // },
    skuPropertyValueMap: Object
  },
  components: {
    draggable,
    ClipImage
  },
  data () {
    return {
      dialogVisible: false,
      activeIndex: 0,
      drag: false,
      dragList: [],
      specifications: []
    }
  },
  computed: {
    rules () {
      const nameRules = {}
      const specificationValueRules = {}
      // 规格名
      const validateName = index => (rule, value, callback) => {
        const nameList = this.specifications
          .filter((item, idx) => idx !== index)
          .map(item => item.name)
        if (!value) {
          callback(new Error('请输入规格名称'))
        } else if (value && nameList.includes(value)) {
          callback(new Error('规格名称重复！'))
        } else {
          callback()
        }
      }
      this.specifications.forEach((item, index) => {
        const key = `[${index}].name`
        nameRules[key] = [
          { validator: validateName(index), trigger: ['focus', 'blur', 'change'] }
        ]
      })
      // 规格值
      const validateSpecificationValue = (index, idx) => (rule, value, callback) => {
        const valueList = this.specifications[index].value_list
          .filter((item, count) => idx !== count)
          .map(item => item.name)
        if (!value) {
          callback(new Error('请输入规格值'))
        } else if (value && valueList.includes(value)) {
          callback(new Error('规格值重复！'))
        } else {
          callback()
        }
      }
      this.specifications.forEach((specification, index) => {
        specification.value_list.forEach((list, idx) => {
          const key = `[${index}].value_list[${idx}].name`
          specificationValueRules[key] = [
            { validator: validateSpecificationValue(index, idx), trigger: ['focus', 'blur', 'change'] }
          ]
        })
      })

      return {
        ...nameRules,
        ...specificationValueRules
      }
    },
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
          (specification) => specification.name
        )
      )
    }
  },
  methods: {
    init (specifications) {
      this.specifications = cloneDeep(specifications).map(specification => {
        specification.value_list.forEach((value, index) => {
          value.order = index
          if (value.image) {
            specification.addSkuImage = true
          }
        })
        return specification
      })
    },
    // 规格名字添加
    handleSpecificationNameChange (value, index) {
      const specificationNames = this.specifications.map(
        (item) => item.name
      )
      if (specificationNames.includes(value)) {
        return this.$message.error('规格名不能重复')
      }
      this.specifications[index].name = value
      this.$nextTick(() => {
        this.$emit('change', this.specifications, 'add')
      })
    },
    // 添加规格值
    handleAddSpecificationValue (value, index, row) {
      if (!value) {
        return false
      }
      if (
        row.value_list.find(
          (item) => item.name === value
        )
      ) {
        return this.$message.warning('规格值不能重复')
      }
      const specId = `${row.spec_id}`
      const skuValueKey = `skuString-${shortid.generate()}`
      const newOption = {
        image: '',
        name: value,
        spec_detail_id: `${specId}:${skuValueKey}`,
        order: row.value_list.length
      }
      row.value_list.push(newOption)
      row.addSpecificationValue = ''
      this.$set(this.specifications, index, row)
      this.$emit('change', this.specifications, 'add')
    },
    // 删除单个sku
    handleDeleteSingleSku (idx, index, list) {
      // 如果删除 整个规格为空 则返回数据 this.specifications - 1
      if (list.length === 1 && this.specifications.length === 1) {
        this.$message.warning('至少保留一个规格')
        return false
      }
      list.splice(idx, 1)
      let specifications = [...this.specifications]
      if (!list.length) {
        specifications.splice(index, index + 1)
      }
      this.$emit('change', specifications, 'delete')
    },
    // 排序
    handleSortAddSpecificationValue (index, row) {
      this.dragList = row.value_list
      this.activeIndex = index
      this.dialogVisible = true
    },
    // 修改规格
    changeSpecificationValue (value, idx, row, specification, index) {
      if (!value) {
        this.$message.error('请输入规格值')
      }
      const specifications = this.specifications.map((item, i) => {
        if (i === index) {
          item.value_list[idx].value = value
        }
        return item
      })
      this.$nextTick(() => {
        this.$set(row, 'value', value)
        this.$emit('change', specifications, 'edit')
      })
    },
    // 重置 排序
    resetSort () {
      this.dragList = this.dragList.sort((a, b) => a.order - b.order)
    },
    // 排序
    sort () {
      const nextspecifications = cloneDeep(this.specifications)
      nextspecifications[this.activeIndex].value_list = this.dragList.map((item, index) => ({ ...item, order: index }))
      this.specifications = nextspecifications
      this.$emit('change', nextspecifications, 'edit')
      this.dialogVisible = false
      this.activeIndex = 0
      this.dragList = []
    },
    // 取消 排序
    cancelSort () {
      this.dialogVisible = false
    },
    // 添加规格
    addSpecifications () {
      this.specifications = [
        ...this.specifications,
        {
          specificationName: '',
          newSpecificationName: '',
          addSkuImage: false,
          skuSelectCheckList: [],
          addSpecificationValue: '',
          value_list: [],
          specificationNameVisible: false,
          spec_id: shortid.generate(),
          id: `id-${shortid.generate()}`
        }
      ]
    },
    // 删除规格
    deleteSpecifications (index) {
      this.$confirm('确定删除该规格么？', '', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.specifications.splice(index, 1)
          this.$nextTick(() => {
            this.$emit('change', this.specifications, 'delete')
          })
        })
        .catch(() => {})
    },
    handleChangeAddImage (value) {
      this.$emit('change', this.specifications, 'edit')
    },
    handleChangeSpecificationValues (value) {
      // 规格值不能重复'
      if (value) this.$emit('change', this.specifications, 'edit')
    },
    // 修改规格
    handleChangeSpecifications (value, specification) {
      // 规格值不能重复'
      if (specification.value_list.length) this.$emit('change', this.specifications, 'edit')
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
    async handleUploadSuccess (response, file, fileList, idx, specificationValue, index) {
      if (parseInt(response.code) !== 0) {
        if (response.msg) {
          this.$message.error(response.msg)
        }
        return
      }
      const url = response.data.url
      const specifications = this.specifications.map((item, i) => {
        if (i === index) {
          item.value_list[idx].image = url
        }
        return item
      })
      this.$nextTick(() => {
        this.$set(specificationValue, 'image', url)
        this.$emit('change', specifications, 'edit')
      })
    },
    handleUploadError (err, file, fileList) {
      this.$message.error(err.message)
    },
    // 删除图片
    deleteImage (idx, specificationValue, specification, index) {
      const specifications = this.specifications.map((item, i) => {
        if (i === index) {
          item.value_list[idx].image = ''
        }
        return item
      })
      this.$nextTick(() => {
        this.$set(specificationValue, 'image', '')
        this.$emit('change', specifications, 'edit')
      })
    },
    previewImage (item, refName) {
      if (this.$refs[refName] && this.$refs[refName][0] && this.$refs[refName][0].clickHandler) {
        this.$refs[refName][0].clickHandler()
      }
    },
    downloadIamge (imgsrc, name) {
      var image = new Image()
        // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function () {
        var canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        var context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        var url = canvas.toDataURL('image/png') // 得到图片的base64编码数据
        var a = document.createElement('a') // 生成一个a元素
        var event = new MouseEvent('click') // 创建一个单击事件
        a.download = name || 'photo' // 设置图片名称
        a.href = url // 将生成的URL设置为a.href属性
        a.dispatchEvent(event) // 触发a的单击事件
      }
      image.src = imgsrc
    },
    clipIamge (url, idx, specificationValue, index) {
      this.activeImage = {
        idx,
        specificationValue,
        index
      }
      this.$refs.ClipImage.open(url)
    },
    ClipImageSubmit (url) {
      const {idx, specificationValue, index} = this.activeImage
      const specifications = this.specifications.map((item, i) => {
        if (i === index) {
          item.value_list[idx].image = url
        }
        return item
      })
      this.$nextTick(() => {
        this.$set(specificationValue, 'image', url)
        this.$emit('change', specifications, 'edit')
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '~./SkuSelect.less';
.hover-light {
  &:hover {
    color: @color-primary;
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

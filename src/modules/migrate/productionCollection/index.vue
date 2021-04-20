<!-- 商品采集 -->
<template>
  <div class="productionCollection left">
    <div class="title">
      <p style="color:#FA6400;font-family: MicrosoftYaHei;"><hh-icon type="icontixing"></hh-icon> 什么是商品采集？</p>
      <p class="info ml-20 mt-5">
        安装虎虎采集助手，将想要采集的商品链接一键导出生成excel表格。采集完成后，前往
        <span class="click" @click="open">导入复制 </span>进行铺货。
      </p>
      <p class="info ml-20 mt-5">
        支持采集平台：
        <img src="@/assets/images/taobao.png" alt="" style="width: 16px" class="pointer" v-hh-open="'https://www.taobao.com/'"/>
        <img src="@/assets/images/tm.png" alt="" style="width: 16px" class="pointer"  v-hh-open="'https://www.tmall.com/'"/>
      </p>
    </div>
    <p class="color-4e mb-10">如何操作？</p>
    <div class="flex justify-b">
      <div class="card">
        <div style="margin-bottom: 30px">
          <div class="flex align-c" style="margin-bottom: 28px">
            <img src="./images/chrome.png" alt="" class="size mr-15" />
            <p class="color-4e font-14">若您是谷歌浏览器用户</p>
          </div>
          <div class="flex" style="margin-left: 56px">
            <div class="flex column align-c mr-5">
              <img src="./images/download.png" alt="" class="size mb-5" />
              <span class="color-767989 font-12">下载插件</span>
            </div>
            <hh-icon type="iconjindujiantou" class="font-12 mt-15"></hh-icon>
            <div class="flex column align-c mr-5 ml-5">
              <img src="./images/unzip.png" alt="" class="size mb-5" />
              <span class="color-767989 font-12">解压安装包</span>
            </div>
            <hh-icon type="iconjindujiantou" class="font-12 mt-15"></hh-icon>
            <div class="flex column align-c mr-5 ml-5">
              <img src="./images/install.png" alt="" class="size mb-5" />
              <span class="color-767989 font-12">添加安装包</span>
            </div>
            <hh-icon type="iconjindujiantou" class="font-12 mt-15"></hh-icon>
            <div class="flex column align-c mr-5 ml-5">
              <img src="./images/plugin.png" alt="" class="size mb-5" />
              <span class="color-767989 font-12">开启插件</span>
            </div>
            <hh-icon type="iconjindujiantou" class="font-12 mt-15"></hh-icon>
            <div class="flex column align-c mr-5 ml-5">
              <img src="./images/collection.png" alt="" class="size mb-5" />
              <span class="color-767989 font-12">开始采集</span>
            </div>
          </div>
        </div>

        <div class="flex">
          <p class="mb-12" style="width: 56px; flex-shrink: 0">第一步：</p>
          <p class="color-666 click" @click="downloadZip">点击下载插件</p>
        </div>

        <div class="flex">
          <p class="mb-12" style="width: 56px; flex-shrink: 0">第二步：</p>
          <p class="color-666">下载完成后，解压安装包到桌面</p>
        </div>

        <div class="flex">
          <p class="mb-12" style="width: 56px; flex-shrink: 0">第三步：</p>
          <div class="color-666">
            <p class="mb-8">
              在浏览器中打开
              <span class="click">chrome://extensions/</span>
              网址，并将解压好的文件拖拽到页面中
              <span class="info">(下图点击可放大)</span>
            </p>
            <div style="width:336px;height:190px"  :class="['mb-12',name === 1?'border':'noborder']">
              <el-image
                :src="img1"
                alt=""
                class="tip mb-12 pointer"
                ref="img1"
                @mouseenter="handleMouseenter(1)"
                @mouseleave="handleMouseleaver(1)"
                :preview-src-list="[img1JPG]">
              </el-image>
            </div>
          </div>
        </div>

        <div class="flex">
          <p class="mb-12" style="width: 56px; flex-shrink: 0">第四步：</p>
          <div class="color-666">
            <p class="mb-8">打开淘宝平台，让插件开始运行<span class="info">(下图点击可放大)</span></p>
            <div style="width:336px;height:407px;" :class="['mb-12',name === 2?'border':'noborder']">
              <el-image
                  :src="img2"
                  alt=""
                  :class="['tip pointer']"
                  :preview-src-list="[img2JPG]"
                  ref="img2"
                  @mouseenter="handleMouseenter(2)"
                  @mouseleave="handleMouseleaver(2)"
                />
            </div>
          </div>
        </div>

        <div class="flex">
          <p class="mb-12" style="width: 56px; flex-shrink: 0">第五步：</p>

          <div class="color-666">
            <p class="mb-8">利用虎虎采集助手开始采集<span class="info">(下图点击可放大)</span></p>
            <div style="width:336px;height:135px;" :class="['mb-12',name === 3?'border':'noborder']">
              <el-image
                  :src="img3"
                  alt=""
                  class="tip mb-12 pointer"
                  :preview-src-list="[img3JPG]"
                  ref="img3"
                  @mouseenter="handleMouseenter(3)"
                  @mouseleave="handleMouseleaver(3)"
                />
            </div>

          </div>
        </div>
      </div>

      <div class="card">
         <div style="margin-bottom: 30px">
          <div class="flex align-c" style="margin-bottom: 28px">
            <img src="./images/360.png" alt="" class="size mr-15" />
            <img src="./images/sogo.png" alt="" class="size mr-15" />
            <p class="color-4e font-14">若您是360/搜狗浏览器用户</p>
          </div>
          <div class="flex" style="margin-left: 56px">
            <div class="flex column align-c mr-5">
              <img src="./images/download.png" alt="" class="size mb-5" />
              <span class="color-767989 font-12">下载插件</span>
            </div>
            <hh-icon type="iconjindujiantou" class="font-12 mt-15"></hh-icon>
            <div class="flex column align-c mr-5 ml-5">
              <img src="./images/install.png" alt="" class="size mb-5" />
              <span class="color-767989 font-12">添加安装包</span>
            </div>
            <hh-icon type="iconjindujiantou" class="font-12 mt-15"></hh-icon>
            <div class="flex column align-c mr-5 ml-5">
              <img src="./images/collection.png" alt="" class="size mb-5" />
              <span class="color-767989 font-12">开始采集</span>
            </div>
          </div>
        </div>

        <div class="flex">
          <p class="mb-12" style="width: 56px; flex-shrink: 0">第一步：</p>
          <p class="color-666 click" @click="downloadCrx">点击下载插件</p>
        </div>

        <div class="flex">
          <p class="mb-12" style="width: 56px; flex-shrink: 0">第二步：</p>
          <div class="color-666">
            <p class="mb-8">
              将下载完成的文件拖拽到360/搜狗浏览器的地址栏，并点击【添加】<span class="info">(下图点击可放大)</span>
            </p>

            <div style="width:336px;height:219px;" :class="['mb-12',name === 4?'border':'noborder']">
              <el-image
                  :src="img4"
                  alt=""
                  class="tip mb-12 pointer"
                  :preview-src-list="[img4JPG]"
                  ref="img4"
                  @mouseenter="handleMouseenter(4)"
                  @mouseleave="handleMouseleaver(4)"
                />
            </div>
          </div>
        </div>

        <div class="flex">
          <p class="mb-12" style="width: 56px; flex-shrink: 0">第三步：</p>
          <div class="color-666">
            <p class="mb-8">利用虎虎采集助手开始采集<span class="info">(下图点击可放大)</span></p>

            <div style="width:336px;height:135px;" :class="['mb-12',name === 5?'border':'noborder']">
              <el-image
                  :src="img5"
                  alt=""
                  class="tip mb-12 pointer"
                  :preview-src-list="[img5JPG]"
                  ref="img5"
                  @mouseenter="handleMouseenter(5)"
                  @mouseleave="handleMouseleaver(5)"
                />
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog  :visible.sync="visible">
      <img :src="activeImg" alt="" style="width:70%">
    </el-dialog>

  </div>
</template>

<script>
import img1JPG from './images/1.gif'
import img2JPG from './images/2.gif'
import img3JPG from './images/3.gif'
import img4JPG from './images/4.gif'

import img1PNG from './images/1.png'
import img2PNG from './images/2.png'
import img3PNG from './images/3.png'
import img4PNG from './images/4.png'

export default {
  data () {
    return {
      visible: false,
      imagesData: {
        1: {
          gif: img1JPG,
          png: img1PNG
        },
        2: {
          gif: img2JPG,
          png: img2PNG
        },
        3: {
          gif: img4JPG,
          png: img4PNG
        },
        4: {
          gif: img3JPG,
          png: img3PNG
        },
        5: {
          gif: img4JPG,
          png: img4PNG
        }
      },
      img1JPG,
      img2JPG,
      img3JPG: img4JPG,
      img4JPG: img3JPG,
      img5JPG: img4JPG,
      img1: img1PNG,
      img2: img2PNG,
      img3: img4PNG,
      img4: img3PNG,
      img5: img4PNG,
      name: 0
    }
  },
  methods: {
    toggleVisible (name) {
      this.activeImg = this.imagesData[name].gif
      this.visible = true
    },
    open () {
      this.$router.push({
        name: 'StartMigrate',
        params: {
          activeName: 'file'
        }
      })
    },
    handleMouseenter (name) {
      this[`img${name}`] = this.imagesData[name].gif
      this.name = name
    },
    handleMouseleaver (name) {
      this[`img${name}`] = this.imagesData[name].png
      this.name = 0
    },
    downloadCrx () {
      if (window._hmt) {
        window._hmt.push([
          '_trackEvent',
          '开始复制',
          '下载',
          '下载360浏览器安装包'
        ])
      }
      let link = document.createElement('a')
      link.href =
        'https://plugin-file.oss-cn-shanghai.aliyuncs.com/huhuPlug.crx'
      link.download = 'huhuPlug.crx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    downloadZip () {
      if (window._hmt) {
        window._hmt.push([
          '_trackEvent',
          '开始复制',
          '下载',
          '下载Chrome浏览器安装包'
        ])
      }
      let link = document.createElement('a')
      link.href =
        'https://plugin-file.oss-cn-shanghai.aliyuncs.com/huhuPlug.zip'
      link.download = 'huhuPlug.zip'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>

<style lang='less' scoped>
.title {
  background: #fff6ed;
  border-radius: 3px;
  border: 1px solid rgba(250, 100, 0, 0.2);
  padding: 14px 20px;
  margin-bottom: 30px;
}
.card {
  background: #ffffff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  border: 1px solid #f2f2f2;
  padding: 26px 25px 29px 28px;
  margin-bottom: 50px;
  width: calc(50% - 15px);
  box-sizing: border-box;
}

.mr-15 {
  margin-right: 15px;
}

.ml-2 {
  margin-left: 2px;
}

.mt-15 {
  margin-top: 15px;
}
.mb-8 {
  margin-bottom: 8px;
}

.mb-12 {
  margin-bottom: 12px;
}

.size {
  width: 40px;
  height: 40px;
}

.tip {
  width: 336px;
  border-radius: 4px;

}

.border {
  border:1px solid @color-primary;
  border-radius: 4px;
}

.noborder {
  border:1px solid transparent;
  border-radius: 4px;
}

/deep/ .el-image-viewer__img {
  height: 60%;
}
</style>

<!-- 商品采集 -->
<template>
  <div class="productionCollection left">
    <div class="title">
      <p style="color: #fa6400; font-family: MicrosoftYaHei">
        <hh-icon type="icontixing"></hh-icon> 什么是商品采集？
      </p>
      <p class="info ml-20 mt-5">
        安装虎虎采集助手，将想要采集的商品链接一键导出生成excel表格。采集完成后，前往
        <span class="click" @click="open">导入复制 </span>进行铺货。
      </p>
      <p class="info ml-20 mt-5">
        支持采集平台：
        <img
          src="@/assets/images/taobao.png"
          alt=""
          style="width: 16px"
          class="pointer"
          v-hh-open="'https://www.taobao.com/'"
        />
        <img
          src="@/assets/images/tm.png"
          alt=""
          style="width: 16px"
          class="pointer"
          v-hh-open="'https://www.tmall.com/'"
        />
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
              <span class="info">(以下所有图片可点击放大)</span>
            </p>
            <div
              style="width: 336px; height: 190px"
              :class="['mb-12', name === 1 ? 'border' : 'noborder']"
            >
              <el-image
                :src="img1"
                alt=""
                class="tip mb-12 pointer"
                ref="img1JPG"
                @mouseenter="handleMouseenter(1)"
                @mouseleave="handleMouseleaver(1)"
                :preview-src-list="[imagesData[1].gif]"
              >
              </el-image>
            </div>
          </div>
        </div>

        <div class="flex">
          <p class="mb-12" style="width: 56px; flex-shrink: 0">第四步：</p>
          <div class="color-666">
            <p class="mb-8">
              打开
              <span class="click" v-hh-open="'https://www.taobao.com/'"
                >淘宝</span
              >
              平台，让插件开始运行
            </p>
            <div
              style="width: 336px; height: 407px"
              :class="['mb-12', name === 2 ? 'border' : 'noborder']"
            >
              <el-image
                :src="img2"
                alt=""
                class="tip mb-12 pointer"
                ref="img2JPG"
                @mouseenter="handleMouseenter(2)"
                @mouseleave="handleMouseleaver(2)"
                :preview-src-list="[imagesData[2].gif]"
              >
              </el-image>
            </div>
          </div>
        </div>

        <div class="flex">
          <p class="mb-12" style="width: 56px; flex-shrink: 0">第五步：</p>
          <div class="color-666">
            <p class="mb-8">利用虎虎采集助手开始采集</p>
            <div
              style="width: 336px; height: 150px"
              :class="['mb-12', name === 3 ? 'border' : 'noborder']"
            >
              <el-image
                :src="img3"
                alt=""
                class="tip mb-12 pointer"
                ref="img3JPG"
                @mouseenter="handleMouseenter(3)"
                @mouseleave="handleMouseleaver(3)"
                :preview-src-list="[imagesData[3].gif]"
              >
              </el-image>
            </div>
          </div>
        </div>

        <div class="flex">
          <p class="mb-12" style="width: 56px; flex-shrink: 0">第六步：</p>
          <div class="color-666">
            <p class="mb-8">
              查看已采集的商品，并下载形成excel，前往
              <span class="click" @click="open">导入复制</span>
              进行复制
            </p>
            <div
              style="width: 336px; height: 356px"
              :class="['mb-12', name === 6 ? 'border' : 'noborder']"
            >
              <el-image
                :src="img6"
                alt=""
                class="tip mb-12 pointer"
                ref="img6JPG"
                @mouseenter="handleMouseenter(6)"
                @mouseleave="handleMouseleaver(6)"
                :preview-src-list="[imagesData[6].gif]"
              >
              </el-image>
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
              将下载完成的文件拖拽到360/搜狗浏览器的地址栏，并点击【添加】

            </p>

            <div
              style="width: 336px; height: 219px"
              :class="['mb-12', name === 4 ? 'border' : 'noborder']"
            >
              <el-image
                :src="img4"
                alt=""
                class="tip mb-12 pointer"
                ref="img4JPG"
                @mouseenter="handleMouseenter(4)"
                @mouseleave="handleMouseleaver(4)"
                :preview-src-list="[imagesData[4].gif]"
              >
              </el-image>
            </div>
          </div>
        </div>

        <div class="flex">
          <p class="mb-12" style="width: 56px; flex-shrink: 0">第三步：</p>
          <div class="color-666">
            <p class="mb-8">
              打开<span class="click" v-hh-open="'https://www.taobao.com/'">淘宝</span>平台，
              利用虎虎采集助手开始采集</p>
            <div
              style="width: 336px; height: 150px"
              :class="['mb-12', name === 5 ? 'border' : 'noborder']"
            >
              <el-image
                :src="img5"
                alt=""
                class="tip mb-12 pointer"
                ref="img5JPG"
                @mouseenter="handleMouseenter(5)"
                @mouseleave="handleMouseleaver(5)"
                :preview-src-list="[imagesData[5].gif]"
              >
              </el-image>
            </div>
          </div>
        </div>

        <div class="flex">
          <p class="mb-12" style="width: 56px; flex-shrink: 0">第四步：</p>
          <div class="color-666">
            <p class="mb-8">
              查看已采集的商品，并下载形成excel，前往
              <span class="click" @click="open">导入复制</span>
              进行复制
            </p>

            <div
              style="width: 336px; height: 310px"
              :class="['mb-12', name === 7 ? 'border' : 'noborder']"
            >
              <el-image
                :src="img7"
                alt=""
                class="tip mb-12 pointer"
                ref="img7JPG"
                @mouseenter="handleMouseenter(7)"
                @mouseleave="handleMouseleaver(7)"
                :preview-src-list="[imagesData[7].gif]"
              >
              </el-image>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ZIP_PLUGIN_URL, CRX_PLUGIN_URL } from '@/common/pluginUrls'

const originImgaeURl = [
  'https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00d1de642335473da7eb5bb42d728297~tplv-k3u1fbpfcp-watermark.image',
  'https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f86131fb519e4ef1b7c6b6031447b890~tplv-k3u1fbpfcp-watermark.image',
  'https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7aa3a13c62a4fe0942770b6ee203c59~tplv-k3u1fbpfcp-watermark.image',
  'https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01b999065d4d44bfbac0b8c9ec10109c~tplv-k3u1fbpfcp-watermark.image',
  'https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57ffe3f7171847ad9e63046d809a9e8d~tplv-k3u1fbpfcp-watermark.image',
  'https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b25a0c1866e540d59ca49b6a20586c98~tplv-k3u1fbpfcp-watermark.image',
  'https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8da039ae3f41466d985299fccb07b9f2~tplv-k3u1fbpfcp-watermark.image',
  'https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7882ac3d514a4298bb51c0ec0352086d~tplv-k3u1fbpfcp-watermark.image',
  'https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d47a9b0a2fe4fe08a2947ad3f4785aa~tplv-k3u1fbpfcp-watermark.image',
  'https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/432f0809d383439fb476ad0ee0c4b6e4~tplv-k3u1fbpfcp-watermark.image',
  'https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c031cc2497543629ff82aaa83064395~tplv-k3u1fbpfcp-watermark.image',
  'https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/124248bd1fa84568bd165faac519f007~tplv-k3u1fbpfcp-watermark.image'
]

const imagesData = {
  1: {
    gif: originImgaeURl[0],
    png: originImgaeURl[1]
  },
  2: {
    gif: originImgaeURl[2],
    png: originImgaeURl[3]
  },
  3: {
    gif: originImgaeURl[6],
    png: originImgaeURl[7]
  },
  4: {
    gif: originImgaeURl[4],
    png: originImgaeURl[5]
  },
  5: {
    gif: originImgaeURl[6],
    png: originImgaeURl[7]
  },
  6: {
    gif: originImgaeURl[8],
    png: originImgaeURl[9]
  },
  7: {
    gif: originImgaeURl[10],
    png: originImgaeURl[11]
  }
}
export default {
  data () {
    return {
      visible: false,
      imagesData,
      name: 0,
      img1: imagesData[1].png,
      img2: imagesData[2].png,
      img3: imagesData[3].png,
      img4: imagesData[4].png,
      img5: imagesData[5].png,
      img6: imagesData[6].png,
      img7: imagesData[7].png,
      count: 1
    }
  },
  created () {
    this.preload()
  },
  watch: {
    count (n) {
      if (n === originImgaeURl.length) {
        this.loading = false
      } else {
        this.loading = true
      }
    }
  },
  methods: {
    preload: function () {
      let imgs = originImgaeURl

      for (let img of imgs) {
        let image = new Image()
        image.src = img
        image.onload = () => {
          this.count++
        }
      }
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
      link.href = CRX_PLUGIN_URL
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
      link.href = ZIP_PLUGIN_URL
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
  min-width: 490px;
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
  transition: all 0.3s;
}

.border {
  border: 1px solid @color-primary;
  border-radius: 4px;
}

.noborder {
  border: 1px solid transparent;
  border-radius: 4px;
}

/deep/ .el-image-viewer__img {
  height: 60%;
}
</style>

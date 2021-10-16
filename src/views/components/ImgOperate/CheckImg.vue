<style lang='scss'>
  .el-dialog__body {
    padding: 0 20px 30px 20px;
  }

  .el-main {
    padding: 0 60px;
  }

  .vue-small-img {
    width: 100%;
    height: 96px;
    line-height: 96px;
    overflow: hidden;
    border: 1px solid #e7e7e7;
    margin-top: 10px;
    .img {
      display: inline-block;
      vertical-align: middle;
      width: 100%;
      height: auto;
    }
  }

  .vue-big-img-box {
    width: 100%;
    height: 376px;
    line-height: 376px;
    background-color: #32363f;
    overflow: hidden;
    /*display: flex;
    justify-content: center;
    -webkit-justify-content: center;
    align-items: center;*/
    position: relative;
    .vue-big-img {
      height: auto;
      width: auto;
      margin: 0 auto;
      display: inline-block;
      vertical-align: middle;
      position: absolute;
    }
  }

  .vue-enclosure-name {
    width: 100%;
    height: 30px;
    text-align: center;
    margin: 0;
  }

  .vue-left, .vue-right {
    position: absolute;
    top: 195px;
    font-size: 46px;
    color: #a5a5a5;
  }

  .vue-left:focus, .vue-right:focus, .vue-left:hover, .vue-right:hover {
    color: #6db66d;
  }

  .vue-left {
    left: 14px;
  }

  .vue-right {
    right: 14px;
  }

  .footer-btn {
    width: 100%;
    height: 38px;
    line-height: 38px;
    text-align: center;
    margin-top: 12px;
    span {
      display: inline-block;
      width: 38px;
      height: 38px;
      margin: 0 2px;
    }
    .leftRotate {
      background: rgba(0, 0, 0, 0.4) url(./images/left-rotate.png) no-repeat center;
      -webkit-background-size: auto 24px;
      background-size: auto 24px;
    }
    .rightRotate {
      background: rgba(0, 0, 0, 0.4) url(./images/right-rotate.png) no-repeat center;
      -webkit-background-size: auto 24px;
      background-size: auto 24px;
    }
    .enlarge {
      background: rgba(0, 0, 0, 0.4) url(./images/center.png) no-repeat center;
      -webkit-background-size: auto 24px;
      background-size: auto 24px;
    }
  }
</style>

<template>
  <!--内层嵌套查看图片弹窗-->
  <el-dialog
    width="980px"
    top="0"
    title="查看图片"
    :visible.sync="imgModal.modal"
    class="vertical-center-modal"
    append-to-body>
    <el-container style="height: 466px">
      <el-aside width="126px" style="padding-top: 20px;">
        <div
          v-for="(item, idx) in imgModal.imgList"
          :key="idx"
          :style="{border: getBorderColor(idx)}"
          @click="getCurBigImg(idx)"
          class="vue-small-img">
          <img :src="item.imgUrl" class="img"/>
        </div>
      </el-aside>
      <el-main style="position: relative;" v-if="bigImgUrl">
        <h4 class="vue-enclosure-name">{{bigImgType || ''}}</h4>
        <div class="vue-big-img-box" id="imgBox" @mousewheel="wheel">
          <img
            :src="bigImgUrl"
            ondragstart="return false"
            id="img"
            :style="imgStyle"
            @load="successLoadImg"
            @error="errorLoadImg"
            @mousedown="start"
            @mouseup="stop"
            @mouseout="stop"
            @mousemove="move"
            class="vue-big-img"/>
        </div>
        <i class="el-icon-arrow-left vue-left" @click="getCurBigImg('left')"></i>
        <i class="el-icon-arrow-right vue-right" @click="getCurBigImg('right')"></i>
        <div class="footer-btn">
          <span class="enlarge" @click="changeImgSize"></span>
          <span class="leftRotate" @click="rotateImg('left')"></span>
          <span class="rightRotate" @click="rotateImg('right')"></span>
        </div>
      </el-main>
    </el-container>
  </el-dialog>
</template>

<script>
  import {Message} from 'element-ui'

  export default {
    name: 'checkImg',
    data() {
      return {
        curUrlIdx: 0, // 当前的大图序号
        bigImgType: '',
        bigImgUrl: '',
        imgStyle: '',
        imgW: 0,
        imgH: 0,
        imgBoxW: 0,
        imgBoxH: 0,
        curEnlarge: 0,
        moveData: {
          canDrag: false,
          x0: 0,
          y0: 0,
          x1: 0,
          y1: 0
        }, // 移动
        rotate: 0 // 旋转角度
      }
    },
    props: {
      imgModal: Object
    },
    watch: {
      'imgModal.modal': function (newVal) {
        if (!newVal) {
          this.curUrlIdx = 0
          this.bigImgType = ''
          this.bigImgUrl = ''
          this.imgStyle = ''
          this.curEnlarge = 0
          this.rotate = 0
          this.setImgReg()
        } else {
          this.bigImgType = this.imgModal.imgList[0].type || ''
          this.bigImgUrl = this.imgModal.imgList[0].bigImgUrl
        }
      }
    },
    components: {},
    created() {
    },
    methods: {
      getBorderColor(idx) {
        return idx === this.curUrlIdx ? '1px solid #6db66d' : '1px solid #e7e7e7'
      },
      successLoadImg(evt) {
        if (evt.target.complete === true) {
          const e = evt.currentTarget
          this.imgW = e.offsetWidth
          this.imgH = e.offsetHeight
          const imgBox = document.querySelector('#imgBox')
          this.imgBoxW = imgBox.offsetWidth
          this.imgBoxH = imgBox.offsetHeight
          this.setImgSize(this.imgW, this.imgH)
        }
      },
      setImgSize(imgW, imgH) {
        const imgWH = (imgW / imgH).toFixed(6)
        const imgBoxWH = (this.imgBoxW / this.imgBoxH).toFixed(6)
        let imgCurW, imgCurH, top, left
        if (imgWH > imgBoxWH) {
          if (imgW > this.imgBoxW) {
            top = (this.imgBoxH - this.imgBoxW * imgH / imgW) / 2
            left = 0
            imgCurW = this.imgBoxW
            imgCurH = 'auto'
          } else {
            top = (this.imgBoxH - imgH) / 2
            left = (this.imgBoxW - imgW) / 2
            imgCurW = imgW
            imgCurH = imgH
          }
        } else {
          if (imgH > this.imgBoxH) {
            top = 0
            left = (this.imgBoxW - this.imgBoxH * imgW / imgH) / 2
            imgCurW = 'auto'
            imgCurH = this.imgBoxH
          } else {
            top = (this.imgBoxH - imgH) / 2
            left = (this.imgBoxW - imgW) / 2
            imgCurW = imgW
            imgCurH = imgH
          }
        }
        this.imgStyle = `width:${imgCurW}px;height:${imgCurH}px;left:${left}px;top:${top}px`
      },
      errorLoadImg() {
        Message({
          message: '图片加载失败！',
          type: 'warning'
        })
      },
      getCurBigImg(evt) {
        if (evt === 'left' || evt === 'right') {
          evt === 'left' ? this.curUrlIdx-- : this.curUrlIdx++
          if (this.curUrlIdx < 0) {
            this.curUrlIdx = 0
            return Message({
              message: '已经是第一张！',
              type: 'warning'
            })
          }
          if (this.curUrlIdx > this.imgModal.imgList.length - 1) {
            this.curUrlIdx = this.imgModal.imgList.length - 1
            return Message({
              message: '已经是最后一张！',
              type: 'warning'
            })
          }
        } else {
          this.curUrlIdx = evt
        }
        this.bigImgType = this.imgModal.imgList[this.curUrlIdx].type
        this.bigImgUrl = this.imgModal.imgList[this.curUrlIdx].bigImgUrl
        this.imgStyle = ''
        this.curEnlarge = 0
        this.rotate = 0
        this.setImgReg()
      },
      start(evt) {
        // 鼠标左键点击
        if (evt.button === 0) {
          this.moveData.canDrag = true
          // 记录鼠标指针位置
          this.moveData.x0 = evt.clientX
          this.moveData.y0 = evt.clientY
        }
      },
      stop() {
        this.moveData.canDrag = false
      },
      move(evt) {
        if (this.moveData.canDrag) {
          this.moveData.x1 = evt.clientX
          this.moveData.y1 = evt.clientY

          const x = this.moveData.x1 - this.moveData.x0
          const y = this.moveData.y1 - this.moveData.y0
          const img = document.querySelector('#img')
          let left = img.offsetLeft + x
          let top = img.offsetTop + y
          if ((img.offsetWidth + left) < 40) {
            left = 40 - img.offsetWidth
          }
          if (this.imgBoxW - left < 40) {
            left = this.imgBoxW - 40
          }
          if ((img.offsetHeight + top) < 40) {
            left = 40 - img.offsetHeight
          }
          if (this.imgBoxH - top < 40) {
            top = this.imgBoxH - 40
          }
          this.imgStyle = `width:${img.offsetWidth}px;height:${img.offsetHeight}px;left:${left}px;top:${top}px`
          this.moveData.x0 = this.moveData.x1
          this.moveData.y0 = this.moveData.y1
        }
      },
      wheel(evt) {
        const img = document.querySelector('#img')
        let imgChangeW = ''
        let imgChangeH = ''
        let curLeft = ''
        let curTop = ''
        const left = parseInt(img.offsetLeft)
        const top = parseInt(img.offsetTop)
        this.curEnlarge = (img.offsetWidth / this.imgW).toFixed(2) * 100
        if (evt.wheelDelta > 0) {
          this.curEnlarge = this.curEnlarge + 15
          curLeft = left - this.imgW * 0.15 * 0.5
          curTop = top - this.imgH * 0.15 * 0.5
          if (this.curEnlarge > 100 && this.curEnlarge < 115) {
            curLeft = left - this.imgW * (115 - this.curEnlarge) * 0.5 / 100
            curTop = top - this.imgH * (115 - this.curEnlarge) * 0.5 / 100
          }
        } else {
          this.curEnlarge = this.curEnlarge - 15
          curLeft = left + this.imgW * 0.15 * 0.5
          curTop = top + this.imgH * 0.15 * 0.5
          if (this.curEnlarge > 100 && this.curEnlarge < 115) {
            curLeft = left + this.imgW * (115 - this.curEnlarge) * 0.5 / 100
            curTop = top + this.imgH * (115 - this.curEnlarge) * 0.5 / 100
          }
        }
        if (this.curEnlarge < 25) {
          this.curEnlarge = this.curEnlarge + 15
          return
        }
        if (this.curEnlarge > 150) {
          this.curEnlarge = this.curEnlarge - 15
          return
        }
        if (this.curEnlarge > 100 && this.curEnlarge < 115) {
          imgChangeW = this.imgW
          imgChangeH = this.imgH
        } else {
          imgChangeW = this.imgW * this.curEnlarge / 100
          imgChangeH = this.imgH * this.curEnlarge / 100
        }
        this.imgStyle = `width:${imgChangeW}px;height:${imgChangeH}px;left:${curLeft}px;top:${curTop}px`
      },
      rotateImg(type) {
        this.rotate = type === 'left' ? (this.rotate - 90) % 360 : (this.rotate + 90) % 360
        this.setImgReg()
      },
      setImgReg() {
        const img = document.querySelector('#img')
        img.style.transform = `rotate(${this.rotate}deg)`
        img.style.webkitTransform = `rotate(${this.rotate}deg)`
      },
      changeImgSize() {
        // const img = document.querySelector('#img')
        const top = (this.imgBoxH - this.imgH) / 2
        const left = (this.imgBoxW - this.imgW) / 2
        const imgCurW = this.imgW
        const imgCurH = this.imgH
        this.curEnlarge = (imgCurW / this.imgW).toFixed(2) * 100
        this.imgStyle = `width:${imgCurW}px;height:${imgCurH}px;left:${left}px;top:${top}px`
      }
    },
    computed: {},
    mounted() {
    }
  }
</script>

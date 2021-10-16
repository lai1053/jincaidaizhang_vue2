<style lang='scss'>
  .el-dialog__header{
    height:50px;
  }
  .vue-img {
    padding: 0 40px;
    height: 406px;
    .img-content {
      width: 100%;
      height: 360px;
    }
    .vue-check-box, .vue-check-box1 {
      line-height: 168px;
      height: 168px;
      width: 232px;
      text-align: center;
      border: 1px solid #d3dce6;
      position: relative;
      float: left;
      margin-bottom: 10px;
      margin-right: 10px;
    }
    .vue-check-box {
      padding: 10px 0 0 10px;
    }
    .vue-check-box1 {
      padding: 10px;
    }
    .el-checkbox, .el-checkbox__input {
      display: block;
    }
    .vue-img-box, .vue-img-box1 {
      display: block;
      height: 146px;
      line-height: 146px;
      overflow: hidden;
      .img {
        display: inline-block;
        vertical-align: middle;
        width: 100%;
        height: auto;
      }
      .other-img {
        display: block;
        width: 22px;
        height: 22px;
        background-color: #4ba8eb;
        border-radius: 50%;
        color: #ffffff;
        text-align: center;
        line-height: 22px;
        font-size: 12px;
      }
    }
    .vue-img-box{
      position: absolute;
      top: 10px;
      left: 34px;
      width: 186px;
      .other-img {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    .vue-img-box1 {
      width: 100%;
      .other-img {
        position: absolute;
        top: 6px;
        left: 6px;
      }
    }
    .el-checkbox__label {
      display: none;
    }
    .el-checkbox__input {
      width: 16px;
      height: 148px;
      line-height: 148px;
    }
    .vue-refresh {
      width: 100%;
      line-height: 350px;
      color: #E6A23C;
      font-size: 14px;
      text-align: center;
    }
  }
</style>

<template>
  <div class="vue-img" name="pageIframe9">
    <div v-if="indexData && indexData.checkoutFlag !== 'Y' && String(row.vm_state)!=='2'">
      <div style="margin-bottom: 16px">
        <el-button size="medium" type='primary' @click="updateImg">上传绑定</el-button>
        <el-button size="medium" type='info' plain @click="unbindImg">解绑图片</el-button>
      </div>
      <el-checkbox-group v-if="imgList.length > 0" v-model="checkboxGroup" class="img-content">
        <div v-for="(item, idx) in imgList" :key="idx" class="vue-check-box">
          <el-checkbox :label="idx"></el-checkbox>
          <div class="vue-img-box" @click="toCheckImg(item)">
            <span class="other-img" v-if="item.fjList&&item.fjList.length">{{item.fjList.length+1}}</span>
            <img :src="item.imgUrl" class="img" />
          </div>
        </div>
      </el-checkbox-group>
    </div>
    <div v-if="String(row.vm_state)==='2'&&imgList.length>0" class="img-content">
      <div class="vue-check-box1" v-for="(item, idx) in imgList" :key="idx">
        <div class="vue-img-box1" @click="toCheckImg(item)">
          <span class="other-img" v-if="item.fjList&&item.fjList.length">{{item.fjList.length+1}}</span>
          <img :src="item.imgUrl" class="img" />
        </div>
      </div>
    </div>
    <div v-if="!refresh && imgList.length===0" class="vue-refresh" style="color: #d3dce6">暂无图片</div>
    <div v-show="refresh" class="vue-refresh" @click="getImgsUrl">获取图片列表失败，点击重新获取</div>
    <!--内层嵌套查看图片弹窗-->
    <check-img :img-modal="imgModal"></check-img>
  </div>
</template>

<script>
  import {localParams} from '@/views/components/data/common'
  import {Message, Loading} from 'element-ui'
  import {getImgsUrl, getMdUrl, unBindImg, updateBillImgQty} from '@/api/img'
  import CheckImg from '@/views/components/ImgOperate/CheckImg.vue'

  export default {
    name: 'imgOperate',
    data () {
      return {
        checkboxGroup: [],
        imgList: [],
        refresh: false,
        imgModal: {
          modal: false,
          imgList: []
        },
        indexData: this.$store.getters.indexData
      }
    },
    props: {
      billName: String, // 清单名称 销售:sale || 采购:purchase || 费用:expense || 资金:flowfund || 工资表:salary
      modal: Boolean, // 图片弹窗， 每次打开需要重新获取图片列表
      row: Object, // 当前该条清单信息
      billType: String // 清单编号
    },
    watch: {
      'modal': function(newVal) {
        if (newVal) {
          this.getImgsUrl()
        }
      }
    },
    components: {CheckImg},
    created() {
      this.getImgsUrl()
      window.reloadImgs = this.getImgsUrl
    },
    methods: {
      // 获取图片列表
      getImgsUrl() {
        Loading.service(localParams)
        this.imgList = []
        this.refresh = false
        getImgsUrl({
          billType: this.billType
        }).then((resp) => {
          const list = resp.data.data
          const indexData = this.indexData
          const qdbh = `${indexData.entAcctVO.id}.${this.billType}.${this.row.id}`
          if (list && list.length) {
            list.forEach((item, idx) => {
              if (item.btbj === 'E' || item.btbj === 'Y') {
                item.imgUrl = ''
              }
              if (item.qdbh === qdbh) {
                this.imgList.push(item)
              }
            })
          }
          if (this.imgList.length !== parseInt(this.row.img_qty)) {
            this.updateBillImgQty(this.imgList.length)
          }
          Loading.service().close()
        }, error => {
          this.refresh = true
          Loading.service().close()
        })
      },
      // 上传绑定
      updateImg() {
        // 工资表row无id对应的只有ent_id。lss-2018-4-20
        if (!this.row.id){
          this.row.id = this.row.ent_id
        }
        Loading.service(localParams)
        getMdUrl({
          billType: this.billType,
          id: this.row.id
        }).then((resp) => {
          Loading.service().close()
          window.open(resp)
        })
      },
      // 解绑图片
      unbindImg() {
        const {checkboxGroup, imgList} = this
        if (!checkboxGroup.length) {
          return Message({
            message: '请选择需要解绑的图片！',
            type: 'warning'
          })
        }
        let imgIds = ''
        checkboxGroup.forEach((item, idx) => {
          imgIds += `${imgList[item].dzwjid},`
        })
        imgIds = imgIds.slice(0, imgIds.length - 1)
        Loading.service(localParams)
        const indexData = this.indexData
        const qdbh = `${indexData.entAcctVO.id}.${this.billType}.${this.row.id}`
        unBindImg({
          imgIds: imgIds,
          qdbh: qdbh
        }).then((resp) => {
          Loading.service().close()
          Message({
            message: `${resp.message}`,
            type: 'success'
          })
          this.getImgsUrl()
          /* // 更新图片数量
          const imgLength = imgList.length - checkboxGroup.length
          this.updateBillImgQty(imgLength) */
          this.checkboxGroup = []
        }, error => {
          Loading.service().close()
        })
      },
      // 更新清单绑定图片数量
      updateBillImgQty(imgQty) {
        updateBillImgQty({
          id: this.row.id,
          bill_type_id: this.billType,
          imgQty: imgQty,
          tableName: `bovms_bills_${this.billName}`
        }).then((resp) => {
          this.row.img_qty = imgQty
        }, error => {
          Loading.service().close()
        })
      },
      // 点击图片进入图片查看
      toCheckImg(item) {
        this.imgModal.modal = true
        this.imgModal.imgList = [{
          imgUrl: item.imgUrl,
          bigImgUrl: item.bigImgUrl
        }]
        if (item.fjList && item.fjList.length) {
          item.fjList.forEach((fjItem, fjIdx) => {
            this.imgModal.imgList.push({
              imgUrl: fjItem.imgUrl,
              bigImgUrl: fjItem.bigImgUrl,
              type: `附件${fjIdx + 1}`
            })
          })
        }
      }
    },
    computed: {
    },
    mounted() {
    }
  }
</script>

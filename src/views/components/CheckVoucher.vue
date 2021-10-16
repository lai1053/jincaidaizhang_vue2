<style lang='scss' scoped>
</style>
<template>
  <el-dialog width="1100px" :visible.sync="voucher.modal" top="0" :close-on-click-modal="false"
             class="vertical-center-modal voucher-modal">
    <div style="position: relative;">
      <span class="voucher-modal-close-btn" @click="voucher.modal=false"><i class="el-icon-close"></i></span>
      <!--<el-button-group style="position: absolute;top: 6px; left: 0;">
        <el-button type="primary" plain size="small" round icon="el-icon-arrow-left" @click="toUpOrNextPage('up')">上一张
        </el-button>
        <el-button type="primary" plain size="small" round @click="toUpOrNextPage('next')">下一张<i
          class="el-icon-arrow-right el-icon&#45;&#45;right"></i>
        </el-button>
      </el-button-group>-->
      <iframe
        :src="iframeSrc"
        class="vue-iframe"></iframe>
    </div>
  </el-dialog>
</template>

<script>
  import {Message} from 'element-ui'

  export default {
    name: 'checkVoucher',
    data() {
      return {
        iframeSrc: '',
        token: this.$store.getters.urlInfo.token,
        AccountID: this.$store.getters.urlInfo.accountId,
        pzid: '',
        froms: 'jcgj',
        selectDate: this.$store.getters.urlInfo.ssyf,
        access: 'modify',
        singlepage: '1',
        // url: 'http://ptjcgjhs.zmkhua.com' // 冒烟、生产环境
        // url: 'http://jctest.zmkhua.com:84' // 测试环境
        url: ''
      }
    },
    created () {
      switch (process.env.NODE_ENV) {
        case 'green':
          this.url = 'http://jctest.zmkhua.com:84'
          break
        case 'smoke':
          this.url = 'http://ysx.zmkhua.com:88'
          break
        case 'production':
          this.url = 'http://ptjcgjhs.zmkhua.com'
          break
        case 'testing':
          this.url = 'http://jzfhs.zmkhua.com'
          break
        default:
          this.url = 'http://jctest.zmkhua.com:84'
      }
    },
    props: {
      voucher: Object
    },
    watch: {
      'voucher.modal': function (newVal) {
        if (newVal) {
          this.iframeSrc = `${this.url}/finance/voucher/voucheradd.jsp?token=${this.token}&AccountID=${this.AccountID}&pzid=${this.voucher.vch_id}&from=${this.froms}&selectDate=${this.selectDate}&access=${this.access}&singlepage=${this.singlepage}`
        } else {
          this.iframeSrc = ''
        }
      }
    },
    components: {},
    methods: {
      toUpOrNextPage(type) {
        const voucher = this.voucher
        const {list, vch_id} = voucher
        if (voucher.curListIdx === null) {
          list.forEach((v, i) => {
            if (v === vch_id) {
              voucher.curListIdx = i
            }
          })
        }
        let hasItem = true
        if (type === 'up') {
          voucher.curListIdx = voucher.curListIdx - 1
          if (voucher.curListIdx < 0) {
            hasItem = false
            voucher.curListIdx = 0
          }
        } else {
          voucher.curListIdx = voucher.curListIdx + 1
          if (voucher.curListIdx > list.length - 1) {
            hasItem = false
            voucher.curListIdx = list.length - 1
          }
        }
        if (!hasItem) {
          return Message({
            message: '无更多凭证数据',
            type: 'warning'
          })
        }
        voucher.vch_id = list[voucher.curListIdx]
        this.iframeSrc = `${this.url}/finance/voucher/voucheradd.jsp?token=${this.token}&AccountID=${this.AccountID}&pzid=${this.voucher.vch_id}&from=${this.froms}&selectDate=${this.selectDate}&access=${this.access}&singlepage=${this.singlepage}`
      }
    },
    computed: {},
    mounted() {
    }
  }
</script>

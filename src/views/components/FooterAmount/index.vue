<style lang='scss' scoped>
  .footer-amount{
    width: calc(100% - 370px);
    line-height: 44px;
    .amount-detail {
      max-width: calc(100% - 150px);
      float: left;
      padding: 0;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 44px;
      vertical-align: bottom;
    }
  }
  .footer-float-data{
    list-style: none;
    padding: 0;
    margin: 0;
    line-height: 24px;
    label{
      display: inline-block;
      width: 60px;
    }
    .un-visible{
      display: none;
    }
  }
</style>

<template>

  <div class="footer-amount">
    <span style="font-size: 14px;font-weight: bold; float: left"> 合计&nbsp;&nbsp;</span>
    <el-tooltip placement="top" :disabled="Object.keys(floatData).length === 0">
      <div slot="content">
        <ul class="footer-float-data">
          <li v-for="(item, index) of floatTitle" :class="floatData[index] ? '' : unVisible" :key="index">
            <label v-html="item.labels"> </label>
            <span>{{item.detail}}{{floatData[index]}}张</span>
          </li>
        </ul>
      </div>
      <div style="float: left">
        发票：<span class="text-color" >{{amountData.billNum}}</span>张&nbsp;&nbsp;&nbsp;&nbsp;
      </div>
    </el-tooltip>
    <span v-if="amountData.postiveExTaxAmount===0&&amountData.negativeExTaxAmount===0">
      金额：<span class="text-color">0</span>&nbsp;&nbsp;
    </span>
    <el-tooltip placement="top" :disabled="!showTip">
      <div slot="content">
        <span style="font-size: 14px;font-weight: bold;"> 合计&nbsp;&nbsp;</span>
        <span>发票：<span class="text-color" >{{amountData.billNum}}</span>张&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span v-if="amountData.postiveExTaxAmount===0&&amountData.negativeExTaxAmount===0">
      金额：<span class="text-color">0</span>&nbsp;&nbsp;
    </span>
        <span v-if="amountData.postiveExTaxAmount || amountData.negativeExTaxAmount">
      金额：
      <span class="text-color" v-if="amountData.postiveExTaxAmount">{{amountData.postiveExTaxAmount}}&nbsp;&nbsp;</span>
      <span class="text-color" v-if="amountData.negativeExTaxAmount">{{amountData.negativeExTaxAmount}}&nbsp;&nbsp;</span>&nbsp;&nbsp;
    </span>
        <span v-if="amountData.positiveTax===0&&amountData.negativeTax===0">
        税额：<span class="text-color">0</span>&nbsp;&nbsp;
    </span>
        <span v-if="amountData.positiveTax||amountData.negativeTax">
        税额：
        <span class="text-color" v-if="amountData.positiveTax">{{amountData.positiveTax}}&nbsp;&nbsp;</span>
        <span class="text-color" v-if="amountData.negativeTax">{{amountData.negativeTax}}&nbsp;&nbsp;</span>
      &nbsp;&nbsp;
    </span>
        <span v-if=" amountData.positiveAmount===0&&amountData.negativeAmount===0">
        价税合计：
        <span class="text-color">0</span>&nbsp;&nbsp;
    </span>
        <span v-if="amountData.positiveAmount||amountData.negativeAmount">
        价税合计：
        <span class="text-color" v-if="amountData.positiveAmount">{{amountData.positiveAmount}}&nbsp;&nbsp;</span>
        <span class="text-color" v-if="amountData.negativeAmount">{{amountData.negativeAmount}}&nbsp;&nbsp;</span>
      &nbsp;&nbsp;
    </span>
      </div>
      <p class="amount-detail" ref="footerBox">
        <span v-if="amountData.postiveExTaxAmount || amountData.negativeExTaxAmount">
      金额：
      <span class="text-color" v-if="amountData.postiveExTaxAmount">{{amountData.postiveExTaxAmount}}&nbsp;&nbsp;</span>
      <span class="text-color" v-if="amountData.negativeExTaxAmount">{{amountData.negativeExTaxAmount}}&nbsp;&nbsp;</span>&nbsp;&nbsp;
    </span>
        <span v-if="amountData.positiveTax===0&&amountData.negativeTax===0">
        税额：<span class="text-color">0</span>&nbsp;&nbsp;
    </span>
        <span v-if="amountData.positiveTax||amountData.negativeTax">
        税额：
        <span class="text-color" v-if="amountData.positiveTax">{{amountData.positiveTax}}&nbsp;&nbsp;</span>
        <span class="text-color" v-if="amountData.negativeTax">{{amountData.negativeTax}}&nbsp;&nbsp;</span>
      &nbsp;&nbsp;
    </span>
        <span v-if=" amountData.positiveAmount===0&&amountData.negativeAmount===0">
        价税合计：
        <span class="text-color">0</span>&nbsp;&nbsp;
    </span>
        <span v-if="amountData.positiveAmount||amountData.negativeAmount">
        价税合计：
        <span class="text-color" v-if="amountData.positiveAmount">{{amountData.positiveAmount}}&nbsp;&nbsp;</span>
        <span class="text-color" v-if="amountData.negativeAmount">{{amountData.negativeAmount}}&nbsp;&nbsp;</span>
      &nbsp;&nbsp;
    </span>
      </p >
    </el-tooltip>
  </div>
</template>

<script>
  export default {
    name: 'footerAmount',
    data() {
      return {
        unVisible: 'un-visible',
        showTip: false,
        footerAmountMaxWidth: document.documentElement.clientWidth - 540
      }
    },
    props: {
      amountData: Object,
      moduleType: {
        default: 'common',
        type: String
      },
      floatData: {
        default: function () {
          return {}
        },
        type: Object
      },
      floatTitle: {
        default: function () {
          return {}
        },
        type: Object
      }
    },
    components: {},
    methods: {
    },
    computed: {
    },
    mounted () {
      this.$nextTick(() => {
        if (this.$refs.footerBox) {
          this.showTip = this.$refs.footerBox.offsetWidth >= this.footerAmountMaxWidth
        }
      })
    },
    updated () {
      if (this.$refs.footerBox) {
        this.showTip = this.$refs.footerBox.offsetWidth >= this.footerAmountMaxWidth
      }
    }
  }
</script>

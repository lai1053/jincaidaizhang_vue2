<style lang='scss' scoped>
  .total {
    line-height: 32px;
    font-size: 12px;
    color: #606266;
    text-align: left;
    float: left;
    div {
      display: inline-block;
    }
    .total-num {
      color: #1ab394;
    }
  }
</style>

<template>
  <div class="total">
    <div v-if="amountCountTitle">
      {{amountCountTitle}}：<span v-if="totalSpecial">{{totalSpecial}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
    </div>
    <div v-if="total">明细条数：<span class="text-color">{{total}}</span>&nbsp;&nbsp;&nbsp;&nbsp;</div>
    金额：<span class="text-color">{{sum}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
    增值税税额：<span class="text-color">{{tax}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
    价税合计：<span class="text-color">{{amount}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
  </div>
</template>

<script>
  export default {
    name: 'amountCount',
    data () {
      return {}
    },
    props: {
      amountCountTitle: String,       // 标题 只有->查看数据 显示
      totalSpecial: {
        type: [String, Number], // 总计 只有->查看数据 显示
        default: 0.00
      },
      total: {
        type: [String, Number], // 明细条数
        default: 0
      },
      sum: {
        type: [String, Number], // 金额
        default: 0.00
      },
      tax: {
        type: [String, Number], // 税额
        default: 0.00
      },
      amount: {
        type: [String, Number], // 价税合计
        default: 0.00
      }
    },
    components: {},
    methods: {},
    computed: {},
    mounted () {}
  }
</script>

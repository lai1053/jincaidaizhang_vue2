<template>
  <div class="progress-bar">
    <template v-if="mainMenu === 'sales'">
      <div class="step-0" :class="curStep==='one'?'step-01':'step-02'">
        <span v-if="curStep==='one'" class="circle-border border-green">1</span>
        <i v-if="curStep!=='one'" class="el-icon-check" style="font-weight: 600;"></i>
        <span>业务确认</span>
      </div>
      <div class="step-2" :class="curStep==='one'?'step-21':'step-22'">
        <span class="circle-border" :class="curStep==='two'? 'border-green' : 'border-grey'">2</span>
        <span>科目确认</span>
      </div>
    </template>
    <template v-else>
      <div class="step-0" :class="curStep==='zero'?'step-01':'step-02'">
        <span v-if="curStep==='zero'" class="circle-border border-green">1</span>
        <i v-if="curStep!=='zero'" class="el-icon-check" style="font-weight: 600;"></i>
        <span>选发票</span>
      </div>
      <div class="step-1" :class="curStep==='one'?'step-12' : curStep==='zero'? 'step-11': curStep==='two' ? 'step-13':'step-12'" >
        <span v-if="curStep!=='two'" class="circle-border" :class="curStep!=='zero'? 'border-green' : 'border-grey'">2</span>
        <i v-if="curStep==='two'" class="el-icon-check" style="font-weight: 600;"></i>
        <span>结算确认</span>
      </div>
      <div class="step-2" :class="curStep!=='two'?'step-21':'step-22'">
        <span class="circle-border" :class="curStep==='two'? 'border-green' : 'border-grey'">3</span>
        <span>科目确认</span>
      </div>
    </template>
    <!--帮助-->
    <help-modal :main-menu="mainMenu"></help-modal>
  </div>
</template>

<script>
  import HelpModal from '@/views/components/Help/index.vue'

  export default {
    name: 'TopSteps',
    data() {
      return {
      }
    },
    props: {
      mainMenu: String,
      curStep: {
        type: String,
        default: 'one'
      }
    },
    created() {
    },
    components: {HelpModal},
    methods: {
    },
    computed: {},
    mounted() {}
  }
</script>

<style lang='scss' scoped>
  .progress-bar{
    text-align: center;
    line-height: 36px;
    font-size: 14px;
    margin-bottom: 14px;
    .step-0 {
      width: 150px;
      height: 36px;
      border-radius: 36px 0 0  36px;
      position: relative;
      display: inline-block;
      box-sizing: border-box;
      vertical-align: middle;
      z-index: 4;
    }
    .step-0:after{
      content: '';
      position: absolute;
      right: -36px;
      border-left: 18px solid #53bdbd;
      border-right: transparent solid 18px;
      border-top: transparent solid 18px;
      border-bottom: transparent solid 18px;
    }
    .step-01 {
      background: #53bdbd;
      z-index: 10;
      color: #fff;
      margin-top: 1px;
    }
    .step-01:after {
      display: block;
      width: 0;
      height: 0;
      border-width:18px;
      top: 0;
    }

    .step-02 {
      border: 1px solid #53bdbd;
      background: #f4fafa;
      border-right: none;
      color: #53bdbd;
    }
    .step-02:after{
      top: -1px;
    }
    .step-02:before{
      content: '';
      position: absolute;
      right: -34px;
      border-left: 17px solid #f4fafa;
      border-right: transparent solid 17px;
      border-top: transparent solid 17px;
      border-bottom: transparent solid 17px;
      z-index: 8;
    }
    .step-1 {
      width: 150px;
      height: 36px;
      border-left: none;
      position: relative;
      display: inline-block;
      box-sizing: border-box;
      vertical-align: middle;
      z-index:2;
    }
    .step-1:before{
      content: '';
      display: block;
      width: 0;
      height: 0;
      border-width: 18px;
      border-top: transparent solid 18px;
      border-bottom: transparent solid 18px;
      border-right: transparent solid 18px;
      border-left: 18px solid #fff;
      position: absolute;
      left: 0;
    }
    .step-1:after{
      content: '';
      display: block;
      width: 0;
      height: 0;
      /*border-width: 36px;*/
      border-top: transparent solid 18px;
      border-bottom: transparent solid 18px;
      border-right: transparent solid 18px;
      position: absolute;
      right: -36px;
      top:0;
      z-index:12;
    }
    .step-2:before, .step-22:after{
      content: '';
      display: block;
      width: 0;
      height: 0;
      border-width:18px;
      border-right: transparent solid 18px;
      border-top: transparent solid 18px;
      border-bottom: transparent solid 18px;
      position: absolute;
      left: 0;
    }
    .step-2 {
      z-index:1;
      width: 150px;
      height: 36px;
      border-left: none;
      border-radius: 0 36px 36px 0;
      position: relative;
      display: inline-block;
      box-sizing: border-box;
      vertical-align: middle;
    }
    .step-21,.step-11{
      background: #f4fafa;
      color: #908f8f;
    }
    .step-22,.step-12 {
      background: #53bdbd;
      color: #ffffff;
    }
    .step-11:after{
      border-left: 18px solid #f4fafa;
    }
    .step-12:after{
      border-left: 18px solid #53bdbd;
    }
    .step-13 {
      border: 1px solid #53bdbd;
      background: #f4fafa;
      border-right: none;
      border-left: none;
      color: #53bdbd;
    }
    .step-13:before{
      border: 1px solid #53bdbd;
      border-left: none;
      border-bottom: none;
      background: #f4fafa;
      width: 25px;
      height: 25px;
      display: block;
      position: absolute;
      transform: rotate(45deg);
      left: -12px;
      top:4px;
    }
    .step-13:after{
      border: 1px solid #53bdbd;
      border-left: none;
      border-bottom: none;
      background: #f4fafa;
      width: 25px;
      height: 25px;
      display: block;
      position: absolute;
      transform: rotate(45deg);
      top:5px;
      right: -13px;
    }
    .step-21:before{
      border-left: 18px solid  #fff;
      top: 1px;
    }
    .step-22:before{
      border-left: 18px solid #ffffff;
      top: 0;
    }
    .step-22:after{
      border-left: 18px solid #ffffff;
      left: -2px;
      top: 0;
      z-index: 35;
    }
    .circle-border{
      border-radius: 50%;
      display: inline-block;
      text-align: center;
      line-height: 14px;
      width:18px;
      height: 18px;
      font-size: 12px;
    }
    .border-green{
      border: 1px solid #ffffff;
    }
    .border-grey {
      border: 1px solid #908f8f;
    }
  }
</style>

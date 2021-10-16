<style lang="scss" scoped>
  .tip-list-box{
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 12px;
    li{
      line-height: 22px;
      .title{
        display: inline-block;
        width: 50px;
        text-align: justify;
        text-align-last: justify;
        margin-right: 5px;
      }
      .sub-title{
        display: inline-block;
        width: 18px;
      }
      .sub-title-large{
        display: inline-block;
        width: 46px;
      }
    }
    .list-group{
      margin-top: 10px;
    }

  }
  .hide-ele{
    display: none;
  }
  .popover-box{
    margin-bottom: 15px;
  }
</style>
<template>
  <el-popover
    placement="top"
    trigger="hover"
    @show="tipShowing=true"
    @hide="tipShowing=false">
    <div class="popover-box">
      <p v-if="tipContent.title" style="text-align: center; font-size: 13px;">{{tipContent.title}}</p>
      <ul class="tip-list-box">
        <li v-for="item in tipContent.description" :key="item.text" :class="item.title ? 'list-group' : ''">
          <strong class="title">{{item.title}}</strong>
          <span :class="item.width ? 'sub-title-large' : 'sub-title'" v-if="item.hasSubTitle">{{item.subTitle}}</span>
          <span>{{item.text}}</span>
        </li>
      </ul>
    </div>
    <i style="color: #acaeb3" slot="reference" :class="showToolTip || tipShowing? 'el-icon-question': 'el-icon-question hide-ele'"></i>
  </el-popover>
</template>

<script>
    export default {
      props: {
        tipContent: Object,
        showToolTip: Boolean
      },
      data () {
        return {
          tipShowing: false
        }
      },
      methods: {
      }
    }
</script>

<style scoped>

</style>

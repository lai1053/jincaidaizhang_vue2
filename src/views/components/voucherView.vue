<style lang='scss' scoped>
  .cell-content {
    width: 100%;
    .vue-tip {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .vue-tip-sign {
      height: 20px;
      .vue-tip-sign-desc {
        max-width: calc(100% - 18px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        float: left;
      }
      i {
        height: 23px;
        line-height: 23px;
        margin-left: 3px;
        float: left;
      }
    }
  }

  .vue-content {
    display: inline;
  }

  .item-column {
    display: inline;
    position: relative;
    .check-btn {
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -10.5px;
    }
  }
</style>
<template>
  <div>
    <el-tooltip
      effect="dark"
      :disabled="!tips"
      :content="tips"
      placement="top">
      <div
        class="vue-tip-sign"
        :style="{color: evalVoucher(state, 'color')}">
        <div class="vue-tip-sign-desc">
          {{evalVoucher(state, 'desc')}}
          <i :class="evalVoucher(state, 'icon')"></i>
        </div>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
  export default {
    name: 'voucher-view',
    props: {
      state: {          // 凭证状态
        type: Number,
        default: 0
      },
      tips: {           // 生成失败时，提示语
        type: String,
        default: ''
      }
    },
    data () {
      return {}
    },
    methods: {
      evalVoucher (e, i) {
        const vmState = {
          '0': {desc: '', color: '#5a5e66', icon: ''},
          '1': {desc: '', color: '#5a5e66', icon: ''},
          '2': {desc: '已生成', color: '#69d6b1', icon: 'el-icon-success'},
          '3': {desc: '生成失败', color: '#e96a69', icon: 'el-icon-warning'}
        }
        return vmState[e][i]
      }
    }
  }
</script>

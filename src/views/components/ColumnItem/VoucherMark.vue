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
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;
      }
      i {
        height: 23px;
        line-height: 23px;
        margin-left: 3px;
        float: left;
      }
    }
  }
</style>

<template>
  <div class="cell-content">
    <icon-tip
      v-if="String(scope.row[item.prop])==='2'"
      :content="vtNumList(scope.row[item.value])"
      :row="scope.row"
      :main-menu="mainMenu"
      :change-tax-type="changeTaxType"
      @on-close="deleteVoucher"
      @on-check="checkVoucher"
    ></icon-tip>
    <el-tooltip
      v-if="String(scope.row[item.prop])!=='2'"
      effect="dark"
      :disabled="!(String(scope.row[item.prop])==='3')"
      :content="scope.row[item.desc]"
      placement="top">
      <div
        class="vue-tip-sign"
        :style="{color: setVm(scope.row[item.prop], 'color')}">
        <div class="vue-tip-sign-desc" :style="{paddingRight: String(scope.row[item.prop])==='3'?'12px':'0'}">
          {{setVm(scope.row[item.prop], 'desc')}}
          <i :class="setVm(scope.row[item.prop], 'icon')" style="position: absolute; top:50%; margin-top: -11px; right: 0;"></i>
        </div>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
  import IconTip from '@/views/components/IconTip.vue'
  import {MessageBox} from 'element-ui'

  const vmState = {
    '0': {desc: '', color: '#5a5e66', icon: ''},
    '1': {desc: '', color: '#5a5e66', icon: ''},
    '2': {desc: '已生成', color: '#4ba285', icon: 'el-icon-success'},
    '3': {desc: '生成失败', color: '#e96a69', icon: 'el-icon-warning'}
  }
  export default {
    name: 'voucherMark',
    data() {
      return {
        indexData: this.$store.getters.indexData,
        urlInfo: this.$store.getters.urlInfo
      }
    },
    props: {
      mainMenu: String,
      scope: Object,
      item: Object,
      changeTaxType: Boolean
    },
    methods: {
      // 操作>删除
      setVm(e, i) {
        return vmState[e][i]
      },
      vtNumList(vtNumList) {
        // console.log(this.item)
        const array = vtNumList.split(',')
        const content = []
        for (const item of array) {
          if (item) {
            content.push(item)
          }
        }
        return content
      },
      // 点击凭证字号图标删除凭证
      deleteVoucher(vchIdArray) {
        MessageBox.alert('确认要删除凭证？删除后数据无法恢复', '删除凭证', {
          confirmButtonText: '确定',
          type: 'warning',
          callback: action => {
            if (action === 'confirm') {
              this.$emit('delete-voucher', vchIdArray)
            }
          }
        })
      },
      // 点击凭证字号进入查看凭证(拉取北京)
      checkVoucher(voucherId) {
        this.$emit('check-voucher', voucherId)
      }
    },
    computed: {
    },
    mounted() {},
    components: {
      IconTip
    }
  }
</script>

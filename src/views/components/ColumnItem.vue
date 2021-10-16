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
  <div class="item-column">
    <div v-if="item.tip" class="vue-content">
      <el-tooltip
        v-if="item.moreTip&&scope.row[item.tip]"
        effect="dark"
        placement="top">
        <div slot="content"><p style="margin: 3px 0;" v-for="tip in scope.row[item.tip].split(',')" :key="tip">{{tip}}</p></div>
        <i class="el-icon-more"></i>
      </el-tooltip>
      <span v-if="item.check" class="check-btn">
        <i
          v-if="((item.check==='purchase'&&scope.row.ids&&scope.row.ids.length>1)||(item.check==='fund'&&(!scope.row.mxs||(scope.row.mxs&&scope.row.mxs.length === 0))))"
          style="width: 14px;display: inline-block;"></i>
        <i class="el-icon-menu" v-else @click="checkBill(scope.row)"></i>
      </span>
      {{item.moreTip ? '' : scope.row[item.prop]}}
    </div>
    <div v-if="item.desc" class="cell-content">
      <icon-tip
        v-if="String(scope.row[item.prop])==='2'"
        :content="scope.row[item.value]"
        :row="scope.row"
        :main-menu="mainMenu"
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
    <div v-if="item.prop==='operation'&&(!(scope.row.ids&&scope.row.ids.length>1))">
      <el-button v-if="indexData.checkoutFlag!=='Y'&&String(scope.row.vm_state)!=='2'&&scope.row.ids" @click="deleteDetail(scope.row)" type="text"
                 size="small" class="text-color">删除
      </el-button>
      <!--<span v-if="storage&&String(scope.row.vm_state)!=='2'&&scope.row.ids&&scope.row.taxpayer_id">|</span>
      <el-button v-if="storage&&String(scope.row.vm_state)!=='2'&&scope.row.ids&&scope.row.taxpayer_id" type="text" size="small" @click="toStorage(scope.row)" style="color: #1ab394;">暂估入库</el-button>-->
    </div>
  </div>
</template>
<script>
  import iconTip from '@/views/components/IconTip.vue'

  export default {
    name: 'columnItem',
    data() {
      return {
        indexData: this.$store.getters.indexData,
        urlInfo: this.$store.getters.urlInfo
      }
    },
    props: {
      storage: Boolean,
      mainMenu: String,
      item: Object,
      scope: Object
    },
    created() {
    },
    computed: {},
    methods: {
      // 操作>删除
      deleteDetail(rowData) {
        this.$emit('delect', rowData)
      },
      // 操作>图片
      toImg(rowData) {
        this.$emit('on-click-img', rowData)
      },
      // 点击凭证字号图标删除凭证
      deleteVoucher(rowData) {
        this.$emit('delete-voucher', rowData)
      },
      // 点击凭证字号进入查看凭证(拉取北京)
      checkVoucher(voucherId) {
        this.$emit('check-voucher', voucherId)
      },
      // 点击抵扣类型旁边的图标查看清单列表
      checkBill(rowData) {
        this.$emit('check-bill', rowData)
      },
      toStorage(rowData) {
        this.$emit('on-storage', rowData)
      },
      setVm(e, i) {
        const vmState = {
          '0': {desc: '', color: '#5a5e66', icon: ''},
          '1': {desc: '', color: '#5a5e66', icon: ''},
          '2': {desc: '已生成', color: '#69d6b1', icon: 'el-icon-success'},
          '3': {desc: '生成失败', color: '#e96a69', icon: 'el-icon-warning'}
        }
        return vmState[e][i]
      }
    },
    components: {
      iconTip
    },
    mounted() {
    }
  }
</script>

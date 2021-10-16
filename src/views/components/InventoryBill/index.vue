<style lang='scss'>
  .inventory-modal{
    .vue-iframe {
      width: 100%;
      height: 540px;
      border: none;
      display: block !important;
    }
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0 0 0 0;
      background-color: #f2f2f2;
      position: relative;
    }
    .voucher-modal-close-btn {
      display: block;
      width: 0;
      height: 0;
      border-top: 50px solid rgba(0, 0, 0, 0.2);
      border-left: 50px solid transparent;
      position: absolute;
      right: 0;
      top: 0;
      color: #ffffff;
      font-size: 20px;
      i {
        position: absolute;
        top: -44px;
        right: 5px;
      }
    }
  }
</style>

<template>
  <el-dialog width="1100px" :close-on-click-modal="false" :visible.sync="inventory.modal" top="0"
             class="vertical-center-modal inventory-modal">
    <span class="voucher-modal-close-btn" @click="inventory.modal=false"><i class="el-icon-close"></i></span>
    <iframe
      :src="inventory.iframeSrc"
      class="vue-iframe"></iframe>
  </el-dialog>
</template>

<script>
  export default {
    name: 'inventoryBill',
    data() {
      return {
      }
    },
    props: {
      inventory: Object,
      getList: Function
    },
    created() {
      // window.closeKeepAccountsModal = this.closeKeepAccountsModal
    },
    components: {},
    methods: {
      closeKeepAccountsModal() {
        this.inventory.modal = false
        // this.$emit('on-save')
      }
    },
    computed: {},
    mounted() {}
  }
</script>

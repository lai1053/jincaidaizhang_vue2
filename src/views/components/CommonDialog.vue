<style lang='scss'>
  .common-modal{
    .vue-iframe {
      width: 100%;
      height: 540px;
      margin: 0px 0px -2px 0px;
      border: none;

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
  <el-dialog :width="commonModal.width" :close-on-click-modal="false" :visible.sync="commonModal.modal" top="0"
             class="vertical-center-modal common-modal">
    <span class="voucher-modal-close-btn" @click="commonModal.modal=false"><i class="el-icon-close"></i></span>
    <div>
      <iframe
        :src="commonModal.iframeSrc"
        class="vue-iframe" border="0"></iframe>
    </div>

  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    props: {
      commonModal: Object
    },
    created() {
    },
    components: {},
    methods: {
      closeKeepAccountsModal() {
        this.inventory.modal = false
      }
    },
    computed: {},
    mounted() {}
  }
</script>

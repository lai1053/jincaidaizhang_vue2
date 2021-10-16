<style lang='scss' scoped>
</style>

<template>
  <el-dialog width="1100px" :close-on-click-modal="false" :visible.sync="bookkeeping.modal" top="0"
             class="vertical-center-modal voucher-modal">
    <span class="voucher-modal-close-btn" @click="bookkeeping.modal=false"><i class="el-icon-close"></i></span>
    <iframe
      :src="bookkeeping.iframeSrc"
      class="vue-iframe"></iframe>
  </el-dialog>
</template>

<script>
  export default {
    name: 'keepAccounts',
    data() {
      return {
      }
    },
    props: {
      bookkeeping: Object,
      getList: Function
    },
    created() {
      window.closeKeepAccountsModal = this.closeKeepAccountsModal
    },
    components: {},
    methods: {
      closeKeepAccountsModal() {
        this.bookkeeping.modal = false
        this.$emit('on-save')
      }
    },
    computed: {},
    mounted() {}
  }
</script>

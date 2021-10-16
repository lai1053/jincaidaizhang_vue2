<style lang='scss' scoped>
</style>

<template>
  <div class="edit-footer">
    <slot name="amountCount"></slot>
    <el-button type="primary" size="small" @click="operationBefore('voucher')">生成凭证</el-button>
    <el-button type="primary" size="small" @click="operationBefore('save')">保存</el-button>
  </div>
</template>

<script>
  import {toUpOrNextPage} from '@/utils/utils'

  export default {
    name: 'EditBtn',
    data() {
      return {}
    },
    props: {
      modalType: String,
      list: Array,
      detail: Object
    },
    components: {},
    methods: {
      toUpOrNextPage(type) {
        const id = this.detail ? this.detail.id : ''
        toUpOrNextPage(type, this.list, this.modalType, id).then(resp => {
          this.$emit('on-up-next', resp)
        })
      },
      operationBefore(type) {
        this.$emit('on-operation', type)
      }
    },
    computed: {},
    mounted() {
    }
  }
</script>

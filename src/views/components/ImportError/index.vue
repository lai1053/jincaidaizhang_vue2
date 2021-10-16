<style lang='scss'>
  .vue-import-error{
    .el-dialog__body {
      padding: 0 20px;
      .import-error-box {
        padding: 0 20px;
        height: 160px;
        overflow: auto;
        p {
          margin: 0;
          padding: 6px 0;
        }
      }
    }
  }
</style>
<template>
  <el-dialog
    width="440px"
    title="提示"
    :visible.sync="modalData.modal"
    class="vue-import-error"
    :close-on-click-modal="false"
    append-to-body>
    <div class="import-error-box">
      <p v-for="item in modalData.info">{{item}}</p>
    </div>
    <div slot="footer">
      <el-button size="medium" @click="closeModal">取消</el-button>
      <el-button size="medium" style="margin-left: 15px" type='primary' @click="closeModal">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {localParams} from '@/views/components/data/common'
  import {filterAccount} from '@/utils/filterAccount'
  import {Message, Loading} from 'element-ui'

  export default {
    name: 'importError',
    data() {
      return {
      }
    },
    props: {
      modalData: Object
    },
    watch: {
    },
    components: {},
    methods: {
      closeModal() {
        this.modalData.modal = false
      }
    },
    computed: {
    },
    mounted() {
    }
  }
</script>

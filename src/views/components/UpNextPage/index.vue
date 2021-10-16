<style lang='scss'>
</style>

<template>
  <div>
    <div class="left-btn"
         @mouseenter="leftBtn=true"
         @mouseleave="leftBtn=false">
      <el-tooltip content="上一张" placement="bottom" effect="light">
        <el-button class="down-up-btn" icon="el-icon-arrow-left" circle v-show="leftBtn" @click="toUpOrNextPage('up')"></el-button>
      </el-tooltip>
    </div>
    <div
      v-if="modalType!=='create'"
      class="right-btn"
      @mouseenter="rightBtn=true"
      @mouseleave="rightBtn=false">
      <el-tooltip content="下一张" placement="bottom" effect="light">
        <el-button class="down-up-btn" icon="el-icon-arrow-right" circle v-show="rightBtn" @click="toUpOrNextPage('next')"></el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
  import {
    toUpOrNextPage
  } from '@/utils/utils'

  export default {
    name: 'UpNextPage',
    data() {
      return {
        leftBtn: false,
        rightBtn: false
      }
    },
    props: {
      modalType: String,
      list: Array,
      detail: Object
    },
    watch: {
    },
    components: {
    },
    methods: {
      toUpOrNextPage(type) {
        const id = this.detail ? this.detail.id : ''
        toUpOrNextPage(type, this.list, this.modalType, id).then(resp => {
          this.$emit('on-up-next', resp)
        })
      }
    },
    computed: {},
    mounted() {}
  }
</script>

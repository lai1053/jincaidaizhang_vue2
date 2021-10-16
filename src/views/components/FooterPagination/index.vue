<style lang='scss'>
</style>
<template>
  <div class="footer-pagination el-pagination is-background">
    <span class="el-pagination__total">{{total}}条记录/共{{totalPage}}页</span>
    <span class="el-pagination__sizes">
      <el-select
        v-model="internalPageSize"
        @change="handleSelectChange">
      <el-option
        v-for="(item, idx) in pageSizes"
        :key="idx"
        :label="item === '全部'? '全部' : item+'条/页'"
        :value="item === '全部'? 9999999 : item">
      </el-option>
    </el-select>
    </span>
    <button
      type="button"
      class="btn-prev"
      :disabled="Number(internalCurrentPage)===1"
      @click="prev"><i class="el-icon el-icon-arrow-left"></i></button>
    <span class="el-pagination__jump">
      <el-input
        type="number"
        ref="input"
        v-model="internalCurrentPage"
        @change="handleInputChange"
        :min="1"
        :max="totalPage"
        class="el-pagination__editor is-in-pagination"></el-input>
    </span>
    <button
      type="button"
      class="btn-next"
      :disabled="totalPage===0||Number(internalCurrentPage)===totalPage"
      @click="next"><i class="el-icon el-icon-arrow-right"></i></button>
  </div>
</template>
<script>
  export default {
    name: 'FooterPagination',
    data() {
      return {
        internalPageSize: 0,
        internalCurrentPage: 1
      }
    },
    props: {
      currentPage: {
        type: Number,
        default: 1
      },
      total: Number,
      totalPage: {
        type: Number,
        default: 1
      },
      pageSize: {
        type: Number,
        default: 10
      },
      pageSizes: {
        type: Array,
        default() {
          return [10, 20, 30, 40, 50, 100]
        }
      }
    },
    watch: {
      currentPage: {
        immediate: true,
        handler(val) {
          this.internalCurrentPage = val
        }
      },
      pageSize: {
        immediate: true,
        handler(val) {
          this.internalPageSize = isNaN(val) ? 10 : val
        }
      }
    },
    created() {
    },
    methods: {
      handleKeyup() {
        const self = this
        self.keyDown.addEventListener('keypress', function(evt) {
          if (evt.keyCode === 13) {
            self.handleInputChange()
          }
        })
      },
      handleInputChange() {
        let newVal = this.internalCurrentPage
        if (newVal < 1) {
          newVal = 1
        } else if (newVal > this.totalPage) {
          newVal = this.totalPage
        }
        this.internalCurrentPage = this.getValidCurrentPage(newVal)
        if (this.currentPage === this.internalCurrentPage) return
        this.$emit('current-change', this.internalCurrentPage)
      },
      handleSelectChange() {
        this.$emit('size-change', +this.internalPageSize)
      },
      prev() {
        const newVal = this.internalCurrentPage - 1
        this.internalCurrentPage = this.getValidCurrentPage(newVal)
        this.$emit('current-change', this.internalCurrentPage)
      },

      next() {
        const newVal = this.internalCurrentPage + 1
        this.internalCurrentPage = this.getValidCurrentPage(newVal)
        this.$emit('current-change', this.internalCurrentPage)
      },
      getValidCurrentPage(value) {
        value = parseInt(value, 10)
        const havePageCount = typeof this.internalPageCount === 'number'
        let resetValue
        if (!havePageCount) {
          if (isNaN(value) || value < 1) resetValue = 1
        } else {
          if (value < 1) {
            resetValue = 1
          } else if (value > this.internalPageCount) {
            resetValue = this.internalPageCount
          }
        }

        if (resetValue === undefined && isNaN(value)) {
          resetValue = 1
        } else if (resetValue === 0) {
          resetValue = 1
        }

        return resetValue === undefined ? value : resetValue
      }
    },
    computed: {
      keyDown() {
        return this.$refs.input.$refs.input
      }
    },
    mounted() {
      this.handleKeyup()
    },
    components: {}
  }
</script>

<template>
  <div id="app" style="height: 100%;">
    <router-view></router-view>
  </div>
</template>

<script>
  // import { ywqdindex, ywqdtest } from '@/api/sales'
  import './styles/static/iconfont.css'
  export default {
    name: 'app',
    created() {
      /* let test = window.location.search
      test = test.substring(1, test.length)
      test = test.split('&')
      const qyid = test[0].split('=')[1]
      const token = test[1].split('=')[1]
      ywqdindex({ qyid, token }).then(response => {
        console.log(`ywqdindex: ${response}`)
        ywqdtest({ qyid, token }).then(response => {
          console.log(`ywqdtest: ${response}`)
        })
      }) */
    },
    mounted () {
      window.onpopstate = () => {
        if (!this.allowBack){
          history.go(1)
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '~normalize.css/normalize.css';
  // normalize.css 样式格式化
  @import '~themes'; // 全局自定义的css样式
  /*@import './styles/index.scss'; // 全局自定义的css样式*/
</style>

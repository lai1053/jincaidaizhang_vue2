<style lang='scss' scoped>
  .help-modal {
    color:#FFA854;
    font-size: 13px;
    float: right;
    margin-left: 10px;
    display: inline-block;
    cursor: pointer;
    i {
      font-size: 19px;
      height: 34px;
      line-height: 34px;
      float: left;
    }
    span {
      font-size: 13px;
      height: 34px;
      line-height: 34px;
      float: left;
      margin-left: 4px;
    }
  }
</style>

<template>
  <div class="help-modal" @click="toHelp">
    <i class="el-icon-question"></i>
  </div>
</template>

<script>
  const urls = {
    'sales': '477',
    'purchase': '471',
    'fund': '478',
    'expense': '472',
    'salary': '473',
    'pending': '474',
    'simpleTally': '498',
    'psb': '503'
  }

  export default {
    name: 'helpModal',
    data() {
      return {
      }
    },
    props: {
      mainMenu: String
    },
    components: {},
    methods: {
      toHelp() {
        const mainMenu = this.mainMenu
        // console.log(mainMenu)
        /* const url = `http://ycs168.cn/news/portal/html/news_details.jsp?NewsID=${urls[mainMenu]}&closebutton=false`
        window.parent.sytjBz(url) */
        // 涉及跨域问题 生产环境 一体化和清单不在同一环境下
        // 故不能用window.parent.sytjBz(url)方法调取一体化的方法sytjBz()
        const data = {
          code: '100',
          url: `http://ycs168.cn/news/portal/html/news_details.jsp?NewsID=${urls[mainMenu]}&closebutton=false`
        }
        let url = null
        if (parent !== window) {
          try {
            url = parent.location.href
          } catch (e) {
            url = document.referrer
          }
        } else {
          url = window.location.href
        }
        parent.postMessage(data, url)
      }
    },
    computed: {},
    mounted() {}
  }
</script>

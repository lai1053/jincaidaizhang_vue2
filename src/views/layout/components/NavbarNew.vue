<template>
  <el-menu class="navbar" mode="horizontal">
    <!--<hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>-->
    <div class="ent-acct-name">{{indexData ? indexData.nsrmc : '--'}}</div>
    <div style="display: inline-block; margin-left: 120px; color: #ffffff; border: none;">会计期间：{{urlInfo ? urlInfo.ssyf : '--'}}</div>
    <div class="close-window">
      <span class="triangle-bottom-left"></span>
      <a class="close-btn" href="javascript:window.close();">关闭</a>
    </div>
    <!--<breadcrumb></breadcrumb>-->
    <!--<el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            Home
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">LogOut</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>-->
  </el-menu>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'

  export default {
    data() {
      return {
        indexData: this.$store.getters.indexData,
        urlInfo: this.$store.getters.urlInfo
      }
    },
    components: {
      Breadcrumb,
      Hamburger
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'avatar'
      ])
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()  // 为了重新实例化vue-router对象 避免bug
        })
      }
    },
    mounted() {
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 64px;
    line-height: 60px;
    border-radius: 0 !important;
    background-color: #35bdbc;
    border-bottom: 4px solid #ffc340 ;
    position: fixed !important;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    .hamburger-container {
      line-height: 69px;
      height: 60px;
      float: left;
      padding: 0 10px;
    }
    .ent-acct-name {
      display: inline-block;
      margin: 0;
      color: #fff;
      padding-left: 10px;
      font-size: 1.2em;
      font-weight: bold;
      border: none;
    }
    .close-window {
      width: 120px;
      height: 60px;
      float: right;
      background-color: #fafafa;
      position: relative;
      .triangle-bottom-left {
        display: inline-block;
        width: 0;
        height: 0;
        border-bottom: 60px solid #35bdbc;
        border-right: 40px solid transparent;
      }
      .close-btn {
        width: 64px;
        height: 30px;
        line-height: 28px;
        text-align: center;
        border: 1px solid #eaeaea;
        background-color: #f8f8f8;
        color: #656565;
        font-size: 14px;
        position: absolute;
        top: 15px;
      }
      .close-btn:hover {
        box-shadow: 0 0 10px rgba(0,0,0,.1);
      }
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  .el-menu--horizontal {
    border: none;
  }
</style>

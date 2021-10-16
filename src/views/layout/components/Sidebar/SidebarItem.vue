<template >
  <div class="menu-wrapper">
    <template v-for="item in routes"  v-if="!item.hidden&&item.children">

      <template v-if="item.children.length===1 && !item.children[0].children&&!item.alwaysShow" >
        <el-menu-item :index="item.path+'/'+item.children[0].path" class='submenu-title-noDropdown'>
          <router-link :to="item.path+'/'+item.children[0].path" >
            <i class="icon" v-if="item.children[0].meta&&item.children[0].meta.icon" :class="[item.children[0].meta.icon]" aria-hidden="true"></i>
            <span v-if="item.children[0].meta&&item.children[0].meta.title">{{item.children[0].meta.title}}</span>
          </router-link>
        </el-menu-item>
      </template>

      <el-submenu v-else :index="item.name||item.path" :key="item.name">
        <template slot="title">
          <i class="icon" v-if="item.meta&&item.meta.icon" :class="item.meta.icon" aria-hidden="true"></i>
          <span v-if="item.meta&&item.meta.title">{{item.meta.title}}</span>
        </template>

        <template v-if="!child.hidden" v-for="child in item.children">
          <sidebar-item class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>

          <template v-else>
            <el-menu-item :index="item.path+'/'+child.path">
              <router-link  :to="item.path+'/'+child.path" :key="child.name">
                <i class="icon" v-if="child.meta&&child.meta.icon" :class="child.meta.icon" aria-hidden="true"></i>
                <span v-if="child.meta&&child.meta.title">{{child.meta.title}}</span>
              </router-link>
            </el-menu-item>
          </template>
        </template>
      </el-submenu>

    </template>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  #app .sidebar-container {
    .el-menu li .el-menu {
      padding: 11px 0 11px 20px;
      background-color: #f3f3f5;
      border-bottom: 1px solid #dbdde0;
      li {
        padding-left: 0 !important;
        min-width: 100% !important;
        background-color: #f3f3f5 !important;
        margin: 3px 0;
        a {
          display: block;
          width: 100%;
          height: 40px;
          line-height: 40px;
          text-align: center;
        }
      }
      li.el-menu-item.is-active {
        background-color: #5fbebd !important;
      }
    }
  }
  .menu-wrapper {
    padding: 2px 15px 0 20px;
    background-color: #f3f3f5;
    li {
      margin-top: 16px;
      background-color: #f3f3f5;
    }
    .el-menu-item, .el-submenu__title {
      padding-left: 8px !important;
      padding-right: 0;
      width: 100%;
      height: 40px;
      line-height: 40px;
      border-radius: 4px;
      font-size: 14px;
    }
    .el-menu-item.is-active {
      background-color: #5fbebd;
      color: #ffffff;
    }
    i.icon{
      /*margin-right: 15px;*/
      width: 45px;
      text-align: center;
    }
    .is-opened {
      .el-submenu__title {
        /*background-color: #5fbebd;
        color: #ffffff;*/
        background-color: #e5e5e6;
      }
      i.icon,.el-submenu__icon-arrow{
        /*color: #fff;*/

      }

    }
  }
</style>

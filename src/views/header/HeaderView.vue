<template>
  <div>
    <a-row :gutter="24"
           class="header"
           type="flex"
           justify="space-around"
           align="middle">

      <a-col :span="4" :offset="1">
        icon
      </a-col>

      <a-col :span="3" :offset="4">
        {{this.pageTitle}}
      </a-col>

      <a-col :span="2">
        <a-button v-if="this.addBtnEnable" type="primary" @click="addOne">新增</a-button>
      </a-col>

      <a-col :span="2" :offset="5">
        <a-dropdown-button :trigger="['click', 'hover']"
                           @click="handleButtonClick">
          UserName
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item key="1"> <a-icon type="profile" /> 用户信息 </a-menu-item>
            <a-menu-item key="2"> <a-icon type="edit" /> 修改密码 </a-menu-item>
            <a-menu-item key="3"> <a-icon type="database" /> 电网数据 </a-menu-item>
            <a-menu-item key="4"> <a-icon type="database" /> 企业数据 </a-menu-item>
            <a-menu-item key="5"> <a-icon type="setting" /> 账号设置 </a-menu-item>
            <a-menu-item key="6"> <a-icon type="poweroff" /> 退出登录 </a-menu-item>
          </a-menu>
          <a-icon slot="icon" type="user" />
        </a-dropdown-button>

      </a-col>
    </a-row>

    <a-divider />
  </div>
</template>

<script>
  export default {
    description: '这是顶部共享控件',
    name: "HeaderView",
    components: {

    },
    props: {
      pageTitle: {
        type: String,
        required: true,
        default: '默认标题',
      },
      addBtnEnable: {
        type: Boolean,
        required: true,
        default: true,
      },
    },
    data() {
      return {

      }
    },
    computed: {

    },
    methods: {
      addOne() {
        // 新增按钮动作
        this.$emit('addOneBtnInvoked')
      },
      handleButtonClick(e) {
        console.log('click left button', e);
      },
      handleMenuClick(e) {
        console.log('click', e);
      },
    },
  }
</script>

<style scoped>
.header {
  height: 55px;
}

/*分割线*/
/deep/ .ant-divider.ant-divider-horizontal {
  margin-top: 4px;
  margin-bottom: 12px;
}

</style>
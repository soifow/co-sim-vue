<template>
  <div>
    <a-button type="primary" @click="showSetting"> 测试 </a-button>
  </div>
</template>

<script>
  const simulationUrl = process.env.VUE_APP_SIMULATION_URL
  import { getAction } from '@/api/manage'

  export default {
    name: "Login",
    components: {

    },
    data(){
      return {
        url: '/v1/joint/hello.g',   // 测试用api
      }
    },
    methods: {
      showSetting() {
        console.log('这里是测试输出')

        let self = this
        getAction(this.url).then((res) => {
          console.log(res)
        }).catch((err) => {
          self.$notification.open({
            message: '下拉控件获取数据接口失败',
            description: `获取数据接口出现错误: ${err}`,
            onClick: () => {
              // can do sth.
            },
          })
        })
      },
    },
  }
</script>

<style scoped>

</style>
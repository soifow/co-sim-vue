<template>
  <a-modal
    :title="title"
    :width="1000"
    :ok="false"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <div>
        <wang-editor v-model="detail"
                     :isClear="isClear"
                     :editable="false"
                     @change="change">

        </wang-editor>
      </div>
    </a-spin>

  </a-modal>
</template>

<script>
  import WangEditor from "@/components/WangEditor";
  import {getAction} from "@/api/manage";

  export default {
    name: "EditorTextModal",
    components: {
      WangEditor
    },
    data() {
      return {
        title: '文件预览',
        visible: false,
        confirmLoading: false,
        url: {
          list: '/v1/simulation/interbus/list.g',
        },
        isClear: false,
        detail: "<p>这是很nb</p><p>试验下换行</p>",
      }
    },
    created() {},
    methods: {
      loadData(arg) {
        // if (!this.url.list) {
        //   this.$message.error('请设置url.list属性!')
        //   return
        // }
        // //加载数据 若传入参数1则加载第一页的内容
        // if (arg === 1) {
        //   this.ipagination.current = 1
        // }
        // let params = this.getQueryParams()    // 查询条件
        // params.companyId = this.companyId
        // params.pageNum = params.pageNo
        // params.sort = 'desc'
        // params = Object.assign(params, this.reqParams)    // 合并主页传入的参数
        // this.loading = true
        // getAction(this.url.list, params).then((res) => {
        //   let data = this.formatListData(res)
        //   this.dataSource = data
        //   this.loading = false
        // })
      },
      open() {
        this.visible = true
        // this.loadData(1)
      },
      change(val) {
        console.log(val)
      },
      close() {
        this.$emit('close')
        this.visible = false
      },
      handleOk() {

      },
      handleCancel() {
        this.close()
      },
    }
  }
</script>

<style scoped>

</style>
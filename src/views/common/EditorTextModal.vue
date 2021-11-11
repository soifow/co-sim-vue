<template>
  <a-modal
    :title="title"
    :width="1000"
    :ok="false"
    :visible="visible"
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
                     @change="change"
                     class="editor">

        </wang-editor>
      </div>
    </a-spin>

  </a-modal>
</template>

<script>
  import WangEditor from "@/components/WangEditor";
  import { postAction } from "@/api/manage";

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
        detail: "",
        url: {
          detail: '/v1/enterGrid/datFind.g',
        }
      }
    },
    created() {},
    methods: {
      loadData(fileName) {
        if (!this.url.detail) {
          this.$message.error('请设置url.detail属性!')
          return
        }

        let params = {
          'filename': fileName
        }
        this.confirmLoading = true
        postAction(this.url.detail, params).then((res) => {
          if (res.code === 0) {
            this.detail = res.data
          }
          this.confirmLoading = false
        })
      },
      open(record) {
        this.visible = true
        this.loadData(record.fileName)
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
.editor {
  width: 100%;
  height: 600px;
  overflow-y: auto;
}
</style>
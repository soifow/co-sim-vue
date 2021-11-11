<template>
  <div>
    <!-- header -->
    <header-view :page-title="this.title"
                 :add-btn-enable="false" />

    <a-form :form="form"
            :label-col="labelCol"
            :wrapper-col="wrapperCol">

      <!-- 第一行 -->
      <a-row :gutter="0">
        <a-col :span="6">
          <a-form-item label="文件编号">
            <a-input v-decorator="['fileNo', ctrlOptions.fileNo]"
                     class="modal-input"
                     disabled />

          </a-form-item>
        </a-col>

        <a-col :span="6">
          <a-form-item label="文件名称">
            <a-input v-decorator="['fileName', ctrlOptions.fileName]"
                     class="modal-input"
                     disabled />

          </a-form-item>
        </a-col>

        <a-col :span="6">
          <a-form-item label="所属企业">
            <a-input v-decorator="['enterprise', ctrlOptions.enterprise]"
                     class="modal-input"
                     disabled />

          </a-form-item>
        </a-col>

        <a-col :span="6">
          <a-form-item label="所属用户">
            <a-input v-decorator="['user', ctrlOptions.user]"
                     class="modal-input"
                     disabled />

          </a-form-item>
        </a-col>
      </a-row>

      <!-- 第二行 -->
      <a-row :gutter="0">
        <a-col :span="6">
          <a-form-item label="总负荷">
            <a-input class="modal-input"
                     v-decorator="['totalLoad', ctrlOptions.totalLoad]"
                     disabled />

          </a-form-item>
        </a-col>

        <a-col :span="6">
          <a-form-item label="总发电">
            <a-input class="modal-input"
                     v-decorator="['totalPower', ctrlOptions.totalPower]"
                     disabled />

          </a-form-item>
        </a-col>

        <a-col :span="6">
          <a-form-item label="总补偿">
            <a-input class="modal-input"
                     v-decorator="['totalCompensate', ctrlOptions.totalCompensate]"
                     disabled />

          </a-form-item>
        </a-col>
      </a-row>
    </a-form>


    <a-row>
      <a-col :span="24">
        <!--        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"-->
        <a-table
          ref="table"
          bordered
          size="middle"
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          @change="handleTableChange"
          :scroll="{ x: 1500 }"
        >

          <!--          <template slot="taskStatus" slot-scope="text, record, index">-->
          <!--            <span :style="{'color': taskStatusStrColor(record.taskStatus), 'font-weight': 'bold'}">-->
          <!--              {{record.taskStatusStr}}-->
          <!--            </span>-->
          <!--          </template>-->

          <template slot="fileName" slot-scope="text, record, index">
            <a @click="showFileTextModal(record)">{{record.fileName}}</a>
          </template>

          <template slot="pointNum" slot-scope="text, record, index">
            <a @click="showPointInfoModal(record)">{{record.pointNum}}</a>
          </template>

          <template slot="nodeNum" slot-scope="text, record, index">
            <a @click="showNodeInfoModal(record)">{{record.nodeNum}}</a>
          </template>

          <template slot="netFileName" slot-scope="text, record, index">
            <a @click="showNetFileModal(record)">{{record.netFileName}}</a>
          </template>

          <template slot="otherDataFile" slot-scope="text, record, index">
            <a @click="showOtherDataFileModal(record)">共{{record.otherDataFile}}个文件</a>
          </template>

          <template slot="resultFile" slot-scope="text, record, index">
            <a @click="showResultFileModal(record)">共{{record.resultFile}}个文件</a>
          </template>

          <template slot="calculation" slot-scope="text, record, index">
            <!--            <a @click="showResultFileModal(record)">{{record.resultFile}}</a>-->
            <a-button type="primary" @click="calcActionInvoked(record)">计算</a-button>
          </template>

          <template slot="otherNetFile" slot-scope="text, record, index">
            <a @click="showOtherNetFileModal(record)">共{{record.otherNetFile}}个文件</a>
          </template>

          <!--          <template slot="requirement" slot-scope="text, record, index">-->
          <!--            <a-tooltip trigger="click">-->
          <!--              <template slot="title">-->
          <!--                {{record.dataTooltip}}-->
          <!--              </template>-->
          <!--              <a>{{record.dataRequirement}}</a>-->
          <!--            </a-tooltip>-->
          <!--          </template>-->

        </a-table>
      </a-col>
    </a-row>

  </div>
</template>

<script>
  import { postAction } from '@/api/manage'
  import { ListMixin } from '@/mixins/ListMixin'
  import { mapGetters } from 'vuex'
  import { removePropertyOfNull } from "@/utils/util";
  import moment from "dayjs";

  import HeaderView from "@/views/header/HeaderView";

  export default {
    description: '这是企业节点信息页面',
    name: "EnterpriseNodeList",     // 企业数据页面
    mixins: [ListMixin],
    components: {
      HeaderView,
    },
    data() {
      return {
        title: '企业节点信息',
        labelCol:  {span: 9, offset: 0},
        wrapperCol: {span: 13, offset: 1},
        form: this.$form.createForm(this),
        formData: {
          fileNo: '测试文件编号',
          fileName: '测试文件名',
          enterprise: '测试企业名',
          user: '测试用户名',
          totalLoad: '100',
          totalPower: '200.2',
          totalCompensate: '300.3',
        },
        ctrlOptions: {        // 定义空对象，在created中定义初始值
          // 在这里直接引用this.formData.name之类的会报错，因为formData执行到这里时还未被创建，对undefined的取属性直接报错
        },
        dataSource:[],    // 表格数据源
        columns: [
          /*{
              title: '#',         // 列表头名
              dataIndex: '',      // 该列所展示的值对应dataSource中某一项中的哪个key
              key:'rowIndex',     // vue需求唯一
              width:60,           // 列宽，允许使用百分比
              align:"center",     // 内容对齐方式(左/中/右)
              ellipsis: true,     // 超过宽度将自动省略，暂不支持和排序筛选一起使用
              customRender:function (t,r,index) {   // 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引
                return parseInt(index)+1;
              }
            },*/
          {
            title: '节点编号',
            align: 'center',
            width: 150,
            dataIndex: 'id',
          },
          {
            title: '节点名称',
            align: 'center',
            width: 180,
            dataIndex: 'nodeName',
          },
          {
            title: '基准电压(kV)',
            align: 'center',
            width: 150,
            dataIndex: 'baseVoltage',
          },
          {
            title: '节点类型',
            align: 'center',
            width: 100,
            dataIndex: 'nodeType',
            scopedSlots: { customRender: 'nodeType' },
          },
          {
            title: '有功负荷',
            align: 'center',
            width: 150,
            dataIndex: 'activePower',
          },
          {
            title: '无功负荷',
            align: 'center',
            width: 150,
            dataIndex: 'reactivePower',
          },
          {
            title: '有功发电',
            align: 'center',
            width: 150,
            dataIndex: 'Pgen',
          },
          {
            title: '无功发电',
            align: 'center',
            width: 150,
            dataIndex: 'Qgen',
          },
          {
            title: '无功补偿',
            align: 'center',
            width: 150,
            dataIndex: 'compensate',
          },
          {
            title: '控制电压',
            align: 'center',
            width: 150,
            dataIndex: 'controlVoltage',
          },
          {
            title: '最大有功发电',
            align: 'center',
            width: 120,
            dataIndex: 'PgenMax',
          },
          {
            title: '最大无功发电',
            align: 'center',
            width: 150,
            dataIndex: 'QgenMax',
          },
          {
            title: '最小无功发电',
            align: 'center',
            width: 120,
            dataIndex: 'QgenMin',
          },
        ],
        url: {
          list: '/v1/enterGrid/select.g',
        },
      }
    },
    computed: {
      // ...mapGetters(['userInfo','teamInfo','projectInfo']),   // 从store中取值
      // importExcelUrl: function () {
      //   return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
      // },
      taskStatusStrColor: function () {   // 无法直接给计算属性传参，需要用匿名函数实现，透传给匿名函数
        return function (taskStatus) {
          switch (taskStatus) {
            case 0:     // 未认领
              return '#f00'
            case 1:     // 计算中
              return '#dbc604'
            case 2:     // 返回
              return '#25cd25'
            default:
              return '#000'
          }
        }
      },
    },
    created() {
      // 将ctrlOptions的初始化延迟到这里
      this.ctrlOptions = {
        fileNo: {   // 文件编号
          initialValue: this.formData.fileNo,
        },
        fileName: {   // 文件名称
          initialValue: this.formData.fileName,
        },
        enterprise: {    // 所属企业
          initialValue: this.formData.enterprise,
        },
        user: {   // 所属用户
          initialValue: this.formData.user,
        },
        totalLoad: {   // 总负荷
          initialValue: this.formData.totalLoad,
        },
        totalPower: {   // 总发电
          initialValue: this.formData.totalPower,
        },
        totalCompensate: {   // 总补偿
          initialValue: this.formData.totalCompensate,
        },
      }
    },
    methods: {
      // loadData(arg) {
      //   console.log('in loadData from enterPriseData.vue')
      //   if (!this.url.list) {
      //     this.$message.error('请设置url.list属性!')
      //     return
      //   }
      //   //加载数据 若传入参数1则加载第一页的内容
      //   if (arg === 1) {
      //     this.ipagination.current = 1
      //   }
      //   let params = this.getQueryParams()          // 查询条件
      //   params.pageNum = params.pageNo
      //   // params.theproject = this.projectInfo.uid    // 工程id
      //   // params.pveruid = this.projectInfo.veruid    // 工程版本
      //   // params.userid = this.userInfo.id            // 提交用户id
      //
      //   this.loading = true
      //   console.log(params)
      //   postAction(this.url.list, params).then((res) => {
      //     if (res.code === 0) {
      //       let data = this.formatEnterpriseListData(res.data.records)
      //       this.dataSource = data
      //       this.ipagination.total = res.data.total
      //     }
      //
      //     if (res.code < 0) {
      //       this.$message.warning(res.message)
      //     }
      //     this.loading = false
      //   })
      //
      //   // 测试代码
      //   // let testData = [
      //   //   {
      //   //     'id': '0',
      //   //     'name': '文件名1',
      //   //     'sbase': 120,
      //   //     'enterprise': '企业名1',
      //   //     'user': '用户名1',
      //   //     'tasktype': 6,
      //   //     'eqtype': 1,
      //   //     'opertime': 1636338050734,
      //   //     'planyear': 2022,
      //   //     'planmode': 1,
      //   //     'intercount': 10,
      //   //     'rcvtime': 1636338070321,
      //   //     'nodeNum': 24,
      //   //     'dataFileNo': '4001',
      //   //     'netFileName': '电网文件名1',
      //   //     'calstas': 0,
      //   //     'endtime': 1636338081368,
      //   //     'otherDataFile': 2,
      //   //     'resultFile': 3,
      //   //     'otherNetFile': 5,
      //   //   },
      //   // ]
      //   // this.dataSource = this.formatEnterpriseListData(testData)
      //   // this.ipagination.total = 1
      //   // 测试代码结束
      // },
      showFileTextModal(record) {
        this.$refs.editorTextModal.open(record)
      },
      showPointInfoModal(record) {
        this.$refs.insertPointModal.open(record)
      },
      showNodeInfoModal(record) {
        // this.$refs.calcResultWindow.open(record)
      },
      showNetFileModal(record) {
        // this.$refs.calcResultWindow.open(record)
      },
      showOtherDataFileModal(record) {
        this.$refs.otherDataFilesModal.open(record)
      },
      showResultFileModal(record) {
        // this.$refs.calcResultWindow.open(record)
      },
      calcActionInvoked(record) {
        // to do 根据当前用户是否允许自动计算的状态决定本列是否允许操作
        // 触发计算动作api接口
      },
      showOtherNetFileModal(record) {
        // this.$refs.calcResultWindow.open(record)
      },
      // 企业数据 - 主表格获取数据组装
      formatEnterpriseListData(response) {
        let result = []
        console.log(response)
        if (response.length) {
          response.forEach(resp => {
            let rowObj = {}     // 每行对应的数据结构
            rowObj['id'] = resp.id                    // 该行对应结果的唯一id（计算结果这类子弹窗请求所需要的数据）
            rowObj['nodeName'] = resp.name            // 节点名称
            rowObj['baseVoltage'] = resp.vbase        // 基准电压
            rowObj['nodeType'] = resp.nodetype        // 节点类型
            rowObj['activePower'] = resp.pload        // 有功负荷
            rowObj['reactivePower'] = resp.qload      // 无功负荷
            rowObj['Pgen'] = resp.pgen                // 有功发电
            rowObj['Qgen'] = resp.qgen                // 无功发电
            rowObj['compensate'] = resp.qcomp         // 无功补偿
            rowObj['controlVoltage'] = resp.eqtype    // 控制电压
            rowObj['PgenMax'] = resp.pgmax            // 最大有功发电
            rowObj['QgenMax'] = resp.qgmax            // 最大无功发电
            rowObj['QgenMin'] = resp.qgmin            // 最小无功发电
            rowObj = removePropertyOfNull(rowObj)     // 删除无效key
            result.push(rowObj)
          })
        }

        return result
      },
      // 主表格时间显示格式化
      formatTableTimeStr(timeStamp, defaultDesc) {
        if (timeStamp > 0) {
          return moment(timeStamp).format('YYYY-MM-DD HH:mm:ss')
        }

        return defaultDesc
      },
      // 主表格电网数据类型显示格式化
      formatDataTypeStr(taskType) {
        switch (taskType) {
          case 0:
            return '运行'
          case 1:
            return '规划'
          default:
            return taskType + ''
        }
      },
      // 主表格任务类型显示格式化
      formatTaskTypeStr(taskType) {
        switch (taskType) {
          case 2:
            return '潮流计算'
          case 6:
            return '短路电流计算'
          case 9:
            return '暂态故障仿真'
          default:
            return taskType + ''
        }
      },
    },
  }
</script>

<style scoped>
  @import '~@assets/less/common.less';
</style>
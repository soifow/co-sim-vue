/** init domain config */
import Vue from 'vue'
//设置系统名称
window._CONFIG['sysName'] = process.env.VUE_APP_SYS_NAME
//设置系统模式:0.SAAS 1.独立部署
window._CONFIG['sysMode'] = process.env.VUE_APP_SYS_MODE
// 设置系统场景：0.swan-hosting 1.swan-simulation
window._CONFIG['sysScene'] = process.env.VUE_APP_SYS_SCENE

//设置全局API_BASE_URL
Vue.prototype.API_BASE_URL = process.env.VUE_APP_BASE_URL
window._CONFIG['domianURL'] = Vue.prototype.API_BASE_URL
window._CONFIG['securityURL'] = process.env.VUE_APP_SECURITY_URL
window._CONFIG['simulationUrl']=process.env.VUE_APP_SIMULATION_URL

window._CONFIG['staticDomainURL'] = Vue.prototype.API_BASE_URL + '/sys/common/static'
window._CONFIG['pdfDomainURL'] = Vue.prototype.API_BASE_URL+ '/sys/common/pdf/pdfPreviewIframe'

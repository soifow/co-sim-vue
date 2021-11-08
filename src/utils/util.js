/**
 * 过滤对象中为空的属性
 * @param obj
 * @returns {*}
 */
export function filterObj(obj) {
  if (!(typeof obj == 'object')) {
    return;
  }

  for (let key in obj) {
    if (obj.hasOwnProperty(key)
      && (obj[key] == null || obj[key] == undefined || obj[key] === '')) {
      delete obj[key];
    }
  }
  return obj;
}


// 删除所传对象中值为null的属性
export function removePropertyOfNull(obj) {
  Object.keys(obj).forEach(item => {
    if (obj[item] == null || obj[item] == undefined) {
      delete obj[item]
    }
  })
  return obj;
}


// 全局api
var network = require("../public/request/request.js")

//获取墓园列表 
export function postData(data,url, callback,errorCallback) {
  network.POST({
    url: url,
    params: data,
    success: function (res) {
      callback && callback(res)
    },
		fail: function() {
			 errorCallback && errorCallback()
		}
  })
}

//GET 
export function getData(data, url, callback) {
  network.GET({
    url: url,
    params: data,
    success: function (res) {
      callback && callback(res)
    }
  })
}

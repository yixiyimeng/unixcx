var md5 = require("../../public/md5/md5.js")

// var API_URL = 'http://192.168.9.63/XCXApi/'
//var API_URL = 'http://192.168.9.100/XCXApi/'

var API_URL = 'https://www.sjjs99.com/XCXApi/'

// var failimg = require("../../assets/images/tixing.png") 
var requestHandler = {
  url: "",
  params: {},
  success: function (res) {
    // success  
  },
  fail: function () {
    // fail  

  },
}

// 签名
function changePara(obj) {
  let newObj = {};
  if (Object.keys(obj).length) {
    newObj = JSON.parse(JSON.stringify(obj));
  } else {
    newObj = {}
  }

  newObj.TS = new Date().getTime();
  let arr = [];
  let str = '';
  for (var key in newObj) {
    arr.push(key);
  }
  if (arr.length) {
    arr.sort().forEach(function (element, index) {
      if (newObj[element] == null) newObj[element] = '';
      str += element + "=" + newObj[element] + '&'
    });
  }
  let newSign = md5(str + 'userUw&(*!^%@');
  newObj.Sign = newSign;
  return newObj;
}


//GET请求  
function GET(requestHandler) {
  request('GET', requestHandler)
}
//POST请求  
function POST(requestHandler) {
  request('POST', requestHandler)
}

function request(method, requestHandler) {
  //注意：可以对params加密等处理 
  var params = changePara(requestHandler.params); 
  wx.request({
    url: API_URL + requestHandler.url,
    data: params,
    method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
    // header: {}, // 设置请求的 header  
    success: function (res) {
      // console.log(getCurrentPages());
      //注意：可以对参数解密等处理  
      if (res.statusCode == 500) {
        // setTimeout(res => {
        //   wx.showToast({
        //     title: '服务器错误',
        //     icon: 'none'
        //   })
        // }, 1500)
        console.log(res);

      } else if (res.data.Ret == 1002) {
        wx.redirectTo({
          url: '/pages/admin/login/login',
        })
      } else {

        if( res.data.Code == 0){
          requestHandler.success(res)
        } else if (res.data.Code == 1001) {
          wx.showToast({
            title: '授权信息失效，即将前往重新授权',
            icon: 'none',
            duration:1500,
            complete:function(){
              setTimeout(function(){
                wx.navigateTo({
                  url: '/pages/index/authority'
                })
              },1500)
            }
          })
        } else if (res.data.Code == 1039){
          // 横屏提醒
          requestHandler.success(res)
        } else if (res.data.Code > 0) {
          wx.showToast({
            title: res.data.Msg,
            icon: 'none'
          })
          requestHandler.success(res)
        }

  
      }
    },
    fail: function () {
      requestHandler.fail()
      setTimeout(res => {
        wx.showToast({
          title: '网络请求错误',
          icon: 'none'
        })
      }, 1500)
    },
    complete: function () {
      // complete  
      // wx.hideLoading();
    }
  })
}

module.exports = {
  GET: GET,
  POST: POST
}
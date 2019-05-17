const app = getApp();
//====================== 封装的请求接口=========================
function http(url, method, data, callBack) {
  var header = "";

  method == 'POST' ? header = "application/x-www-form-urlencoded" : header = 'application/json';
  wx.request({
    url: app.globalData.staticUrl + url,
    data: data,
    method: method,
    header: {
      'content-type': header
    }, //设置请求头g
    success: function (res) {
      callBack(res.data);
    },
    fail: function () {
      wx.hideLoading();
      wx.showToast({
        title: '网络错误，请稍后重试,',
        icon: 'none',
        duration: 2000
      })
    },
    complete:function(){
   
    }
  })
}
//====================== 封装的请求接口=========================


// ==================判断用户是否已经登录==========

function isloginStatus() {

  var isloginStatus = wx.getStorageSync("isloginStatus");
  var userid = wx.getStorageSync("userid");
  var userInfomation = wx.getStorageSync("userInfomation");
  if (!isloginStatus || isloginStatus == "undefinded" || isloginStatus == null || isloginStatus == "" || isloginStatus.length <= 0 || userid == "" || !userid) {
    return {
      isloginStatus:false,
      userid:"",
      userInfomation:{}
    };
  }
  else {
   return {
      isloginStatus: true,
      userid: userid,
      userInfomation: userInfomation
    };
  }
}

// ===================判断用户是否已经登录=================






// ====================== 警告提示=========================

function showWarning(msg) {
  wx.showToast({
    title: msg,
    icon: "none",
    image: "../images/jg.png",
    duration: 1500,
    mask: true
  })
}
// ====================== 警告提示=========================
// ====================== 警告提示(纯文本)=========================

function showWarningText(msg) {
  wx.showToast({
    title: msg,
    icon: "none",
    duration: 1500,
    mask: true
  })
}
// ====================== 警告提示(纯文本)=========================
// ====================== 成功提示=========================

function showSuccess(msg) {

  wx.showToast({
    title: msg,
    icon: "success",
    duration: 1500,
    mask: true
  })


}

// ====================== 成功提示=========================



// ======================加入到购物车=====================

function joinShopCar(goodsid,  isSelect, specs,count, callBack){
  var self = this;
  var goodsid = goodsid;
  var isSelect = isSelect;
  var specs = specs;
  var userid = wx.getStorageSync("userid");
  var aid = wx.getStorageSync("aid");
  var isloginStatus = wx.getStorageSync("isloginStatus");
  var count = count;
  console.log(goodsid)
  console.log(aid)

  if (!userid || !isloginStatus) {
    showWarningText('你需要登录,才能购买商品!')
   
    return false;
  }
  if (isSelect < 0) {
    showWarningText('请选择商品规格!')
    return false;
  }
  if (count <= 0) {
    showWarningText('购买数量不能小于1!')
    return false;
  }
  if (!goodsid) {
   showWarningText('数据繁忙,请稍后!')
    return false;
  }
  // wx.showLoading({
  //   title: '添加中...',
  //   mask: true
  // })
  var specname = specs[isSelect];
  console.log(userid);
  console.log(goodsid);
  console.log(specname);
  console.log(count);
  var specname = specname.name
  console.log(specname)
  http('fastorder/addcard', 'GET', {
    userid: userid,
    goodsid: goodsid,
    specname: specname ,
    count: count,
    aid:aid
  }, function (res) {
    wx.hideLoading()
      callBack(res)
  })
 
}


// ======================加入到购物车====================



//=========================== 购物车计算总价格==========================

function shopCarGetMoney(card){
 
 console.log(card)
 var card =card;
 var allMoeny=0;
 
  var cardShopArr = [];
  var userid = wx.getStorageSync("userid")
  for (var i = 0; i < card.length; i++) {
    for (var y = 0; y < card[i].goods.length; y++) {
      if (card[i].goods[y].state == 1)
      {
        allMoeny += card[i].goods[y].count * card[i].goods[y].price
      }
    }
  }
  return allMoeny;
  // console.log(allMoeny)




 


}

//=========================== 购物车计算总价格==========================

module.exports = {
  http: http,
  showWarning: showWarning,
  showSuccess: showSuccess,
  isloginStatus: isloginStatus,
  showWarningText: showWarningText,
  joinShopCar: joinShopCar,
  shopCarGetMoney:shopCarGetMoney
}
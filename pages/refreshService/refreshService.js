// pages/refreshService/refreshService.js
const app = getApp()
const api = require('../../utils/http.js');
var tcity = require("../../utils/citys.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000, 
    name: "",
    phone: "",
    address: "",
    need: "",
    issatisfy: true,
    isLoginTrue: false, verifyCodeTime: '获取验证码',
    buttonDisable: false,
    money:"0000",
    image: app.globalData.imagesUrl,
    region: ['请', '选择', '城市'],
    multiArray: [
      ['5室', '4室', '3室', '2室','1室'],
      ['5厅', '4厅', '3厅','2厅','1厅'],
      ['5厨', '4厨', '3厨','2厨','1厨'],
      ['5卫', '4卫', '3卫','2卫','1卫'],
      ['5阳', '4阳', '3阳','2阳','1阳']
    ],
    objectMultiArray: [
      [
        {
          id: 0,
          name: '6室'
        },
        {
          id: 1,
          name: '6厅'
        }
      ], [
        {
          id: 0,
          name: '6厨'
        },
        {
          id: 1,
          name: '6卫'
        },
        {
          id: 2,
          name: '6阳'
        },
        {
          id: 3,
          name: '1室'
        },
        {
          id: 3,
          name: '1厅'
        }
      ], [
        {
          id: 0,
          name: '1厨'
        },
        {
          id: 4,
          name: '1卫'
        },
        {
          id: 4,
          name: '1阳'
        },
        {
          id: 0,
          name: '2室'
        },
        {
          id: 5,
          name: '2厅'
        },
        {
          id: 5,
          name: '2厨'
        },
        {
          id: 0,
          name: '2阳'
        }
      ]
    ],
    multiIndex: [0, 0, 0,0,0],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    self.offerinfo()
    self.offerpic()

    var userid = wx.getStorageSync('userid')
    self.setData({
      code_key:1,
      button: 1
    })
    var isloginStatus = wx.getStorageSync('isloginStatus');
    var userInfomation = wx.getStorageSync('userInfomation');
    if (userid && isloginStatus && userInfomation)
    {
      console.log('登录状态')
      userInfomation = JSON.parse(userInfomation);
      var phone = userInfomation.phone;
      self.setData({
        phone: phone,
        isLoginTrue: true
      })

    }
    else
    {
      self.setData({
        phone: "",
        isLoginTrue: false
      })
      console.log('未登录状态')
    }
    self.setData({
      userid: userid
    })
    self.indexbanner();
 


  },
  //报价信息
  offerinfo:function(){
    var self = this;
  var aid = wx.getStorageSync('aid')
    api.http('json/offerinfo', 'GET', { aid: aid }, function (res) {
      console.log(res)
      self.setData({
        offer: res.offer,
        phone1: res.phone, 
      })

    })
  },
  MultiColumnChange(e) {
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  offerpic:function(){
    var self = this;
    var aid = wx.getStorageSync('aid')
    api.http('json/offer_pic', 'GET', { aid: aid }, function (res) {
      console.log(res)
      self.setData({
        offerpic: res.offerpic,
      })

    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("页面隐藏")
    wx.removeStorageSync("maney");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("页面隐藏")
    wx.removeStorageSync("maney");
  },
  //地址
  RegionChange: function (e) {
    console.log(e)
    this.setData({
      region: e.detail.value
    })
  },
  //方式
  MultiChange(e) {
    console.log(e)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
  , formSubmit: function (e) {
    var self = this;
 
    console.log(e);
    var userid = wx.getStorageSync('userid')
    var isloginStatus = wx.getStorageSync('isloginStatus');
    var userInfomation = wx.getStorageSync('userInfomation');
    var offer1 = e.detail.value.offer;
    var phone = e.detail.value.phone;
    var addre = e.detail.value.addressa;
    var need = e.detail.value.need;
    var offer = offer1 * addre;
    wx.setStorageSync("maney", offer)
    var multiIndex = e.detail.value.multiIndex;
    var region = e.detail.value.region;

    if (region[0] == "请") {
      api.showWarning('地址错误');
      return false;
    }
    if (phone == "") {
      api.showWarning('手机号不能为空');
      return false;
    }
    if (addre == ""){
      api.showWarning('房屋面积不能为空');
      return false;
    }
    var captcha = wx.getStorageSync("captcha");
    var mobile = wx.getStorageSync("mobile");
    var keycode = e.detail.value.keycode;
    var phone = e.detail.value.phone;
    if (keycode == "") {
      api.showWarning('请填写验证码!'); return false;
    }
    if (keycode == "" || keycode != captcha) {
      api.showWarning('验证码不正确!'); return false;
    }
    if (phone != mobile) {
      api.showWarning('验证码错误!'); return false;
    }
    if (userid && isloginStatus && userInfomation) {
      var aid = wx.getStorageSync('aid')
      
      console.log('登录状态!')
      api.http('json/offer', 'GET',{
        aid:aid,
        uid: userid,
        house: multiIndex,
        phone: phone,
        offer: offer,
        acreage: addre,
        address: region,
        captcha: captcha
      }, function (res) {
        //wx.setStorageSync("code_key", 2)//报价过
        var money = wx.getStorageSync("maney")
        var num = money.toFixed(2);
        self.setData({
          code_key: 2,
          money: num  ,
          button:2
        })
        console.log(res)
          wx.hideLoading()
          if (res.code == 1) {
            api.showWarningText(res.msg)
          }
          console.log(res)
      })

    }
    else {
      var captcha = wx.getStorageSync("captcha");
      var mobile = wx.getStorageSync("mobile");
      var keycode = e.detail.value.keycode;
      var phone = e.detail.value.phone;
      if (keycode == "") {
        api.showWarning('请填写验证码!'); return false;
      }
      if (keycode == "" || keycode != captcha) {
        api.showWarning('验证码不正确!'); return false;
      }
      if (phone != mobile) {
        api.showWarning('验证码错误!'); return false;
      }
      wx.showLoading({
        title: '加载中...',
        mask:true
      })
      console.log(e.detail.value)
      var aid = wx.getStorageSync('aid')
      api.http('json/offer', 'GET', {
        aid: aid,
        uid: userid,
        house: multiIndex,
        phone: phone,
        offer: offer,
        acreage: addre,
        address: region
      }, function (res) {
       
        wx.hideLoading()
        if (res.code == 1) {
          api.showWarningText(res.msg);
          setTimeout(function () {
            wx.navigateBack({
              delta: '1'
            })
          }, 1000)
        }
        else {
          api.showWarningText(res.msg)
        }
        console.log(res)
      })

    }
    wx.showLoading({
      title: '提交中...',
      mask:true
    })








  },
  //=============1.1获取首页轮播图===========
  indexbanner: function () {
    var self = this;
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    var aid = wx.getStorageSync("aid")
    api.http('index/indexbanner', 'GET', {aid:aid}, function (res) {
      console.log(res)
      wx.hideLoading()
      self.setData({
        indexbanner: res.data
      })

    })
  }
  //===============1.1获取首页轮播图====================







  , bindinputname: function (e) {
    var self = this;
    self.setData({
      name: e.detail.value
    })
    self.isAllinput();
  }
  , bindinputphone: function (e) {
    var self = this;
    self.setData({
      phone: e.detail.value
    })
    self.isAllinput();
  }
  , bindinputaddress: function (e) {
    var self = this;
    self.setData({
      address: e.detail.value
    })
    self.isAllinput();
  }
  , bindinputneed: function (e) {
    var self = this;
    self.setData({
      need: e.detail.value
    })
    self.isAllinput();
  }

  , isAllinput: function () {
 
    // var self = this;
    // var name = self.data.name;
    // var phone = self.data.phone;
    // var address = self.data.address;
    // var need = self.data.need;
    // if (name.length > 0 && phone.length > 0 && address.length > 0 && need.length > 0) {

    //   console.log('满足')
    //   self.setData({
    //     issatisfy: true
    //   })

    // }
    // else {
    //   console.log('不满足')
    //   self.setData({
    //     issatisfy: false
    //   })
    // }


  },
  //底部定制
  phone:function(e){
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone // 仅为示例，并非真实的电话号码
    })
  } ,
  bindTapImg:function(e){

    console.log('点击了banner图');
    var goodsid = e.currentTarget.dataset.goodsid;
    var sellerid = e.currentTarget.dataset.sellerid;
    var classid = e.currentTarget.dataset.classid;
    console.log(goodsid)
    console.log(sellerid)
    console.log(classid)
    if (goodsid && goodsid != 0) {
      console.log('跳转到商品详情')
      wx.navigateTo({
        url: '../productDetails/productDetails?goodid=' + goodsid
      })
      return false;
    }
    if (classid && classid != 0) {
      console.log('跳转到分类详情')
      var self = this;
      console.log(e.currentTarget.dataset.classid)
      wx.setStorageSync("classid", classid);
      wx.switchTab({
        url: '../shoppingMall/shoppingMall'
      })
      return false;
    }

  }

  // ===========================验证码==========================

,verifyCodeEvent: function (e) {
  var self =this;
  var mobile = self.data.phone;
  // var regMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
  self.setData({
    buttonDisable: false
  })
  if (mobile[0] != 1 || mobile.length  <11) 
 {
    api.showWarning("手机号错误")
    self.setData({
      buttonDisable: false
    })
    return false;
  }
  api.http('centre/captcha_offer', 'GET',
    {phone:mobile}
    , function (res) {
       console.log(res)
       
       if(res.code==0)
       {
         api.showWarning(res.msg)
       }
       else if (res.code == 1)
       {
         changeUserCode();
         api.showSuccess(res.msg)
         wx.setStorageSync("captcha", res.captcha)
         wx.setStorageSync("mobile", mobile)
       }
    })
function changeUserCode(){
  var c = 60;
    var intervalId = setInterval(function () {
      c = c - 1;
      self.setData({
        verifyCodeTime: c + 's后重发',
        buttonDisable: true
      })
      if (c == 0) {
        clearInterval(intervalId);
        self.setData({
          verifyCodeTime: '获取验证码',
          buttonDisable: false
        })
      }
    }, 1000)
 
}
 
    console.log(mobile)
    // =====================获取验证码接口==============================    
    

    
    // =====================获取验证码接口===============================
  }


})
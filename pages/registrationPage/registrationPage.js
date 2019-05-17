// pages/registrationPage/registrationPage.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: 'CHN', value: '       ⟪宜居工匠平台规则⟫', checked: true },
    ],
    isCanSee: false ,     //false : 没有开眼   true ： 已经开眼了
    verifyCodeTime: '获取验证码',
    buttonDisable:false,
    mobile:"",
    password:"",
    iszhuce:false,
    image: app.globalData.imagesUrl,
    lrub:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var self = this;
    var userid= wx.getStorageSync('userid');
    if(userid || userid != "")
    {wx.showLoading({
      title: '跳转中...',
      mask:true
    })
      console.log('已经登录账号了..');
      console.log(options.pid)
      var goodsid = options.goodsid;
      console.log("商品id:"+goodsid)
      self.setData({
        iszhuce: false
      })
      setTimeout(function(){
        wx.hideLoading();
        wx.redirectTo({
          url: '../productDetails/productDetails?isshare=10&goodid=' + goodsid
        })
      },500)
       
    }
    else
    {
      console.log('没有登录状态..');
      var pid = options.pid;
      if(pid)
      {
        console.log(pid)
        self.setData({
          pid: pid,
        })
      }
      self.setData({
        iszhuce:true
      })
    }
  },
  loginoogg:function(){
  wx.navigateTo({
    url: '../userLoginPage/userLoginPage',
  })
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  },
  lrub:function(){
    wx.navigateTo({
      url: '../platRegulation/platRegulation?status=2',
    })
  },
  radioll:function(e){
   console.log(e)
   this.setData({
    lrub:true,
   })
  },
  setCanSee: function () {
    var self = this;

    self.setData({
      isCanSee: !self.data.isCanSee
    })

  }

  , formSubmit: function (e) {
    wx.showLoading({
      title: '注册中...',
      mask: true
    })
    if(e){

    }
    var self = this
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)

              var name = res.userInfo.nickName;
              var headpic = res.userInfo.avatarUrl;
              resgistInformation(name,headpic)

            }
          })
        }
        else
        {
          wx.hideLoading()
          api.showWarning('请先允许授权!')
        }
      }
    })
  
return false;
    function resgistInformation(name, headpic){
    var captcha = wx.getStorageSync("captcha");
    var phone = self.data.mobile;
    var password = self.data.password;
    var captchaNew = self.data.captcha;
    console.log(captchaNew)
    console.log(captcha)
    console.log(password)
    console.log(phone)
    if (phone == "" || phone.length<11 || !phone)
    {
      wx.hideLoading();
      api.showWarning('手机号错误!');
      return false;
    }
    
    if (captcha == "" || !captcha || captcha != captchaNew)
    {
      wx.hideLoading();
      api.showWarning('验证码验证失败!')
      return false;
    }
    if (password == "" || password.length< 6) {
      wx.hideLoading();
      api.showWarning('密码不符合规范!')
      return false;
    }
 
   //var  pid =self.data.pid;
      var aid = wx.getStorageSync("aid");
      var pid = wx.getStorageSync("pid");
    api.http('centre/regist', 'GET',
      {
        password: password,
        captcha: captchaNew,
        phone: phone,
        name:name,
        headpic:headpic,
        pid: pid,
        aid:aid
      }
      , function (res) {
        api.showWarningText(res.msg)

        wx.hideLoading(); 
      
        if(res.code == 1)
        {
          api.showSuccess(res.msg)
            setTimeout(function () {
              wx.navigateTo({
                url: '../userLoginPage/userLoginPage',
              })
            }, 1000)  
        }
        else
        {
          api.showWarning(res.msg)
        }

        console.log(res)

      })
}
  }
  , 
  bindPhone:function(e){

  var self =this;

  var mobile = e.detail.value;
   self.setData({
     mobile: mobile
   })


  }
  , 
  bindPass:function(e){
    var self = this;

    var password = e.detail.value;
    self.setData({
      password: password
    })
  },
  bindCaptcha:function(e){
    var self = this;
    var captcha = e.detail.value;
    self.setData({
      captcha: captcha
    })
  }
  // ===========================验证码==========================

,verifyCodeEvent: function (e) {
  var self =this;
  var mobile = self.data.mobile;
  var regMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
  self.setData({
    buttonDisable: false
  })
  if (!regMobile.test(mobile)) 
 {
    api.showWarning("手机号错误")
    self.setData({
      buttonDisable: false
    })
    return false;
  }
  var aid = wx.getStorageSync("aid");
  api.http('centre/captcharegist', 'GET',
    {phone:mobile,aid:aid}
    , function (res) {
      api.showWarningText(res.msg)
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




  ,
  // 获取验证码

})
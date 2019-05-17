// pages/loginPage/loginPage.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

     isCanSee: false,     //false : 没有开眼   true ： 已经开眼了
    verifyCodeTime: '获取验证码',
    buttonDisable: false,
    mobile: "",
    password: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
   setCanSee: function () {
    var self = this;

    self.setData({
      isCanSee: !self.data.isCanSee
    })

  }
  ,
   goLink:function(){
     wx.navigateBack({
       delta:"1"
     })
   }






  // ===========================验证码==========================

  , verifyCodeEvent: function (e) {
    var self = this;
    var mobile = self.data.mobile;
    var regMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(16[0-9]{1}))+\d{8})$/;
    self.setData({
      buttonDisable: false
    })
    if (!regMobile.test(mobile)) {
      api.showWarning("手机号错误")
      self.setData({
        buttonDisable: false
      })
      return false;
    }
    var aid = wx.getStorageSync("aid")
    api.http('centre/captcha', 'GET',
      { phone: mobile, aid: aid }
      , function (res) {
        api.showWarning(res.msg)
        // console.log(res)
        if (res.code == 0) {
          api.showWarning(res.msg)
        }
        else if (res.code == 1) {
          changeUserCode();
          api.showSuccess(res.msg)
          
          wx.setStorageSync("captcha", res.captcha)
        }
      })

    function changeUserCode() {
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
  },
  bindCaptcha: function (e) {
    var self = this;
    var captcha = e.detail.value;
    self.setData({
      captcha: captcha
    })
  },
  bindPhone: function (e) {

    var self = this;

    var mobile = e.detail.value;
    self.setData({
      mobile: mobile
    })


  }

  ,

  formSubmit:function(){
 var self =this;
      var captcha = wx.getStorageSync("captcha");
      var phone = self.data.mobile;
      var captchaNew = self.data.captcha;
      
      if (phone == "" || phone.length < 11 || !phone) {
        api.showWarning('手机号错误!')
        return false;
      }
      // if (captcha == "" || !captcha || captcha != captchaNew) {
      //   api.showWarning('验证码验证失败!')
      //   return false;
      // }
 
      wx.showLoading({
        title: '登录中...',
        mask: true
      })

      console.log(captchaNew)
      // console.log(captcha)
      console.log(phone)
      var aid = wx.getStorageSync("aid")
      api.http('centre/codelogin', 'GET',
        {
          phone: phone,
          captcha: captchaNew,
          aid: aid
        }
        , function (res) {
          wx.hideLoading();
          if(res.code == 1)
          {
            api.showSuccess(res.msg)
          
            var userInfomation = JSON.stringify(res.user);
            wx.setStorageSync("userid", res.user.id)
            wx.setStorageSync("isloginStatus", "isloginStatus")
            wx.setStorageSync("userInfomation", userInfomation)
            wx.removeStorageSync('captcha')
            wx.setStorageSync('isPhone', 'isPhone')
            setTimeout(function () {
              wx.switchTab({
                url: '../personalCenter/personalCenter',
              })
            }, 1000)
          }
          else
          {
            api.showWarningText(res.msg)
          }
         

          console.log(res)
        })

    










  }











})
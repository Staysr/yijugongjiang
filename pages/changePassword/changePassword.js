// pages/changePassword/changePassword.js
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
    phone:"",
    password:"",
    passwordW:"",
    captcha:""
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
  
  }
,
  bindPhone: function (e) {

    var self = this;

    var mobile = e.detail.value;
    self.setData({
      mobile: mobile
    })


  }
  ,
  bindPass: function (e) {
    var self = this;

    var password = e.detail.value;
    self.setData({
      password: password
    })
  },
  bindPassW:function(e){

    var self = this;
    var passwordW = e.detail.value;
    self.setData({
      passwordW: passwordW
    })

  }
  ,
  bindCaptcha: function (e) {
    var self = this;
    var captcha = e.detail.value;
    self.setData({
      captcha: captcha
    })
  }



  // ===========================验证码==========================

  , verifyCodeEvent: function (e) {
    var self = this;
    var mobile = self.data.mobile;
    var regMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
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
    api.http('centre/captcha', 'GET',
      { phone: mobile }
      , function (res) {
        // console.log(res)
        if (res.code == 0) {
          api.showWarning(res.msg)
        }
        else if (res.code == 1) {
          changeUserCode();
          api.showSuccess(res.msg)
          // self.setData({
          //   captcha: res.captcha
          // })
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
  }
  ,


  formSubmit:function(){

   var self = this;
      var captcha = wx.getStorageSync("captcha");
      var phone = self.data.mobile;
      var password = self.data.password;
      var passwordW = self.data.passwordW;
      var captchaNew = self.data.captcha;
      console.log(captchaNew)
      console.log(captcha)
      console.log(password)
      console.log(phone)
      console.log(passwordW) 
      if (phone == "" || phone.length < 11 || !phone) {
        api.showWarningText('手机号错误!')
        return false;
      }
      if (captcha == "" || !captcha || captcha != captchaNew) {
        api.showWarningText('验证码验证失败!')
        return false;
      }
      if (password == "" || password.length < 6) {
        api.showWarningText('密码不符合规范!')
        return false;
      }
      if (passwordW == "" || passwordW.length < 6) {
        api.showWarningText('确认密码不符合规范!')
        return false;
      }
      if (password != passwordW) {
        api.showWarningText('密码与确认密码不一致!')
        return false;
      }

      wx.showLoading({
        title: '修改中...',
        mask: true
      })
      api.http('centre/codepwd', 'GET',
        {
          password: password,
          captcha: captchaNew,
          phone: phone,
          pwd1: password,
          pwd2: passwordW
        }
        , function (res) {
          wx.hideLoading();
          if(res.code == 0)
          {
            api.showWarning(res.msg);
          }
          else if (res.code == 1)
          {
            api.showSuccess(res.msg);
            wx.removeStorageSync('captcha')
            setTimeout(function () {
              wx.navigateTo({
                url: '../userLoginPage/userLoginPage',
              })
            }, 1000)
          }
          else
          {
            api.showWarning(res.msg);
          }

          console.log(res)
        })

    }







  
  // 获取验证码
})
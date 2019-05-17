// pages/mulbuOccupancy/mulbuOccupancy.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    username: "",
    password: "",
    phone: "",
    brand: "",
    product: "",
    goodness: "",
    introduce: "",
    userid: "",
    verifyCodeTime:  '获取验证码',
    issatisfy: false,
    isApplyStatus: 0,//1:未申请   2:审核中   3:审核失败   4：审核成功
    image: app.globalData.imagesUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this;
    var userid = wx.getStorageSync("userid")
    var opione = wx.getStorageSync("userInfomation")
    var dataion = JSON.parse(opione)
    console.log(dataion)
    self.setData({
      userid: userid,
      opione: dataion.phone
    })
    wx.showLoading({
      title: '加载中...',
    })
    var aid = wx.getStorageSync("aid")
    api.http('centre/enter', 'GET', {
      userid: userid,
      aid: aid
    }, function(res) {
      console.log(res)
      wx.hideLoading();
      if (res.code == 2) {
        console.log('商家未入住')
        self.setData({
          isApplyStatus: 1
        })
      } else if (res.state == 1) {
        self.setData({
          isApplyStatus: 2
        })
      } else if (res.state == 2) {
        console.log('商家通过')
        self.setData({
          isApplyStatus: 4,
          url: res.url
        })
      } else if (res.state == 3) {
        console.log('入住失败')
        self.setData({
          isApplyStatus: 3,
          handlereason: res.reject
        })
      } else if (res.state == 9){
        self.setData({
          isApplyStatus: 9,
          //handlereason: res.reject
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  verifyCodeEvent: function(e) {
    console.log(e)
    var self = this;
    var mobile = self.data.phone;
    // var regMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    self.setData({
      buttonDisable: false
    })
    if (mobile[0] != 1 || mobile.length < 11) {
      api.showWarningText("手机号错误")
      self.setData({
        buttonDisable: false
      })
      return false;
    }
    var aid = wx.getStorageSync("aid")
    api.http('centre/captcha_store', 'GET', {
      phone: mobile,
      aid: aid
    }, function(res) {
      console.log(res)
      api.showWarning(res.msg)
      if (res.code == 0) {
        api.showWarning(res.msg)
      } else if (res.code == 1) {
        changeUserCode();
        api.showSuccess(res.msg)
        wx.setStorageSync("captcha", res.captcha)
        wx.setStorageSync("mobile", mobile)
      }
    })

    function changeUserCode() {
      var c = 60;
      var intervalId = setInterval(function() {
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
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

    }

    ,
  bindName: function(e) {
    var self = this;
    self.setData({
      name: e.detail.value
    })
    self.isAllinput()
  },
  bindPhone: function(e) {
    var self = this;
    self.setData({
      phone: e.detail.value
    })
    self.isAllinput()
  },
  bindUsername: function(e) {
    var self = this;
    self.setData({
      username: e.detail.value
    })
    self.isAllinput()
  },
  bindPassword: function(e) {
    var self = this;
    self.setData({
      password: e.detail.value
    })
    self.isAllinput()
  },
  bindBrand: function(e) {
    var self = this;
    self.setData({
      brand: e.detail.value
    })
    self.isAllinput()
  },
  bindProduct: function(e) {
    var self = this;
    self.setData({
      product: e.detail.value
    })
    self.isAllinput()
  },
  bindGoodness: function(e) {
    var self = this;
    self.setData({
      goodness: e.detail.value
    })
    self.isAllinput()
  },
  bindIntroduce: function(e) {
      var self = this;
      self.setData({
        introduce: e.detail.value
      })
      self.isAllinput()
    }

    ,
  isAllinput: function() {
    var self = this;

    var username = self.data.username;
    var password = self.data.password;
    var name = self.data.name;
    var phone = self.data.phone;
    var brand = self.data.brand;
    var product = self.data.product;
    var goodness = self.data.goodness;
    var introduce = self.data.introduce;
    if (username.length > 0 && password.length > 0 && name.length > 0 &&
      phone.length > 0 && brand.length > 0 && brand.length > 0 &&
      product.length > 0 && goodness.length > 0 && introduce.length > 0) {
      console.log('满足')
      self.setData({
        issatisfy: true
      })
    } else {
      console.log('不满足')
      self.setData({
        issatisfy: false
      })
    }
  },
  formSubmit: function(e) {
      var self = this;
      console.log(e)
      var name = e.detail.value.name;
      var phone = e.detail.value.phone;
      var brand = e.detail.value.brand;
      var product = e.detail.value.product;
      var goodness = e.detail.value.goodness;
    // var captcha = e.detail.value.captcha;
      var introduce = e.detail.value.introduce;
      if (!phone || phone.length < 11 || phone[0] != 1) {
        api.showWarningText('电话号码错误!')
        return false;
      }
      var captcha = wx.getStorageSync("captcha");
      var mobile = wx.getStorageSync("mobile");
    var captcha = e.detail.value.captcha;
      var phone = e.detail.value.phone;
    // if (captcha == "") {
    //   api.showWarningText('请填写验证码!');
    //     return false;
    //   }
    // if (captcha == "" || captcha != captcha) {
    //   api.showWarningText('验证码不正确!');
    //     return false;
    //   }
    //   if (phone != mobile) {
    //     api.showWarningText('验证码错误!');
    //     return false;
    //   }

      wx.showLoading({
        title: '验证中...',
      })

      console.log(e.detail.value)
    var aid = wx.getStorageSync("aid")
      api.http('centre/brandenter', 'GET',
       {
         aid: aid,
         captcha: captcha,
         userid: e.detail.value.userid,
         name: name,
         phone: phone,
         brand: brand,
         product: product,
         goodness: goodness,
         introduce: introduce
       },
        function(res) {
          console.log(res)
          api.showWarning(res.msg)
          if (res.code == 3) {
            api.showWarningText(res.msg)

          }
          if (res.code == 2) {
            api.showWarningText(res.msg)

          }
          if (res.code == 4) {
            api.showWarningText(res.msg)

          }
          if (res.code == 0) {
            api.showWarningText(res.msg)
          } else if (res.code == 1) {
            api.showSuccess(res.msg)
            setTimeout(function() {
              wx.navigateBack({
                delta: "1"
              })
            }, 1000)
          } else {
            api.showWarningText(res.msg)
          }
        })



















    }

    ,
  backcenter: function() {
    wx.navigateBack({
      delta: "1"
    })
  },
  zaici: function() {

    var self = this;

    self.setData({
      isApplyStatus: 1
    })
  },
  fuzhiwangzhi: function(e) {
    var urls = e.currentTarget.dataset.urls;
    console.log(urls)
    wx.setClipboardData({
      data: urls,
      success: function(res) {
        api.showSuccess('复制成功');
        wx.getClipboardData({
          success: function(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  }
})
// pages/publiInforContent/publiInforContent.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    phone: "",
    title: "",
    content: "",
    issatisfy: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this;
    var opione = wx.getStorageSync("userInfomation")
    var dataion = JSON.parse(opione)
    self.setData({
      opione: dataion.phone
    })
    var loginInforMation = api.isloginStatus();
    var aid = wx.getStorageSync("aid")

    self.setData({
      isloginStatus: loginInforMation.isloginStatus,
      userid: loginInforMation.userid,
      aid: aid,
      userInfomation: loginInforMation.userInfomation
    })
    console.log(loginInforMation)


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
  formSubmit: function(e) {
    console.log(e)

    var self = this;


    var name = e.detail.value.name;
    var phone = e.detail.value.phone;
    var content = e.detail.value.content;
    var title = e.detail.value.title;
    var uid = e.detail.value.uid;

   
    
    if (name == "" || name.length <= 0) {
      api.showWarningText('请填写姓名!')
      return false;
    } else if (phone == "" || phone.length <= 0) {
      api.showWarningText('请填写联系方式!')
      return false;
    } else if (phone[0] != 1 || phone.length > 12 || phone.length < 11) {
      api.showWarningText('手机号非法!')
      return false;
    } else if (title == "" || title.length <= 0) {
      api.showWarningText('请填写标题!')
      return false;
    } else if (content == "" || content.length <= 0) {
      api.showWarningText('请填写内容!')
      return false;
    } else if (uid == "" || uid.length <= 0) {
      api.showWarningText('程序错误,请退出账号!')
      return false;
    }
    var issatisfy = self.data.issatisfy;
    console.log(issatisfy)
    if (issatisfy == false) {
      return false;
    }
    // ==============4.7 我的信息 - 发布信息===========
    wx.showLoading({
      title: '提交中...',
      mask: true
    })
    api.http('json/add_message', 'GET',
      e.detail.value,
      function(res) {
        wx.hideLoading();
        console.log(res)
        if (res.code == 1) {
          api.showSuccess(res.msg);
          setTimeout(function() {
            wx.navigateBack({
              delta: "1"
            })
          }, 800)
        } else {
          api.showWarningText(res.msg)
        }


      })
    // ==============4.7 我的信息 - 发布信息===========
  },
  bindinputname: function(e) {
    var self = this;
    self.setData({
      name: e.detail.value
    })
    self.isAllinput();
  },
  bindinputcontact: function(e) {
    var self = this;
    self.setData({
      phone: e.detail.value,
      phone: e.detail.value.replace(/[, ! @ # ￥ . % “]/g, '')
    })
    self.isAllinput();
  },
  bindinputtitle: function(e) {
    var self = this;
    self.setData({
      title: e.detail.value,
      title: e.detail.value.replace(/[, ! @ # ￥ . % “]/g, '')
    })
    self.isAllinput();
  },
  bindinputcontent: function(e) {
      var self = this;
      self.setData({
        content: e.detail.value,
        content: e.detail.value.replace(/[, ! @ # ￥ . % “]/g, '')
      })
      self.isAllinput();
    }

    ,
  isAllinput: function() {

    var self = this;
    var name = self.data.name;
    // var phone = self.data.phone;
    var title = self.data.title;
    var content = self.data.content;
    if (name.length > 0  && title.length > 0 && content.length > 0) {

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


  }

})
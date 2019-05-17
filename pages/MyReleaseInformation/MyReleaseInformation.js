// pages/MyReleaseInformation/MyReleaseInformation.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    contact: "",
    title: "",
    content: "",
    issatisfy: false,
    isBinaji:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var self = this;
    var userid = wx.getStorageSync("userid");

    self.setData({
      userid: userid
    })
    console.log(userid);
    if (options.status == 1)
   {
     console.log('编辑')
     var message = JSON.parse(options.editMessgae)
      self.setData({
        name: message.name,
        contact: message.contact,
        title: message.title,
        content: message.content,
        isBinaji:true,
        messageid:message.id
      })
      self.isAllinput();
   }
   else
   {
 
     console.log('新增')
     self.setData({
       isBinaji: false
     })
   }
   
 


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
  , bindName: function (e) {
    var self = this;
    self.setData({
      name: e.detail.value
    })
    self.isAllinput();
  }
  , bindContact: function (e) {
    var self = this;
    self.setData({
      contact: e.detail.value
    })
    self.isAllinput();
  }
  , bindTitlet: function (e) {
    var self = this;
    self.setData({
      title: e.detail.value
    })
    self.isAllinput();
  }
  , bindContent: function (e) {
    var self = this;
    self.setData({
      content: e.detail.value
    })
    self.isAllinput();
  }
  , formSubmit: function (e) {
    var self = this;
    var issatisfy = self.data.issatisfy;
    var name = self.data.name;
    var contact = self.data.contact;
    var content = self.data.content;

    var title = self.data.title;
    var userid = self.data.userid;
    var messageid = self.data.messageid;
    var isBinaji = self.data.isBinaji;//是否是编辑
    if (!issatisfy) {
      return false;
    }
    console.log(e)


    if (name == "" || name.length > 6 || !name) {
      api.showWarning('姓名不符合规范!')
      return false;
    }
    if (contact == "" || !contact || contact.length < 11 || contact[0] != 1) {
      api.showWarning('电话号码错误!')
      return false;
    }
    if (title == "" || !title) {
      api.showWarning('标题不符合规范!')
      return false;
    }
    if (content == "" || !content) {
      api.showWarning('内容不符合规范!')
      return false;
    }
    if (isBinaji ==true)
    {
      wx.showLoading({
        title: '修改中...',
        mask: true
      })
      api.http('centre/redactmessage', 'GET',
        {
          id: messageid,
          name: name,
          contact: contact,
          title: title,
          content: content
        }
        , function (res) {
          wx.hideLoading();
          console.log(res)
          if (res.code == 1) {
            api.showSuccess(res.msg)
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          }
          else {
            api.showWarning(res.msg)
          }
        })
    }
    else
    {
      wx.showLoading({
        title: '发布中...',
        mask: true
      })
      api.http('centre/messageadd', 'GET',
        {
          userid: userid,
          name: name,
          contact: contact,
          title: title,
          content: content
        }
        , function (res) {
          wx.hideLoading();
          console.log(res)
          if (res.code == 1) {
            api.showSuccess(res.msg)
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          }
          else {
            api.showWarning(res.msg)
          }
        })

    }
  








  }







  , isAllinput: function () {
    var self = this;
    var name = self.data.name;
    var contact = self.data.contact;
    var title = self.data.title;
    var content = self.data.content;
    if (name.length > 0 && contact.length > 0 && title.length > 0 && content.length > 0) {
      console.log('满足')
      self.setData({
        issatisfy: true
      })
    }
    else {
      console.log('不满足')
      self.setData({
        issatisfy: false
      })
    }
  }


})
// pages/myAddress/myAddress.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSelectAddress: 1,
    isfrisLoad: true,
    image: app.globalData.imagesUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    console.log(options)
    var self = this;
    if (options.isSelect)
    {
      self.setData({
        isSelect: options.isSelect
      })
    }
   
    wx.showLoading({
      title: '加载中...',
      mask: true
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

    var self = this;
    var userid = wx.getStorageSync("userid")
    self.setData({
      userid: userid,
    })
    api.http('centre/address', 'GET', {
      userid: userid
    }, function(res) {
      wx.hideLoading()
      console.log(res)
      if (res.code == 1) {
        self.setData({
          addresslist: res.addresslist,
           ishasData: false
        })
      }
      else
      {
        if (res.addresslist.length ==0)
        {
          self.setData({
            ishasData:true
          })
        }
      }
    })



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

  },
  setAddressClick: function(e) {

      var self = this;
      var userid = self.data.userid;
      var addressid = e.currentTarget.dataset.addressid;
      var state = e.currentTarget.dataset.addstate;
      if (state == 1) {
        return false;
      }
      wx.showLoading({
        title: '设置中...',
        mask: true
      })
      api.http('centre/updateaddress', 'GET', {
        userid: userid,
        state: state,
        addressid: addressid
      }, function(res) {
        console.log(res)
        wx.hideLoading()
        if (res.code == 1) {
          self.setData({
            addresslist: res.addresslist
          })
        }
      })




    }

    ,
  editAddress: function(e) {
    var self = this;
    var addresslist = self.data.addresslist; //我的地址列表
    var addressindex = e.currentTarget.dataset.addressindex; //我的地址索引
    console.log(addressindex)

    // ../addEditAddress / addEditAddress ? status = 1

    var nowAddress = addresslist[addressindex]; //当前的地址信息
    console.log(nowAddress)
    nowAddress = JSON.stringify(nowAddress)
    console.log(nowAddress)
    wx.navigateTo({
      url: '../addEditAddress/addEditAddress?status=2&addressinfor=' + nowAddress,
    })


  },
  deletAddress: function(e) {
    console.log('删除地址')
    var self = this;
    var userid = self.data.userid;
    var addressid = e.currentTarget.dataset.addressid;
    var addresslist = self.data.addresslist;
    var addstate = e.currentTarget.dataset.addstate;
    if (addstate == 1) {
      api.showWarningText('默认地址无法删除!');
      return false;
    }
    wx.showLoading({
      title: '删除中...',
      mask: true
    })
    api.http('centre/deladdress', 'GET', {
      userid: userid,
      addressid: addressid
    }, function(res) {

      console.log(res)
      wx.hideLoading();
      if (res.code == 1) {
        self.setData({
          addresslist: res.addresslist
        })
      }
    })



  }
  , selectBindClick:function(e){
   
   var self =this;
    var isSelect = self.data.isSelect;
    if (isSelect == 1)
    {
      return false;
    }
    var addresslist = self.data.addresslist;
    var activeindex = e.currentTarget.dataset.activeindex;
    var selectAddresslist = addresslist[activeindex];
    var province = selectAddresslist.province;
    var city = selectAddresslist.city;
    var area = selectAddresslist.area;
    var address = selectAddresslist.address;
    selectAddresslist.address = province + city + area + address
    console.log(selectAddresslist)
    let pages = getCurrentPages();//当前页面
    // 选择城市地址进行选择城市
    let prevPage = pages[pages.length - 2];//上一页面
    prevPage.setData({//直接给上移页面赋值
      address: selectAddresslist
    });
    wx.navigateBack({
      delta: 1
    })
      // 选择城市地址进行选择城市
    
 
    

  }


})
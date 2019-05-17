// pages/perInformation/perInformation.js
const app = getApp()
const api = require('../../utils/http.js');
var tcity = require("../../utils/citys.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    province: '请选择收货地址',
    isOne: false,
    image: app.globalData.imagesUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var self = this;
     console.log(options.userid)
     var userid = options.userid;
     self.setData({
       userid: userid
     })


     var isPhone = wx.getStorageSync('isPhone');
     if(isPhone)
     {
       self.setData({
         isPhone:false
       }) 
     }
     else
     {
       self.setData({
         isPhone: true
       }) 

     }
     api.http('centre/mymessage', 'GET', { userid: userid }
       , function (res) {
         self.setData({
           mymessage: res.user
         })  
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
    var self =this;
    var userid = self.data.userid;
    console.log(userid)
    if (userid)
    {
      api.http('centre/mymessage', 'GET', { userid: userid }
        , function (res) {
          console.log(res)
          self.setData({
            mymessage: res.user
          })
      })
      console.log(123)
    }
   
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

  , changeHeader:function(){
var self =this;
var userid = self.data.userid;
    var mymessage = self.data.mymessage
    console.log('修改头像')
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
     wx.showLoading({
       title: '修改中...',
       mask:true
     })
        wx.uploadFile({
          url: app.globalData.staticUrl + "centre/alterpic", //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'pic',
          header: { "content-type": "multipart/form-data" },
          formData:
            {
              userid: userid
            },
          success: function (res) {
             wx.hideLoading();
             
            var dataNew = JSON.parse(res.data)
            console.log(dataNew)
            if (dataNew.code == 1) {
              api.showSuccess('修改成功!')
              mymessage.pic = dataNew.pic
              self.setData({
                mymessage: mymessage
              })
            }

          }
        })







      }
    })

  }











































  // ========================城市连动================================

  ,
  bindChange: function (e) {

    var val = e.detail.value

    var t = this.data.values;

    var cityData = this.data.cityData;

    if (val[0] != t[0]) {

      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })

      return;
    }
    if (val[1] != t[1]) {

      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {

      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }

  },
  open: function () {


    var isOne = this.data.isOne;//获取 当前是不是第一个
    var that = this;
    var value = that.data.value;

    if (that.data.condition) {
      return false;
    }
    this.setData({
      condition: !this.data.condition
    })
    if (!isOne) {
      wx.showLoading({
        title: '数据加载中...',
      })
    }
    else {
      return false;
    }
    that.setData({
      value: value
    })

    tcity.init(that);
    var cityData = that.data.cityData;
    const provinces = [];
    const citys = [];
    const countys = [];
    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }

    for (let i = 0; i < cityData[value[0]].sub.length; i++) {
      citys.push(cityData[value[0]].sub[i].name)
    }

    for (let i = 0; i < cityData[value[0]].sub[value[1]].sub.length; i++) {
      countys.push(cityData[value[0]].sub[value[1]].sub[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': cityData[value[0]].name,
      'city': cityData[value[0]].sub[value[1]].name,
      'county': cityData[value[0]].sub[value[1]].sub[value[2]].name,
      isOne: true
    })
    wx.hideLoading();//将加载框去掉


  }
  ,
  openTrue: function () {
    var self = this;
    var value = self.data.value;
    var city = self.data.citys;
    var countys = self.data.countys;
    var userid = self.data.userid;
    self.setData({
      condition: false,
    })

    var province = self.data.province
    var city = self.data.city
    var county = self.data.county
    var address = province + city + county ;
    var mymessage = self.data.mymessage;
    console.log(address)
  wx.showLoading({
    title: '修改中...',
    mask:true
  })
    api.http('centre/myaddress', 'GET', { userid: userid, address: address }
      , function (res) {
        wx.hideLoading()
        if(res.code == 1)
        {
          api.showSuccess('修改成功!')
          mymessage.address =address;
          self.setData({
            mymessage: mymessage
          })
        }
        console.log(res)
        
      })






  }
  , catchBind: function () {

  }
  // ========================城市连动================================

})
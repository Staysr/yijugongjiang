// pages/addEditAddress/addEditAddress.js
var tcity = require("../../utils/citys.js");
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
         isDefalutAddress:2,
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
    image: app.globalData.imagesUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
   var self =this;

   var userid =wx.getStorageSync("userid")
   
   self.setData({
     userid :userid
   })
    console.log(options)

    if (options.status==1)
  {
    console.log('我是新增')
    var status = options.status;
    self.setData({
      status: status
    })
  }
  else
  {
      console.log('我是修改')
      var status = options.status;

      var nowAddress = options.addressinfor;
      var addreslist= JSON.parse(nowAddress);

      self.setData({
        status: status,
        name: addreslist.name,
        phone: addreslist.phone,
        address: addreslist.address,
        isNoClick: addreslist.state,
        isDefalutAddress: addreslist.state,
        addressid: addreslist.id,
        province: addreslist.province,
        city: addreslist.city,
        county: addreslist.area

      })
  }


  },
  verification: function (e) {
    var name = e.currentTarget.dataset.name;
    this.setData({
      [name]: e.detail.value.replace(/[, ! @ # ￥ . % “]/g, '')
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
  selectAddress:function(){

var self = this;
var isNoClick = self.data.isNoClick;
if(isNoClick == 1)
{
 return false;
}
    self.setData({
      isDefalutAddress: self.data.isDefalutAddress==1?2:1
    })

  },
  formSubmit:function(e){

    console.log('我点击保存了')
    console.log(e)
    console.log(e.detail.value)
var self =this;
    var userid = e.detail.value.userid;
    var status = self.data.status;//当前的状态
    var name = e.detail.value.name;
    var phone = e.detail.value.phone;
    var address = e.detail.value.address;
    var city = e.detail.value.city;
    var area = e.detail.value.area;
    var province = e.detail.value.province;
    var state = e.detail.value.state;
    console.log(status)
    console.log(name)
    console.log(status)
    console.log(phone)
    console.log(city)
    console.log(area)
    console.log(province)
    console.log(state)

    
    if(name=="" ||!name)
    {
      api.showWarningText('名字不能为空!')
      return false;
    }
    if (phone == "" || !phone) {
      api.showWarningText('联系电话不能为空!')
      return false;
    }
    if (phone[0]!=1 || phone.length<11) {
      api.showWarningText('联系电话输入不正确!')
      return false;
    }
    if (province == "" || !province || province=="请选择收货地址") {
      api.showWarningText('请选择收货地址!')
    }
    if (city == "" || !city) {
      api.showWarningText('请选择收货地址!')
    }
    if (address=="" || !address) {
      api.showWarningText('详细地址不能为空!')
      return false;
    }
  
    console.log(e.detail.value)
   wx.showLoading({
     title: '提交信息中...',
     mask:true
   })
   if (status== 1)
   {

    api.http('centre/addaddress', 'GET',
      e.detail.value
      , function (res) {
      console.log(res)
      wx.hideLoading();
      if(res.code==1)
      {
        api.showSuccess(res.msg)
        setTimeout(function(){
          wx.navigateBack({
            delta:"1"
          })
        },800)
      }     
    })

   }
   else
   {
     api.http('centre/alteraddress', 'GET',
       e.detail.value
       , function (res) {
         console.log(res)
         wx.hideLoading();
         if (res.code == 1) {
           api.showSuccess('修改成功')
           setTimeout(function () {
             wx.navigateBack({
               delta: "1"
             })
           }, 800)
         }
       })
   }

















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
    var that = this;
    var value = that.data.value;
    var city = that.data.citys;
    var countys = that.data.countys;
    that.setData({
      condition: false,
    })
  }
  , catchBind: function () {
  
  }
  // ========================城市连动================================


})
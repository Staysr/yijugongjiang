// pages/registerWorker/registerWorker.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths: ["", "", ""],
    // , array: ['美国', '中国', '巴西', '日本']
    isApplyStatus: 1, //1没有 申请过    2 审核状态   3 失败 
    verifyCodeTime: '获取验证码',
    buttonDisable: false,
    image: app.globalData.imagesUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var opione = wx.getStorageSync("userInfomation")
    var dataion = JSON.parse(opione)
    this.setData({
      opione: dataion.phone
    })

    if (options.type == 1) {
      this.setData({

        texfenf: "上传手持营业执照照片",
        texttype: "上传手持身份证照片",
        textfeit: "上传手持身份证照片反面",
        codetextimg: 1
      })
    } else if (options.type == 2) {
      this.setData({
        texfenf: "上传手持身份证照片反面",
        texttype: "上传手持身份证照片",
        codetextimg: 2
      })
    } else {
      this.setData({
        texfenf: "上传手持身份证照片反面",
        texttype: "上传手持身份证照片",
        codetextimg: 2
      })
    }
    var isloginStatus = wx.getStorageSync("isloginStatus");
    if (isloginStatus == "" || isloginStatus == undefined) {
      wx.redirectTo({
        url: '../registrationPage/registrationPage'
      })
      return false
    }
    console.log(options)
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var self = this;
    var userid = wx.getStorageSync("userid");
    self.setData({
      userid: userid,
      type: options.type
    })
    wx.hideLoading();
    api.http('json/schedule', 'GET', {
      uid: userid
    }, function(res) {
      console.log(res)

      if (res.state == 1) {
        self.setData({
          isApplyStatus: 2,
          texttype: "上传手持营业执照"
        })
        wx.hideLoading();
      }
      if (res.state == 2) {
        self.setData({
          isApplyStatus: 4,
          type: res.type,
          texttype: "上传手持身份证照片"
        })
        wx.hideLoading();
      }
      if (res.state == 3) {
        if (res.type == 1) {
          self.setData({
            isApplyStatus: 3,
            reject: res.reject,
            type: res.type,
            texttype: "上传手持营业执照照片",
            texfenf: "上传手持身份证照片",
            textfeit: "上传手持身份证照片反面",
            codetextimg:1
          })
        } else {
          self.setData({
            texfenf: "上传手持身份证照片反面",
            texttype: "上传手持身份证照片",
            codetextimg: 2,
            isApplyStatus: 3,
            reject: res.reject,
            type: res.type,
          })
        }

        wx.hideLoading();
      }
      if (res.state == 9){
        self.setData({
          isApplyStatus: 9,
          type: res.type,
        })
        wx.hideLoading();
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
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)


    this.setData({
      index: e.detail.value
    })

    console.log(e.detail.value)


  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  uploadAddImg: function(e) {
    var self = this;
    var tempFilePaths = self.data.tempFilePaths; //图片路径
    var activeIndex = e.currentTarget.dataset.activeindex;
    console.log(e.currentTarget)
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片   
        console.log(res)
        tempFilePaths[activeIndex] = res.tempFilePaths[0];
        self.setData({
          tempFilePaths: tempFilePaths
        })

        console.log(tempFilePaths)

      }
    })
  },

  userphone: function(e) {
    var that = this;
    that.setData({
      wx_phone: e.detail.value
    })
  },
  //请求验证码
  commes: function(e) {
    var self = this;
    var mobile = e.currentTarget.dataset.wx_phone;
    console.log(e)
    self.setData({
      buttonDisable: false
    })
    if (e.currentTarget.dataset.wx_phone == undefined) {
      api.showWarning("手机号错误")
      self.setData({
        buttonDisable: false
      })
      return false;
    }
    if (mobile[0] != 1 || mobile.length < 11) {
      api.showWarning("手机号错误")
      self.setData({
        buttonDisable: false
      })
      return false;
    }
    var aid = wx.getStorageSync("aid")
    api.http('centre/captcha_club', 'GET', {
      phone: mobile,
      aid: aid
    }, function(res) {
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
  },



  formSubmit: function(e) {
      console.log(e)
      var self = this;

      var userid = e.detail.value.userid;
      var scope = e.detail.value.scope; //服务范围
      var workyear = e.detail.value.workyear; //从业年限
      var name = e.detail.value.name; //名字
      var identity = e.detail.value.identity; //身份证号
      var native = e.detail.value.native; //籍贯
      var phone = e.detail.value.phone; //手机号
      // var cases = e.detail.value.cases;//验证码
      var type = e.detail.value.type; //类型
      var imgs = e.detail.value.imgs;
      var baseUrl = app.globalData.staticUrl //获得基本url
      var tempFilePaths = self.data.tempFilePaths;
      if (name == "" || !name) {
        api.showWarningText('名字不能为空!');
        return false;
      }
      if (scope == "" || !scope) {
        api.showWarningText('服务范围!不能为空')
        return false;
      }
      if (phone == "" || !phone) {
        api.showWarningText('手机号不能为空!')
        return false;
      }
      // if (cases == "" || !cases) {
      //   api.showWarningText('验证码不能为空!')
      //   return false;
      // }

      if (scope == "" || !scope) {
        api.showWarningText('服务范围不能为空!')
        return false;
      }

      if (workyear == "" || !workyear) {
        api.showWarningText('从业年限不能为空!');
        return false;
      }

      if (identity == "" || !identity) {
        api.showWarningText('身份证号不能为空!');
        return false;
      }
      if (native == "" || !native) {
        api.showWarningText('籍贯不能为空!');
        return false;
      }
      if (tempFilePaths[0] == "") {
        api.showWarningText('第一张图片不能为空!');
        return false;
      }
      if (type != 1) {
        console.log("我是设计师和工长")
      } else {
        if (tempFilePaths[1] == "") {
          api.showWarningText('第2张图片不能为空!');
          return false;
        }
      }

      // if (type !=1){
      //   
      // }else{
      //   if (tempFilePaths[2] == "") {
      //   api.showWarningText('第3张图片不能为空!');
      //   return false;
      //  }
      // }

      // var captcha = wx.getStorageSync("captcha");
      // var mobile = wx.getStorageSync("mobile");
      // var cases = e.detail.value.cases;
      // console.log(captcha)
      // console.log(cases)
      // console.log(phone)
      var phone = e.detail.value.phone;
      // if (cases == "") {
      //   api.showWarning('请填写验证码!'); return false;
      // }
      // if (cases == captcha) {
      //   if (phone != mobile) {
      //     api.showWarning('验证码错误!'); return false;
      //   }
      // } else {
      //   api.showWarning('验证码不正确!'); return false;

      // }

      wx.showLoading({
        title: '提交中...',
        mask: true
      })
      var aid = wx.getStorageSync("aid")
      api.http('json/apply', 'GET', {
        uid: userid,
        aid: aid,
        name: name,
        sfznum: identity,
        place: native,
        serve: scope,
        workyear: workyear,
        phone: phone,
        type: type,
        // captcha: cases
      }, function(res) {
        console.log(res)
        if (res.code == 0) {
          api.showSuccess(res.msg)
        }
        // -----------------------------------------------------------------------
        var fristbaseUrl = baseUrl + "json/applypic" //图片提交
        var applyid = res.applyid
        wx.uploadFile({
          url: fristbaseUrl, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'inhand',
          // header: {"Content-Type":"multipart/form-data"},
          header: {
            "content-type": "multipart/form-data"
          },
          formData: {
            applyid: applyid
          },
          success: function(res) {
            console.log(res)
            let data = res.data
            let dataNew = JSON.parse(data)
            console.log(data)

            if (tempFilePaths[1] == "") {
              //wx.hideLoading();
              api.showSuccess(dataNew.msg)
              setTimeout(function() {
                self.setData({
                  isApplyStatus: 2
                })
              }, 800)
              return false;
            }
            //var secondbaseUrl = baseUrl + "json/applypic"
            wx.uploadFile({
              url: fristbaseUrl, //仅为示例，非真实的接口地址
              filePath: tempFilePaths[1],
              name: 'wxcode',
              // header: {"Content-Type":"multipart/form-data"},
              header: {
                "content-type": "multipart/form-data"
              },
              formData: {
                applyid: applyid
              },
              success: function(res) {
                let data = res.data;
                let dataNew = JSON.parse(data)
                console.log(dataNew)
                if (dataNew.code == 1) {
                  if (tempFilePaths[2] == "") {
                    wx.hideLoading();
                    api.showSuccess(dataNew.msg)
                    setTimeout(function() {
                      self.setData({
                        isApplyStatus: 2
                      })
                    }, 800)
                    return false;
                  }

                  wx.uploadFile({
                    url: fristbaseUrl, //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[2],
                    name: 'head',
                    // header: {"Content-Type":"multipart/form-data"},
                    header: {
                      "content-type": "multipart/form-data"
                    },
                    formData: {
                      applyid: applyid
                    },
                    success: function(res) {
                      let data = res.data;
                      let dataNew = JSON.parse(data)
                      console.log(dataNew)
                      wx.hideLoading();
                      if (dataNew.code == 1) {
                        api.showSuccess('提交成功!')
                        setTimeout(function() {
                          self.setData({
                            isApplyStatus: 2
                          })
                        }, 600)
                      } else {
                        api.showSuccess("退出程序重新提交!")
                      }
                    }
                  })




                }


              }
            })
            //do something
          }
        })
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
    }

    ,
  otherClick: function() {

    var self = this;
    // self.setData({
    //   isApplyStatus: 1
    // })
    wx.navigateBack({
      delta: 1
    })
  }
})
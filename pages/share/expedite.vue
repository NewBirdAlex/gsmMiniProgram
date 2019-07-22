<template>
  <view class="expedite">
    <view class="top-product">
      <view>
        <image class="product-image" mode="widthFix"
               :src="detail.productImageUrl"></image>
        <view class="info">
          <view class="title">{{detail.productName}}</view>
          <!--套餐A(￥299.00)-->
          <view class="combo">寄售套餐：{{detail.packageType}}</view>
          <view class="price">寄售价格：￥{{detail.goodsPrice}}</view>
        </view>
      </view>
    </view>
    <!--<image src="http://tscebuy-img2.vzmapp.cn/tsce/common/accelerate.png" style="width: 750upx;"></image>-->

    <view class="progress-card">
      <!--<view class="first-card">-->
        <!--<image class="product-image" mode="widthFix"-->
               <!--src="http://tscebuy-img2.vzmapp.cn/upload/goods/2019/05-09/44396485_r300x240p.png"></image>-->
        <!--<view class="title">{{detail.productName}}</view>-->
      <!--</view>-->
      <view class="sub-card">
        <view class="cur-ranking">当前排名：<text>{{detail.rank}}</text></view>
        <view class="note">邀请好友授权注册/邀请好友助力获得<text>分享加速</text></view>
        <view class="progress"><view class="bar" :style="'width:'+detail.currentHelp/detail.helpCount*100+'%'"></view></view>
        <view class="progress-txt"><text>升级进度</text><text>{{detail.currentHelp}}/{{detail.helpCount}}</text></view>
        <view>
          <view class="btn" @tap="showYue = true">立即助力</view>
          <!--<view class="btn">邀请好友助力</view>-->
          <!--<button open-type="getPhoneNumber" bindgetphonenumber="getPhoneNumber"></button>-->
        </view>
      </view>
    </view>
    <!--src="https://tscebuy-mg2.vzmapp.cn/tsce_mg//member_veryCode.action?key=1559632695244"-->
    <view class="ranking">
      <view>
        <view class="title">
          <view class="line"></view>
          <view class="txt">好友加速</view>
        </view>
        <view class="subhead">共{{detail.memberCount}}位好友助力{{detail.memberHelpCount}}个助力包</view>
        <view class="list">
          <view class="list-item" v-for="(item, index) in helpList" v-bind:key="index">
            <view class="index">{{index+1}}</view>
            <!--<image src="http://tscebuy-img2.vzmapp.cn/upload/goods/2019/05-09/44396485_r300x240p.png"></image>-->
            <view class="name">{{item.mobilePhone}}</view>
            <view class="num">{{item.helpAmount}}个</view>
          </view>
        </view>
      </view>
    </view>

    <uni-popup :show='showYue' @hide='showYue=!showYue' msg=''>
      <view class="close flex-box" @tap='showYue=!showYue'>
        <uni-icon class='' type="closeempty" size='30' ></uni-icon>
      </view>
      <view class="login-form">
        <view class="form-item">
          <view class="form-label">手机号</view>
          <view class="form-input">
            <input type="number" v-model="info.mobilePhone" placeholder="请输入手机号码" value="" />
          </view>
        </view>
        <view class="form-item">
          <view class="form-label">验证码</view>
          <view class="form-input">
            <input type="text" v-model="info.imgCode" placeholder="请输入图形验证码" value="" />
            <view class="appen-solt">
              <image :src="imgCodePath" @tap="initImgCode" class="img-code"></image>
            </view>
          </view>
        </view>
        <view class="form-item">
          <view class="form-label">手机验证码</view>
          <view class="form-input">
            <input type="text" v-model="info.smsCode" placeholder="请输入手机验证码" value="" />
            <view class="appen-solt" @tap="getCode">
              <view class="smscode-btn">
                {{allowGetCode? '获取验证码':countDown+'s'}}
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="submit-btn" @tap="doSubmit">立即助力</view>
    </uni-popup>
  </view>
</template>

<script>
  import uniPopup from '@/components/uni-popup.vue'
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import {
    baseUrl as path
  } from '@/common/req.js';

  export default {
    data() {
      return {
        isSelf: true,
        orderId: '',
        detail: {},
        showYue: false,
        inputCode: '',
        info: {},
        imgCodePath: '',
        allowGetCode: true,
        countDown: 60,
        orderId: '',
        helpList: []
      };
    },
    computed: mapState([
      'memberInfo'
    ]),
    components: {uniPopup},
    onLoad(options) {
      this.initImgCode()
      this.orderId = options.id
      this.getDetail(this.orderId)
    },
    onShow() {

    },
    mounted() {

    },
    methods: {
      getDetail (id) {
        const that = this
        this.apiUrl
          .orderShareDetail({
            data: {
              goodsConsignmentId: id
            }
          })
          .then(res => {
            that.detail = res.data.data
            that.helpList = res.data.data.helpList || []
          });
      },
      getCode() {
        if (!this.allowGetCode) return;
        if (!this.info.mobilePhone) {
          uni.showToast({
            title: '请输入手机号码',
            icon: 'none',
            duration: 2000
          });
        } else if (!this.info.imgCode) {
          uni.showToast({
            title: '请输入图片验证码',
            icon: 'none',
            duration: 2000
          });
        } else {
          this.allowGetCode = false;
          this.apiUrl
            .getCode({
              data: {
                mobilePhone: this.info.mobilePhone,
                verifyCode: this.info.imgCode,
                key: this.key,
                type: 3
              }
            })
            .then(
              res => {
                if (res.data.status == 0) {
                  this.allowGetCode = true;
                  uni.showToast({
                    duration: 2000,
                    icon: 'none',
                    title: '图形验证码错误'
                  });
                  this.initImgCode();
                }
                if (res.data.status == 1) {
                  this.allowGetCode = false;
                  this.timeCountdown();
                  uni.showToast({
                    duration: 2000,
                    icon: 'none',
                    title: '验证码已发送'
                  });
                }
              },
              error => {}
            );
        }
      },
      timeCountdown() {
        if (!this.countDown) {
          this.countDown = 60;
          this.allowGetCode = true;
          return;
        }
        // this.countDown--;
        setTimeout(() => {
          this.countDown--;
          this.timeCountdown();
        }, 1000);
      },
      initImgCode() {
        this.key = new Date().getTime();
        this.imgCodePath = path + '/member_veryCode.action?key=' + this.key;
        this.info.imgCode = '';
      },
      doSubmit() {
        if (!this.info.mobilePhone) {
          uni.showToast({
            duration: 2000,
            icon: 'none',
            title: '请输入手机号码'
          });
          return;
        }
        if (!/^1[345678]\d{9}$/.test(this.info.mobilePhone)) {
          uni.showToast({
            duration: 2000,
            icon: 'none',
            title: '请输入正确的手机号码'
          });
          return;
        }
        if (!this.info.smsCode) {
          uni.showToast({
            duration: 2000,
            icon: 'none',
            title: '请输入手机验证码'
          });
          return;
        }

        // register
        this.apiUrl
          .orderHelp({
            data: {
              goodsConsignmentId: this.orderId,
              code: this.info.smsCode,
              mobilePhone: this.info.mobilePhone
            },

          })
          .then(
            res => {
              let str;
              if (res.data.status == 1) {
                uni.showToast({
                  duration: 1500,
                  icon: 'none',
                  title: '助力成功'
                });
                this.showYue = false
                this.getDetail(this.orderId)
              } else {
                uni.showToast({
                  duration: 1500,
                  icon: 'none',
                  title: res.data.message
                });
              }
            },
            err => {}
          );
      }
    }
  }
</script>

<style lang="less" scoped>
  .top-product {
    width: 750upx;
    height: 420upx;
    background: linear-gradient(315deg, rgba(255, 153, 45, 1) 0%, rgba(255, 80, 0, 1) 100%);
    border-radius: 0 0 100upx 100upx;

    > view {
      padding-top: 80upx;
      padding-left: 50upx;
      padding-right: 70upx;
    }

    .product-image {
      width: 150upx;
      float: left;
      border-radius: 9upx;
      border: 2upx solid rgba(245,245,245,1);
    }

    .info {
      margin-left: 180upx;
      color: #ffffff;

      .title {
        height: 84upx;
        font-size: 30upx;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 42upx;
        margin-bottom: 20upx;
      }

      .combo, .price {
        height: 33upx;
        font-size: 24upx;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.7);
        line-height: 33upx;
        margin-bottom: 6upx;
      }
    }
  }

  .progress-card {
    margin: -110upx auto 100upx;
    width: 670upx;
    /*height: 487upx;*/
    background: #FFFFFF;
    box-shadow: 0upx 15upx 23upx 0upx #EEEEEE;
    border-radius: 10upx;
    position: relative;
    z-index: 1;

    .first-card {
      height: 190upx;
      padding: 50upx 40upx 0;
      border-bottom: 1px solid #E5E5E5;

      image {
        float: left;
        width: 140upx;
        display: block;
        border-radius: 9upx;
        border: 2upx solid rgba(245,245,245,1);
      }

      .title {
        margin-left: 170upx;
        padding-top: 20upx;
        height: 80upx;
        font-size: 28upx;
        color: #333333;
        line-height: 40upx;
      }
    }

    .sub-card {
      padding: 50upx 40upx;
    }

    .cur-ranking {
      height: 50upx;
      font-size: 36upx;
      font-weight: 500;
      color: #333333;
      line-height: 50upx;
      margin-bottom: 12upx;

      text {
        color: #FF5909;
      }
    }

    .note {
      height: 37upx;
      font-size: 26upx;
      color: #999999;
      line-height: 37upx;
      margin-bottom: 60upx;

      text {
        color: #FF9707;
      }
    }

    .progress {
      height: 18upx;
      background: #F0F0F0;
      border-radius: 12upx;
      margin-bottom: 20upx;

      .bar {
        height: 18upx;
        background: linear-gradient(315deg, #FF992D 0%, #FF5000 100%);
        border-radius: 12upx;
      }
    }

    .progress-txt {
      height: 40upx;
      font-size: 28upx;
      font-weight: 300;
      color: #656565;
      line-height: 40upx;
      margin-bottom: 60upx;

      text:nth-child(2) {
        float: right;
      }
    }

    .btn {
      margin: 0 auto;
      width: 590upx;
      height: 90uupx;
      background: linear-gradient(303deg, rgba(255, 127, 45, 1) 0%, rgba(255, 80, 0, 1) 100%);
      box-shadow: -8upx 6upx 20upx -4upx rgba(255, 188, 146, 1);
      border-radius: 50upx;

      font-size: 34upx;
      color: #FFFFFF;
      line-height: 90upx;
      text-align: center;

      &:nth-child(2) {
        margin-top: 30upx;
        width: 588upx;
        height: 88upx;
        line-height: 88upx;
        background: #ffffff;
        box-shadow: none;

        border: 2upx solid #FF5000;
        color: #FF5000;
      }
    }
  }

  .ranking {
    .title {
      margin: 0 auto;
      width: 550upx;
      position: relative;
      margin-bottom: 14upx;

      .line {
        width: 550upx;
        height: 1px;
        background: #C2C2C2;
        position: absolute;
        left: 0;
        top: 50%;
      }

      .txt {
        text-align: center;
        width: 190upx;
        height: 53upx;
        font-size: 38upx;
        font-weight: 500;
        color: #333333;
        line-height: 53upx;
        background: #ffffff;
        margin: 0 auto;
        position: relative;
        z-index: 1;
      }
    }

    .subhead {
      height: 37upx;
      font-size: 26upx;
      color: #FF5000;
      line-height: 37upx;
      text-align: center;
      margin-bottom: 42px;
    }

    .list {
      width: 750upx;

      .list-item {
        padding: 0 80upx;
        display: flex;
        margin-bottom: 44upx;
        align-items: center;
        > view {
          color: #656565;
          font-size: 28upx;
        }
      }

      image {
        width:60upx;
        height:60upx;
        border-radius:30upx;
        display: block;
      }

      .index {
        width: 40upx;
      }

      .name {
        padding-left: 20upx;
        flex: 1;
      }
    }
  }
</style>

<style lang="less">
  .expedite {
    .uni-popup-middle {
      width: 690upx;
      height: auto;
      padding: 0;
    }

    .login-form {
      width: 600upx;
    }

    .img-code {
      display: block;
      height: 60upx;
      width: 150upx;
    }

    .smscode-btn {
      width: 160upx;
      border-radius: 6upx;
      border: 1px solid #656565;
      text-align: center;
      line-height: 50upx;
      font-size: 26upx;
      color: #656565;
    }

    .submit-btn {
      width: 600upx;
      margin-top: 40upx;
      margin-bottom: 20upx;
      height: 90upx;
      background: #FC4E29;
      border-radius: 50upx;
      line-height: 90upx;
      text-align: center;
      font-size: 36upx;
      font-weight: 400;
      color: #ffffff;
    }

    .close {
      position: absolute;
      right: 14upx;
      top: 0;
      width: 20upx;
    }
  }
</style>

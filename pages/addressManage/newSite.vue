<template>
  <div class="app">
    <div class="content-box">
      <div class="input-item">
        <text>联系人</text>
        <input class="inp" v-model="Name" placeholder="收货人姓名" />
      </div>
      <div class="input-item">
        <text>联系电话</text>
        <input class="inp" maxlength="11" type="number" v-model="Phone" placeholder="请输入联系电话" />
      </div>
      <!-- 地址三级联动 -->
      <div class="input-item">
        <text>所在地区</text>
        <input @click="addressMenuIsShow = true" class="inp el-icon-arrow-right element-icons" v-model="address" disabled placeholder="请选择所在地区" />
      </div>
      <div class="pick-top" :style="{visibility:addressMenuIsShow ? 'visible':'hidden'}" @click="cityCancel"></div>
      <div class="picker-view" :style="{visibility:addressMenuIsShow ? 'visible':'hidden'}">
        <div style="width:100%;border-bottom: 1px solid #eee;line-height:45px;font-size:18px;">
          <span style="margin:0 10px" @click="cityCancel">取消</span>
          <span style="margin:0 10px;float: right;color:#1aad19;" @click="citySure">确定</span>
        </div>
        <picker-view style="width: 100%; height: 300px;" @change="onChange" v-model="value">
          <picker-view-column>
            <p v-for="(item, index) in provinces" :key="index" class="picker-item">{{item.proName}}</p>
          </picker-view-column>
          <picker-view-column>
            <p v-for="(item, index) in citys" :key="index" class="picker-item">{{item.cityName}}</p>
          </picker-view-column>
          <picker-view-column>
            <p v-for="(item, index) in areas" :key="index" class="picker-item">{{item.disName}}</p>
          </picker-view-column>
        </picker-view>
      </div>
      <!-- end -->
      <div class="input-item">
        <text>收货地址</text>
        <input class="inp" v-model="msgSite" placeholder="请输入收货地址" />
      </div>
      <!-- <div class="input-item itemCustom ">
        <text>设为默认地址</text>
        <van-switch @click="onSwitch" custom-class="customClass" active-color="#28B5F3" :checked="checked" size="18px" />
      </div> -->
    </div>
    <div class="btn-box" @click="confirm">保存</div>
  </div>
</template>

<script>
import {memberAddress} from '@/api'

export default {
  data() {
    return {
      Name: '',
      Phone: '',
      msgSite: '',
      memberId: Megalo.getStorageSync('memberId'),
      checked: false,
      // 地址三级联动
      addressMenuIsShow: false,
      location:{
        provinces: '',
        citys: '',
        districts: ''
      },
      provinces: [],
      citys: [],
      areas: [],
      value: [1,1,1],
      temp: [0,0,0],
      address: '',
      id: ''
    }
  },
  onLoad (options) {
    this.id = options.id
    this.getData()
  },
  created () {
    this.onProvince()
  },
  methods: {
    // 选择地址
    onChange(e){
      this.temp = e.detail.value;
      this.location.provinces = this.provinces[this.temp[0]].proID;
      this.location.citys = this.citys[this.temp[1]].cityID;
      this.location.districts = this.areas[this.temp[2]].id;
    },
    // 省
    onProvince(){
      this.$request('/api/province/web/list',{},1).then(res => {
        this.provinces = res.data.list
        this.location.provinces = this.provinces[0].proID
      })
    },
    // 市
    onCity(id){
      this.$request('/api/province/web/cityList',{
        proID: id
      },1).then(res => {
        this.citys = res.data.list
        this.location.citys = this.citys[0].cityID
      })
    },
    // 区
    onDistrict(id){
      this.$request('/api/province/web/districtList',{
        cityID: id
      },1).then(res => {
        this.areas = res.data.list
        this.location.districts = this.areas[0].id
      })
    },
    // 点击地区选择取消按钮
    cityCancel: function (e) {
      this.addressMenuIsShow = false
    },
    // 点击地区选择确定按钮
    citySure: function () {
      let proName = this.provinces[this.temp[0]].proName;
      let cityName = this.citys[this.temp[1]].cityName;
      let disName = this.areas[this.temp[2]].disName;
      this.address = proName +' '+ cityName +' '+ disName;
      this.addressMenuIsShow = false;
    },
    confirm() {
      if(this.Name == '' || this.Name.length == '0'){
        Megalo.showToast({
          title: '请输入联系人',
          icon: 'none',
          duration: 2000
        })
        return;
      }else if(this.Phone == '' || this.Phone.length == '0'){
        Megalo.showToast({
          title: '请输入联系电话',
          icon: 'none',
          duration: 2000
        })
        return;
      }else if(this.address == '' || this.address.length == '0'){
        Megalo.showToast({
          title: '请选择所在地区',
          icon: 'none',
          duration: 2000
        })
        return;
      }else if(this.msgSite == '' || this.msgSite.length == '0'){
        Megalo.showToast({
          title: '请输入收货地址',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      this.$request('/api/memberAddress/add',{
        receiver: this.Name,
        phone: this.Phone,
        province: this.location.provinces,
        city: this.location.citys,
        district: this.location.districts,
        address: this.msgSite,
        memberId: this.memberId
      }).then(res => {
        if(res.data.status == '1'){
          Megalo.showToast({
            title: '地址添加成功',
            icon: 'success',
            duration: 2000
          }).then(() => {
            setTimeout(() => {
              Megalo.navigateBack({
                delta: 1
              })
            }, 2000);
          })
        }
      })
    },
    onSwitch(){
      this.checked = !this.checked;
    },
    async getData() {
      const vm = this
      const res = await memberAddress.detail({id: vm.id})
      if (res.status === '1') {
        vm.id = res.data.id;
        vm.Name = res.data.receiver,
        vm.address = res.data.districtName + ' ' + res.data.cityName + ' ' + res.data.districtName;
        vm.msgSite = res.data.address;
        vm.Phone = res.data.phone
      }
    }
  },

  watch: {
    'location.provinces': {
      handler: function() {
        this.citys = []
        this.onCity(this.location.provinces)
      },
      deep: true
    },
    'location.citys': {
      handler: function() {
        this.areas = []
        this.onDistrict(this.location.citys)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #F8F8F8;
// 三级联动
  .pick-top {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    height: 54vh;
    background-color: rgba(0, 0,0, 0.5);
    z-index: 999;
  }
  .picker-view {
    width: 100%;
    display: flex;
    z-index:12;
    background-color: #fff;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 46vh;
  }
  .picker-item {
    line-height: 35px;
    margin-left: 3px;
    margin-right: 3px;
    text-align: center;
  }
// 三级联动-end
  .el-icon-arrow-right {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .content-box {
    width: 95%;
    /*height: 100%;*/
    padding-left: 5%;
    font-size: 15px;
    background-color: #fff;
    .input-item {
      border-bottom: 1px solid #EBEBEB;
      height: 45px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .inp {
        width: 66%;
        height: 100%;
        padding-right: 4%;
      }
    }
    .itemCustom {
      width: 96%;
      padding-right: 4%;
    }
  }
  .btn-box {
    width: 275px;
    height: 45px;
    background-color: #28B5F3;
    line-height: 45px;
    text-align: center;
    color: #fff;
    font-size: 17px;
    margin: 20% auto 0;
    border-radius: 5px;
  }
}
</style>


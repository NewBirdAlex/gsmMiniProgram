<template>
	<view class="colTopBottom pageBg ">
		<view class="background-white">
			<view class="ea-list mgl20 pd20 bdb">
				<view class="left fs30">
					收货人
				</view>
				<input type="text" class="fs30" placeholder="输入收货人" v-model="consignee" />
			</view>
			<view class="ea-list mgl20 pd20 bdb">
				<view class="left fs30">
					手机号
				</view>
				<input type="text" class="fs30" placeholder="输入手机号" v-model="mobile" />
			</view>
			<view class="ea-list mgl20 pd20 bdb">
				<view class="left fs30">
					省市区
				</view>
				<view class="" style="flex:2;" @tap="showCityPicker">
					<text class="gray fs30" v-if="!zone">请选择省市区</text>
					<text class="fs30" v-else>{{zone}}</text>
				</view>
			</view>
			<view class="ea-list mgl20 pd20 bdb">
				<view class="left fs30">
					详细地址
				</view>
				<input type="text" class="fs30" placeholder="输入详细地址" v-model="address" />
			</view>
			<view class="ea-list mgl20 pd20 betweenBox">
				<view class="left fs30">
					设为默认地址
				</view>
				<switch checked @change="switchChange" />
				<!-- <view class="ligh-btn background-blue" @tap="setAsDefault=!setAsDefault" :class="{'active':setAsDefault}">
					<view class="def-circle">
						
					</view>
				</view> -->
			</view>
			
			<!-- <mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="pickerValueDefault" @onChange="onChange" @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker> -->
			<my-city-picker ref="mpvueCityPicker" :pickerValueDefault="pickerValueDefault" @onChange="onChange" @onCancel="onCancel"
			 @onConfirm="onConfirm"></my-city-picker>
		</view>
		
		<view class="ad-save-btn flex-box white fs30" @tap="editAddress">
			保存该地址
		</view>
		
	</view>
</template>

<script>
	import mpvueCityPicker from 'mpvue-citypicker';
	import myCityPicker from '@/components/myCityPicker.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				pickerValueDefault: [19, 1, 1],
				zone: '',
				setAsDefault: true,
				newAddress: true,
				consignee: '',
				mobile: '',
				isDefault: '',
				address: '',
				province: '',
				city: '',
				district: '',
				cityIds: [],
				id:null,
				allowRequest:true
			};
		},
		components: {
			mpvueCityPicker,
			myCityPicker
		},
		computed: mapState([
			'memberInfo'
		]),
		mounted() {

		},
		onLoad(e) {
			if(e.id){
				this.id = e.id
				this.getAddress()
			}
			
		},
		methods: {
			showCityPicker() {
				this.$refs.mpvueCityPicker.show();
			},
			onChange(e) {
				console.log(e);
			},
			onCancel(e) {
				console.log(e);
			},
			switchChange(e) {
				this.setAsDefault = e.detail.value
				console.log(this.setAsDefault);

			},
			onConfirm(e) {
				console.log(e);
				this.zone = e.label;
				this.cityIds = e.cityCode
			},
			getAddress() {
				this.apiUrl.getAddressById({
					data:{
						id:this.id
					}
				}).then(res=>{
					console.log(res);
					let data = res.data.data;
					this.zone = data.position;
					this.consignee=data.consignee;
					this.mobile = data.mobile;
					this.address = data.address;
					this.cityIds = [data.province,data.city,data.district]
				})
			},
			editAddress() {
				if(!this.allowRequest)  return
				this.allowRequest = false;
				uni.showLoading({
					title:'请稍候',
					mask:true
				})
				let data = {
					address: this.address,
					city: this.cityIds[1],
					consignee: this.consignee,
					district: this.cityIds[2],
					isDefault: this.setAsDefault?1:0,
					memberId: this.memberInfo.id,
					mobile: this.mobile,
					position: this.zone,
					province: this.cityIds[0]
				}
				if(!data.consignee||!data.mobile||!data.position||!data.address){
					let showdata = '';
					if(!data.address) showdata = '详细地址';
					if(!data.position) showdata = '省市区';
					if(!data.mobile) showdata = '手机号';
					if(!data.consignee) showdata = '收货人';
					uni.showToast({
						title:`${showdata}不能为空`,
						duration:2000,
						icon:'none'
					})
					return
				}
				
				if(this.id){
					data.id = this.id
				}
				this.apiUrl.submitAddress({
					data
				}).then(res=>{
					this.allowRequest = true;
					uni.hideLoading();
					if(res.data.status==1){
						uni.showToast({
							title:'保存地址成功',
							duration:2000,
							icon:'success'
						})
						setTimeout(function(){
							uni.navigateBack()
						},2000)
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.ad-save-btn {
		width: 600upx;
		height: 80upx;
		background: #FC4E29;
		border-radius: 40upx;
		margin: 60upx auto;
	}

	.ea-list {
		display: flex;
		.left {
			width: 200upx;
		}
		>input{
			flex: 2;
		}
		.ligh-btn {
			width: 80upx;
			height: 40upx;
			border-radius: 30upx;
			position: relative;

			.def-circle {
				width: 40upx;
				height: 40upx;
				transition: all 0.5s;
				position: absolute;
				left: 0;
				top: 0;
				right: auto;
			}

			&.active {
				.def-circle {
					transform: translateX(40upx);
				}
			}
		}
	}
</style>

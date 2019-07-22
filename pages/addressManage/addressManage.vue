<template>
	<view class="pageBg address-wrap">
		<view class="background-white mgt20" v-for="(item,index) in list" :key='index'>
			<view class="mgl20 pd20 bdb betweenBox">

				<view class="flex-box">
					<view class="def-circle mgr20" v-if="!item.isDefault" @tap="setDefault(index)">

					</view>
					<image src="/static/img/blue-ticket.png" v-else mode="widthFix" class="blueTicket mgr20" @tap="setDefault(index)"></image>
					<text>设为默认地址</text>
				</view>
				<view class="betweenBox op-btn">

					<view class="flex-box background-blue" @tap="goEdit(item.id)">
						编辑
					</view>
					<view class="flex-box " @tap="delAddress(item.id)">
						删除
					</view>
				</view>
			</view>
			<view class="mgl20 " @tap='useAddress(item)'>
				<view class="pd20">
					<view class="fs30 title-black">
						<text class=" name-width">{{item.consignee}}</text>
						<text class="mgl20">{{item.mobile}}</text>
					</view>
					<view class="locate">
						<image src="/static/img/locate.png" mode="widthFix" class="mgr20"></image>
						<view class="gray fs24">{{item.position+item.address}}</view>
					</view>
				</view>
			</view>
		</view>
		<navigator url="editAddress/editAddress">
			<view class="add-btn white flex-box fs30">
				新建收货地址
			</view>
		</navigator>

	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data() {
			return {
				list: []
			};
		},
		onPullDownRefresh() {
			this.getAddressList()
		    setTimeout( ()=>{
				 uni.stopPullDownRefresh();
		    }, 1000);
		},
		onLoad() {

		},
		onShow() {
			console.log(this.memberInfo);
			this.getAddressList()
		},
		computed: mapState([
			'memberInfo',
			'activeAddress'
		]),
		methods: {
			useAddress(address) {
				//save address
				uni.setStorage({
					data: address,
					key: 'activeAddress',
					success: (e) => {
						this.$store.commit('saveAddress', address)
						uni.navigateBack()
					}
				})
			},
			getAddressList() {
				this.apiUrl.getAddressList({
					data: {
						memberId: this.memberInfo.id
					}
				}).then(res => {
					if (res.data.status == 1) this.list = res.data.data

				})
			},
			goEdit(id) {
				uni.navigateTo({
					url: '/pages/addressManage/editAddress/editAddress?id=' + id
				})
			},
			setDefault(index) {
				var arr = this.list;
				if (!arr[index].isDefault) {

					this.apiUrl.submitAddress({
						data: {
							id: arr[index].id,
							isDefault: 1,
							address: arr[index].address,
							city: arr[index].city,
							consignee: arr[index].consignee,
							district: arr[index].district,
							mobile: arr[index].mobile,
							position: arr[index].position,
							province: arr[index].province
						}
					}).then(res => {
						if (res.data.status == 1) {
							arr.forEach(item => item.isDefault = 0);
							arr[index].isDefault = 1;
							this.list = arr;
						}
					})
				}
			},
			delAddress(id) {
				uni.showModal({
					title: '提示',
					content: '确定删除该地址吗',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							this.apiUrl.delAddressById({
								data: {
									id
								}
							}).then(res => {
								console.log(id);
								if (res.data.status == 1) {
									if(this.activeAddress && this.activeAddress.id == id){
										this.$store.commit('delAddress');
									}
									uni.showToast({
										title: '删除成功',
										duration: 2000
									})
									this.getAddressList();
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			}
		}
	}
</script>

<style lang="less" scoped>
	.blueTicket {
		width: 30upx;
	}

	.address-wrap {
		padding-bottom: 100upx;
	}

	.add-btn {
		height: 100upx;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background: #FC4E29;
	}

	.op-btn {
		>view {
			width: 120upx;
			height: 50upx;
			background-color: #f83434;
			border-radius: 25upx;
			border: solid 1upx #f83434;
			color: white;
			margin-right: 20upx;

			&:first-child {
				background: #388ceb;
				border: solid 1upx #388ceb;
			}
		}
	}

	.name-width {
		width: 150upx;
		display: inline-block;
	}

	.locate {
		display: flex;

		image {
			width: 22upx;
			margin-top: 10upx;
		}

		>view {
			width: 560upx;
		}
	}
</style>

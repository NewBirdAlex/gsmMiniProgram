<template>
	<view class="pageBg">
		<view class="pd20 betweenBox fs30 background-white bdb">
			<view class="w200 fs30 title-black">头像</view>
			<view class="flex-box">
				<view class="head-circle" @tap="uploadHead">
					<image :src="imgUrl" v-if="imgUrl" mode="widthFix" class="w100"></image>
					<image src="/static/img/logoGsp.png" v-else mode="widthFix" class="w100"></image>

				</view>
			</view>
		</view>
		<navigator url="../change-nickname/change-nickname">
			<view class="pd20 betweenBox fs30 background-white bdb">
				<view class="w200 fs30 title-black">昵称</view>
				<view class="flex-box">
					{{memberInfo.userName}}
					<image src="../../../static/img/rightArrow.png" mode="widthFix" class="ps-icon mgl20"></image>
				</view>
			</view>
		</navigator>

		<view class="pd20 betweenBox fs30 background-white bdb">
			<view class="w200 fs30 title-black">手机号码</view>
			<view class="">
				{{memberInfo.mobilePhone}}
			</view>
		</view>
		<!-- <view class=" mgt40 blue-btn">
			13352083254
		</view> -->
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {baseUrl} from '@/common/req.js'

	export default {
		data() {
			return {
				imgUrl:''
			};
		},
		computed: mapState([
			'memberInfo'
		]),
		onShow() {
			this.$store.dispatch('getMemberInfo');
		},
		onLoad(){
			this.imgUrl = this.memberInfo.logo
		},
		methods: {
			uploadHead() {
				uni.chooseImage({
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						uni.uploadFile({
							url: baseUrl+'/upload_uploadAjaxFile.action', //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							success: (res) => {
								console.log(this.imgUrl);
								let obj = JSON.parse(res.data)
								if(obj.status==1){
									this.imgUrl = obj.url;
									this.editUserHeadImg()
								}
							}
						});
					}
				});
			},
			editUserHeadImg(){
				this.apiUrl.editMemberInfo({
					data:{
						id:this.memberInfo.id,
						logo:this.imgUrl
					}
				}).then(res=>{
					if(res.data.status ==1){
						uni.showToast({
							title:'修改头像成功',
							icon:'success',
							duration:2000
						})
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.head-circle {
		width: 120upx;
		height: 120upx;
		border-radius: 50%;
		overflow: hidden;
		image{
			border-radius: 50%;
			width: 120upx;
			height: 120upx!important;
		}
	}

	.ps-icon {
		width: 16upx;
	}
</style>

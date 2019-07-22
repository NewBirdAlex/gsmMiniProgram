<template>
	<view class="pageBg relative sc_wrap">
		<view class="wrap_w" style="z-index: 199;background-color: #f5f5f5;" @tap="previewImage">
			<view class="warp">
				<view>
					<image class="bg" v-if="staticImgResource" :src="staticImgResource+'common/picshare2.png'" ></image>
				</view>
				<view class="info">
					<text>用户ID：{{ shareData.autoId }}</text>
					<text>昵称：{{ shareData.userName || shareData.mobilePhone}}</text>
					<view class="code">
						<image class="" :src="shareData.qrCode"></image>
						<view class="gray tac">
							长按识别二维码
						</view>
					</view>
					
				</view>
				
			</view>
		</view>
		<view class="wrap_w" style="top: -2000px;">
			<canvas  canvas-id="shareImg" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }" ></canvas>
		</view>
		
	</view>
</template>

<script>
import { baseUrl,staticImgResource } from '@/common/req.js';
export default {
	data() {
		return {
			shareData: {},
			canvasWidth: '300',
			canvasHeight: '400',
			preImage: null,
			staticImgResource:staticImgResource
		};
	},
	onPullDownRefresh() {
		this.getCode();
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	onLoad() {
		// this.bg = baseUrl + 'common/background.png';
		this.getCode();
		// this.forwardMiniProgram();
	},
	// onShareAppMessage(res) {
	// 	return {
	// 		title: this.shareData.userName + '的分享码',
	// 		imageUrl: this.shareData.qrCode
	// 	};
	// },
	methods: {
		previewImage() {
			// #ifdef MP-WEIXIN
			uni.previewImage({
				current: [this.preImage], // 当前显示图片的http链接
				urls: [this.preImage] // 需要预览的图片http链接列表
			});
			// #endif
		},
		shareCartImg() {
			let that = this;
			wx.getSystemInfo({
				success: function(res) {
					that.canvasWidth = res.windowWidth*2;
					that.canvasHeight = res.windowHeight*2;
				}
			});
			let imageUrl = this.staticImgResource+'common/picshare2.png';
			console.log(imageUrl);
			uni.getImageInfo({
				src: imageUrl, //服务器返回的图片地址
				success: function(res) {
					//res.path是网络图片的本地地址
					let proImagePath = res.path;
					// 画布
					const ctx = uni.createCanvasContext('shareImg');
					ctx.setFillStyle('white');
					ctx.fillRect(0, 0, that.canvasWidth, that.canvasHeight);
					ctx.drawImage(proImagePath, (that.canvasWidth - 600) / 2, 30, 600, 780);
					ctx.setFillStyle('black');
					ctx.setFontSize(30);
					ctx.fillText('用户Id:' + that.shareData.autoId, 80, 900);
					let Name = that.shareData.userName||that.shareData.mobilePhone;
					ctx.fillText('昵称:' +Name , 80, 970);
					// ctx.drawImage(that.shareData.qrCode, (that.canvasWidth - 100) / 2, 460, 90, 90)
					uni.getImageInfo({
						src: that.shareData.qrCode,
						success: function(data) {
							ctx.setFillStyle('white');
							ctx.fillRect(that.canvasWidth-100-280, 680, 280, 280);
							ctx.drawImage(data.path, that.canvasWidth-100-260, 700, 240, 240);
							ctx.setFontSize(30);
							ctx.setFillStyle('black');
							ctx.fillText('长按识别二维码', that.canvasWidth-100-260, 980);
							ctx.draw(true);
							setTimeout(function() {
								uni.canvasToTempFilePath({
									x: 0,
									y: 0,
									width: that.canvasWidth,
									height: that.canvasHeight,
									destWidth: that.canvasWidth,
									destHeight: that.canvasHeight,
									canvasId: 'shareImg',
									success: function(res) {
										console.log(res);
										that.preImage = res.tempFilePath;
									},
									fail: function(res) {
										console.log(res);
									}
								});
							}, 200);
						}
					});
				},
				fail: function(res) {
					//失败回调
				}
			});
		},
		getCode() {
			uni.showLoading({
				title:'生成中，请稍后'
			})
			this.apiUrl.getShareCode({ data: {} }).then(res => {
				uni.hideLoading();
				if (res.data.status == 1) {
					this.shareData = res.data.data;
					// #ifdef MP-WEIXIN
					this.shareCartImg();
					// #endif
				}
			});
		},
		drawImg() {}
	}
};
</script>

<style lang="less" scoped>
.sc_wrap{
	// overflow: hidden;
	height: 100vh;
}
.notice{
	position: absolute;
	bottom: 10%;
	left: 50%;
	transform: translateX(-50%);
}
.wrap_w{
	// position: absolute;
	left: 0;
	top: 0px;
	padding-top: 40upx;
	width: 100%;
	min-height: 100vh;
}
.warp {
	width: 600upx;
	background: rgba(255, 255, 255, 1);
	border-radius: 30upx;
	overflow: hidden;
	margin: 0 auto 0;
	padding-bottom: 40upx;
}
.bg {
	width: 600upx;
	height: 780upx;
	display: block;
}
.info {
	padding: 45upx 10upx;
	height: 100upx;
	position: relative;
	.code {
		position: absolute;
		top: -50%;
		right: 10upx;
		padding: 20upx;
		border-radius: 20upx;
		background: white;
		image{
			width: 200upx;
			height: 200upx;
		}
	}
	text {
		position: relative;
		top: 10upx;
		display: block;
		margin-left: 30upx;
		color: #656565;
		font-size: 28upx;
		line-height: 40upx;
	}
}

</style>

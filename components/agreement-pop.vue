<template>
	<view class="ap"v-if="showIt">
		<view class="uni-mask"  :style="{top:offsetTop + 'px'}" @tap="hide"></view>
		<view :class="['uni-popup','uni-popup-middle','big']"  >
			<view class="pp-wrap pdl20 pdr20 w100">
				<view class="fs36 tac">
					<text v-if="type==2">寄售协议</text>
					<text v-if="type==4">零售协议</text>
					<text v-if="type==5">批发协议</text>
					
				</view>
				<scroll-view scroll-y class="content pdl20">
					<view class="fs24 pd20 mgt20" v-if="agreement" v-html="agreement.content">
					</view>
				</scroll-view>
				<view class="btns betweenBox mgt20">
					<view class="btn flex-box" @tap="goBack">
						不同意
					</view>
					<view class="btn flex-box" @tap="makeDeal">
						同意该协议
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			
			type: {
				type: [String,Number],
				//top - 顶部， middle - 居中, bottom - 底部
				default: 2
			},
			msg: {
				type: String,
				default: ""
			}
		},
		data() {
			let offsetTop = 0;
			//#ifdef H5
			offsetTop = 44;
			//#endif
			return {
				offsetTop: offsetTop,
				agreement:null,
				showIt:true
			}
		},
		mounted(){
			this.initAgreement();
			this.getAgreement();
		},
		onLoad() {
		},
		methods: {
			initAgreement(){

				if(this.type==2){
					uni.getStorage({
						key:'consigmentAgreement',
						success: () => {
							this.showIt = false;
						},
						fail: () => {
							this.showIt = true;
						}
					})	
				}
				if(this.type==4){
					uni.getStorage({
						key:'retailAgreement',
						success: () => {
							this.showIt = false;
						}
					})	
				}
				if(this.type==5){
					uni.getStorage({
						key:'wholesaleAgreement',
						success: () => {
							this.showIt = false;
						}
					})	
				}
			},
			getAgreement(){
				this.apiUrl.getRegisterAgreement({data:{
					type:this.type
				}}).then(res=>{
					res.data.status==1?this.agreement = res.data.data:''
				})
			},
			hide: function() {
				this.$emit('hidePopup');
			},
			makeDeal(){
				let str;
				if(this.type ==2) str = 'consigmentAgreement';
				if(this.type ==4) str = 'retailAgreement';
				if(this.type ==5) str = 'wholesaleAgreement';
				uni.setStorage({
					key:str,
					data:true,
					success: (res) => {
						this.showIt = false;
					}
				})
			},
			goBack(){
				if(this.type ==4||this.type==5){
					uni.switchTab({
						url:'/pages/index/index'
					})
				}else{
					uni.navigateBack()
				}
			},
		}
	}
</script>
<style lang="less" scoped>
	.big{
		width: 86%!important;
		height:70%!important;
		z-index: 1000;
	}
	.ap {
		position: fixed;
		z-index: 998;
		top: 0;
		width: 100%;
		height: 100%;
		left: 0;
		background-color: rgba(0, 0, 0, .5);
	}
	.uni-mask {
		position: fixed;
		z-index: 998;
		top: 0;
		width: 100%;
		height: 100%;
		left: 0;
		background-color: rgba(0, 0, 0, .5);
	}

	.uni-popup {
		position: absolute;
		z-index: 999;
		background-color: #ffffff;
		box-shadow: 0 0 30upx rgba(0, 0, 0, .1);
	}

	.uni-popup-middle {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 380upx;
		height: 380upx;
		border-radius: 10upx;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		justify-content: center;
		padding: 30upx;
	}

	.uni-popup-top {
		top: 0;
		left: 0;
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
	}

	.uni-popup-bottom {
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
	}
	.pp-wrap{
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		.content{
			height: 80%;
			overflow-y: scroll;
			border:1px solid rgba(147,147,147,1);
			 border-radius:10upx;
		}
		.btns{
			.btn{
				width:300upx;
				height:70upx;
				background:rgba(255,255,255,1);
				border:2upx solid rgba(56,140,235,1);
				border-radius:35upx;
				&:last-child{
					background:rgba(61,147,245,1);
					color: white;
				}
			}
		}
	}
</style>

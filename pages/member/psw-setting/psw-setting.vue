<template>
	<view class="pageBg">
		<navigator url="../change-psw/change-psw">
			<view class="background-white betweenBox pd20 bdb mgt20 fs30">
				修改登录密码
				<image src="../../../static/img/rightArrow.png" class="ps-icon" mode="widthFix"></image>
			</view>	
		</navigator>
		<navigator url="../change-safepsw/change-safepsw">
			<view class="background-white betweenBox pd20 fs30">
				修改支付密码
				<image src="../../../static/img/rightArrow.png" class="ps-icon" mode="widthFix"></image>
			</view>	
		</navigator>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="less">
.ps-icon{
	width: 16upx;
}
</style>

<template>
	<view class="nodata tac">
		<image src="/static/img/noData.png" mode="widthFix"></image>
		<view class="tac pd20">
			暂无数据
		</view>
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

<style lang="less" scoped>
.nodata{
	color: #B2B2B2;
	margin-top: 40upx;
	image{
		width: 220upx;
	}
}
</style>

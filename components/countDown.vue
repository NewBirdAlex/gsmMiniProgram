<template>
	<view class="cdWrap">
		<view class="cd-left">
			零售区
		</view>
		<view class="cd-middle">
			距结束还有
			<uni-countdown font-color="#FFFFFF" bgr-color="#000000" timer="2018-12-23 12:00:00"></uni-countdown>
		</view>
		<view class="cd-right">
			<uni-icon type="home" color="#ff9e5c"  size="22"></uni-icon>
		</view>
	</view>
</template>

<script>
	import uniCountdown from './uni-countdown.vue'
	export default {
		data() {
			return {
				
			};
		},
		components: {uniCountdown}
	}
</script>



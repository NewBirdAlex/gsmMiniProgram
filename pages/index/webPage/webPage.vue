<template>
	<view>
		<web-view  :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		onLoad(e) {
			this.url = e.url;
		},
		data() {
			return {
				url:''
			};
		}
	}
</script>

<style lang="less">

</style>

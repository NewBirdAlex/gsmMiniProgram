<script>
export default {
	onLaunch: function() {
		console.log('App Launch');
		this.$store.dispatch('getSystemInfo');
	},
	onShow: function() {
		// console.log('App Show')
		//init address  and member
		this.$store.commit('saveStorageMember');
	},
	onHide: function() {
		// console.log('App Hide')
	}
};
</script>

<style lang="less">
/*每个页面公共css */
@import './common/uni.css';
@import './common/common.less';

</style>

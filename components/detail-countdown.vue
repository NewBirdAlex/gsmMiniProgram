<template name="detail-countdown">
	<view class="betweenBox pd20" style="width: 100%;">
		<view class="flex-box">距{{ hasStart ? '结束' : '开始' }}还有</view>
		<view class="uni-countdown flex-box">
			<view class="uni-countdown-numbers" :style="{ borderColor: borderColor, color: fontColor, background: bgrColor }">{{ h }}</view>
			<view class="uni-countdown-splitor" :style="{ color: splitorColor }">:</view>
			<view class="uni-countdown-numbers" :style="{ borderColor: borderColor, color: fontColor, background: bgrColor }">{{ i }}</view>
			<view class="uni-countdown-splitor" :style="{ color: splitorColor }">:</view>
			<view class="uni-countdown-numbers" :style="{ borderColor: borderColor, color: fontColor, background: bgrColor }">{{ s }}</view>
		</view>
	</view>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
export default {
	name: 'uni-countdown',
	props: {
		bgrColor: {
			type: String,
			default: '#FFFFFF'
		},
		borderColor: {
			type: String,
			default: '#000000'
		},
		fontColor: {
			type: String,
			value: '#000000'
		},
		splitorColor: {
			type: String,
			default: '#000000'
		},
		timer: {
			type: [String, Number],
			default: ''
		},
		startTime: {
			type: [String, Number],
			default: ''
		},
		endTime: {
			type: [String, Number],
			default: ''
		},
		inProduct: {
			type: Boolean,
			default: false
		},
		now:{
			type: [String, Number],
			default: ''
		}
	},
	computed: mapState(['systemInfo']),
	data() {
		return {
			setTime: null,
			d: '00',
			h: '00',
			i: '00',
			s: '00',
			leftTime: 0,
			hasStart: true,
			gameOver: false,
			currentTime: 0
		};
	},
	created: function(e) {
		this.currentTime = this.now;
		this.countDown(this);
		this.setInterValFunc(this);
	},
	beforeDestroy() {
		clearInterval(this.setTime);
	},
	methods: {
		setInterValFunc: function(obj) {
			this.setTime = setInterval(function() {
				obj.countDown(obj);
			}, 1000);
		},
		countDown: function(self) {
			this.currentTime += 1000;
			let leftTime;
			if (this.startTime - this.currentTime >= 0) {
				//unstart
				leftTime = this.startTime - this.currentTime ;
				this.hasStart = false;
			} else if (this.endTime - this.currentTime >= 0) {
				//ing
				leftTime = this.endTime - this.currentTime;
				this.hasStart = true;
			} else {
				//end
				this.gameOver = true;
				clearInterval(this.setTime);
				this.$emit('activeOver');
				return;
			}
			if (leftTime > 0) {
				var hours = parseInt(leftTime / 1000 / 60 / 60, 10);
				var minutes = parseInt((leftTime / 1000 / 60) % 60, 10);
				var seconds = parseInt((leftTime / 1000 % 60), 10);
			} else {
				var hours = 0,
					minutes = 0,
					seconds = 0;
				return;
			}
			if (hours < 10) {
				hours = '0' + hours;
			}
			if (minutes < 10) {
				minutes = '0' + minutes;
			}
			if (seconds < 10) {
				seconds = '0' + seconds;
			}
			self.h = hours;
			self.i = minutes;
			self.s = seconds;
		}
	}
};
</script>
<style scoped>
.inblock {
	display: flex;
}
.uni-countdown {
	display: flex;
	padding: 2upx 0;
	flex-wrap: nowrap;
	justify-content: center;
}

.uni-countdown-splitor {
	width: auto !important;
	justify-content: center;
	line-height: 44upx;
	padding: 0 5upx;
}

.uni-countdown-numbers {
	line-height: 44upx;
	width: auto !important;
	padding: 0 10upx;
	justify-content: center;
	height: 44upx;
	border-radius: 8upx;
	margin: 0 5upx;
	border: 1px solid #000000;
	font-size: 26upx;
}
</style>

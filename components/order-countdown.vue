<template>
	<view style="display: inline;" v-if="timeEnd">({{ i }}:{{ s }})</view>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
export default {
	name: 'uni-countdown',
	props: {
		timer: {
			type: [String, Number],
			default: 0
		},
		orderType: {
			type: [String, Number],
			default: 2
		},
		currentTime: {
			type: [String, Number],
			default: 0
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
			timeEnd: true,
			timeGap: null
		};
	},
	created: function(e) {
		clearInterval(this.setTime);
		this.timeGap = this.initTimeGap();
		this.leftTime = this.timeGap - (this.currentTime - this.timer);
		if (this.leftTime <= 0) {
			this.timeEnd = false;
			this.$emit('activeOver');
		} else {
			this.countDown(this);
			this.setInterValFunc(this);
		}
	},
	onShow() {
		clearInterval(this.setTime);
		this.timeGap = this.initTimeGap();
		this.leftTime = this.timeGap - (this.currentTime - this.timer);
		if (this.leftTime <= 0) {
			this.timeEnd = false;
			this.$emit('activeOver');
		} else {
			this.countDown(this);
			this.setInterValFunc(this);
		}
	},
	onLoad() {},
	onHide() {
		clearInterval(this.setTime);
	},
	methods: {
		initTimeGap() {
			if (this.orderType == 0) {
				return this.systemInfo.resaleTimeLimit * 60 * 1000;
			} else if (this.orderType == 1) {
				return this.systemInfo.wholesaleTimeLimit * 60 * 1000;
			} else if (this.orderType == 2) {
				return this.systemInfo.generalTimeLimit * 60 * 1000;
			}
		},
		setInterValFunc: function(obj) {
			this.setTime = setInterval(function() {
				obj.countDown(obj);
			}, 1000);
		},
		countDown: function(self) {
			this.leftTime -= 1000;
			if (this.leftTime < 0) {
				this.timeEnd = false;
				clearInterval(this.setTime);
				this.$emit('activeOver');
				return;
			}
			var leftTime = this.leftTime;
			if (leftTime > 0) {
				var hours = parseInt(leftTime / 1000 / 60 / 60, 10);
				var minutes = parseInt((leftTime / 1000 / 60) % 60, 10);
				var seconds = parseInt((leftTime / 1000) % 60, 10);
				var days = '';
			}
			if (hours < 10) {
				hours = '0' + hours;
			} else if (hours >= 24) {
				days = parseInt(hours / 24, 10);
				hours = parseInt(hours % 24, 10);
			}
			if (minutes < 10) {
				minutes = '0' + minutes;
			}
			if (seconds < 10) {
				seconds = '0' + seconds;
			}
			self.d = days;
			self.h = hours;
			self.i = minutes;
			self.s = seconds;
		}
	}
};
</script>

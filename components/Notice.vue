<template>
	<view class="noticeWrap pd20" >
		<view class="img ">
			<image src="/static/img/notice.png" mode="widthFix" class="w100"></image>
		</view>
		<view class="word gray" >
			<view class="content" >
				<text class="every" decode="true" :style="{left:'-'+announNum+'px'}">{{noteList[0].content}}</text>
				<!-- <text class="every" decode="true" :style="{left:'-'+announNum+'px'}">{{announ}}</text> -->
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				announ: 'start',
				announNum: 0,
				announy: 280,
				announZf: '-',
				timer:null
			};
		},
		props: {
			noteList: {
				type: Array,
				default: null
			}
		},
		onLoad() {
			// #ifdef MP-WEIXIN
			setTimeout(()=>this.startAnimation(),1000)
			// #endif
		},
		created(){
				// #ifdef H5
				setTimeout(()=>this.startAnimation(),1000)
				// #endif
		},
		onShow(){
			setTimeout(()=>this.startAnimation(),1000)
		},
		onHide() {
			clearInterval(this.timer)
		},
		methods: {
			
			startAnimation() {
				clearInterval(this.timer)
				let self = this;
				let query = uni.createSelectorQuery();
				query.select('.content').boundingClientRect(ContentRes => {
					uni.createSelectorQuery().select('.every').boundingClientRect(TextRes => {
						if(!TextRes) return
						let maxContentWidth = ContentRes.width,
							maxTextWidth = TextRes.width+30;
						this.timer = setInterval(() => {
							if (self.announZf == '-') {
								if (self.announNum < maxTextWidth) {
									self.announNum += 2
								} else {
									self.announNum = 0
								}
							}
						}, 50)
					}).exec();
				}).exec();
			}
		}
	}
</script>

<style lang="less" scoped>
	.content{
		position: relative;
		.every{
			position: absolute;
			left: 0;
			top: 0;
			white-space: nowrap;

		}
	}
	.noticeWrap {
		display: flex;
		background:rgba(242,242,242,1);
		border-radius:10upx;
		.img {
			width: 80upx;
			margin-right: 20upx;

			image {
				float: left;
			}
		}

		.word {
			flex: 1;

			view {
				width: 100%;
				height: 38upx;
				overflow: hidden;
			}
		}
	}

	.swiper-item {
		height: 100%;
	}
</style>

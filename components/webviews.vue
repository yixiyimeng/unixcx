<template>
	<view>
		<uni-nav-bar :title="title" leftIcon='back'></uni-nav-bar>
		<scroll-view scroll-y="true" class="scroll-Y" :style="{ height: scrollhight + 'px' }">
			<web-view :src="weburl"></web-view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollhight:200,
				statusBarHeight:0
			};
		},
		props:{
			title:{
				type:String,
				default:'世纪祭祀'
			},
			weburl:{
				type:String,
				default:''
			}
		},
		created() {
			let that = this;
			that.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			uni.getSystemInfo({
				success: function(res) {
					that.offsetTop = 44 + that.statusBarHeight;
					that.scrollhight = res.windowHeight - that.offsetTop;
				}
			});
		}
	}
</script>

<style>

</style>

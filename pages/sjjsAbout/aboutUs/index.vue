<template>
	<view>
		<webviews weburl='https://www.sjjs99.com/XCXApi/WebView/aboutus' :title="title"></webviews>
	</view>
</template>

<script>
import webviews from '@/components/webviews.vue';
export default {
	data() {
		return {
			title: '关于我们',
			};
	},
	components:{
		webviews
	}

};
</script>

<style></style>

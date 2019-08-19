<template>
	<view class="content">
		<uni-nav-bar :title="title">
			<template slot="left">
				<!-- 地址 -->
				<view class="location" @click="switchCity" v-if="HomeData.NewMsg <= 0">
					<image mode="widthFix" src="/static/images/address-icon.png" />
					{{ cityName }}
				</view>
				<!-- 未读消息提醒 -->
				<navigator hover-class="none" url="/pages/home/news/index" class="noReadMsg" v-if="HomeData.NewMsg > 0"><image src="/static/images/noReadMsg.png" /></navigator>
			</template>
		</uni-nav-bar>
		<!-- search -->

		<view class="searchWrap" :style="{top:(statusBarHeight+44)+'px'}">
			<navigator hover-class="none" url="/pages/sjjsAbout/searchResult" class="searchBox">
				<image src="/static/images/searchHui.png" />
				输入关键字搜索
			</navigator>
		</view>
		<div :style="{ height: scrollhight + 'px', top: offsetTop + 'px' }" class="wrap">
			<mescroll-uni :down="downOption" :up="upOption" @down="downCallback" @up="upCallback" :fixed="false" @init="mescrollInit">
				<!-- swiper -->
				<view class="swiper">
					<swiper
						style="height:100%"
						autoplay="ture"
						interval="3000"
						duration="500"
						indicator-dots="true"
						indicator-active-color="#ffcc00"
						indicator-color="#fff"
						circular="true"
					>
						<swiper-item>
							<navigator hover-class="none" v-for="(item, index) in HomeData.Banner" :key="index" :url="item.url">
								<image :src="item.Img" class="slide-image" />
							</navigator>
						</swiper-item>
					</swiper>
				</view>
				<!-- 菜单 -->
				<view class="menu">
					<navigator :url="item.url" v-for="(item, index) in HomeData.BigButton" :key="index" hover-class="none" class="menu-item">
						<view class="menu_img"><image mode="widthFix" :src="item.img" class="slide-image" /></view>
						<view class="menu-tit">{{ item.title }}</view>
					</navigator>
				</view>
				<!-- 黄历 -->
				<view class="today_info">
					<view class="date">
						<image mode="widthFix" src="/static/images/calendar_bg.png" />
						<view class="d">{{ intMont }}</view>
						<view class="m">{{ englistMont }}</view>
					</view>
					<view class="info">
						<view class="tit">{{ HuangliInfo.date }}</view>
						<view class="lc">{{ HuangliInfo.lunar_year }} {{ HuangliInfo.lunar_month }} {{ HuangliInfo.lunar_day }}</view>
						<view class="good">
							<view>宜</view>
							{{ HuangliInfo.jishenyiqu }}
						</view>
						<view class="bad">
							<view>忌</view>
							{{ HuangliInfo.xiongshen }}
						</view>
					</view>
				</view>
				<!-- 推荐新闻 -->
				<navigator
					class="newsBox"
					:url="`/pages/sjjsAbout/news/details?id=${HomeData.ImgNews[0].Id}`"
					hover-class="none"
					v-if="HomeData.ImgNews && HomeData.ImgNews.length > 0"
				>
					<view class="left_img"><image mode="widthFix" :src="HomeData.ImgNews[0].Img" /></view>
					<view class="newsRightInfo">
						<view class="news-title">{{ HomeData.ImgNews[0].Title }}</view>
						<view class="news-time">{{ HomeData.ImgNews[0].time }}</view>
					</view>
				</navigator>
				<!-- 滚动消息 -->
				<view class="uni-swiper-msg " v-if="HomeData.News && HomeData.News.length > 0">
					<view class="uni-swiper-msg-icon"><image src="/static/images/horn.png" mode="widthFix"></image></view>
					<swiper vertical="true" autoplay="true" circular="true" interval="3000" class="flex-1">
						<swiper-item v-for="(item, index) in HomeData.News" :key="index">
							<navigator class="section" wx:key="key" url="`/pages/sjjsAbout/news/details?id=${item.Id}`" hover-class="none">{{ item.Title }}</navigator>
						</swiper-item>
					</swiper>
				</view>
				<!-- <null-data v-if="cemetery_list.length<=0"></null-data> -->
				<!-- 墓园列表 -->
				<div class="list"><cemetery-info :cemetery-item="item" v-for="(item, index) in cemetery_list" :key="index"></cemetery-info></div>
			</mescroll-uni>
		</div>
		<mpvue-picker
			:themeColor="themeColor"
			ref="mpvuePicker"
			:mode="mode"
			:deepLength="deepLength"
			:pickerValueDefault="pickerValueDefault"
			@onConfirm="onConfirm"
			@onCancel="onCancel"
			:pickerValueArray="pickerValueArray"
		></mpvue-picker>
	</view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import cemeteryInfo from '@/components/cemeteryInfo.vue';
import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue';
import nullData from '@/components/nullData.vue';
import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
import cityData from '@/common/city.data.js';
import { postData } from '@/api/index';
export default {
	data() {
		return {
			title: '首页',
			HomeData: {},
			intMont: new Date().getMonth() + 1,
			englistMont: new Date().toDateString().split(' ')[1],
			HuangliInfo: {},
			currentCityCode: '',
			provinceName: '',
			cityName: '武汉',
			page: 1,
			PageSize: 10,
			cemetery_list: [],
			downOption: {
				use: false,
				auto: true //是否在初始化后,自动执行下拉回调callback; 默认true
			},
			upOption: {
				noMoreSize: 1,
				page: {
					num: 0,
					size: 10
				}
			},
			scrollhight: 200,
			dataList: [],
			offsetTop: 0,
			themeColor: '#007AFF',
			pickerValueDefault: [0, 0],
			pickerValueArray: cityData,
			mode: 'multiLinkageSelector',
			deepLength: 2,
			mescroll: null,
					statusBarHeight:0};
	},
	components: {
		uniNavBar,
		cemeteryInfo,
		MescrollUni,
		nullData,
		mpvuePicker
	},
	onLoad() {
		let that = this;
		that.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
		uni.getSystemInfo({
			success: function(res) {
				that.offsetTop = (res.windowWidth * 100) / 750 + 44 + that.statusBarHeight;
				that.scrollhight = res.windowHeight - that.offsetTop;
			}
		});
		var Token = uni.getStorageSync('Token');
		var user = uni.getStorageSync('userInfo');
		if (!Token || !user) {
			// 获取信息失败，重新授权
			uni.navigateTo({
				url: '/pages/authority/authority'
			});
		}
		var addressData = uni.getStorageSync('addressData');
		// 默认为沈阳市
		if (!addressData) {
			uni.setStorageSync('addressData', { provinceNmae: '辽宁省', provinceCode: '210000', cityName: '沈阳市', cityCode: '210100' });
			addressData = uni.getStorageSync('addressData');
		}
		this.currentCityCode = addressData.cityCode;
		this.provinceName = addressData.provinceNmae;
		this.cityName = addressData.cityName;
		/* 查询首页信息 */
		this.GetHomeData();
		/* 查询黄历 */
		this.getHuangli();
		/* 查询墓园列表 */
		//this.getCemeteryList(0,10);
	},
	methods: {
		switchCity() {
			/* 切换城市 */
			this.pickerValueArray = cityData;
			this.mode = 'multiLinkageSelector';
			this.deepLength = 2;
			this.pickerValueDefault = [0, 0];
			this.$refs.mpvuePicker.show();
		},
		// 请求首页数据
		GetHomeData: function() {
			var Token = uni.getStorageSync('Token');
			var data = {
				Token: Token
			};
			postData(data, 'GetHomeData', res => {
				this.HomeData = res.data.Data;
			});
		},
		// 获取黄历信息
		getHuangli: function() {
			let data = {};
			postData(data, 'GetCalendar', res => {
				this.HuangliInfo = res.data.Data;
			});
		},
		// 获取墓园列表
		getCemeteryList: function(page, PageSize, successCallback, errorCallback) {
			console.log(page);
			var that = this;
			var Token = uni.getStorageSync('Token');
			var addressData = uni.getStorageSync('addressData');
			var data = {
				Token: Token,
				Province: addressData.provinceCode,
				City: addressData.cityCode,
				Area: 0,
				Keyword: '',
				Page: page,
				PageSize: PageSize,
				Djs: '0'
			};
			//console.log(data)
			postData(
				data,
				'GetAllCemetery',
				res => {
					console.log(res.data);
					var list = [];
					if (res.data.List && res.data.List.length > 0) {
						list = res.data.List;
					}
					//联网成功的回调
					successCallback && successCallback(list, res.data.Total);
				},
				() => {
					errorCallback && errorCallback();
				}
			);
		},
		/*下拉刷新的回调 */
		downCallback(mescroll) {
			this.getCemeteryList(
				1,
				10,
				(curPageData, totalSize) => {
					mescroll.endBySize(curPageData.length, totalSize);
					//mescroll.endSuccess();
					//设置列表数据
					this.cemetery_list = curPageData;
				},
				() => {
					//联网失败的回调,隐藏下拉刷新的状态
					mescroll.endErr();
				}
			);
		},
		/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
		upCallback(mescroll) {
			//联网加载数据
			this.getCemeteryList(
				mescroll.num,
				mescroll.size,
				(curPageData, totalSize) => {
					mescroll.endBySize(curPageData.length, totalSize); //必传参数(当前页的数据个数, 总数据量)
					//设置列表数据
					this.cemetery_list = this.cemetery_list.concat(curPageData);
				},
				() => {
					//联网失败的回调,隐藏下拉刷新的状态
					mescroll.endErr();
				}
			);
		},
		onCancel(e) {
			console.log(e);
		},
		onConfirm(e) {
			console.log(e);
			this.currentCityCode = e.value[1];
			this.provinceName = e.label.split('-')[0];
			this.cityName = e.label.split('-')[1];
			uni.setStorageSync('addressData', { provinceNmae: this.provinceName, provinceCode: e.value[0], cityName: this.cityName, cityCode: this.currentCityCode });
			this.cemetery_list = [];
			this.mescroll.scrollTo(0, 100);
			this.mescroll.resetUpScroll(false);
		},
		mescrollInit(mescroll) {
			this.mescroll = mescroll;
		},
		//获取省市信息
		getCityInfo: function() {
			// 判断是否有本地存储，如果有，则使用本地存储，如果没有则通过接口获取
			var cityArea_data = uni.getStorageSync('cityArea');
			if (cityArea_data) {
				// this.setData({
				//   'areaData': cityArea_data,
				//   citys: cityArea_data[0].cities
				// });
				return;
			}
			var data = {
				level: 2
			};
			postData(data, 'GetAreaDataList', res => {
				// this.setData({
				//   areaData: res.data.Data,
				// });
				uni.setStorageSync('cityArea', res.data.Data);
			});
		}
	}
};
</script>

<style>
page {
	height: 100%;
	overflow: hidden;
	position: relative;
}
.location {
	font-size: 28upx;
	color: #fff;
	min-width: 300upx;
	display: block;
	line-height: 44px;
}
.location image {
	width: 25upx;
	height: 33upx;
	margin: 28upx 10upx 0 30upx;
	float: left;
}
.searchBox image,
.noReadMsg image {
	width: 40upx;
	height: 40upx;
	margin: 20upx 10upx 20upx 0;
	vertical-align: middle;
}
.noReadMsg {
	animation: msgShow 1.5s infinite;
}
.noReadMsg image {
	width: 40rpx;
	height: 40rpx;
	margin: 0 30upx;
}
@keyframes msgShow {
	0% {
		opacity: 1;
	}
	50% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
.searchWrap {
	background: #789eeb;
	padding: 10upx 30upx;
	position: fixed;
	left: 0;
	top: calc(var(--status-bar-height)+44px);
	right: 0;
	z-index: 99;
}
.searchBox {
	width: 690upx;
	overflow: hidden;
	height: 80upx;
	box-sizing: border-box;
	padding: 0 30upx;
	font-size: 28upx;
	line-height: 80upx;
	background-color: #fff;
	border-radius: 10upx;
	color: #a8a8a8;
	display: block;
}
.wrap {
	position: absolute;
	left: 0;
	right: 0;
}
.swiper {
	height: 360upx;
	width: 690upx;
	margin: 30upx 30upx 0;
	border-radius: 10upx;
	overflow: hidden;
}

.swiper uni-navigator,.swiper image {
	width: 100%;
	height: 100%;
	display: block;
	border-radius: 10upx;
}
.menu {
	overflow: hidden;
	box-sizing: border-box;
	padding: 30upx;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}
.menu .menu-item {
	width: 100upx;
	/* float:left; */
	height: 140upx;
	font-size: 30upx;
	color: #666;
	text-align: center;
	border-radius: 10upx;
	box-sizing: border-box;
	margin-right: 47.5upx;
}
.menu .menu-item:nth-child(5n) {
	margin-right: 0;
}
.menu .menu_img {
	width: 90upx;
	height: 90upx;
	box-sizing: border-box;
	margin: 0 auto;
}
.menu_img image {
	width: 100%;
	height: 90upx;
}
.menu-tit {
	height: 40upx;
	line-height: 52upx;
	width: 100%;
	box-sizing: border-box;
	font-size: 24upx;
}
.today_info {
	width: 690rpx;
	height: 150rpx;
	margin: 0 30rpx;
	box-shadow: 5rpx 10rpx 30rpx #ecf2fe, 10rpx -5rpx 1rpx #f1f5fe, -10rpx 5rpx 5rpx #f1f5fe, -5rpx -1rpx 5rpx #f7f9fe;
	border-radius: 5rpx;
	box-sizing: border-box;
	padding: 15rpx 30rpx;
}
.date {
	width: 110rpx;
	height: 120rpx;
	box-sizing: border-box;
	position: relative;
	float: left;
}
.date image {
	width: 100%;
	height: 120rpx;
	box-sizing: border-box;
}
.date .d,
.date .m {
	position: absolute;
}
.date .d {
	font-size: 40rpx;
	color: #fff;
	top: 35rpx;
	left: 0;
	text-align: center;
	width: 100%;
	font-weight: bold;
}
.date .m {
	font-size: 24rpx;
	color: #fff;
	top: 80rpx;
	left: 0;
	text-align: center;
	width: 100%;
}
.today_info .info {
	float: right;
	width: 520rpx;
	height: 110rpx;
	box-sizing: border-box;
	padding-left: 30rpx;
	overflow: hidden;
}
.today_info .info .tit {
	font-size: 24rpx;
	color: #000;
	font-weight: bold;
	width: 30%;
	box-sizing: border-box;
	float: left;
	height: 45rpx;
	line-height: 45rpx;
}
.today_info .info .lc {
	width: 70%;
	float: right;
	font-size: 24rpx;
	height: 45rpx;
	line-height: 45rpx;
}
.good,
.bad {
	font-size: 24rpx;
	color: #000;
	width: 100%;
	line-height: 35rpx;
	height: 35rpx;
	overflow: hidden;
}
.good view,
.bad view {
	color: #58a83f;
	display: inline-block;
	padding-right: 10rpx;
	font-size: 24rpx;
}
.bad view {
	color: #ff6868;
}
.newsBox {
	width: 100%;
	padding: 30rpx;
	box-sizing: border-box;
	overflow: hidden;
}
.newsBox .left_img {
	width: 160rpx;
	height: 120rpx;
	overflow: hidden;
	float: left;
	background: #e5e5e5;
}
.newsBox .left_img image {
	width: 160rpx;
	height: 120rpx;
}
.newsBox .newsRightInfo {
	width: 530rpx;
	padding-left: 20rpx;
	box-sizing: border-box;
	float: right;
}
.newsBox .news-title {
	font-size: 24rpx;
	color: #000;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	height: 72rpx;
	line-height: 36rpx;
}
.newsBox .news-time {
	height: 36rpx;
	line-height: 36rpx;
	font-size: 24rpx;
	color: #789eeb;
	margin-top: 10rpx;
}
.uni-swiper-msg {
	background: #fffbef;
	padding: 0 30upx;
	font-size: 24upx;
	color: #7f7f7f;
	height: 60upx;
}
.uni-swiper-msg .uni-swiper-msg-icon {
	margin-top: 10upx;
}
.uni-swiper-msg .section {
	line-height: 60upx;
}
.list {
	padding: 0 30upx;
}
</style>

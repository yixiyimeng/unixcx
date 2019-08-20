<template>
	<view>
		<uni-nav-bar :title="title" leftIcon='back'>
		</uni-nav-bar>
		<scroll-view scroll-x="true" class="nav" :style="{top:(statusBarHeight+44)+'px'}">
			<view v-for="(item,index) in sortList" :key="index" :class="nowSortId==item.Id?'selection':''" class="navitem"
			 @click="switchNav(item.Id)" :id="item.Id">{{item.Title}}</view>
		</scroll-view>
		<!-- 子分类栏 -->
		<view class="childNav" v-if="nowChildSortList&&nowChildSortList.length>0" :style="{ top: offsetTop + 'px' }">
			<view v-for="(item,index) in nowChildSortList" v-if="index<3" :key="index" class="childnav" :class="item.Id==nowSortId?'childNavSelect':''"
			 @click="switchNav(item.Id)" :id="item.Id">
				{{item.Title}}
			</view>
			<view class="MoreButton" @click="MoreChild">更多<view class="sanjiao"></view>
			</view>
		</view>
		<!-- 子分类更多 -->
		<view class="childNavMore" v-if="nowChildSortList&&nowChildSortList.length>0&& openChildMore" :style="{ top: (offsetTop+120*scale) + 'px' }">
			<view v-for="(item,index) in nowChildSortList" :key="key" class="childnav" :class="item.Id==nowSortId?'childNavMoreSelected':''"
			 @click="switchNav(item.Id)" :id="item.Id">{{item.Title}}</view>
		</view>
		<view v-if="nowChildSortList&&nowChildSortList.length>0&& openChildMore" :style="{ top: offsetTop + 'px' }" class="uni-mask" />
		<div :style="{ height: scrollhight + 'px', top: (nowChildSortList&&nowChildSortList.length>0&& openChildMore?(offsetTop+120*scale):offsetTop) + 'px' }"
		 class="wrap">
			<mescroll-uni :down="downOption" :up="upOption" @down="downCallback" @up="upCallback" :fixed="false" @init="mescrollInit">
				<navigator class="newsBox" url="`/pages/sjjsAbout/news/details?id=${item.id}`" hover-class="none" v-for="(item,index) in newsList"
				 :key="index" :id="item.id">
					<view class="left_img" v-if="item.images">
						<image mode="widthFix" :src="item.images" />
					</view>
					<view class="leftNewsText" v-else>讯</view>
					<view class="newsRightInfo" v-if="item.images">
						<view class="news-title">{{item.title}}</view>
						<view class="news-cont">{{item.cont}}</view>
						<view class="news-time">{{item.time}}</view>
					</view>
					<view class="newsRightBox" v-else>
						<view class="news-title">{{item.title}}</view>
						<view class="news-time">{{item.time}}</view>
					</view>
				</navigator>
			</mescroll-uni>
		</div>
	</view>
</template>

<script>
	import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue';
	import {
		postData
	} from '@/api/index';
	export default {
		components: {
			MescrollUni
		},
		data() {
			return {
				title: '世纪资讯',
				nowSortId: 0,
				sortList: [],
				nowChildSortList: [],
				type: 1,
				PID: '',
				statusBarHeight: 0,
				offsetTop: 0,
				scrollhight: 200,
				cemetery_id: '',
				newsList: [],
				openChildMore: false,
				downOption: {
					use: false,
					auto: false //是否在初始化后,自动执行下拉回调callback; 默认true
				},
				upOption: {
					auto: false,
					noMoreSize: 1,
					page: {
						num: 0,
						size: 10
					}
				},
				mescroll: null,
				scale: .5
			};
		},
		created() {
			let that = this;
			that.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			uni.getSystemInfo({
				success: function(res) {
					this.scale = res.windowWidth / 750;
					that.offsetTop = (res.windowWidth * 80) / 750 + 44 + that.statusBarHeight;
					that.scrollhight = res.windowHeight - that.offsetTop;
				}
			});
		},
		onLoad: function(options) {
			console.log(options);
			var id = options.id;
			if (id) {
				var type = 2;
			} else {
				var type = 1;
				var id = 0;
			}
			this.type = type;
			this.PID = options.PID ? options.PID : '';
			this.cemetery_id = id;
			// 获取资讯分类
			this.getNewsSort();
		},
		methods: {
			getNewsSort: function() {
				var Token = uni.getStorageSync('Token');
				var data = {
					Token: Token,
				};
				if (this.type == 1) {
					data.PID = 6;
					if (this.PID) {
						data.PID = this.PID;
					}
				} else {
					data.PID = 152;
				}
				postData(data, 'GetCategoryList', res => {
					this.sortList = res.data.List;
					this.nowSortId = res.data.List[0].Id;
					this.title = res.data.Title;
					this.mescroll.resetUpScroll(false);
				})
			},
			// 获取资讯列表
			getNewsList: function(page, PageSize, successCallback, errorCallback) {
				var Token = uni.getStorageSync('Token');
				var datas = {
					Token: Token,
					Category: this.nowSortId,
					Keyword: '',
					Page: page,
					PageSize: PageSize,
					Img: -1,
					CID: this.cemetery_id
				}
				postData(datas, 'GetNewsList', res => {
						var list = [];
						if (res.data.List && res.data.List.length > 0) {
							list = res.data.List;
						}
						//联网成功的回调
						successCallback && successCallback(list, res.data.Total);
					},
					() => {
						errorCallback && errorCallback();
					})
			},
			switchNav(id) {
				this.nowSortId = id;
				this.openChildMore = false
				// 判断该分类是否有子分类
				var ifHaveId = 0;
				for (var i in this.sortList) {
					if (this.sortList[i].Id == this.nowSortId) {
						if (this.sortList[i].Child.length > 0) {
							this.nowChildSortList = this.sortList[i].Child
						} else {
							this.nowChildSortList = []
						}
						break;
					}
				}
				this.mescroll.scrollTo(0, 100);
				this.mescroll.resetUpScroll(false);
			},
			MoreChild() {
				this.openChildMore = !this.openChildMore
			},
			/*下拉刷新的回调 */
			downCallback(mescroll) {
				console.log('kaishi')
				this.getNewsList(
					1,
					10,
					(curPageData, totalSize) => {
						mescroll.endBySize(curPageData.length, totalSize);
						//mescroll.endSuccess();
						//设置列表数据
						this.newsList = curPageData;
					},
					() => {
						//联网失败的回调,隐藏下拉刷新的状态
						mescroll.endErr();
					}
				);
			},
			/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
			upCallback(mescroll) {
				console.log('2333kaishi')
				//联网加载数据
				this.getNewsList(
					mescroll.num,
					mescroll.size,
					(curPageData, totalSize) => {
						mescroll.endBySize(curPageData.length, totalSize); //必传参数(当前页的数据个数, 总数据量)
						//设置列表数据
						if(mescroll.num==1){
							this.newsList = curPageData
						}else{
						this.newsList = this.newsList.concat(curPageData);
						}
					},
					() => {
						//联网失败的回调,隐藏下拉刷新的状态
						mescroll.endErr();
					}
				);
			},
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
		}
	}
</script>

<style>
	.wrap {
		position: absolute;
		left: 0;
		right: 0;
	}



	.nav {
		width: 100%;
		height: 80rpx;
		border-bottom: 1px solid #ccc;
		box-sizing: border-box;
		padding: 0 3%;
		background: #789eeb;
		/* display: flex;
  flex-direction:row ;
  justify-content:space-around; */
		position: absolute;
		left: 0;
		right: 0;
		z-index: 9;
		white-space: nowrap;
	}

	.nav .navitem {
		display: inline-block;
		width: 25%;
	}

	.childNav {
		height: 120rpx;
		background: #f8f8f8;
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx 3%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;
		position: fixed;
		left: 0;
		right: 0;
		top: 200rpx;
		z-index: 9999
	}

	.childNavMore {
		background: #fff;
		width: 100%;
		box-sizing: border-box;
		padding: 30rpx 3%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;
		position: fixed;
		left: 0;
		right: 0;
		top: 320rpx;
		z-index: 9999
	}

	.nav view,
	.childNav view,
	.childNavMore view {
		text-align: center;
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
		color: #e5e5e5;
		/* margin-right: 20rpx; */
	}

	.childNav>view,
	.childNavMore view {
		padding: 0 25rpx;
	}

	.childNavMore view {
		margin: 0 10upx;
	}

	.childNav .childNavSelect {
		background-color: #ebeff7;
		border-radius: 8rpx;
		color: #5786e7;

	}

	.childNavMore .childNavMoreSelected {
		background-color: #fff0f0;
		color: #ff6868;
		font-weight: bold;
	}

	.childNav view {
		color: #999;
	}

	.childNav .MoreButton {
		position: absolute;
		width: 100rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		color: #5786e7;
		top: 20rpx;
		right: 0rpx;
		font-weight: bold;
		text-align: left;
		padding: 0;
	}

	.MoreButton .sanjiao {
		width: 0;
		height: 0;
		border-left: 10rpx solid transparent;
		border-right: 10rpx solid transparent;
		border-top: 15rpx solid #5786e7;
		position: absolute;
		right: 0;
		top: 35rpx;
	}

	.nav .selection,
	.childNav .selection {
		color: #fff;
	}

	.selection::after {
		content: ' ';
		width: 50%;
		height: 4rpx;
		background-color: #fff;
		position: relative;
		bottom: 4rpx;
		left: 25%;
		display: block;
	}

	.childNavMore view {
		padding: 0 25rpx;
		background: #ebeff7;
		color: #999;
		border-radius: 8rpx;
		margin-bottom: 20rpx;
	}

	.zzc {
		width: 100%;
		height: 100%;
		background: rgba(000, 000, 000, 0.3);
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 3;
	}

	.content {
		box-sizing: border-box;
	}

	.newsBox {
		width: 100%;
		box-sizing: border-box;
		overflow: hidden;
		padding: 30rpx;
		border-bottom: 1px solid #e5e5e5;
	}

	.left_img {
		width: 140rpx;
		height: 140rpx;
		overflow: hidden;
		float: left;
		background: #e5e5e5;
		box-sizing: border-box;
		border: 1rpx solid #e5e5e5;

	}

	.left_img image {
		display: block;
		width: 100%;
		height: 100%;
	}

	.leftNewsText {
		width: 80rpx;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		background: #789eeb;
		color: #fff;
		border-radius: 50%;
		font-size: 45rpx;
		float: left;
	}

	.newsRightInfo {
		width: 550rpx;
		padding-left: 20rpx;
		float: right;
		box-sizing: border-box;
	}

	.newsRightBox {
		width: 610rpx;
		padding-left: 20rpx;
		float: right;
		box-sizing: border-box;
	}

	.news-title {
		font-size: 28rpx;
		color: #000;
		overflow: hidden;
		line-height: 36rpx;
		height: 36rpx;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.news-time {
		height: 36rpx;
		line-height: 36rpx;
		font-size: 20rpx;
		color: #999;
		margin-top: 10rpx;
	}

	.news-cont {
		font-size: 24rpx;
		color: #999;
		line-height: 36rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
</style>

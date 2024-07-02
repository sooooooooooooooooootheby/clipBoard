<template>
	<div class="file">
		<div class="nav">
			<span class="title">
				<svg class="icon" aria-hidden="true">
					<use xlink:href="#bookmark"></use>
				</svg>
				<span>文件夹</span>
			</span>
			<div class="buttonNav">
				<input type="file" id="file" name="file" v-on:change="onFile" />
				<label for="file">
					<span class="brand">
						<svg class="icon" aria-hidden="true">
							<use xlink:href="#upload"></use>
						</svg>
						<p>上传</p>
					</span>
				</label>
			</div>
		</div>
		<div class="content">
			<ul>
				<li v-for="item in listData" :key="item.id">
					<div class="time">
						<div>
							<span>NO.{{ item.id }}</span
							>{{ item.formattedDate }} {{ item.formattedTime }}
						</div>
						<div class="dot"></div>
					</div>
					<div class="info">
						<span class="name">{{ item.fileName }}</span>
						<span class="size">{{ item.fileSize }}</span>
					</div>
					<div class="buttonNav">
						<button class="warn" @click="onDownload(item.id, item.fileName)">下载</button>
						<button class="brand" @click="deleteFile(item.id)">删除</button>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { fileStore } from "@/stores/file.js";
import autolog from "autolog.js";
import axios from "axios";

export default {
	data() {
		const file = fileStore();
		return {
			handleFile: file,

			listData: [],
			autologOutTime: 2500,
		};
	},
	methods: {
		// 获取所有的file
		async getFileList() {
			try {
				await this.handleFile.getFileList();
				this.handleData(this.handleFile.fileListData);
			} catch (error) {
				console.error(error);
			}
		},
		// 上传文件
		onFile(event) {
			const file = event.target.files[0];

			let formdata = new FormData();
			formdata.append("file", file);

			let requestOptions = {
				method: "POST",
				body: formdata,
				redirect: "follow",
			};

			fetch("http://47.100.101.113:8080/api/files/upload", requestOptions)
				.then((response) => response.text())
				.then((result) => {
					autolog.log("上传成功", "success", this.autologOutTime);
					this.getFileList();
				})
				.catch((error) => autolog.log("上传失败", "error", this.autologOutTime));
		},
		// 删除指定的file
		async deleteFile(id) {
			try {
				await this.handleFile.deleteFile({ id: id });
				if (this.handleFile.state) {
					for (let i = 0; i < this.listData.length; i++) {
						if (this.listData[i].id === id) {
							this.listData.splice(i, 1);
						}
					}
				}
				this.handleFile.state = false;
			} catch (error) {
				console.error(error);
			}
		},
		// 下载文件
		onDownload(id, filename) {
			this.handleFile.downloadFile({ id: id, filename: filename });
		},
		// 格式化时间
		handleTime(time) {
			// 解析时间字符串
			const date = new Date(time);

			// 获取月日时分
			const month = date.toLocaleDateString("en-us", { month: "long" });
			const day = date.getDate();
			const hour = date.getHours();
			const minutes = date.getMinutes();

			// 格式化小时和分钟
			const formattedHours = hour.toString().padStart(2, "0");
			const formattedMinutes = minutes.toString().padStart(2, "0");

			// 判断AM or PM
			const period = hour >= 12 ? "PM" : "AM";

			// 格式化后的时间字符串
			const formattedDate = `${month} ${day}`;
			const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;
			return { formattedDate, formattedTime };
		},
		// 格式化文件大小
		handleSize(size) {
			let num = 1024;
			if (size < num) {
				return size + "B";
			}
			if (size < Math.pow(num, 2)) {
				return (size / num).toFixed(2) + "KB";
			}
			if (size < Math.pow(num, 3)) {
				return (size / Math.pow(num, 2)).toFixed(2) + "MB";
			}
			if (size < Math.pow(num, 4)) {
				return (size / Math.pow(num, 3)).toFixed(2) + "GB";
			}
			return (size / Math.pow(num, 4)).toFixed(2) + "TB";
		},
		// 处理列表数据
		handleData(listData) {
			this.listData = [];
			for (let i = 0; i < listData.length; i++) {
				// 格式化时间并添加到数组中
				const { formattedDate, formattedTime } = this.handleTime(listData[i].createdAt);
				listData[i].formattedDate = formattedDate;
				listData[i].formattedTime = formattedTime;
				// 格式化名字并添加到数组中
				const fileName = listData[i].filePath.substring(listData[i].filePath.lastIndexOf("/") + 1);
				listData[i].fileName = fileName;
				// 格式化文件大小并添加到数组中
				let fileSize = this.handleSize(listData[i].fileSize);
				listData[i].fileSize = fileSize;

				this.listData.push(listData[i]);
			}
		},
	},
	mounted() {
		this.getFileList();
	},
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/components/file.scss";
</style>

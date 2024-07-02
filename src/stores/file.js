import { defineStore } from "pinia";
import axios from "axios";
import autolog from "autolog.js";
const autologOutTime = 2500;

export const fileStore = defineStore({
	id: "file",
	store: () => {
		return {
			fileListData: [],
			state: false,
		};
	},
	actions: {
		// 获取所有的file
		async getFileList() {
			try {
				const res = await axios.get("/files");
				if (res.data.length === 0) {
					return autolog.log("文件列表为空", autologOutTime);
				}
				this.fileListData = res.data;
			} catch (error) {
				console.log(error);
			}
		},
		// 删除指定的file
		async deleteFile({ id }) {
			try {
				const res = await axios.delete(`/files/${id}`);
				autolog.log("删除成功", "success", autologOutTime);
				this.state = true;
			} catch (error) {
				console.log(error);
				autolog.log("删除失败", "error", autologOutTime);
			}
		},
		downloadFile({ id, filename }) {
			axios({
				url: `http://47.100.101.113:8080/api/files/download/${id}`,
				method: "get",
				responseType: "blob",
			})
				.then((response) => {
					let data = response.data;
					if (!data) {
						return console.log(1);
					}
					const url = window.URL.createObjectURL(new Blob([data]));
					const link = document.createElement("a");
					link.href = url;
					link.setAttribute("download", filename);
					document.body.appendChild(link);
					link.click();
					autolog.log("下载成功", "success", autologOutTime);
					document.body.removeChild(link);
					window.URL.revokeObjectURL(url);
				})
				.catch((error) => {
					autolog.log("下载失败", "error", autologOutTime);
				});
		},
	},
});

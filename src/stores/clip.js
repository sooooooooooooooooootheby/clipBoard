import { defineStore } from "pinia";
import axios from "axios";
import autolog from "autolog.js";
const autologOutTime = 2500;

export const clipStore = defineStore({
	id: "clip",
	store: () => {
		return {
			clipListData: null,
		};
	},
	actions: {
		// 获取所有的clipboard
		async getClipboard() {
			try {
				const res = await axios.get("/clipboard");
				this.clipListData = res.data;
			} catch (error) {
				console.log(error);
			}
		},
		// 创建一个新的clipboard
		async createClipboard({ content }) {
			const currentTime = new Date().toISOString();

			try {
				const res = await axios.post("/clipboard", {
					content,
					createdAt: currentTime,
				});
				autolog.log("保存成功", "success", autologOutTime);
			} catch (error) {
				console.log(error);
				autolog.log("保存失败", "error", autologOutTime);
			}
		},
		// 更新clipboard
		async updateClipboard({ id, content }) {
			try {
				const res = await axios.put(`/clipboard/${id}`, {
					content,
				});
				autolog.log("保存成功", "success", autologOutTime);
			} catch (error) {
				console.log(error);
				autolog.log("保存失败", "error", autologOutTime);
			}
		},
		// 删除clipboard
		async deleteClipboard({ id }) {
			try {
				const res = await axios.delete(`/clipboard/${id}`);
				autolog.log("删除成功", "success", autologOutTime);
			} catch (error) {
				console.log(error);
				autolog.log("删除失败", "error", autologOutTime);
			}
		},
	},
});

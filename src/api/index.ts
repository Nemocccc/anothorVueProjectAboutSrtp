import http from "../utils/request";
import { defineComponent, inject } from 'vue';
import { Ref } from '@vue/runtime-core';

export default defineComponent({
  setup() {
    const uploadedFiles = inject('uploadedFiles') as Ref<{ [key: string]: File }>;

    const uploadAndPredict = async (type: string) => {
      const file = uploadedFiles.value[type];

      if (!file) {
        console.error(`No ${type} file provided!`);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        if (type === 'mat') {
          await http.post('/predict', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } else if (type === 'bdf') {
          await http.post('/uploader', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
    
    const getFileUrl = async () => {
      try {
        const response = await http.get('/download_processed', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer token'
          },
        });// 'download_processed'是请求后端的路径
        return response.data.url;
      } catch (error) {
        console.error(`Error in getting file URL: ${error}`);
      }
    };

    const downloadFile = async (url: string) => {
      window.location.href = url;
    };

    const show_raw = () => {
      return http.get('/show_raw', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token'
        },
      }).catch((e) => {});  //第一个参数是请求后端的路径
    };

    const process_and_show = () => {
      return http.get('/process_and_show', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token'
        },
      }).catch((e) => {});  //第一个参数是请求后端的路径
    };

    return {
      uploadAndPredict,
      show_raw,
      process_and_show,
      getFileUrl,
      downloadFile
    };
  },
});
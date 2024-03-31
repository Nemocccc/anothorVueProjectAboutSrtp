import Mock from 'mockjs'
import Predict from './mockServerData/predict'
import uploader from './mockServerData/uploader'
import download_processed from './mockServerData/download_processed'
import process_and_show from './mockServerData/process_and_show'
import show_raw from './mockServerData/show_raw'

//定义mock请求拦截
Mock.mock('/ip/predict', 'post', Predict.results);
Mock.mock('/ip/uploader', 'post', uploader);
Mock.mock('/ip/download_processed', 'get', download_processed);
Mock.mock('/ip/process_and_show', 'get', process_and_show);
Mock.mock('/ip/show_raw', 'get', show_raw);
import http from "../utils/request";


// 请求数据接口
export const getData = () => {
    return http.get('/data');  //第一个参数是请求后端的路径
}
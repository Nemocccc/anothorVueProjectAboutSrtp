import http from "../utils/request";


// 请求数据接口
export const results = () => {
    return http.post('/predict', {
        text: "这是一段测试文本-results"
    })
    .catch((e) => {console.log(e.toJSON())});  //第一个参数是请求后端的路径
}

export const uploader = () => {
    return http.post('/uploader', {
        file: 's01.pdf'
    }).catch((e) => {});  //第一个参数是请求后端的路径
}

export const download_processed = () => {
    return http.get('/download_processed')
    // .then((response) => {console.log(response)})
    .catch((e) => {console.log(e.toJSON())}); 
}

export const show_raw = () => {
    return http.get('/show_raw').catch((e) => {});  //第一个参数是请求后端的路径
}

export const process_and_show = () => {
    return http.get('/process_and_show').catch((e) => {});  //第一个参数是请求后端的路径
}

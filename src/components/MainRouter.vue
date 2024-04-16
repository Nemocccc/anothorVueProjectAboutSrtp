<template>
  <div id="whole-page">
    <!--上层卡片-->
    <el-row>
      <el-col :span="12">
        <!--左边卡片-->
        <div class="brain-wave-display" style="height: 55vh">
          <div class="button-row" id="large">
            <t class="text-tag" style="min-width: 100px; white-space: nowrap; font-weight: 1000; border-bottom: 1px solid orange; color: white">脑电波展示</t>
            <el-button plain class="inline" size="small">
              <input type="file" @change="uploadFile('bdf')" />选取文件
            </el-button>
            <el-button type="primary" plain class="inline" size="small" @click="open('显示原始脑电波')">
              显示原始脑电波
            </el-button>
            <el-button type="success" plain class="inline" size="small" @click="open('开始预处理')">
              开始预处理
            </el-button>
            <el-button type="info" plain class="inline" size="small" @click="open('显示文件')">
              显示文件
            </el-button>
          </div>
          <div class="button-row" id="small">
            <t class="text-tag" style="font-weight: 1000; border-bottom: 1px solid black; min-width: 100px; white-space: nowrap;">脑电波</t>
            <el-button :icon="Upload" size="small" circle />
            <el-button type="primary" :icon="VideoPlay" size="small" circle />
            <el-button type="success" :icon="Expand" size="small" circle />
            <el-button type="info" :icon="Rank" size="small" circle />
          </div>
          <el-card class="page-card" style="height: 52vh; display: flex; align-items: flex-start; text-align: left;">
            <img src="../assets/brainWave.jpg" style="width: 5%; height:5%; padding: 0; margin-left: 10px; margin-top: 10px  ;"/>
            <em style="padding: 2px; margin: 0; font-size: small; border-bottom: 1px solid orange; color: white;">脑电预处理步骤</em>
          </el-card>
        </div>
      </el-col>

      <!--右边卡片-->
      <el-col :span="12">
        <div class="mood-visualization" style="height: 55vh">
          <div class="button-row">
            <t class="text-tag" style="font-weight: 1000; border-bottom: 1px solid orange; color: white">情绪可视化</t>
            <el-button type="primary" plain class="inline" size="small">
              <input type="file" @change="uploadFile('mat')" />上传文件
            </el-button>
            <el-button type="info" plain class="inline" size="small" @click="downloadFile">
              下载文件
            </el-button>
          </div>
          <el-card class="page-card" style="height: 52vh">
            <!--柱状图-->
            <div ref='echartBar' style="width: 350px; height: 300px; float: left; padding: 20px;"></div>
            <img src="../assets/linedog.jpg" style="padding: 5px; height: 25%; width: 25%; float: right; margin-top: 130px;"/>
          </el-card>
        </div>

      </el-col>
    </el-row>



    <!--下层卡片-->
    <el-row>
      <!-- 左卡片 -->
      <el-col :span="12">
        <div class="recommend-display" style="height: 37vh">
          <div class="button-row">
            <t class="text-tag" style="font-weight: 1000; border-bottom: 1px solid orange; color: white">建议</t>
          </div> 
          <el-card class="page-card" style="height: 32vh">
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;"
            >
              <em style="font-size: medium; font-weight: 1000; color: #f5b041; margin: 15px">在这里写下建议</em>
            </div>
          </el-card>
        </div>
      </el-col>
      <!--右卡片-->
      <el-col :span="12">
        <div class="Biodata-feedback" style="height: 37vh">
          <div class="button-row">
            <t class="text-tag" style="font-weight: 1000; border-bottom: 1px solid orange; color: white">生物数据反馈</t>
          </div> 
          <el-card class="page-card" style="height: 32vh">
            <div ref="echartBar2" style="width: 500px; height: 200px; padding: 0;"></div>
          </el-card>
        </div>  
      </el-col>
    </el-row>
  </div>  
</template>

<script lang="ts" setup>
import {
  Expand,
  Rank,
  Upload,
  VideoPlay,
} from '@element-plus/icons-vue'

import defineComponent from '../api/index'
import { ref, onMounted, provide } from 'vue'
import * as echarts from 'echarts';

import { ElMessage } from 'element-plus'


//  消息提示框
const open = (operation: string) => {
  ElMessage(operation + '成功！')
}



//下载文件
// 导入操作接口的方法

const downloadFile = async () => {
  try {
    // 从后端获取文件的 URL
    const url = await defineComponent.getFileUrl();

    // 调用下载文件的函数，传入获取到的 URL 参数
    defineComponent.downloadFile(url);
  } catch (error) {
    console.error(error);
  }
};


// 上传文件
// 定义 uploadedFiles ref，并初始化为空对象
const uploadedFiles = ref<{[key: string]: File}>({});

const uploadFile = (type: string) => (event: Event) => {
  const file = (event.target as HTMLInputElement).files;
  
  if (!file) {
    console.error('No file selected!');
    return;
  }

  // 将获取的文件存储在 uploadedFiles 中
  uploadedFiles.value[type] = file[0];
};

provide('uploadedFiles', uploadedFiles);


// 创建一个引用用于ECHARTS实例
let echartBar = ref(null);
let echartBar2 = ref(null);

onMounted(async () => {
  let data = await defineComponent.uploadAndPredict.results();
  console.log(data);
  let data1 = await defineComponent.uploadAndPredict.uploader();
  console.log(data1);
  let data3 = await defineComponent.show_raw();
  console.log(data3);
  let data4 = await defineComponent.process_and_show();
  console.log(data4);


  // 基于准备好的dom，初始化echarts实例
  // 柱状图
  let chartBar = echarts.init(echartBar.value);
  let dataset = {
      source: [
        ['delta', 'theta', 'alpha', 'sigma', 'beta'],
        [43.3, 85.8, 93.7, 90.3, 89.0],
      ]
    };
  let barOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {            
        type: 'shadow'        
      }
    },
    dataset: dataset,
    xAxis: {
      type: 'category',
      axisLabel: {
        inside: true,
        color: '#fff'
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      z: 10
    },
    yAxis: {
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#999'
      }
      // {
      //   type: 'value',
      //   name: '开心',
      //   nameLocation: 'end',
      //   position: 'left',
      //   offset: 10,
      //   axisLabel: {
      //     show: false,
      //   },
      // },
      // {
      //   type: 'value',
      //   name: '难过',
      //   nameLocation: 'start',
      //   position: 'left',
      //   offset: 10,
      //   axisLabel: {
      //     show: false,
      //   },
      // },
    },
    dataZoom: [
      {
        type: 'inside'
      }
    ],
    series: [
      { 
        type: 'bar', 
        seriesLayoutBy: 'row', 
        stack: '情绪',
        showBackground: true,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2378f7' },
              { offset: 0.7, color: '#2378f7' },
              { offset: 1, color: '#83bff6' }
            ])
          }
        },
      },
    ]
  };
  chartBar.setOption(barOption);
  chartBar.on('click', function (params) {
    const zoomSize1 = 6; // Declare and assign a value to the zoomSize variable
    console.log(dataset.source[0][Math.max(params.dataIndex - zoomSize1 / 2, 0)]);
    chartBar.dispatchAction({
      type: 'dataZoom',
      startValue: dataset.source[0][Math.max(params.dataIndex - zoomSize1 / 2, 0)],
      endValue:
        dataset.source[0][Math.min(params.dataIndex + zoomSize1 / 2, dataset.source[0].length - 1)]
    });
  });

  // 横向条状图
  let dataset2 = {
      source: [
        ['delta', 'theta', 'alpha', 'sigma', 'beta'],
        [23489, 29034, 104970, 630230, 134141]
      ]
  };
  let chartBar2 = echarts.init(echartBar2.value, 'light');
  let barOption2 = {
    title: {
      text: '脑电波频段能量',
      // text: '{titleIcon|}脑电波频段能量',
      left: '40px', // 标题距离图表左侧的位置
      top: '20px', // 标题距离图表上方的位置
      textStyle: { 
        fontSize: 15,
        fontStyle: "normal",
        fontWeight: "normal",
        color: "#f5cba7",
        // rich: {
        //   titleIcon:{
        //     backgroundColor:{
        //       image: DataAnalysis,  //
        //     },
        //   }
        // }
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    // 光有函数还不行，还得有这个：
    dataZoom: [
      {
        type: 'slider',
        yAxisIndex: 0,
        filterMode: 'empty'
      },
      {
        type: 'inside',
        yAxisIndex: 0,
        filterMode: 'empty'
      }
    ],
    dataset: dataset2,
    // legend: {},
    grid: {
      left: '3%',
      right: '5%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      show: false,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#999'
      }
    },
    yAxis: {
      type: 'category',
      axisLabel: {
        inside: true,
        color: '#fff'
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      z: 10
    },
    series: [
      {
        showBackground: true,
        type: 'bar',
        seriesLayoutBy: 'row',
        itemStyle: {
          normal: {
            //这里设置柱形图圆角 [左上角，右上角，右下角，左下角]
            barBorderRadius:[0, 10, 10, 0]
          },
        },
      }
    ]
  };
  chartBar2.setOption(barOption2);
  // chartBar2.on('click', function (params) {
  //   const zoomSize2 = 6; // Declare and assign a value to the zoomSize variable
  //   console.log(dataset2.source[0][Math.max(params.dataIndex - zoomSize2 / 2, 0)]);
  //   chartBar2.dispatchAction({
  //     type: 'dataZoom',
  //     startValue: dataset2.source[0][Math.max(params.dataIndex - zoomSize2 / 2, 0)],
  //     endValue:
  //       dataset2.source[0][Math.min(params.dataIndex + zoomSize2 / 2, dataset2.source[0].length - 1)]
  //   });
  // });
  chartBar2.on('click', function (params) {
    const zoomSize2 = 6; // declare and assign a value to the zoomSize2 variable
    console.log(dataset2.source[0][Math.max(params.dataIndex - zoomSize2 / 2, 0)]);
    chartBar2.dispatchAction({
      // change dataZoom type to y
      type: 'dataZoom',
      startValue: dataset2.source[0][Math.max(params.dataIndex - zoomSize2 / 2, 0)],
      endValue:
        dataset2.source[0][Math.min(params.dataIndex + zoomSize2 / 2, dataset2.source[0].length - 1)],
    });
  });

  // 根据网页大小自适应改变
  window.addEventListener('resize', function() {
    chartBar.resize();
    chartBar2.resize();
  });
})

</script>

<style lang="less">
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  padding: 0;
  border-radius: 4px;
  min-height: 36px;
}

.page-card {
  padding: 0px;
  border-radius: 15px;
  margin-left: 5px;
  margin-right: 5px;
  // background-image: linear-gradient(to center, rgba(238, 131, 173, 1), rgba(199, 0, 57, 0.6) 30%, #f98b8b 60%, rgba(237, 202, 141, 1));
  background-color:   #0f4376;
  display: flex;
  align-items: flex-start;  
  // align-items: space-between;
  // justify-content: space-between;
  .el-card__body{
    padding: 0
  }
}

.button-row { /* 添加对button-row的样式 */
  display: flex;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 5px;
  .text-tag {
    margin-left: 8px;
    margin-right: 8px;
  }
}

#whole-page {
  padding: 5px;
}

.card-text {
  text-align: left;
  padding: 10px; /* Optional: to give text some space from the card border */
}

@media (max-width: 950px) {
  #large {
    display: none;
  }
}
@media (min-width: 950px) {
  #small {
    display: none;
  }
}
</style>
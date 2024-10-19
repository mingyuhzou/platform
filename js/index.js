logout()
checkToken()
renderUsername()
const data = localStorage.getItem('usermsg') ? JSON.parse(localStorage.getItem('usermsg')) : {}

const { token } = data

const getData = async () => {
    const data = await axios({ url: '/dashboard', method: 'GET', })
    renderOverview(data)
    renderYear(data)
    renderSalaryData(data)
    renderGroupData(data)
    renderGernderData(data)
    renderProvince(data)
}


const renderOverview = ({ data: { overview } }) => {
    Object.keys(overview).forEach(item => {
        document.querySelector(`.${item}`).innerHTML = overview[item]
    })
}
const renderYear = ({ data: { year } }) => {
    const salary = year.map(item => item.salary)

    const line = echarts.init(document.querySelector('#line'))
    const option = {
        title: { text: '2022全学科薪资走势', left: 10, top: 10 },
        grid: { top: 80 },
        xAxis: {
            type: 'category',
            axisLine: { lineStyle: { type: 'dashed', color: '#cccccc' } },
            data: year.map(item => item.month)
        },
        yAxis: {
            type: 'value',
            splitLine: { lineStyle: { type: 'dashed' } }
        },
        series: [
            {
                data: salary,
                type: 'line',
                symbolSize: 10,
                lineStyle: {
                    width: 6,
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 0,
                        colorStops: [{
                            offset: 0, color: 'skyblue' // 0% 处的颜色
                        }, {
                            offset: 1, color: 'blue' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    }
                },
                smooth: true,
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'blue' // 0% 处的颜色
                        }, {
                            offset: 1, color: 'rgba(255,255,255,0)' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    }
                }
            }
        ],
        tooltip: { show: true, trigger: 'axis' },
    };

    line.setOption(option)

}
const renderSalaryData = ({ data: { salaryData } }) => {
    const pie = echarts.init(document.querySelector('#salary'))
    const option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            // show:false,
            bottom: '0%',
            left: 'center'
        },
        title: {
            text: '班级薪资分布',
            top: 10,
            left: 10,
            textStyle: {
                fontSize: 16
            }
        },

        series: [
            {
                name: '班级薪资分布',
                type: 'pie',
                // 内圆的半径和外圆的半径
                radius: ['60%', '80%'],
                // 防止标识圆环的线重叠
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    // 标识扇形之间的间隙
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                labelLine: {
                    show: false
                },
                data: salaryData.map(item => {
                    return {
                        value: item.g_count + item.b_count,
                        name: item.label
                    }
                })
            }
        ]
    };
    pie.setOption(option)

}
const renderGroupData = ({ data: { groupData } }) => {
    const bar = echarts.init(document.querySelector('#lines'))


    const option = {
        xAxis: {
            type: 'category',
            data: groupData[1].map(item => item.name),
            axisLine: { lineStyle: { type: 'dashed', color: '#ccc' } },
            axisLabel: {
                fontSize: 12,
                color: '#999'
            }
        },

        grid: {
            left: 70,
            top: 30,
            right: 30,
            bottom: 50,
        },

        yAxis: {
            type: 'value',
            splitLine: { lineStyle: { type: 'dashed' } }
        },
        series: [
            {
                data: groupData[1].map(item => item.hope_salary),
                type: 'bar',
                itemStyle: {
                    color: {
                        type: 'linear',
                        // x不变y变化表示在垂直方向上会出现渐变色，高处为0低处为1 
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: '#34D39A  ' // 0% 处的颜色
                        },
                        // 可以设置0.5处的颜色
                        {
                            offset: 1, color: 'rgba(52,211,154,0.2)' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    }
                }
            },
            {
                data: groupData[1].map(item => item.salary),
                type: 'bar',
                itemStyle: {
                    color: {
                        type: 'linear',
                        // x不变y变化表示在垂直方向上会出现渐变色，高处为0低处为1 
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: '#499FEE' // 0% 处的颜色
                        },
                        // 可以设置0.5处的颜色
                        {
                            offset: 1, color: 'rgba(73,159,238,0.2)' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    }
                }
            },



        ]
    };
    bar.setOption(option)

    document.querySelector('#btns').addEventListener('click', e => {
        if (e.target.tagName === 'BUTTON') {
            document.querySelector('#btns').querySelector('.btn-blue').classList.remove('btn-blue')
            e.target.classList.add('btn-blue')
            const idx = +e.target.innerHTML
            option.xAxis.data = groupData[idx].map(item => item.name)
            option.series[0].data = groupData[idx].map(item => item.hope_salary)
            option.series[1].data = groupData[idx].map(item => item.salary)
            bar.setOption(option)
        }

    })

}
const renderGernderData = ({ data: { salaryData } }) => {

    const chart = echarts.init(document.querySelector('#gender'))
    const option = {
        title: [
            { text: '男女薪资分布', top: 10, left: 5, textStyle: { fontSize: 16 } },
            { text: '男生', left: "42.5%", top: "45%", textStyle: { fontSize: 12 } },
            { text: '女生', left: "42.5%", top: "85%", textStyle: { fontSize: 12 } }
        ],
        series: [
            {
                name: '男生',
                type: 'pie',
                radius: ["20%", "30%"],
                center: ['50%', '30%'],
                // roseType: 'area',
                itemStyle: {
                    borderRadius: 8
                },
                data: salaryData.map(item => {
                    return {
                        value: item.b_count,
                        name: item.label
                    }
                })
            },

            {
                name: '女生',
                type: 'pie',
                radius: ["20%", "30%"],
                center: ['50%', '70%'],
                // roseType: 'area',
                itemStyle: {
                    borderRadius: 8
                },
                data: salaryData.map(item => {
                    return {
                        value: item.g_count,
                        name: item.label
                    }
                })
            }
        ]
    };
    chart.setOption(option)
}
const renderProvince = ({ data: { provinceData } }) => {
    const dom = document.querySelector('#map')
    const myEchart = echarts.init(dom)
    const dataList = [
        { name: '南海诸岛', value: 0 },
        { name: '北京', value: 0 },
        { name: '天津', value: 0 },
        { name: '上海', value: 0 },
        { name: '重庆', value: 0 },
        { name: '河北', value: 0 },
        { name: '河南', value: 0 },
        { name: '云南', value: 0 },
        { name: '辽宁', value: 0 },
        { name: '黑龙江', value: 0 },
        { name: '湖南', value: 0 },
        { name: '安徽', value: 0 },
        { name: '山东', value: 0 },
        { name: '新疆', value: 0 },
        { name: '江苏', value: 0 },
        { name: '浙江', value: 0 },
        { name: '江西', value: 0 },
        { name: '湖北', value: 0 },
        { name: '广西', value: 0 },
        { name: '甘肃', value: 0 },
        { name: '山西', value: 0 },
        { name: '内蒙古', value: 0 },
        { name: '陕西', value: 0 },
        { name: '吉林', value: 0 },
        { name: '福建', value: 0 },
        { name: '贵州', value: 0 },
        { name: '广东', value: 0 },
        { name: '青海', value: 0 },
        { name: '西藏', value: 0 },
        { name: '四川', value: 0 },
        { name: '宁夏', value: 0 },
        { name: '海南', value: 0 },
        { name: '台湾', value: 0 },
        { name: '香港', value: 0 },
        { name: '澳门', value: 0 },
    ]

    dataList.forEach(item1 => {
        provinceData.forEach(item2 => {
            if (item2.name.includes(item1.name)) {
                item1.value = item2.value
                return
            }
        })
    })

    const mx = Math.max(...dataList.map(item => item.value))
    console.log(mx);


    const option = {
        title: {
            text: '籍贯分布',
            top: 10,
            left: 10,
            textStyle: {
                fontSize: 16,
            },
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} 位学员',
            borderColor: 'transparent',
            backgroundColor: 'rgba(0,0,0,0.5)',
            textStyle: {
                color: '#fff',
            },
        },
        visualMap: {
            min: 0,
            max: mx,
            left: 'left',
            bottom: '20',
            text: [mx + '', '0'],
            inRange: {
                color: ['#ffffff', '#0075F0'],
            },
            show: true,
            left: 40,
        },
        geo: {
            map: 'china',
            roam: false,
            zoom: 1.0,
            label: {
                normal: {
                    show: true,
                    fontSize: '10',
                    color: 'rgba(0,0,0,0.7)',
                },
            },
            itemStyle: {
                normal: {
                    borderColor: 'rgba(0, 0, 0, 0.2)',
                    color: '#e0ffff',
                },
                emphasis: {
                    areaColor: '#34D39A',
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 20,
                    borderWidth: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
            },
        },
        series: [
            {
                name: '籍贯分布',
                type: 'map',
                geoIndex: 0,
                data: dataList,
            },
        ],
    }
    myEchart.setOption(option)
}



getData()
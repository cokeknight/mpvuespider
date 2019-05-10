/**
 * Created by 001758 on 2017/10/20.
 */
// pie
let aboutUs = {
  title: {
    text: '员工构成',
    left: 'center',
    textStyle: {
      color: '#5a97ff',
      fontSize: 15
    }
  },
  legend: {
    borderRadius: 90,
    right: '6%', // 文字位置
    top: 'middle',
    orient: 'vertical',
    selectedMode: false,
    itemGap: 20,
    itemWidth: 8,
    itemHeight: 8,
    data: [{
      name: '市场营销',
      icon: 'circle'
    }, {
      name: '风控',
      icon: 'circle'
    }, {
      name: '运营',
      icon: 'circle'
    }, {
      name: '技术',
      icon: 'circle'
    }, {
      name: '支持',
      icon: 'circle'
    }],
    textStyle: {
      color: '#aaaaaa',
      fontSize: 13
    }
  },
  series: [
    {
      name: '员工构成',
      type: 'pie',
      //        startAngle: '', //起始角度，支持范围[0, 360]
      radius: ['40%', '60%'], // 圆半径
      avoidLabelOverlap: false,
      legendHoverLink: false,
      hoverOffset: 5,
      selectedOffset: 5,
      label: {
        normal: {
          show: false,
          position: 'center',
          formatter: [
            '{a|{b}}',
            ' 占比:{d}%'
          ].join('\n'),
          rich: {
            a: {
              color: '#333333',
              lineHeight: 35
            }
          }
        },
        emphasis: {
          show: true,
          textStyle: {
            fontSize: 13,
            fontWeight: 'bold'
          }
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      center: ['33%', '50%'], // 圆位置
      data: [
        {
          value: 42,
          name: '市场营销',
          itemStyle: {
            normal: {
              color: '#5a97ff'
            }
          }
        },
        {
          value: 49,
          name: '风控',
          itemStyle: {
            normal: {
              color: '#ffb41b'
            }
          }
        },
        {
          value: 67,
          name: '运营',
          itemStyle: {
            normal: {
              color: '#feca00'
            }
          }
        },
        {
          value: 161,
          name: '技术',
          itemStyle: {
            normal: {
              color: '#ffdf62'
            }
          }
        },
        {
          value: 83,
          name: '支持',
          itemStyle: {
            normal: {
              color: '#ffeca0'
            }
          }
        }
      ]
    }
  ]
}

let aboutUs1 = {
  title: {
    text: '从业年限分布',
    left: 'center',
    textStyle: {
      color: '#5a97ff',
      fontSize: 15
    }
  },
  legend: {
    borderRadius: 90,
    right: '6%', // 文字位置
    top: 'middle',
    orient: 'vertical',
    selectedMode: false,
    itemGap: 20,
    itemWidth: 8,
    itemHeight: 8,
    data: [{
      name: '1年及以下',
      icon: 'circle'
    }, {
      name: '1-3',
      icon: 'circle'
    }, {
      name: '3-5',
      icon: 'circle'
    }, {
      name: '5年及以上',
      icon: 'circle'
    }],
    textStyle: {
      color: '#aaaaaa',
      fontSize: 13
    }
  },
  series: [
    {
      name: '从业年限分布',
      type: 'pie',
      //        startAngle: '', //起始角度，支持范围[0, 360]
      radius: ['40%', '60%'], // 圆半径
      avoidLabelOverlap: false,
      legendHoverLink: false,
      hoverOffset: 5,
      selectedOffset: 5,
      label: {
        normal: {
          show: false,
          position: 'center',
          formatter: [
            '{a|{b}}',
            ' 占比:{d}%'
          ].join('\n'),
          rich: {
            a: {
              color: '#333333',
              lineHeight: 35
            }
          }
        },
        emphasis: {
          show: true,
          textStyle: {
            fontSize: 13,
            fontWeight: 'bold'
          }
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      center: ['33%', '50%'], // 圆位置
      data: [
        {
          value: 18,
          name: '1年及以下',
          itemStyle: {
            normal: {
              color: '#5a97ff'
            }
          }
        },
        {
          value: 76,
          name: '1-3',
          itemStyle: {
            normal: {
              color: '#ffb41b'
            }
          }
        },
        {
          value: 90,
          name: '3-5',
          itemStyle: {
            normal: {
              color: '#feca00'
            }
          }
        },
        {
          value: 218,
          name: '5年及以上',
          itemStyle: {
            normal: {
              color: '#ffdf62'
            }
          }
        }
      ]
    }
  ]
}

let aboutUs2 = {
  title: {
    text: '年龄分布',
    left: 'center',
    textStyle: {
      color: '#5a97ff',
      fontSize: 15
    }
  },
  legend: {
    borderRadius: 90,
    right: '6%', // 文字位置
    top: 'middle',
    orient: 'vertical',
    selectedMode: false,
    itemGap: 20,
    itemWidth: 8,
    itemHeight: 8,
    data: [{
      name: '18-28',
      icon: 'circle'
    }, {
      name: '29-35',
      icon: 'circle'
    }, {
      name: '36-45',
      icon: 'circle'
    }, {
      name: '46及以上',
      icon: 'circle'
    }],
    textStyle: {
      color: '#aaaaaa',
      fontSize: 13
    }
  },
  series: [
    {
      name: '年龄分布',
      type: 'pie',
      //        startAngle: '', //起始角度，支持范围[0, 360]
      radius: ['40%', '60%'], // 圆半径
      avoidLabelOverlap: false,
      legendHoverLink: false,
      hoverOffset: 5,
      selectedOffset: 5,
      label: {
        normal: {
          show: false,
          position: 'center',
          formatter: [
            '{a|{b}}',
            ' 占比:{d}%'
          ].join('\n'),
          rich: {
            a: {
              color: '#333333',
              lineHeight: 35
            }
          }
        },
        emphasis: {
          show: true,
          textStyle: {
            fontSize: 13,
            fontWeight: 'bold'
          }
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      center: ['33%', '50%'], // 圆位置
      data: [
        {
          value: 196,
          name: '18-28',
          itemStyle: {
            normal: {
              color: '#5a97ff'
            }
          }
        },
        {
          value: 169,
          name: '29-35',
          itemStyle: {
            normal: {
              color: '#ffb41b'
            }
          }
        },
        {
          value: 34,
          name: '36-45',
          itemStyle: {
            normal: {
              color: '#feca00'
            }
          }
        },
        {
          value: 3,
          name: '46及以上',
          itemStyle: {
            normal: {
              color: '#ffdf62'
            }
          }
        }
      ]
    }
  ]
}

let aboutUs3 = {
  title: {
    text: '学历分布',
    left: 'center',
    textStyle: {
      color: '#5a97ff',
      fontSize: 15
    }
  },
  legend: {
    borderRadius: 90,
    right: '5%', // 文字位置
    top: 'middle',
    orient: 'vertical',
    selectedMode: false,
    itemGap: 20,
    itemWidth: 8,
    itemHeight: 8,
    data: [{
      name: '专科及以下',
      icon: 'circle'
    }, {
      name: '本科',
      icon: 'circle'
    }, {
      name: '硕士及以上',
      icon: 'circle'
    }],
    textStyle: {
      color: '#aaaaaa',
      fontSize: 13
    }
  },
  series: [
    {
      name: '学历分布',
      type: 'pie',
      //        startAngle: '', //起始角度，支持范围[0, 360]
      radius: ['40%', '60%'], // 圆半径
      avoidLabelOverlap: false,
      legendHoverLink: false,
      hoverOffset: 5,
      selectedOffset: 5,
      label: {
        normal: {
          show: false,
          position: 'center',
          formatter: [
            '{a|{b}}',
            ' 占比:{d}%'
          ].join('\n'),
          rich: {
            a: {
              color: '#333333',
              lineHeight: 35
            }
          }
        },
        emphasis: {
          show: true,
          textStyle: {
            fontSize: 13,
            fontWeight: 'bold'
          }
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      center: ['33%', '50%'], // 圆位置
      data: [
        {
          value: 96,
          name: '专科及以下',
          itemStyle: {
            normal: {
              color: '#5a97ff'
            }
          }
        },
        {
          value: 280,
          name: '本科',
          itemStyle: {
            normal: {
              color: '#ffb41b'
            }
          }
        },
        {
          value: 26,
          name: '硕士及以上',
          itemStyle: {
            normal: {
              color: '#feca00'
            }
          }
        }
      ]
    }
  ]
}

let aboutUs4 = {
  title: {
    text: '学历分布',
    left: 'center',
    textStyle: {
      color: '#5a97ff',
      fontSize: 15
    }
  },
  legend: {
    borderRadius: 90,
    right: '6%', // 文字位置
    top: 'middle',
    orient: 'vertical',
    selectedMode: false,
    itemGap: 20,
    itemWidth: 8,
    itemHeight: 8,
    data: [{
      name: '专科及以下',
      icon: 'circle'
    }, {
      name: '本科',
      icon: 'circle'
    }, {
      name: '硕士及以上',
      icon: 'circle'
    }],
    textStyle: {
      color: '#aaaaaa',
      fontSize: 13
    }
  },
  series: [
    {
      name: '学历分布',
      type: 'pie',
      //        startAngle: '', //起始角度，支持范围[0, 360]
      radius: ['40%', '60%'], // 圆半径
      avoidLabelOverlap: false,
      legendHoverLink: false,
      hoverOffset: 5,
      selectedOffset: 5,
      label: {
        normal: {
          show: false,
          position: 'center',
          formatter: [
            '{a|{b}}',
            ' 占比:{d}%'
          ].join('\n'),
          rich: {
            a: {
              color: '#333333',
              lineHeight: 35
            }
          }
        },
        emphasis: {
          show: true,
          textStyle: {
            fontSize: 13,
            fontWeight: 'bold'
          }
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      center: ['33%', '50%'], // 圆位置
      data: [
        {
          value: 144,
          name: '专科及以下',
          itemStyle: {
            normal: {
              color: '#5a97ff'
            }
          }
        },
        {
          value: 483,
          name: '本科',
          itemStyle: {
            normal: {
              color: '#ffb41b'
            }
          }
        },
        {
          value: 38,
          name: '硕士及以上',
          itemStyle: {
            normal: {
              color: '#feca00'
            }
          }
        }
      ]
    }
  ]
}

let dataPie = {
  title: {
    text: '项目期限',
    left: 'center',
    textStyle: {
      color: '#5a97ff',
      fontSize: 15
    }
  },
  legend: {
    borderRadius: 90,
    right: '6%', // 文字位置
    top: 'middle',
    orient: 'vertical',
    selectedMode: false,
    itemGap: 20,
    itemWidth: 8,
    itemHeight: 8,
    data: [{
      name: '1个月以内',
      icon: 'circle'
    }, {
      name: '1-6个月',
      icon: 'circle'
    }, {
      name: '6-12个月',
      icon: 'circle'
    }, {
      name: '12-24个月',
      icon: 'circle'
    }, {
      name: '24个月以上',
      icon: 'circle'
    }],
    textStyle: {
      color: '#aaaaaa',
      fontSize: 13
    }
  },
  series: [
    {
      name: '项目期限',
      type: 'pie',
      //        startAngle: '', //起始角度，支持范围[0, 360]
      radius: ['40%', '60%'], // 圆半径
      avoidLabelOverlap: false,
      legendHoverLink: false,
      hoverOffset: 5,
      selectedOffset: 5,
      label: {
        normal: {
          show: false,
          position: 'center',
          formatter: [
            '{a|{b}}',
            ' 占比:{d}%'
          ].join('\n'),
          rich: {
            a: {
              color: '#333333',
              lineHeight: 35
            }
          }
        },
        emphasis: {
          show: true,
          textStyle: {
            fontSize: 13,
            fontWeight: 'bold'
          }
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      center: ['33%', '50%'], // 圆位置
      data: [
        {
          value: 144,
          name: '1个月以内',
          itemStyle: {
            normal: {
              color: '#5a97ff'
            }
          }
        },
        {
          value: 483,
          name: '1-6个月',
          itemStyle: {
            normal: {
              color: '#ffb41b'
            }
          }
        },
        {
          value: 38,
          name: '6-12个月',
          itemStyle: {
            normal: {
              color: '#feca00'
            }
          }
        },
        {
          value: 483,
          name: '12-24个月',
          itemStyle: {
            normal: {
              color: '#ffb41b'
            }
          }
        },
        {
          value: 38,
          name: '24个月以上',
          itemStyle: {
            normal: {
              color: '#feca00'
            }
          }
        }
      ]
    }
  ]
}

let dataPie1 = {
  title: {
    text: '项目期限',
    left: 'center',
    textStyle: {
      color: '#5a97ff',
      fontSize: 15
    }
  },
  legend: {
    borderRadius: 90,
    right: '6%', // 文字位置
    top: 'middle',
    orient: 'vertical',
    selectedMode: false,
    itemGap: 20,
    itemWidth: 8,
    itemHeight: 8,
    data: [{
      name: '7%以下',
      icon: 'circle'
    }, {
      name: '7%-7.5%',
      icon: 'circle'
    }, {
      name: '7.5%-8.5%',
      icon: 'circle'
    }, {
      name: '8.5%-10%',
      icon: 'circle'
    }, {
      name: '10%以上',
      icon: 'circle'
    }],
    textStyle: {
      color: '#aaaaaa',
      fontSize: 13
    }
  },
  series: [
    {
      name: '项目期限',
      type: 'pie',
      //        startAngle: '', //起始角度，支持范围[0, 360]
      radius: ['40%', '60%'], // 圆半径
      avoidLabelOverlap: false,
      legendHoverLink: false,
      hoverOffset: 5,
      selectedOffset: 5,
      label: {
        normal: {
          show: false,
          position: 'center',
          formatter: [
            '{a|{b}}',
            ' 占比:{d}%'
          ].join('\n'),
          rich: {
            a: {
              color: '#333333',
              lineHeight: 35
            }
          }
        },
        emphasis: {
          show: true,
          textStyle: {
            fontSize: 13,
            fontWeight: 'bold'
          }
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      center: ['33%', '50%'], // 圆位置
      data: [
        {
          value: 144,
          name: '7%以下',
          itemStyle: {
            normal: {
              color: '#5a97ff'
            }
          }
        },
        {
          value: 483,
          name: '7%-7.5%',
          itemStyle: {
            normal: {
              color: '#ffb41b'
            }
          }
        },
        {
          value: 38,
          name: '7.5%-8.5%',
          itemStyle: {
            normal: {
              color: '#feca00'
            }
          }
        },
        {
          value: 483,
          name: '8.5%-10%',
          itemStyle: {
            normal: {
              color: '#ffb41b'
            }
          }
        },
        {
          value: 38,
          name: '10%以上',
          itemStyle: {
            normal: {
              color: '#feca00'
            }
          }
        }
      ]
    }
  ]
}

// bar
let aboutData = {
  color: ['#609bff'],
  tooltip: {
    trigger: 'axis',
    triggerOn: 'mousemove',
    axisPointer: { // 坐标轴指示器，坐标轴触发有效
      type: 'line', // 默认为直线，可选为：'line' | 'shadow'
      lineStyle: {
        color: '#ffab00',
        opacity: 0.5,
        width: 2
      }
    },
    formatter: '{c0}万',
    position: function (point, params, dom, rect, size) {
      // 固定在顶部
      return [point[0] - 35, '10%']
    }
  },
  grid: {
    left: '0%',
    right: '0%',
    bottom: '0%',
    show: true,
    borderWidth: 0,
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: ['4', '5', '6', '7', '8', '9'],
      axisTick: {
        alignWithLabel: true,
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#aaaaaa'
        }
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        show: false,
        inside: true
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0'
        }
      }
    }
  ],
  series: [
    {
      name: '借款数据',
      legendHoverLink: false,
      type: 'bar',
      barWidth: 24,
      data: [52, 200, 334, 390, 330, 220],
      itemStyle: {
        normal: {
        },
        emphasis: {
          color: '#ffab00',
          shadowBlur: 1,
          shadowColor: '#f0f0f0'
        }
      }
    }
  ]
}

let aboutData1 = {
  color: ['#ffd200'],
  tooltip: {
    trigger: 'axis',
    triggerOn: 'mousemove',
    axisPointer: { // 坐标轴指示器，坐标轴触发有效
      type: 'line', // 默认为直线，可选为：'line' | 'shadow'
      lineStyle: {
        color: '#a4ba00',
        opacity: 0.5,
        width: 2
      }
    },
    formatter: '{c0}万',
    position: function (point, params, dom, rect, size) {
      // 固定在顶部
      return [point[0] - 35, '10%']
    }
  },
  grid: {
    left: '0%',
    right: '0%',
    bottom: '0%',
    show: true,
    borderWidth: 0,
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: ['4', '5', '6', '7', '8', '9'],
      axisTick: {
        alignWithLabel: true,
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#aaaaaa'
        }
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        show: false,
        inside: true
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0'
        }
      }
    }
  ],
  series: [
    {
      name: '借款数据',
      legendHoverLink: false,
      type: 'bar',
      barWidth: 24,
      data: [52, 200, 334, 390, 330, 220],
      itemStyle: {
        normal: {
        },
        emphasis: {
          color: '#a4ba00',
          shadowBlur: 1,
          shadowColor: '#f0f0f0'
        }
      }
    }
  ]
}

let interestRate = {
  grid: {
    left: 50
  },
  xAxis: {
    name: '期限',
    postion: 'top',
    axisLabel: {// 坐标轴刻度标签的相关设置。
      interval: 0,
      rotate: '30'
    },
    nameLocation: 'start',
    type: 'category',
    data: []

  },
  yAxis: {
    name: '期望年化利率',
    type: 'category',
    data: []
  },
  series: {
    type: 'line',
    step: 'start',
    data: [],
    itemStyle: {
      color: 'red'
    }
  }
}

export { aboutUs, aboutUs1, aboutUs2, aboutUs3, aboutUs4, aboutData, aboutData1, interestRate }

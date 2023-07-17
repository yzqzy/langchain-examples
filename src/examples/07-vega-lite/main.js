// import './style.css'

// const App = async () => {
//   const data = {
//     values: [
//       { a: 'C', b: 2 },
//       { a: 'C', b: 7 },
//       { a: 'C', b: 4 },
//       { a: 'D', b: 1 },
//       { a: 'D', b: 2 },
//       { a: 'D', b: 6 },
//       { a: 'E', b: 8 },
//       { a: 'E', b: 4 },
//       { a: 'E', b: 7 }
//     ]
//   }

//   const vlSpec = {
//     $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
//     data,
//     // mark: 'point',
//     mark: 'bar',
//     encoding: {
//       // "x": { "field": "a", "type": "nominal" },
//       // // "y": { "field": "b", "type": "quantitative" }
//       // "y": { "field": "b", "aggregate": "average", "type": "quantitative" }

//       y: { field: 'a', type: 'nominal' },
//       x: { field: 'b', aggregate: 'average', type: 'quantitative', title: 'Mean of b' }
//     }
//   }

//   const result = await vegaEmbed('#vis', vlSpec, { renderer: 'none' })

//   console.log(result.view.data('table'))

//   // const chartContainer = document.getElementById('charts')
//   // chartContainer.innerHTML = svg

//   // const echartsInstance = echarts.init(chartContainer)
//   // echartsInstance.resize()
// }

// App()

const data = {
  values: [
    { a: 'C', b: 2 },
    { a: 'C', b: 7 },
    { a: 'C', b: 4 },
    { a: 'D', b: 1 },
    { a: 'D', b: 2 },
    { a: 'D', b: 6 },
    { a: 'E', b: 8 },
    { a: 'E', b: 4 },
    { a: 'E', b: 7 }
  ]
}

const vlSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  data,
  // mark: 'point',
  mark: 'bar',
  encoding: {
    // "x": { "field": "a", "type": "nominal" },
    // // "y": { "field": "b", "type": "quantitative" }
    // "y": { "field": "b", "aggregate": "average", "type": "quantitative" }

    y: { field: 'a', type: 'nominal' },
    x: { field: 'b', aggregate: 'average', type: 'quantitative', title: 'Mean of b' }
  }
}

// 渲染 Vega 图表并获取数据
vegaEmbed('#vis', vlSpec)
  .then(result => {
    console.log(result.spec)

    const chartData = result.spec.data.values

    console.log(chartData.map(d => d))

    // 转换为 ECharts 的配置项
    const echartsOptions = {
      xAxis: {
        type: 'category',
        data: chartData.map(d => d.a)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          type: 'bar',
          data: chartData.map(d => d.b)
        }
      ]
    }

    // 使用 ECharts 渲染图表
    const echartsInstance = echarts.init(document.getElementById('vis'))
    echartsInstance.setOption(echartsOptions)
  })
  .catch(error => {
    console.error('Error rendering chart:', error)
  })

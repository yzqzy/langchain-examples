export const usChartsGenerator = async () => {
  const generateData = (label: string, data: { x: string[]; y: string[] }) => {
    return {
      data: {
        labels: data.x,
        datasets: [
          {
            label,
            backgroundColor: '#ecf5ff',
            data: data.y
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    }
  }
  const generateRandomColor = (count: number) => {
    const colors = []
    for (let i = 0; i < count; i++) {
      const color = '#' + Math.floor(Math.random() * 16777215).toString(16)
      colors.push(color)
    }
    return colors
  }
  const generatePieData = (data: { x: string[]; y: string[] }) => {
    return {
      data: {
        labels: data.x,
        datasets: [
          {
            backgroundColor: generateRandomColor(data.y.length),
            data: data.y
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    }
  }

  return {
    generateData,
    generatePieData
  }
}

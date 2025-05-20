<template>
  <div class="md:flex w-full mx-auto gap-4 max-md:m-4">
    <div class="bg-white md:w-1/2 rounded-xl p-8 max-sm:m-4 sm:mt-4">
      <canvas ref="chartRefBar" class="max-w-2sx max-h-[288px]"></canvas>
    </div>
    <div class="bg-white md:w-1/2 rounded-xl p-8 max-sm:m-4 sm:mt-4">
      <canvas ref="chartRefDoughnut" class="max-w-2sx max-h-[288px]"></canvas>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ArcElement, Chart, CategoryScale, LinearScale, BarElement, DoughnutController, BarController, Legend, Tooltip } from 'chart.js';
import { onMounted, ref, defineProps, watch } from 'vue';
import ChartDataLabels from 'chartjs-plugin-datalabels'

const props = defineProps({
  refreshKey: Number
})

Chart.register(DoughnutController, BarController, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, ChartDataLabels)

const userId = JSON.parse(localStorage.getItem('userInfo')).id
const API_URL = 'http://localhost:3000/tasks'

const chartRefDoughnut = ref(null)
const chartRefBar = ref(null)
let doughnutChartInstance = null
let barChartInstance = null

const fetchTaskProgressSummary = async () => {
  const response = await axios.get(`${API_URL}?taskUserId=${userId}`)
  const tasks = response.data

  const progressCount = { 0: 0, 1: 0, 2: 0}
  const severityCount = { 1: 0, 2: 0, 3: 0}

  tasks.forEach(task => {
    progressCount[task.taskProgress]++
    severityCount[task.taskSeverity]++
  })

  return { progressCount, severityCount }

}

const renderDoughnutChart = async () => {
  const summary = await fetchTaskProgressSummary()

  const data = {
    labels: ['Not Started', 'In Progress', 'Completed'],
    datasets: [{
      label: 'Task Progress',
      data: [summary.progressCount[0], summary.progressCount[1], summary.progressCount[2]],
      backgroundColor: [
      '#d1d5db',
      '#facc15',
      '#22c55e'
    ],
    hoverOffset: 4
    }]
  }

  if(doughnutChartInstance) doughnutChartInstance.destroy()

  doughnutChartInstance = new Chart(chartRefDoughnut.value, {
    type: 'doughnut',
    data,
    options: {
      plugins: {
        datalabels: {
          color: '#000',
          font: { weight: 'bold' },
          formatter: (value, ctx) => {
            const label = ctx.chart.data.labels[ctx.dataIndex]
            return `${label}\n(${value})`
          }
        },
        legend: {
          position: 'bottom'
        }
      },
      responsive: true,
      maintainAspectRatio: false
    },
    plugins: [ChartDataLabels]
  })
}

const renderBarChart = async () => {
  const summary = await fetchTaskProgressSummary()

  const data = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      label: 'Task Severity Count',
      data: [summary.severityCount[3], summary.severityCount[2], summary.severityCount[1]],
      backgroundColor: [
        'rgba(255, 99, 132, .8)',
        '#facc15',
        'rgba(54, 162, 235, .8)'
      ],
    }]
  }

  if(barChartInstance) barChartInstance.destroy()

  barChartInstance = new Chart(chartRefBar.value, {
    type: 'bar',
    data,
    options: {
      plugins: {
        datalabels: {
          color: '#000',
          font: { weight: 'bold' },
          formatter: (value) => {
            return `(${value})`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
    plugins: [ChartDataLabels]
  })
}


onMounted(() => {
  renderDoughnutChart()
  renderBarChart()
})

watch(() => props.refreshKey, () => {
  renderDoughnutChart()
  renderBarChart()
})
</script>
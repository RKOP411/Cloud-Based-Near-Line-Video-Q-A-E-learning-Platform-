<script setup>
import { watch, onMounted } from "vue";
import Chart from "chart.js/auto";

// Props definition
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  height: {
    type: String,
    default: "300",
  },
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  chart: {
    type: Object,
    required: true,
    labels: Array,
    datasets: {
      type: Array,
      label: String,
      data: Array,
    },
  },
});

let chartInstance; // Variable to hold the chart instance

const createChart = () => {
  const gradientLineChart = document.getElementById(props.id).getContext("2d");

  // Create the gradient stroke
  var gradientStroke = gradientLineChart.createLinearGradient(0, 230, 0, 50);
  gradientStroke.addColorStop(1, "rgba(203,12,159,0.2)");
  gradientStroke.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke.addColorStop(0, "rgba(203,12,159,0)");

  chartInstance = new Chart(gradientLineChart, {
    type: "line",
    data: {
      labels: props.chart.labels,
      datasets: [
        {
          label: props.chart.datasets[0].label,
          data: props.chart.datasets[0].data,
          backgroundColor: gradientStroke,
          borderColor: '#4BB543',
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true },
        x: { title: { display: true, text: '' } },
      },
    },
  });
};

// Watch for changes in chart data
watch(
  () => [props.chart.labels, props.chart.datasets],
  () => {
    if (chartInstance) {
      chartInstance.data.labels = props.chart.labels;
      chartInstance.data.datasets[0].data = props.chart.datasets[0].data;
      chartInstance.update(); // Update the chart
    }
  },
  { immediate: true } // This ensures it runs on initial load
);

onMounted(() => {
  createChart(); // Create the chart when component mounts
});
</script>

<template>
  <div class="card z-index-2">
    <div class="pb-0 card-header mb-0">
      <h6>{{ props.title }}</h6>
      <!--  eslint-disable-next-line vue/no-v-html -->
      <p v-if="props.description" class="text-sm" v-html="props.description" />
    </div>
    <div class="p-3 card-body">
      <div class="chart">
        <canvas
          :id="props.id"
          class="chart-canvas"
          :height="props.height"
        ></canvas>
      </div>
    </div>
  </div>
</template>

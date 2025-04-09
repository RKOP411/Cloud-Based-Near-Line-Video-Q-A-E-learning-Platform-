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
  const barChartCanvas = document.getElementById(props.id).getContext("2d");

  chartInstance = new Chart(barChartCanvas, {
    type: "bar", // Histogram uses bar chart type
    data: {
      labels: props.chart.labels,
      datasets: [
        {
          label: props.chart.datasets[0].label,
          data: props.chart.datasets[0].data,
          backgroundColor: "rgba(75, 181, 67, 0.5)", // Adjust bar color
          borderColor: "#4BB543",
          borderWidth: 1,
        },
      ],
    },
    options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true } },
    scales: {
        y: { 
            beginAtZero: true,
            title: { display: true, text: 'Frequency' }, // Y-axis title for histogram
            ticks: {
                // This will format the ticks to show whole numbers
                callback: function(value) {
                    return Number.isInteger(value) ? value : ''; // show only whole numbers
                }
            }
        },
        x: { 
            title: { display: true, text: 'Opened Queues' }, // X-axis title for histogram
        },
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

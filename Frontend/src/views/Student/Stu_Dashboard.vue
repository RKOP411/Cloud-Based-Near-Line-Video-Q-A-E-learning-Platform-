<script setup>
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";


const totalQuestions = ref(0);
const totalAnswers = ref(0);
const avgWaitingTime = ref(0);
const totalWaitingTime = ref(0);
const optionsSelect = ref("total");
const UserID = localStorage.getItem("UserID");
console.log("UserID: " + UserID);

const loadStats = async () => {
  totalQuestions.value = 10;
  totalAnswers.value = 5;
  avgWaitingTime.value = 15;
  totalWaitingTime.value = 150;
};

let chartInstance = null;

const loadChart = () => {
  const ctx = document.getElementById("dashboardChart").getContext("2d");
  if (chartInstance) {
    chartInstance.destroy();
  }
  let labels = [];
  let questionsData = [];
  let answersData = [];

  if (optionsSelect.value === "total") {
    labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    questionsData = [10, 20, 30, 40, 50, 60];
    answersData = [5, 10, 15, 20, 25, 30];
  } else if (optionsSelect.value === "month") {
    labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
    questionsData = [15, 25, 35, 45];
    answersData = [10, 15, 20, 25];
  } else if (optionsSelect.value === "week") {
    labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    questionsData = [5, 10, 15, 20, 25, 30, 35];
    answersData = [3, 5, 7, 10, 12, 15, 18];
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Questions",
          data: questionsData,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          label: "Answers",
          data: answersData,
          backgroundColor: "rgba(255, 206, 86, 0.2)",
          borderColor: "rgba(255, 206, 86, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

const handleDurationChange = (event) => {
  optionsSelect.value = event.target.value;
  loadChart();
};

onMounted(() => {
  loadStats();
  loadChart();
});
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="dashboard">
      <div class="col-lg-2 ms-auto d-flex justify-content-end">
        <select
          class="form-select text-white bg-primary"
          id="optionsSelect"
          @change="handleDurationChange($event)"
          v-model="optionsSelect"
          style="width: 100px; margin-bottom: 3px"
        >
          <option selected value="total">Total</option>
          <option value="month">Month</option>
          <option value="week">Week</option>
        </select>
      </div>
      <div class="row">
        <div class="col-lg-3 col-md-6 col-12">
          <mini-statistics-card
            title="Received of Answers"
            :value="totalAnswers"
            description="<span
                class='text-sm font-weight-bolder text-success'
                ></span> Number of Answers Received"
            :icon="{
              component: 'fa fa-question',
              background: 'bg-gradient-primary',
              shape: 'rounded-circle',
            }"
          />
        </div>
        <div class="col-lg-3 col-md-6 col-12">
          <mini-statistics-card
            title="Questions Asked"
            :value="totalQuestions"
            description="<span
                    class='text-sm font-weight-bolder text-info'
                    ></span> Questions Asked Number"
            :icon="{
              component: 'fa fa-question-circle',
              background: 'bg-gradient-info',
              shape: 'rounded-circle',
            }"
          />
        </div>
        <div class="col-lg-3 col-md-6 col-12">
          <mini-statistics-card
            title="Average Waiting Time"
            :value="avgWaitingTime + ' mins'"
            description="<span
                    class='text-sm font-weight-bolder text-warning'
                    ></span> Average Waiting Time"
            :icon="{
              component: 'fa fa-clock',
              background: 'bg-gradient-warning',
              shape: 'rounded-circle',
            }"
          />
        </div>
        <div class="col-lg-3 col-md-6 col-12">
          <mini-statistics-card
            title="Participation Rate"
            :value="participationRate + '%'"
            description="<span
                    class='text-sm font-weight-bolder text-primary'
                    ></span> Participation Rate"
            :icon="{
              component: 'fa fa-users',
              background: 'bg-gradient-success',
              shape: 'rounded-circle',
            }"
          />
        </div>
      </div>
      <div class="col-lg-12 mb-lg Chart-Card">
        <div class="card z-index-2">
          <div class="card-body">
            <div class="chart">
              <canvas id="dashboardChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style></style>

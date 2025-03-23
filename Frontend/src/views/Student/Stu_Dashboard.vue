<script setup>
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";
import {
  GetDashboradQuestions,
  AnswerGetTotal,
  AvgWaitingTime,
  MostTypeAsked,
  GetQuestionPerTime,
} from "../../assets/Domain.js";

const totalQuestions = ref(0);
const totalAnswers = ref(0);
const avgWaitingTime = ref(0);
const totalWaitingTime = ref(0);
const MostType = ref("");
const optionsSelect = ref("total");
const questionData = ref([]);
const labelsData = ref([]);
const answerData = ref([]);
const UserID = localStorage.getItem("UserID");
console.log("UserID: " + UserID);

const loadStats = async () => {
  //   totalQuestions.value = 10;
  //   totalAnswers.value = 5;
  avgWaitingTime.value = 15;
  totalWaitingTime.value = 150;
};

let chartInstance = null;

const GetQuestionTime = () => {
  fetch(`${GetQuestionPerTime}/${UserID}/${optionsSelect.value}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      //console.log(data);
      labelsData.value = [];
      questionData.value = [];
      answerData.value = [];
      data.forEach((item) => {
        labelsData.value.push(item.Time);
        questionData.value.push(item.QuestionCount);
        answerData.value.push(item.AnswerGetCount);
      });
      if (optionsSelect.value === "week") {
        const results = data[data.length - 1];

        results.forEach((item) => {
          labelsData.value.push(item.Time);
          questionData.value.push(item.QuestionCount);
          answerData.value.push(item.AnswerGetCount);
        });
      }
      console.log(labelsData.value);
      console.log(questionData.value);
      console.log(answerData.value);
      loadChart();
    });
};

const GetMostType = () => {
  fetch(`${MostTypeAsked}/${UserID}/${optionsSelect.value}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      //console.log(data);
      let maxCount = 0;
      let mostAskedType = "None";

      data.forEach((item) => {
        if (item.Count > maxCount) {
          maxCount = item.Count;
          mostAskedType = item.Type;
        }
      });

      MostType.value = mostAskedType;
    });
};

const GetQuestion = () => {
  fetch(`${GetDashboradQuestions}/${UserID}/${optionsSelect.value}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      //console.log(data);
      if (data.length > 0) {
        totalQuestions.value = data[0].QuestionCount;
        //console.log("Total Questions: " + totalQuestions.value);
      } else {
        //console.log(data.QuestinCount);
        totalQuestions.value = data.QuestionCount;
      }
    })
    .catch((error) => {
      console.error("Error fetching questions:", error);
    });
};
const GetTotalAnswer = () => {
  fetch(`${AnswerGetTotal}/${UserID}/${optionsSelect.value}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      //console.log(data);
      totalAnswers.value = data.AnswerGetCount;
    });
};

const GetAvgTime = () => {
  fetch(`${AvgWaitingTime}/${UserID}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      //console.log(data);
      avgWaitingTime.value = data.AverageWaitingTime;
      if (data && data.AverageWaitingTime) {
        let avgTime = parseFloat(data.AverageWaitingTime).toFixed(2);
        if (avgTime < 60) {
          avgWaitingTime.value = avgTime + " Sec";
        } else if (avgTime >= 60 && avgTime < 3600) {
          avgWaitingTime.value = (avgTime / 60).toFixed(2) + " Min";
        } else if (avgTime >= 3600 && avgTime < 86400) {
          avgWaitingTime.value = (avgTime / 3600).toFixed(2) + " Hour";
        } else {
          avgWaitingTime.value = (avgTime / 86400).toFixed(2) + " Day";
        }
      } else {
        avgWaitingTime.value = "Not Answered Yet";
      }
    });
};

const loadChart = () => {
  const ctx = document.getElementById("dashboardChart").getContext("2d");
  if (chartInstance) {
    chartInstance.destroy();
  }
  let labels = [];
  let questionsData = [];
  let answersData = [];

  if (optionsSelect.value === "total") {
    labels = [...labelsData.value];
    questionsData = [...questionData.value];
    answersData = [...answerData.value];
  } else if (optionsSelect.value === "month") {
    labels = [...labelsData.value];
    questionsData = [...questionData.value];
    answersData = [...answerData.value];
  } else if (optionsSelect.value === "week") {
    labels = [...labelsData.value];
    questionsData = [...questionData.value];
    answersData = [...answerData.value];
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
  GetQuestion();
  GetTotalAnswer();
  GetAvgTime();
  GetMostType();
  GetQuestionTime();
  loadChart();
  loadStats();
};

onMounted(() => {
  GetQuestion();
  GetTotalAnswer();
  GetAvgTime();
  GetMostType();
  GetQuestionTime();
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
            :value="
              avgWaitingTime !== 'Not Answered Yet'
                ? avgWaitingTime + ''
                : 'No Questions Asked'
            "
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
            title="Most Type"
            :value="MostType !== 'None' ? MostType + '' : 'Not Asked Yet'"
            description="<span
                    class='text-sm font-weight-bolder text-primary'
                    ></span> Most Type Asked"
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

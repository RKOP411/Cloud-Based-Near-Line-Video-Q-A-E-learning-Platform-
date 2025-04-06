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

import { useStore } from "vuex";
import { computed } from "vue";
const store = useStore();
// state
const lan = computed(() => store.state.lan);
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
// console.log("UserID: " + UserID);

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
      if (optionsSelect.value === "month") {
        labelsData.value = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];

        let weekCount = {
          "Week 1": 0,
          "Week 2": 0,
          "Week 3": 0,
          "Week 4": 0,
          "Week 5": 0,
        };

        // Get the current month's date
        const today = new Date(); // Use the current date
        const currentMonth = today.getMonth(); // Current month (0-11)
        const currentYear = today.getFullYear(); // Current year

        // Calculate how many days in the current month
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Iterate over this month's questions and count the weeks
        data.ThisMonthQuestion.forEach((question) => {
          const uploadDate = new Date(question.UploadTime);

          // Check if the upload date is in the specified month and year
          if (
        uploadDate.getFullYear() === currentYear &&
        uploadDate.getMonth() === currentMonth
          ) {
        // Calculate the week of the month
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const firstDayOfMonthOffset = firstDayOfMonth.getDay(); // Day of the week for the 1st of the month

        // Calculate the week of the month
        const weekOfMonth = Math.ceil(
          (uploadDate.getDate() + firstDayOfMonthOffset) / 7
        );

        // Increment the corresponding week count based on weekOfMonth
        switch (weekOfMonth) {
          case 1:
            weekCount["Week 1"]++;
            break;
          case 2:
            weekCount["Week 2"]++;
            break;
          case 3:
            weekCount["Week 3"]++;
            break;
          case 4:
            weekCount["Week 4"]++;
            break;
          case 5:
            weekCount["Week 5"]++;
            break;
        }
          }
        });

        questionData.value = Object.values(weekCount);

        // Reset weekCount for answers
        weekCount = {
          "Week 1": 0,
          "Week 2": 0,
          "Week 3": 0,
          "Week 4": 0,
          "Week 5": 0,
        };

        // Iterate over this month's answers and count the weeks
        data.ThisMonthAnswer.forEach((answer) => {
          const uploadDate = new Date(answer.UploadTime);

          // Check if the upload date is in the specified month and year
          if (
        uploadDate.getFullYear() === currentYear &&
        uploadDate.getMonth() === currentMonth
          ) {
        // Calculate the week of the month
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const firstDayOfMonthOffset = firstDayOfMonth.getDay(); // Day of the week for the 1st of the month

        // Calculate the week of the month
        const weekOfMonth = Math.ceil(
          (uploadDate.getDate() + firstDayOfMonthOffset) / 7
        );

        // Increment the corresponding week count based on weekOfMonth
        switch (weekOfMonth) {
          case 1:
            weekCount["Week 1"]++;
            break;
          case 2:
            weekCount["Week 2"]++;
            break;
          case 3:
            weekCount["Week 3"]++;
            break;
          case 4:
            weekCount["Week 4"]++;
            break;
          case 5:
            weekCount["Week 5"]++;
            break;
        }
          }
        });

        answerData.value = Object.values(weekCount);
      } else if (optionsSelect.value === "week") {
        labelsData.value = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        let dayCount = {
          Mon: 0,
          Tue: 0,
          Wed: 0,
          Thu: 0,
          Fri: 0,
          Sat: 0,
          Sun: 0,
        };
        data.ThisWeekQuestion.forEach((question) => {
          const uploadDate = new Date(question.UploadTime);
          const dayIndex = uploadDate.getUTCDay();

          // Map the index to the correct day
          switch (dayIndex) {
            case 0:
              dayCount.Sun++;
              break;
            case 1:
              dayCount.Mon++;
              break;
            case 2:
              dayCount.Tue++;
              break;
            case 3:
              dayCount.Wed++;
              break;
            case 4:
              dayCount.Thu++;
              break;
            case 5:
              dayCount.Fri++;
              break;
            case 6:
              dayCount.Sat++;
              break;
          }
        });

        questionData.value = Object.values(dayCount);

        dayCount = {
          Mon: 0,
          Tue: 0,
          Wed: 0,
          Thu: 0,
          Fri: 0,
          Sat: 0,
          Sun: 0,
        };
        data.ThisWeekAnswer.forEach((answer) => {
          const uploadDate = new Date(answer.UploadTime);
          const dayIndex = uploadDate.getUTCDay();

          // Map the index to the correct day
          switch (dayIndex) {
            case 0:
              dayCount.Sun++;
              break;
            case 1:
              dayCount.Mon++;
              break;
            case 2:
              dayCount.Tue++;
              break;
            case 3:
              dayCount.Wed++;
              break;
            case 4:
              dayCount.Thu++;
              break;
            case 5:
              dayCount.Fri++;
              break;
            case 6:
              dayCount.Sat++;
              break;
          }
        });
        answerData.value = Object.values(dayCount);
      } else {
        labelsData.value = [];
        questionData.value = [];
        answerData.value = [];
        data.forEach((item) => {
          labelsData.value.push(item.Time);
          questionData.value.push(item.QuestionCount);
          answerData.value.push(item.AnswerGetCount);
        });
      }
      // console.log(labelsData.value);
      // console.log(questionData.value);
      // console.log(answerData.value);
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
  fetch(`${AvgWaitingTime}/${UserID}/${optionsSelect.value}`, {
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
      console.log("Average Waiting Time: " + avgWaitingTime.value);
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
          <option selected value="total">
            {{ lan === "zh" ? "总计" : lan === "zh-TW" ? "總計" : "Total" }}
          </option>
          <option value="month">
            {{ lan === "zh" ? "月" : lan === "zh-TW" ? "月" : "Month" }}
          </option>
          <option value="week">
            {{ lan === "zh" ? "周" : lan === "zh-TW" ? "週" : "Week" }}
          </option>
        </select>
      </div>
      <div class="row">
        <div class="col-lg-3 col-md-6 col-12">
          <mini-statistics-card
            :title="
              lan === 'zh'
                ? '收到的答案'
                : lan === 'zh-TW'
                  ? '收到的答案'
                  : 'Received Answers'
            "
            :value="totalAnswers"
            :description="
              '<span class=\'text-sm font-weight-bolder text-success\'></span> ' +
              (lan === 'zh'
                ? '收到的答案数量'
                : lan === 'zh-TW'
                  ? '收到的答案數量'
                  : 'Answers Received Number')
            "
            :icon="{
              component: 'fa fa-question',
              background: 'bg-gradient-primary',
              shape: 'rounded-circle',
            }"
          />
        </div>
        <div class="col-lg-3 col-md-6 col-12">
          <mini-statistics-card
            :title="
              lan === 'zh'
                ? '提出的问题'
                : lan === 'zh-TW'
                  ? '提出的問題'
                  : 'Questions Asked'
            "
            :value="totalQuestions"
            :description="
              '<span class=\'text-sm font-weight-bolder text-info\'></span> ' +
              (lan === 'zh'
                ? '提出的问题数量'
                : lan === 'zh-TW'
                  ? '提出的問題數量'
                  : 'Questions Asked Number')
            "
            :icon="{
              component: 'fa fa-question-circle',
              background: 'bg-gradient-info',
              shape: 'rounded-circle',
            }"
          />
        </div>
        <div class="col-lg-3 col-md-6 col-12">
          <mini-statistics-card
            :title="
              lan === 'zh'
                ? '平均等待时间'
                : lan === 'zh-TW'
                  ? '平均等待时间'
                  : 'Average Waiting Time'
            "
            :value="
              avgWaitingTime !== 'Not Answered Yet'
                ? avgWaitingTime + ''
                : 'No Questions Asked'
            "
            :description="`<span
                class='text-sm font-weight-bolder text-warning'
                ></span> ${lan === 'zh' ? '等待时间' : lan === 'zh-TW' ? '平均等待时间' : 'Average Waiting Time'}`"
            :icon="{
              component: 'fa fa-clock',
              background: 'bg-gradient-warning',
              shape: 'rounded-circle',
            }"
          />
        </div>
        <div class="col-lg-3 col-md-6 col-12">
          <mini-statistics-card
            :title="
              lan === 'zh'
                ? '最多类型'
                : lan === 'zh-TW'
                  ? '最多類型'
                  : 'Most Type'
            "
            :value="
              MostType !== 'None'
                ? MostType + ''
                : lan === 'zh'
                  ? '尚未詢問'
                  : lan === 'zh-TW'
                    ? '尚未詢問'
                    : 'Not Asked Yet'
            "
            :description="
              '<span class=\'text-sm font-weight-bolder text-success\'></span> ' +
              (lan === 'zh'
                ? '最多问题类型'
                : lan === 'zh-TW'
                  ? '最多問題類型'
                  : 'Most Asked Type')
            "
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

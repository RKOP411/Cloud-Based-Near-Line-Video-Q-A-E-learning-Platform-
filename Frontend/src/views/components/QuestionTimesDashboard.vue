<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-2 ms-auto d-flex justify-content-end">
        <select
          class="form-select text-white bg-primary"
          id="optionsSelect"
          @change="handleDurationChange"
          v-model="optionsSelect"
          style="width: 100px; margin-bottom: 3px"
        >
          <option selected value="total">Total</option>
          <option value="month">Month</option>
          <option value="week">Week</option>
        </select>
      </div>
      <div>
        <select
          class="form-select form-select-lg mb-3"
          @change="handleCourseChange"
          id="courseSelect"
          v-model="selectedCourseID"
        >
          <option
            v-for="(course, index) in Course"
            :key="index"
            :value="course.CourseID"
          >
            {{ course.CourseName }}
          </option>
        </select>
      </div>
    </div>
    <div class="col-lg card">
      <canvas id="barChart"></canvas>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { GetCourses, GetQuestionPerTimes } from "../../assets/Domain.js";
import Chart from "chart.js/auto";

export default {
  data() {
    return {
      optionsSelect: "total",
      Course: [],
      UserID: localStorage.getItem("UserID"),
      selectedCourseID: ref(""),
      question: ref([]),
      ans: ref([]),
      labelsData: ref([]),
    };
  },
  methods: {
    async GetQuestion() {
      fetch(
        `${GetQuestionPerTimes}/${this.selectedCourseID}/${this.optionsSelect}`
      )
        .then((response) => response.json())
        .then((data) => {
          //console.log(data);
          if (this.optionsSelect === "month") {
            this.labelsData = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];
            let monthCount = {
              Jan: 0,
              Feb: 0,
              Mar: 0,
              Apr: 0,
              May: 0,
              Jun: 0,
              Jul: 0,
              Aug: 0,
              Sep: 0,
              Oct: 0,
              Nov: 0,
              Dec: 0,
            };
            data.ThisMonthQuestion.forEach((question) => {
              const uploadDate = new Date(question.UploadTime);
              const monthIndex = uploadDate.getUTCMonth(); // Get the month index (0 = Jan, 1 = Feb, ..., 11 = Dec)

              // Map the index to the correct month
              switch (monthIndex) {
                case 0:
                  monthCount.Jan++;
                  break;
                case 1:
                  monthCount.Feb++;
                  break;
                case 2:
                  monthCount.Mar++;
                  break;
                case 3:
                  monthCount.Apr++;
                  break;
                case 4:
                  monthCount.May++;
                  break;
                case 5:
                  monthCount.Jun++;
                  break;
                case 6:
                  monthCount.Jul++;
                  break;
                case 7:
                  monthCount.Aug++;
                  break;
                case 8:
                  monthCount.Sep++;
                  break;
                case 9:
                  monthCount.Oct++;
                  break;
                case 10:
                  monthCount.Nov++;
                  break;
                case 11:
                  monthCount.Dec++;
                  break;
              }
            });

            this.question = Object.values(monthCount);
            monthCount = {
              Jan: 0,
              Feb: 0,
              Mar: 0,
              Apr: 0,
              May: 0,
              Jun: 0,
              Jul: 0,
              Aug: 0,
              Sep: 0,
              Oct: 0,
              Nov: 0,
              Dec: 0,
            };

            data.ThisMonthAnswer.forEach((answer) => {
              const uploadDate = new Date(answer.UploadTime);
              const monthIndex = uploadDate.getUTCMonth(); // Get the month index (0 = Jan, 1 = Feb, ..., 11 = Dec)

              // Map the index to the correct month
              switch (monthIndex) {
                case 0:
                  monthCount.Jan++;
                  break;
                case 1:
                  monthCount.Feb++;
                  break;
                case 2:
                  monthCount.Mar++;
                  break;
                case 3:
                  monthCount.Apr++;
                  break;
                case 4:
                  monthCount.May++;
                  break;
                case 5:
                  monthCount.Jun++;
                  break;
                case 6:
                  monthCount.Jul++;
                  break;
                case 7:
                  monthCount.Aug++;
                  break;
                case 8:
                  monthCount.Sep++;
                  break;
                case 9:
                  monthCount.Oct++;
                  break;
                case 10:
                  monthCount.Nov++;
                  break;
                case 11:
                  monthCount.Dec++;
                  break;
              }
            });
            this.ans = Object.values(monthCount);
          } else if (this.optionsSelect === "week") {
            this.labelsData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
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
            this.question = Object.values(dayCount);
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
              const dayIndex = uploadDate.getUTCDay(); // Get the day index (0 = Sun, 1 = Mon, ..., 6 = Sat)

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
            this.ans = Object.values(dayCount);

            // console.log("question: " + this.question);
            // console.log("ans: " + this.ans);
          } else {
            this.labelsData = data.map((item) => item.Time);
            this.question = data.map((item) => item.QuestionCount);
            this.ans = data.map((item) => item.AnswerGetCount);
          }
          this.initializeChart();
        });
    },
    async fetchCourses() {
      fetch(`${GetCourses}/${this.UserID}`)
        .then((response) => response.json())
        .then((data) => {
          this.Course = data;
          // Set the selectedCourseID to the first course, if available.
          if (this.Course.length > 0) {
            this.selectedCourseID = this.Course[0].CourseID;
          }
          console.log("selectedCourseID: " + this.selectedCourseID);
          this.getPushedData();
          this.GetQuestion();
        });
    },
    handleDurationChange(event) {
      this.optionsSelect = event.target.value;
      console.log("optionsSelect: " + this.optionsSelect);
      this.GetQuestion();
      this.initializeChart();
    },
    handleCourseChange() {
      this.selectedCourseID = event.target.value;
      // This method is kept as an update but v-model handles the changes.
      console.log("selectedCourseID: " + this.selectedCourseID);
      this.GetQuestion();
      this.initializeChart();
    },
    getPushedData() {
      if (
        this.$route.query.selectedCourseID &&
        this.$route.query.optionsSelect
      ) {
        this.selectedCourseID = this.$route.query.selectedCourseID;
        this.optionsSelect = this.$route.query.optionsSelect;
      }
    },
    initializeChart() {
      const ctx = document.getElementById("barChart").getContext("2d");

      // Destroy the existing chart instance if it exists
      if (this.chart) {
        this.chart.destroy();
      }

      let question = [];
      let ans = [];
      let labelsData = [];

      if (this.optionsSelect === "total") {
        labelsData = this.labelsData;
        question = this.question;
        ans = this.ans;
      } else if (this.optionsSelect === "month") {
        labelsData = this.labelsData;
        question = this.question;
        ans = this.ans;
      } else if (this.optionsSelect === "week") {
        labelsData = this.labelsData;
        question = this.question;
        ans = this.ans;
      }

      this.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labelsData,
          datasets: [
            {
              label: "Question",
              data: question,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
            {
              label: "Answer",
              data: ans,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Questions per Time",
              font: {
                size: 24,
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      });
    },
  },

  mounted() {
    this.fetchCourses();
    this.initializeChart();
  },
};
</script>

<style scoped>
/* Add any styles you need here */
</style>

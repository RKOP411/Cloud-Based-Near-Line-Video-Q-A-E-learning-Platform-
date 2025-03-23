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
          this.labelsData = data.map((item) => item.Time);
          this.question = data.map((item) => item.QuestionCount);
          this.ans = data.map((item) => item.AnswerGetCount);
          if (this.optionsSelect === "week") {
            const results = data[data.length - 1];
            results.forEach((item) => {
              this.labelsData.push(item.Time);
              this.question.push(item.QuestionCount);
              this.ans.push(item.AnswerGetCount);
            });
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

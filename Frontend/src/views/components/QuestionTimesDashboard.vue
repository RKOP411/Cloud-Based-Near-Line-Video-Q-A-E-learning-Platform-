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
import { GetCourses } from "../../assets/Domain.js";
import Chart from "chart.js/auto";

export default {
  data() {
    return {
      optionsSelect: "total",
      Course: [],
      UserID: localStorage.getItem("UserID"),
      selectedCourseID: ref(""),
    };
  },
  methods: {
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
        });
    },
    handleDurationChange(event) {
      this.optionsSelect = event.target.value;
      console.log("optionsSelect: " + this.optionsSelect);
      this.initializeChart();
    },
    handleCourseChange() {
      this.selectedCourseID = event.target.value;
      // This method is kept as an update but v-model handles the changes.
      console.log("selectedCourseID: " + this.selectedCourseID);
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

      let data = [];
      let labelsData = [];

      if (this.optionsSelect === "total") {
        labelsData = [
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
        data = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];
      } else if (this.optionsSelect === "month") {
        labelsData = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
        data = [15, 12, 24, 1, 32];
      } else if (this.optionsSelect === "week") {
        labelsData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        data = [5, 10, 15, 20, 25, 30, 35];
      }

      this.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labelsData,
          datasets: [
            {
              label: "Question",
              data: data,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
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

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
          @change="handleCourseChange($event)"
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

    <div class="table-responsive card">
        <table class="table table-bordered table-striped">
            <thead class="table-primary">
                <tr>
                    <th scope="col">User Name</th>
                    <th scope="col">Question Count</th>
                    <th scope="col">Engagement (%)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="AllAksing.length === 0">
                    <td colspan="3" class="text-center">No Record Yet</td>
                </tr>
                <tr v-else v-for="(user, index) in AllAksing" :key="index">
                    <td>{{ user.UserName }}</td>
                    <td>{{ user.question_count }}</td>
                    <td>{{ user.Engagement || 0 }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import {
  GetCourses,
  GetAllAsking,
  GetEngagement,
} from "../../assets/Domain.js";

export default {
  data() {
    return {
      optionsSelect: "total",
      Course: [],
      UserID: localStorage.getItem("UserID"),
      selectedCourseID: ref(""),
      AllAksing: ref([]),
    };
  },
  methods: {
    async GetEngagement(UserID) {
      fetch(
        `${GetEngagement}/${UserID}/${this.selectedCourseID}/${this.optionsSelect}`
      )
        .then((response) => response.json())
        .then((data) => {
          const userIndex = this.AllAksing.findIndex(
            (user) => user.UserID === UserID
          );
          if (userIndex !== -1) {
            this.AllAksing[userIndex].count = data;

            if (data && data[0] && data[0].joined_count !== undefined) {
              this.AllAksing[userIndex].Engagement =
                data[0].joined_count / this.AllAksing[userIndex].total_count;
              this.AllAksing[userIndex].Engagement = Math.round(
                this.AllAksing[userIndex].Engagement * 100
              );
            } else {
              this.AllAksing[userIndex].Engagement = 0; // Default value if data is invalid
            }
          }
        });
    },
    async GetAsking() {
      fetch(
        `${GetAllAsking}/${this.UserID}/${this.selectedCourseID}/${this.optionsSelect}`
      )
        .then((response) => response.json())
        .then((data) => {
          // Combine users with the same UserID
          const combinedData = data.reduce((acc, current) => {
            // Check if the user already exists in the accumulator
            const existingUser = acc.find(
              (user) => user.UserID === current.UserID
            );

            if (existingUser) {
              // If user exists, add to their question_count
              existingUser.question_count += current.question_count;
            } else {
              // If user does not exist, add them to the accumulator
              acc.push({ ...current });
            }

            return acc;
          }, []);
          this.AllAksing = combinedData;
          this.AllAksing.forEach(async (user) => {
            await this.GetEngagement(user.UserID);
          });
          console.log("AllAksing", this.AllAksing);
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

          //Get Data
          this.GetAsking();
        });
    },
    handleDurationChange(event) {
      this.optionsSelect = event.target.value;
      console.log("optionsSelect: " + this.optionsSelect);
      this.GetAsking();
    },
    handleCourseChange(event) {
      // This method is kept as an update but v-model handles the changes.
      this.selectedCourseID = event.target.value;
      console.log("selectedCourseID: " + this.selectedCourseID);
      this.GetAsking();
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
  },
  mounted() {
    this.fetchCourses();
  },

};
</script>

<style scoped>
/* Add any styles you need here */
</style>

<template>
  <main>
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <p class="mb-0">Create Chat</p>
              </div>
            </div>
            <div class="card-body">
              <p class="text-uppercase text-sm">Chat Information</p>
              <div class="row">
                <div class="col-md-9 mb-3">
                  <label for="example-text-input" class="form-control-label"
                    >Course Name *</label
                  >
                  <input
                    class="form-control"
                    type="text"
                    value=""
                    placeholder="Input your Chat Gruop Name..."
                    v-model="CourseName"
                  />
                </div>

                <div class="col-md-9 mb-3">
                  <label for="example-text-input" class="form-control-label"
                    >Semester</label
                  >
                  <label for="year-select" class="form-control-label"
                    >Select Year</label
                  >
                  <select
                    id="year-select"
                    class="form-control"
                    v-model="selectedYear"
                  >
                    <option disabled value="">Select a year</option>
                    <option v-for="year in years" :key="year" :value="year">
                      {{ year }}
                    </option>
                  </select>

                  <label for="semester-select" class="form-control-label"
                    >Select Semester</label
                  >
                  <select
                    id="semester-select"
                    class="form-control"
                    v-model="selectedSemester"
                  >
                    <option disabled value="">Select a semester</option>
                    <option
                      v-for="semester in semesters"
                      :key="semester"
                      :value="semester"
                    >
                      {{ semester }}
                    </option>
                  </select>
                </div>
              </div>
              <hr class="horizontal dark" />
              <button type="button" class="btn btn-success" @click="CreateCourse">Create</button>
            </div>
            <hr class="horizontal dark" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import { ref } from "vue";
import {
  CreateCourse,
} from "../assets/Domain.js";
export default {
  setup() {
    // Reactive variables for year and semester selection
    const selectedYear = ref("");
    const selectedSemester = ref("");
    const CourseName = ref("");

    // Array of semesters
    const semesters = ["S1", "S2", "S3", "S4", "S5"];

    // Method to get years from the current year to the next 9 years
    const getYears = () => {
      const currentYear = new Date().getFullYear();
      return Array.from({ length: 4 }, (_, i) => currentYear + i);
    };

    // Reactive variable for years
    const years = ref(getYears());

    return {
      CourseName,
      selectedYear,
      selectedSemester,
      years,
      semesters,
    };
  },
  methods: {
    async CreateCourse() {
      const UserName = localStorage.getItem("UserName");
      fetch(CreateCourse, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CourseName: this.CourseName,
          TeacherName: UserName,
          Semester: this.selectedYear + " " + this.selectedSemester,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        });
    },
  },
};
</script>

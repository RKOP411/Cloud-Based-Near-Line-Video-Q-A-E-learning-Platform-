<template>
  <main>
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header pb-0">
              <div class="alert alert-danger" role="alert" v-if="errmsg">
                {{ errmsg }}
              </div>
              <div class="d-flex align-items-center">
                <p class="mb-0">Create Course</p>
              </div>
            </div>
            <div class="card-body">
              <p class="text-uppercase text-sm">Course Information</p>
              <div class="row">
                <div class="col-md-9 mb-3">
                  <label for="example-text-input" class="form-control-label"
                    >Course ID *</label
                  >
                  <input
                    class="form-control"
                    type="text"
                    value=""
                    placeholder="eg  COMP1234"
                    v-model="CourseID"
                  />
                  <label for="example-text-input" class="form-control-label"
                    >Course Name *</label
                  >
                  <input
                    class="form-control"
                    type="text"
                    value=""
                    placeholder="Input your Course Name..."
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
              <button
                type="button"
                class="btn btn-success"
                @click="CreateCourse"
              >
                Create
              </button>
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
import { CreateCourse, GetUserByEmail } from "../assets/Domain.js";
export default {
  data() {
    return {
      errmsg: "",
    };
  },
  setup() {
    // Reactive variables for year and semester selection
    const selectedYear = ref("");
    const selectedSemester = ref("");
    const CourseName = ref("");
    const CourseID = ref("");
    const email = localStorage.getItem("Email");
    

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
      CourseID,
      CourseName,
      selectedYear,
      selectedSemester,
      years,
      semesters,
      email,
    };
  },
  methods: {
    async GetUserByEmail() {
      const response = await fetch(GetUserByEmail + this.email, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const UserData = await response.json();
      return UserData[0];
    },

    async CreateCourse() {
      const UserID = localStorage.getItem("UserID");
      if (
        this.CourseName == "" ||
        this.selectedYear == "" ||
        this.selectedSemester == "" ||
        this.CourseID == ""
      ) {
        this.errmsg = "Please fill all fields";
        return;
      }
      const courseIdPattern = /^[A-Za-z]{1,6}\d{1,6}$/;
      if (!courseIdPattern.test(this.CourseID)) {
        this.errmsg = "Course ID must be 1-6 characters followed by 1-6 numbers, e.g., COMP4110";
        return;
      }
      this.CourseID = this.CourseID.toUpperCase();
      const Data = await this.GetUserByEmail();
      const UserName = Data.UserName;
      let TeacherRank = "";

      if (Data.T_rank == null) {
        TeacherRank = "Inst";
      } else {
        TeacherRank = Data.T_rank;
      }

      fetch(CreateCourse, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CourseName: this.CourseID +" "+this.CourseName,
          TeacherName: TeacherRank + " " + UserName,
          Semester: this.selectedYear + " " + this.selectedSemester,
          UserID: UserID,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.$router.push("/tables");
        });
    },
  },
};
</script>

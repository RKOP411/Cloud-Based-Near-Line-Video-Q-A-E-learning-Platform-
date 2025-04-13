<template>
  <main>
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header pb-0">
              
              <div class="d-flex align-items-center">
                
                <p class="mb-0">Create Queue</p>
              </div>
            </div>
            <div class="card-body">
              <div v-if="errmsg" class="alert alert-danger" role="alert"></div>
              <ul class="nav nav-tabs mb-3">
                <li class="nav-item">
                  <a
                    class="'nav-link' active"
                    aria-current="page"
                    href="#"
                    @click="CheangeToLink"
                    >Link</a
                  >
                </li>
              </ul>
              <!-- Course Selete Bar-->
              <div class="col-md-9 mb-4">
                <label class="form-control-label">Course</label>
                <select
                  class="form-select"
                  aria-label="Select Course"
                  v-model="course"
                  :disabled="Course_items.length === 0"
                >
                  <option
                    v-if="Course_items.length === 0"
                    value=""
                    disabled
                    selected
                  >
                    No courses available, Please create a new course
                  </option>
                  <option
                    v-for="course in Course_items"
                    :key="course.CourseID"
                    :value="course.CourseID"
                  >
                    {{ course.CourseName }}
                  </option>
                </select>
              </div>
              <!-- Course Selete Bar End-->
              <!--Queue Code-->
              <div class="row">
                <div class="col-md-9 mb-4">
                  <label class="form-control-label">Time Out</label>
                  <select class="form-select" v-model="timeout">
                    <option value="1">1 day</option>
                    <option value="3">3 days</option>
                    <option value="7">7 days</option>
                  </select>
                </div>
                <!---->
              </div>
              <hr class="horizontal dark" />
              <button type="button" class="btn btn-success" @click="CreateQueue">Create</button>
            </div>
            <hr class="horizontal dark" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import { GetCoursesByUserID,CreateQueue_list } from "../../assets/Domain.js";
export default {
  data() {
    return {
      course: "",
      timeout: "1",
      Course_items: [],
      errmsg: "",
      showAccessCode: false,
      UserID : localStorage.getItem("UserID"),
    };
  },
  methods: {
    dayTosecond(day) {
      return day * 24 * 60 * 60;
    },
    async getCourse() {
      fetch(`${GetCoursesByUserID}${this.UserID}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.Course_items = data;
        });
    },
    async CreateQueue(){
      if(this.course === ""){
        this.errmsg = "Please select a course";
        return;
      }
      const response = await fetch(CreateQueue_list,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CourseID: this.course,
          TimeOut: this.dayTosecond(this.timeout),
          CreatorID: localStorage.getItem("UserID"),
        }),
      });
      if (!response.ok) {
        this.errmsg = "Failed to create queue";
        return;
      }
      this.showAccessCode = true;
      this.$router.push({
        path: "/managequeue",
        query: { showAccessCode: this.showAccessCode }
      });
    }
  },
  mounted() {
    this.getCourse();
  },
};
</script>

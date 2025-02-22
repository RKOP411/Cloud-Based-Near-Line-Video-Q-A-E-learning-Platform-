<template>
  <div class="card">
    <div class="card-header pb-0">
      <div class="d-flex align-items-center">
        <h6>Your Course</h6>
        <argon-button
          v-if="role !== 'Student'"
          type="button"
          class="btn btn-success mb-3 ms-auto"
          title="Create Course"
          :role="role"
          @click="goToCreateCourse"
        >
          <i class="fa fa-plus" aria-hidden="true"></i>
        </argon-button>
      </div>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Course
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Semester
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Forum Nubmer
              </th>
              <th class="text-secondary opacity-7"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="items.length === 0">
              <td
                colspan="4"
                class="text-center text-secondary text-xs font-weight-bold"
              >
                No courses available.
              </td>
            </tr>
            <tr v-else v-for="(item, index) in items" :key="index">
              <td>
                <div class="d-flex px-2 py-1">
                  <div>
                    <i
                      class="avatar-sm me-3 fa fa-graduation-cap icon"
                      aria-hidden="true"
                      style="font-size: 20px"
                    ></i>
                  </div>
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{ item.CourseName }}</h6>
                    <p class="text-xs text-secondary mb-0">
                      {{ item.TeacherName }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">{{
                  item.Semester
                }}</span>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">{{
                  item.ForumNum
                }}</span>
              </td>
              <td class="align-middle">
                <!-- <button class="btn btn-danger btn-sm" style="margin-right: 6px" @click="removeCourse(item.CourseID)">
                  Remove
                </button> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <br />
</template>
<script>
import { ref } from "vue";
import { GetCoursesByUserID, GetUserByEmail } from "../../assets/Domain.js";
import { useRouter } from "vue-router";

const router = useRouter();
let Email = localStorage.getItem("Email");

if (Email === null || Email === "") {
  router.push("/signin");
}

export default {
  data() {
    return {
      items: [],
      role: ref(""),
    };
  },
  setup() {
    let Email = localStorage.getItem("Email");
    if (Email === null || Email === "") {
      this.$router.push("/signin");
    }
    const UserID = localStorage.getItem("UserID");
    return { Email, UserID };
  },
  methods: {
    
    async getCourse() {
      fetch(GetCoursesByUserID + this.UserID)
        .then((response) => response.json())
        .then((data) => {
          this.items = data;
        });
    },
    goToCreateCourse() {
      this.$router.push("/createcourse");
    },
    async GetUserRoleByEmail() {
      const response = await fetch(GetUserByEmail + this.Email, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const UserData = await response.json();
      return UserData[0].Role; //Only get the Role here
    },
  },
  async mounted() {
    this.getCourse();
    this.role = await this.GetUserRoleByEmail();
  },
};
</script>
<style>
.icon {
  align-items: center;
  justify-content: center;
  display: flex;
  padding-top: 8px;
}
</style>

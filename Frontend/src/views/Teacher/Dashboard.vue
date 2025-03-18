<script setup>
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import GradientLineChart from "@/examples/Charts/GradientLineChart.vue";
import CategoriesList from "../components/CategoriesList.vue";

import { useRouter } from "vue-router";
const router = useRouter();
let Email = localStorage.getItem("Email");

if (Email === null || Email === "") {
  router.push("/signin");
}
</script>
<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-2 ms-auto d-flex justify-content-end">
        <select
          class="form-select"
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
        >
          <option
            v-for="(course, index) in Course"
            :key="index"
            :value="course.CourseName"
          >
            {{ course.CourseName }}
          </option>
        </select>
      </div>
      <div class="col-lg-12">
        <div class="row">
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="Number of Answers"
              :value="NumberofAnswers > 0 ? NumberofAnswers : '0'"
              description="<span
                class='text-sm font-weight-bolder text-success'
                ></span> Total Answers Submitted"
              :icon="{
                component: 'fa fa-question',
                background: 'bg-gradient-primary',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="Answer Duration"
              :value="AvgAnswerTimer"
              description="<span
                class='text-sm font-weight-bolder text-success'
                ></span>Timer Duration for Answer"
              :icon="{
                component: 'fa fa-users',
                background: 'bg-gradient-danger',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="Most Topic"
              value="vertex-cover"
              description="Today's Topic: '<span
                class='text-sm font-weight-bolder text-success'
                >graph theory</span>'"
              :icon="{
                component: 'ni ni-paper-diploma',
                background: 'bg-gradient-success',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="Common Type"
              :value="MostTypeAsked"
              description="Highest Type Inquiry Rates"
              :icon="{
                component: 'ni ni-tag',
                background: 'bg-gradient-warning',
                shape: 'rounded-circle',
              }"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12 mb-lg">
            <!-- line chart -->
            <div class="card z-index-2">
              <gradient-line-chart
                v-if="QuestionTimesData.value && QuestionTimesLabel.value"
                id="chart-line"
                title="Question Times"
                :chart="{
                  labels: QuestionTimesLabel.value,
                  datasets: [
                    {
                      label: 'Question Times',
                      data: QuestionTimesData.value,
                      borderColor: 'rgba(75, 192, 192, 1)',
                      backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    },
                  ],
                  options: {
                    responsive: true,
                    scales: {
                      y: {
                        title: {
                          display: true,
                          text: 'Number of Questions',
                        },
                        beginAtZero: true,
                      },
                      x: {
                        title: {
                          display: true,
                          text: 'Weeks',
                        },
                      },
                    },
                  },
                }"
              />
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-7 mb-lg-0 mb-4">
            <div class="card">
              <div class="p-3 pb-0 card-header">
                <div class="d-flex justify-content-between">
                  <h6 class="mb-2">Participation Levels</h6>
                </div>
              </div>
              <div class="table-responsive">
                <table class="table align-items-center">
                  <tbody>
                    <tr v-for="index in 5" :key="index">
                      <td class="w-30">
                        <div class="px-2 py-1 d-flex align-items-center">
                          <i class="fa fa-user-circle" aria-hidden="true"></i>
                          <div class="ms-4">
                            <p class="mb-0 text-xs font-weight-bold">
                              Student:
                            </p>
                            <h6 class="mb-0 text-sm">
                              {{ Top5[index - 1]?.UserName || "No record" }}
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="text-center">
                          <p class="mb-0 text-xs font-weight-bold">Question:</p>
                          <h6 class="mb-0 text-sm">
                            {{ Top5[index - 1]?.question_count || "0" }}
                          </h6>
                        </div>
                      </td>
                      <td class="text-sm align-middle">
                        <div class="text-center col">
                          <p class="mb-0 text-xs font-weight-bold">
                            Engagement:
                          </p>
                          <h6 class="mb-0 text-sm">
                            {{
                              Top5[index - 1]?.Engagement !== undefined
                                ? Top5[index - 1].Engagement + "%"
                                : "NA"
                            }}
                          </h6>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="col-lg-5">
            <categories-list
              :categories="[
                {
                  icon: {
                    component: 'fa fa-book',
                    background: 'dark',
                  },
                  label: 'Theory',
                  description: `Total: <strong>${CoursesCategoryCount.theory || 0}</strong>`,
                },
                {
                  icon: {
                    component: 'fa fa-flask',
                    background: 'dark',
                  },
                  label: 'Lab Work',
                  description: `Total: <strong>${CoursesCategoryCount.labWork || 0}</strong>`,
                },
                {
                  icon: {
                    component: 'fa fa-bug',
                    background: 'dark',
                  },
                  label: 'Debugging',
                  description: `Total: <strong>${CoursesCategoryCount.debugging || 0}</strong>`,
                },
                {
                  icon: {
                    component: 'fa fa-tasks',
                    background: 'dark',
                  },
                  label: 'Assignments',
                  description: `Total: <strong>${CoursesCategoryCount.assignments || 0}</strong>`,
                },
              ]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  GetCourses,
  GetTop5Asking,
  GetEngagement,
  GetCategoryCount,
  getAnswer_QA_AvgTime,
  GetNumAns,
  GetQuestionTimes,
} from "../../assets/Domain.js";
import { ref } from "vue";

export default {
  data() {
    return {
      UserID: localStorage.getItem("UserID"),
      Course: ref([]),
      Top5: ref([]),
      CoursesCategoryCount: ref([]),
      selectedCourseID: "",
      MostTypeAsked: ref(""),
      AvgAnswerTimer: ref(""),
      NumberofAnswers: ref(""),
      QuestionTimesData: ref([]),
      QuestionTimesLabel: ref([]),
      optionsSelect: "total",
    };
  },

  
  methods: {
    async GetQuestionTimes() {
      fetch(`${GetQuestionTimes}/${this.selectedCourseID}/${this.optionsSelect}`)
        .then((response) => response.json())
        .then((data) => {
          this.QuestionTimesLabel.value = data.map(
            (item) => `${item.LastUploadTime}`
          );
            this.QuestionTimesLabel.value = data.map(
            (item) => new Date(item.LastUploadTime).toISOString().split('T')[0]
            );
          this.QuestionTimesData.value = data.map((item) => item.QuestionCount);

          // console.log("Question Times Data: ", [
          //   ...this.QuestionTimesData.value,
          // ]); // Spread to log as array
          // console.log("Question Times Label: ", [
          //   ...this.QuestionTimesLabel.value,
          // ]);
        });
    },
    async GetNumAnswers() {
      fetch(`${GetNumAns}/${this.UserID}/${this.selectedCourseID}/${this.optionsSelect}`)
        .then((response) => response.json())
        .then((data) => {
          this.NumberofAnswers = data.Answer_Count;
          if (this.NumberofAnswers === null) {
            this.NumberofAnswers = 0;
          }
          //console.log("Number of Answers: ", this.NumberofAnswers);
        });
    },
    async getAnswerTImer() {
      fetch(`${getAnswer_QA_AvgTime}/${this.UserID}/${this.selectedCourseID}/${this.optionsSelect}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.Avg) {
            this.AvgAnswerTimer = parseFloat(data.Avg).toFixed(2);
            if (this.AvgAnswerTimer < 60) {
              this.AvgAnswerTimer += " Sec";
            } else if (
              this.AvgAnswerTimer >= 60 &&
              this.AvgAnswerTimer < 3600
            ) {
              this.AvgAnswerTimer =
                (this.AvgAnswerTimer / 60).toFixed(2) + " Min";
            } else if (
              this.AvgAnswerTimer >= 3600 &&
              this.AvgAnswerTimer < 86400
            ) {
              this.AvgAnswerTimer =
                (this.AvgAnswerTimer / 3600).toFixed(2) + " Hour";
            } else {
              this.AvgAnswerTimer =
                (this.AvgAnswerTimer / 86400).toFixed(2) + " Day";
            }
          } else {
            this.AvgAnswerTimer = "Not Answered Yet";
          }
        })
        .catch((error) => {
          console.error("Error fetching average answer time:", error);
          this.AvgAnswerTimer = "No Answered Yet";
        });
    },
    async GetCoursesCategories() {
      fetch(
        `${GetCategoryCount}/${this.selectedCourseID}/${this.optionsSelect}`
      )
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          this.CoursesCategoryCount = data;
          //console.log(this.CoursesCategoryCount);
          this.MostTypeAsked = Object.keys(data).reduce((a, b) =>
            data[a] > data[b] ? a : b
          );
          if (data[this.MostTypeAsked] === 0) {
            this.MostTypeAsked = "None";
          } else {
            switch (this.MostTypeAsked) {
              case "theory":
                this.MostTypeAsked = "Theory";
                break;
              case "labWork":
                this.MostTypeAsked = "Lab Work";
                break;
              case "debugging":
                this.MostTypeAsked = "Debugging";
                break;
              case "assignments":
                this.MostTypeAsked = "Assignments";
                break;
              default:
                this.MostTypeAsked = "Unknown";
            }
          }
          //console.log(this.MostTypeAsked);
        });
    },
    async GetCourses() {
      fetch(`${GetCourses}/${this.UserID}`)
        .then((response) => response.json())
        .then((data) => {
          this.Course = data.map((course) => course);
          //console.log(this.Course);
          this.selectedCourseID = data[0].CourseID;
          //console.log("Selected Course ID: ", this.selectedCourseID);

          //Get Dashboard Data **
          this.GetTop5();
          this.GetCoursesCategories();
          this.getAnswerTImer();
          this.GetNumAnswers();
          this.GetQuestionTimes();
        });
    },

    async GetEngagement(UserID) {
      fetch(`${GetEngagement}/${UserID}/${this.selectedCourseID}/${this.optionsSelect}`)
        .then((response) => response.json())
        .then((data) => {
          const userIndex = this.Top5.findIndex(
            (user) => user.UserID === UserID
          );
          if (userIndex !== -1) {
            this.Top5[userIndex].count = data;
            //console.log("Top5", this.Top5);

            this.Top5[userIndex].Engagement =
              this.Top5[userIndex].count[0].joined_count /
              this.Top5[userIndex].total_count;
            this.Top5[userIndex].Engagement = Math.round(
              this.Top5[userIndex].Engagement * 100
            );
           // console.log("Top5_2", this.Top5);
          }
        });
    },
    async GetTop5() {
      // console.log("Selected Course ID: ", this.selectedCourseID);
      // console.log("User ID: ", this.UserID);
      fetch(
        `${GetTop5Asking}/${this.UserID}/${this.selectedCourseID}/${this.optionsSelect}`
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

          // Assign the combined data to Top5
          this.Top5 = combinedData;

          // Loop through Top5 and fetch engagement for each user
          this.Top5.forEach(async (user) => {
            await this.GetEngagement(user.UserID);
          });
        });
    },
    handleCourseChange(event) {
      const selectedCourse = this.Course.find(
        (course) => course.CourseName === event.target.value
      );
      this.selectedCourseID = selectedCourse ? selectedCourse.CourseID : "";
      //console.log("Selected Course: ", selectedCourse);
      //console.log("Selected Course ID: ", this.selectedCourseID);

      //Change the data based on the selected course **
      this.GetTop5();
      this.GetCoursesCategories();
      this.getAnswerTImer();
      this.GetNumAnswers();
      this.GetQuestionTimes();
    },
    handleDurationChange(event) {
      console.log("Duration changed to: ", event.target.value);
      this.GetTop5();
      this.GetCoursesCategories();
      this.getAnswerTImer();
      this.GetNumAnswers();
      this.GetQuestionTimes();
    },
  },

  mounted() {
    this.GetCourses();
  },
};
</script>

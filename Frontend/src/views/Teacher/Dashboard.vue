<script setup>
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import GradientLineChart from "@/examples/Charts/GradientLineChart.vue";
import CategoriesList from "../components/CategoriesList.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed } from "vue";
const store = useStore();
// state
const lan = computed(() => store.state.lan);
const router = useRouter();
let Email = localStorage.getItem("Email");

if (Email === null || Email === "") {
  router.push("/signin");
}

// // Translation function
// const translate = (key) => {
//   const translations = {
//     "Number of Answers": {
//       zh: "回答數量",
//       "zh-TW": "回答數量",
//       en: "Number of Answers",
//     },
//     "Total Answers Submitted": {
//       zh: "提交的總回答",
//       "zh-TW": "提交的總回答",
//       en: "Total Answers Submitted",
//     },
//     "Answer Duration": {
//       zh: "回答時長",
//       "zh-TW": "回答時長",
//       en: "Answer Duration",
//     },
//     "Timer Duration for Answer": {
//       zh: "回答的計時器時長",
//       "zh-TW": "回答的計時器時長",
//       en: "Timer Duration for Answer",
//     },
//     "Most Topic": {
//       zh: "最多的主題",
//       "zh-TW": "最多的主題",
//       en: "Most Topic",
//     },
//     "Today's Topic": {
//       zh: "今天的主題",
//       "zh-TW": "今天的主題",
//       en: "Today's Topic",
//     },
//     "Common Type": {
//       zh: "常見類型",
//       "zh-TW": "常見類型",
//       en: "Common Type",
//     },
//     "Highest Type Inquiry Rates": {
//       zh: "最高類型查詢率",
//       "zh-TW": "最高類型查詢率",
//       en: "Highest Type Inquiry Rates",
//     },
//     "Participation Levels": {
//       zh: "參與水平",
//       "zh-TW": "參與水平",
//       en: "Participation Levels",
//     },
//     Student: {
//       zh: "學生",
//       "zh-TW": "學生",
//       en: "Student",
//     },
//     Question: {
//       zh: "問題",
//       "zh-TW": "問題",
//       en: "Question",
//     },
//     Engagement: {
//       zh: "參與度",
//       "zh-TW": "參與度",
//       en: "Engagement",
//     },
//     Theory: {
//       zh: "理論",
//       "zh-TW": "理論",
//       en: "Theory",
//     },
//     "Lab Work": {
//       zh: "實驗工作",
//       "zh-TW": "實驗工作",
//       en: "Lab Work",
//     },
//     Debugging: {
//       zh: "調試",
//       "zh-TW": "除錯",
//       en: "Debugging",
//     },
//     Assignments: {
//       zh: "作業",
//       "zh-TW": "作業",
//       en: "Assignments",
//     },
//   };

//   return translations[key]?.[lan.value] || key;
// };
</script>
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
          <option selected value="total">
            {{ lan === "zh" ? "總計" : lan === "zh-TW" ? "總計" : "Total" }}
          </option>
          <option value="month">
            {{ lan === "zh" ? "月" : lan === "zh-TW" ? "月" : "Month" }}
          </option>
          <option value="week">
            {{ lan === "zh" ? "週" : lan === "zh-TW" ? "週" : "Week" }}
          </option>
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
          <div class="col-lg-3 col-md-6 col-12 Hover-Table">
            <mini-statistics-card
              :title="
                lan === 'zh'
                  ? '回答數量'
                  : lan === 'zh-TW'
                    ? '回答數量'
                    : 'Number of Answers'
              "
              @click="questiontimes()"
              style="transition: transform 0.2s; cursor: pointer"
              @mouseover="hover = true"
              @mouseleave="hover = false"
              :style="{ transform: hover ? 'scale(1.02)' : 'scale(1)' }"
              :value="NumberofAnswers > 0 ? NumberofAnswers : '0'"
              :description="
                lan === 'zh'
                  ? '<span class=\'text-sm font-weight-bolder text-success\'></span> 提交的總回答'
                  : lan === 'zh-TW'
                    ? '<span class=\'text-sm font-weight-bolder text-success\'></span> 提交的總回答'
                    : '<span class=\'text-sm font-weight-bolder text-success\'></span> Total Answers Submitted'
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
                  ? '回答時長'
                  : lan === 'zh-TW'
                    ? '回答時長'
                    : 'Answer Duration'
              "
              :value="AvgAnswerTimer"
              :description="
                lan === 'zh'
                  ? '回答的計時器時長'
                  : lan === 'zh-TW'
                    ? '回答的計時器時長'
                    : 'Timer Duration for Answer'
              "
              :icon="{
                component: 'fa fa-users',
                background: 'bg-gradient-danger',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              @click="ShowKeyWord()"
              style="transition: transform 0.2s; cursor: pointer"
              @mouseover="hover = true"
              @mouseleave="hover = false"
              :style="{ transform: hover ? 'scale(1.02)' : 'scale(1)' }"
              :title="
                lan === 'zh'
                  ? '最多的主題'
                  : lan === 'zh-TW'
                    ? '最多的主題'
                    : 'Most Topic'
              "
              :value="KeyWord || 'No Keyword Yet'"
              :description="
                lan === 'zh'
                  ? `主題問得最多 <span class='text-sm font-weight-bolder text-success'></span>`
                  : lan === 'zh-TW'
                    ? `主題最常问的 <span class='text-sm font-weight-bolder text-success'></span>`
                    : `Topic Most Student Asked <span class='text-sm font-weight-bolder text-success'></span>`
              "
              :icon="{
                component: 'ni ni-paper-diploma',
                background: 'bg-gradient-success',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              :title="
                lan === 'zh'
                  ? '常見類型'
                  : lan === 'zh-TW'
                    ? '常見類型'
                    : 'Common Type'
              "
              :value="MostTypeAsked"
              :description="
                lan === 'zh'
                  ? '最高類型查詢率'
                  : lan === 'zh-TW'
                    ? '最高類型查詢率'
                    : 'Highest Type Inquiry Rates'
              "
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
            <div class="card z-index-2 Hover-Table">
              <gradient-line-chart
                id="chart-line"
                :title="
                  lan === 'zh'
                    ? '問題次數'
                    : lan === 'zh-TW'
                      ? '問題次數'
                      : 'Question Times'
                "
                :chart="{
                  labels: QuestionTimesLabel.value
                    ? QuestionTimesLabel.value
                    : [0],
                  datasets: [
                    {
                      label: 'Question Times',
                      data: QuestionTimesData.value
                        ? QuestionTimesData.value
                        : [0],
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
                          text:
                            optionsSelect === 'total'
                              ? 'Total Duration'
                              : optionsSelect === 'month'
                                ? 'Monthly Duration'
                                : 'Weekly Duration',
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
            <div
              class="card Hover-Table"
              @click="GetAllRecord()"
              style="transition: transform 0.2s; cursor: pointer"
              @mouseover="hover = true"
              @mouseleave="hover = false"
              :style="{ transform: hover ? 'scale(1.02)' : 'scale(1)' }"
            >
              <div class="p-3 pb-0 card-header">
                <div class="d-flex justify-content-between">
                  <h6 class="mb-2">Participation Levels</h6>
                </div>
              </div>
              <div class="table-responsive">
                <table class="table align-items-center">
                  <thead style="margin-left: 10px">
                    <tr>
                      <th class="w-30">
                        {{
                          lan === "zh"
                            ? "學生"
                            : lan === "zh-TW"
                              ? "學生"
                              : "Student"
                        }}
                      </th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="index in 5" :key="index">
                      <td class="w-30">
                        <div class="px-2 py-1 d-flex align-items-center">
                          <i class="fa fa-user-circle" aria-hidden="true"></i>
                          <div class="ms-4">
                            <p class="mb-0 text-xs font-weight-bold"></p>
                            <h6 class="mb-0 text-sm">
                              {{ Top5[index - 1]?.UserName || "No record" }}
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="text-center">
                          <p class="mb-0 text-xs font-weight-bold">
                            {{
                              lan === "zh"
                                ? "問題"
                                : lan === "zh-TW"
                                  ? "問題"
                                  : "Question"
                            }}:
                          </p>
                          <h6 class="mb-0 text-sm">
                            {{ Top5[index - 1]?.question_count || "0" }}
                          </h6>
                        </div>
                      </td>
                      <td class="text-sm align-middle">
                        <div class="text-center col">
                          <p class="mb-0 text-xs font-weight-bold">
                            {{
                              lan === "zh"
                                ? "參與度"
                                : lan === "zh-TW"
                                  ? "參與度"
                                  : "Engagement"
                            }}:
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
                  label:
                    lan === 'zh' ? '理論' : lan === 'zh-TW' ? '理論' : 'Theory',
                  description: `Total: <strong>${CoursesCategoryCount.theory || 0}</strong>`,
                },
                {
                  icon: {
                    component: 'fa fa-flask',
                    background: 'dark',
                  },
                  label:
                    lan === 'zh'
                      ? '實驗工作'
                      : lan === 'zh-TW'
                        ? '實驗工作'
                        : 'Lab Work',
                  description: `Total: <strong>${CoursesCategoryCount.labWork || 0}</strong>`,
                },
                {
                  icon: {
                    component: 'fa fa-bug',
                    background: 'dark',
                  },
                  label:
                    lan === 'zh'
                      ? '調試'
                      : lan === 'zh-TW'
                        ? '除錯'
                        : 'Debugging',
                  description: `Total: <strong>${CoursesCategoryCount.debugging || 0}</strong>`,
                },
                {
                  icon: {
                    component: 'fa fa-tasks',
                    background: 'dark',
                  },
                  label:
                    lan === 'zh'
                      ? '作業'
                      : lan === 'zh-TW'
                        ? '作業'
                        : 'Assignments',
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
  getAllQuestionByCourseID,
} from "../../assets/Domain.js";
import { ref } from "vue";
import { countKeywords } from "../../assets/KeyWord.js";

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
      QuestionDate: ref([]),
      optionsSelect: "total",
      KeyWord: ref(""),
    };
  },

  methods: {
    async GetQuestion() {
      fetch(
        `${getAllQuestionByCourseID}/${this.selectedCourseID}/${this.optionsSelect}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          let questionTitle = data.map((item) =>
            String(item.QuestionTitle || "")
          );
          let Description = data.map((item) => String(item.Description || ""));
          const questionKeywords = countKeywords(questionTitle.join(" "));
          const descriptionKeywords = countKeywords(Description.join(" "));

          if (questionKeywords === null || questionKeywords === undefined) {
            return;
          }

          if (
            descriptionKeywords === null ||
            descriptionKeywords === undefined
          ) {
            return;
          }

          // Combine the keyword counts from both question titles and descriptions
          const combinedKeywords = { ...questionKeywords };
          for (const [key, value] of Object.entries(descriptionKeywords)) {
            combinedKeywords[key] = (combinedKeywords[key] || 0) + value;
          }

          // console.log("Combined Keywords: ", combinedKeywords);

          // Find the keyword with the highest count

          if (combinedKeywords == null || combinedKeywords == undefined) {
            return;
          }
          const mostFrequentKeyword = Object.keys(combinedKeywords).reduce(
            (a, b) => (combinedKeywords[a] > combinedKeywords[b] ? a : b),
            ""
          );

          // console.log("Most Frequent Keyword: ", mostFrequentKeyword);

          this.KeyWord = mostFrequentKeyword;
          // console.log("Most Frequent Keyword: ", this.KeyWord);
        });
    },
    async ShowKeyWord() {
      this.$router.push({
        path: "/dashboard-default/showkeyword_dashboard",
        query: {
          selectedCourseID: this.selectedCourseID,
          optionsSelect: this.optionsSelect,
        },
      });
    },
    async questiontimes() {
      this.$router.push({
        path: "/dashboard-default/questiontimesdashboard",
        query: {
          selectedCourseID: this.selectedCourseID,
          optionsSelect: this.optionsSelect,
        },
      });
    },
    async GetAllRecord() {
      this.$router.push({
        path: "/dashboard-default/getallrecorddashboard",
        query: {
          selectedCourseID: this.selectedCourseID,
          optionsSelect: this.optionsSelect,
        },
      });
    },
    async GetQuestionTimes() {
      fetch(
        `${GetQuestionTimes}/${this.selectedCourseID}/${this.optionsSelect}`
      )
        .then((response) => response.json())
        .then((data) => {
          this.QuestionTimesLabel.value = data.map(
            (item) => `${item.LastUploadTime}`
          );
          this.QuestionTimesLabel.value = data.map(
            (item) => "Queue " + item.CourseWeek
          );
          this.QuestionDate.value = data.map(
            (item) => new Date(item.LastUploadTime).toISOString().split("T")[0]
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
      fetch(
        `${GetNumAns}/${this.UserID}/${this.selectedCourseID}/${this.optionsSelect}`
      )
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
      fetch(
        `${getAnswer_QA_AvgTime}/${this.UserID}/${this.selectedCourseID}/${this.optionsSelect}`
      )
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
          if (data.length === 0) {
            console.log("No courses found for this user.");
            return;
          }
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
          this.GetQuestion();
        });
    },

    async GetEngagement(UserID) {
      fetch(
        `${GetEngagement}/${UserID}/${this.selectedCourseID}/${this.optionsSelect}`
      )
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
      this.GetQuestion();
    },
    handleDurationChange(event) {
      console.log("Duration changed to: ", event.target.value);
      this.GetTop5();
      this.GetCoursesCategories();
      this.getAnswerTImer();
      this.GetNumAnswers();
      this.GetQuestionTimes();
      this.GetQuestion();
    },
  },

  mounted() {
    this.GetCourses();
  },
};
</script>
<style scoped>
.Hover-Table:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>

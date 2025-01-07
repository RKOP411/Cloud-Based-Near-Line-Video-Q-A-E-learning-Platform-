<template>
  <div class="card">
    <!-- Course Information-->
    <div class="row align-items-center" style="margin-top: 10px">
      <div class="col">
        <h5 style="margin-left: 20px; font-size: x-large">Course Name</h5>
      </div>
      <div class="col-auto" style="margin-right: 20px">Week</div>
    </div>
    <!-- Course Information End-->
    <div class="card-header pb-0 px-3">
      <div class="row" style="background-color: #f8f8f8">
        <div class="col-auto">
          <div class="avatar avatar-xl position-relative">
            <img
              src="../../assets/img/team-3.jpg"
              alt="profile_image"
              class="shadow-sm w-70 border-radius-lg"
            />
          </div>
        </div>
        <div class="col-auto my-auto">
          <div class="h-100">
            <h5 class="mb-1">Sayo Kravits</h5>
            <span class="badge badge-sm bg-gradient-success">Online</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Queue -->
    <div class="container mt-2">
      <div class="row mt-4 justify-content-between">
        <div class="col-6 col-md-3">
          <div class="card queue-a text-white">
            <div class="card-body text-center">
              <h5 class="card-title">Theory</h5>
              <p class="card-text" id="currentSizeA">Current Size: 5</p>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card queue-b text-white">
            <div class="card-body text-center">
              <h5 class="card-title">Lab Work</h5>
              <p class="card-text" id="currentSizeB">Current Size: 3</p>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card queue-c text-white">
            <div class="card-body text-center">
              <h5 class="card-title">Debugging</h5>
              <p class="card-text" id="currentSizeC">Current Size: 8</p>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card queue-d text-white">
            <div class="card-body text-center">
              <h5 class="card-title">Assignments</h5>
              <p class="card-text" id="currentSizeD">Current Size: 2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Queue End -->

    <!-- Timer-->
    <div class="mt-4 text-center" id="timerDisplay">
      <h3>Time Remaining: <span id="timeRemaining">1:00</span> minutes</h3>
    </div>
    <!-- Timer End -->

    <!-- Search Bar -->
    <div class="d-flex p-2 mb-1">
      <span class="input-group-text text-body">
        <i class="fas fa-search" aria-hidden="true"></i>
      </span>
      <input type="text" class="form-control" :placeholder="'Type here...'" />
    </div>
    <!-- Search Bar End-->
    <div class="card-body pt-1 p-3">
      <div class="d-flex justify-content-end">
        <argon-button
          type="button"
          class="btn btn-success mb-3"
          title="Ask Question"
          @click="redirectToCreateQuestion()"
        >
          <i class="fa fa-plus" aria-hidden="true"></i>
        </argon-button>
      </div>
      <ul class="list-group">
        <!-- List Card -->

        <li
          v-for="question in questions"
          :key="question.id"
          class="list-group-item border-0 d-flex p-4 mb-2 bg-gray-100 border-radius-lg"
        >
          <div class="d-flex flex-column">
            <h6 class="mb-3 text-sm question-header">
              {{ question.UserName }} . {{ question.UploadTime }}
            </h6>
            <h5 class="mb-1 question-title">
              {{ question.QuestionTitle }}
            </h5>
            <span class="mb-3 text-xs">
              Type:
              <span class="text-dark font-weight-bold ms-sm-2 question-type">{{
                question.Type
              }}</span>
            </span>
            <!-- Question Content-->
            <div>
              <div
                class="row justify-content-center"
                v-if="question.Path !== null"
              >
                <video v-if="question.Path" controls id="QuestionVideo">
                  <source :src="question.Path" :type="question.Video_Type" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div v-else>
                <p
                  class="card-text"
                  v-html="sanitize(question.Description)"
                ></p>
              </div>
            </div>
            <!-- Question Content End -->
          </div>
          <div class="ms-auto text-end d-flex">
            <a class="btn btn-link text-dark px-3 mb-0" href="javascript:;">
              <i class="fa fa-eye text-dark me-2" aria-hidden="true"></i>
            </a>
          </div>
        </li>

        <!--End of List Card -->
      </ul>
    </div>
  </div>
</template>
<script>
import { GetAllQuestion, DomainName } from "../../assets/Domain.js";
import DOMPurify from "dompurify";
const userId = localStorage.getItem("UserID");
export default {
  data() {
    return {
      questions: [],
    };
  },
  methods: {
    redirectToCreateQuestion() {
      this.$router.push("/questionlist/createquestion");
    },
    async getQuestions() {
      fetch(GetAllQuestion)
        .then((response) => response.json())
        .then((data) => {
          for (let i = 0; i < data.length; i++) {
            data[i].UploadTime = this.Calculate_LastUpdate(data[i].UploadTime);
          }
          this.questions = data;

          for (let i = 0; i < this.questions.length; i++) {
            console.log(this.questions[i].QAID);
            if (this.questions[i].UserID == userId) {
              this.questions[i].UserName = "You";
            }
            // Replace backslashes with forward slashes
            if (this.questions[i].Path) {
              this.questions[i].Path = this.questions[i].Path.replace(
                /\\/g,
                "/"
              );
              const basePath = DomainName;
              this.questions[i].Path = basePath + this.questions[i].Path; // The full path
            }
          }
        });
    },
    sanitize(commentHtml) {
      return DOMPurify.sanitize(commentHtml);
    },

    Calculate_LastUpdate(time) {
      let date = new Date(time);
      let currentDate = new Date();
      let timeDifference = currentDate - date;

      // Calculate the time differences in various units
      let seconds = Math.floor(timeDifference / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      let days = Math.floor(hours / 24);
      let weeks = Math.floor(days / 7);
      let months = Math.floor(days / 30); // Approximation
      let years = Math.floor(days / 365); // Approximation
      // Determine the appropriate time unit to display
      let lastUpdatedTime;
      if (years > 0) {
        lastUpdatedTime = years + " year" + (years === 1 ? "" : "s") + " ago";
      } else if (months > 0) {
        lastUpdatedTime =
          months + " month" + (months === 1 ? "" : "s") + " ago";
      } else if (weeks > 0) {
        lastUpdatedTime = weeks + " week" + (weeks === 1 ? "" : "s") + " ago";
      } else if (days > 0) {
        lastUpdatedTime = days + " day" + (days === 1 ? "" : "s") + " ago";
      } else if (hours > 0) {
        lastUpdatedTime = hours + " hour" + (hours === 1 ? "" : "s") + " ago";
      } else if (minutes > 0) {
        lastUpdatedTime =
          minutes + " minute" + (minutes === 1 ? "" : "s") + " ago";
      } else {
        lastUpdatedTime = "Just now";
      }

      return lastUpdatedTime;
    },
  },
  mounted() {
    this.getQuestions();
  },
};
</script>

<style setup>
.queue-a {
  background-color: #28a745 !important;
  padding: 1px;
  margin-bottom: 5px;
} /* Green */
.queue-b {
  background-color: #17a2b8 !important;
  padding: 1px;
  margin-bottom: 5px;
} /* Teal */
.queue-c {
  background-color: #ffc107 !important;
  padding: 1px;
  margin-bottom: 5px;
} /* Yellow */
.queue-d {
  background-color: #dc3545 !important;
  padding: 1px;
  margin-bottom: 5px;
} /* Red */
</style>

<template>
  <div class="card">
    <div class="card-header pb-0 px-3">
      <h6 class="mb-0">Questions Information</h6>
    </div>

    <!-- Search Bar -->
    <div class="d-flex p-3 mb-2">
      <span class="input-group-text text-body">
        <i class="fas fa-search" aria-hidden="true"></i>
      </span>
      <input type="text" class="form-control" :placeholder="'Type here...'" />
    </div>
    <!-- Search Bar End-->
    <div class="card-body pt-4 p-3">
      <ul class="list-group">
        <!-- List Card -->

        <li
          v-if="questions.length === 0"
          class="list-group-item border-0 d-flex p-4 mb-2 bg-gray-100 border-radius-lg"
        >
          <div class="d-flex flex-column">
            <h6 class="mb-3 text-sm text-center">
              You haven't asked any questions.
            </h6>
          </div>
        </li>
        <li
          v-for="question in questions"
          :key="question.id"
          class="list-group-item border-0 d-flex p-4 mb-2 bg-gray-100 border-radius-lg"
        >
          <div class="d-flex flex-column">
            <h6 class="mb-3 text-sm question-header">
               
              <span v-if="question.Replied === 0" style="color: green"
                >Next No. <b>{{ question.currentQueueCount + 1 }}</b></span
              >
              <span v-else style="color: red">Replied</span> - {{ question.UploadTime }}
            </h6>
            <h6 class="mb-3 text-sm">Course: {{ question.CourseName }}</h6>
            <br />
            <h5 class="mb-1 question-title">
              Title: {{ question.QuestionTitle }}
            </h5>
            <span class="mb-3 text-xs">
              Type:
              <span class="text-dark font-weight-bold ms-sm-2 question-type">{{
                question.Type
              }}</span>
            </span>
            <span class="mb-2 text-xs question-description">
              <!-- Question Content-->
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
              <!-- Question Content End -->
            </span>
            
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">
                  <span v-if="question.AnswerUserName">
                    Answer - {{ question.AnswerUserName }} .
                    {{ question.AnswerUploadTime }}</span
                  >
                </h5>
                <div class="card-text" id="AnswerContent">
                  <div v-html="sanitize(question.answer || 'Loading...')"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="ms-auto text-end d-flex"></div>
        </li>

        <!--End of List Card -->
      </ul>
    </div>
  </div>
</template>

<script>
import DOMPurify from "dompurify";
import {
  GetQuestionByUserID,
  DomainName,
  GetAnswerByQAID,
} from "../../assets/Domain.js";

const userId = localStorage.getItem("UserID");
export default {
  data() {
    return {
      questions: [],
    };
  },
  methods: {
    async loadAnswers() {
      for (let question of this.questions) {
        question.answer = await this.getAnswer(question.QAID);
      }
      for (let question of this.questions) {
        question.AnswerUserName = await this.getAnswerUserName(question.QAID);
      }
      for (let question of this.questions) {
        question.AnswerUploadTime = await this.getAnswerUploadTime(
          question.QAID
        );
        question.AnswerUploadTime = this.Calculate_LastUpdate(
          question.AnswerUploadTime
        );
      }
    },

    async getAnswerUploadTime(QAID) {
      let response = await fetch(GetAnswerByQAID + QAID, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let data = await response.json();
      if (data[0] != null) {
        return data[0].UploadTime;
      } else {
        return "";
      }
    },

    async getAnswerUserName(QAID) {
      let response = await fetch(GetAnswerByQAID + QAID, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let data = await response.json();
      if (data[0] != null) {
        return data[0].UserName;
      } else {
        return "";
      }
    },
    async getAnswer(QAID) {
      let response = await fetch(GetAnswerByQAID + QAID, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let data = await response.json();
      if (data[0] != null) {
        return data[0].Text;
      } else {
        return "No Answer Yet";
      }
    },
    sanitize(commentHtml) {
      return DOMPurify.sanitize(commentHtml);
    },
    async getQuestions() {
      fetch(GetQuestionByUserID + userId, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.questions = data.questions;
          for (let i = 0; i < this.questions.length; i++) {
            this.questions[i].UploadTime = this.Calculate_LastUpdate(
              this.questions[i].UploadTime
            );
          }
          for (let i = 0; i < this.questions.length; i++) {
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
        })
        .then(() => {
          this.loadAnswers();
        })
        .catch((error) => {
          console.error("Error fetching questions:", error);
        });
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
<style scoped>
</style>
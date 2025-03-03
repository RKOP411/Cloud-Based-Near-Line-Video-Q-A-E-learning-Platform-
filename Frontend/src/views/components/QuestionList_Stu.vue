<template>
  <div class="card">
    <!-- Course Information-->
    <div class="row align-items-center" style="margin-top: 10px">
      <div class="col"></div>
      <div class="col-auto" style="margin-right: 20px"><button type="button" @click="quitThisQueue" class="btn btn-danger">Quit</button></div>
    </div>
    <!-- Course Information End-->
    <!-- Teacher Information -->
    <div
      class="card"
      style="border-radius: 15px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1)"
    >
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="avatar avatar-lg position-relative">
              <img
                src="../../assets/img/team-3.jpg"
                alt="profile_image"
                class="shadow-sm border-radius-lg"
                style="
                  width: 70px;
                  height: 70px;
                  border-radius: 50%;
                  border: 2px solid #007bff;
                  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
                "
              />
            </div>
          </div>
          <div class="col my-auto">
            <div class="d-flex align-items-center">
              <h5 class="mb-0" style="font-weight: 600">Sayo Kravits</h5>
              <span
                class="badge"
                style="
                  background-color: #488dcc;
                  padding: 3px 8px;
                  border-radius: 15px;
                  font-size: 0.8rem;
                  margin-left: 5px;
                "
                >Teacher</span
              >
            </div>
            <span
              :class="{
                badge: true,
                'ms-2': true,
                'bg-success': TeacherStatus === 'Online',
                'bg-warning': TeacherStatus === 'Idle',
                'bg-secondary': TeacherStatus === 'Offline',
              }"
              style="font-size: 0.8rem"
            >
              {{ TeacherStatus }}
            </span>
            <div style="font-size: 0.9rem; color: #6c757d">
              Course Name: <span style="color: #007bff">{{ CourseName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Teacher Information End -->
    <!-- Queue -->
    <div class="container mt-5">
      <div class="row mt-4 justify-content-between">
        <div class="col-6 col-md-3">
          <div class="d-flex justify-content-between align-items-center">
            <h6 class="status-description">Theory</h6>
            <p class="status-text" style="color: #007bff">Next No</p>
          </div>
          <div class="status-box text-white" style="background-color: #007bff">
            <h5 class="status-title">T {{ TheoryCount }}</h5>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="d-flex justify-content-between align-items-center">
            <h6 class="status-description">Lab Work</h6>
            <p class="status-text" style="color: #28a745">Next No</p>
          </div>
          <div class="status-box text-white" style="background-color: #28a745">
            <h5 class="status-title">L {{ LabWorkCount }}</h5>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="d-flex justify-content-between align-items-center">
            <h6 class="status-description">Debugging</h6>
            <p class="status-text" style="color: #6f42c1">Next No</p>
          </div>
          <div class="status-box text-white" style="background-color: #6f42c1">
            <h5 class="status-title">D {{ DebuggingCount }}</h5>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="d-flex justify-content-between align-items-center">
            <h6 class="status-description">Assignments</h6>
            <p class="status-text" style="color: #dc3545">Next No</p>
          </div>
          <div class="status-box text-white" style="background-color: #dc3545">
            <h5 class="status-title">A {{ AssignmentCount }}</h5>
          </div>
        </div>
      </div>
    </div>
    <!-- Queue End -->

    <!-- Timer-->
    <div class="mt-4 text-center" id="timerDisplay">
      <h3>
        Estimated Time: <span id="timeRemaining">{{ Waittime }}</span>
      </h3>
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
          v-if="questions.length === 0"
          class="list-group-item border-0 d-flex p-4 mb-2 bg-gray-100 border-radius-lg"
        >
          <div class="d-flex flex-column">
            <h6 class="mb-3 text-sm">
              "The question queue is currently empty.
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
          </div>
          <!-- Question Content End -->

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
import {
  GetAllQuestionByQueueListID,
  DomainName,
  GetQueue,
  GetStatus,
  getAvgTakeTimeByUserID,
  QuitQueue,
} from "../../assets/Domain.js";
import DOMPurify from "dompurify";
const userId = localStorage.getItem("UserID");
export default {
  data() {
    return {
      QueueListID: localStorage.getItem("QueueListID"),
      TheoryCount: 0,
      LabWorkCount: 0,
      DebuggingCount: 0,
      AssignmentCount: 0,
      questions: [],
      CourseName: "",
      TeacherUserID: "",
      TeacherStatus: "",
      Waittime: 0,
    };
  },
  methods: {
    GetTeacherStatus() {
      fetch(`${GetStatus}/${this.TeacherUserID}`)
        .then((response) => response.json())
        .then((data) => {
          this.TeacherStatus = data.status;
          // console.log(this.TeacherStatus);
        });
    },
    redirectToCreateQuestion() {
      this.$router.push("/questionlist/createquestion");
    },
    async GetAllQueue() {
      fetch(`${GetQueue}/${this.QueueListID}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.TheoryCount = data.Theory;
          this.LabWorkCount = data["Lab Work"];
          this.DebuggingCount = data.Debugging;
          this.AssignmentCount = data.Assignments;
        });
    },
    async getQuestions() {
      fetch(`${GetAllQuestionByQueueListID}/${this.QueueListID}`)
        .then((response) => response.json())
        .then((data) => {
          for (let i = 0; i < data.length; i++) {
            data[i].UploadTime = this.Calculate_LastUpdate(data[i].UploadTime);
          }
          this.questions = data;
          this.TeacherUserID = data[0].TeacherUserID;
          this.CourseName = data[0].CourseName;

          for (let i = 0; i < this.questions.length; i++) {
            if (this.questions[i].QuestionUserID == userId) {
              //console.log(this.questions[i].QuestionUserID+" to "+userId);
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
            this.getWaitTime(data[0].TeacherUserID);
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
    getWaitTime(TeacherUserID) {
      console.log("TeacherUserID" + TeacherUserID);
      fetch(`${getAvgTakeTimeByUserID}/${TeacherUserID}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          this.Waittime = data.Estimated;
          if (this.Waittime >= 3600) {
            this.Waittime = (this.Waittime / 3600).toFixed(2) + " hours";
          } else if (this.Waittime >= 60) {
            this.Waittime = (this.Waittime / 60).toFixed(2) + " minutes";
          } else {
            this.Waittime = this.Waittime + " seconds";
          }
          this.Waittime = parseFloat(this.Waittime).toFixed(0) + " seconds";
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    },
    quitThisQueue(){
      fetch(`${QuitQueue}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          QueueListID: this.QueueListID,
          UserID: userId,
        }),
      });
      localStorage.removeItem("QueueListID");
      this.$router.push("/joinqueue");
    }
  },
  mounted() {
    this.GetAllQueue();
    this.getQuestions();
    setInterval(() => {
      this.GetAllQueue();
      this.getQuestions();
    }, 5000);
    setInterval(() => {
      this.GetTeacherStatus();
    }, 3000);
  },
};
</script>

<style scoped>
.card-header {
  background-color: #f0f4f8;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.avatar {
  position: relative;
}

.avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #007bff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.teacher-tag {
  background-color: #e0efff;
  padding: 3px 8px;
  border-radius: 15px;
  font-size: 0.8rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.bg-light {
  background-color: #f8f9fa !important;
}

.badge-success {
  background-color: #28a745;
}

h5 {
  color: #343a40;
}

h6 {
  color: #6c757d;
}
.status-box {
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 20px;
}

.status-title {
  font-size: 44px;
  margin: 0;
}
.status-description {
  font-size: 16px; /* Adjust size as needed */
  margin: 0; /* Remove margin for better alignment */
  font-weight: bold; /* Make it bold */
}

.status-text {
  font-size: 14px;
  margin: 0;
}
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

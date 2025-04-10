<template>
  <div class="card">
    <div class="card-header pb-0 px-3">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0" style="font-weight: bold; font-size: 24px">
          Access Code: <span style="color: #00796b">{{ AccessCode }}</span>
          <button
            class="btn btn-success"
            style="margin-left: 20px"
            @click="ShowHelper()"
          >
            Invatation
          </button>
        </h5>

        <div
          class="people-count"
          style="font-size: 20px; color: #00796b; margin-right: 20px"
        >
          <span style="margin-right: 10px; color: #2196f3">0 Helpers</span>
          {{ CurrentJoins }} Students
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="d-flex p-3 mb-2">
      <span class="input-group-text text-body">
        <i class="fas fa-search" aria-hidden="true"></i>
      </span>
      <input type="text" class="form-control" :placeholder="'Type here...'" />
    </div>
    <!-- Search Bar End-->
    <div class="card-body pt-2 p-2">
      <!-- Queue -->
      <div class="container mt-2">
        <a
          @click="ClearQuestionType()"
          style="cursor: pointer"
          @mouseover="hover = true"
          @mouseleave="hover = false"
          :style="{ color: hover ? '#00796b' : 'inherit' }"
          >Clear Filter</a
        >
        <div class="row mt-4 justify-content-between">
          <div
            class="col-6 col-md-3 Block-hover"
            @click="GetQuestionWithType('Theory')"
          >
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="status-description">Theory</h6>

              <p class="status-text" style="color: #007bff">Next No</p>
            </div>

            <div
              class="status-box text-white"
              style="background-color: #007bff"
            >
              <h5 class="status-title">T {{ TheoryCount }}</h5>
            </div>
          </div>
          <div
            class="col-6 col-md-3 Block-hover"
            @click="GetQuestionWithType('lab-work')"
          >
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="status-description">Lab Work</h6>
              <p class="status-text" style="color: #28a745">Next No</p>
            </div>
            <div
              class="status-box text-white"
              style="background-color: #28a745"
            >
              <h5 class="status-title">L {{ LabWorkCount }}</h5>
            </div>
          </div>
          <div
            class="col-6 col-md-3 Block-hover"
            @click="GetQuestionWithType('debugging')"
          >
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="status-description">Debugging</h6>
              <p class="status-text" style="color: #6f42c1">Next No</p>
            </div>
            <div
              class="status-box text-white"
              style="background-color: #6f42c1"
            >
              <h5 class="status-title">D {{ DebuggingCount }}</h5>
            </div>
          </div>
          <div
            class="col-6 col-md-3 Block-hover"
            @click="GetQuestionWithType('assignments')"
          >
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="status-description">Assignments</h6>
              <p class="status-text" style="color: #dc3545">Next No</p>
            </div>
            <div
              class="status-box text-white"
              style="background-color: #dc3545"
            >
              <h5 class="status-title">A {{ AssignmentCount }}</h5>
            </div>
          </div>
        </div>
      </div>
      <!-- Queue End -->
      <br />

      <ul class="list-group">
        <!-- List Card -->
        <li
          v-if="questions.length === 0 || questions[0]?.QAID == undefined"
          class="list-group-item border-0 d-flex p-4 mb-2 bg-gray-100 border-radius-lg"
        >
          <div class="d-flex flex-column">
            <h6 class="mb-3 text-sm">
              "The question queue is currently empty.
            </h6>
          </div>
        </li>
        <li
          v-else
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
              <br />
              <br />
              <!-- CommentAnswer -->
              <div class="oval-surround">
                <a
                  class="btn btn-link text-dark px-2 mb-1"
                  href="javascript:;"
                  @click="createQuill(question.QAID)"
                >
                  <i class="fa fa-comment" aria-hidden="true"></i>
                </a>
                <br />
              </div>
              <br />
              <!-- Text Editor-->
              <div id="toolbar" v-if="activeQuill === question.QAID">
                <button class="ql-bold"></button>
                <button class="ql-italic"></button>
                <button class="ql-underline"></button>
                <button class="ql-link"></button>
                <button class="ql-image"></button>
                <button class="ql-list" value="ordered"></button>
                <!-- Ordered list button -->
                <button class="ql-list" value="bullet"></button>
                <!-- Bullet list button -->
              </div>
              <div
                id="TextEditor"
                v-if="activeQuill === question.QAID"
                :ref="'quillEditor' + question.QAID"
                style="height: 100px; width: 800px"
              ></div>
              <!-- End of Text Editor-->
              <br />
              <button
                v-if="activeQuill === question.QAID"
                type="button"
                class="btn btn-primary"
                @click="AnswerQuestion(question.QAID)"
              >
                Answer
              </button>
              <!-- End of CommentAnswer -->
            </span>
          </div>
          <div class="ms-auto text-end d-flex">
            <a
              class="btn btn-link text-danger text-gradient px-3 mb-0"
              href="javascript:;"
            >
              <i class="far fa-trash-alt me-2" aria-hidden="true"></i>
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
  AddAnswerByQuestionID,
  GetQueue,
  SendStatus,
  getCurrentJoins,
  GetAllQuestionWithType,
  GetInvitationUser,
  SendInvitationByUserID,
} from "../../assets/Domain.js";
import DOMPurify from "dompurify";
import Quill from "quill";

import "quill/dist/quill.snow.css"; // Import Quill's CSS
import * as bootstrap from "bootstrap"; // Import Bootstrap's JavaScript
const userId = localStorage.getItem("UserID");
export default {
  data() {
    return {
      CurrentJoins: 0,
      AccessCode: "",
      TheoryCount: 0,
      LabWorkCount: 0,
      DebuggingCount: 0,
      AssignmentCount: 0,
      AnswerTimer: 0,
      questions: [],
      activeQuill: null, // Track which Quill editor is active
      quill: null, // Store the Quill instance
      quillCreated: false,
      userActive: false,
      heartbeatInterval: null,
      CurrentChoiceType: "",
    };
  },
  methods: {
    SendInvatitation(selectedUsers) {
      const urlParams = new URLSearchParams(window.location.search);
      const QueueListID = urlParams.get("QueueListID");
      fetch(
        `${SendInvitationByUserID}/${selectedUsers}/${QueueListID}/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Invitation sent successfully:", data);
        })
        .catch((error) => {
          console.error("Error sending invitation:", error);
        });
    },
    ShowHelper() {
      fetch(GetInvitationUser, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const users = data
            .filter((user) => user.T_rank === "TA") // Use T_rank instead of Role
            .map((user) => ({ name: user.UserName, id: user.UserID }));
          // Continue with the rest of the logic using the filtered users
          const userList = users
            .map(
              (user) =>
          `<li class="list-group-item list-group-item-action d-flex align-items-center" style="cursor: pointer;" onclick="toggleSelection('${user.id}')">
        <input type="checkbox" class="form-check-input me-2" value="${user.id}" />
        <span>${user.name}</span>
            </li>`
            )
            .join("");

          const popup = document.createElement("div");
          popup.className = "modal fade";
          popup.id = "inviteModal";
          popup.tabIndex = "-1";
          popup.role = "dialog";
          popup.innerHTML = `
        <div class="modal-dialog" role="document">
          <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Select Helper to invite</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <ul class="list-group">
            ${userList}
          </ul>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" id="inviteButton">Invite</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
          </div>
        </div>
      `;

          document.body.appendChild(popup);

          const modal = new bootstrap.Modal(popup);
          modal.show();

          const selectedUsers = [];
          window.toggleSelection = function (user) {
            if (selectedUsers.includes(user)) {
              const index = selectedUsers.indexOf(user);
              selectedUsers.splice(index, 1);
            } else {
              selectedUsers.push(user);
            }
          };

          document
            .getElementById("inviteButton")
            .addEventListener("click", () => {
              if (selectedUsers.length > 0) {
                selectedUsers.forEach((user) => {
                  const encodedUser = encodeURIComponent(user);
                  this.SendInvatitation(encodedUser);
                });
                alert("Invitation sent to users." + selectedUsers);
              } else {
                alert("No users selected.");
              }

              modal.hide();
            });

          popup.addEventListener("hidden.bs.modal", () => {
            document.body.removeChild(popup);
          });
        });
    },
    ClearQuestionType() {
      this.CurrentChoiceType = "";
      this.getQuestions();
    },
    async GetQuestionWithType(Type) {
      const urlParams = new URLSearchParams(window.location.search);
      const QueueListID = urlParams.get("QueueListID");
      this.CurrentChoiceType = Type;
      fetch(`${GetAllQuestionWithType}/${QueueListID}/${Type}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          for (let i = 0; i < data.length; i++) {
            data[i].UploadTime = this.Calculate_LastUpdate(data[i].UploadTime);
          }
          this.questions = data;
          this.AccessCode = data[0].AccessCode;

          for (let i = 0; i < this.questions.length; i++) {
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
        })
        .catch((error) => {
          console.error("Error fetching questions:", error);
        });
    },
    getJoins() {
      const urlParams = new URLSearchParams(window.location.search);
      const QueueListID = urlParams.get("QueueListID");
      fetch(`${getCurrentJoins}/${QueueListID}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          this.CurrentJoins = data[0].userCount;
        })
        .catch((error) => {
          console.error("Error fetching current joins:", error);
        });
    },
    beforeDestroy() {
      clearInterval(this.timerInterval);
    },
    sendStatus(isOnline) {
      fetch(SendStatus, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          status: isOnline ? "online" : "idle",
        }),
      })
        .then((response) => response.json())
        .then(() => {
          //console.log("Status response:", data);
        })
        .catch((error) => {
          console.error("Error sending status:", error);
        });
    },
    setUserOnline() {
      if (!this.userActive) {
        this.userActive = true;
        this.sendStatus(true); // Send online status
      }
    },
    setUserOffline() {
      if (this.userActive) {
        this.userActive = false;
        this.sendStatus(false); // Send offline status
      }
    },
    async GetAllQueue() {
      const urlParams = new URLSearchParams(window.location.search);
      const QueueListID = urlParams.get("QueueListID");
      fetch(`${GetQueue}/${QueueListID}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          //console.log(data);
          this.TheoryCount = data.Theory;
          this.LabWorkCount = data["Lab Work"];
          this.DebuggingCount = data.Debugging;
          this.AssignmentCount = data.Assignments;
          console.log(data);
        })
        .catch((error) => {
          console.error("Error fetching queue data:", error);
        });
    },
    AnswerQuestion(id) {
      // Get the Quill editor content
      const quillContent = this.quill.root.innerHTML;
      // console.log("Quill Content: " + quillContent);
      // console.log("Quill ID: " + id);
      fetch(AddAnswerByQuestionID, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          QAID: id,
          Answer: quillContent,
          UserID: userId,
          Timer: this.AnswerTimer,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.getQuestions();
          this.GetAllQueue();
          this.quillCreated = true;
          //remove the Quill editor and toolbar
          // this.$nextTick(() => {
          //   var editorContainer = document.getElementById("TextEditor");
          //   var toolbarContainer = document.getElementById("toolbar");
          //   if (editorContainer && toolbarContainer) {
          //     // editorContainer.parentNode.removeChild(editorContainer); // Remove the editor
          //     // toolbarContainer.parentNode.removeChild(toolbarContainer); // Remove the toolbar
          //   }
          // });
          this.AnswerTimer = 0; // Reset the timer
          this.beforeDestroy();
        });
    },
    createQuill(id) {
      if (this.AnswerTimer != 0) {
        clearInterval(this.AnswerTimer);
      }
      //Timer Counter
      this.AnswerTimer = 0; // Reset the timer
      this.timerInterval = setInterval(() => {
        this.AnswerTimer++;
        //console.log(this.AnswerTimer);
      }, 1000);
      if (this.quillCreated) {
        this.quillCreated = false;
        this.activeQuill = null;
        this.quill = null; // Reset the Quill instance
      }

      // Check if there's an active Quill instance and disable it
      if (this.quill) {
        this.quill.enable(); // Optionally, you can enable it first if needed
      }

      // Set the active Quill ID
      this.activeQuill = id;
      // console.log("Active Quill ID: " + this.activeQuill);
      // console.log("Quill ID: " + id);

      // Use $nextTick to ensure the DOM is updated before creating a new Quill instance
      this.$nextTick(() => {
        const editorElement = this.$refs["quillEditor" + id];

        // Create a new Quill instance
        if (editorElement && editorElement[0]) {
          this.quill = new Quill(editorElement[0], {
            theme: "snow",
            modules: {
              toolbar: this.quillCreated
                ? { container: "#toolbar" } // Link the toolbar to the editor
                : false,
            },
          });
        }
      });

      this.quillCreated = true;
    },

    redirectToCreateQuestion() {
      this.$router.push("/questionlist/createquestion");
    },
    async getQuestions() {
      const urlParams = new URLSearchParams(window.location.search);
      const QueueListID = urlParams.get("QueueListID");
      fetch(`${GetAllQuestionByQueueListID}/${QueueListID}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(async (data) => {
          this.questions = await data.questions;
          // console.log("questions:", this.questions);
          for (let i = 0; i < this.questions.length; i++) {
            this.questions[i].UploadTime = this.Calculate_LastUpdate(
              this.questions[i].UploadTime
            );
          }
          // console.log("Data: " + data[0]);
          if (this.questions[0] != null) {
            this.AccessCode = this.questions[0].AccessCode;
          } else {
            this.AccessCode = await data.question[0].AccessCode;
          }

          for (let i = 0; i < this.questions.length; i++) {
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
        })
        .catch((error) => {
          console.error("Error fetching questions:", error);
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
    this.getJoins();
    this.getQuestions();
    this.GetAllQueue();
    this.beforeDestroy();
    setInterval(() => {
      this.getJoins();
      if (this.CurrentChoiceType == "") {
        this.getQuestions();
      } else {
        this.GetQuestionWithType(this.CurrentChoiceType);
      }
      this.GetAllQueue();
      this.beforeDestroy();
    }, 3000);

    // Event listeners for user activity
    window.addEventListener("mousemove", this.setUserOnline);
    window.addEventListener("keypress", this.setUserOnline);

    // Check user status every 4 seconds and send status
    this.heartbeatInterval = setInterval(() => {
      this.sendStatus(this.userActive); // Send heartbeat status
      if (!this.userActive) {
        this.setUserOffline(); // If inactive, send offline status
      }
    }, 4000); // 4 seconds

    // Handle page unload event
    window.addEventListener("beforeunload", () => {
      this.setUserOffline(); // Mark user as offline
      // Send offline status using sendBeacon
      navigator.sendBeacon(
        SendStatus,
        JSON.stringify({ userId: userId, status: "Idle" })
      );
      clearInterval(this.heartbeatInterval); // Clear the interval
      clearInterval(this.heartbeatInterval); // Stop the heartbeat interval
    });
  },
};
</script>

<style scoped>
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
.oval-surround {
  display: inline-flex; /* Allows for proper alignment */
  align-items: center; /* Vertically centers the icon */
  justify-content: center; /* Horizontally centers the icon */
  width: 50px; /* Adjust width as needed */
  height: 30px; /* Adjust height as needed */
  border-radius: 50px; /* Creates the oval shape */
  background-color: #f0f0f0; /* Background color of the oval */
  padding: 5px; /* Add some padding */
}
.oval-surround i {
  font-size: 22px; /* ICON font size */
}
.input-group {
  margin-left: 16px;
  width: auto;
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
.Block-hover {
  cursor: pointer;
  transition: all 0.3s ease;
}
.Block-hover:hover {
  background-color: #e0efff; /* Darker background on hover */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Add shadow on hover */
}

.Block-hover:active {
  transform: scale(0.98); /* Slightly scale down when clicked */
}
</style>

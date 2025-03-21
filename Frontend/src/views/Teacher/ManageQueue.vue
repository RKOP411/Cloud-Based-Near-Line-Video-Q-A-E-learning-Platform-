<template>
  <div class="card">
    <div class="card-header pb-0">
      <div class="d-flex align-items-center">
        <h6>Your Queue</h6>
        <argon-button
          type="button"
          class="btn btn-success mb-3 ms-auto"
          title="Create Course"
          @click="goToCreateQueue"
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
                Queue ID
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Queue
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Class
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Status
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Time Out
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Member
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Created In
              </th>
              <th class="text-secondary opacity-7"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedItems.length === 0">
              <td colspan="6" class="text-center">No data available</td>
            </tr>
            <tr
              v-for="(queue, index) in paginatedItems"
              :key="index"
              class="hover-row"
              @click="goToAnswerQuestion(queue.QueueListID)"
            >
              <td style="padding-left: 25px">{{ queue.QueueListID }}</td>
              <td style="padding-left: 25px">{{ queue.AccessCode }}</td>
              <td style="padding-left: 25px">{{ queue.CourseName }}</td>
              <td>
                <span
                  :class="{
                    'badge bg-success': queue.Status === 'RUNNING',
                    'badge bg-danger': queue.Status === 'PAUSED',
                    'badge bg-secondary': queue.Status == 'CLOSED',
                  }"
                >
                  {{ queue.Status }}
                </span>
              </td>
              <td style="padding-left: 25px">{{ queue.TimeOut }}</td>
              <td style="padding-left: 25px">{{ queue.CurrentJoins }}</td>
              <td style="padding-left: 25px">{{ queue.Created }}</td>
              <td>
                <button
                  v-if="queue.Status === 'PAUSED'"
                  class="btn btn-success btn-sm"
                  style="margin-right: 6px; width: 100px"
                  @click.stop="RunQueue(queue.QueueListID)"
                >
                  Run
                </button>
                <button
                  v-if="queue.Status === 'RUNNING'"
                  class="btn btn-warning btn-sm"
                  style="margin-right: 6px"
                  @click.stop="PauseQueue(queue.QueueListID)"
                >
                  Pause
                </button>

                <button
                  class="btn btn-danger btn-sm"
                  style="margin-right: 6px"
                  @click.stop="CloseQueue(queue.QueueListID)"
                >
                  Close
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Page -->
    <div class="pagination d-flex justify-content-center">
      <button class="btn btn-secondary" @click="currentPage--" :disabled="currentPage === 1">
      Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button class="btn btn-secondary" @click="currentPage++" :disabled="currentPage === totalPages">
      Next
      </button>
    </div>
    <!-- End Page -->
  </div>
  <br />
</template>

<script>
import { useRouter } from "vue-router";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";
import {
  GetQueue_listByCreatorID,
  getCurrentJoins,
  PauseQueue,
  CloseQueue,
  RunQueue,
  GetQueueTimeryCreatorID,
} from "../../assets/Domain.js";
export default {
  data() {
    return {
      items: [],
      showAccessCode: false,
      AlertAccessCodeOnce: false,
      currentPage: 1,
      itemsPerPage: 5,
    };
  },
  setup() {
    const router = useRouter();
    const UserID = localStorage.getItem("UserID");
    let Email = localStorage.getItem("Email");
    if (Email === null || Email === "") {
      router.push("/signin");
    }
    return { Email, UserID };
  },
  computed: {
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.items.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
  },
  methods: {
    async RunQueue(QueueListID) {
      try {
        const response = await fetch(`${RunQueue}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ QueueListID }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        this.GetQueue();
      } catch (error) {
        console.error("Error running queue:", error);
      }
    },
    async CloseQueue(QueueListID) {
      try {
        const response = await fetch(`${CloseQueue}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ QueueListID }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        this.GetQueue();
      } catch (error) {
        console.error("Error closing queue:", error);
      }
    },
    async PauseQueue(QueueListID) {
      try {
        const response = await fetch(`${PauseQueue}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ QueueListID }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        this.GetQueue();
      } catch (error) {
        console.error("Error closing queue:", error);
      }
    },
    async getJoins(QueueListID) {
      try {
        const response = await fetch(`${getCurrentJoins}/${QueueListID}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data[0].userCount;
      } catch (error) {
        console.error("Error fetching current joins:", error);
        return 0;
      }
    },
    goToAnswerQuestion(QueueListID) {
      this.$router.push({
        path: "/managequeue/answerquestion",
        query: { QueueListID: QueueListID },
      });
    },
    goToCreateQueue() {
      this.$router.push("/createqueue");
    },
    async GetTimeOut() {
      try {
        const response = await fetch(
          `${GetQueueTimeryCreatorID}/${this.UserID}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        data.forEach((item) => {
          for (const queue of this.items) {
            if (queue.QueueListID === item.QueueListID) {
              queue.TimeOut = this.Calculate_Timeout(item.TimeOut);
            }
          }
        });
      } catch (error) {
        console.error("Error fetching queue:", error);
      }
    },
    async GetQueue() {
      try {
        const response = await fetch(
          `${GetQueue_listByCreatorID}/${this.UserID}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        this.items = data;

        for (const item of this.items) {
          item.Created = new Date(item.Created).toLocaleDateString();
          item.CurrentJoins = await this.getJoins(item.QueueListID);
        }

        this.items.forEach((item) => {
          item.TimeOut = this.Calculate_Timeout(item.TimeOut);
        });

        const urlParams = new URLSearchParams(window.location.search);
        const showAccessCode = urlParams.get("showAccessCode");
        if (showAccessCode) {
          this.showAccessCode = showAccessCode === "true";
        }
        //console.log(this.showAccessCode);
        if (this.showAccessCode & !this.AlertAccessCodeOnce) {
          this.AlertAccessCodeOnce = true;
          this.PopAccessCode();
        }
        //console.log(this.items);
        //console.log(data);
      } catch (error) {
        console.error("Error fetching queue:", error);
      }
    },
    PopAccessCode() {
      if (this.AlertAccessCodeOnce) {
        return;
      }
      this.AlertAccessCodeOnce = true;
      const accessCode =
        this.items.length > 0
          ? this.items[this.items.length - 1].AccessCode
          : "";
      const CourseName =
        this.items.length > 0
          ? this.items[this.items.length - 1].CourseName
          : "";
      const CourseWeek =
        this.items.length > 0
          ? this.items[this.items.length - 1].CourseWeek
          : "";
      const modalHtml = `
    <div class="modal fade" id="accessCodeModal" tabindex="-1" aria-labelledby="accessCodeModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="accessCodeModalLabel">'${CourseName}' - Access Codes</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
             Access Code: <b> ${accessCode}</b> <br/>
           Week: ${CourseWeek}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;

      document.body.insertAdjacentHTML("beforeend", modalHtml);
      const accessCodeModal = new bootstrap.Modal(
        document.getElementById("accessCodeModal")
      );
      accessCodeModal.show();
      document
        .getElementById("accessCodeModal")
        .addEventListener("hidden.bs.modal", () => {
          this.showAccessCode = false;
        });
    },
    Calculate_Timeout(time) {
      let result = [];
      let days, hours, minutes, seconds;

      // Calculate days, hours, minutes, and seconds
      days = Math.floor(time / 86400);
      time %= 86400;
      hours = Math.floor(time / 3600);
      time %= 3600;
      minutes = Math.floor(time / 60);
      seconds = Math.floor(time % 60);

      // Determine which components to include in the result
      if (days > 0) {
        result.push(`${days} Day${days > 1 ? "s" : ""}`);
        if (hours > 0) {
          result.push(`${hours} Hour${hours > 1 ? "s" : ""}`);
        }
      } else if (hours > 0) {
        result.push(`${hours} Hour${hours > 1 ? "s" : ""}`);
        if (minutes > 0) {
          result.push(`${minutes} Min${minutes > 1 ? "s" : ""}`);
        }
      } else if (minutes > 0) {
        result.push(`${minutes} Min${minutes > 1 ? "s" : ""}`);
        if (seconds > 0) {
          result.push(`${seconds} Sec${seconds > 1 ? "s" : ""}`);
        }
      } else if (seconds > 0) {
        result.push(`${seconds} Sec${seconds > 1 ? "s" : ""}`);
      }

      return result.slice(0, 2).join(" and "); // Join the first two parts with " and "
    },
  },
  mounted() {
    this.GetTimeOut();
    setInterval(() => {
      this.GetTimeOut();
    }, 1000);
    this.GetQueue();
  },
};
</script>

<style scoped>
.badge {
  padding: 0.5em 0.75em;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  color: #fff;
}
.icon {
  align-items: center;
  justify-content: center;
  display: flex;
  padding-top: 8px;
}
.hover-row:hover {
  background-color: #f8f9fe;
}
.pagination {
  margin-top: 20px;
  text-align: center;
  margin-bottom: 6px;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  
}

.pagination span {
  margin: 0 10px;
}
</style>

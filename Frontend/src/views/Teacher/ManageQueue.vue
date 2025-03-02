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
            <tr v-if="items.length === 0">
              <td colspan="6" class="text-center">No data available</td>
            </tr>
            <tr v-for="(queue, index) in items" :key="index" class="hover-row" @click="goToAnswerQuestion(queue.QueueListID)">
              <td style="padding-left: 25px">{{ queue.QueueListID }}</td>
              <td style="padding-left: 25px">{{ queue.AccessCode }}</td>
              <td>
                <span
                  :class="{
                    'badge bg-success': queue.Status === 'RUNNING',
                    'badge bg-danger': queue.Status !== 'RUNNING',
                  }"
                >
                  {{ queue.Status }}
                </span>
              </td>
              <td style="padding-left: 25px">{{ queue.TimeOut }}</td>
              <td style="padding-left: 25px">1</td>
              <td style="padding-left: 25px">{{ queue.Created }}</td>
              <td>
                <button
                  class="btn btn-warning btn-sm"
                  style="margin-right: 6px"
                >
                  Pause
                </button>
                <button class="btn btn-danger btn-sm" style="margin-right: 6px">
                  Close
                </button>
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
import { useRouter } from "vue-router";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";
import { GetQueue_listByCreatorID } from "../../assets/Domain.js";
export default {
  data() {
    return {
      items: [],
      showAccessCode: false,
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
  methods: {
    goToAnswerQuestion(QueueListID){
      this.$router.push({
        path: "/managequeue/answerquestion",
        query: { QueueListID: QueueListID }
      });
    },
    goToCreateQueue() {
      this.$router.push("/createqueue");
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
        this.items.forEach((item) => {
          item.Created = new Date(item.Created).toLocaleDateString();
        });

        this.items.forEach((item) => {
          item.TimeOut = this.Calculate_Timeout(item.TimeOut);
        });
        const urlParams = new URLSearchParams(window.location.search);
        const showAccessCode = urlParams.get("showAccessCode");
        if (showAccessCode) {
          this.showAccessCode = showAccessCode === "true";
        }
        console.log(this.showAccessCode);
        if (this.showAccessCode) {
          this.PopAccessCode();
        }

        //console.log(data);
      } catch (error) {
        console.error("Error fetching queue:", error);
      }
    },
    PopAccessCode() {
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
      if (time < 60) {
        return `${time} sec`;
      } else if (time < 3600) {
        return `${Math.floor(time / 60)} min`;
      } else if (time < 86400) {
        return `${Math.floor(time / 3600)} hour`;
      } else {
        return `${Math.floor(time / 86400)} day`;
      }
    },
  },
  mounted() {
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
</style>

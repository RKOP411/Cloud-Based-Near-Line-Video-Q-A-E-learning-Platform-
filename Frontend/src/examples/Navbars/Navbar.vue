<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import Breadcrumbs from "../Breadcrumbs.vue";

const showMenu = ref(false);
const store = useStore();
const isRTL = computed(() => store.state.isRTL);

const route = useRoute();

const currentRouteName = computed(() => {
  return route.name;
});
// const currentDirectory = computed(() => {
//   let dir = route.path.split("/")[1];
//   return dir.charAt(0).toUpperCase() + dir.slice(1);
// });

const minimizeSidebar = () => store.commit("sidebarMinimize");
const toggleConfigurator = () => store.commit("toggleConfigurator");

const closeMenu = () => {
  setTimeout(() => {
    showMenu.value = false;
  }, 100);
};
</script>
<template>
  <nav
    class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl"
    :class="isRTL ? 'top-0 position-sticky z-index-sticky' : ''"
    v-bind="$attrs"
    id="navbarBlur"
    data-scroll="true"
  >
    <div class="px-3 py-1 container-fluid">
      <breadcrumbs
        :current-page="currentRouteName"
        :current-directory="currentRouteName"
      />

      <div
        class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4"
        :class="isRTL ? 'px-0' : 'me-sm-4'"
        id="navbar"
      >
        <div
          class="pe-md-3 d-flex align-items-center"
          :class="isRTL ? 'me-md-auto' : 'ms-md-auto'"
        ></div>
        <ul class="navbar-nav justify-content-end">
          <li class="nav-item d-flex align-items-center">
            <router-link
              :to="{ name: 'Signin' }"
              class="px-0 nav-link font-weight-bold text-white"
              target="_blank"
            >
              <i class="fa fa-user" :class="isRTL ? 'ms-sm-2' : 'me-sm-2'"></i>
              <span class="d-sm-inline d-none">Sign In</span>
            </router-link>
          </li>
          <li class="nav-item d-xl-none ps-3 d-flex align-items-center">
            <a
              href="#"
              @click="minimizeSidebar"
              class="p-0 nav-link text-white"
              id="iconNavbarSidenav"
            >
              <div class="sidenav-toggler-inner">
                <i class="sidenav-toggler-line bg-white"></i>
                <i class="sidenav-toggler-line bg-white"></i>
                <i class="sidenav-toggler-line bg-white"></i>
              </div>
            </a>
          </li>
          <li class="px-3 nav-item d-flex align-items-center">
            <a class="p-0 nav-link text-white" @click="toggleConfigurator">
              <i class="cursor-pointer fa fa-cog fixed-plugin-button-nav"></i>
            </a>
          </li>
          <li
            class="nav-item dropdown d-flex align-items-center"
            :class="isRTL ? 'ps-2' : 'pe-2'"
          >
            <a
              href="#"
              class="p-0 nav-link text-white"
              :class="[showMenu ? 'show' : '']"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              @click="showMenu = !showMenu"
              @blur="closeMenu"
            >
              <i class="cursor-pointer fa fa-bell position-relative">
                <span
                  v-if="tableData.length > 0"
                  class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle d-flex justify-content-center align-items-center text-white"
                  style="width: 20px; height: 20px; font-size: 7px"
                >
                  {{ tableData.length }}
                </span>
              </i>
            </a>
            <ul
              class="px-2 py-3 dropdown-menu dropdown-menu-end me-sm-n4"
              :class="showMenu ? 'show' : ''"
              aria-labelledby="dropdownMenuButton"
            >
              <li
                v-if="tableData.length === 0"
                class="text-center text-secondary"
              >
                <span>No notifications</span>
              </li>
              <li
                v-else-if="Role === 'Student' && tableData.length > 0"
                v-for="notification in tableData"
                :key="notification.NotificationID"
                class="mb-3"
                @click="ClickNotifi(notification.NotificationID)"
              >
                <a
                  class="dropdown-item border-radius-md shadow-sm p-3"
                  href="javascript:;"
                  style="
                    background-color: #f9f9f9;
                    border-left: 4px solid #007bff;
                  "
                >
                  <div class="d-flex align-items-start">
                    <div class="me-3">
                      <i
                        class="fa fa-user-circle"
                        aria-hidden="true"
                        style="font-size: 2rem; color: #007bff"
                      ></i>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-1 text-sm font-weight-normal">
                        <span class="font-weight-bold text-dark"
                          >New Reply</span
                        >
                        from
                        <span class="font-weight-bold">{{
                          notification.T_rank
                        }}</span>
                        <span class="text-primary">{{
                          notification.UserName
                        }}</span>
                        in
                        <span class="font-weight-bold text-primary">{{
                          notification.CourseName
                        }}</span>
                        for
                        <span class="font-weight-bold">{{
                          notification.QuestionTitle
                        }}</span>
                      </h6>
                      <p class="mb-1 text-xs text-secondary">
                        <i class="fa fa-clock me-1"></i>
                        <span :title="notification.CreatedAt">{{
                          TimeAgo(notification.CreatedAt)
                        }}</span>
                      </p>
                    </div>
                  </div>
                </a>
              </li>
              <li
                v-else-if="Role === 'Teacher' && tableData.length > 0"
                v-for="invitation in tableData"
                :key="invitation.InvitationID"
                class="mb-3"
              >
                <a
                  class="dropdown-item border-radius-md shadow-sm p-3"
                  href="javascript:;"
                  style="
                    background-color: #f9f9f9;
                    border-left: 4px solid #28a745;
                  "
                >
                  <div class="d-flex align-items-start">
                    <div class="me-3">
                      <i
                        class="fa fa-envelope"
                        aria-hidden="true"
                        style="font-size: 2rem; color: #28a745"
                      ></i>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-1 text-sm font-weight-normal">
                        <span class="font-weight-bold text-dark"
                          >New Invitation</span
                        >
                        from
                        <span class="font-weight-bold text-primary">{{
                          invitation.UserName
                        }}</span>
                        of Course
                        <span class="font-weight-bold text-primary">{{
                          invitation.CourseName
                        }}</span>
                        in Queue
                        <span class="font-weight-bold">{{
                          invitation.CourseWeek
                        }}</span>
                      </h6>
                      <button
                        class="btn btn-success btn-sm mt-2"
                        @click="joinCourse(invitation.InvitationID)"
                      >
                        Join
                      </button>
                      <p class="mb-1 text-xs text-secondary">
                        <i class="fa fa-clock me-1"></i>
                        <span :title="invitation.CreatedAt">{{
                          TimeAgo(invitation.CreatedAt)
                        }}</span>
                      </p>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import {
  getNotifications,
  removeNotificationByNotificationID,
  getInvitation,
} from "../../assets/Domain.js";

export default {
  data() {
    return {
      Role: localStorage.getItem("Role"),
      tableData: [],
      UserID: localStorage.getItem("UserID"),
    };
  },
  methods: {
    getInvitation() {
      if (this.Role === "Teacher") {
        fetch(`${getInvitation}/${this.UserID}`)
          .then((response) => response.json())
          .then((data) => {
            this.tableData = data;
            //console.log(this.tableData);
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
      }
    },
    ClickNotifi(NotificationID) {
      //console.log(NotificationID);
      fetch(`${removeNotificationByNotificationID}/${NotificationID}`, {
        method: "PUT",
      })
        .then((response) => {
          if (response.ok) {
            console.log("Notification deleted successfully");
            this.getAllNotifi();
          } else {
            console.error("Error deleting notification");
          }
        })
        .catch((error) => {
          console.error("Error deleting notification:", error);
        });
      this.getAllNotifi();
    },
    TimeAgo(NotifiMessage) {
      const date = new Date(NotifiMessage);
      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);
      let interval = Math.floor(seconds / 31536000);
      if (interval > 1) return interval + " years ago";
      interval = Math.floor(seconds / 2592000);
      if (interval > 1) return interval + " months ago";
      interval = Math.floor(seconds / 86400);
      if (interval > 1) return interval + " days ago";
      interval = Math.floor(seconds / 3600);
      if (interval > 1) return interval + " hours ago";
      interval = Math.floor(seconds / 60);
      if (interval > 1) return interval + " minutes ago";
      return seconds < 30 ? "Just now" : seconds + " seconds ago";
    },
    async getAllNotifi() {
      try {
        const response = await fetch(`${getNotifications}/${this.UserID}`);
        const data = await response.json();
        this.tableData = data;
        //console.log(this.tableData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
  },
  mounted() {
    if (this.Role === "Teacher") {
      this.getInvitation();
    }
    if (this.Role === "Student") {
      this.getAllNotifi();
    }

    if (this.Role === "Student") {
      setInterval(() => {
        this.getAllNotifi();
      }, 5000);
    }
    if (this.Role === "Teacher") {
      setInterval(() => {
        this.getInvitation();
      }, 5000);
    }
  },
};
</script>

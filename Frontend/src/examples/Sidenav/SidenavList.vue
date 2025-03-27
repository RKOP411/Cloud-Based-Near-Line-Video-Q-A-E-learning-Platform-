<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import SidenavItem from "./SidenavItem.vue";

// state
const store = useStore();
const isRTL = computed(() => store.state.isRTL);
const lan = computed(() => store.state.lan);
let Role = localStorage.getItem("Role");
console.log("localStorage.getItem(): " + localStorage.length);

if (Role === null || Role === "") {
  Role = "Student";
}
console.log(Role);

const getRoute = () => {
  const route = useRoute();
  const routeArr = route.path.split("/");
  return routeArr[1];
};

let QueueListID = ref("");
if (localStorage.getItem("QueueListID") != null) {
  QueueListID.value = localStorage.getItem("QueueListID");
}

// Language text mapping
const getText = (key) => {
  const translations = {
    Dashboard: {
      en: "Dashboard",
      zh: "儀表板",
      "zh-TW": "儀表板",
    },
    "Queue Management": {
      en: "Queue Management",
      zh: "隊列管理",
      "zh-TW": "隊列管理",
    },
    "Question List": {
      en: "Question List",
      zh: "問題列表",
      "zh-TW": "問題列表",
    },
    Queue: {
      en: "Queue",
      zh: "加入隊列",
      "zh-TW": "加入隊列",
    },
    "Question History": {
      en: "Question History",
      zh: "問題歷史",
      "zh-TW": "問題歷史",
    },
    Forum: {
      en: "Forum",
      zh: "論壇",
      "zh-TW": "論壇",
    },
    "Your Course": {
      en: "Your Course",
      zh: "您的課程",
      "zh-TW": "您的課程",
    },
    Profile: {
      en: "Profile",
      zh: "個人資料",
      "zh-TW": "個人資料",
    },
    "Sign In": {
      en: "Sign In",
      zh: "登入",
      "zh-TW": "登入",
    },
    "Sign Up": {
      en: "Sign Up",
      zh: "註冊",
      "zh-TW": "註冊",
    },
  };

  return translations[key]?.[lan.value] || key;
};
</script>

<template>
  <div
    class="collapse navbar-collapse w-auto h-auto h-100"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-item
          v-if="Role == 'Teacher'"
          to="/dashboard-default"
          :class="getRoute() === 'dashboard-default' ? 'active' : ''"
          :navText="getText('Dashboard')"
        >
          <template v-slot:icon>
            <i
              class="ni ni-chart-bar-32 text-primary text-sm opacity-10"
              aria-hidden="true"
            ></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
          v-if="Role == 'Student'"
          to="/stu_dashboard"
          :class="getRoute() === 'stu_dashboard' ? 'active' : ''"
          :navText="getText('Dashboard')"
        >
          <template v-slot:icon>
            <i
              class="ni ni-chart-pie-35 text-primary text-sm opacity-10"
              aria-hidden="true"
            ></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          v-if="Role == 'Teacher'"
          to="/managequeue"
          :class="getRoute() === 'billing' ? 'active' : ''"
          :navText="getText('Queue Management')"
        >
          <template v-slot:icon>
            <i class="fa fa-list-alt text-warning text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
          v-if="Role == 'Student' && QueueListID"
          to="/questionlist"
          :class="getRoute() === 'questionlist' ? 'active' : ''"
          :navText="getText('Question List')"
        >
          <template v-slot:icon>
            <i class="fa fa-list text-warning text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
          v-if="Role == 'Student' && !QueueListID"
          to="/joinqueue"
          :class="getRoute() === 'billing' ? 'active' : ''"
          :navText="getText('Queue')"
        >
          <template v-slot:icon>
            <i class="fa fa-list text-warning text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          v-if="Role == 'Student'"
          to="/viewanswer"
          :class="getRoute() === 'viewanswer' ? 'active' : ''"
          :navText="getText('Question History')"
        >
          <template v-slot:icon>
            <i class="fa fa-history text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/tables"
          :class="getRoute() === 'tables' ? 'active' : ''"
          :navText="getText('Forum')"
        >
          <template v-slot:icon>
            <i class="ni ni-chat-round text-success text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          v-if="Role == 'Teacher'"
          to="/coursemanage"
          :class="getRoute() === 'coursemanage' ? 'active' : ''"
          :navText="getText('Your Course')"
        >
          <template v-slot:icon>
            <i class="fa fa-users text-secondary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="mt-3 nav-item">
        <h6
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="isRTL ? 'me-4' : 'ms-2'"
        >
          {{ getText('ACCOUNT PAGES') }}
        </h6>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/profile"
          :class="getRoute() === 'profile' ? 'active' : ''"
          :navText="getText('Profile')"
        >
          <template v-slot:icon>
            <i class="ni ni-single-02 text-dark text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/signin"
          :class="getRoute() === 'signin' ? 'active' : ''"
          :navText="getText('Sign In')"
        >
          <template v-slot:icon>
            <i class="ni ni-single-copy-04 text-danger text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/signup"
          :class="getRoute() === 'signup' ? 'active' : ''"
          :navText="getText('Sign Up')"
        >
          <template v-slot:icon>
            <i class="ni ni-collection text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
    </ul>
  </div>
</template>

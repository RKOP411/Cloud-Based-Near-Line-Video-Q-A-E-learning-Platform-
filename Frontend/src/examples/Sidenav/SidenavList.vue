<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import SidenavItem from "./SidenavItem.vue";

const store = useStore();
const isRTL = computed(() => store.state.isRTL);
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
          :navText="'Dashboard'"
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
          :navText="'Dashboard'"
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
          :navText="'Queue Management'"
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
          :navText="'Question List'"
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
          :navText="'Queue'"
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
          :navText="'Question History'"
        >
          <template v-slot:icon>
            <i class="fa fa-history text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          v-if="Role == 'Admin'"
          to="/userList"
          :class="getRoute() === 'billing' ? 'active' : ''"
          :navText="'Question List'"
        >
          <template v-slot:icon>
            <i class="fa fa-list text-warning text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          v-if="Role == 'Admin'"
          to="/mediaList"
          :class="getRoute() === 'billing' ? 'active' : ''"
          :navText="'Question List'"
        >
          <template v-slot:icon>
            <i class="fa fa-list text-warning text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/tables"
          :class="getRoute() === 'tables' ? 'active' : ''"
          :navText="'Forum'"
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
          :navText="'Your Course'"
        >
          <template v-slot:icon>
            <i class="fa fa-users text-secondary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <!-- <li class="nav-item">
        <sidenav-item
          to="/virtual-reality"
          :class="getRoute() === 'virtual-reality' ? 'active' : ''"
          :navText="'Virtual Reality'"
        >
          <template v-slot:icon>
            <i class="ni ni-app text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li> -->

      <!-- ACCOUNT PAGES -->

      <li class="mt-3 nav-item">
        <h6
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="isRTL ? 'me-4' : 'ms-2'"
        >
          ACCOUNT PAGES
        </h6>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/profile"
          :class="getRoute() === 'profile' ? 'active' : ''"
          :navText="'Profile'"
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
          :navText="'Sign In'"
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
          :navText="'Sign Up'"
        >
          <template v-slot:icon>
            <i class="ni ni-collection text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
    </ul>
  </div>
</template>

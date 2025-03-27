<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { activateDarkMode, deactivateDarkMode } from "@/assets/js/dark-mode";
import "@/assets/css/nucleo-icons.css";
import "@/assets/css/nucleo-svg.css";

const store = useStore();
// state
const lan = computed(() => store.state.lan);
const isNavFixed = computed(() => store.state.isNavFixed);
const sidebarType = computed(() => store.state.sidebarType);
const toggleConfigurator = () => store.commit("toggleConfigurator");
const localStorage_lan = localStorage.getItem("language");
if (localStorage_lan) {
  store.commit("setLanguage", localStorage_lan);
}
// mutations
const navbarFixed = () => store.commit("navbarFixed");
const setSidebarType = (type) => store.commit("sidebarType", type);

const sidebarColor = (color = "success") => {
  document.querySelector("#sidenav-main").setAttribute("data-color", color);
};

const darkMode = () => {
  if (store.state.darkMode) {
    store.state.darkMode = false;
    setSidebarType("bg-white");
    deactivateDarkMode();
    return;
  } else {
    store.state.darkMode = true;
    setSidebarType("bg-default");
    activateDarkMode();
  }
};
const store_lan = () => {
  localStorage.setItem("language", store.state.lan);
};
</script>
<template>
  <div class="fixed-plugin">
    <button
      v-if="store.state.showConfig"
      class="btn btn-link text-dark position-fixed"
      style="top: 10px; right: 10px; z-index: 1031"
      @click="toggleConfigurator"
    >
      <i class="fa fa-times"></i>
    </button>
    <a
      class="px-3 py-2 fixed-plugin-button text-dark position-fixed"
      @click="toggleConfigurator"
    >
      <i class="py-2 fa fa-cog"></i>
    </a>
    <div class="shadow-lg card">
      <div class="pt-3 pb-0 bg-transparent card-header">
        <div
          class=""
          :class="lan === 'zh' || lan === 'zh-TW' ? 'float-end' : 'float-start'"
        >
          <h5 class="mt-3 mb-0">
            {{
              lan === "zh" ? "設定" : lan === "zh-TW" ? "設定" : "Configurator"
            }}
          </h5>
          <p>
            {{
              lan === "zh"
                ? "查看我们的仪表板选项。"
                : lan === "zh-TW"
                  ? "查看我們的儀表板選項。"
                  : "See our dashboard options."
            }}
          </p>
        </div>
        <div
          class="mt-4"
          @click="toggleConfigurator"
          :class="lan === 'zh' || lan === 'zh-TW' ? 'float-start' : 'float-end'"
        >
          <button class="p-0 btn btn-link text-dark fixed-plugin-close-button">
            <i class="fa fa-close"></i>
          </button>
        </div>
        <!-- End Toggle Button -->
      </div>
      <hr class="my-1 horizontal dark" />
      <div class="pt-0 card-body pt-sm-3">
        <!-- Sidebar Backgrounds -->
        <div>
          <h6 class="mb-0">
            {{
              lan === "zh"
                ? "侧边栏颜色"
                : lan === "zh-TW"
                  ? "側邊欄顏色"
                  : "Sidebar Colors"
            }}
          </h6>
        </div>
        <a href="#" class="switch-trigger background-color">
          <div
            class="my-2 badge-colors"
            :class="lan === 'zh' || lan === 'zh-TW' ? 'text-end' : 'text-start'"
          >
            <span
              class="badge filter bg-gradient-primary active"
              data-color="primary"
              @click="sidebarColor('primary')"
            ></span>
            <span
              class="badge filter bg-gradient-dark"
              data-color="dark"
              @click="sidebarColor('dark')"
            ></span>
            <span
              class="badge filter bg-gradient-info"
              data-color="info"
              @click="sidebarColor('info')"
            ></span>
            <span
              class="badge filter bg-gradient-success"
              data-color="success"
              @click="sidebarColor('success')"
            ></span>
            <span
              class="badge filter bg-gradient-warning"
              data-color="warning"
              @click="sidebarColor('warning')"
            ></span>
            <span
              class="badge filter bg-gradient-danger"
              data-color="danger"
              @click="sidebarColor('danger')"
            ></span>
          </div>
        </a>
        <!-- Sidenav Type -->
        <div class="mt-3">
          <h6 class="mb-0">
            {{
              lan === "zh"
                ? "侧边导航类型"
                : lan === "zh-TW"
                  ? "側邊導航類型"
                  : "Sidenav Type"
            }}
          </h6>
          <p class="text-sm">
            {{
              lan === "zh"
                ? "选择两种不同的侧边导航类型之一。"
                : lan === "zh-TW"
                  ? "選擇兩種不同的側邊導航類型之一。"
                  : "Choose between 2 different sidenav types."
            }}
          </p>
        </div>
        <div class="d-flex gap-2">
          <button
            id="btn-white"
            class="btn w-100 px-3 mb-2"
            :class="
              sidebarType === 'bg-white'
                ? 'bg-gradient-success'
                : 'btn-outline-success'
            "
            @click="setSidebarType('bg-white')"
          >
            {{ lan === "zh" ? "白色" : lan === "zh-TW" ? "白色" : "White" }}
          </button>
          <button
            id="btn-dark"
            class="btn w-100 px-3 mb-2"
            :class="
              sidebarType === 'bg-default'
                ? 'bg-gradient-success'
                : 'btn-outline-success'
            "
            @click="setSidebarType('bg-default')"
          >
            {{ lan === "zh" ? "黑色" : lan === "zh-TW" ? "黑色" : "Dark" }}
          </button>
        </div>
        <p class="mt-2 text-sm d-xl-none d-block">
          {{
            lan === "zh"
              ? "您只能在桌面视图上更改侧边导航类型。"
              : lan === "zh-TW"
                ? "您只能在桌面視圖上更改側邊導航類型。"
                : "You can change the sidenav type just on desktop view."
          }}
        </p>
        <!-- Navbar Fixed -->
        <div class="mt-3 d-flex">
          <h6 class="mb-0">
            {{
              lan === "zh"
                ? "固定导航栏"
                : lan === "zh-TW"
                  ? "固定導航欄"
                  : "Navbar Fixed"
            }}
          </h6>
          <div class="form-check form-switch ps-0 ms-auto my-auto">
            <input
              class="mt-1 form-check-input"
              :class="
                lan === 'zh' || lan === 'zh-TW'
                  ? 'float-end  me-auto'
                  : 'ms-auto'
              "
              type="checkbox"
              id="navbarFixed"
              :checked="isNavFixed"
              @click="navbarFixed"
            />
          </div>
        </div>

        <hr class="horizontal dark my-4" />
        <div class="mt-2 mb-5 d-flex">
          <h6
            class="mb-0"
            :class="lan === 'zh' || lan === 'zh-TW' ? 'ms-2' : ''"
          >
            {{
              lan === "zh"
                ? "浅色 / 深色"
                : lan === "zh-tw"
                  ? "淺色 / 深色"
                  : "Light / Dark"
            }}
          </h6>
          <div class="form-check form-switch ps-0 ms-auto my-auto">
            <input
              class="form-check-input mt-1 ms-auto"
              type="checkbox"
              :checked="store.state.darkMode"
              @click="darkMode"
            />
          </div>
        </div>
        <!-- Set Language -->
        <div class="mt-2 mb-5 d-flex">
          <h6
            class="mb-0"
            :class="lan === 'zh' || lan === 'zh-TW' ? 'ms-2' : ''"
          >
            {{ lan === "zh" ? "语言" : lan === "zh-TW" ? "語言" : "Language" }}
          </h6>
          <div class="form-check form-switch ps-0 ms-auto my-auto">
            <select
              class="form-select"
              id = "lan_select"
              v-model="store.state.lan"
              @change="
                () => {
                  store.commit('setLanguage', store.state.lan);
                  store_lan();
                }
              "
            >
              <option value="en">English</option>
              <option value="zh">中文</option>
              <option value="zh-TW">台灣(正體中文)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

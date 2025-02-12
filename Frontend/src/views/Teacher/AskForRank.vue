<script setup>
import { onBeforeUnmount, onBeforeMount } from "vue";
import { useStore } from "vuex";
import AppFooter from "@/examples/PageLayout/Footer.vue";
// import ArgonInput from "@/components/ArgonInput.vue";
// import ArgonCheckbox from "@/components/ArgonCheckbox.vue";
import ArgonButton from "@/components/ArgonButton.vue";
const body = document.getElementsByTagName("body")[0];
const store = useStore();
onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");
});
onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});
const router = useRouter();
const form = ref({
  T_rank: "",
});
const UserID = ref("");
const errmsg = ref("");

onMounted(() => {
  UserID.value = localStorage.getItem("UserID");
  console.log("UserID:", UserID.value);
});

const submitForm = async () => {
  if (form.value.T_rank === "" || form.value.T_rank === null) {
    errmsg.value = "Could you please share how you would like to be addressed? Thank you!";
    return;
  }

  await fetch(UpdateRankByUserID, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      UserID: UserID.value,
      T_rank: form.value.T_rank,
    }),
  });
  router.push("/");
};
</script>
<template>
  <main class="main-content mt-0">
    <div
      class="page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg"
      style="
        background-image: url(&quot;https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signup-cover.jpg&quot;);
        background-position: top;
      "
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 text-center mx-auto">
            <div class="card z-index-0 full-round" style="margin-top: 200px">
              <div class="card-header text-center pt-4">
                <form @submit.prevent="submitForm">
                  <div class="alert alert-info" role="alert" v-if="errmsg">
                    {{ errmsg }}
                  </div>
                  <select
                    v-model="form.T_rank"
                    class="form-select"
                    aria-label="T_rank"
                  >
                    <option value="" disabled>How can I call you</option>
                    <option value="Dr">Dr: Doctor</option>
                    <option value="Prof">Prof: Professor</option>
                    <option value="TA">TA: Teaching Assistant</option>
                    <option value="Inst">Inst: Instructor</option>
                  </select>
                  <argon-button
                    fullWidth
                    color="dark"
                    variant="gradient"
                    class="my-4 mb-2"
                    >Confirm</argon-button
                  >
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <app-footer />
</template>
<script>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue"; // Import ref and onMounted for reactivity
import { UpdateRankByUserID } from "../../assets/Domain.js";

export default {
  setup() {
    const router = useRouter();
    const form = ref({
      T_rank: "",
    });
    const UserID = ref("");
    const errmsg = ref("");

    // Fetch UserID when mounted
    onMounted(() => {
      UserID.value = localStorage.getItem("UserID");
      console.log("UserID:", UserID.value);
    });

    const submitForm = async () => {
      if (form.value.T_rank === "" || form.value.T_rank === null) {
        errmsg.value = "Could you please share how you would like to be addressed? Thank you!";
        return;
      }

      await fetch(UpdateRankByUserID, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserID: UserID.value,
          T_rank: form.value.T_rank,
        }),
      });
      router.push("/");
    };

    return {
      form,
      UserID,
      errmsg,
      submitForm,
    };
  },
};
</script>
<style>
.full-round {
  border-radius: 30px !important;
}
</style>

<script setup>
import { onBeforeUnmount, onBeforeMount } from "vue";
import { useStore } from "vuex";

import ArgonInput from "@/components/ArgonInput.vue";
import ArgonSwitch from "@/components/ArgonSwitch.vue";
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
</script>
<template>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0">
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Sign In</h4>
                  <p class="mb-0">Enter your email and password to sign in</p>
                </div>
                <div class="card-body">
                  <div class="alert alert-danger" role="alert" v-if="errmsg">
                    {{ errmsg }}
                  </div>
                  <form role="form" @submit.prevent="login">
                    <div class="mb-3">
                      <argon-input
                        id="email"
                        type="email"
                        placeholder="Email"
                        name="email"
                        size="lg"
                        v-model="form.Email"
                      />
                    </div>
                    <div class="mb-3">
                      <argon-input
                        id="password"
                        type="password"
                        placeholder="Password"
                        name="password"
                        size="lg"
                        v-model="form.Password"
                      />
                    </div>
                    <argon-switch class="mb-3" id="rememberMe" name="remember-me"
                      >Remember me</argon-switch
                    >
                    <a href="javascript:;" class="text-primary text-gradient"
                      >Forget Password</a
                    >
                    <div class="text-center">
                      <argon-button
                        class="mt-4"
                        variant="gradient"
                        color="success"
                        fullWidth
                        size="lg"
                        >Sign in</argon-button
                      >
                    </div>
                  </form>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    Don't have an account?
                    <a href="/signup" class="text-success text-gradient font-weight-bold"
                      >Sign up</a
                    >
                  </p>
                </div>
              </div>
            </div>
            <div
              class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column"
            >
              <div
                class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="
                  background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg');
                  background-size: cover;
                "
              >
                <span class="mask bg-gradient-success opacity-6"></span>
                <h4 class="mt-5 text-white font-weight-bolder position-relative">
                  "The beautiful thing about learning is that no one can take it away from
                  you."
                </h4>
                <br />
                <p class="text-white position-relative">— B.B. King</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<script>
import { VerifyEmail } from "../assets/Verify.js";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      form: {
        Email: "",
        Password: "",
        Role: "",
      },
      errmsg: "",
    };
  },
  methods: {
    async login() {
      if (this.form.Email === "" || this.form.Password === "") {
        this.errmsg = "Please fill all fields";
        return;
      }
      this.errmsg = "";

      const data = await VerifyEmail(this.form.Email);
      if (!data[0]) {
        this.errmsg = "Email not found";
        return;
      } else if (data[0].Email !== this.form.Email) {
        this.errmsg = "Email is incorrect";
        return;
      } else if (data[0].Password !== this.form.Password) {
        this.errmsg = "Password is incorrect";
        return;
      } else {
        localStorage.setItem("Role", data[0].Role);
        localStorage.setItem("Email", this.form.Email);
        this.$router.push("/");
      }
    },
  },
};
</script>

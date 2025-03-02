<template>
  <main>
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">

                <p class="mb-0">Join Queue</p>
              </div>
            </div>
            <div class="card-body">
              <div v-if="errmsg" class="alert alert-danger" role="alert"> {{ errmsg }}</div>
              <!-- Select Bar-->
              <ul class="nav nav-tabs mb-3">
                <li class="nav-item">
                  <a
                    :class="['nav-link', IsLink ? 'active' : '']"
                    aria-current="page"
                    href="#"
                    @click="CheangeToLink"
                    >Access Code</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    :class="['nav-link', IsQRcode ? 'active' : '']"
                    href="#"
                    @click="CheangeToQR"
                    >QR Code</a
                  >
                </li>
              </ul>
              <!--Queue Code-->
              <div class="row">
                <div class="col-md-9 mb-4" v-if="IsLink">
                  <label class="form-control-label">Code</label>
                  <input
                    class="form-control"
                    type="text"
                    v-model="AccessCode"
                    placeholder="1234-4567 *"
                  />
                </div>
                <!-- Queue Code End -->
                <br />

                <!-- QR Code Input-->
                <div class="col-md-9 mb-3" v-if="IsQRcode">
                  <label class="form-control-label">QR Code</label>
                  <!-- QR Scanner -->
                  <div>
                    <br />
                  </div>
                  <!-- QR Scanner End -->
                </div>
                <!-- QR Code Inputtt End -->
              </div>
              <hr class="horizontal dark" />
              <button type="button" class="btn btn-success" @click="JoinQueue">Join</button>
            </div>
            <hr class="horizontal dark" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import { FindQueueByAccessCode } from "../../assets/Domain.js";
export default {
  data() {
    return {
      errmsg: "",
      IsQRcode: false,
      IsLink: true,
      AccessCode: "",
      RetrunQueueListID: "",
    };
  },
  methods: {
    CheangeToQR() {
      this.IsQRcode = true;
      this.IsLink = false;
    },
    CheangeToLink() {
      this.IsQRcode = false;
      this.IsLink = true;
    },
    async JoinQueue() {
      if(this.AccessCode === ""){
        this.errmsg = "Please enter Access code";
        return;
      }
      const response = await fetch(
          `${FindQueueByAccessCode}/${this.AccessCode}`
        );

      const data = await response.json();
      this.RetrunQueueListID = data.QueueListID;
      localStorage.setItem('QueueListID', this.RetrunQueueListID);
      this.$router.push({
        path: "/questionlist",
      
      });
    },
  },
};
</script>

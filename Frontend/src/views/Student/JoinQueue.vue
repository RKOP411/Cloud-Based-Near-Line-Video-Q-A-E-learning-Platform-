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
              <div class="alert alert-danger" role="alert"></div>
              <!-- Select Bar-->
              <ul class="nav nav-tabs mb-3">
                <li class="nav-item">
                  <a
                    :class="['nav-link', IsLink ? 'active' : '']"
                    aria-current="page"
                    href="#"
                    @click="CheangeToLink"
                    >Link</a
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
                  <label class="form-control-label">Queue Code</label>
                  <input
                    class="form-control"
                    type="text"
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
              <button type="button" class="btn btn-success">Join</button>
            </div>
            <hr class="horizontal dark" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
export default {
  data() {
    return {
      IsQRcode: false,
      IsLink: true,
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
  },
};
</script>

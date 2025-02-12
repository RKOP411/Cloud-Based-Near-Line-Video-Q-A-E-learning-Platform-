<template>
  <main>
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <p class="mb-0">Create Queue</p>
              </div>
            </div>
            <div class="card-body">
              <div class="alert alert-danger" role="alert"></div>
              <ul class="nav nav-tabs mb-3">
                <li class="nav-item">
                  <a
                    class="'nav-link' active"
                    aria-current="page"
                    href="#"
                    @click="CheangeToLink"
                    >Link</a
                  >
                </li>
              </ul>
              <!-- Course Selete Bar-->
              <div class="col-md-9 mb-4">
                <label class="form-control-label">Course</label>
                <select
                  class="form-select"
                  aria-label="Select Week"
                  v-model="type"
                >
                  <option value="theory" selected>COMP4111</option>
                  <option value="lab-work">COMP2321</option>
                  <option value="debugging">GTSC1232</option>
                  <option value="assignments">GFVM3212</option>
                </select>
              </div>
              <!-- Course Selete Bar End-->
              <!--Queue Code-->
              <div class="row">
                <div class="col-md-9 mb-4">
                    <label class="form-control-label">Time Out</label>
                    <select class="form-select" v-model="timeout">
                    <option value="1">1 day</option>
                    <option value="3">3 days</option>
                    <option value="7">7 days</option>
                    </select>
                </div>
                <!---->
              </div>
              <hr class="horizontal dark" />
              <button type="button" class="btn btn-success">Create</button>
            </div>
            <hr class="horizontal dark" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script></script>

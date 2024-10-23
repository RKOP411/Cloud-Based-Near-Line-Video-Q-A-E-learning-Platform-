<template>
  <main>
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <p class="mb-0">Send Question</p>
              </div>
            </div>
            <div class="card-body">
           
              <!-- Select Bar-->
              <ul class="nav nav-tabs mb-3">
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="#"
                    >Text</a
                  >
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Image & Video</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Link</a>
                </li>
              </ul>
              <!-- Select Bar End-->
              <div class="row">
                <div class="col-md-9 mb-4">
                  <label for="example-text-input" class="form-control-label"
                    >Question Title</label
                  >
                  <input
                    class="form-control"
                    type="text"
                    value=""
                    placeholder="Title *"
                  />
                </div>
                <br />
                <!-- Contant Input-->
                <div class="col-md-9 mb-3">
                  <label for="example-text-input" class="form-control-label"
                    >Description</label
                  >
                  <textarea
                    class="form-control"
                    id="description"
                    rows="3"
                  ></textarea>
                </div>
                <!-- Contant Input End-->
              </div>
              <hr class="horizontal dark" />
              <button type="button" class="btn btn-success">Send</button>
            </div>
            <hr class="horizontal dark" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

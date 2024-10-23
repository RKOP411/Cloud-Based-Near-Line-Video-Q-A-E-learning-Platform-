<template>
    <main>
      <div class="py-4 container-fluid">
        <div class="row">
          <div class="col-md-12">
            <div class="card">
              <div class="card-header pb-0">
                <div class="d-flex align-items-center">
                  <p class="mb-0">Join Chat</p>
                </div>
              </div>
              <div class="card-body">
             
                <!-- Select Bar-->
                <ul class="nav nav-tabs mb-3">
                  <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="#"
                      >Link</a
                    >
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#">QR Code</a>
                  </li>
                </ul>
                <!-- Select Bar End-->
                <div class="row">
                  <div class="col-md-9 mb-4">
                    <label for="example-text-input" class="form-control-label"
                      >Link</label
                    >
                    <input
                      class="form-control"
                      type="text"
                      value=""
                      placeholder="Link *"
                    />
                  </div>
                  <br />
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
  
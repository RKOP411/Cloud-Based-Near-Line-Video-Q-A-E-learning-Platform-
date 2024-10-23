<template>
      <main>
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <p class="mb-0">Create Chat</p>
              </div>
            </div>
            <div class="card-body">
              <p class="text-uppercase text-sm">Chat Information</p>
              <div class="row">
                <div class="col-md-9 mb-3">
                  <label for="example-text-input" class="form-control-label"
                    >Chat Name *</label
                  >
                  <input class="form-control" type="text" value="" placeholder="Input your Chat Gruop Name..."/>
                </div>
                
                <div class="col-md-9 mb-3">
                  <label for="example-text-input" class="form-control-label"
                    >Description</label
                  >
                  <input class="form-control" type="text" value=""/>
                </div>
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

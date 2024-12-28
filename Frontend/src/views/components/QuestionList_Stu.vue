<template>
  <div class="card">
    <div class="card-header pb-0 px-3">
      <h6 class="mb-0">Questions Information</h6>
      <div class="row">
        <div class="col-auto">
          <div class="avatar avatar-xl position-relative">
            <img
              src="../../assets/img/team-3.jpg"
              alt="profile_image"
              class="shadow-sm w-70 border-radius-lg"
            />
          </div>
        </div>
        <div class="col-auto my-auto">
          <div class="h-100">
            <h5 class="mb-1">Sayo Kravits</h5>
            <span class="badge badge-sm bg-gradient-success">Online</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="d-flex p-2 mb-1">
      <span class="input-group-text text-body">
        <i class="fas fa-search" aria-hidden="true"></i>
      </span>
      <input type="text" class="form-control" :placeholder="'Type here...'" />
    </div>
    <!-- Search Bar End-->

    <!-- Queue -->
    <div class="container mt-1">
      <div class="row mt-2">
        <div class="col-md-3">
          <div class="card queue-a text-white">
            <div class="card-body text-center">
              <h5 class="card-title">Lab Work</h5>
              <p class="card-text" id="currentSizeA">Current: 5</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card queue-b text-white">
            <div class="card-body text-center">
              <h5 class="card-title">Theory</h5>
              <p class="card-text" id="currentSizeB">Current: 3</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card queue-c text-white">
            <div class="card-body text-center">
              <h5 class="card-title">Assessments</h5>
              <p class="card-text" id="currentSizeC">Current: 8</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card queue-d text-white">
            <div class="card-body text-center">
              <h5 class="card-title">Debugging</h5>
              <p class="card-text" id="currentSizeD">Current: 2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Queue End -->
    <div class="card-body pt-4 p-3">
      <ul class="list-group">
        <!-- List Card -->
        <li
          class="list-group-item border-0 d-flex p-4 mb-2 bg-gray-100 border-radius-lg"
        >
          <div class="d-flex flex-column">
            <h6 class="mb-3 text-sm">You</h6>
            <span class="mb-2 text-xs">
              Type:
              <span class="text-dark font-weight-bold ms-sm-2">Theory</span>
            </span>
            <span class="mb-2 text-xs">
              Description:
              <span class="text-dark ms-sm-2 font-weight-bold"
                >Why is the vertex cover problem classified as NP-hard?</span
              >
            </span>
          </div>
          <div class="ms-auto text-end d-flex">
            <a class="btn btn-link text-dark px-3 mb-0" href="javascript:;">
              <i class="fa fa-eye text-dark me-2" aria-hidden="true"></i>
            </a>
          </div>
        </li>
        <!--End of List Card -->

        <li
          class="list-group-item border-0 d-flex p-4 mb-2 mt-3 bg-gray-100 border-radius-lg"
        >
          <div class="d-flex flex-column">
            <h6 class="mb-3 text-sm">Lucas Harper</h6>
            <span class="mb-2 text-xs">
              Type:
              <span class="text-dark font-weight-bold ms-sm-2">Theory</span>
            </span>
            <span class="mb-2 text-xs">
              Description:
              <span class="text-dark ms-sm-2 font-weight-bold"
                >How can the Max-Flow Min-Cut Theorem be applied to solve
                real-world problems?</span
              >
            </span>
          </div>
          <div class="ms-auto text-end d-flex">
            <br />
            <a class="btn btn-link text-dark px-3 mb-0" href="javascript:;">
              <i class="fa fa-eye text-dark me-2" aria-hidden="true"></i>
            </a>
          </div>
        </li>
        <li
          class="list-group-item border-0 d-flex p-4 mb-2 mt-3 bg-gray-100 border-radius-lg"
        >
          <div class="d-flex flex-column">
            <h6 class="mb-3 text-sm">Ethan James</h6>
            <span class="mb-2 text-xs">
              Type:
              <span class="text-dark font-weight-bold ms-sm-2">Debug</span>
            </span>
            <span class="mb-2 text-xs">
              Description:
              <span class="text-dark ms-sm-2 font-weight-bold"
                >When implementing a depth-first search (DFS) algorithm, the
                graph is disconnected, and the algorithm won't visit all
                nodes</span
              >
            </span>
          </div>
          <div class="ms-auto text-end d-flex">
            <a class="btn btn-link text-dark px-3 mb-0" href="javascript:;">
              <i class="fa fa-eye text-dark me-2" aria-hidden="true"></i>
            </a>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<style>
.queue-a {
  background-color: #28a745;
} /* Green */
.queue-b {
  background-color: #17a2b8;
} /* Teal */
.queue-c {
  background-color: #ffc107;
} /* Yellow */
.queue-d {
  background-color: #dc3545;
} /* Red */
</style>

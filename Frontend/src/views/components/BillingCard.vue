<template>
  <div class="card">
    <div class="card-header pb-0 px-3">
      <h6 class="mb-0">Questions Information</h6>
    </div>

    <!-- Search Bar -->
    <div class="d-flex p-3 mb-2">
      <span class="input-group-text text-body">
        <i class="fas fa-search" aria-hidden="true"></i>
      </span>
      <input type="text" class="form-control " :placeholder="'Type here...'" />
    </div>
    <!-- Search Bar End-->
    <div class="card-body pt-4 p-3">

      <ul class="list-group">
        <!-- List Card -->
        <li class="list-group-item border-0 d-flex p-4 mb-2 bg-gray-100 border-radius-lg">
          <div class="d-flex flex-column">
            <h6 class="mb-3 text-sm">Oliver Liam</h6>
            <span class="mb-2 text-xs">
              Type:
              <span class="text-dark font-weight-bold ms-sm-2">Theory</span>
            </span>
            <span class="mb-2 text-xs">
              Description:
              <span class="text-dark ms-sm-2 font-weight-bold">Why is the vertex cover problem classified as
                NP-hard?</span>
            </span>
            <span class="mb-2 text-xs">
              Question Time:
              <span class="text-dark font-weight-bold ms-sm-2">3 min. ago</span>
            </span>
          </div>
          <div class="ms-auto text-end d-flex">
            <a class="btn btn-link text-danger text-gradient px-3 mb-0" href="javascript:;">
              <i class="far fa-trash-alt me-2" aria-hidden="true"></i>
            </a>
            <a class="btn btn-link text-dark px-3 mb-0" href="javascript:;">
              <i class="fa fa-comment" aria-hidden="true"></i>
            </a>
          </div>
        </li>
        <!--End of List Card -->

        <li class="list-group-item border-0 d-flex p-4 mb-2 mt-3 bg-gray-100 border-radius-lg">
          <div class="d-flex flex-column">
            <h6 class="mb-3 text-sm">Lucas Harper</h6>
            <span class="mb-2 text-xs">
              Type:
              <span class="text-dark font-weight-bold ms-sm-2">Theory</span>
            </span>
            <span class="mb-2 text-xs">
              Description:
              <span class="text-dark ms-sm-2 font-weight-bold">How can the Max-Flow Min-Cut Theorem be applied to solve
                real-world problems?</span>
            </span>
            <span class="mb-2 text-xs">
              Question Time:
              <span class="text-dark font-weight-bold ms-sm-2">20 min. ago</span>
            </span>
          </div>
          <div class="ms-auto text-end d-flex">
            <a class="btn btn-link text-danger text-gradient px-3 mb-0" href="javascript:;">
              <i class="far fa-trash-alt me-2" aria-hidden="true"></i>
            </a>
            <br/>
            <a class="btn btn-link text-dark px-3 mb-0" href="javascript:;">
              <i class="fa fa-comment" aria-hidden="true"></i>
            </a>
          </div>
        </li>
        <li class="list-group-item border-0 d-flex p-4 mb-2 mt-3 bg-gray-100 border-radius-lg">
          <div class="d-flex flex-column">
            <h6 class="mb-3 text-sm">Ethan James</h6>
            <span class="mb-2 text-xs">
              Type:
              <span class="text-dark font-weight-bold ms-sm-2">Debug</span>
            </span>
            <span class="mb-2 text-xs">
              Description:
              <span class="text-dark ms-sm-2 font-weight-bold ">When implementing a depth-first search (DFS) algorithm,
                the graph is disconnected, and the algorithm won't visit all nodes</span>
            </span>
            <span class="mb-2 text-xs">
              Question Time:
              <span class="text-dark font-weight-bold ms-sm-2">1 hr. ago</span>
            </span>
           <a href="#"> <span class="text-primary font-weight-bold ms-sm-2">View</span> </a>
          </div>
          <div class="ms-auto text-end d-flex">
            <a class="btn btn-link text-danger text-gradient px-3 mb-0" href="javascript:;">
              <i class="far fa-trash-alt me-2" aria-hidden="true"></i>
            </a>
            <a class="btn btn-link text-dark px-3 mb-0" href="javascript:;">
              <i class="fa fa-comment" aria-hidden="true"></i>
            </a>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

.input-group {
  margin-left: 16px;
  width: auto;
}
</style>

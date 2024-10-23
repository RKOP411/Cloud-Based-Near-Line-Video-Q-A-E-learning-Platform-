<script setup>
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import GradientLineChart from "@/examples/Charts/GradientLineChart.vue";
import CategoriesList from "../components/CategoriesList.vue";

import US from "@/assets/img/icons/flags/US.png";
import DE from "@/assets/img/icons/flags/DE.png";
import GB from "@/assets/img/icons/flags/GB.png";
import BR from "@/assets/img/icons/flags/BR.png";



const sales = {
  us: {
    country: "Mia Thompson",
    sales: 8,
    value: "130.00",
    bounce: "93.9%",
    flag: US,
  },
  germany: {
    country: "Ethan Johnson",
    sales: 5,
    value: "48.00",
    bounce: "81.22%",
    flag: DE,
  },
  britain: {
    country: "Ava Patel",
    sales: 4,
    value: "90.70",
    bounce: "83.44%",
    flag: GB,
  },
  brasil: {
    country: "Noah Williams",
    sales: 3,
    value: "43.60",
    bounce: "72.14%",
    flag: BR,
  },
};
</script>
<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="row">
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card title="Today's Questions" value="6" description="<span
                class='text-sm font-weight-bolder text-success'
                >+67%</span> than last course" :icon="{
                  component: 'fa fa-question',
                  background: 'bg-gradient-primary',
                  shape: 'rounded-circle',
                }" />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card title="User Engagement" value="35%" description="<span
                class='text-sm font-weight-bolder text-success'
                >+3%</span> since last course" :icon="{
                  component: 'fa fa-users',
                  background: 'bg-gradient-danger',
                  shape: 'rounded-circle',
                }" />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card title="Most Topic" value="vertex-cover" description="Today's Topic: '<span
                class='text-sm font-weight-bolder text-success'
                >graph theory</span>'" :icon="{
                  component: 'ni ni-paper-diploma',
                  background: 'bg-gradient-success',
                  shape: 'rounded-circle',
                }" />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card title="Common Type" value="Theory" description="Highest Type Inquiry Rates" :icon="{
              component: 'ni ni-tag',
              background: 'bg-gradient-warning',
              shape: 'rounded-circle',
            }" />
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12 mb-lg">
            <!-- line chart -->
            <div class="card z-index-2">
              <gradient-line-chart id="chart-line" title="Question Times" :chart="{
                labels: [
                  'Week 1',
                  'Week 2',
                  'Week 3',
                  'Week 4',
                  'Week 5',
                  'Week 6',
                  'Week 7',
                  'Week 8',
                  'Week 9',
                ],
                datasets: [
                  {
                    label: 'Question Times',
                    data: [5, 4, 30, 22, 50, 25, 40, 23, 50],
                  },
                ],
              }" />
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-7 mb-lg-0 mb-4">
            <div class="card">
              <div class="p-3 pb-0 card-header">
                <div class="d-flex justify-content-between">
                  <h6 class="mb-2">Participation Levels</h6>
                </div>
              </div>
              <div class="table-responsive">
                <table class="table align-items-center">
                  <tbody>
                    <tr v-for="(sale, index) in sales" :key="index">
                      <td class="w-30">
                        <div class="px-2 py-1 d-flex align-items-center">
                          <i class="fa fa-user-circle" aria-hidden="true"></i>
                          <div class="ms-4">
                            <p class="mb-0 text-xs font-weight-bold">
                              Student:
                            </p>
                            <h6 class="mb-0 text-sm">{{ sale.country }}</h6>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="text-center">
                          <p class="mb-0 text-xs font-weight-bold">Question:</p>
                          <h6 class="mb-0 text-sm">{{ sale.sales }}</h6>
                        </div>
                      </td>
                      <td>
                        <div class="text-center">
                          <p class="mb-0 text-xs font-weight-bold">Active Hours:</p>
                          <h6 class="mb-0 text-sm">{{ sale.value }}</h6>
                        </div>
                      </td>
                      <td class="text-sm align-middle">
                        <div class="text-center col">
                          <p class="mb-0 text-xs font-weight-bold">Engagement:</p>
                          <h6 class="mb-0 text-sm">{{ sale.bounce }}</h6>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="col-lg-5">
            <categories-list :categories="[
              {
                icon: {
                  component: 'fa fa-bug',
                  background: 'dark',
                },
                label: 'Debug',
                description: 'Total: <strong>25</strong>',
              },
              {
                icon: {
                  component: 'fa fa-flask',
                  background: 'dark',
                },
                label: 'Lab Work',
                description: 'Total: <strong>12</strong>',
              },
              {
                icon: {
                  component: 'fa fa-exclamation-triangle',
                  background: 'dark'
                },
                label: 'Error',
                description: 'Total: <strong>1</strong>',
              },
              {
                icon: {
                  component: 'fa fa-book',
                  background: 'dark'
                },
                label: 'Theory',
                description: 'Total: <strong>43</strong>',
              },
            ]" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

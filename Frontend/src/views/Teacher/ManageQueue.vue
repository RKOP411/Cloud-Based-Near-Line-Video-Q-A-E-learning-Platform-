<template>
    <div class="card">
        <div class="card-header pb-0">
            <h6>Your Queue</h6>
        </div>
        <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
                <table class="table align-items-center mb-0">
                    <thead>
                        <tr>
                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                                Queue Id
                            </th>
                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                                Queue
                            </th>
                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                                Status
                            </th>
                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                                Time Out
                            </th>
                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                                Member
                            </th>
                            <th class="text-secondary opacity-7"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="hover-row">
                            <td style="padding-left: 25px;">19</td>
                            <td style="padding-left: 25px;">c5a240</td>
                            <td><span class="badge bg-success">RUNNING</span></td>
                            <td style="padding-left: 25px;">240 min</td>
                            <td style="padding-left: 25px;">5</td>
                            <td>
                                <button class="btn btn-info btn-sm" style="margin-right: 6px;">Info</button>
                                <button class="btn btn-danger btn-sm" style="margin-right: 6px;">Stop</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <br/>
</template>

<style scoped>
.badge {
    padding: 0.5em 0.75em;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    color: #fff;
}
.icon {
    align-items: center;
    justify-content: center;
    display: flex;
    padding-top: 8px;
}
.hover-row:hover {
    background-color: #f8f9fe;
}
</style>
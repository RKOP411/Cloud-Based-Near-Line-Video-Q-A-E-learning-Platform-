import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Teacher/Dashboard.vue";
import Tables from "../views/Tables.vue";
import VirtualReality from "../views/VirtualReality.vue";
import RTL from "../views/Rtl.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";
import Question_List_Stu from "../views/Student/Question_List_Stu.vue";
import ForgetPassword from "../views/ForgetPassword.vue";
import UserList from "../views/Admin/UserList.vue";
import MediaList from "../views/Admin/MediaList.vue";
import Manage_Queue from "../views/Teacher/ManageQueue.vue";
import CreateChat from "../views/CreateChatCroup.vue";
import UploadQuestion from "../views/Student/Upload_Question.vue";
import JoinChat from "../views/JoinChat.vue";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/dashboard-default",
  },
  {
    path: "/dashboard-default",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/tables",
    name: "Chat Room",
    component: Tables,
  },
  {
    path: "/virtual-reality",
    name: "Virtual Reality",
    component: VirtualReality,
  },
  {
    path: "/rtl-page",
    name: "RTL",
    component: RTL,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/questionlist",
    name: "Question List",
    component: Question_List_Stu,
  }
  ,
  {
    path: "/forgetpassword",
    name: "Forget Password",
    component: ForgetPassword,
  },
  {
    path: "/userList",
    name: "UserList",
    component: UserList,
  },
  {
    path: "/mediaList",
    name: "MediaList",
    component: MediaList,
  },
  {
    path: "/managequeue",
    name: "Manage Queue",
    component: Manage_Queue,
  },
  {
    path: "/createchat",
    name: "Create Chat",
    component: CreateChat,
  },
  {
    path: "/uploadquestion",
    name: "Upload Question",
    component: UploadQuestion,
  },
  {
    path: "/joinchat",
    name: "Join Chat Group",
    component: JoinChat,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;

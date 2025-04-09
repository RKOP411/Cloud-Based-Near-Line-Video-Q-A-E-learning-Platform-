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
import UploadQuestion from "../views/Student/Upload_Question.vue";
import JoinQuestion from "../views/JoinQuestion.vue";
import Forum from "../views/Forum.vue";
import ForumContent from "../views/ForumContent.vue";
import CreateForum from "../views/CreateForum.vue";
import CreateCoure from "../views/CreateCourse.vue";
import CreateQuestion from "../views/Student/CreateQuestion.vue";
import ViewAnswer from "../views/Student/ViewAnswer.vue";
import JoinQueue from "../views/Student/JoinQueue.vue";
import CreateQueue from "../views/Teacher/CreateQueue.vue";
import AskForRank from "../views/Teacher/AskForRank.vue";
import AnswerQuestion from "../views/Teacher/AnswerQuestion.vue";
import CourseManage from "../views/Teacher/CourseManage.vue";
import Stu_Dashboard from "../views/Student/Stu_Dashboard.vue";
import GetAllRecordDashboard from "../views/components/GetAllRecordDashboard.vue";
import QuestionTimesDashboard from "../views/components/QuestionTimesDashboard.vue";
import ShowKeyWord_DashBoard from "../views/components/ShowKeyWord_DashBoard.vue";


const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/profile",
  },
  {
    path: "/dashboard-default",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/tables",
    name: "Coruse Tables",
    component: Tables,
  },
  {
    path: "/forgetpsw",
    name: "Forget Password",
    component: ForgetPassword,
  },
  {
    path: "/tables/forum",
    name: "Forum",
    component: Forum,
  },

  {
    path: "/tables/forum/forumcontent",
    name: "Forum Content",
    component: ForumContent,
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
    name: "Queue",
    component: Question_List_Stu,
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
    path: "/managequeue/answerquestion",
    name: "Answer Question",
    component: AnswerQuestion,
  },
  {
    path: "/uploadquestion",
    name: "Upload Question",
    component: UploadQuestion,
  },
  {
    path: "/JoinQuestion",
    name: "Join Chat Group",
    component: JoinQuestion,
  },
  {
    path: "/tables/forum/createforum",
    name: "Create Forum",
    component: CreateForum,
  },
  {
    path: "/createcourse",
    name: "Create Course",
    component: CreateCoure,
  },
  {
    path: "/coursemanage",
    name: "Course Manage",
    component: CourseManage,
  },
  {
    path: "/questionlist/createquestion",
    name: "Create Question",
    component: CreateQuestion,
  },
  {
    path: "/viewanswer",
    name: "View Answer",
    component: ViewAnswer,
  },
  {
    path: "/joinqueue",
    name: "Join Queue",
    component: JoinQueue,
  },
  {
    path: "/createqueue",
    name: "Create Queue",
    component: CreateQueue,
  },
  {
    path: "/askforrank",
    name: "Ask For Rank",
    component: AskForRank,
  },
  {
    path: "/stu_dashboard",
    name: "Student Dashboard",
    component: Stu_Dashboard,
  },
  {
    path: "/dashboard-default/getallrecorddashboard",
    name: "Engagement Record Dashboard",
    component: GetAllRecordDashboard,
  },
  {
    path: "/dashboard-default/questiontimesdashboard",
    name: "Question Metrics",
    component: QuestionTimesDashboard,
  },
  {
    path: "/dashboard-default/showkeyword_dashboard",
    name: "Show KeyWord",
    component: ShowKeyWord_DashBoard,
  }

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;

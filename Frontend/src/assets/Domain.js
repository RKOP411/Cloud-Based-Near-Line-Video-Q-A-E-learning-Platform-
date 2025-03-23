const DomainName = "http://localhost:3000/";


//Account
const registerDomain = DomainName + "account/register";
const verifyEmailDomain = DomainName + "account/verifyEmail";
const UpdateRankByUserID = DomainName + "account/UpdateRankByUserID/";

//Forum
const GetAllForum = DomainName + "forum/GetAllforum";
const GetForumContentByID = DomainName + "forum/GetforumByID/";
const GetCommentByForumID = DomainName + "forum/GetCommentByForumID/";
const AddComment = DomainName + "forum/AddComment/";
const ForumLikes = DomainName + "forum/ForumLikes/";
const AddLike = DomainName + "forum/AddLike/";
const CheckUserLiked = DomainName + "forum/CheckUserLiked/";
const DeleteLike = DomainName + "forum/DeleteLike/";
const AddCommentLike = DomainName + "forum/AddCommentLike/";
const AddCommentLike_Num = DomainName + "forum/updateLike/";
const CheckUserLikedComment = DomainName + "forum/CheckUserLikedComment/";
const DeleteCommentLike = DomainName + "forum/DeleteCommentLike/";
const DeleteCommentLike_Num = DomainName + "forum/updateLike_delete/";
const GetAllCourses = DomainName + "forum/GetAllCourses";
const GetCoursesByUserID = DomainName + "forum/GetCoursesByUserID/";
const GetForumByCourseID = DomainName + "forum/GetForumByCourseID/";
const CreateForum = DomainName + "forum/CreateForum";
const CourseNumQuesstion = DomainName + "forum/CourseNumQuesstion/";
const CreateCourse = DomainName + "forum/CreateCourse";
const CreateForumWithVideo = DomainName + "forum/CreateForumWithVideo";
//User
const GetUserByEmail = DomainName + "users/GetUserByEmail/";

//Question
const GetAllQuestion = DomainName + "qa/GetAllQuestion/";
const CreateQuestion = DomainName + "qa/CreateQuestion";
const CreateQuestionWithVideo = DomainName + "qa/CreateQuestionWithVideo";
const AddAnswerByQuestionID = DomainName + "qa/AddAnswerByQuestionID";
const GetQuestionByUserID = DomainName + "qa/GetQuestionByUserID/";
const GetAnswerByQAID = DomainName + "qa/GetAnswerByQAID/";
const GetAllQuestionByQueueListID = DomainName + "qa/GetAllQuestionByQueueListID";
const GetAllQuestionWithType = DomainName + "qa/GetAllQuestionWithType";

//Queue
const AddQueue = DomainName + "queue/AddQueue";
const AddCustomrQueue = DomainName + "queue/AddCustomrQueue";
const GetQueue = DomainName + "queue/GetQueue";
const CreateQueue_list = DomainName + "queue/CreateQueue_list";
const GetQueue_listByCreatorID = DomainName + "queue/GetQueue_listByCreatorID";
const FindQueueByAccessCode = DomainName + "queue/FindQueueByAccessCode";
const getAvgTakeTimeByUserID = DomainName + "queue/getAvgTakeTimeByUserID";
const JoinQueue = DomainName + "queue/JoinQueue";
const QuitQueue = DomainName + "queue/QuitQueue";
const getCurrentJoins = DomainName + "queue/getCurrentJoins";
const PauseQueue = DomainName + "queue/PauseQueue";
const CloseQueue = DomainName + "queue/CloseQueue";
const RunQueue = DomainName + "queue/RunQueue"; 
const GetQueueStatus = DomainName + "queue/GetQueueStatus";
const GetQueueTimeryCreatorID = DomainName + "queue/GetQueueTimeryCreatorID";
const getTotalTakeTime = DomainName + "queue/getTotalTakeTime";
const GetQueueByType = DomainName + "queue/GetQueueByType";

//Dashboard
const GetCourses = DomainName + "dashboard/GetCourses";
const GetTop5Asking = DomainName + "dashboard/GetTop5Asking";
const GetEngagement = DomainName + "dashboard/GetEngagement";
const GetCategoryCount = DomainName + "dashboard/GetCategoryCount";
const getAnswer_QA_AvgTime = DomainName + "dashboard/getAnswer_QA_AvgTime";
const GetNumAns = DomainName + "dashboard/GetNumAns";
const GetQuestionTimes = DomainName + "dashboard/GetQuestionTimes";
//Dashboard Extand
const GetAllAsking = DomainName + "dashboard/GetAllAsking";

//Student Dashboard
const GetDashboradQuestions = DomainName + "dashboard/stu/GetDashboradQuestions";
const AnswerGetTotal = DomainName + "dashboard/stu/AnswerGetTotal";
const AvgWaitingTime = DomainName + "dashboard/stu/AvgWaitingTime";
const MostTypeAsked = DomainName + "dashboard/stu/MostTypeAsked";
const GetQuestionPerTime = DomainName + "dashboard/stu/GetQuestionPerTime";

//HeartBeat
const SendStatus = DomainName + "status";
const GetStatus = DomainName + "GetStatus";



export {
    DomainName,
    registerDomain, verifyEmailDomain, UpdateRankByUserID,
    GetAllForum, GetForumContentByID, GetCommentByForumID, AddComment,
    GetAllCourses, GetCoursesByUserID, GetForumByCourseID, CreateForum, CourseNumQuesstion, CreateCourse, CreateForumWithVideo,
    ForumLikes, AddLike, CheckUserLiked, DeleteLike,
    AddCommentLike, AddCommentLike_Num, CheckUserLikedComment, DeleteCommentLike, DeleteCommentLike_Num,
    GetUserByEmail, GetAllQuestion, GetAllQuestionByQueueListID,
    CreateQuestion, CreateQuestionWithVideo, AddAnswerByQuestionID, GetQuestionByUserID, GetAnswerByQAID, GetAllQuestionWithType,
    AddQueue, AddCustomrQueue, GetQueue, CreateQueue_list, GetQueue_listByCreatorID, FindQueueByAccessCode, getAvgTakeTimeByUserID,
    SendStatus, GetStatus,
    JoinQueue, QuitQueue, getCurrentJoins,
    PauseQueue, CloseQueue, RunQueue, GetQueueStatus, GetQueueTimeryCreatorID,getTotalTakeTime,
    GetQueueByType,
    GetCourses,GetTop5Asking, GetEngagement,GetCategoryCount,getAnswer_QA_AvgTime,GetNumAns,GetQuestionTimes,
    GetDashboradQuestions,AnswerGetTotal, AvgWaitingTime, MostTypeAsked, GetQuestionPerTime,
    GetAllAsking,
};
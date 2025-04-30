import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import Tutor from "../Pages/Tutor/Tutor";
import Student from "../Pages/Student/Student";
import Quizzes from "../Pages/Quizzes/Quizzes";
import Content from "../Pages/Contents/Content";
import SingleContent from "../Pages/SingleContent/SingleContent";
import Doubts from "../Pages/Doubts/Doubts";
import SingleDoubt from "../Pages/SingleDoubt/SingleDoubt";
import TaskReport from "../Pages/TaskReport/TaskReport";
import Calendar from "../Pages/Calendar/Calendar";
import MyTask from "../Pages/MyTask/MyTask";
import Query  from "../Pages/Query/Query";
import Announcement  from "../Pages/Announcement/Announcement";
import Achievements  from "../Pages/Achievements/Achievements";
import Forum  from "../Pages/Forum/Forum";
import Marks  from "../Pages/Marks/Marks";
import TaskProgress  from "../Pages/TaskProgress/TaskProgress";
// import Achievements  from "../Pages/Achievements/Achievements";





import Dashboard from "../Pages/Admin/Home/AdminDashboard";
import UserDetails  from "../Pages/Admin/Home/Admin_table/UserDetails/UserDetails";
import User from "../Pages/Admin/User/User";
import UserMarks  from "../Pages/Admin/Marks/UserMarks";
import EventPage  from "../Pages/Admin/Events/EventPage";
import AdminTask  from "../Pages/Admin/Task/AdminTask";
import AllTests  from "../Pages/Admin/tests/AllTests";
import AdminForum  from "../Pages/Admin/Forum/AdminForum";
import AdminQuery  from "../Pages/Admin/Query/AdminQuery";
import AdminCalendar  from "../Pages/Admin/Calendar/AdminCalendar";
import AdminAnnouncement  from "../Pages/Admin/Announcement/AdminAnnouncement";
import AdminAchievements from "../Pages/Admin/Achievements/AdminAchievements";
import AdminTaskProgress from "../Pages/Admin/TaskProgress/AdminTaskProgress";








const Router = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/tutor" element={<Tutor />} />
        <Route path="/student" element={<Student />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/taskReport" element={<TaskReport />} />
        <Route path="/myTask" element={<MyTask />} />
        <Route path="/query" element={<Query />} />
        <Route path="/announcement" element={<Announcement />} />
        <Route path="/marks" element={<Marks />} />
        <Route path="/taskProgress" element={<TaskProgress />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/content/:id" element={<SingleContent />} />
        <Route path="/contents" element={<Content />} />
        <Route path="/doubts" element={<Doubts />} />
        <Route path="/doubt/:id" element={<SingleDoubt />} />
        <Route path="*" element={<Home />} />

        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/userDetails" element={<UserDetails />} />
        <Route path="/admin/adminTask" element={<AdminTask/>} />

        <Route path="/admin/adminForum" element={<AdminForum/>} />
        <Route path="/admin/adminQuery" element={<AdminQuery/>} />
        <Route path="/admin/adminCalendar" element={<AdminCalendar/>} />
        <Route path="/admin/adminAnnouncement" element={<AdminAnnouncement/>} />
        <Route path="/admin/adminAchievements" element={<AdminAchievements/>} />
        <Route path="/admin/adminTaskProgress" element={<AdminTaskProgress/>} />


        <Route path="/userList" element={<User />} />
        <Route path="/usermarks" element={<UserMarks />} />

        <Route path="/eventsList" element={<EventPage />} />
        <Route path="/testsList" element={<AllTests />} />



      </Routes>
    </div>
  );
};

export default Router;

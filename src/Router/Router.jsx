import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import Admin from "../Pages/Admin/Admin";
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
import Achievement  from "../Pages/Achievement/Achievement";
import Forum  from "../Pages/Forum/Forum";
import Marks  from "../Pages/Marks/Marks";
import TaskProgress  from "../Pages/TaskProgress/TaskProgress";



const Router = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
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
        <Route path="/achievement" element={<Achievement />} />
        <Route path="/forum" element={<Forum />} />




        <Route path="/content/:id" element={<SingleContent />} />
        <Route path="/contents" element={<Content />} />
        <Route path="/doubts" element={<Doubts />} />
        <Route path="/doubt/:id" element={<SingleDoubt />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
};

export default Router;

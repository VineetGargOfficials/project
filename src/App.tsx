import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CollegeProgramForm from "./FormPages/Form1";
import CollegeProgramForm2 from "./FormPages/Form2";
import CollegeProgramForm3 from "./FormPages/Form3";
import CollegeProgramForm4 from "./FormPages/Form4";
import CollegeProgramForm5 from "./FormPages/Form5";
import CollegeProgramForm6 from "./FormPages/Form6";
import CollegeProgramForm7 from "./FormPages/Form7";
import CollegeProgramForm8 from "./FormPages/Form8";
import CollegeProgramForm9 from "./FormPages/Form9";
import CollegeProgramForm10 from "./FormPages/Form10";
import CollegeProgramForm11 from "./FormPages/Form11";
import CollegeProgramForm12 from "./FormPages/Form12";
import CollegeProgramForm13 from "./FormPages/Form13";
import CollegeProgramForm14 from "./FormPages/Form14";
import CollegeProgramForm15 from "./FormPages/Form15";
import CollegeProgramForm16 from "./FormPages/Form16";
import CollegeProgramForm17 from "./FormPages/Form17";
import CollegeProgramForm18 from "./FormPages/Form18";
import CollegeProgramForm19 from "./FormPages/Form19";
import CollegeProgramForm20 from "./FormPages/Form20";
import CollegeProgramForm21 from "./FormPages/Form21";
import Login from "./components/auth/Login";
import { AuthProvider } from "./contexts/AuthContext";
import Register from "./components/auth/Register";
import VerifyOtp from "./components/auth/VerifyOtp";
import {UniversityForm} from "./components/UniversityForm";
import {FacultyForm} from "./components/FacultyForm";
import {DeptForm} from "./components/DeptForm";
import {ProgramForm} from "./components/ProgramForm";

// import Profile from "./components/Profile";




const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
       <AuthProvider>
      <Toaster />
      <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/form/page1" element={<CollegeProgramForm />} />
          <Route path="/form/page2" element={<CollegeProgramForm2 />} />
          <Route path="/form/page3" element={<CollegeProgramForm3 />} />
          <Route path="/form/page4" element={<CollegeProgramForm4 />} />
          <Route path="/form/page5" element={<CollegeProgramForm5 />} />
          <Route path="/form/page6" element={<CollegeProgramForm6 />} />
          <Route path="/form/page7" element={<CollegeProgramForm7 />} />
          <Route path="/form/page8" element={<CollegeProgramForm8 />} />
          <Route path="/form/page9" element={<CollegeProgramForm9 />} />
          <Route path="/form/page10" element={<CollegeProgramForm10 />} />
          <Route path="/form/page11" element={<CollegeProgramForm11 />} />
          <Route path="/form/page12" element={<CollegeProgramForm12 />} />
          <Route path="/form/page13" element={<CollegeProgramForm13 />} />
          <Route path="/form/page14" element={<CollegeProgramForm14 />} />
          <Route path="/form/page15" element={<CollegeProgramForm15 />} />
          <Route path="/form/page16" element={<CollegeProgramForm16 />} />
          <Route path="/form/page17" element={<CollegeProgramForm17 />} />
          <Route path="/form/page18" element={<CollegeProgramForm18 />} />
          <Route path="/form/page19" element={<CollegeProgramForm19 />} />
          <Route path="/form/page20" element={<CollegeProgramForm20 />} />
          <Route path="/form/page21" element={<CollegeProgramForm21 />} />

          <Route path = "/login" element = {<Login />} />
          <Route path = "/register" element = {<Register />} />
          <Route path = '/verify-otp' element = {<VerifyOtp />} />
          <Route path = '/university-form' element = {<UniversityForm />} />
          <Route path = '/faculty-form' element = {<FacultyForm />} />
          <Route path = '/department-form' element = {<DeptForm />} />
          <Route path = '/program-form' element = {<ProgramForm />} />

          
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

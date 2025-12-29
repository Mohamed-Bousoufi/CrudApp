import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserList from './pages/UserList';
import UserDetails from './pages/UserDetails';
import NotFound from './pages/NotFound';
import ProtectedRoute from "@/components/ProtectedRoute";
import {LoginForm} from "./components/login-form.jsx";

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <div className="flex items-center justify-center min-h-screen">
                <LoginForm />
              </div>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id"
            element={
              <ProtectedRoute>
                <UserDetails />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default App;

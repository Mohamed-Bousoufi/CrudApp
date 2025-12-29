import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserList from './pages/UserList';
import UserDetails from './pages/UserDetails';
import NotFound from './pages/NotFound';
import ProtectedRoute from "@/components/ProtectedRoute";
import { LoginForm } from "./components/login-form.jsx";
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./components/ui/button";

function TopBar() {
  const { logout, user } = useAuth();

  return (
    <div className="fixed top-1 right-4 z-50 mb-20">
      {user && (
        <Button
          onClick={logout}
          variant="destructive"
          className="px-2 py-2 rounded bg-grey-600 text-red-700 hover:bg-red-700 hover:text-white transition"
        >
          Logout
        </Button>
      )}
    </div>
  );
}

function AppLayout({ children }) {
  return (
    <>
      <TopBar />
      {children}
    </>
  );
}

function App() {
  return (
    <AppLayout>
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
    </AppLayout>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import PostListPage from '../pages/PostListPage';
import PostReadPage from '../pages/PostReadPage';
import LoginPage from '../pages/LoginPage';
import PostCreatePage from '../pages/PostCreatePage';
import PostEditPage from '../pages/PostEditPage';
import AdminPage from '../pages/AdminPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<PostListPage />} />
          <Route path="/posts/:id" element={<PostReadPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/new" element={<PostCreatePage />} />
            <Route path="/admin/edit/:id" element={<PostEditPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
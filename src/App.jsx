import { Navigate, Outlet, useLocation } from "react-router-dom";
import Header from "./component/Header/Header";
import Footer from "./component/Footer";
import usePageTitle from "./component/hook/usePageTitle";
import { AuthProvider } from "./component/provider/AuthProvider";
import { PostProvider } from "./component/provider/PostProvider";

function App() {
  usePageTitle();
  const location = useLocation();

  if (location.pathname === "/") {
    return <Navigate to="/home" replace />;
  }

  return (
    <AuthProvider>
      <PostProvider>
        <Header />
        <main className="max-w-xl w-full mx-auto rounded-3xl overflow-hidden bg-[var(--surface-a)] max-custom:min-w-full max-custom:rounded-none">
          <div className="scroll overflow-auto h-full relative max-custom:pb-[80px]">
            <Outlet />
          </div>
        </main>
        <Footer />
      </PostProvider>
    </AuthProvider>
  );
}

export default App;

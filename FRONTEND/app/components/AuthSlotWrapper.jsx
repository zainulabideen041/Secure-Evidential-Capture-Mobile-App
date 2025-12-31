import { usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../../redux/authSlice";

const AuthSlotWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user } = useSelector(
    (state) => state.auth
  );

  const [hasMounted, setHasMounted] = useState(false);

  const publicRoutes = ["/login", "/signup", "/verifymail", "/auth"];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`/(auth)${route}`)
  );

  useEffect(() => {
    dispatch(checkAuth()).finally(() => {
      setHasMounted(true);
    });
  }, [dispatch]);

  useEffect(() => {
    if (!hasMounted || isLoading) return;

    const isTabsRoute = pathname.startsWith("/tabs/");
    const isAdminRoute = pathname.startsWith("/admin/");

    if (!isAuthenticated) {
      if (isTabsRoute || isAdminRoute) {
        router.replace("/login");
      } else if (!isPublicRoute) {
        router.replace("/auth");
      }
    } else {
      if (user?.role === "admin") {
        if (!isAdminRoute) {
          router.replace("/admin/");
        }
      } else if (user?.role === "user") {
        if (!isTabsRoute) {
          router.replace("/tabs/");
        }
      }
    }
  }, [hasMounted, isLoading, pathname, isAuthenticated]);

  return children;
};

export default AuthSlotWrapper;

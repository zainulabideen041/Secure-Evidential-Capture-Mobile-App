import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./authSlice";
import UserSlice from "./userSlice";
import ScreenshotSlice from "./screenshotSlice";
import CaseSlice from "./caseSlice";

export const store = configureStore({
  reducer: {
    auth: AuthSlice,
    user: UserSlice,
    screenshot: ScreenshotSlice,
    case: CaseSlice,
  },
});

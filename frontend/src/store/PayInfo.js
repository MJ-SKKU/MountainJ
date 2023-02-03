// import { createSlice } from "@reduxjs/toolkit";

// const initialUserState = {

// };

// const userSlice = createSlice({
//   name: "user",
//   initialState: initialUserState,
//   reducers: {
//     login(state, action) {
//       state.userObj = action.payload.userObj;
//       state.token = action.payload.token;
//       state.isAuthenticated = true;
//       localStorage.setItem("userInfo", JSON.stringify(state.userObj));
//       localStorage.setItem("token", state.token);
//     },
//     logout(state) {
//       state.userObj = {};
//       state.isAuthenticated = false;
//       localStorage.removeItem("userInfo");
//       localStorage.removeItem("token");
//     },
//   },
// });

// export const userActions = userSlice.actions;

// export default userSlice.reducer;

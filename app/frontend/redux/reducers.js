import {
  SET_CATEGORY_TYPE,
  SET_LOGOUT,
  SET_USERNAME,
  SET_USER_ID,
  SET_ALL_CATEGORIES,
  SET_USER_PIC,
  SET_NEW_USER,
  SET_USER_LIKED_POST,
} from "./actions";

const initialState = {
  category: "All",
  username: "",
  user_id: null,
  allCategories: [],
  user_pic: null,
  new_user: false,
  userLikedPost: [],
  userLogOut: false,
};

//reducers are the functions to change the state
export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CATEGORY_TYPE:
      return { ...state, category: action.payload };
    case SET_USERNAME:
      return { ...state, username: action.payload };
    case SET_USER_ID:
      return { ...state, user_id: action.payload };
    case SET_ALL_CATEGORIES:
      return { ...state, allCategories: action.payload };
    case SET_USER_PIC:
      return { ...state, user_pic: action.payload };
    case SET_NEW_USER:
      return { ...state, new_user: action.payload };
    case SET_USER_LIKED_POST:
      return { ...state, userLikedPost: action.payload };
    case SET_LOGOUT:
      return { ...state, userLogOut: action.payload };

    default:
      return state;
  }
}

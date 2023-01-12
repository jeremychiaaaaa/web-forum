export const SET_CATEGORY_TYPE = "SET_CATEGORY_TYPE";
export const SET_USERNAME = "SET_USERNAME";
export const SET_USER_ID = "SET_USER_ID";
export const SET_ALL_CATEGORIES = "SET_ALL_CATEGORIES";
export const SET_USER_PIC = "SET_USER_PIC";
export const SET_NEW_USER = "SET_NEW_USER";
export const SET_USER_LIKED_POST = "SET_USER_LIKED_POST";
export const SET_USER_POSTS = "SET_USER_POSTS";
export const SET_LOGOUT = "SET_LOGOUT";
export const SET_UNLIKE_POST = "SET_UNLIKE_POST";
export const SET_USER_LIKED_COMMENT = "SET_USER_LIKED_COMMENT";
export const SET_UNLIKE_COMMENT = "SET_UNLIKE_COMMENT";
// action when user selects a specific category from the left panel of the home page

export const setCategory = (category) => (dispatch) => {
  dispatch({
    type: "SET_CATEGORY_TYPE",
    payload: category,
  });
};

// action to handle username of user when log in or for returning users

export const setUsername = (username) => (dispatch) => {
  dispatch({
    type: "SET_USERNAME",
    payload: username,
  });
};

// action to handle userId of user when log in or for returning users

export const setUserID = (user_id) => (dispatch) => {
  dispatch({
    type: "SET_USER_ID",
    payload: user_id,
  });
};

// action to handle all categories from database

export const setAllCategories = (allCategories) => (dispatch) => {
  dispatch({
    type: "SET_ALL_CATEGORIES",
    payload: allCategories,
  });
};

// action to handle userPic of user when log in or for returning users

export const setUserPic = (user_pic) => (dispatch) => {
  dispatch({
    type: "SET_USER_PIC",
    payload: user_pic,
  });
};

// action here is to aid the use navigate hook on login for new users. if new user, redirect to home page while for existing users redirect to the previously visited page in history

export const setNewUser = (new_user) => (dispatch) => {
  dispatch({
    type: "SET_NEW_USER",
    payload: new_user,
  });
};

// action to handle posts that users have already liked

export const setUserLikedPost = (userLikedPost) => (dispatch) => {
  dispatch({
    type: "SET_USER_LIKED_POST",
    payload: userLikedPost,
  });
};

// action to handle posts that was previously created by a user

export const setUserPost = (userPosts) => (dispatch) => {
  dispatch({
    type: "SET_USER_POSTS",
    payload: userPosts,
  });
};

// action to trigger refresh of page when user logs out

export const setLogOut = (userLogOut) => (dispatch) => {
  dispatch({
    type: "SET_LOGOUT",
    payload: userLogOut,
  });
};

// action to handle when user unlikes a post

export const setUnlikePost = (id) => (dispatch) => {
  dispatch({
    type: "SET_UNLIKE_POST",
    payload: id,
  });
};

// action to handle commnents that users have already liked

export const setUserLikedComments = (userLikedComment) => (dispatch) => {
  dispatch({
    type: "SET_USER_LIKED_COMMENT",
    payload: userLikedComment,
  });
};

// action to handle when user unlikes a comment

export const setUnlikeComment = (comment_id) => (dispatch) => {
  dispatch({
    type: "SET_UNLIKE_COMMENT",
    payload: comment_id,
  });
};

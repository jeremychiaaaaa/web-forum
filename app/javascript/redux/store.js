import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import userReducer from "./reducers";
import thunk from "redux-thunk";


//redux thunk helps to delay the dispatch of an action and will be used as our middleware
const rootReducer = combineReducers({userReducer})
export const Store = createStore(rootReducer, applyMiddleware(thunk))


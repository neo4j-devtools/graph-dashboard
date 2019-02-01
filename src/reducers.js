import { combineReducers } from "redux";
import neo4j from "./store/reducers";

const rootReducer = combineReducers({
    neo4j
});

export default rootReducer;

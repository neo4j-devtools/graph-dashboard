import * as Types from "./action.types";
import {
    IDENTIFIER_CONNECTION_STRING,
    IDENTIFIER_NEO4J_USERNAME,
    IDENTIFIER_NEO4J_PASSWORD,
    IDENTIFIER_PROJECT_NAME
} from "../views/Dashboard/Header/Settings";

export default function neo4j(state = getInitialState(), action) {
    switch (action.type) {
        case Types.SET_NEO4J_PROJECTS:
            return {
                ...state,
                projects: action.projects
            };
        case Types.SET_NEO4J_CURRENT_PROJECT:
            const { project } = action;
            if (project) {
                localStorage.setItem(IDENTIFIER_PROJECT_NAME, project.name);
            }
            return {
                ...state,
                project: action.project
            };
        case Types.SET_NEO4J_CURRENT_DB:
            if (action.graph) {
                const {
                    bolt
                } = action.graph.connection.configuration.protocols;
                if (bolt && bolt.enabled) {
                    localStorage.setItem(
                        IDENTIFIER_CONNECTION_STRING,
                        bolt.url
                    );
                    localStorage.setItem(
                        IDENTIFIER_NEO4J_USERNAME,
                        bolt.username
                    );
                    localStorage.setItem(
                        IDENTIFIER_NEO4J_PASSWORD,
                        bolt.password
                    );
                }
            }
            return {
                ...state,
                graph: action.graph
            };
        default:
            return state;
    }
}

function getInitialState() {
    return {
        projects: null,
        project: null,
        graph: null
    };
}

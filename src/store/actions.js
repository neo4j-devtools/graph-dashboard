import * as Types from "./action.types";

export function setNeo4jProjects(projects) {
    return { type: Types.SET_NEO4J_PROJECTS, projects };
}

export function setNeo4jCurrentProject(project) {
    return { type: Types.SET_NEO4J_CURRENT_PROJECT, project };
}

export function setNeo4jCurrentDB(graph) {
    return { type: Types.SET_NEO4J_CURRENT_DB, graph };
}

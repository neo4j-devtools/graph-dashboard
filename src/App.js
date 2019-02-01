import React, { Component } from "react";
import _ from "lodash";
import { HashRouter, Route, Switch } from "react-router-dom";
import "./App.css";
// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
    setNeo4jProjects,
    setNeo4jCurrentProject,
    setNeo4jCurrentDB
} from "./store/actions";
// Neo4j API
import { DesktopIntegration } from "graph-app-kit/components/DesktopIntegration";
// Styles
// CoreUI Icons Set
import "@coreui/icons/css/coreui-icons.min.css";
// Import Flag Icons Set
import "flag-icon-css/css/flag-icon.min.css";
// Import Font Awesome Icons Set
import "font-awesome/css/font-awesome.min.css";
// Import Simple Line Icons Set
import "simple-line-icons/css/simple-line-icons.css";
// Import Main styles for this application
import "./scss/style.css";

// Styles Components
import "react-table/react-table.css";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/lint/lint.css";
import "codemirror/addon/hint/show-hint.css";
import "cypher-codemirror/dist/cypher-codemirror-syntax.css";

//import SimpleBar from 'simplebar';
import "simplebar/dist/simplebar.css"; //TODO: is this really neccesary?

// Containers
import { DefaultLayout } from "./containers";

// import { renderRoutes } from 'react-router-config';

class App extends Component {
    constructor(props) {
        super(props);
        this.handleNeo4jContext = this.handleNeo4jContext.bind(this);
    }

    render() {
        return (
            <HashRouter>
                <div id="app">
                    <Switch>
                        <Route path="/" name="Home" component={DefaultLayout} />
                    </Switch>
                    <DesktopIntegration
                        integrationPoint={window.neo4jDesktopApi}
                        onMount={this.handleNeo4jContext}
                        on={(event, newContext) => {
                            this.handleNeo4jContext(newContext);
                        }}
                    />
                </div>
            </HashRouter>
        );
    }

    handleNeo4jContext(context) {
        let currentActiveGraph;
        this.props.setNeo4jProjects(context.projects);
        context.projects.forEach(project => {
            const activeGraph = _.find(project.graphs, { status: "ACTIVE" });
            if (activeGraph) {
                this.props.setNeo4jCurrentProject(project);
                this.props.setNeo4jCurrentDB(activeGraph);
                currentActiveGraph = activeGraph;
            }
        });

        if (!currentActiveGraph) {
            this.props.setNeo4jCurrentDB(null);
            this.props.setNeo4jCurrentProject(null);
        }
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        { setNeo4jProjects, setNeo4jCurrentProject, setNeo4jCurrentDB },
        dispatch
    );
}

export default connect(
    null,
    mapDispatchToProps
)(App);

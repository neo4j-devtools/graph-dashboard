import React from "react";
import { isEmpty } from "lodash";
import DashboardAbstract, {
    databaseCredentialsProvided,
    GenericException
} from "../AbstractDashboardComponent";
import { connect } from "react-redux";
import {
    Alert,
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Form,
    FormGroup,
    FormText,
    Input,
    Label,
    ListGroup,
    ListGroupItem,
    Popover,
    PopoverBody,
    PopoverHeader,
    Row
} from "reactstrap";

export const IDENTIFIER_PROJECT_NAME = "projectName";
export const IDENTIFIER_CONNECTION_STRING = "connectionString";
export const IDENTIFIER_NEO4J_USERNAME = "username";
export const IDENTIFIER_NEO4J_PASSWORD = "password";
const IDENTIFIER_LIMIT_COUNTING_HOTSPOTS = "limitCountingHotspots";

var AppDispatcher = require("../../../AppDispatcher");
var localStorageConnectionString = localStorage.getItem(
    IDENTIFIER_CONNECTION_STRING
);
var localStorageNeo4jUsername = localStorage.getItem(IDENTIFIER_NEO4J_USERNAME);
var localStorageNeo4jPassword = localStorage.getItem(IDENTIFIER_NEO4J_PASSWORD);
var localStorageProjectName = localStorage.getItem(IDENTIFIER_PROJECT_NAME);
var localStorageLimitCountingHotspots = localStorage.getItem(
    IDENTIFIER_LIMIT_COUNTING_HOTSPOTS
);

function handleDatabaseError(error) {
    console.log(error);
    localStorage.setItem("connectionString", ""); //reset connection string to prevent further access
    document.getElementById("database-settings-alert").innerHTML =
        "Connection failure: please check the provided data and if the server is running.";
    document.getElementById("database-settings-alert").className =
        "float-right settings-alert alert alert-danger fade show";
    document.getElementById("database-settings-alert").style.display = "block";
}

class Settings extends DashboardAbstract {
    constructor(props) {
        super(props);

        this.state = {
            popoverOpen: false,
            popovers: [
                {
                    placement: "bottom",
                    text: "Bottom"
                }
            ],
            projects: [],
            project: null
        };

        this.updateSettings = this.updateSettings.bind(this);
        this.resetSettings = this.resetSettings.bind(this);
        this.toggleInfo = this.toggleInfo.bind(this);
        this.handleProjectChange = this.handleProjectChange.bind(this);
    }

    componentWillMount() {
        this.handleAction = this.handleAction.bind(this);
        this.setState({
            dispatcherEventId: AppDispatcher.register(this.handleAction)
        });
    }

    componentDidMount() {
        //super.componentDidMount(); //do nothing, we don't need a database here
        const { project, projects } = this.props;
        if (projects) {
            this.setState({ projects });
        }
        if (project) {
            this.setState({ project });
        }
    }

    componentDidUpdate(prevProps) {
        const { project, projects } = this.props;
        if (prevProps.projects !== projects) {
            this.setState({ projects });
        }
        if (prevProps.project !== project) {
            if (project) {
                this.setState({ project });
            } else {
                this.setState({ project: null });
            }
        }
    }

    componentWillUnmount() {
        AppDispatcher.unregister(this.state.dispatcherEventId);
    }

    refreshConnectionSettingsWrapper() {
        //wrapper because it is not possible to access thisBackup.super.function...
        super.refreshConnectionSettings();
    }

    handleProjectChange(event) {
        if (event.target.value !== "default") {
            const { projects } = this.state;
            const project = projects.find(p => p.name === event.target.value);
            if (project) {
                this.setState({ project });
            }
        } else {
            this.setState({ project: null });
        }
    }

    updateSettings(event) {
        const identifierLimit = document.getElementById(
            IDENTIFIER_LIMIT_COUNTING_HOTSPOTS + "-input"
        );
        localStorage.setItem(
            IDENTIFIER_LIMIT_COUNTING_HOTSPOTS,
            identifierLimit.value
        );

        try {
            DashboardAbstract.checkForDatabaseConnection();

            if (!databaseCredentialsProvided) {
                throw new GenericException(
                    "Database connection parameter missing.",
                    "DatabaseConncetionException"
                );
            }

            super
                .testDatabaseCredentials()
                .then(function() {
                    // show success message
                    document.getElementById(
                        "database-settings-alert"
                    ).innerHTML = "Successfully saved settings.";
                    document.getElementById(
                        "database-settings-alert"
                    ).className =
                        "float-right settings-alert alert alert-success fade show";
                    document.getElementById(
                        "database-settings-alert"
                    ).style.display = "block";
                })
                .catch(handleDatabaseError); //check database connection
        } catch (e) {
            //handle missing credentials
            handleDatabaseError(e);
        }
    }

    resetSettings(event) {
        const identifierLimit = document.getElementById(
            IDENTIFIER_LIMIT_COUNTING_HOTSPOTS + "-input"
        );
        identifierLimit.value = "";
        localStorage.removeItem(IDENTIFIER_LIMIT_COUNTING_HOTSPOTS);
    }

    toggleInfo() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    render() {
        const { projects, project } = this.state;
        // redefine variables to fix default values when toggling different pages
        localStorageLimitCountingHotspots = localStorage.getItem(
            IDENTIFIER_LIMIT_COUNTING_HOTSPOTS
        );

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" md="6">
                        <Card>
                            <CardHeader>
                                Settings
                                <div className="card-actions">
                                    <button
                                        onClick={this.toggleInfo}
                                        id="Popover2"
                                    >
                                        <i className="text-muted fa fa-question-circle" />
                                    </button>
                                    <Popover
                                        placement="bottom"
                                        isOpen={this.state.popoverOpen}
                                        target="Popover2"
                                        toggle={this.toggleInfo}
                                    >
                                        <PopoverHeader>Settings</PopoverHeader>
                                        <PopoverBody>
                                            Browse available projects and graphs
                                            here. Activating a graph should be
                                            done through Neo4j Desktop.
                                        </PopoverBody>
                                    </Popover>
                                </div>
                            </CardHeader>
                            <CardBody className={"settings"}>
                                <Form
                                    action=""
                                    method="post"
                                    encType="multipart/form-data"
                                    className="form-horizontal"
                                >
                                    {projects && project && (
                                        <React.Fragment>
                                            <FormGroup row>
                                                <Col md="12">
                                                    <strong>
                                                        Browse Projects and
                                                        Graphs
                                                    </strong>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="3">
                                                    <Label
                                                        htmlFor={
                                                            IDENTIFIER_PROJECT_NAME +
                                                            "-input"
                                                        }
                                                    >
                                                        Project
                                                    </Label>
                                                </Col>
                                                <Col xs="12" md="9">
                                                    <select
                                                        id={
                                                            IDENTIFIER_PROJECT_NAME +
                                                            "-input"
                                                        }
                                                        name={
                                                            IDENTIFIER_PROJECT_NAME +
                                                            "-input"
                                                        }
                                                        className={
                                                            "setting form-control"
                                                        }
                                                        value={
                                                            project &&
                                                            projects.find(
                                                                p =>
                                                                    p.name ===
                                                                    project.name
                                                            ).name
                                                        }
                                                        onChange={
                                                            this
                                                                .handleProjectChange
                                                        }
                                                        required
                                                    >
                                                        {projects.map(p => (
                                                            <option
                                                                value={p.name}
                                                                key={p.id}
                                                            >
                                                                {p.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </Col>
                                            </FormGroup>
                                        </React.Fragment>
                                    )}
                                    {project && !isEmpty(project.graphs) && (
                                        <FormGroup row>
                                            <Col md="3">
                                                <Label>Graphs</Label>
                                            </Col>
                                            <Col xs="12" md="9">
                                                <ListGroup>
                                                    {project.graphs.map(g => (
                                                        <ListGroupItem
                                                            key={g.id}
                                                            style={{
                                                                color: "#5c6873"
                                                            }}
                                                        >
                                                            {g.name}{" "}
                                                            {g.status ===
                                                            "ACTIVE" ? (
                                                                <Badge pill>
                                                                    Active
                                                                </Badge>
                                                            ) : null}
                                                        </ListGroupItem>
                                                    ))}
                                                </ListGroup>
                                                <FormText color="muted">
                                                    Set the active graph by
                                                    going to your Project in
                                                    Neo4j Desktop and starting
                                                    your local database or
                                                    activating your remote
                                                    database.
                                                </FormText>
                                            </Col>
                                        </FormGroup>
                                    )}
                                    <hr />
                                    <FormGroup row>
                                        <Col md="12">
                                            <strong>Settings</strong>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label
                                                htmlFor={
                                                    IDENTIFIER_LIMIT_COUNTING_HOTSPOTS +
                                                    "-input"
                                                }
                                            >
                                                Commit hotspot threshold [%]
                                            </Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input
                                                type="text"
                                                id={
                                                    IDENTIFIER_LIMIT_COUNTING_HOTSPOTS +
                                                    "-input"
                                                }
                                                name={
                                                    IDENTIFIER_LIMIT_COUNTING_HOTSPOTS +
                                                    "-input"
                                                }
                                                className={"setting"}
                                                placeholder="Please provide percentage limit for counting hotspots..."
                                                defaultValue={
                                                    localStorageLimitCountingHotspots !==
                                                        null &&
                                                    localStorageLimitCountingHotspots !==
                                                        ""
                                                        ? localStorageLimitCountingHotspots
                                                        : "70"
                                                }
                                                required
                                            />
                                            <FormText color="muted">
                                                Lower limit of the percentage
                                                commit count of a resource from
                                                the maximum commit count to
                                                identify a resource as a
                                                hotspot. Default: "70"
                                            </FormText>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row className="button-row">
                                        <Col xs="12" md="12">
                                            <Button
                                                className="float-right"
                                                color="success"
                                                onClick={this.updateSettings}
                                                id="save"
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                className="float-right margin-right"
                                                color="danger"
                                                onClick={this.resetSettings}
                                                id="reset"
                                            >
                                                Reset
                                            </Button>
                                            <Alert
                                                id="database-settings-alert"
                                                className="float-right settings-alert"
                                                color="success"
                                            >
                                                Successfully saved settings.
                                            </Alert>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { ...state.neo4j };
};

export default connect(
    mapStateToProps,
    null
)(Settings);

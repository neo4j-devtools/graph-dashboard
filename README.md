# Neo4j Graph App Dashboard

A Graph App with configurable (drill-down) charts.

## Goals
Allow non-developers to browse through graph data and gain new insights by interacting with charts. Those charts are powered by databases queries parameters selected previously (from other charts, URL or form input). This would allow visual drill-down or navigation sideways through the data.

Existing baseline example ([screencast](https://www.dropbox.com/s/l5cy1h0saj6khp5/Screencast-Software-Visualization-Dashboard-18-06-04.mp4?dl=0))

## Use Cases

The first use-case would be a visual dashboard/browser for the community graph which contains users and their activities on GitHub, Twitter, StackOverflow, Meetup.

## UI-Elements

### Application

* left side nav-bar to navigate to different perspectives
* first perspective open by default vs. 
* welcome view that explains the application, guides to additional resources
* could also show domain model
* side-bar entry (i) with links to documentation etc.

### Perspective

* each perspective has a name, description
* each perspective can have a number of views arranged as tiles in order

### Views
* each view has a 
* title, 
* (optional) description (e.g. hidden behind an (i)), 
* input fields (for providing parameters to the query), 
* a current chart, 
* chart-selector (for selecting the alternative charts and data-table) 
* summary/status line (with number of rows, query runtime etc)
* views can be expanded to full-screen

### Charts

* charts are populated by running the query which can be triggered automatically after the required form fields are filled out or with a button? (what is a good UX?)
* charts can optionally support local operations (selecting a range, searching, sorting, rearranging)
* an interactive datatable (sort, paginate, search) should always be one alternative option to show the "raw" results
* charts are interactive, i.e. on click on certain items they send their parameter, and the selected item information to a target view
* routing should probably be handled by the application / perspective
* that allows drill-down or sideways navigation through the data
* chart types: pie, bar, line, spline, map, graph/network, chord, heat-map, sankey, ...


## Technology

* React
* A suitable charting library 
* Graph-App (able)
* Neo4j Driver

## Possible Charting Libraries

* http://www.reactd3.org/
* http://nivo.rocks
* https://medium.com/dailyjs/data-visualization-with-react-vis-bd2587fe1660 (Uber)
* https://formidable.com/open-source/victory/
* http://recharts.org/en-US/
* Timeseries + Crossfilter-like: https://software.es.net/react-timeseries-charts/#/
* https://medium.com/@mtiller/open-source-plotting-libraries-primarily-for-react-c43cfa4dc90f
* https://github.com/hshoff/vx
* http://voidcanvas.com/top-10-react-graph-chart-libraries-with-demo/
* CrossFilter to allow client-side filtering / synching of charts?
* some React DataTable

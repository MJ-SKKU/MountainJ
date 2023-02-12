import React from 'react'
import { withRouter } from 'react-router-dom';
import ReactGA from 'react-ga4'; // new
const RouteChangeTracker = ({ history }) => {

    history.listen((location, action) => {
        ReactGA.send("pageview"); 
    });
    return <div></div>;
};

export default withRouter(RouteChangeTracker);
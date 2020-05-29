import React, { Component, lazy } from "react";

import { Router, Route, BrowserRouter } from "react-router-dom";
import history from "./helpers/history";

import { CookiesProvider } from "react-cookie";

const PrivateRoute = lazy(() => import("./components/privateRoute"));
const Landing = lazy(() => import("./landing"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const Logout = lazy(() => import("./pages/logout"));
const Play = lazy(() => import("./pages/play"));
const CreateQuiz = lazy(() => import("./pages/create_quiz"));
const EditQuiz = lazy(() => import("./pages/edit_quiz"));

const Loader = (
  <div className="loader-wrapper">
    <div className="loader" />
  </div>
);

class App extends Component {
  render() {
    return (
      <CookiesProvider>
        <BrowserRouter basename="/">
          <React.Suspense fallback={Loader}>
            <Router history={history}>
              {/* No authentication */}
              <Route exact path="/" component={Landing} />
              <Route path="/login" component={Login} />
              <Route path="/play/:id" component={Play} />
              <Route path="/register" component={Register} />
              <Route path="/create_quiz" component={CreateQuiz} />
              <Route path="/edit_quiz/:id" component={EditQuiz} />

              {/* Authentication */}
              <PrivateRoute path="/logout" component={Logout} />
            </Router>
          </React.Suspense>
        </BrowserRouter>
      </CookiesProvider>
    );
  }
}

export default App;

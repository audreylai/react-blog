import Main from"./pages/Main.jsx";
import Login from"./pages/Login.jsx";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      
      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/" exact>
            <Main/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

import "./App.css";
import facade from "./ApiFacade";
import { useState, useEffect } from "react";
import react from "react";
import "./style.css";
import LoggedIn from "./LoggedIn";
import LogIn from "./Login";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

export default function BasicExample() {
  return (
    <Router>
      <div>
        <Header />
        <hr />

        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
          */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="conferences/*" element={<Home />} />
            <Route path="scoreboard/*" element={<Scoreboard/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// You can think of these components as "pages"
// in your app.

function Header() {
  return (
    <div>
      <ul className="header">
        <li>
          <NavLink exact activeclass="selected" to="/">
            Login
          </NavLink>
        </li>
        <li>
          <NavLink exact activeclass="selected" to="/conferences">
            Conferences
          </NavLink>
        </li>
        <li>
          <NavLink exact activeclass="selected" to="/scoreboard">
            Scoreboard
          </NavLink>
        </li>
      </ul>
    </div>
  );
}





function Home(){
  const [conferences, setConferences] = useState([]);

  const AllConferences = async () => {
    let response = await facade.fetchData("conf/all");
    
    const data = await response;
    console.log(data)
    setConferences(data);
  }

  useEffect(() => {
    AllConferences()
  }, [])
  return (
    <div>
      <h1>Currently Listed Conferences : </h1>
      {
        conferences.map(elm => (
              <ul style={{display: "flex", flex: "50%", flexDirection: "column"}} key={elm.id}>
                <p>
                  Name : {elm.name} <br/>
                  Location : {elm.location} <br/>
                  Capacity : {elm.capacity} <br/>
                  Date : {elm.date} <br/>
                  Time : {elm.time} <br/>
                </p>
              </ul>
            ))
      }
    </div>
  )
}

function LoginPrompt() {
  const [role, setRole] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const logout = () => {
    facade.logout();
    setLoggedIn(false);
    setRole("");
  };

  const login = async (user, pass) => {
    await facade.login(user, pass)
      .then(() => setLoggedIn(true))
      .then((res) => setRole(res.role));
  };

  return (
    <div>
      {!loggedIn ? (
        <LogIn login={login} />
      ) : (
        <div>
          <LoggedIn facade={facade} />
          <p>This is your role: {role}</p>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}

function Login(){
  return (
    <form action="{URL}">
      <div className="form-group w-25">
        <LoginPrompt />
      </div>
    </form>
  );
}

function Scoreboard(){
  return (
    <h1>Fucking work please</h1>
  )
}
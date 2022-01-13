import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style2.css";

import LoggedIn from "./LoggedIn";
import LogIn from "./Login";
import facade from "./ApiFacade";


import { useState, useEffect } from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import { IMG_URL, GAME_URL } from "./settings";

function LoginPrompt() {
  const [loggedIn, setLoggedIn] = useState(false);
  const logout = () => {
    facade.logout();
    setLoggedIn(false);
  };

  const login = (user, pass) => {
    facade
      .login(user, pass)
      .then((res) => res.json())
      .then((res) => setLoggedIn(true));
  };

  return (
    <div>
      {!loggedIn ? (
        <LogIn login={login} />
      ) : (
        <div>
          <LoggedIn facade={facade} />
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}

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
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/scoreboard">
              <Scoreboard />
            </Route>
          </Switch>
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
            Play
          </NavLink>
        </li>
        <li>
          <NavLink exact activeclass="selected" to="/login">
            Login
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

function ShowScoreboard() {

  

  return (
    <div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Username</th>
            <th scope="col">Score</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>ExampleMan</td>
            <td>42069</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function Home() {
  const [quotes, setQuotes] = useState([]);         // Array of four random quotes
  const [score, setScore] = useState();               // Track score
  const [allQuotes, setAllQuotes] = useState(null);

  const [correctAnswer, setCorrectAnswer] = useState(
    {
      content:"",
      src:"",
      image:""
    }
  )
  console.log(correctAnswer)

  const [count, setCount] = useState(0);

  useEffect( () => {
    const interval = setInterval(
      () => {
        setCount((count)=>{
          //console.log(count)
          return count + 1
        })
      }, 1000
    )
    return () => {clearInterval(interval)}
  }, []
  )

  useEffect(
    () => {
      setCount(0)
      if(quotes.length != 0){
        setCorrectAnswer(quotes[Math.floor(Math.random() * quotes.length)])
      }
    }, [quotes]
  )

  useEffect( () => {
      if(count === 10 && score !== 10){
        setScore(score - 1)
        setCount(() => {
          return 0
        })
        getFourQuotes(allQuotes)
      }
    }, [count]
  )



  function checkAnswer(ans){
    if(ans === correctAnswer.src){
      setScore(score + 1)
    } else {
      setScore(0)
    }
  }

  function getRndQuote(data){
    const q = Math.floor(Math.random() * data.quotes.length);
    return data.quotes[q]
  }

  async function getFourQuotes (data){
    setAllQuotes(data)
    const arr = []
    for (let index = 0; index < 4; index++) {
      arr[index] = getRndQuote(data)

      let unchanged = false 
      while(!unchanged){

        for(let check = 0; check < index; check++){

          if(arr[index].src === arr[check].src){
            arr[index] = getRndQuote(data)
            unchanged = false
          } else 
          {
            unchanged = true
          }

        }
        unchanged = true
      }

      let img = await getImage(arr[index].src)
      console.log(arr[index].src)
      arr[index].image = img.results[0].poster_path

    }
    setQuotes(arr);
  }

  // Fetch poster-path from backend API
  // Returns "/{filename}" which must be appended to "https://image.tmdb.org/t/p/w500"
  const getImage = async (title) => {
    const response = await fetch(`${IMG_URL}` + title, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const img = await response.json();
    return img
  }

  const startGame = async (evt) => {
    evt.preventDefault();

    const response = await fetch(`${GAME_URL}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    await getFourQuotes(data)
    
  };

  
  if(score === 10){
    return(
      <div>
        <h1 className="col-md-12 text-center">Congratulations!</h1>
      </div>
    )
  }

  if (quotes.length != 0) {
    return (
      <div>
        <h4 className="col-md-12 text-center"> Time: {10 - count}</h4>
        <h2 className="col-md-12 text-center"> "{correctAnswer.content}" </h2>
        <div style={{display: "flex", flexWrap: "wrap"}}> 
            {
            quotes.map(elm => (
              <ul style={{display: "flex", flex: "50%", flexDirection: "column"}} key={elm.src}>
                
                {/* Get image from tmdb */}
                <img style={{display: "block", marginLeft: "auto", marginRight: "auto"}}
                  alt="getRekt"
                  src={`https://image.tmdb.org/t/p/w200${elm.image}`} 
                />

                {/* Display the Movie Title under the Picture */}
                <h3 className="col-md-12 text-center">{elm.src}</h3>
                
                {/* Display Guess Button */}
                <div className="col-md-12 text-center">
                  <button className="btn-primary" 
                  onClick={() => {
                    checkAnswer(elm.src)
                    getFourQuotes(allQuotes)
                  }
                  }> Guess! </button>
                </div>

              </ul>
            ))
            }
        </div>
        <h3 className="col-md-12 text-center"> Current score: {score}</h3>
      </div>
    );
  }

  return (
    <div className="col-md-12 text-center">
      <h2>Welcome to the Amazing Movie Quiz</h2>
      <form>
        <button className="btn-primary" onClick={(event) => {
            startGame(event)
            setScore(0)
          }}>
          PLAY!
        </button>
      </form>
    </div>
  );
}

function Login() {
  return (
    <form action="{URL}">
      <div className="form-group w-25">
        <LoginPrompt />
      </div>
    </form>
  );
}

function Scoreboard() {
  return (
    <div>
      <h2>Scoreboard</h2>
      <ShowScoreboard />
    </div>
  );
}

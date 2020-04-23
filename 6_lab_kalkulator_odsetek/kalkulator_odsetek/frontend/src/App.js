import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {

   const handleClick = async () => {
     // Pobranie argumentow
     const arg1 = document.getElementById("k1").value;
     const arg2 = document.getElementById("o2").value;
     // Request
     const helloResp = await axios.get('/api/' + arg1 + '/' + arg2);
     // Drukowanie wyniku
     console.log(helloResp.data);
     ReactDOM.render(<p id={"wynik2"}></p>, document.getElementById("wynik"));
     document.getElementById("wynik2").innerHTML = helloResp.data;
   };

  return (
    <div className="App">
      <header className="App-header">
          <h1>Kalkulator odsetek lokat bankowych</h1>

          <div>
              <img src={logo} className="App-logo" alt="logo" />
              <img src={logo} className="App-logo" alt="logo" />
              <img src={logo} className="App-logo" alt="logo" />
        </div>
        <p id={"info"}>
          Wpisz dane lokaty i kliknij przycisk "Oblicz"
        </p>
          <form>
              <label>
                  <input id="k1" type="text" name="k" placeholder={"Kapitał"} />
              </label>
              <br />
              <label>
                  <input id="o2" type="text" name="o" placeholder={"Jakie oprocentowanie?"}/>
              </label>
              <br />
              <label>
                  <input id="d3" type="text" name="d" placeholder={"Na ile dni?"}/>
              </label>
              <br />
          </form>
          <button onClick={handleClick}>Oblicz</button>
          <div id={"wynik"}>

          </div>


      </header>
        <footer className={"App-footer"}>
            © Patryk Pobłocki | <a href="www.github.com/ppoblocki">www.github.com/ppoblocki</a>
        </footer>
    </div>
  );
}

export default App;

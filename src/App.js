import './App.css';
import Maincomponent from './Maincomponent';



function App() {

  return (
    <div className="App">
      <header className="App-header">
        <div className='row'>
          <div className='col-3'>
            <img className='logo' src="./logo.png" />
          </div>
        </div>
        <div className='width-full'>
          <Maincomponent/>
        </div>
      </header>
    </div>
  );
}

export default App;

import './App.css';
import games from './data/games';

function App() {
  return (
    <div className="main">
      <div className="list-wrapper">
        <ul>
          {games.map((game, i) => <li key={i}>{game}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default App;

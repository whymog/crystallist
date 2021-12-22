import './App.css';
import games from './data/games';

function App() {
  return (
    <div className="main">
      <div className="list-wrapper">
        <ul className="list">
          {games.map((game, i) => <li key={i} className="item">{game}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default App;

import { /* useEffect, */ useState } from "react";
import styles from "./App.module.css";

import List from "./components/List";

import { mainGames } from "./data/games";

// TODO:
// - Store list in state
// - Allow list updating by rearranging <li>s
// - Represent list state in query string
// - Parse list state from query string on load
// - CSS polish
// - Mobile interaction polish

const defaultState = {
  listItems: [...mainGames],
};

const setInitialStateFromQueryString = (queryParams) => {
  // TODO: Set filter mode, conditions, etc. from query string.
  // Layer in localStorage data afterward if present.
  // For now, though, let's just mimic the default behavior.

  return { ...defaultState };
};

const updateList = (newState, setState) => {};

function App() {
  // Set initial state
  const queryString = window.location.search;
  let queryParams = new URLSearchParams(queryString);

  let foo = queryParams.get("foo");
  if (foo) {
    // Do something
  }

  // TODO: Check for query params, then localStorage, before pulling from the default list
  const [state, setState] = useState(
    queryParams?.length
      ? setInitialStateFromQueryString(queryParams)
      : { ...defaultState }
  );

  // TODO: Validate initialState from query string and weed out errors

  return (
    <div className={styles.main}>
      <div className={styles.listWrapper}>
        <List items={state.listItems} updateList={updateList} />
      </div>
    </div>
  );
}

export default App;

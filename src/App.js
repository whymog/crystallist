import React, { useState, useEffect, useCallback, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from "@emotion/styled";

import {
  allGames as allFFGames,
  mainSeries as ffMainSeries,
  types as ffGameTypes,
} from "./data/ff";
import {
  allGames as allZeldaGames,
  types as zeldaGameTypes,
} from "./data/zelda";

import logoImg from "./img/logo-2.png";
import shareImg from "./img/share.png";
import shareHint from "./img/share-hint.png";

const initialGamesState = [];

const visibilityOptionsNames = [
  "mmos",
  "sequels",
  "spinoffs",
  "fourSwords",
  "ds",
];
const initialVisibilityOptionsState = visibilityOptionsNames.reduce(
  (acc, a) => ({
    ...acc,
    [a]: a === "mmos" || a === "fourSwords" || a === "ds",
  }),
  {}
);

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function ItemWrapper({ item, index }) {
  // const [expanded, setExpanded] = useState(false);

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <Item
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          isDragging={snapshot.isDragging}
          // onClick={() => setExpanded(!expanded)}
        >
          <Emoji>{item.emoji}</Emoji> {item.name}
          <Number number={index + 1}>{index + 1}</Number>
          {/* Expanded: {`${expanded}`} */}
        </Item>
      )}
    </Draggable>
  );
}

const ItemList = React.memo(function ItemList({ items }) {
  return items.map((item, index) => (
    <ItemWrapper item={item} index={index} key={item.id} />
  ));
});

const series = {
  ff: {
    games: allFFGames,
    mainSeries: ffMainSeries,
    types: ffGameTypes,
  },
  zelda: {
    games: allZeldaGames,
    types: zeldaGameTypes,
  },
};

function App() {
  const [gamesState, setGamesState] = useState([...initialGamesState]);
  const [rankedGamesState, setRankedGamesState] = useState([]);
  const [visibilityState, setVisibilityState] = useState({
    ...initialVisibilityOptionsState,
  });
  const [toastState, setToastState] = useState({ text: "", isVisible: false });
  const [activeSeries, setActiveSeries] = useState("ff");

  const rankedGamesStateRef = useRef(rankedGamesState);

  const updateQueryString = useCallback(() => {
    const orderString = `series=${activeSeries}&order=${rankedGamesState
      .map((game) => game.id)
      .join(",")}`;
    const visibilityString = `${visibilityOptionsNames
      .map((name) => `${name}=${visibilityState[name]}`)
      .join("&")}`;

    window.history.replaceState(
      null,
      null,
      `?${rankedGamesState.length ? `${orderString}&` : ""}${visibilityString}`
    );
  }, [rankedGamesState, visibilityState, activeSeries]);

  useEffect(() => {
    if (!gamesState.length) {
      return;
    }

    const newRankedGamesState = [...gamesState].filter(
      (item) => item.visible === true
    );

    setRankedGamesState(newRankedGamesState);
  }, [gamesState]);

  useEffect(() => {
    rankedGamesStateRef.current = rankedGamesState;

    if (rankedGamesState.length) {
      updateQueryString();
      // updateShareString(); // TODO: Refactor into this method; probably store the string in state, too?
    }
  }, [rankedGamesState, updateQueryString]);

  // Add/remove games as dictated by visibility options
  useEffect(() => {
    if (!gamesState.length) {
      return;
    }

    const newGamesState = gamesState.map((game) => {
      if (activeSeries === "ff") {
        if (game.isMMO) {
          game.visible = visibilityState.mmos === true;
        } else if (game.type === series[activeSeries].types?.mainRelated) {
          game.visible = visibilityState.sequels === true;
        } else if (game.type === series[activeSeries].types?.spinoff) {
          game.visible = visibilityState.spinoffs === true;
        }
      } else if (activeSeries === "zelda") {
        if (game.type === series[activeSeries].types?.ds) {
          game.visible = visibilityState.ds === true;
        } else if (game.type === series[activeSeries].types?.fourSwords) {
          game.visible = visibilityState.fourSwords === true;
        }
      }

      return game;
    });

    setGamesState(newGamesState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibilityState, activeSeries]);

  // TODO: break this up; it's pretty bloated and side-effect-y.
  // The shareButton callback (and event listener) should only be defined once and pull its string from state, or a ref, maybe.
  useEffect(() => {
    function showToast(text, _timeout) {
      setToastState({ text: text, isVisible: true });

      window.setTimeout(
        () => setToastState({ text: toastState.text, isVisible: false }),
        _timeout ? _timeout : 5000
      );
    }

    const shareButton = document.querySelector("#shareButton");
    shareButton.addEventListener(
      "click",
      async () => {
        let shareText = "";

        const rankedList = [...rankedGamesStateRef.current];
        rankedList.forEach(
          (game, i) =>
            (shareText += `${i > 0 ? "\n" : ""}${i + 1}. ${game.shareName} ${
              game.emoji
            }`)
        );

        shareText += `\n\n${window.location}`;

        if (navigator.canShare) {
          const shareData = {
            title: "Crystallist",
            text: shareText,
          };

          try {
            await navigator.share(shareData);
          } catch (err) {
            showToast(
              "Share was canceled or otherwise unsuccessful. Please try copy-pasting the full URL and share that instead.",
              8000
            );
          }
        } else {
          navigator.clipboard.writeText(shareText).then(
            function () {
              showToast("Successfully copied to clipboard.");
            },
            function () {
              showToast(
                "Error: Couldn't write to clipboard. But you can still copy-paste the full URL and share your list that way.",
                8000
              );
            }
          );
        }
      },
      []
    );

    if (window.location.search) {
      const url = new URL(window.location);
      const params = new URLSearchParams(url.search);

      let seriesToUse = "ff";

      if (params.has("series")) {
        // Use game data from series
        setActiveSeries(params.get("series"));
        seriesToUse = params.get("series");
      }

      let newGamesState = [...series[seriesToUse].games];

      if (params.has("order")) {
        const listString = params.get("order");

        if (listString.length) {
          const listArray = listString.split(",");

          newGamesState = [...initialGamesState];

          // First, add all query string games to array, and in order
          listArray.forEach((id) => {
            const matchingGame = series[seriesToUse].games.find(
              (game) => game.id === id
            );
            if (matchingGame) {
              newGamesState.push({
                ...matchingGame,
                visible: true,
              });
            }
          });

          // Then, populate the remaining games and set their visibility to `false`

          series[seriesToUse].games.forEach((game) => {
            if (
              newGamesState.findIndex((newGame) => newGame.id === game.id) < 0
            ) {
              newGamesState.push({
                ...game,
                visible: false,
              });
            }
          });
        }
      } else {
        // If no order, set a default one
        newGamesState = newGamesState.map((game) => {
          return {
            ...game,
            visible: true,
          };
        });
      }

      // Check for visibility filters
      const newVisibilityOptionsState = { ...initialVisibilityOptionsState };

      visibilityOptionsNames.forEach((option) => {
        if (params.has(option)) {
          newVisibilityOptionsState[option] = params.get(option) === "true";
        }
      });

      setVisibilityState(newVisibilityOptionsState);
      setGamesState(newGamesState);
    } else {
      setGamesState(
        series[activeSeries].games.map((game) => {
          return { ...game, visible: game.type === "MAIN" };
        })
      );
    }
  }, [toastState.text, activeSeries]);

  function onDragEnd(result) {
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }

    const items = reorder(
      rankedGamesState,
      result.source.index,
      result.destination.index
    );

    setRankedGamesState([...items]);
  }

  function handleSetVisibilityState(e) {
    const option = e.target.id;

    setVisibilityState({
      ...visibilityState,
      [option]: !visibilityState[option],
    });
  }

  function hideToast() {
    if (toastState.isVisible) {
      setToastState({ text: toastState.text, isVisible: false });
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Main>
        <Header>
          <ShareButton id="shareButton">
            <img src={shareHint} alt="Share" />
          </ShareButton>
          <Title>Crystallist</Title>
        </Header>
        <ContentWrapper visible={rankedGamesState?.length}>
          <Options>
            {activeSeries === "ff" ? (
              <>
                <Option>
                  <input
                    type="checkbox"
                    id="mmos"
                    checked={visibilityState.mmos}
                    onChange={(e) => handleSetVisibilityState(e)}
                  />
                  <label htmlFor="mmos">Include MMORPGs</label>
                </Option>
                <Option>
                  <input
                    type="checkbox"
                    id="sequels"
                    checked={visibilityState.sequels}
                    onChange={(e) => handleSetVisibilityState(e)}
                  />
                  <label htmlFor="sequels">Include sequels</label>
                </Option>
                <Option>
                  <input
                    type="checkbox"
                    id="spinoffs"
                    checked={visibilityState.spinoffs}
                    onChange={(e) => handleSetVisibilityState(e)}
                  />
                  <label htmlFor="spinoffs">Include spin-offs</label>
                </Option>
              </>
            ) : null}
            {activeSeries === "zelda" ? (
              <>
                <Option>
                  <input
                    type="checkbox"
                    id="fourSwords"
                    checked={visibilityState.fourSwords}
                    onChange={(e) => handleSetVisibilityState(e)}
                  />
                  <label htmlFor="sequels">Include Four Swords games</label>
                </Option>
                <Option>
                  <input
                    type="checkbox"
                    id="ds"
                    checked={visibilityState.ds}
                    onChange={(e) => handleSetVisibilityState(e)}
                  />
                  <label htmlFor="sequels">Include DS games</label>
                </Option>
              </>
            ) : null}
          </Options>
          <Droppable droppableId="list">
            {(provided) => (
              <ListWrapper ref={provided.innerRef} {...provided.droppableProps}>
                {rankedGamesState.length && (
                  <ItemList items={rankedGamesState} />
                )}
                {provided.placeholder}
              </ListWrapper>
            )}
          </Droppable>
          <BottomText>
            <div>
              Please submit bugs and feature requests{" "}
              <a
                href="https://github.com/whymog/crystallist/issues"
                target="_blank"
                rel="noreferrer"
              >
                on GitHub
              </a>
              .{" "}
            </div>
            <div>
              <a
                href="https://na.finalfantasy.com/copyrights"
                target="_blank"
                rel="noopener noreferrer"
              >
                Final Fantasy ©Square Enix Co., Ltd.
              </a>
            </div>
            <div>
              <a
                href="https://www.nintendo.co.jp/corporate/en/index.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                The Legend of Zelda ©Nintendo Co., Ltd.
              </a>
            </div>
          </BottomText>
        </ContentWrapper>
        <Toast isVisible={toastState.isVisible} onClick={hideToast}>
          {toastState.text}
        </Toast>
      </Main>
    </DragDropContext>
  );
}

export default App;

const grid = 10;

const Main = styled.div`
  width: 100vw;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;

  background: linear-gradient(to bottom, transparent, black);
`;

const Header = styled.div`
  @media (min-width: ${800}px) {
    width: 600px;
  }

  position: relative;
  display: flex;
  align-items: center;
  width: 90vw;
`;

const Title = styled.h1`
  width: 500px;
  height: 60px;
  color: white;
  font-weight: 500;
  background-image: url(${logoImg});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: left center;

  color: transparent;
  user-select: none;
`;

const ShareButton = styled.a`
  position: absolute;
  width: 40px;
  height: 24px;
  right: 0px;
  padding: 6px 8px 8px;
  background-image: url(${shareImg});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-origin: content-box;
  background-color: rgba(255, 255, 255, 0.25);
  border-radius: 4px;

  box-shadow: 0 2px 1px 2px rgba(0, 0, 69, 0.25);

  transition: background-color ease 150ms;

  &:hover {
    background-color: rgba(255, 255, 255, 0.5);)
  }

  cursor: pointer;

  img {
    @media only screen and (max-width: 768px) {
      display: none;
    }

    position: absolute;
    width: 80px;
    height: 42px;
    top: 0;
    right: 0;
    opacity: 0;

    cursor: pointer;

    transition: right 300ms ease-in-out 50ms, opacity 200ms ease-in-out 50ms;
  }

  &:hover img {
    right: 60px;
    opacity: 1;

    transition: right 300ms ease-in-out, opacity 400ms ease-in-out 50ms;
  }
`;

const ContentWrapper = styled.div`
  opacity: ${(props) => (props.visible ? "1" : "0")};
  pointer-events: ${(props) => (props.visible ? "all" : "none")};
  transition: opacity 200ms;
`;

const ListWrapper = styled.div``;

const Item = styled.div`
  @media (min-width: ${320}px) {
    width: 70vw;
    margin-left: 15vw;
  }

  @media (min-width: ${800}px) {
    width: 600px;
    margin-left: 0;
  }

  position: relative;
  border: solid 1px #424542;
  box-shadow: 1px 1px #e7dfe7, -1px -1px #e7dfe7, 1px -1px #e7dfe7,
    -1px 1px #e7dfe7, 0 -2px #9c9a9c, -2px 0 #7b757b, 0 2px #424542;
  border-radius: ${grid}px;
  margin-bottom: ${grid}px;
  padding: ${grid}px;
  font-size: 24px;

  display: grid;
  grid-template-columns: 40px 1fr;
  grid-column-gap: 16px;

  align-items: center;

  background: linear-gradient(to bottom, #1010aa, #101040);

  color: white;

  &:focus {
    outline: 3px solid orange;
  }
`;

const Number = styled.div`
  @media (min-width: ${320}px) {
    left: -15vw;
  }

  @media (min-width: ${480}px) {
    left: -60px;
  }

  @media (min-width: ${800}px) {
    left: -60px;
  }

  position: absolute;
  display: grid;
  align-content: center;
  justify-content: center;
  top: 12px;
  width: 30px;
  height: 30px;
  padding: 4px;
  transform: scale(
    ${(props) =>
      props.number === 1
        ? "1.2"
        : props.number === 2
        ? "1.1"
        : props.number === 3
        ? "1.05"
        : "1"}
  );

  background-color: rgba(
    ${(props) =>
      props.number === 1
        ? "255, 223, 118, 0.75"
        : props.number === 2
        ? "238, 238, 238, 0.4"
        : props.number === 3
        ? "255, 156, 67, 0.30"
        : "255,255,255,0.25"}
  );

  filter: drop-shadow(
    0 0 12px
      rgba(
        ${(props) =>
          props.number === 1
            ? "255, 195, 0, 1"
            : props.number === 2
            ? "248, 248, 248, 0.90"
            : props.number === 3
            ? "255, 156, 67, 0.90"
            : "255, 255, 255, 0.75"}
      )
  );

  border-radius: 50%;
  font-size: 18px;

  color: ${(props) =>
    props.number === 1
      ? "rgb(255, 255, 255)"
      : props.number === 2
      ? "rgb(248, 248, 248)"
      : props.number === 3
      ? "rgb(255, 156, 67)"
      : "white"};
  font-weight: ${(props) => (props.number <= 3 ? 700 : 400)};
`;

const Emoji = styled.span`
  background: radial-gradient(rgba(255, 255, 255, 0.5), transparent);
  border-radius: 50%;
  padding: 4px;
  display: grid;
  align-content: center;
  justify-content: center;
`;

const Options = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: white;
  margin-bottom: 20px;
`;

const Option = styled.div`
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  grid-column-gap: 12px;
`;

const BottomText = styled.div`
  margin-top: 60px;
  margin-bottom: 40px;
  color: white;

  text-align: center;
  line-height: 24px;

  a {
    color: white;
  }

  a:active,
  a:visited {
    color: gray;
  }
`;

const Toast = styled.div`
  @media (min-width: ${320}px) {
    width: 80vw;
  }

  @media (min-width: ${480}px) {
    width: 70vw;
  }

  @media (min-width: ${800}px) {
    width: 420px;
  }

  position: fixed;
  top: 20vh;
  min-height: 64px;
  padding: 16px 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #222222;
  color: white;
  box-shadow: 0 4px 16px 8px rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  font-size: 20px;
  font-weight: 500;

  pointer-events: ${(props) => (props.isVisible ? "all" : "none")};

  opacity: ${(props) => (props.isVisible ? "1" : "0")};
  transition: opacity 300ms ease;

  cursor: pointer;
  user-select: none;
`;

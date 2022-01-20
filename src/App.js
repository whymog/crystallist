import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from "@emotion/styled";

import { allGames } from "./data/games";

import shareImg from "./img/share.png";

const initial = Array.from(allGames).map((game, i) => {
  return {
    id: `id-${game.id}`,
    content: game,
  };
});

const initialState = {
  items: initial,
  showMMOs: true,
};

const grid = 10;

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

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
  color: white;
  font-weight: 500;
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
`;

const ListWrapper = styled.div``;

const Item = styled.div`
  @media (min-width: ${320}px) {
    width: 75vw;
    margin-left: 10vw;
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
    left: -12.5vw;
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
  background-color: rgba(
    ${(props) =>
      props.number === 1
        ? "212,175,55, 0.45"
        : props.number === 2
        ? "192,192,192, 0.30"
        : props.number === 3
        ? "205, 127, 50, 0.30"
        : "255,255,255,0.25"}
  );
  border-radius: 50%;
  font-size: 18px;

  color: ${(props) =>
    props.number === 1
      ? "rgb(212,175,55)"
      : props.number === 2
      ? "rgb(192,192,192)"
      : props.number === 3
      ? "#D5853D"
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
  color: white;
  margin-top: 20px;
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

  opacity: ${(props) => (props.isVisible ? "1" : "0")};
  transition: opacity 300ms ease;

  cursor: pointer;
  user-select: none;
`;

function ItemWrapper({ item, index }) {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <Item
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          isDragging={snapshot.isDragging}
        >
          <Emoji>{item.content.emoji}</Emoji> {item.content.name}
          <Number number={index + 1}>{index + 1}</Number>
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

function App() {
  // TODO: Check for query params, then localStorage, before pulling from the default list
  const [state, setState] = useState({ ...initialState });
  const [toastState, setToastState] = useState({ text: "", isVisible: false });

  useEffect(() => {
    const shareButton = document.querySelector("#shareButton");
    shareButton.addEventListener("click", async () => {
      const url = window.location.href;
      const shareText = `My favorite Final Fantasy games are: ${url}`;

      if (navigator.canShare) {
        const shareData = {
          title: "Crystallist",
          text: shareText,
          url: window.location.href,
        };

        try {
          console.log("foo");
          await navigator.share(shareData);
        } catch (err) {
          console.log(
            "Share was canceled or otherwise unsuccessful. Please try copy-pasting the full URL and share that instead."
          );
        }
      } else {
        navigator.clipboard
          .writeText(`My favorite Final Fantasy games are: ${url}`)
          .then(
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
    });

    if (window.location.search) {
      const url = new URL(window.location);
      const params = new URLSearchParams(url.search);

      if (params.has("order")) {
        const listString = params.get("order");
        const listArray = listString.split("-");

        const shouldShowMMOs = params.get("showMMOs") === "true";

        const newState = { items: [], showMMOs: shouldShowMMOs };

        listArray.forEach((name) => {
          const matchingGame = allGames.find((game) => game.id === name);
          if (matchingGame) {
            newState.items.push({
              id: `id-${matchingGame.id}`,
              content: matchingGame,
            });
          }
        });

        setState({ ...newState });
      } else {
        setState({ ...initialState });
      }
    }
  }, []);

  function onDragEnd(result) {
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }

    const items = reorder(
      state.items,
      result.source.index,
      result.destination.index
    );

    setState({ items: [...items], showMMOs: state.showMMOs });

    window.history.replaceState(
      null,
      null,
      `?order=${items.map((item) => item.content.id).join("-")}&showMMOs=${
        state.showMMOs
      }`
    );
  }

  function toggleShowMMOs() {
    // If showing MMOs, check to see if they're somehow in the current list. If not, add them in to the bottom.
    // If hiding MMOs, find them within the list and splice them out in-line.
    // Next, follow the pattern as in onDragEnd above: update state, and then update the query string.
    const newMMOState = !state.showMMOs;

    // Hiding MMOs
    if (newMMOState === false) {
      const newItems = [];

      state.items.forEach((item, i) => {
        if (item.content.isMMO === false) {
          newItems.push(item);
        }
      });

      setState({ items: [...newItems], showMMOs: newMMOState });

      window.history.replaceState(
        null,
        null,
        `?order=${newItems
          .map((item) => item.content.id)
          .join("-")}&showMMOs=${newMMOState}`
      );
    } else if (newMMOState === true) {
      const newItems = [...state.items];

      allGames.forEach((game, i) => {
        if (game.isMMO) {
          newItems.push({
            id: `id-${game.id}`,
            content: game,
          });
        }
      });

      setState({ items: [...newItems], showMMOs: newMMOState });

      window.history.replaceState(
        null,
        null,
        `?order=${newItems
          .map((item) => item.content.id)
          .join("-")}&showMMOs=${newMMOState}`
      );
    }
  }

  function showToast(text, _timeout) {
    setToastState({ text: text, isVisible: true });

    window.setTimeout(
      () => setToastState({ text: toastState.text, isVisible: false }),
      _timeout ? _timeout : 5000
    );
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
          <ShareButton id="shareButton"></ShareButton>
          <Title>Crystallist</Title>
        </Header>
        <Droppable droppableId="list">
          {(provided) => (
            <ListWrapper ref={provided.innerRef} {...provided.droppableProps}>
              {state.items && <ItemList items={state.items} />}
              {provided.placeholder}
            </ListWrapper>
          )}
        </Droppable>
        <Options>
          <Option>
            <label htmlFor="showMMOs">Include MMORPGs</label>
            <input
              type="checkbox"
              id="showMMOs"
              checked={state.showMMOs}
              onChange={toggleShowMMOs}
            />
          </Option>
        </Options>
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
              rel="noreferrer"
            >
              Final Fantasy ©Square Enix Co., Ltd.
            </a>
          </div>
        </BottomText>
        <Toast isVisible={toastState.isVisible} onClick={hideToast}>
          {toastState.text}
        </Toast>
      </Main>
    </DragDropContext>
  );
}

export default App;

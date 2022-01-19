import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from "@emotion/styled";

import { allGames } from "./data/games";

const initial = Array.from(allGames).map((game, i) => {
  return {
    id: `id-${i}`,
    content: game,
  };
});

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

const Title = styled.h1`
  color: white;
  font-weight: 500;
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

  background: linear-gradient(to bottom, #1010aa, #101040);

  color: white;
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
  top: 8px;
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
`;

const Option = styled.div`
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  grid-column-gap: 12px;
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
  const [state, setState] = useState({ items: initial });

  useEffect(() => {
    if (window.location.search) {
      const url = new URL(window.location);
      const params = new URLSearchParams(url.search);

      if (params.has("order")) {
        const listString = params.get("order");
        const listArray = listString.split("-");

        const newState = { items: [] };

        let index = 0;
        listArray.forEach((name) => {
          const matchingGame = allGames.find((game) => game.id === name);
          if (matchingGame) {
            newState.items.push({
              id: `id-${index}`,
              content: matchingGame,
            });
            index++;
          }
        });

        setState(newState);
      } else {
        setState({ items: initial });
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

    setState({ items });

    window.history.replaceState(
      null,
      null,
      `?order=${items.map((item) => item.content.id).join("-")}`
    );
  }

  function toggleShowMMOs() {}

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Main>
        <Title>Crystallist</Title>
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
            <input type="checkbox" id="showMMOs" onChange={toggleShowMMOs} />
          </Option>
        </Options>
      </Main>
    </DragDropContext>
  );
}

export default App;

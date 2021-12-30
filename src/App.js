import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from "@emotion/styled";

import { allGames } from "./data/games";

const initial = Array.from(allGames).map((game, i) => {
  return {
    id: `id-${i}`,
    content: game,
  };
});

const grid = 12;

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const Main = styled.div``;

const Numbers = styled.div``;

const ListWrapper = styled.div`
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
`;

const Item = styled.div`
  position: relative;
  width: 400px;
  border: 1px solid grey;
  margin-bottom: ${grid}px;
  padding: ${grid}px;
  font-size: 24px;
  background-color: lightblue;
`;

const Number = styled.div`
  position: absolute;
  left: -40px;
  top: 15px;
`;

function ItemWrapper({ item, index }) {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <Item
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {item.content.emoji} {item.content.name}
          <Number>{index}</Number>
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
  // Set initial state
  // const queryString = window.location.search;
  // let queryParams = new URLSearchParams(queryString);

  // let foo = queryParams.get("foo");
  // if (foo) {
  //   // Do something
  // }

  // TODO: Check for query params, then localStorage, before pulling from the default list
  // const [state, setState] = useState(
  //   queryParams?.length
  //     ? setInitialStateFromQueryString(queryParams)
  //     : { ...defaultState }
  // );

  // TODO: Validate initialState from query string and weed out errors
  const [state, setState] = useState({ items: initial });

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const items = reorder(
      state.items,
      result.source.index,
      result.destination.index
    );

    setState({ items });
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Main>
        <Numbers></Numbers>
        <Droppable droppableId="list">
          {(provided) => (
            <ListWrapper ref={provided.innerRef} {...provided.droppableProps}>
              <ItemList items={state.items} />
              {provided.placeholder}
            </ListWrapper>
          )}
        </Droppable>
      </Main>
    </DragDropContext>
  );
}

export default App;

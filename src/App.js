import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from "@emotion/styled";

import { mainGames } from "./data/games";

const initial = Array.from(mainGames).map((game, i) => {
  return {
    id: `id-${i}`,
    content: game,
  };
});

const grid = 8;

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const Item = styled.div`
  width: 200px;
  border: 1px solid grey;
  margin-bottom: ${grid}px;
  background-color: lightblue;
  padding: ${grid}px;
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
          {item.content}
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
      <Droppable droppableId="list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <ItemList items={state.items} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default App;

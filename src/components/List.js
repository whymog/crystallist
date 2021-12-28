import styles from "./List.module.css";

// TODO: Move the list logic and local state into this function component

function List({ items }) {
  // TODO: Handle cursor state here. Use a setState() simply to listen for mouseDown/mouseUp to toggle between
  // cursor: grab and cursor: grabbing in CSS.
  // also TODO: get all that CSS out of index.css lol that's not where it goes. App.css, maybe, but not index!!

  return (
    <ul className={styles.list}>
      {items &&
        items.map((item, i) => (
          <li key={i} className={styles.item} draggable="true">
            {item}
          </li>
        ))}
    </ul>
  );
}

export default List;

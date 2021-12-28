import { render, screen } from "@testing-library/react";
import List from "./List";

import { mainGames } from "../data/games";

test("renders one list item for each array item provided", async () => {
  render(<List items={mainGames} />);
  const linkElements = await screen.getAllByText(/Final Fantasy/i);
  expect(linkElements).toHaveLength(mainGames.length);
});

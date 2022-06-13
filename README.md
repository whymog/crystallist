<img src="./src/img/logo-2.png" alt="Crystallist"/>

# Crystallist: Rank and share your favorite games

Crystallist is a web app for ranking games and sharing your list with friends. It relies heavily on the wonderful [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd) package.

## Features

- Drag-and-drop interface that works on desktop and mobile
- Easily share your list via the share button or by copying the full URL (the query string updates to reflect list state)
- Keyboard navigation is also available — tab to select an item, space to "grab" or "release" it, and arrow keys to move it up and down the list

## Possible future stuff

Some things I'm considering adding at this point:
- Sub-lists: The ability to select/rank within a given item. This is helpful when you wanna choose your favorite version of a game or sort through the various remakes and re-issues to get super granular. (I don't know for sure why you'd wanna do this, but I'm sure someone does.)
- Comments: Add a small note explaining your choices. This'll make the URL query string nightmarishly long as this whole thing runs client-side, but that's a price I'm willing to pay to faciliate some good, old-fashioned editorializing.
- Rank other things: Episodes of your favorite TV show, classical composers, the seven deadly sins — sure, why not.
- Saving your lists

## Bugs? Feature requests?

Head on over to the [issues page](https://github.com/whymog/crystallist/issues). Thanks!

## Hooray for Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

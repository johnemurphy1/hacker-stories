import * as React from 'react';

const list = [{
  title: 'React',
  url: 'https://reactjs.org',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
},
{
  title: 'Redux',
  url: 'https://redux.js.org',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
},
];

// function getTitle(title){
//   return title;
// }

// const welcome = {
//   greeting: 'Hey',
//   title: 'React',
// }

function App() {
  
  return (
    <div>
      <h1>My Hacker Stories</h1>
      <Search />
      

      <hr />
      <List />
      
      {/* render the list here */}
      {/* and by the way: that's how you do comments in JSX */}
    </div>
  );
}

function Search() {
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text"/>
    </div>
  );
}
export default App;

function List(){
  return(
    <ul>
      {list.map(function (item){
        return (
          <li key={item.objectID}>
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>

          </li>
        );
      })}
      </ul>
  );
}
/* <h1>{welcome.greeting} {welcome.title} </h1> */
import * as React from 'react';



// function getTitle(title){
//   return title;
// }

// const welcome = {
//   greeting: 'Hey',
//   title: 'React',
// }

const App = () => {
  const stories = [
    {
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
  //A
  const handleSearch = (event) =>{
    
    //C
    console.log(event.target.value);
  };
  return(
    console.log('App renders'),
    <div>
      <h1>My Hacker Stories</h1>
      {/* // B */}
      <Search onSearch={handleSearch}/>
      

      <hr />
      <List list={stories} />
      
      {/* render the list here */}
      {/* and by the way: that's how you do comments in JSX */}
    </div>

  );
};


const Search = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  //let searchTerm='';
  
  const handleChange = (event) =>{
    setSearchTerm(event.target.value);
    //console.log(event.target.value);
  //B
  // eslint-disable-next-line no-undef
  props.onSearch(event);

  };
  return(
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleChange}/>
    <p>
      Searching for <strong>{searchTerm}</strong>
    </p>
    {/*console.log('Search Renders'),*/}
    </div>
  );
  };

export default App;

const List = (props) => (
  
    <ul>
      
      {props.list.map((item) =>(
          <Item key={item.objectID} item={item}/>
      ))}
      {/*console.log('List renders'),*/}
      </ul>
  
  );
const Item = (props) => (
  <li>
    {/*console.log('List renders'),*/}
        <span>
          <a href={props.item.url}>{props.item.title}</a>
        </span>
            <span>{props.item.author}</span>
            <span>{props.item.num_comments}</span>
            <span>{props.item.points}</span>

          </li>
        
      );
      


/* <h1>{welcome.greeting} {welcome.title} </h1> */
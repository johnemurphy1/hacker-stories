import * as React from 'react';
import './App.css';

const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const getAsyncStories = () =>
  new Promise((resolve) => 
    setTimeout(
      () => resolve({data:{stories: initialStories}}),
        2000
        )
      );


const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
    );
      
React.useEffect(() => {
  localStorage.setItem(key, value);
    }, [value, key]);
      
  return [value, setValue];
    };

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const App = () => {

  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
    );  

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    {data: [], isLoading: false, isError: false}
  );
  // const [isLoading, setIsLoading] = React.useState(false);
  // const [isError, setIsError] = React.useState(false);

  const handleFetchStories = React.useCallback(() => {
    if (!searchTerm) return;

    dispatchStories({type: 'STORIES_FETCH_INIT'});
    
    fetch(`${API_ENDPOINT}${searchTerm}`)
      .then((response) => response.json())
      .then((result)=> {
      dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.hits,
        });
    })
      .catch(() => 
        dispatchStories({type: 'STORIES_FETCH_FAILURE'})
      );
  }, [searchTerm]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
    
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };
  
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
    // eslint-disable-next-line no-lone-blocks
    {/*localStorage.setItem('search', event.target.value)*/}
  

  // const searchedStories = stories.data.filter((story) =>
  //   story.title.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div class="headerandsearch">
      <h1>My Hacker Stories</h1>

      <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={handleSearch}
      >

        <strong>Search:</strong>
      </InputWithLabel>
      <hr />

      {stories.isError && <p>Something went wrong...</p>}

        {stories.isLoading ? (
          <p>Loading...</p>
        ) : (
            <List 
            list={stories.data} 
            onRemoveItem={handleRemoveStory}
      />
      )}
    </div>
  );
        };
 
const InputWithLabel = ({
  id,  
  value,
  type='text',
  onInputChange,
  isFocused,
  children,
}) => {

const inputRef = React.useRef();

React.useEffect(() => {
  if (isFocused && inputRef.current) {
    inputRef.current.focus();
  }
}, [isFocused]);

return (
  <>
    <label htmlFor={id}>{children}</label>
    &nbsp;
    <input
      ref={inputRef}
      id={id}
      type={type}
      value={value}
      onChange={onInputChange}
    />
</>
);
}; 

const List = ({ list, onRemoveItem }) => (
  <ul>
    {list.map((item) => (
      <Item 
        key={item.objectID}
        item={item}
        onRemoveItem={onRemoveItem} />
    ))}
  </ul>
);

const Item = ({ item, onRemoveItem }) => (
//  const handleRemoveItem = () => {
//   onRemoveItem(item);
//  };

<li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    &ensp;
    <span>{item.author}</span>
    &ensp;
    <span>{item.num_comments}</span>
    &ensp;
    <span>{item.points}</span>
    <span>
    &ensp;  
    <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </li>
);


export default App;
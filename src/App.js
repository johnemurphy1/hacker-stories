import * as React from 'react';
import axios from 'axios';
import './App.css';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
    );
      
React.useEffect(() => {
  localStorage.setItem(key, value);
    }, [value, key]);
  //https://codesandbox.io/s/github/the-road-to-learn-react/hacker-stories/tree/2021/Third-Party-Libraries-in-React?file=/src/App.js    
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
        isError: false,
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

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
    );  

  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );


  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    {data: [], isLoading: false, isError: false}
  );
  
  const handleFetchStories = React.useCallback(async () => {
    
    dispatchStories({type: 'STORIES_FETCH_INIT'});
    
    try{
    const result = await axios.get(url);
    // .get(url)
    // .then((result) => { 
    dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.data.hits,
        });
    } catch{
      dispatchStories({type: `STORIES_FETCH_FAILURE`});
    }
    }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
      dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };
  
  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    setUrl(`{API_ENDPOINT}${searchTerm}`);

    event.preventDefault();
  };
  
    
  return (
    <div>
      <h1>My Hacker Stories</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <hr />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}) => (
  <form onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>

    <button type="submit" disabled={!searchTerm}>
      Submit
    </button>
  </form>
);
 
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
        onRemoveItem={onRemoveItem} 
  />
    ))}
  </ul>
);

const Item = ({ item, onRemoveItem }) => (

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
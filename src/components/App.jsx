import React, { useEffect, useState, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group'; // installed transaction to have fade out function 

const App = () => {
  const [posts, setPosts] = useState([]); // store all the list that has been fetched from API
  const [visiblePosts, setVisiblePosts] = useState(5); // display by default how many line/ data initally set up as 5 
  const [postsPerPage] = useState(5); // # of number that has to be diplay fixed as 5
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]); // list all the categories from from the POST
// fetch the data from the API 
  useEffect(() => {
    fetch('/api/posts')
      .then(response => response.json())
      .then(data => {
        setPosts(data.posts);

        const allCategories = data.posts.flatMap(post => post.categories);
        const uniqueCategories = Array.from(new Set(allCategories.map(cat => cat.name)));// set in the array  
        setCategories(uniqueCategories);
      })
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  const loadMore = () => {
    setVisiblePosts(prevVisible => prevVisible + postsPerPage); // this will handle the # of post page have to be render when the load more button is clicked 
  };

  const loadLess = () => {
    setVisiblePosts(prevVisible => Math.max(prevVisible - postsPerPage, postsPerPage)); // this will handle the # of post page have to be render when the load less button is clicked 
  };
// handle category changed 
  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCategories(prevSelected =>
      checked ? [...prevSelected, value] : prevSelected.filter(category => category !== value)
    );
  };

  const filteredPosts = selectedCategories.length > 0
    ? posts.filter(post =>
        post.categories.some(category => selectedCategories.includes(category.name))
      )
    : posts;

  // Create a ref for the Transition element
  const nodeRef = useRef(null);

  return (
    <div className="container">
      <header>
        <h1>Posts</h1>
      </header>

      <section className="filter">
        <h2>Filter by Category</h2>
        <div className="filter-options">
          {categories.map(category => (
            <label key={category} className="filter-label">
              <input
                type="checkbox"
                value={category}
                onChange={handleCategoryChange}
              />
              {category}
            </label>
          ))}
        </div>
      </section>

      <main>
        <TransitionGroup component="ul" className="post-list">
          {filteredPosts.slice(0, visiblePosts).map(post => (
            <CSSTransition
              key={post.id}
              nodeRef={nodeRef} // Add the nodeRef prop
              timeout={500}
              classNames="fade"
            >
              <li ref={nodeRef} className="post-item">
                <div className="post-header">
                  <h2>{post.title}</h2>
                  <p className="post-author">By {post.author.name}</p>
                </div>
                <p>{post.summary}</p>
                <p className="post-categories">
                  <strong>Categories:</strong> {post.categories.map(cat => cat.name).join(', ')}
                </p>
              </li>
            </CSSTransition>
          ))}
        </TransitionGroup>

        <div className="pagination-controls">
          {visiblePosts < filteredPosts.length && (
            <button onClick={loadMore} className="btn load-more">
              Load More
            </button>
          )}
          {visiblePosts > postsPerPage && (
            <button onClick={loadLess} className="btn load-less">
              Load Less
            </button>
          )}
        </div>
      </main>

      <footer>
        <p>Powered by React - © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;

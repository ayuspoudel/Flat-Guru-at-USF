import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BsFillGridFill, BsList } from 'react-icons/bs';
import ProductsGrid from './ProductsGrid';
import ProductsList from './ProductsList';
import PaginationContainer from './PaginationContainer';

const url = 'http://localhost:5000/api/v1/post';

const ProductsContainer = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [layout, setLayout] = useState('grid');
  const [meta, setMeta] = useState({ pagination: { pageCount: 1, page: 1 } });

  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const response = await fetch(`${url}?${searchParams.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.posts);
        
        const totalPosts = data.totalPosts;
        const postsPerPage = data.postsPerPage || 10;
        const pageCount = Math.ceil(totalPosts / postsPerPage);
        const currentPage = parseInt(searchParams.get('page') || '1', 10);
        
        setMeta({
          pagination: {
            pageCount,
            page: currentPage
          }
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  const setActiveStyles = (pattern) => {
    return `text-xl btn btn-circle btn-sm ${
      pattern === layout
        ? 'btn-primary text-primary-content'
        : 'btn-ghost text-based-content'
    }`;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {/* HEADER */}
      <div className='flex justify-between items-center mt-8 border-b border-base-300 pb-5'>
        <h4 className='font-medium text-md'>
          {products.length} house{products.length !== 1 && 's'}
        </h4>
        <div className='flex gap-x-2'>
          <button
            type='button'
            onClick={() => setLayout('grid')}
            className={setActiveStyles('grid')}
          >
            <BsFillGridFill />
          </button>
          <button
            type='button'
            onClick={() => setLayout('list')}
            className={setActiveStyles('list')}
          >
            <BsList />
          </button>
        </div>
      </div>
      {/* PRODUCTS */}
      <div>
        {products.length === 0 ? (
          <h5 className='text-2xl mt-16'>
            Sorry, no products matched your search...
          </h5>
        ) : layout === 'grid' ? (
          <ProductsGrid products={products} />
        ) : (
          <ProductsList products={products} />
        )}
      </div>
      {/* PAGINATION */}
      <PaginationContainer meta={meta} />
    </>
  );
};

export default ProductsContainer;
import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import { formatPrice, customFetch } from '../utils';
import moment from 'moment';
import { addItem } from '../features/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';

const singlePostQuery = (id) => {
  return {
    queryKey: ['singlePost', id],
    queryFn: async () => {
      try {
        const response = await customFetch(`https://rental-service-backend.onrender.com/api/v1/post/${id}`);
        if (response.data && response.data.post) {
          return { post: response.data.post };
        } else {
          throw new Error('Unexpected data structure from API');
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          return { error: 'Post not found' };
        }
        return { error: error.message || 'An unexpected error occurred' };
      }
    },
  };
};

export const loader =
  (queryClient) =>
  async ({ params }) => {
    const data = await queryClient.ensureQueryData(singlePostQuery(params.id));
    return data;
  };

const SinglePost = () => {
  const data = useLoaderData();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userState.user);

  if (data.error) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p>{data.error}</p>
        <button 
          className="btn btn-primary mt-4"
          onClick={() => navigate('/posts')}
        >
          Back to Posts
        </button>
      </div>
    );
  }

  const { post } = data;

  if (!post) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p>Post data is missing or invalid.</p>
        <button 
          className="btn btn-primary mt-4"
          onClick={() => navigate('/posts')}
        >
          Back to Posts
        </button>
      </div>
    );
  }

  const {
    _id,
    title,
    body,
    price,
    image,
    location,
    roomDiscription,
    jobPoster,
    userVerified,
    createdAt,
    profileImage,
  } = post;

  const dollarsAmount = formatPrice(price);

  const cartProduct = {
    cartID: _id || post.id,
    productID: _id || post.id,
    image,
    title,
    price,
    location: location?.type || 'Unknown Location',
    roomDescription: roomDiscription,
    posterName: jobPoster.name || 'Unknown Poster',
    amount: 1,
  };

  const addToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(addItem({ product: cartProduct }));
  };

  const handleProceedToPayment = () => {
    navigate('/payment');
  };

  return (
    <section className="font-bold text-lg">
      <div className='text-md breadcrumbs'>
        <ul>
          <li>
            <Link to='/' className="hover:text-indigo-600">Home</Link>
          </li>
          <li>
            <Link to='/posts' className="hover:text-indigo-600">Posts</Link>
          </li>
        </ul>
      </div>
      
      <div className='mt-10 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16'>
        <div>
          <div className="flex items-center mb-4">
            <img
              src={profileImage} 
              alt={jobPoster.name}
              className="w-16 h-16 rounded-full mr-4 object-cover"
            />
            <div>
              <p className="font-bold text-lg">{jobPoster.name || 'Unknown Poster'}</p>
              <p className="text-sm text-gray-500">
                {createdAt ? moment(createdAt).fromNow() : 'Unknown creation date'}
              </p>
            </div>
          </div>

          <img
            src={image}
            alt={title}
            className='w-full h-96 object-cover rounded-lg shadow-lg mb-4'
          />

          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <i className="fas fa-map-marker-alt text-gray-500"></i>
              <p className='text-gray-500'>{location?.type || 'Unknown Location'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className='capitalize font-bold text-lg'>{title}</h1>
          <p className='text-2xl text-indigo-600 font-bold text-lg'>{dollarsAmount}</p>
          <p>{body}</p>
          
          <div className='mt-6'>
            <h4 className='font-bold text-lg'>
              Room Description
            </h4>
            <ul>
              <li>Number of People: {roomDiscription?.noofPeople || 'Not specified'}</li>
              <li>Number of Rooms: {roomDiscription?.noOfRooms || 'Not specified'}</li>
              <li>Number of Bathrooms: {roomDiscription?.noOfBathrooms || 'Not specified'}</li>
              <li>Fully Furnished: {roomDiscription?.fullyFurnished ? 'Yes' : 'No'}</li>
            </ul>
          </div>

          <div className='text-lg'>
            <h4 className='font-bold text-lg'>
              Location
            </h4>
            <p>
              Type: {location?.type || 'Not specified'}
            </p>
            <p>
              Coordinates: {location?.coordinates?.[0] ?? 'Not specified'}, 
              {location?.coordinates?.[1] ?? 'Not specified'}
            </p>
          </div>

          <div className='mt-6 space-y-1 text-lg'>
            <p>Verified User: {userVerified ? 'Yes' : 'No'}</p>
          </div>

          <div className='mt-10'>
            <button 
              className='px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300'
              onClick={handleProceedToPayment}
            >
              Proceed for payment
            </button>
          </div>
          <div className='mt-10'>
            <button className='btn btn-secondary btn-md' onClick={addToCart}>
              Add to favorites
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SinglePost;

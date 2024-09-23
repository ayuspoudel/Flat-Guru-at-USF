import { Link } from 'react-router-dom';
import { formatPrice } from '../utils';
import PropTypes from 'prop-types';

const ProductsList = ({ products }) => {
  return (
    <div className='mt-12 grid gap-y-8'>
      {products.map((product) => {
        const { _id, title, price, image, jobPoster, roomDiscription } = product;
        const dollarsAmount = formatPrice(price);
        return (
          <Link
            key={_id}
            to={`/products/${_id}`}
            className='p-8 rounded-lg flex flex-col sm:flex-row gap-y-4 flex-wrap bg-base-100 shadow-xl hover:shadow-2xl duration-300 group'
          >
            <img
              src={image}
              alt={title}
              className='h-24 w-24 rounded-lg sm:h-32 sm:w-32 object-cover group-hover:scale-105 transition duration-300'
            />
            <div className='ml-0 sm:ml-16'>
              <h3 className='capitalize font-medium text-lg'>{title}</h3>
              <h4 className='capitalize text-md text-neutral-content'>
                Posted by: {jobPoster.name}
              </h4>
              <p>Rooms: {roomDiscription.noOfRooms}</p>
              <p>Bathrooms: {roomDiscription.noOfBathrooms}</p>
            </div>
            <p className='font-medium ml-0 sm:ml-auto text-lg'>
              {dollarsAmount}
            </p>
          </Link>
        );
      })}
    </div>
  );
};

ProductsList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      jobPoster: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      roomDiscription: PropTypes.shape({
        noOfRooms: PropTypes.number.isRequired,
        noOfBathrooms: PropTypes.number.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default ProductsList;
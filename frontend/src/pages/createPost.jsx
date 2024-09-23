import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import FormInput from '../components/FormInput';
import MapPicker from '../components/MapPicker';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    location: 'undefined',
    roomDiscription: {
      noofPeople: '',
      noOfRooms: '',
      noOfBathrooms: '',
      fullyFurnished: false,
    },
    price: '',
    media: null, // Changed to null initially
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleLocationSelect = (location) => {
    setFormData(prevData => ({
      ...prevData,
      location: {
        type: 'Point',
        coordinates: [parseFloat(location.lng), parseFloat(location.lat)], // Ensure these are numbers
      },
    }));
    setTouched(prev => ({ ...prev, location: true }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      setFormData(prevData => ({
        ...prevData,
        [name]: files[0], // Store the File object directly
      }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prevData => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
        },
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: type === 'number' ? Number(value) : value,
      }));
    }
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  useEffect(() => {
    validateForm();
  }, [formData, touched]);

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['title', 'body', 'price'];
    const requiredRoomFields = ['noofPeople', 'noOfRooms', 'noOfBathrooms'];

    requiredFields.forEach(field => {
      if (!formData[field] && touched[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
      }
    });

    requiredRoomFields.forEach(field => {
      if (!formData.roomDiscription[field] && touched[`roomDiscription.${field}`]) {
        newErrors[`roomDiscription.${field}`] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
      }
    });

    if (touched.media && !formData.media) {
      newErrors.media = 'Image is required.';
    }

    if (!formData.location?.coordinates?.length && touched.location) {
      newErrors.location = 'Location is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (!validateForm()) {
      setSubmitStatus({ type: 'error', message: 'Please fill in all required fields, upload an image, and select a location.' });
      return;
    }

    if (!formData.media || !(formData.media instanceof File)) {
      setSubmitStatus({ type: 'error', message: 'Please select an image file.' });
      return;
    }

    setLoading(true);
    setSubmitStatus(null);

    const submissionData = new FormData();
    
    // Append form data fields
    Object.keys(formData).forEach(key => {
      if (key === 'media') {
        submissionData.append('media', formData[key]); // Append as 'media'
      } else if (key === 'location' && formData[key]) {
        submissionData.append(key, JSON.stringify(formData[key]));
      } else if (key === 'roomDiscription') {
        submissionData.append(key, JSON.stringify(formData[key]));
      } else {
        submissionData.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post('https://rental-service-backend.onrender.com/api/v1/post', submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      console.log('Server response:', response.data);
      setSubmitStatus({ type: 'success', message: 'Post created successfully!' });

      // Show success toast
      toast.success('Post created successfully!');

      // Reset form and touched states
      setFormData({
        title: '',
        body: '',
        location: '',
        roomDiscription: {
          noofPeople: '',
          noOfRooms: '',
          noOfBathrooms: '',
          fullyFurnished: false,
        },
        price: '',
        media: null, // Reset to null
      });
      setTouched({});

      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Error submitting form:', error.response || error);
      setSubmitStatus({ 
        type: 'error', 
        message: error.response?.data?.msg || 'Error creating post. Please try again.' 
      });
      
      // Show error toast
      toast.error(error.response?.data?.msg || 'Error creating post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className='text-4xl font-bold leading-none tracking-tight sm:text-5xl'>Add post</h1>
      {submitStatus && (
        <div className={`p-3 rounded-md ${submitStatus.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-base-200 rounded-md px-8 py-4 grid gap-4">
        <FormInput
          name="title"
          label="Title (required)"
          type="text"
          value={formData.title}
          onChange={handleInputChange}
          error={touched.title && errors.title}
        />
        <FormInput
          name="body"
          label="Body (required)"
          type="textarea"
          value={formData.body}
          onChange={handleInputChange}
          error={touched.body && errors.body}
        />
        <FormInput
          name="price"
          label="Price (required)"
          type="number"
          value={formData.price}
          onChange={handleInputChange}
          error={touched.price && errors.price}
        />
        <div>
          <label>Location (required):</label>
          <MapPicker onSelectLocation={handleLocationSelect} />
          {touched.location && errors.location && <div className="text-red-500 text-sm">{errors.location}</div>}
        </div>
        <FormInput
          name="roomDiscription.noofPeople"
          label="Number of People (required)"
          type="number"
          value={formData.roomDiscription.noofPeople}
          onChange={handleInputChange}
          error={touched['roomDiscription.noofPeople'] && errors['roomDiscription.noofPeople']}
        />
        <FormInput
          name="roomDiscription.noOfRooms"
          label="Number of Rooms (required)"
          type="number"
          value={formData.roomDiscription.noOfRooms}
          onChange={handleInputChange}
          error={touched['roomDiscription.noOfRooms'] && errors['roomDiscription.noOfRooms']}
        />
        <FormInput
          name="roomDiscription.noOfBathrooms"
          label="Number of Bathrooms (required)"
          type="number"
          value={formData.roomDiscription.noOfBathrooms}
          onChange={handleInputChange}
          error={touched['roomDiscription.noOfBathrooms'] && errors['roomDiscription.noOfBathrooms']}
        />
        <div>
          <label>
            <input
              type="checkbox"
              name="roomDiscription.fullyFurnished"
              checked={formData.roomDiscription.fullyFurnished}
              onChange={handleInputChange}
            />
            Fully Furnished
          </label>
        </div>
        <FormInput
          name="media"
          label="Image (required)"
          type="file"
          onChange={handleInputChange}
          error={touched.media && errors.media}
        />
        <button
          type="submit"
          className={`btn btn-primary ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      
      {/* Add ToastContainer to render toasts */}
      <ToastContainer />
    </div>
  );
};

export default CreatePost;

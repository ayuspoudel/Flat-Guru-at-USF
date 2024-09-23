import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Button, InputGroup, VStack } from '@chakra-ui/react';
import { CheckCircleIcon, CloseIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';

function Actions() {
  return (
    <VStack py={8} px={5} spacing={3}>
      <Button className="btn btn-primary">
        View Public Profile
      </Button>
      <InputGroup>
        <Button className="btn btn-primary">
          Profile Not Verified Yet? CLICK NOW TO VERIFY
        </Button>
      </InputGroup>
    </VStack>
  );
}

function Data({ personalDocumentsubmitted }) {
  const list = [
    {
      id: 1,
      name: 'Personal Document Submitted',
      value: personalDocumentsubmitted ? <CheckCircleIcon color="green.500" /> : <CloseIcon color="red.500" />,
      color: personalDocumentsubmitted ? 'text-green-600' : 'text-red-600',
    },
  ];

  return (
    <ul className="space-y-4">
      {list.map((item) => (
        <li key={item.id} className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <span className="font-bold text-lg">{item.name}</span>
          <span className={`${item.color} font-bold`}>{item.value}</span>
        </li>
      ))}
    </ul>
  );
}

Data.propTypes = {
  personalDocumentsubmitted: PropTypes.bool.isRequired,
};

function Profile({ userProfile }) {
  const profileImage = useRef(null);

  const openChooseImage = () => {
    profileImage.current.click();
  };

  const changeProfileImage = (event) => {
    const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
    const selected = event.target.files[0];

    if (selected && ALLOWED_TYPES.includes(selected.type)) {
      let reader = new FileReader();
      reader.onloadend = () => {
        console.log('New profile picture:', reader.result);
      };
      reader.readAsDataURL(selected);
    }
  };

  const {
    name,
    lastName,
    profilePicture,
    isVerified,
    createdAt,
  } = userProfile;

  return (
    <div className="flex flex-col items-center py-5 border-b border-gray-200 dark:border-gray-700 font-bold text-lg">
      <div className="relative mb-4">
        <img
          className="w-24 h-24 rounded-full cursor-pointer"
          src={profilePicture || '/img/default-profile.png'}
          alt={`${name} ${lastName}`}
          onClick={openChooseImage}
        />
        <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer font-bold text-lg">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <input hidden type="file" ref={profileImage} onChange={changeProfileImage} />
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{`${name} ${lastName}`}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isVerified ? 'Verified' : 'Not Verified'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Joined on {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

Profile.propTypes = {
  userProfile: PropTypes.shape({
    name: PropTypes.string,
    lastName: PropTypes.string,
    profilePicture: PropTypes.string,
    isVerified: PropTypes.bool,
    createdAt: PropTypes.string,
  }).isRequired,
};

function Sidebar() {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/profile/singleuser', {
          withCredentials: true, // Ensure cookies are sent with the request
        });
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <aside className="flex-1 mr-0 md:mr-5 mb-5 md:mb-0 bg-transparent rounded-md border border-gray-200 dark:border-gray-700 px-5 py-6 shadow-lg font-bold text-lg">
      <Profile userProfile={userProfile} />
      <Data personalDocumentsubmitted={userProfile.personalDocumentsubmitted} />
      <Actions />
    </aside>
  );
}

export default Sidebar;

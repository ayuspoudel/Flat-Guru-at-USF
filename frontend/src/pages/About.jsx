const About = () => {
  return (
    <>
      <div className='flex flex-wrap gap-2 sm:gap-x-6 items-center justify-center'>
        <h1 className='text-4xl font-bold leading-none tracking-tight sm:text-6xl justify-center'>
        About the Website
        </h1>
        <div className='mt-6 text-lg leading-8 max-w-2xl mx-auto'>
        <h2>About the Website</h2>
    <p>
        The Off-Campus Housing Platform is designed specifically for international students at the University of South Florida (USF) to address the challenges of finding affordable housing. The platform offers a centralized hub for students to post apartment listings, search for compatible roommates, and manage housing swaps efficiently.
    </p>
    <p>
        The website eliminates the reliance on scattered and inefficient communication channels like WhatsApp groups, offering a smarter, more secure alternative. With user-friendly design, real-time updates, and powerful search filters, students can easily find listings that match their preferences for location, budget, and amenities. The platform also features a feedback and rating system to build trust within the community.
    </p>
    <p>
        This project is built using modern web technologies for a seamless, responsive experience across both desktop and mobile devices. The frontend is developed using HTML, CSS, and React.js for a dynamic and interactive user interface, while the backend utilizes Node.js and Express.js to handle server-side operations. MongoDB or MySQL serves as the database to efficiently store and manage housing listings and user information.
    </p>
    <p>
        The platform prioritizes security, ensuring that all users are verified through email and phone number authentication. Communication between users is protected through secure messaging systems, and all data is handled in compliance with modern privacy standards.
    </p>
        </div>
      </div>
      <div className='mt-6 text-lg leading-8 max-w-2xl mx-auto'>
      <p >
      {"Hi, I'm Ayush Poudel, a Computer Science student at the University of South Florida with a passion for building technology solutions that address real-world problems. As an international student myself, I have firsthand experience with the challenges that many students face when trying to find affordable off-campus housing."}
    </p>
    <p>
        I have experience in full-stack web development, cloud computing, and data management. My expertise in frontend technologies like HTML, CSS, JavaScript, and React, along with backend experience in Node.js, Express.js, and database management, has enabled me to design and develop this platform from the ground up.
    </p>
    <p>
        This project is an important step toward simplifying the housing search process for international students, and I am committed to continuously improving the platform by incorporating user feedback, adding new features, and optimizing its performance to better serve the USF community.
    </p>
    <p>
        I look forward to making a meaningful impact through this project and helping students navigate their housing journey more efficiently and securely.
    </p>
    </div>
    </>
  );
};
export default About;

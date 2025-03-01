import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="bg-gray-100 h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-800">Welcome to Our Application!</h1>
      <p className="text-xl text-gray-600 mt-4">Get started by exploring the features we offer.</p>
    </div>
  );
};

export default HomePage;

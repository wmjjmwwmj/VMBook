import React from 'react';
import MyLayout from '../../components/Layout';

const HomeContent: React.FC = () => {
    return (
        <div>
            <h1>Welcome to the Home Page!</h1>
            <p>This is the content for the home page.</p>
        </div>
    );
};


const Home: React.FC = () => {
    return (
        <div>
            <MyLayout content={<HomeContent/>} />
        </div>
    );
};



export default Home;
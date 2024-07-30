import React, {useEffect, useState, useRef } from 'react';
import { Divider, Image, message, Space } from 'antd';
import Title from 'antd/es/typography/Title';
import axios from 'axios';



const SampleUserData = {
    "username": "octocate",
    "profile_picture_url": "https://via.placeholder.com/200",
    "email": "dfafaafaf@sjdaa.com",
    "bio": "This user hasn't written anything about themselves yet.",
    "time_created" : "2021-09-01"
}


const ProfileView: React.FC = () => {
    const user_id = '5136d795-1d5f-436c-853b-a8c898ecd426';
    const [userData, setUserData] = useState(SampleUserData);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        message.loading({ content: 'Loading...', key: 'profile' , duration: 0});
        axios.get('http://192.168.0.34:8000'+'/users/' + user_id)
            .then((response) => {
                const date = new Date(response.data.time_created);
                response.data.time_created = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                response.data.profile_picture_url = response.data.profile_picture_url || SampleUserData.profile_picture_url;
                response.data.bio = response.data.bio || SampleUserData.bio;
                setUserData(response.data);
                message.destroy('profile');
                })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <Space direction='vertical' align='center'>
            <Image src={userData.profile_picture_url} alt="Profile picture" style={{ borderRadius: '50%', width: '90%' }} preview={false} />
            <Title level={1}>{userData.username}</Title>
            <Divider plain>{userData.bio}</Divider>
            <span>{userData.email}</span>
            <span>Joined on {userData.time_created}</span>
        </Space>
    );
}

export default ProfileView;

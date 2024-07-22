import React from 'react';
import { Divider, Image, Space } from 'antd';
import Title from 'antd/es/typography/Title';

const userData = {
    "username": "octocate",
    "profile_picture": "https://avatars.githubusercontent.com/u/1?v=4",
    "email": "dfafaafaf@sjdaa.com"
}


const ProfileView: React.FC = () => {
    return (
        <Space direction='vertical' align='center'>
            <Image src={userData.profile_picture} alt="Profile picture" style={{ borderRadius: '50%', width: '90%' }} preview={false} />
            <Title level={1}>{userData.username}</Title>
            <Divider plain>Text</Divider>
            <span>{userData.email}</span>
            <span>Joined on 2021-09-01</span>
        </Space>
    );
}

export default ProfileView;

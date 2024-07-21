import React from 'react';
import MyLayout from '../components/Layout';

import { CheckCard } from '@ant-design/pro-components';
import { ConfigProvider, Flex } from 'antd';

const UserPhotoGalleryContent: React.FC = () => {
    return (
        <div>
            <Flex gap={24} vertical>
                <CheckCard.Group
                    multiple
                    onChange={(value) => {
                        console.log('value', value);
                    }}
                    defaultValue={['A']}
                >
                    <CheckCard
                        title="Card A"
                        description="选择一个由流程编排提供的典型用户案例，可以从中学习到流程编排很多设计理念"
                        value="A"
                    />
                    <CheckCard
                        title="Card B"
                        description="选择一个由流程编排提供的典型用户案例，可以从中学习到流程编排很多设计理念"
                        value="B"
                    />
                </CheckCard.Group>
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: 'red',
                        },
                    }}
                >
                    <CheckCard.Group
                        multiple
                        onChange={(value) => {
                            console.log('value', value);
                        }}
                        defaultValue={['A']}
                    >
                        <CheckCard
                            title="Card A"
                            description="选择一个由流程编排提供的典型用户案例，可以从中学习到流程编排很多设计理念"
                            value="A"
                        />
                        <CheckCard
                            title="Card B"
                            description="选择一个由流程编排提供的典型用户案例，可以从中学习到流程编排很多设计理念"
                            value="B"
                        />
                    </CheckCard.Group>
                    <Image
                        width={200}
                        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    />

                </ConfigProvider>
                            console.log('value', value);
                        }}
                        defaultValue={['A']}
                    >
                        <CheckCard
                            title="Card A"
                            description="选择一个由流程编排提供的典型用户案例，可以从中学习到流程编排很多设计理念"
                            value="A"
                        />
                        <CheckCard
                            title="Card B"
                            description="选择一个由流程编排提供的典型用户案例，可以从中学习到流程编排很多设计理念"
                            value="B"
                        />
                    </CheckCard.Group>
                </ConfigProvider>
            </Flex>
        </div>
    );
};



const UserPhotoGallery: React.FC = () => {
    return (
        <div>
            <MyLayout content={<UserPhotoGalleryContent/>} />
        </div>
    );
};



export default UserPhotoGallery;
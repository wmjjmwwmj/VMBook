import React, { useState } from 'react';
import MyLayout from '../components/Layout';

import { CheckCard } from '@ant-design/pro-components';
import { ConfigProvider, Flex, Image, Card, List, Avatar, Radio, Space,  Tooltip ,Divider } from 'antd';

type PaginationPosition = 'top' | 'bottom' | 'both';

type PaginationAlign = 'start' | 'center' | 'end';

const UserPhotoGalleryContent: React.FC = () => {
    const data = [
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '121315', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
    ];

    const [position, setPosition] = useState<PaginationPosition>('bottom');
    const [align, setAlign] = useState<PaginationAlign>('center');
    return (
        <Space>
            <List
                grid={{
                    gutter: 2, // space between columns
                    xs: 1, // number of columns on extra small screens (width < 576px)
                    sm: 2,
                    md: 4,
                    lg: 4,
                    xl: 6,
                    xxl: 8,
                    }}
                size="large"
                pagination={{
                    onChange: (page) => {
                        console.log(page);
                    },
                    pageSize: 20,
                    }}
                dataSource={data}
                renderItem={(item) => (
                    <List.Item>
                        <CheckCard
                            title={item.title}
                            description={null}
                            // description = {<Divider />}
                            value={item.title}
                            style={{ width: '190px', }}
                            

                        >
                                <Tooltip title="prompt text">
                                <Image
                                width='100%'
                                src={item.imageSrc}
                            >

                            </Image>
                                </Tooltip>
                            

                        </CheckCard>
                    </List.Item>
                )}
            />
        </Space>
    );
};



const UserPhotoGallery: React.FC = () => {
    return (
        <MyLayout>
            <UserPhotoGalleryContent />
        </MyLayout>
    );
};



export default UserPhotoGallery;
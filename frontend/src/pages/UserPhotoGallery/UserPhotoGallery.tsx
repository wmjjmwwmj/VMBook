import React, { useState } from 'react'; // 加花括号是命名导入 export const useState = ...;
import MyLayout from '../../components/Layout';

import { CheckCard } from '@ant-design/pro-components';
import { DownloadOutlined,DeleteOutlined,FileAddOutlined,AntDesignOutlined,SendOutlined } from '@ant-design/icons';
import { ConfigProvider, Flex, Image, Card, List, Avatar, Radio, Space,  Tooltip ,Divider,Button } from 'antd';
import SearchBar   from '../../components/SearchBar/SearchBar';
import axios from 'axios';

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
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
        { title: 'Time', description: '', imageSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
    ];

    
    return (
        <Space direction="vertical" size="large" style={{ width: '100%', justifyContent: 'center' }}>
            
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
                    pageSize: 16,
                    // position: 'top'
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

const GalleryButtons: React.FC = () => {
    const [loadings, setLoadings] = useState<boolean[]>([]);

    const enterLoading = (index: number) => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = true;
        return newLoadings;
      });
  
      setTimeout(() => {
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });
      }, 6000);
    };
    const handleClick = () => {
      // Make API call to server here
      // Example:
      fetch('/api/endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle response from server here
          console.log(data);
        })
        .catch((error) => {
          // Handle error here
          console.error(error);
        });
    };

    const deletePhotos = () => { // delete photos
        
    };


    return (
        // <Space direction="vertical" size="large" style={{ width: '100%', justifyContent: 'center' }}>
        <Space align="center" style={{ width: '100%', justifyContent: 'left' }}>
     
        <Button type="primary" shape="round" icon={<DeleteOutlined />} size={'middle'} onClick={handleClick}>
          Delete
        </Button>
        <Button type="primary" shape="round" icon={<FileAddOutlined />} size={'middle'} onClick={handleClick}>
          Add
        </Button>
        <Button type="primary" shape="round" icon={<DownloadOutlined />} size={'middle'} onClick={handleClick}>
          Download
        </Button>

        <Button type="primary" shape="round" icon={<SendOutlined /> } size={'middle'} loading={loadings[0]} onClick={() => enterLoading(0)}>
            Generate
        </Button>
        </Space>
    );
}

const UserPhotoGallery: React.FC = () => {
    return (
        <MyLayout>
            <Space direction="vertical" size="large">
            <SearchBar />
            <GalleryButtons />
                <UserPhotoGalleryContent />
                
            </Space>
        </MyLayout>
    );
};



export default UserPhotoGallery;
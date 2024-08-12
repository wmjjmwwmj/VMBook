import React from 'react';
import { List, Image, Tooltip, Skeleton, Divider } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PhotoResponse } from '../../utils/photos';
import { CheckCard } from '@ant-design/pro-components';


interface UserPhotoGalleryContentProps {
    loading: boolean;
    items: PhotoResponse[];
    onLoadMore: () => void;
    hasMore: boolean;
    handleCheck: (checked: boolean, photo_id: string) => void;
}
const UserPhotoGalleryContent: React.FC<UserPhotoGalleryContentProps> = React.memo(
    ({ loading, items, onLoadMore, hasMore, handleCheck }) => {
        return (
            <InfiniteScroll
                dataLength={items.length}
                next={onLoadMore}
                hasMore={hasMore}
                loader={<Skeleton paragraph={{ rows: 1 }} active />}
                endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
            >
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
                    size='large'
                    dataSource={items}
                    renderItem={(item) => {
                        return (
                            <List.Item>
                                <CheckCard
                                    title={item.time_created}
                                    description={null}
                                    value={item.photo_id}
                                    style={{
                                        width: '190px',
                                        height: 'auto',
                                        display: 'flex', // 使用flexbox布局
                                        flexDirection: 'column', // 让内容垂直排列
                                        alignItems: 'center', // 内容水平居中
                                        justifyContent: 'center', // 内容垂直居中
                                        textAlign: 'center' // 确保文本内容居中
                                    }}
                                    onChange={(checked) => {
                                        handleCheck(checked, item.photo_id);
                                    }}
                                >
                                    <Tooltip title={item.description}>
                                        <Image
                                            style={{
                                                width: '100%',
                                                height: '20vh',
                                                objectFit: 'cover',
                                                display: 'block', // 确保图片块级显示
                                                margin: '0 auto' // 图片水平居中
                                            }}
                                            src={`http://${item.url}`}
                                        />
                                    </Tooltip>
                                </CheckCard>
                            </List.Item>
                        )
                    }}
                >
                </List>

            </InfiniteScroll>
        )
    }

)


export default UserPhotoGalleryContent;
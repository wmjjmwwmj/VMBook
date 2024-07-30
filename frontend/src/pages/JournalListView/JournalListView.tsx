import React, { useEffect } from 'react';
import MyLayout from '../../components/Layout';
import SearchBar, { SearchFilters } from '../../components/SearchBar/SearchBar';
import { List, Space, Tag, Skeleton, Divider, FloatButton, message } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import getUserJournal, {JournalEntry, GetUserJournalOptions} from '../../utils/journal';

const data = Array.from({ length: 23 }).map((_, i) => ({
    href: 'https://ant.design',
    title: `ant design part ${i}`,
    datetime: '2021-09-01',
    tags: ['nice', 'developer'],
    description:
        'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
}));


const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);


const [filters, setFilters] = React.useState<SearchFilters>({
    starred: false,
    device: undefined,
    fromDate: null,
    toDate: null,
    content: '',
});

const JournalListContent: React.FC = () => {

    const [loading, setLoading] = React.useState(false);
    const [journalData, setJournalData] = React.useState<JournalEntry[]>([]);


    const loadMoreData = async () => {
        if (loading) {
            return;
          }
        setLoading(true);
        message.success('Load more data ...');
        const data = await getUserJournal( 'userid' ,filters);
        setJournalData([...journalData, ...data]);
        setLoading(false);
    };

    useEffect(() => {
        loadMoreData();
      }, []);

    return (
        <div>
            <InfiniteScroll dataLength={journalData.length}
                next={loadMoreData}
                hasMore={true}
                loader={<Skeleton paragraph={{ rows: 1 }} active />}
                endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                >
                <List
                    itemLayout="vertical"
                    size="large"
                    dataSource={journalData}
                    renderItem={(item) => (
                        <List.Item
                            key={item.title}
                            actions={[
                                <IconText icon={StarOutlined} text={item.datetime} key="list-vertical-star-o" />,
                                item.tags && item.tags.map((tag, index) => (
                                    <Tag color="blue" key={index}>
                                        {tag}
                                    </Tag>
                                )),
                            ]}
                            extra={
                                <div style={{ overflow: 'hidden' }}>
                                    <img
                                        width="200vw"
                                        alt="logo"
                                        src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                    />
                                </div>
                            }
                        >
                            <List.Item.Meta
                                title={<a href={item.href}>{item.title}</a>}
                                description={item.description}
                            />
                            {item.content}
                        </List.Item>
                    )}
                />
            </InfiniteScroll>
        </div>
    );
};


const handleFilterChange = (filters: SearchFilters) => {
    console.log('Filters changed:', filters);
    setFilters(filters);
    // Perform actions based on updated filters
};


const JournalListView: React.FC = () => {
    return (
        <MyLayout>
            <SearchBar onFilterChange={handleFilterChange} />
            <JournalListContent />
            <FloatButton.BackTop  style={{ right: 94 }}/>
        </MyLayout>
    );
};



export default JournalListView;
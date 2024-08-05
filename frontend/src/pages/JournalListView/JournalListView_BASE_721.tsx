import React, { useEffect, useCallback, useState, useRef } from 'react';
import MyLayout from '../../components/Layout';
import SearchBar, { SearchFilters } from '../../components/SearchBar/SearchBar';
import { List, Space, Tag, Skeleton, Divider, FloatButton, message } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import getUserJournal, { JournalResponse, GetUserJournalOptions } from '../../utils/journals';

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

interface JournalListContentProps {
    loading: boolean;
    items: JournalResponse[];
    onLoadMore: () => void;
    hasMore: boolean;
}

const JournalListContent: React.FC<JournalListContentProps> = React.memo(
    ({ loading, items, onLoadMore, hasMore }) => {
        return (
            <InfiniteScroll
                dataLength={items.length}
                next={onLoadMore}
                hasMore={hasMore}
                loader={<Skeleton paragraph={{ rows: 1 }} active />}
                endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
            >
                <List
                    itemLayout="vertical"
                    size="large"
                    dataSource={items}
                    renderItem={(item) => (
                        <List.Item
                            key={item.id}
                            actions={[
                                <IconText icon={StarOutlined} text={item.datetime} key="list-vertical-star-o" />,
                                ...(item.tags?.map((tag, index) => (
                                    <Tag color="blue" key={index}>
                                        {tag}
                                    </Tag>
                                )) ?? []),
                            ]}
                            extra={
                                <div style={{ overflow: 'hidden' }}>
                                    <img
                                        width={200}
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
        );
    }
);


// FIXME: this is working but got some error: Unchecked runtime.lastError: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received
const JournalListView: React.FC = () => {
    const [filter, setFilter] = useState<SearchFilters>({
        starred: false,
        device: undefined,
        fromDate: null,
        toDate: null,
        contains: '',
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [journalData, setJournalData] = useState<JournalResponse[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const isInitialMount = useRef(true);
    const userId = '5136d795-1d5f-436c-853b-a8c898ecd426';
    const limit = 10;

    const fetchJournals = useCallback(async (isInitialFetch: boolean = false) => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        if (loading) return;
        setLoading(true);
        try {
            const offset = isInitialFetch ? 0 : journalData.length;
            const data = await getUserJournal(userId, filter, offset, limit);
            setJournalData(prevData => isInitialFetch ? data : [...prevData, ...data]);
            setHasMore(data.length === limit);
        } catch (error) {
            console.error('Error fetching user journal:', error);
            message.error('Failed to fetch journals. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [filter, journalData.length, loading]);

    useEffect(() => {
        fetchJournals(true);
    }, [filter]);

    const handleFilterChange = (newFilter: SearchFilters) => {
        setFilter(newFilter);
    };

    const handleLoadMore = () => {
        fetchJournals();
    };

    return (
        <MyLayout>
            <SearchBar onFilterChange={handleFilterChange} />
            <JournalListContent
                loading={loading}
                items={journalData}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
            />
            <FloatButton.BackTop style={{ right: 94 }} />
        </MyLayout>
    );
};

export default JournalListView;
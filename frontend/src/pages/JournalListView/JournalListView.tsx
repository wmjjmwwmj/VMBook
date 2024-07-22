import React from 'react';
import MyLayout from '../../components/Layout';
import { List, Space, Input, DatePicker, Button, Radio, Select, Tag } from 'antd';
import { StarOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const SearchBar = () => (
    <Space>
        <Radio.Group buttonStyle='solid'>
            <Radio.Button value="all">All</Radio.Button>
            <Radio.Button value="starred">Starred</Radio.Button>
        </Radio.Group>
        <RangePicker showTime />
        <Select placeholder='Device'>
            <Select.Option value="laptop">Laptop</Select.Option>
            <Select.Option value="tablet">Tablet</Select.Option>
            <Select.Option value="phone">Phone</Select.Option>
        </Select>
        <Input placeholder="Search Content..." />
        <Button type="primary">Filter</Button>
    </Space>
);

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



const JournalListContent: React.FC = () => (
    <List
        itemLayout="vertical"
        size="large"
        pagination={{
            onChange: (page) => {
                console.log(page);
            },
            pageSize: 3,
            position: 'bottom',
            align: 'center'
        }}
        dataSource={data}
        renderItem={(item) => (
            <List.Item
                key={item.title}
                actions={[
                    <IconText icon={StarOutlined} text={item.datetime} key="list-vertical-star-o" />,
                    item.tags.map((tag, index) => (
                        <Tag color="blue" key={index}>
                            {tag}
                        </Tag>
                    )),
                ]}
                extra={
                    <div style={{ overflow: 'hidden'}}>
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
);




const JournalListView: React.FC = () => {
    return (
        <MyLayout>
            <SearchBar />
            <JournalListContent />
        </MyLayout>
    );
};



export default JournalListView;
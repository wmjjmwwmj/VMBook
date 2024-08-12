import React, { useEffect, useRef } from 'react';
import { List, Card, message } from 'antd';
import axios from 'axios';

const SampleEntries = [
    {
        "title": "Entry 1",
        "content": "This is the content of entry 1",
        "link": "/entry/1",
        "cover": "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        "datetime": "2021-09-01",
        "tags": ["tag1", "tag2"]
    },
    {
        "title": "Entry 2",
        "content": "This is the content of entry 2",
        "link": "/entry/2",
        "cover": "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        "datetime": "2021-09-02",
        "tags": ["tag3", "tag4"]
    },
    {
        "title": "Entry 3",
        "content": "This is the content of entry 3",
        "link": "/entry/3",
        "cover": "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        "datetime": "2021-09-03",
        "tags": ["tag5", "tag6"]
    },
    {
        "title": "Entry 4",
        "content": "This is the content of entry 4",
        "link": "/entry/4",
        "cover": "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
        "datetime": "2021-09-04",
        "tags": ["tag7", "tag8"]
    }
];

const RecentEntriesView: React.FC = () => {
    const [entries, setEntries] = React.useState(SampleEntries);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return; 
        }
        message.loading({ content: 'Loading recent entries...', key: 'entries', duration: 0 });
        axios.get(window.backend_url + '/users/' + window.user_id + '/journals?limit=4&sortby=time_modified&order=desc')
            .then((response) => {
                console.log(response.data);
                setEntries(response.data);
                message.destroy('entries');
            })
            .catch((error) => {
                console.log(error);
            });
        // fetch entries from backend
    }, []);
    return (
        <List
            grid={{ gutter: 16, column: 4}}
            dataSource={entries}
            renderItem={(Item) => (
                <List.Item>
                    <a href={Item.link}>
                    <Card
                        hoverable
                        cover={<img src={Item.cover ||"https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" } width="100%" alt={Item.link}/>}
                    >
                        <Card.Meta title={Item.title} description={Item.datetime} />
                    </Card>
                    </a>
                </List.Item>
            )}
        />
    );

}

export default RecentEntriesView;
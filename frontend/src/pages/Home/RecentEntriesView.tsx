import React, { useEffect, useRef } from 'react';
import { List, Card, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

interface Entry {
    journal_id: string;
    time_modified: string;
    description?: string;
    title?: string;
    cover?: string | null;
    tags?: string[];
    url? : string;
}

function findFirstUrl(markdown: string): string | null {
    // 正则表达式匹配URL
    const urlPattern = /http?:\/\/[^\s)]+/g;
    const match = urlPattern.exec(markdown);
    
    // 如果找到了匹配项，返回第一个URL，否则返回null
    return match ? match[0] : null;
  }

const RecentEntriesView: React.FC = () => {
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    const [entries, setEntries] = React.useState<Entry[]> ();
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return; 
        }
        message.loading({ content: 'Loading recent entries...', key: 'entries', duration: 0 });
        axios.get('http://'+ '192.168.0.34' + ':8000' + '/users/' + '5136d795-1d5f-436c-853b-a8c898ecd426' + '/journals?limit=4&sortby=time_modified&order=desc')
            .then((response) => {
                console.log(response.data);
                for (let entry of response.data) {
                    const url = findFirstUrl(entry.description ? entry.description : '');
                    if (url) {
                      entry.cover = url;
                    }
                  }
                  console.log("response", response.data);

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
                    <a href={`http://${window.ip_and_port}/journalview?journalId=${Item.journal_id}`}>
                    <Card
                        hoverable
                        cover={<img src={Item.cover ||"https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" } width="100%" alt={Item.url}/>}
                    >
                        <Card.Meta title={Item.title} description={dayjs(Item.time_modified).format(dateFormat)} />
                    </Card>
                    </a>
                </List.Item>
            )}
        />
    );

}

export default RecentEntriesView;
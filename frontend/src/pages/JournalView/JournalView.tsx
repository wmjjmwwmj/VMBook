
import React, { useState } from 'react'; // 加花括号是命名导入 export const useState = ...;
import MyLayout from '../../components/Layout';

import { CheckCard } from '@ant-design/pro-components';
import { DownloadOutlined,DeleteOutlined,FileAddOutlined,AntDesignOutlined,SendOutlined } from '@ant-design/icons';
import { ConfigProvider, Flex, Image, Card, List, Avatar, Radio, Space,  Tooltip ,Divider,Button,Typography } from 'antd';
import SearchBar   from '../../components/SearchBar/SearchBar';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

import './JournalView.css';

// const { Title, Paragraph, Text, Link } = Typography;
// const markdown = `
// # Complete Example

// This is a **complete** example of using \`react-markdown\`.

// ## Features

// - Custom link rendering
// - GitHub Flavored Markdown

// \`\`\`javascript
// console.log('Hello, world!');
// \`\`\`

// ![React Logo](https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg)

// - [ ] Task list item
// - [x] Completed task list item
// `;


const JournalViewContent: React.FC = () => {
    const [markdown, setMarkdown] = useState<string>(`
# GitHub Flavored Markdown
        
- [ ] Task list item
- [x] Completed task list item
    `); // There must be no type/blank at the beginning of lines

    const [isEditing, setIsEditing] = useState(true);
        
    const handleEditorChange = ({ text }: { text: string }) => {
        setMarkdown(text);
        // Send the markdown to the server
        
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div className="app-container">
            
            {isEditing ? (

            <MarkdownEditor
                value={markdown}
                style={{ height: '70vh', width: '100%' }}
                renderHTML={text => <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>}
                onChange={handleEditorChange}
            />

            ) : (
                <div className="markdown-preview">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {markdown}
                    </ReactMarkdown>
                </div>
            )}
            <div className="button-container">
        <Button onClick={toggleEditMode} style={{ marginBottom: '20px' }}>
          {isEditing ? '保存' : '编辑'}
        </Button>
        <Button style={{ marginBottom: '20px', marginLeft: '10px' }}>
          分享
        </Button>
      </div>
        </div>
    );
}


const JournalView: React.FC = () => {
    return (
        <MyLayout>

            <JournalViewContent />

        </MyLayout>
    );
};

export default JournalView;
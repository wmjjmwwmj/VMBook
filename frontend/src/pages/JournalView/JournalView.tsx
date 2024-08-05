import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import MyLayout from '../../components/Layout';
import { Button, message } from 'antd';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import handleJournalDetails, {handleJournalUpdate} from '../../utils/getJournal';
import { BrowserRouter as Router, Route, useLocation } from 'react-router-dom';

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


interface JournalViewContentProps {
  journalContent: string | undefined;
  handleJournalChange?: (journalContent: string | undefined) => void;
}

const JournalViewContent: React.FC<JournalViewContentProps> = ({ journalContent, handleJournalChange }) => {
    const [markdown, setMarkdown] = useState<string| undefined>(journalContent); // There must be no type/blank at the beginning of lines

    const [isEditing, setIsEditing] = useState(true);
        
    const handleEditorChange = ({ text }: { text: string }) => {
        setMarkdown(text);
        // Send the markdown to the server
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
        if (isEditing) {
            handleJournalChange && handleJournalChange(markdown);
        }
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
            {isEditing ? 'Save' : 'Edit'}
        </Button>
        <Button style={{ marginBottom: '20px', marginLeft: '10px' }}>
            分享
        </Button>
        </div>
        </div>
    );
}


const JournalView: React.FC = () => {
    // Acquire the journal id from the URL
    // Fetch the journal content from the server

    const location = useLocation();

    // 使用useLocation钩子获取当前URL
    const params = new URLSearchParams(location.search);
    // 读取fromDate和toDate参数
    const journalId = params.get('journalId') || '';

    const [journalContent, setJournalContent] = useState<string | undefined>('');
    const isInitialMount = useRef(true);

    useEffect(() => {
        if(isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        console.log('Fetching journal content for journal id:', journalId);
        handleJournalDetails({ journalId }).then((data) => {

            setJournalContent(data);
        });
    }, []);

    const handleJournalChange = (updateContent: string | undefined) => {
        console.log('Updating journal content for journal id:', journalId);
        setJournalContent(updateContent);
        handleJournalUpdate({ journalId, journalContent: updateContent }).then((isSuccess) => {
            if (isSuccess) {
                message.success('Journal updated successfully');
            } else {
                message.error('Journal update failed');
        }
    });
    }

    return (
        <MyLayout>
            <JournalViewContent journalContent={journalContent} handleJournalChange={handleJournalChange}/>
        </MyLayout>
    );
};

export default JournalView;
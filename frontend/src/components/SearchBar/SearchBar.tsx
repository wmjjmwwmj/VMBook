import React, { useEffect, useState } from 'react';
import { Space, Input, DatePicker, Button, Radio, Select } from 'antd';

const { RangePicker } = DatePicker;

interface SearchBarProps {
    onFilterChange?: (filters: SearchFilters) => void;
}

interface SearchFilters {
    starred: boolean;
    device: string | undefined;
    fromDate: string | null;
    toDate: string | null;
    content: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onFilterChange }) => {
    const [starred, setStarred] = useState<boolean>(false);
    const [device, setDevice] = useState<string | undefined>();
    const [fromDate, setFromDate] = useState<string | null>(null);
    const [toDate, setToDate] = useState<string | null>(null);
    const [content, setContent] = useState<string>('');

    const handleStarredChange = (e: any) => { 
        const isChecked = e.target.value === 'starred';
        setStarred(isChecked);
        onFilterChange?.({ starred: isChecked, device, fromDate, toDate, content });
    };

    const handleDatePickerChange = (dates: any, dateStrings: [string, string]) => {
        setFromDate(dateStrings[0]);
        setToDate(dateStrings[1]);
        onFilterChange?.({ starred, device, fromDate: dateStrings[0], toDate: dateStrings[1], content });
    };

    const handleDeviceChange = (value: string) => {
        setDevice(value);
        onFilterChange?.({ starred, device: value, fromDate, toDate, content });
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
    };

    const handleFilterButtonClick = () => {
        onFilterChange?.({ starred, device, fromDate, toDate, content });
    };

    return (
        <Space>
            <Radio.Group buttonStyle='solid' onChange={handleStarredChange} value={starred ? 'starred' : 'all'}>
                <Radio.Button value="all">All</Radio.Button>
                <Radio.Button value="starred">Starred</Radio.Button>
            </Radio.Group>
            <RangePicker onChange={handleDatePickerChange} />
            {/* TODO: dynamically get user device list */}
            <Select placeholder='Device' onChange={handleDeviceChange} value={device}>
                <Select.Option value="laptop">Laptop</Select.Option>
                <Select.Option value="tablet">Tablet</Select.Option>
                <Select.Option value="phone">Phone</Select.Option>
            </Select>
            <Input placeholder="Search Content..." onChange={handleContentChange} value={content} />
            <Button type="primary" onClick={handleFilterButtonClick}>Filter</Button>
        </Space>
    );
};

export default SearchBar;
export type { SearchFilters };
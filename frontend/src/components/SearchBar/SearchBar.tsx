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
    contains: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onFilterChange }) => {
    const [starred, setStarred] = useState<boolean>(false);
    const [device, setDevice] = useState<string | undefined>();
    const [fromDate, setFromDate] = useState<string | null>(null);
    const [toDate, setToDate] = useState<string | null>(null);
    const [contains, setContains] = useState<string>('');

    const handleStarredChange = (e: any) => { 
        const isChecked = e.target.value === 'starred';
        setStarred(isChecked);
        onFilterChange?.({ starred: isChecked, device, fromDate, toDate, contains });
    };

    const handleDatePickerChange = (dates: any, dateStrings: [string, string]) => {
        setFromDate(dateStrings[0]);
        setToDate(dateStrings[1]);
        onFilterChange?.({ starred, device, fromDate: dateStrings[0], toDate: dateStrings[1], contains });
    };

    const handleDeviceChange = (value: string) => {
        setDevice(value);
        onFilterChange?.({ starred, device: value, fromDate, toDate, contains });
    };

    const handleContainsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContains(e.target.value);
    };

    const handleFilterButtonClick = () => {
        onFilterChange?.({ starred, device, fromDate, toDate, contains });
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
            <Input placeholder="Search Contains..." onChange={handleContainsChange} value={contains} />
            <Button type="primary" onClick={handleFilterButtonClick}>Filter</Button>
        </Space>
    );
};

export default SearchBar;
export type { SearchFilters };
import React, { useState } from 'react';
import { Space, Input, DatePicker, Button, Radio, Select } from 'antd';
// import { SearchFilters } from '../../utils/getFilterPhotos';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;

interface SearchBarProps {
    onFilterChange?: (filters: SearchFilters) => void;
    onFilterSet?: (filters: SearchFilters) => void;
    initFilters?: SearchFilters;
}

interface SearchFilters {
    starred?: boolean;
    device?: string | null;
    fromDate?: string | null;
    toDate?: string | null ;
    contains?: string | null;
}

const dateFormat = 'YYYY-MM-DD';


// TODO Add the setState function for initFilters, or use context, so that the SearchBar params can be controlled by the parent component, won't always exec twice by any trigger. 
const SearchBar: React.FC<SearchBarProps> = ({initFilters, onFilterChange, onFilterSet}) => {
    const [contains, setContains] = useState<string>(initFilters?.contains || '');

    const handleStarredChange = (e: any) => { 
        const isChecked = e.target.value === 'starred' ? true : false;
        
        onFilterChange?.({ 
            starred: isChecked, 
            device: initFilters?.device, 
            fromDate: initFilters?.fromDate, 
            toDate: initFilters?.toDate, 
            contains: initFilters?.contains });
    };

    const handleDatePickerChange = (dates: any, dateStrings: [string, string]) => {
        onFilterChange?.({ 
            starred: initFilters?.starred, 
            device: initFilters?.device, 
            fromDate: dateStrings[0], 
            toDate: dateStrings[1], 
            contains: initFilters?.contains });
    };

    const handleDeviceChange = (value: string) => {
        onFilterChange?.({ 
            starred: initFilters?.starred, 
            device: value, 
            fromDate: initFilters?.fromDate, 
            toDate: initFilters?.toDate, 
            contains: initFilters?.contains });
    };

    const handleContainsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContains(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleFilterButtonClick();
        }
    };

    const handleFilterButtonClick = () => {
        const updatedFilters = { 
            starred: initFilters?.starred, 
            device: initFilters?.device, 
            fromDate: initFilters?.fromDate, 
            toDate: initFilters?.toDate, 
            contains: contains 
          };
          
          onFilterChange?.(updatedFilters);
          
          if (onFilterSet) {
            onFilterSet(updatedFilters);
          }
    }; 
    const fromDateInit = initFilters?.fromDate ? initFilters?.fromDate : "2024-01-01";
    const toDateInit = initFilters?.toDate ? initFilters?.toDate : "2024-12-31";


    return (
        <Space>
            <Radio.Group buttonStyle='solid' onChange={handleStarredChange} value={initFilters?.starred ? 'starred' : 'all'}>
                <Radio.Button value="all">All</Radio.Button>
                <Radio.Button value="starred">Starred</Radio.Button>
            </Radio.Group>
            <RangePicker
                defaultValue={[dayjs(fromDateInit, dateFormat), dayjs(toDateInit, dateFormat)]}
                onChange={handleDatePickerChange}
            />
            <Select placeholder='Device' onChange={handleDeviceChange} value={initFilters?.device}>
                <Select.Option value="laptop">Laptop</Select.Option>
                <Select.Option value="tablet">Tablet</Select.Option>
                <Select.Option value="phone">Phone</Select.Option>
                <Select.Option value="">All</Select.Option>
            </Select>
            <Input placeholder="Search Content..." onChange={handleContainsChange} value={contains || ''} onKeyDown={handleKeyDown}/>
            <Button type="primary" onClick={handleFilterButtonClick}>Filter</Button>
        </Space>
    );
};

export default SearchBar;
export type { SearchFilters };
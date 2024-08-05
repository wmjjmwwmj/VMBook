import React, { useState, useEffect, useRef } from 'react'; // 加花括号是命名导入 export const useState = ...;
import MyLayout from '../../components/Layout';
import { CheckCard } from '@ant-design/pro-components';
import { DownloadOutlined, DeleteOutlined, FileAddOutlined, SendOutlined, EditOutlined } from '@ant-design/icons';
import { Image, List, Space,  Tooltip ,Divider,Button , Skeleton, FloatButton, message} from 'antd';
import SearchBar   from '../../components/SearchBar/SearchBar';
import InfiniteScroll from 'react-infinite-scroll-component';
import { BrowserRouter as Router, Route, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import handleFilterPhotos, {QueryType, SearchFilters, PhotoType} from '../../utils/getFilterPhotos';
// import handleGenerationJournal from '../../utils/generateJournal';

const user_id = window.user_id;

interface LinkComponentProps {
  editEnable: boolean;
  toggleEditEnable: () => void;
  query: QueryType;
  queryEditor: (newQueryNum: number) => void;
}

// ButtonComponent 的 props 类型
interface ButtonComponentProps {
  editEnable: boolean;
  selectedPhotos?: string[];
  setSelectedPhotos?: (selectedPhotos: string[]) => void;
}

const UserPhotoGalleryContent: React.FC<LinkComponentProps> = ({ editEnable, toggleEditEnable, query, queryEditor }) => {
    
    const [hasMorePhoto, setHasMorePhoto] = useState(true);
    const data_add = [
        {
          photo_id: '1',
        time_created: '2021-09-01',
        url: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
        }
      ];

    const [loading, setLoading] = useState(false);
    const [timeCreated, setTimeCreated] = useState<Date | null>(null);
    
    const [data, setData] = useState<PhotoType[]>([]);
    const [checkedNum, setCheckedNum] = useState<number>(0); // 新的变量，用于存储整数值

    const increment = () => {
      setCheckedNum(prevCheckNum => prevCheckNum + 1);
    };
  
    const decrement = () => {
      setCheckedNum(prevCheckNum => prevCheckNum - 1);
    };

    const loadMoreData = () => {
      if (loading) {
        return;
      }
      setLoading(true);

      handleFilterPhotos({ query: query }).then((photos: PhotoType[] | undefined) => {
        console.log('Fetched photos:', photos);
        if (photos?.length) {
          console.log('Fetched photos:', photos);
          setData([...data, ...photos]);
          queryEditor(photos.length);
          message.success(`Load more data!`);
        } else {
          console.log('No more photos to fetch');
          setHasMorePhoto(false);
          console.log('hasMorePhoto', hasMorePhoto);
          message.success(`It is all, nothing more 🤐`);
        }
      });
      setLoading(false);
    };
    const isInitialMount = useRef(true);
    useEffect(() => {
      if(isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }
      loadMoreData();
    }, []);
    
    

    return (
        <Space direction="vertical" size="large" style={{ width: '100%', justifyContent: 'center' }}>
          <InfiniteScroll
        dataLength={data.length}
        next={loadMoreData}
        hasMore={hasMorePhoto}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
            <List
                grid={{
                    gutter: 2, // space between columns
                    xs: 1, // number of columns on extra small screens (width < 576px)
                    sm: 2,
                    md: 4,
                    lg: 4,
                    xl: 6,
                    xxl: 8,
                    }}
                size="large"
                
                dataSource={data}
                renderItem={(item) => (
                    <List.Item>
                        <CheckCard
                            title={item.time_created}
                            description={null}
                            // description = {<Divider />}
                            value={item.photo_id}
                            style={{ width: '190px', }}
                            onChange={(checked) => {
                              console.log('checked', checked);
                              
                              
                              if (checked) {
                                // add to selected list
                                increment();
                                console.log('checkedNum', checkedNum);
                                if (checkedNum  === 1 ) {
                                  toggleEditEnable();
                                } 
                              }
                              else {
                                decrement();
                                console.log('checkedNum', checkedNum);
                                if (checkedNum  === 2 ) {
                                  toggleEditEnable();

                                }
                              }
                            }}

                        >
                                <Tooltip title={item.description}>
                                <Image
                                width='100%'
                                src={`http://${item.url}`}
                                
                            />
                                
                                </Tooltip>
                            

                        </CheckCard>
                    </List.Item>
                )}
            />
            </InfiniteScroll>
        </Space>
    );
};

// TODO: Implement the GalleryButtons component
const GalleryButtons: React.FC<ButtonComponentProps> = ({ editEnable, selectedPhotos, setSelectedPhotos}) => {
    const [loadings, setLoadings] = useState<boolean[]>([]);

    const enterLoading = (index: number) => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = true;
        return newLoadings;
      });
  
      setTimeout(() => {
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });
      }, 6000);
    };
    const handleClick = () => {
      // Make API call to server here
      // Example:
      fetch('/api/endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle response from server here
          console.log(data);
        })
        .catch((error) => {
          // Handle error here
          console.error(error);
        });
    };

    // const deletePhotos = () => { // delete photos
        
    // };
    
    // const generatePhotos = () => { // generate photos
    //   //
    //   handleGenerationJournal({ selectedPhotos: selectedPhotos }).then((response) => {
        
    //   }

    //   // Make API call to server here
    //   fetch('/api/generate-photos', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(selectedPhotos),
    //   })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     // Display message to user that generation is done, and provide url to jump.
    //     message.success('Photos generated successfully!');
    //     navigate('/generated-photos');
    //   })
    //   .catch((error) => {
    //     // Handle error here
    //     console.error(error);
    //     message.error('Failed to generate photos.');
    //   });
    // };



    return (
        // <Space direction="vertical" size="large" style={{ width: '100%', justifyContent: 'center' }}>
        <Space align="center" style={{ width: '100%', justifyContent: 'left' }}>
     
        <Button type="primary" shape="round" icon={<DeleteOutlined />} size={'middle'} onClick={handleClick}>
          Delete
        </Button>
        <Button type="primary" shape="round" icon={<FileAddOutlined />} size={'middle'} onClick={handleClick}>
          Add
        </Button>
        <Button type="primary" shape="round" icon={<EditOutlined />} size={'middle'} onClick={handleClick} disabled={!editEnable}>
          Edit
        </Button>
        <Button type="primary" shape="round" icon={<DownloadOutlined />} size={'middle'} onClick={handleClick}>
          Download
        </Button>

        <Button type="primary" shape="round" icon={<SendOutlined /> } size={'middle'} >
            Generate
        </Button>
        </Space>
    );
}

const UserPhotoGallery: React.FC = () => {

  const location = useLocation();

  // 使用useLocation钩子获取当前URL
  const queryParams = new URLSearchParams(location.search);
  // 读取fromDate和toDate参数
  const fromDate = queryParams.get('fromDate');
  const toDate = queryParams.get('toDate');
  const starred = queryParams.get('starred');
  const device = queryParams.get('device');
  const contains = queryParams.get('contains');

  // 使用这些参数进行操作，例如调用API
  // console.log(fromDate, toDate);

  const [query, setQuery] = useState<QueryType>({
    limit: 10,
    offset: 0,
    user_id: user_id,
    filters: {
      starred: starred === 'true',
      device: device,
      fromDate: fromDate,
      toDate: toDate,
      contains: contains,
    }
  }); 
  const queryEditor = (newQueryNum: number) => {
    setQuery({
      ...query,
      offset: query.offset! + newQueryNum,
    });
  };


  const [editEnable, setEditEnable] = useState(true);

  const toggleEditEnable = () => {
    setEditEnable(!editEnable);
  }

console.log('query', query); // 在严格模式下，这段代码会执行两次

const navigate = useNavigate();

const handleFilterChange = (filters: SearchFilters) => {
  setQuery({...query, filters: filters});
  console.log('changed query', query);
  // Perform actions based on updated filters
};

const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

const handleFilterSet = (filters: SearchFilters) => {
  console.log('Filters submit:', filters);
  
  // Perform actions based on updated filters
  const params = new URLSearchParams();
  if (filters?.starred) params.set('starred', 'true');
  else params.delete('starred');
    if (filters?.device) params.set('device', filters?.device);
    if (filters?.fromDate) params.set('fromDate', filters?.fromDate);
    if (filters?.toDate) params.set('toDate', filters?.toDate);
    if (filters?.contains) params.set('contains', filters?.contains);

    navigate({ search: params.toString() });

    window.location.reload();
    console.log("Reload")
};

//  const filters: SearchFilters = {};

    return (
        <MyLayout>
            <Space direction="vertical" size="large">
            <SearchBar initFilters = {query.filters} onFilterChange={handleFilterChange} onFilterSet={handleFilterSet} />
            <GalleryButtons editEnable={editEnable} selectedPhotos={selectedPhotos} setSelectedPhotos={setSelectedPhotos}/>
                <UserPhotoGalleryContent editEnable={editEnable} toggleEditEnable={toggleEditEnable} query={query} queryEditor = {queryEditor} />
                <FloatButton.BackTop style={{ right: 94, }}/>
            </Space>
        </MyLayout>
    );
};



export default UserPhotoGallery;
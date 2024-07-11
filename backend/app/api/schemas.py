from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None
    is_active: Optional[bool] = None
    profile_picture_url: Optional[str] = None
    bio: Optional[str] = None

class UserResponse(UserBase):
    user_id: UUID
    is_active: bool
    time_created: datetime
    last_login: Optional[datetime]
    profile_picture_url: Optional[str]
    bio: Optional[str]

    class Config: 
        orm_mode = True

# Device schemas
class DeviceBase(BaseModel):
    user_id: UUID
    device_name: str
    device_type: Optional[str] = None
    os_type: Optional[str] = None
    os_version: Optional[str] = None
    app_version: Optional[str] = None

class DeviceCreate(DeviceBase):
    pass

class DeviceUpdate(DeviceBase):
    is_active: Optional[bool] = None
    api_key: Optional[str] = None

class DeviceResponse(DeviceBase):
    device_id: UUID
    last_sync: Optional[datetime]
    is_active: bool
    api_key: str
    time_created: datetime
    time_modified: Optional[datetime]

    class Config:
        orm_mode = True

# Add similar schemas for Journal, Photo, and Entry
# Journal schemas
class JournalBase(BaseModel):
    title: str
    
    
class JournalCreate(JournalBase):
    pass

class JournalUpdate(JournalBase):
    is_active: Optional[bool] = None
    
    
class JournalResponse(JournalBase):
    journal_id: UUID
    user_id: UUID
    time_created: datetime
    time_modified: Optional[datetime]

    class Config:
        orm_mode = True
        
        
# Photo schemas
class PhotoBase(BaseModel):
    journal_id: UUID
    device_id: UUID
    location: str
    base64: str

    
class PhotoCreate(PhotoBase):
    pass

class PhotoUpdate(PhotoBase):
    time_modified: datetime
    description: Optional[str] = None
    
class PhotoResponse(PhotoBase):
    photo_id: UUID
    time_created: datetime
    time_modified: datetime
    description: Optional[str]

    class Config:
        orm_mode = True
        
        
# Entry schemas
class EntryBase(BaseModel):
    user_id: UUID
    journal_id: UUID
    device_id: UUID
    text_content: str
    location: str
    url: str
    tags: List[str]
    
    
class EntryCreate(EntryBase):
    pass

class EntryUpdate(EntryBase):
    is_active: Optional[bool] = None
    
class EntryResponse(EntryBase):
    entry_id: UUID
    is_active: bool
    time_created: datetime
    time_modified: Optional[datetime]

    class Config:
        orm_mode = True
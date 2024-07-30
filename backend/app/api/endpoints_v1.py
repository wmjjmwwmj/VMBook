from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File, Form, Query
from typing import List
from sqlmodel import Session
from database import get_db

from .functions import hash_pwd, describe_image
from models import *
from database import User as UserModel
from database import Device as DeviceModel
from database import Journal as JournalModel
from database import Photo as PhotoModel
from database import Entry as EntryModel

import shutil, json, os, sys
from uuid import UUID
from dotenv import load_dotenv
from jose import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

router = APIRouter()

pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")
# # OAuth2 scheme
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# async def get_current_user(token: str = Depends(oauth2_scheme)):
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         email: str = payload.get("email")
#         if email is None:
#             raise credentials_exception
#     except JWTError:
#         raise credentials_exception
#     user = db.query(UserModel).filter(UserModel.email == email).first()
#     if user is None:
#         raise credentials_exception
#     return user


# 保存上传的文件到指定目录
def save_upload_file(upload_file: UploadFile, destination: str):
    try:
        with open(destination, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
    except Exception as e:
        print("Error saving file:",e)
        return False
    finally:
        upload_file.file.close()
    if os.path.exists(destination) and os.path.getsize(destination) > 0:
        return True
    return False

"""
------------------------------------------------------------------------------ 
                                User endpoints
------------------------------------------------------------------------------
"""


@router.post('/token')
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    
    if not user_login.email or not user_login.password:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    user = db.query(UserModel).filter(UserModel.email == user_login.email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    # check password
    if not pwd_context.verify(user_login.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Wrong password")
    
    # password is correct, create a token
    payload = {
        "email": user.email,
        "exp": datetime.utcnow() + timedelta(days=1)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    
    return {"access_token": token, "token_type": "bearer"}
    
    

# create a user
@router.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(UserModel).filter(UserModel.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # hashed_pwd = hash_pwd(user.password)
    hashed_pwd = pwd_context.hash(user.password)
    del user.password
    new_user = UserModel(**user.dict(), password_hash=hashed_pwd)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# get user info by id
@router.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: UUID, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# get all users
@router.get("/users/", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(UserModel).all()
    return users


# delete user
@router.delete("/users/{user_id}")
def delete_user(user_id: UUID, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}


# update user info
@router.put("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: UUID, user_update: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update user attributes directly from the UserUpdate model
    for key, value in user_update.dict(exclude_unset=True).items():
        if key == "password":
            setattr(user, "password_hash", pwd_context.hash(value))
        else:
            setattr(user, key, value)
    
    db.commit()
    db.refresh(user)
    return user



"""
------------------------------------------------------------------------------ 
                                Device endpoints
------------------------------------------------------------------------------
"""
# get all devices from user by id
@router.get("/users/{user_id}/devices", response_model=List[DeviceResponse])
def get_user_devices(user_id: UUID, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user.devices

# get details from a specific device of a user by id
@router.get("/users/{user_id}/devices/{device_id}", response_model=DeviceResponse)
def get_user_device(user_id: UUID, device_id: UUID, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    device = db.query(DeviceModel).filter(DeviceModel.device_id == device_id).first()
    if device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    return device

# create a device for a user by id
@router.post("/users/{user_id}/devices", response_model=DeviceResponse)
def create_user_device(user_id: UUID, device: DeviceCreate, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    new_device = DeviceModel(**device.dict(), user_id=user_id)
    db.add(new_device)
    db.commit()
    db.refresh(new_device)
    return new_device


# update a device for a user by id
@router.put("/users/{user_id}/devices/{device_id}", response_model=DeviceResponse)
def update_user_device(user_id: UUID, device_id: UUID, device: DeviceUpdate, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    device = db.query(DeviceModel).filter(DeviceModel.device_id == device_id).first()
    if device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    for key, value in device.dict().items():
        if key in device.dict(exclude_unset=False):
            setattr(device, key, value)
    db.commit()
    db.refresh(device)
    
    return device

# delete a device for a user by id
@router.delete("/users/{user_id}/devices/{device_id}")
def delete_user_device(user_id: UUID, device_id: UUID, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    device = db.query(DeviceModel).filter(DeviceModel.device_id == device_id).first()
    if device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    db.delete(device)
    db.commit()
    return {"message": "Device deleted successfully"}

"""
------------------------------------------------------------------------------
                                Journal endpoints                               
------------------------------------------------------------------------------
"""

# get all journals from user by id
@router.get("/users/{user_id}/journals", response_model=List[JournalResponse])
def get_user_journals(user_id: UUID, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user.journals

# create a journal for a user by id
@router.post("/users/{user_id}/journals", response_model=JournalResponse)
def create_user_journal(user_id: UUID, journal: JournalCreate, db: Session = Depends(get_db)):
    if db.query(UserModel).filter(UserModel.user_id == user_id).first() is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    journal = JournalModel(**journal.dict(), user_id=user_id)
    db.add(journal)
    db.commit()
    db.refresh(journal)
    return journal

# get details from a specific journal of a user by id
@router.get("/users/{user_id}/journals/{journal_id}", response_model=JournalResponse)
def get_user_journal(user_id: UUID, journal_id: UUID, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    journal = db.query(JournalModel).filter((JournalModel.journal_id == journal_id) and (JournalModel.user_id == user_id)).first()
    if journal is None:
        raise HTTPException(status_code=404, detail="Journal not found")
    return journal

# update a journal for a user by id
@router.put("/users/{user_id}/journals/{journal_id}", response_model=JournalResponse)
def update_user_journal(user_id: UUID, journal_id: UUID, journal: JournalUpdate, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    journal = db.query(JournalModel).filter((JournalModel.journal_id == journal_id) and (JournalModel.user_id == user_id)).first()
    
    if journal is None:
        raise HTTPException(status_code=404, detail="Journal not found")
    
    for key, value in journal.dict().items():
        if key in journal.dict(exclude_unset=False):
            setattr(journal, key, value)
    db.commit()
    db.refresh(journal)
    
    return journal


# delete a journal for a user by id
@router.delete("/users/{user_id}/journals/{journal_id}")
def delete_user_journal(user_id: UUID, journal_id: UUID, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    journal = db.query(JournalModel).filter((JournalModel.journal_id == journal_id) and (JournalModel.user_id == user_id)).first()
    
    if journal is None:
        raise HTTPException(status_code=404, detail="Journal not found")
    
    db.delete(journal)
    db.commit()
    return {"message": "Journal deleted successfully"}


# TODO: Delete multiple journals
@router.delete("/users/{user_id}/journals")
def delete_user_journals(user_id: UUID, journal_ids: List[UUID], db: Session = Depends(get_db)):
    """
    Delete journals belonging to a user.

    Args:
        user_id (UUID): The ID of the user.
        journal_ids (List[UUID]): A list of journal IDs to be deleted.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        dict: A dictionary containing the message indicating the number of journals deleted.
    
    Raises:
        HTTPException: If the user or journals are not found.
        
    Example:
    DELETE /users/12345678-1234-5678-1234-567812345678/journals
    Content-Type: application/json

    {
    "journal_ids": ["abcdefab-cdef-abcd-efab-cdefabcdefab", "12345678-1234-5678-1234-567812345679"]
    }
    """
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    journals = db.query(JournalModel).filter((JournalModel.journal_id.in_(journal_ids)) and (JournalModel.user_id == user_id)).all()
    
    assert len(journals) == len(journal_ids), f"{len(journal_ids) - len(journals)} journals not found"
    
    if not journals:
        raise HTTPException(status_code=404, detail="Journals not found")
    
    for journal in journals:
        db.delete(journal)
    db.commit()
    return {"message": f"{len(journals)} journals deleted successfully"}


"""
------------------------------------------------------------------------------
                                Photo endpoints                 
------------------------------------------------------------------------------
"""

# get all photos from user by id
# Added query parameters to filter photos 
# TODO: Test get photos with query parameters
@router.get("/users/{user_id}/photos", response_model=List[PhotoResponse])
def get_user_photos(user_id: UUID, db: Session = Depends(get_db), 
                    limit: int = Query(10, description="Limit the number of photos returned", ge=1, le=100),
                    offset: int = Query(0, description="Offset the number of photos returned", ge=0),
                    starred: bool = Query(False, description="Filter photos by starred status"),
                    fromDate: datetime = Query(None, description="Filter photos by date"),
                    toDate: datetime = Query(None, description="Filter photos by date"),
                    device: str = Query(None, description="Filter photos by device"),
                    contains: str = Query(None, description="Filter photos by description")):
    """
    Retrieve photos for a specific user based on the provided filters.

    Parameters:
    - user_id (UUID): The ID of the user.
    - db (Session): The database session.
    - limit (int): Limit the number of photos returned. Default is 10. Must be between 1 and 100.
    - offset (int): Offset the number of photos returned. Default is 0.
    - starred (bool): Filter photos by starred status. Default is False.
    - fromDate (datetime): Filter photos by date. Default is None.
    - toDate (datetime): Filter photos by date. Default is None.
    - device (str): Filter photos by device. Default is None.
    - contains (str): Filter photos by description. Default is None.

    Returns:
    - List[PhotoResponse]: A list of photo objects that match the provided filters.
    
    Examples: 
    GET /users/12345678-1234-5678-1234-567812345678/photos?limit=5&offset=0&starred=true&fromDate=2021-01-01&toDate=2021-12-31&device=iphone&contains=dog
    """
    
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    photos_query = db.query(PhotoModel).filter(PhotoModel.user_id == user_id)
    
    if starred:
        photos_query = photos_query.filter(PhotoModel.starred == starred)

    if fromDate:
        photos_query = photos_query.filter(PhotoModel.time_modified >= fromDate)

    if toDate:
        photos_query = photos_query.filter(PhotoModel.time_modified <= toDate)

    if device:
        # device to device id
        device_id = db.query(DeviceModel).filter(DeviceModel.device_name == device).first().device_id
        photos_query = photos_query.filter(PhotoModel.device_id == device_id)

    if contains:
        photos_query = photos_query.filter(PhotoModel.description.contains(contains))

    filtered_photos = photos_query.order_by(PhotoModel.time_modified.desc()).offset(offset).limit(limit).all()

    return filtered_photos
    
# create a photo for a user by id
@router.post("/users/{user_id}/photos", response_model=PhotoResponse)
def create_user_photo(user_id: UUID, photo_create: str = Form(...), image: UploadFile = File(...), db: Session = Depends(get_db)):
    if db.query(UserModel).filter(UserModel.user_id == user_id).first() is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        photo_create_data = json.loads(photo_create)
        photo_create = PhotoCreate(**photo_create_data)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON data")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid data: {e}")
    
    savedir = os.path.join(os.path.dirname(__file__), f"uploads/{user_id}/")
    os.makedirs(os.path.dirname(savedir), exist_ok=True)
    if image.file:
        savepath = os.path.join(savedir, image.filename)
        if save_upload_file(image, savepath):
            pass
        else:
            raise HTTPException(status_code=400, detail="Error saving file")
    else:
        raise HTTPException(status_code=400, detail="No file uploaded")
        
    photo = PhotoModel(**photo_create.dict(), user_id=user_id, url=savepath)
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return photo


# get details from a specific photo of a user by id
@router.get("/users/{user_id}/photos/{photo_id}", response_model=PhotoResponse)
def get_user_photo(user_id: UUID, photo_id: UUID, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    photo = db.query(PhotoModel).filter((PhotoModel.photo_id == photo_id) and (PhotoModel.user_id == user_id)).first()
    if photo is None:
        raise HTTPException(status_code=404, detail="Photo not found")
    return photo

# update a photo for a user by id
@router.put("/users/{user_id}/photos/{photo_id}", response_model=PhotoResponse)
def update_user_photo(user_id: UUID, photo_id: UUID, photo: PhotoUpdate, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    photo = db.query(PhotoModel).filter((PhotoModel.photo_id == photo_id) and (PhotoModel.user_id == user_id)).first()
    
    if photo is None:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    for key, value in photo.dict().items():
        if key in photo.dict(exclude_unset=False):
            setattr(photo, key, value)
            
    db.commit()
    db.refresh(photo)
    
    return photo


# delete a photo for a user by id
@router.delete("/users/{user_id}/photos/{photo_id}")
def delete_user_photo(user_id: UUID, photo_id: UUID, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    photo = db.query(PhotoModel).filter((PhotoModel.photo_id == photo_id) and (PhotoModel.user_id == user_id)).first()
    
    if photo is None:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    db.delete(photo)
    db.commit()
    return {"message": "Photo deleted successfully"}


@router.delete("/users/{user_id}/photos")
def delete_user_photos(user_id: UUID, photo_ids: List[UUID], db: Session = Depends(get_db)):
    """
    Delete photos belonging to a user.

    Args:
        user_id (UUID): The ID of the user.
        photo_ids (List[UUID]): A list of photo IDs to be deleted.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        dict: A dictionary containing the message indicating the number of photos deleted.
    
    Raises:
        HTTPException: If the user or photos are not found.
        
    Example:
    DELETE /users/12345678-1234-5678-1234-567812345678/photos
    Content-Type: application/json

    {
    "photo_ids": ["abcdefab-cdef-abcd-efab-cdefabcdefab", "12345678-1234-5678-1234-567812345679"]
    }
    """
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    photos = db.query(PhotoModel).filter((PhotoModel.photo_id.in_(photo_ids)) and (PhotoModel.user_id == user_id)).all()
    
    assert len(photos) == len(photo_ids), f"{len(photo_ids) - len(photos)} photos not found"
    
    if not photos:
        raise HTTPException(status_code=404, detail="Photos not found")
    
    for photo in photos:
        db.delete(photo)
    db.commit()
    return {"message": f"{len(photos)} photos deleted successfully"}


# anaylze a photo
@router.get("/users/{user_id}/photos/{photo_id}/analyze")
def analyze_photo(user_id: UUID, photo_id: UUID, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    photo = db.query(PhotoModel).filter((PhotoModel.photo_id == photo_id) and (PhotoModel.user_id == user_id)).first()
    if photo is None:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    description = describe_image(photo.url) # this function is taking 7-8 seconds to return
    
    photo.description = description
    db.commit()
    db.refresh(photo)
    return photo


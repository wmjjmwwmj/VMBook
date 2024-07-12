from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File
from typing import List
from sqlmodel import Session
from database import get_db

from .functions import hash_pwd, describe_image
from models import *
from database import User as UserModel
import shutil

router = APIRouter()

# 保存上传的文件到指定目录
async def save_upload_file(upload_file: UploadFile, destination: str):
    try:
        with open(destination, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
    finally:
        upload_file.file.close()



@router.post("/uploadfile/")
async def upload_file(file: UploadFile = File(...)):
    try:
        # 指定保存的目录和文件名
        save_path = os.path.join("uploads", file.filename)
        await save_upload_file(file, save_path)
        return JSONResponse(status_code=200, content={"message": "File uploaded successfully"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": "Failed to upload file", "error": str(e)})



"""
------------------------------------------------------------------------------ 
                                User endpoints
------------------------------------------------------------------------------
"""

# create a user
@router.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(UserModel).filter(UserModel.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = hash_pwd(user.password)
    del user.password
    new_user = UserModel(**user.dict(), password_hash=hashed_pwd)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# get user info by id
@router.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
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
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

# get all photos from user by id
@router.get("/users/{user_id}/photos")
def get_user_photos(user_id: int, db: Session = Depends(get_db), response_model=List[PhotoResponse]):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user.photos





"""
------------------------------------------------------------------------------ 
                                Device endpoints
------------------------------------------------------------------------------
"""
# get all devices from user by id
@router.get("/users/{user_id}/devices")
def get_user_devices(user_id: int, db: Session = Depends(get_db), response_model=List[DeviceResponse]):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user.devices

# get details from a specific device of a user by id
@router.get("/users/{user_id}/devices/{device_id}")
def get_user_device(user_id: int, device_id: int, db: Session = Depends(get_db), response_model=DeviceResponse):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    device = db.query(DeviceModel).filter(DeviceModel.device_id == device_id).first()
    if device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    return device

# create a device for a user by id
@router.post("/users/{user_id}/devices", response_model=DeviceResponse)
def create_user_device(user_id: int, device: DeviceCreate, db: Session = Depends(get_db)):
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
def update_user_device(user_id: int, device_id: int, device: DeviceUpdate, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    device = db.query(DeviceModel).filter(DeviceModel.device_id == device_id).first()
    if device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    for key, value in device.dict().items():
        if key in device.dict(exclude_unset=True):
            setattr(device, key, value)
    db.commit()
    db.refresh(device)
    
    return device

# delete a device for a user by id
@router.delete("/users/{user_id}/devices/{device_id}")
def delete_user_device(user_id: int, device_id: int, db: Session = Depends(get_db)):
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
@router.get("/users/{user_id}/journals")
def get_user_journals(user_id: int, db: Session = Depends(get_db), response_model=List[JournalResponse]):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user.journals

# create a journal for a user by id
@router.post("/users/{user_id}/journals", response_model=JournalResponse)
def create_user_journal(user_id: int, journal: JournalCreate, db: Session = Depends(get_db), response_model=JournalResponse):
    if db.query(UserModel).filter(UserModel.user_id == user_id).first() is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    journal = JournalModel(**journal.dict(), user_id=user_id)
    db.add(journal)
    db.commit()
    db.refresh(journal)
    return journal

# get details from a specific journal of a user by id
@router.get("/users/{user_id}/journals/{journal_id}")
def get_user_journal(user_id: int, journal_id: int, db: Session = Depends(get_db), response_model=JournalResponse):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    journal = db.query(JournalModel).filter((JournalModel.journal_id == journal_id) and (JournalModel.user_id == user_id)).first()
    if journal is None:
        raise HTTPException(status_code=404, detail="Journal not found")
    return journal

# update a journal for a user by id
@router.put("/users/{user_id}/journals/{journal_id}", response_model=JournalResponse)
def update_user_journal(user_id: int, journal_id: int, journal: JournalUpdate, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    journal = db.query(JournalModel).filter((JournalModel.journal_id == journal_id) and (JournalModel.user_id == user_id)).first()
    
    if journal is None:
        raise HTTPException(status_code=404, detail="Journal not found")
    
    for key, value in journal.dict().items():
        if key in journal.dict(exclude_unset=True):
            setattr(journal, key, value)
    db.commit()
    db.refresh(journal)
    
    return journal


# delete a journal for a user by id
@router.delete("/users/{user_id}/journals/{journal_id}")
def delete_user_journal(user_id: int, journal_id: int, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    journal = db.query(JournalModel).filter((JournalModel.journal_id == journal_id) and (JournalModel.user_id == user_id)).first()
    
    if journal is None:
        raise HTTPException(status_code=404, detail="Journal not found")
    
    db.delete(journal)
    db.commit()
    return {"message": "Journal deleted successfully"}


"""
------------------------------------------------------------------------------
                                Photo endpoints                 
------------------------------------------------------------------------------
"""

# get all photos from user by id
@router.get("/users/{user_id}/photos")
def get_user_photos(user_id: int, db: Session = Depends(get_db), response_model=List[PhotoResponse]):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user.photos

# # create a photo for a user by id
# @router.post("/users/{user_id}/photos", response_model=PhotoResponse)
# def create_user_photo(user_id: int, photo: PhotoCreate, db: Session = Depends(get_db)):
#     if db.query(UserModel).filter(UserModel.user_id == user_id).first() is None:
#         raise HTTPException(status_code=404, detail="User not found")
    
#     url = string2url(photo.base64)
#     del photo.base64
    
#     photo = PhotoModel(**photo.dict(), user_id=user_id, url=url)
#     db.add(photo)
#     db.commit()
#     db.refresh(photo)
#     return photo


# create a photo for a user by id
@router.post("/users/{user_id}/photos", response_model=PhotoResponse)
def create_user_photo(user_id: int, photo: PhotoCreate, db: Session = Depends(get_db)):
    if db.query(UserModel).filter(UserModel.user_id == user_id).first() is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    savepath = os.path.join(f"uploads/{user_id}/", photo.file_name)
    # mkdir if not exists
    os.makedirs(os.path.dirname(savepath), exist_ok=True)
    upload_file(photo.image, savepath)
    
    del photo.image  
    photo = PhotoModel(**photo.dict(), user_id=user_id, url=savepath)
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return photo


# get details from a specific photo of a user by id
@router.get("/users/{user_id}/photos/{photo_id}")
def get_user_photo(user_id: int, photo_id: int, db: Session = Depends(get_db), response_model=PhotoResponse):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    photo = db.query(PhotoModel).filter((PhotoModel.photo_id == photo_id) and (PhotoModel.user_id == user_id)).first()
    if photo is None:
        raise HTTPException(status_code=404, detail="Photo not found")
    return photo

# update a photo for a user by id
@router.put("/users/{user_id}/photos/{photo_id}", response_model=PhotoResponse)
def update_user_photo(user_id: int, photo_id: int, photo: PhotoUpdate, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    photo = db.query(PhotoModel).filter((PhotoModel.photo_id == photo_id) and (PhotoModel.user_id == user_id)).first()
    
    if photo is None:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    for key, value in photo.dict().items():
        if key in photo.dict(exclude_unset=True):
            setattr(photo, key, value)
            
    db.commit()
    db.refresh(photo)
    
    return photo


# delete a photo for a user by id
@router.delete("/users/{user_id}/photos/{photo_id}")
def delete_user_photo(user_id: int, photo_id: int, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    photo = db.query(PhotoModel).filter((PhotoModel.photo_id == photo_id) and (PhotoModel.user_id == user_id)).first()
    
    if photo is None:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    db.delete(photo)
    db.commit()
    return {"message": "Photo deleted successfully"}

# anaylze a photo
@router.get("/users/{user_id}/photos/{photo_id}/analyze")
def analyze_photo(user_id: int, photo_id: int, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    photo = db.query(PhotoModel).filter((PhotoModel.photo_id == photo_id) and (PhotoModel.user_id == user_id)).first()
    
    if photo is None:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    description = describe_image(photo.url)
    photo.description = description
    db.commit()
    db.refresh(photo)
    return photo


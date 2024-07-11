import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey, Integer
from sqlalchemy.dialects.mysql import BINARY as MySQL_BINARY
from sqlalchemy.orm import relationship
from .base import Base

class User(Base):
    __tablename__ = 'users'
    
    user_id = Column(MySQL_BINARY(16), primary_key=True, default=lambda: uuid.uuid4().bytes)
    username = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    time_created = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    profile_picture_url = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)

    devices = relationship("Device", back_populates="user")
    journals = relationship("Journal", back_populates="user")
    photos = relationship("Photo", back_populates="user")
    entries = relationship("Entry", back_populates="user")
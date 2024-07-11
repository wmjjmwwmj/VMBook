import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey, Integer
from sqlalchemy.dialects.mysql import BINARY as MySQL_BINARY
from sqlalchemy.orm import relationship
from .base import Base

class Device(Base):
    __tablename__ = 'devices'
    
    device_id = Column(MySQL_BINARY(16), primary_key=True, default=lambda: uuid.uuid4().bytes)
    user_id = Column(MySQL_BINARY(16), ForeignKey('users.user_id'))
    
    device_name = Column(String(255), nullable=False)
    
    device_type = Column(String(255), nullable=False)
    os_type = Column(String(255), nullable=False)
    os_version = Column(String(255), nullable=False)
    app_version = Column(String(255), nullable=False)
    
    last_sync = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    
    api_key = Column(String(255), unique=True, nullable=False)
    time_created = Column(DateTime, default=datetime.utcnow)
    time_modified = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="devices")
    photos = relationship("Photo", back_populates="device")
    entries = relationship("Entry", back_populates="device")
    
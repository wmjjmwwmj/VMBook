import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey, Integer
from sqlalchemy.dialects.mysql import BINARY as MySQL_BINARY
from sqlalchemy.orm import relationship
from .base import Base

class Photo(Base):
    __tablename__ = 'photos'

    photo_id = Column(MySQL_BINARY(16), primary_key=True, default=lambda: uuid.uuid4().bytes)
    user_id = Column(MySQL_BINARY(16), ForeignKey('users.user_id'))
    journal_id = Column(MySQL_BINARY(16), ForeignKey('journals.journal_id'))
    device_id = Column(MySQL_BINARY(16), ForeignKey('devices.device_id'))
    time_created = Column(DateTime, default=datetime.utcnow)
    time_modified = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    location = Column(String(255))
    description = Column(String(255))
    url = Column(String(255), nullable=False)
    starred = Column(Boolean, default=False)
    file_name = Column(String(255))
    file_size = Column(Integer)
    file_type = Column(String(255))

    journal = relationship("Journal", back_populates="photos")
    user = relationship("User", back_populates="photos")
    device = relationship("Device", back_populates="photos")
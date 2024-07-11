import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey, Integer
from sqlalchemy.dialects.mysql import BINARY as MySQL_BINARY
from sqlalchemy.orm import relationship
from .base import Base

class Journal(Base):
    __tablename__ = 'journals'

    journal_id = Column(MySQL_BINARY(16), primary_key=True, default=lambda: uuid.uuid4().bytes)
    user_id = Column(MySQL_BINARY(16), ForeignKey('users.user_id'))
    title = Column(String(255), nullable=False)
    text_content = Column(Text)
    time_created = Column(DateTime, default=datetime.utcnow)
    time_modified = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    url = Column(String(255), nullable=True)
    is_public = Column(Boolean, default=False)
    tags = Column(Text)  # Consider using an array type if supported by your database

    user = relationship("User", back_populates="journals")
    photos = relationship("Photo", back_populates="journal")
    entries = relationship("Entry", back_populates="journal")
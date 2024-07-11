import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey, Integer
from sqlalchemy.dialects.mysql import BINARY as MySQL_BINARY
from sqlalchemy.orm import relationship
from .base import Base


class Entry(Base):
    __tablename__ = 'entries'

    entry_id = Column(MySQL_BINARY(16), primary_key=True, default=lambda: uuid.uuid4().bytes)
    journal_id = Column(MySQL_BINARY(16), ForeignKey('journals.journal_id'))
    time_created = Column(DateTime, default=datetime.utcnow)
    time_modified = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    position = Column(String(255))
    content = Column(String(255))

    journal = relationship("Journal", back_populates="entries")
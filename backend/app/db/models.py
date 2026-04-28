from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base
import uuid

class HCP(Base):
    __tablename__ = "hcps"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(255), nullable=False)
    specialty = Column(String(100))
    email = Column(String(255), unique=True)
    affiliation = Column(String(255))
    last_contact = Column(DateTime(timezone=True))

    interactions = relationship("Interaction", back_populates="hcp")

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hcp_id = Column(UUID(as_uuid=True), ForeignKey("hcps.id"))
    rep_id = Column(UUID(as_uuid=True), nullable=False)
    summary = Column(Text)
    transcript = Column(Text)
    interaction_type = Column(String(50)) # e.g., 'In-person', 'Remote'
    sentiment = Column(String(20))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    version = Column(Integer, default=1)

    hcp = relationship("HCP", back_populates="interactions")
    audit_logs = relationship("AuditLog", back_populates="interaction")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    interaction_id = Column(UUID(as_uuid=True), ForeignKey("interactions.id"))
    changed_by = Column(UUID(as_uuid=True), nullable=False)
    old_value = Column(JSON)
    new_value = Column(JSON)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    interaction = relationship("Interaction", back_populates="audit_logs")

class FollowUp(Base):
    __tablename__ = "follow_ups"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hcp_id = Column(UUID(as_uuid=True), ForeignKey("hcps.id"))
    task = Column(String(500))
    due_date = Column(String(50))
    status = Column(String(20), default="Pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

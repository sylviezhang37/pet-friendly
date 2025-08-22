from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Boolean,
    Integer,
    Float,
    DateTime,
    ForeignKey,
    UniqueConstraint,
    text,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("uuid_generate_v4()"),
    )
    username = Column(String, unique=True, nullable=False)
    email = Column(String, nullable=False)
    google_id = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    reviews = relationship("Review", back_populates="user")


class Place(Base):
    __tablename__ = "places"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    address = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    business_type = Column(String)
    google_maps_url = Column(String)
    allows_pet = Column(Boolean, default=False)
    pet_friendly = Column(Boolean, default=False)
    num_confirm = Column(Integer, default=0)
    num_deny = Column(Integer, default=0)
    last_contribution_type = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    reviews = relationship("Review", back_populates="place")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("uuid_generate_v4()"),
    )
    place_id = Column(String, ForeignKey("places.id"), nullable=False)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    username = Column(String, nullable=False)
    pet_friendly = Column(Boolean, nullable=False)
    comment = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    place = relationship("Place", back_populates="reviews")
    user = relationship("User", back_populates="reviews")

    __table_args__ = (UniqueConstraint("place_id", "user_id"),)

from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from .database import Base

class PromptTemplate(Base):
    __tablename__ = "prompt_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    runs = relationship("PromptRun", back_populates="template")

class PromptRun(Base):
    __tablename__ = "prompt_runs"

    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(Integer, ForeignKey("prompt_templates.id"))
    model_used = Column(String)
    output = Column(Text)
    input_tokens = Column(Integer, default=0)
    output_tokens = Column(Integer, default=0)
    latency_ms = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    template = relationship("PromptTemplate", back_populates="runs")
    scores = relationship("PromptScore", back_populates="run")

class PromptScore(Base):
    __tablename__ = "prompt_scores"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(Integer, ForeignKey("prompt_runs.id"))
    dimension = Column(String) # e.g., 'Clarity', 'Specificity'
    score = Column(Float)
    reasoning = Column(Text)

    run = relationship("PromptRun", back_populates="scores")

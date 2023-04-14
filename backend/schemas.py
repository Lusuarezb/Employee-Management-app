import datetime as _dt
import pydantic as _pydantic

class _UserBase(_pydantic.BaseModel):
    name: str
    position: str
    email: str

class UserCreate(_UserBase):
    hashed_password: str

    class Config:
        orm_mode = True

class User(_UserBase):
    id:int

    class Config:
        orm_mode = True

class _SkillBase(_pydantic.BaseModel):
    name:str
    level: int

class SkillCreate(_SkillBase):
    pass

class Skill(_SkillBase):
    id:int
    user_id:int

    class Config:
        orm_mode = True

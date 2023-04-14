import database as _database
import sqlalchemy.orm as _orm
import passlib.hash as _hash
import fastapi as _fastapi
import fastapi.security as _security
import jwt as _jwt

import models as _models
import schemas as _schemas

oauth2schema = _security.OAuth2PasswordBearer(tokenUrl="/api/token")
JWT_SECRET = "myjwtsecret"

def create_database():
    return _database.Base.metadata.create_all(bind=_database.engine)

def get_db():
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_user_by_email(email:str, db: _orm.Session):
    return db.query(_models.User).filter(_models.User.email == email).first()

async def create_user(user: _schemas.UserCreate, db: _orm.Session):
    user_obj = _models.User(name=user.name, position=user.position, email=user.email, hashed_password= _hash.bcrypt.hash(user.hashed_password))
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj

async def authenticate_user(email:str, password:str, db: _orm.Session):
    user = await get_user_by_email(db=db, email=email)
    if not user:
        return False
    
    if not user.verify_password(password):
        return False
    
    return user

async def create_token(user: _models.User):
    user_obj = _schemas.User.from_orm(user)
    token = _jwt.encode(user_obj.dict(), JWT_SECRET)
    return dict(access_token=token, token_type="bearer")

async def get_current_user(db: _orm.Session = _fastapi.Depends(get_db), token:str = _fastapi.Depends(oauth2schema)):
    try:
        payload = _jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(_models.User).get(payload["id"])
    except:
        raise _fastapi.HTTPException(status_code=401, detail= "Invalid Email or Password")

    return _schemas.User.from_orm(user)

async def create_skill(user: _schemas.User, db: _orm.Session, skill: _schemas.SkillCreate):
    skill = _models.Skill(**skill.dict(), user_id=user.id) # Unpack the skill
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return _schemas.Skill.from_orm(skill)

async def get_skills(user: _schemas.User, db: _orm.Session):
    skills = db.query(_models.Skill).filter_by(user_id=user.id)
    return list(map(_schemas.Skill.from_orm, skills))

async def _skill_selector(skill_id:int, user: _schemas.User, db: _orm.Session):
    skill = db.query(_models.Skill).filter_by(user_id=user.id).filter(_models.Skill.id == skill_id).first()
    if skill is None:
        raise _fastapi.HTTPException(status_code=404, detail=f"This user does not have this skill")
    return skill

async def get_skill(skill_id:int, user: _schemas.User, db: _orm.Session):
    skill = await _skill_selector(skill_id=skill_id, user=user, db=db)
    return _schemas.Skill.from_orm(skill)

async def delete_skill(skill_id:int, user: _schemas.User, db: _orm.Session):
    skill = await _skill_selector(skill_id=skill_id, user=user, db=db)
    db.delete(skill)
    db.commit()

async def update_skill(skill_id:int, skill:_schemas.SkillCreate, user: _schemas.User, db: _orm.Session):
    skill_db = await _skill_selector(skill_id=skill_id, user=user, db=db)
    skill_db.name = skill.name
    skill_db.level = skill.level
    db.commit()
    db.refresh(skill_db)
    return _schemas.Skill.from_orm(skill_db)
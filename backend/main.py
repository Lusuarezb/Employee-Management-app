import fastapi as _fastapi
import fastapi.security as _security
import sqlalchemy.orm as _orm
import services as _services
import schemas as _schemas
from typing import List

app = _fastapi.FastAPI()

@app.post("/api/users")
async def create_user(user: _schemas.UserCreate, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    db_user = await _services.get_user_by_email(user.email, db)
    if db_user:
        raise _fastapi.HTTPException(status_code=400, detail="Email already in use")
    user = await _services.create_user(user, db)

    return await _services.create_token(user)
    #return user

@app.post("/api/token")
async def generate_token(form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(), db: _orm.Session = _fastapi.Depends(_services.get_db)):
    user = await _services.authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise _fastapi.HTTPException(status_code=401, detail="Invalid Credentials")
    return await _services.create_token(user)

@app.get("/api/users/me", response_model=_schemas.User)
async def get_user(user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return user

@app.post("/api/skills", response_model=_schemas.Skill)
async def create_skill(skill: _schemas.SkillCreate, user: _schemas.User = _fastapi.Depends(_services.get_current_user), db: _orm.Session=_fastapi.Depends(_services.get_db)):
    return await _services.create_skill(user=user, db=db, skill=skill)

@app.get("/api/skills", response_model=List[_schemas.Skill])
async def get_skills(user: _schemas.User = _fastapi.Depends(_services.get_current_user), db: _orm.Session=_fastapi.Depends(_services.get_db)):
    return await _services.get_skills(user=user, db=db)

@app.get("/api/skills/{skill_id}", status_code=200)
async def get_skill(skill_id:int, user: _schemas.User = _fastapi.Depends(_services.get_current_user), db: _orm.Session=_fastapi.Depends(_services.get_db)):
    return await _services.get_skill(skill_id=skill_id, user=user, db=db)

@app.delete("/api/skills/{skill_id}", status_code=204)
async def delete_skill(skill_id:int, user: _schemas.User = _fastapi.Depends(_services.get_current_user), db: _orm.Session=_fastapi.Depends(_services.get_db)):
    await _services.delete_skill(skill_id=skill_id, user=user, db=db)
    return {"message": "Sucessfully deleted"}

@app.put("/api/skills/{skill_id}", status_code=200)
async def update_skill(skill_id:int, skill:_schemas.SkillCreate, user: _schemas.User = _fastapi.Depends(_services.get_current_user), db: _orm.Session=_fastapi.Depends(_services.get_db)):
    await _services.update_skill(skill_id=skill_id, skill=skill, user=user, db=db) 
    return {"message": "Sucessfully updated"}

@app.get("/api/")
async def root():
    return {"message": "Employee management system"}
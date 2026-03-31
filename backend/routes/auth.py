import hashlib
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

# Import engine and User model from the parent package
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent))
from model import engine, User

router = APIRouter(prefix="/auth", tags=["auth"])


# ── helpers ──────────────────────────────────────────────────────────────────

def _hash(password: str) -> str:
    """SHA-256 hash of the password (hex digest)."""
    return hashlib.sha256(password.encode()).hexdigest()


# ── schemas ───────────────────────────────────────────────────────────────────

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str


# ── endpoints ─────────────────────────────────────────────────────────────────

@router.post("/signup", response_model=UserResponse)
def signup(body: SignupRequest):
    """Create a new user. Returns the user object on success."""
    if not body.name.strip():
        raise HTTPException(status_code=422, detail="Name cannot be empty.")
    if len(body.password) < 6:
        raise HTTPException(status_code=422, detail="Password must be at least 6 characters.")

    with Session(engine) as session:
        # Check for duplicate email manually for a friendlier error
        existing = session.query(User).filter_by(email=body.email.lower()).first()
        if existing:
            raise HTTPException(status_code=409, detail="An account with this email already exists.")

        user = User(
            name=body.name.strip(),
            email=body.email.lower().strip(),
            password_hash=_hash(body.password),
        )
        try:
            session.add(user)
            session.commit()
            session.refresh(user)
            return UserResponse(id=user.id, name=user.name, email=user.email)
        except IntegrityError:
            session.rollback()
            raise HTTPException(status_code=409, detail="An account with this email already exists.")


@router.post("/login", response_model=UserResponse)
def login(body: LoginRequest):
    """Verify credentials. Returns the user object on success."""
    with Session(engine) as session:
        user = session.query(User).filter_by(email=body.email.lower().strip()).first()
        if user is None or user.password_hash != _hash(body.password):
            raise HTTPException(status_code=401, detail="Invalid email or password.")
        return UserResponse(id=user.id, name=user.name, email=user.email)

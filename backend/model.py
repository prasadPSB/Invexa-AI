from pathlib import Path

from sqlalchemy import Column, ForeignKey, Integer, String, create_engine, text
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

DB_PATH = Path(__file__).resolve().parent / "app.db"
DATABASE_URL = f"sqlite:///{DB_PATH}"
engine = create_engine(DATABASE_URL, echo=True)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=True)  # nullable so existing rows aren't broken

    table = relationship("Table", back_populates="user", cascade="all, delete-orphan", uselist=False)


class Table(Base):
    __tablename__ = "tables"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="table")
    
class saved_chart(Base):
    __tablename__ = "saved_charts"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    chart_type=Column(String)
    color = Column(String)
    sql_query = Column(String)
    x_key = Column(String)
    y_key = Column(String)
    created_at = Column(String, server_default="CURRENT_TIMESTAMP")


def create_db_file() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    Base.metadata.create_all(bind=engine)

    with engine.connect() as conn:
        # Migration 1: add password_hash to users if missing
        user_cols = [row[1] for row in conn.execute(text("PRAGMA table_info(users)"))]
        if "password_hash" not in user_cols:
            conn.execute(text("ALTER TABLE users ADD COLUMN password_hash TEXT"))
            conn.commit()

        # Migration 2: recreate saved_charts if schema is stale (missing x_key/y_key)
        sc_cols = [row[1] for row in conn.execute(text("PRAGMA table_info(saved_charts)"))]
        if "x_key" not in sc_cols or "y_key" not in sc_cols:
            conn.execute(text("DROP TABLE IF EXISTS saved_charts"))
            conn.execute(text("""
                CREATE TABLE saved_charts (
                    id         INTEGER PRIMARY KEY AUTOINCREMENT,
                    title      TEXT,
                    chart_type TEXT,
                    color      TEXT,
                    sql_query  TEXT,
                    x_key      TEXT,
                    y_key      TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            """))
            conn.commit()
            print("Migrated saved_charts to correct schema.")




if __name__ == "__main__":
    create_db_file()
    print(f"Database created at: {DB_PATH}")

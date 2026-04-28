import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base import Base
from app.db.models import HCP
import uuid

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def init_db():
    print(f"Connecting to: {DATABASE_URL}")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created/verified successfully.")
        
        db = SessionLocal()
        
        # List of sample HCPs to add
        sample_hcps = [
            {
                "full_name": "Dr. Aris Ray",
                "specialty": "Oncology",
                "email": "aris.ray@memorial.com",
                "affiliation": "Memorial Hospital"
            },
            {
                "full_name": "Dr. John Smith",
                "specialty": "Cardiology",
                "email": "john.smith@stjude.org",
                "affiliation": "St. Jude Medical Center"
            },
            {
                "full_name": "Dr. Sarah Johnson",
                "specialty": "Neurology",
                "email": "s.johnson@cityhealth.com",
                "affiliation": "City Health Hospital"
            }
        ]

        for data in sample_hcps:
            if not db.query(HCP).filter(HCP.full_name == data["full_name"]).first():
                new_hcp = HCP(
                    id=uuid.uuid4(),
                    full_name=data["full_name"],
                    specialty=data["specialty"],
                    email=data["email"],
                    affiliation=data["affiliation"]
                )
                db.add(new_hcp)
                print(f"✅ Added: {data['full_name']}")
        
        db.commit()
        db.close()
        print("✅ Database initialization complete.")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    init_db()

from typing import Optional, Dict, Any, List
from langchain_core.tools import tool
import uuid
from app.db.session import SessionLocal
from app.db.models import HCP

@tool
def log_interaction(
    hcp_name: str, 
    interaction_type: str, 
    attendees: Optional[str] = "",
    topics_discussed: Optional[str] = "",
    materials_shared: Optional[str] = "",
    samples_distributed: Optional[str] = "",
    sentiment: Optional[str] = "Neutral",
    outcomes: Optional[str] = "",
    follow_up_actions: Optional[str] = "",
    suggested_follow_ups: Optional[List[str]] = []
):
    """
    Logs a new interaction with an HCP and extracts structured data.
    """
    return {
        "status": "success",
        "interaction_id": str(uuid.uuid4()),
        "data": {
            "hcp_name": hcp_name,
            "interaction_type": interaction_type,
            "attendees": attendees,
            "topics_discussed": topics_discussed,
            "materials_shared": materials_shared,
            "samples_distributed": samples_distributed,
            "sentiment": sentiment,
            "outcomes": outcomes,
            "follow_up_actions": follow_up_actions,
            "suggested_follow_ups": suggested_follow_ups
        }
    }

@tool
def get_hcp_profile(hcp_name: str):
    """
    Retrieves the profile and recent history of an HCP by name from the database.
    """
    db = SessionLocal()
    try:
        # Search for the HCP in the database
        hcp = db.query(HCP).filter(HCP.full_name.ilike(f"%{hcp_name}%")).first()
        if hcp:
            return {
                "name": hcp.full_name,
                "specialty": hcp.specialty,
                "email": hcp.email,
                "affiliation": hcp.affiliation,
                "last_contact": str(hcp.last_contact) if hcp.last_contact else "Never",
                "status": "Found in Database"
            }
        else:
            return {"error": f"HCP '{hcp_name}' not found in database."}
    finally:
        db.close()

@tool
def create_follow_up(hcp_id: str, task: str, due_date: Optional[str] = "2 weeks"):
    """
    Creates a new follow-up task or action item for an HCP in the CRM database.
    """
    return {
        "status": "success",
        "message": f"Follow-up task '{task}' created, due in {due_date}.",
        "task_id": str(uuid.uuid4())
    }

@tool
def search_medical_content(query: str):
    """
    Searches clinical trials, medical literature, and product knowledge bases.
    """
    results = [
        {"title": "OncoBoost Phase III Trial Results", "outcome": "Showed 25% improvement in PFS vs placebo."},
        {"title": "Drug X Contraindications", "content": "Avoid use in patients with severe hepatic impairment."},
        {"title": "Standard Dosage for Lung Cancer", "content": "150mg daily, orally, with or without food."}
    ]
    return {"query": query, "results": results}

@tool
def edit_interaction(interaction_id: str, updates: Dict[str, Any]):
    """
    Modifies an existing logged interaction safely.
    """
    return {
        "status": "success",
        "message": f"Updated interaction {interaction_id}",
        "updates": updates
    }

crm_tools = [log_interaction, get_hcp_profile, create_follow_up, search_medical_content, edit_interaction]

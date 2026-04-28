from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from app.agents.graph import app as agent_app
from langchain_core.messages import HumanMessage, AIMessage
import uuid

app = FastAPI(title="AIVOA HCP CRM API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatInput(BaseModel):
    message: str
    hcp_id: str
    history: List[dict] = []

@app.post("/chat")
async def chat(input_data: ChatInput):
    try:
        # Convert history to BaseMessages
        messages = []
        for msg in input_data.history:
            if msg['role'] == 'user':
                messages.append(HumanMessage(content=msg['content']))
            else:
                messages.append(AIMessage(content=msg['content']))
        
        messages.append(HumanMessage(content=input_data.message))
        
        # Run agent
        state = {"messages": messages, "hcp_id": input_data.hcp_id}
        result = await agent_app.ainvoke(state)
        
        last_message = result['messages'][-1]

        # Find the most recent tool call in the history to sync the form
        all_tool_calls = []
        for msg in reversed(result['messages']):
            if hasattr(msg, "tool_calls") and msg.tool_calls:
                all_tool_calls = msg.tool_calls
                break

        return {
            "response": last_message.content,
            "tool_calls": all_tool_calls
        }
    except Exception as e:
        print(f"ERROR IN CHAT ENDPOINT: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

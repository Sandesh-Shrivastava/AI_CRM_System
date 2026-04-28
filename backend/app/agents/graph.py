import os
import operator
from typing import TypedDict, Annotated, List, Union, Optional
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_groq import ChatGroq
from langchain_core.messages import BaseMessage, HumanMessage
from .tools import crm_tools
from dotenv import load_dotenv

load_dotenv()

class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    hcp_id: Optional[str]
    context: Optional[dict]

# Initialize LLM
model = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)
model_with_tools = model.bind_tools(crm_tools)

def call_model(state: AgentState):
    messages = state['messages']
    # Add a system prompt if it's the start of the conversation
    system_prompt = (
        "You are an AI assistant for a life-sciences CRM. "
        "Your goal is to help representatives log interactions with HCPs. "
        "When a user describes an interaction, ALWAYS use the 'log_interaction' tool. "
        "Extract the following: hcp_name, interaction_type (Meeting, Email, Lunch), "
        "attendees, topics_discussed, materials_shared, samples_distributed, "
        "sentiment (Positive, Neutral, or Negative), outcomes (key agreements), "
        "follow_up_actions, and a list of 2-3 suggested_follow_ups. "
        "Use 'search_medical_content' to answer technical questions about drugs or trials. "
        "Use 'create_follow_up' to actually schedule a task in the CRM when a next step is agreed upon. "
        "Even if the user only mentions a few details, call the 'log_interaction' tool with what is available. "
        "Once the tool is called, provide the exact confirmation: '✅ **Interaction logged successfully!** The details (HCP Name, Date, Attendees, and Materials) have been automatically populated based on your summary. Would you like me to suggest a specific follow-up action, such as scheduling a meeting?'"
    )
    
    # Prepend system prompt to the messages for the LLM call
    llm_messages = [{"role": "system", "content": system_prompt}] + messages
    response = model_with_tools.invoke(llm_messages)
    return {"messages": [response]}

def should_continue(state: AgentState):
    messages = state['messages']
    last_message = messages[-1]
    if not last_message.tool_calls:
        return "end"
    return "continue"

# Define the graph
workflow = StateGraph(AgentState)

workflow.add_node("agent", call_model)
workflow.add_node("action", ToolNode(crm_tools))

workflow.set_entry_point("agent")

workflow.add_conditional_edges(
    "agent",
    should_continue,
    {
        "continue": "action",
        "end": END
    }
)

workflow.add_edge("action", "agent")

app = workflow.compile()

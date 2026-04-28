import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { updateField, addMessage, setSaving } from '../store/interactionSlice';
import { Send, Search, Mic, Plus, Bot } from 'lucide-react';
import axios from 'axios';

const LogInteractionScreen: React.FC = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.interaction);
  const { hcpName, interactionType, date, time, attendees, topicsDiscussed, materialsShared, samplesDistributed, sentiment, outcomes, followUpActions, suggestedFollowUps, messages, isSaving } = state;
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText;
    dispatch(addMessage({ role: 'user', content: userMessage }));
    setInputText('');

    try {
      const response = await axios.post('http://localhost:8000/chat', {
        message: userMessage,
        hcp_id: "demo_hcp",
        history: messages.map(m => ({ role: m.role, content: m.content }))
      });

      const aiResponse = response.data.response;
      dispatch(addMessage({ role: 'assistant', content: aiResponse }));

      if (response.data.tool_calls) {
        response.data.tool_calls.forEach((call: any) => {
          if (call.name === 'log_interaction') {
            const args = call.args;
            if (args.hcp_name) dispatch(updateField({ field: 'hcpName', value: args.hcp_name }));
            if (args.interaction_type) dispatch(updateField({ field: 'interactionType', value: args.interaction_type }));
            if (args.attendees) dispatch(updateField({ field: 'attendees', value: args.attendees }));
            if (args.topics_discussed) dispatch(updateField({ field: 'topicsDiscussed', value: args.topics_discussed }));
            if (args.materials_shared) dispatch(updateField({ field: 'materialsShared', value: args.materials_shared }));
            if (args.samples_distributed) dispatch(updateField({ field: 'samplesDistributed', value: args.samples_distributed }));
            if (args.sentiment) dispatch(updateField({ field: 'sentiment', value: args.sentiment }));
            if (args.outcomes) dispatch(updateField({ field: 'outcomes', value: args.outcomes }));
            if (args.follow_up_actions) dispatch(updateField({ field: 'followUpActions', value: args.follow_up_actions }));
            if (args.suggested_follow_ups) dispatch(updateField({ field: 'suggestedFollowUps', value: args.suggested_follow_ups }));
          }
        });
      }
    } catch (error) {
      dispatch(addMessage({ role: 'assistant', content: "Sorry, I'm having trouble connecting to the brain." }));
    }
  };

  return (
    <div className="app-container" style={{ gridTemplateColumns: 'minmax(0, 1fr) 420px' }}>
      {/* Main Form Area */}
      <main className="main-content">
        <div style={{ paddingBottom: '100px' }}>
          <div className="card">
            <h1 style={{ color: '#404040', fontSize: '24px', fontWeight: 700, marginBottom: '30px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>Log HCP Interaction</h1>
            
            <h3 className="section-header">Interaction Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', marginBottom: '25px' }}>
              <div className="input-group"><label>HCP Name</label><input value={hcpName} onChange={(e) => dispatch(updateField({ field: 'hcpName', value: e.target.value }))} /></div>
              <div className="input-group"><label>Interaction Type</label><select value={interactionType} onChange={(e) => dispatch(updateField({ field: 'interactionType', value: e.target.value }))}><option>Meeting</option><option>Email</option><option>Lunch</option></select></div>
              <div className="input-group"><label>Date</label><input type="date" value={date} onChange={(e) => dispatch(updateField({ field: 'date', value: e.target.value }))} /></div>
              <div className="input-group"><label>Time</label><input type="time" value={time} onChange={(e) => dispatch(updateField({ field: 'time', value: e.target.value }))} /></div>
            </div>

            <h3 className="section-header">Attendees</h3>
            <div className="input-group" style={{ marginBottom: '25px' }}><input value={attendees} onChange={(e) => dispatch(updateField({ field: 'attendees', value: e.target.value }))} /></div>

            <h3 className="section-header">Topics Discussed</h3>
            <div className="input-group" style={{ marginBottom: '30px' }}><textarea rows={3} value={topicsDiscussed} onChange={(e) => dispatch(updateField({ field: 'topicsDiscussed', value: e.target.value }))} /><button className="btn" style={{ marginTop: '12px', backgroundColor: '#f1f5f9', color: '#475569' }}>✨ Summarize from Voice Note</button></div>

            <h3 className="section-header">Materials Shared / Samples Distributed</h3>
            <div className="input-group"><label>Materials Shared</label><div className="materials-box">{materialsShared || "No materials added."}<button className="btn-small"><Search size={12} /> Search/Add</button></div></div>
            <div className="input-group" style={{ marginTop: '20px' }}><label>Samples Distributed</label><div className="materials-box">{samplesDistributed || "No samples added."}<button className="btn-small"><Plus size={12} /> Add Sample</button></div></div>

            <h3 className="section-header">HCP Sentiment</h3>
            <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
              {['Positive', 'Neutral', 'Negative'].map((s) => (<label key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="radio" checked={sentiment === s} onChange={() => dispatch(updateField({ field: 'sentiment', value: s }))} />{s === 'Positive' ? '😃' : s === 'Neutral' ? '😐' : '☹️'} {s}</label>))}
            </div>

            <h3 className="section-header">Outcomes & Follow-ups</h3>
            <div className="input-group"><label>Key Outcomes</label><textarea rows={3} value={outcomes} onChange={(e) => dispatch(updateField({ field: 'outcomes', value: e.target.value }))} /></div>
            <div className="input-group" style={{ marginTop: '20px' }}><label>Follow-up Actions</label><textarea rows={3} value={followUpActions} onChange={(e) => dispatch(updateField({ field: 'followUpActions', value: e.target.value }))} /></div>

            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '15px' }}>AI Suggested Next Steps:</p>
              {suggestedFollowUps.map((t, i) => (<div key={i} style={{ color: '#0ea5e9', fontSize: '14px', marginBottom: '8px', cursor: 'pointer' }}>+ {t}</div>))}
            </div>
          </div>
        </div>
      </main>

      {/* Modern AI Side Panel */}
      <aside className="side-panel">
        <div className="chat-card">
          <div style={{ padding: '20px 25px', borderBottom: '1px solid rgba(226, 232, 240, 0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>🤖</span>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0ea5e9' }}>AI Assistant</h2>
                <p style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Log Interaction Details here Via Chat</p>
              </div>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role === 'user' ? 'message-user' : 'message-ai'}`} style={msg.content.includes('Interaction logged successfully') ? { backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' } : {}}>
                {msg.content}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div style={{ padding: '20px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '6px' }}>
              <textarea 
                style={{ flex: 1, minHeight: '50px', border: 'none', outline: 'none', resize: 'none', padding: '10px 15px', fontSize: '14px', backgroundColor: 'transparent' }}
                placeholder="Describe the interaction..." 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              />
              <button className="btn btn-primary" style={{ width: '64px', height: '64px', minWidth: '64px', borderRadius: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)' }} onClick={handleSendMessage}>
                <span style={{ fontSize: '20px', fontWeight: 700, lineHeight: '1' }}>A</span>
                <span style={{ fontSize: '10px', fontWeight: 600 }}>Log</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default LogInteractionScreen;

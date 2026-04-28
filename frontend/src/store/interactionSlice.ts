import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface InteractionState {
  hcpName: string;
  interactionType: string;
  date: string;
  time: string;
  attendees: string;
  topicsDiscussed: string;
  materialsShared: string;
  samplesDistributed: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  outcomes: string;
  followUpActions: string;
  suggestedFollowUps: string[];
  messages: Array<{ role: 'user' | 'assistant', content: string }>;
  isSaving: boolean;
}

const initialState: InteractionState = {
  hcpName: '',
  interactionType: 'Meeting',
  date: new Date().toISOString().split('T')[0],
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  attendees: '',
  topicsDiscussed: '',
  materialsShared: '',
  samplesDistributed: '',
  sentiment: 'Neutral',
  outcomes: '',
  followUpActions: '',
  suggestedFollowUps: [
    'Schedule follow-up meeting in 2 weeks',
    'Send OncoBoost Phase III PDF',
    'Add Dr. Sharma to advisory board invite list'
  ],
  messages: [
    { role: 'assistant', content: "Hello! I'm your AI assistant. I can help you log your interaction. What would you like to record?" }
  ],
  isSaving: false,
};

const interactionSlice = createSlice({
  name: 'interaction',
  initialState,
  reducers: {
    updateField: (state, action: PayloadAction<{ field: keyof InteractionState, value: any }>) => {
      (state as any)[action.payload.field] = action.payload.value;
    },
    addMessage: (state, action: PayloadAction<{ role: 'user' | 'assistant', content: string }>) => {
      state.messages.push(action.payload);
    },
    setSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
    syncFromAI: (state, action: PayloadAction<Partial<InteractionState>>) => {
      Object.assign(state, action.payload);
    }
  },
});

export const { updateField, addMessage, setSaving, syncFromAI } = interactionSlice.actions;
export default interactionSlice.reducer;

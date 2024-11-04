// src/services/mockApi.js
const MOCK_DELAY = 1000; // 1 second delay to simulate network

// Mock data
const mockCredits = { credits: 20 };

const mockResponses = [
  "Based on the uploaded document, here are the key findings:\n\n1. Revenue Growth:\n- Overall growth of 15% YoY\n- Digital services increased by 22%\n- New customer acquisition up by 18%\n\n2. Market Performance:\n- Market share expanded to 34%\n- Customer satisfaction score: 4.8/5\n- Retention rate: 92%\n\nWould you like me to elaborate on any specific aspect?",
  "The document analysis reveals:\n\n1. Project Timeline:\n- Phase 1 completion: Q3 2024\n- Key milestones achieved: 7/10\n- Resource utilization: 85%\n\n2. Risk Assessment:\n- Low risk factors: 3\n- Medium risk factors: 2\n- High risk factors: None\n\nLet me know if you need more specific details.",
  "After analyzing the document, here's the summary:\n\n1. Financial Metrics:\n- ROI: 127%\n- Operating costs reduced by 18%\n- Profit margin increased to 31%\n\n2. Operational Efficiency:\n- Process automation: 65%\n- Time savings: 240 hours/month\n- Error reduction: 92%\n\nWould you like to explore any particular area?"
];

let currentCredits = mockCredits.credits;
let mockHistory = [];

// Mock API calls
export const mockApi = {
  // Get credits
  getCredits: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ credits: currentCredits });
      }, MOCK_DELAY);
    });
  },

  // Upload files
  uploadFiles: (files) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        currentCredits -= 1; // Deduct credits for upload
        resolve({
          success: true,
          message: 'Files uploaded successfully',
          filesUploaded: Array.from(files).map(f => f.name)
        });
      }, MOCK_DELAY * 1.5); // Longer delay for upload
    });
  },

  // Query endpoint
  query: (queryText) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        currentCredits -= 1; // Deduct credits for query
        const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        const session = {
          id: Date.now(),
          query: queryText,
          response,
          timestamp: new Date().toISOString()
        };
        mockHistory.push(session);
        resolve({ response });
      }, MOCK_DELAY * 2); // Longer delay for processing query
    });
  },

  // Get chat history
  getChatHistory: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockHistory);
      }, MOCK_DELAY);
    });
  },

  // Get use case details
  getUseCaseDetails: (useCaseId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          useCase: { name: 'Document Q&A' },
          pipeline: { name: 'Demo-Document Q&A' },
          version: { name: 'Version01-Document Q&A' }
        });
      }, MOCK_DELAY);
    });
  },

  // Update use case details
  updateUseCaseDetails: (useCaseId, updates) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          ...updates
        });
      }, MOCK_DELAY);
    });
  }
};
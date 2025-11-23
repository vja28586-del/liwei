
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { INITIAL_SYSTEM_INSTRUCTION } from '../constants';
import { QuizQuestion, TopicType } from '../types';

let client: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!client) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is missing from environment variables.");
      throw new Error("API Key not found. Please ensure process.env.API_KEY is set.");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

export const generateExplanation = async (topicTitle: string, topicType: TopicType, moduleContext: string): Promise<string> => {
  const ai = getClient();
  
  let prompt = "";

  if (topicType === 'theory') {
    prompt = `
      Role: Expert AWS Historian & Architect.
      Task: Explain the concept "${topicTitle}" within the module "${moduleContext}".
      
      **Structure Requirement (Theory Mode):**
      1.  **The Problem 🛑**: What was the pain point in the "old days" (on-premise or early cloud)?
      2.  **The Evolution ⏳**: How did technology evolve to solve this? (e.g., Physical -> VM -> Container).
      3.  **Core Concept 💡**: How does this specific service work? Use a clear analogy.
      4.  **2025 Best Practice 🚀**: What is the modern standard today?
    `;
  } else {
    prompt = `
      Role: Senior DevOps Mentor.
      Task: Guide the user through a hands-on lab for "${topicTitle}" within "${moduleContext}".
      
      **Structure Requirement (Lab Mode):**
      1.  **Scenario 🏙️**: Briefly describe what we are building and why.
      2.  **Prerequisites 📋**: What do we need? (e.g., "A basic VPC").
      3.  **Step-by-Step Guide 🛠️**: 
          - Provide clear instructions (Console clicks or CLI commands).
          - If explaining code, provide the snippet.
          - Explain *why* we are doing each step.
      4.  **Verification ✅**: How do we test if it worked?
      5.  **Cleanup 🧹**: Remind to delete resources to avoid costs.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: INITIAL_SYSTEM_INSTRUCTION,
      }
    });
    return response.text || "抱歉，内容生成失败。";
  } catch (error) {
    console.error("Error generating explanation:", error);
    return "生成内容时出错，请检查网络。";
  }
};

export const generateQuiz = async (moduleTitle: string): Promise<QuizQuestion[]> => {
  const ai = getClient();
  
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING },
        options: { 
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        correctIndex: { type: Type.INTEGER },
        explanation: { type: Type.STRING }
      },
      required: ['question', 'options', 'correctIndex', 'explanation']
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate 3 tough scenarios/troubleshooting questions about ${moduleTitle}. Focus on architectural decisions and modern best practices.`,
      config: {
        systemInstruction: INITIAL_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as QuizQuestion[];
  } catch (error) {
    console.error("Error generating quiz:", error);
    return [];
  }
};

export const chatWithTutor = async (message: string, history: {role: 'user' | 'model', text: string}[]): Promise<string> => {
  const ai = getClient();
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: INITIAL_SYSTEM_INSTRUCTION,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text || "我没有理解，请再说一遍。";
  } catch (error) {
    console.error("Chat error:", error);
    return "聊天服务暂时不可用。";
  }
};

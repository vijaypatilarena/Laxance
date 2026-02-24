import { GoogleGenerativeAI } from "@google/generative-ai";
import { CURRENCY_SYMBOLS } from "./currency";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const modelName = "gemini-2.0-flash-lite";

export interface FinancialData {
    income: number;
    expenses: number;
    transactions: any[];
    goals: any[];
    currency?: string;
    frequency?: string;
}

export async function getAIAnalysis(data: FinancialData) {
    if (!process.env.GEMINI_API_KEY) {
        return getHeuristicAnalysis(data);
    }

    const model = genAI.getGenerativeModel({ model: modelName });

    const currency = data.currency || "GBP (£)";
    const symbol = CURRENCY_SYMBOLS[currency] || "£";

    const prompt = `
    You are a professional financial advisor for a high-end finance app called Laxance.
    Analyze the following user financial data and provide structured insights. 
    The user prefers a **${data.frequency || 'Daily'}** analysis cadence.
    All monetary values are in ${currency} (Symbol: ${symbol}).
    
    Data:
    - Total Monthly Income: ${symbol}${data.income}
    - Total Monthly Expenses: ${symbol}${data.expenses}
    - Recent Transactions: ${JSON.stringify(data.transactions.slice(0, 10))}
    - Current Goals: ${JSON.stringify(data.goals)}

    Provide your response in raw JSON format with the following keys:
    - "savingsRatio": (number, 0-100)
    - "topCategories": (array of { name, value, color })
    - "shifts": (array of { title, description, type: 'positive' | 'warning' })
    - "wealthStrategy": (string, 1-2 paragraphs)
    
    Be specific, premium, and actionable.
  `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        // Clean JSON if needed
        const jsonStr = text.replace(/```json|```/g, "").trim();
        return JSON.parse(jsonStr);
    } catch (error: any) {
        console.error("AI Analysis Error:", error?.message || error);
        return getHeuristicAnalysis(data);
    }
}

function getHeuristicAnalysis(data: FinancialData) {
    const savings = data.income - data.expenses;
    const ratio = data.income > 0 ? (savings / data.income) * 100 : 0;

    // Group transactions by category
    const categories: Record<string, number> = {};
    data.transactions.forEach(tx => {
        categories[tx.category] = (categories[tx.category] || 0) + tx.amount;
    });

    const sortedCats = Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([name, value], i) => ({
            name,
            value,
            color: ['#000', '#333', '#666', '#999'][i]
        }));

    const currency = data.currency || "GBP (£)";
    const symbol = CURRENCY_SYMBOLS[currency] || "£";

    return {
        savingsRatio: ratio.toFixed(1),
        topCategories: sortedCats.length > 0 ? sortedCats : [{ name: 'N/A', value: 0, color: '#000' }],
        shifts: [
            {
                title: "Savings Velocity",
                description: ratio > 20
                    ? `Impressive! You are saving ${ratio.toFixed(1)}% of your income. Consider moving ${symbol}${(savings * 0.5).toFixed(0)} to a high-yield account.`
                    : `Your savings rate is ${ratio.toFixed(1)}%. AI recommends aiming for 20% by cutting discretionary ${sortedCats[0]?.name || 'spending'}.`,
                type: ratio > 20 ? 'positive' : 'warning'
            },
            {
                title: "Expense Anomaly",
                description: `Your top expense is ${sortedCats[0]?.name || 'Unknown'} at ${symbol}${sortedCats[0]?.value || 0}. This is ${((sortedCats[0]?.value || 0) / data.expenses * 100).toFixed(0)}% of your total spend.`,
                type: 'warning'
            }
        ],
        wealthStrategy: `Based on your debt-to-income profile, the engine has calculated a "Financial Freedom" score of ${(ratio * 1.5).toFixed(0)}/100. To accelerate your wealth, prioritize the ${data.goals[0]?.title || 'emergency fund'} by increasing monthly contributions by 5%.`
    };
}

export async function getAIChatResponse(message: string, data: FinancialData, history: { role: string, content: string }[] = []) {
    if (!process.env.GEMINI_API_KEY) {
        return "AI Chat is currently in fallback mode. Please provide a GEMINI_API_KEY in .env.local for full intelligence.";
    }

    const model = genAI.getGenerativeModel({ model: modelName });

    const currency = data.currency || "GBP (£)";
    const symbol = CURRENCY_SYMBOLS[currency] || "£";

    // Format history for Gemini
    const chatHistory = history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
    }));

    const systemContext = `
    You are the Laxance Financial AI, an elite wealth architect and advisor.
    You have absolute visibility into the following real-time financial metrics for the user:
    - Current Monthly Income: ${symbol}${data.income}
    - Current Monthly Expenses: ${symbol}${data.expenses}
    - Recent Transaction History: ${JSON.stringify(data.transactions)}
    - Active Financial Goals: ${JSON.stringify(data.goals)}
    - System Currency: ${currency}
    
    Current Savings Ratio: ${data.income > 0 ? ((data.income - data.expenses) / data.income * 100).toFixed(1) : 0}%

    Voice Guidelines:
    - Tone: Sophisticated, authoritative, yet encouraging (the 'Laxance' brand).
    - Be data-driven. When the user asks "How am I doing?", reference their savings ratio and progress toward their specific goals.
    - If they have no transactions, suggest they start by logging their first income or expense.
    - If they have large expenses, identify the categories and suggest specific optimizations.
    - Keep responses concise but high-value.
    `;

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: systemContext }],
            },
            {
                role: "model",
                parts: [{ text: "Understood. I am your Laxance Financial AI advisor. I have analyzed your transactions, income, and goals. How can I assist you with your wealth strategy today?" }],
            },
            ...chatHistory
        ],
    });

    try {
        const result = await chat.sendMessage(message);
        return result.response.text();
    } catch (error: any) {
        console.error("Gemini Chat Error:", error?.message || error);
        if (error.message?.includes("404") || error.message?.includes("not found")) {
            return "The AI model is currently experiencing connectivity issues. Please try again in a moment.";
        }
        if (error.message?.includes("429") || error.message?.includes("quota") || error.message?.includes("Too Many Requests")) {
            return "You've reached the AI rate limit. Please wait about a minute and try again. Your financial data is safe and ready.";
        }
        return "I encountered an issue processing your request. Please try again shortly.";
    }
}

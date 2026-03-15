"use client";
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, User, RefreshCw, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
    id: string;
    role: 'bot' | 'user';
    content: string;
    actionableLinks?: { label: string, icon: any, href: string }[];
};

const INITIAL_MESSAGE: Message = {
    id: 'msg-0',
    role: 'bot',
    content: "Hi there! I'm your AI Business Advisor. I actively analyze your shop's performance, inventory levels, and competitor pricing. How can I help you grow your shoe business today?",
};

const SUGGESTIONS = [
    "What shoes are low in stock?",
    "How can I increase profit this month?",
    "Should I drop the Nike Air Max price?",
    "Analyze my biggest competitors."
];

const AIAssistant = () => {
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;

        const newUserMessage: Message = { id: Date.now().toString(), role: 'user', content: text };
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue("");
        setIsTyping(true);

        // Simulate AI Thinking and Response
        setTimeout(() => {
            let responseContent = "";
            let actionableLinks: { label: string, icon: any, href: string }[] | undefined = undefined;

            const lower = text.toLowerCase();
            
            if (lower.includes("stock") || lower.includes("inventory")) {
                responseContent = "I've checked your inventory. The **Jordan 1 Retro High** is critically low (only 12 pairs left). Considering recent high demand, I recommend you re-order soon. Would you like to review your stock right now?";
                actionableLinks = [{ label: "View Low Stock Items", icon: AlertTriangle, href: "/inventory" }];
            } else if (lower.includes("profit") || lower.includes("revenue") || lower.includes("increase")) {
                responseContent = "To increase profit this month, I noticed you have surplus stock of **Skechers Go Walk 6** (120 pairs). You should run a 10% discount to clear aging inventory and free up capital. Also, festival season is approaching, so it is a good time to raise margins on premium Jordans.";
                actionableLinks = [{ label: "Check Sales Analytics", icon: TrendingUp, href: "/sales" }];
            } else if (lower.includes("competitor") || lower.includes("market") || lower.includes("price")) {
                responseContent = "Looking at the competition (Amazon, Myntra, Flipkart), your prices on **Adidas Ultraboost** are currently 5% higher than the market average. To capture more sales volume, consider using my Prediction Model to find the absolute optimal price point for this specific month.";
                actionableLinks = [{ label: "Run Price Predictions", icon: Sparkles, href: "/recommendations" }];
            } else {
                responseContent = "That's a great question. As your AI assistant, I continuously monitor local demand signals and competitor pricing. Based on current analytics, your highest potential for growth lies in optimizing the pricing of your top 3 selling shoes. Let's look at the predictions.";
                actionableLinks = [{ label: "Go to Predictions", icon: BarChart3, href: "/recommendations" }];
            }

            const newBotMessage: Message = { 
                id: (Date.now() + 1).toString(), 
                role: 'bot', 
                content: responseContent,
                actionableLinks
            };

            setIsTyping(false);
            setMessages(prev => [...prev, newBotMessage]);
        }, 1500 + Math.random() * 1000); // 1.5 - 2.5s delay
    };

    return (
        <div className="p-8 h-[100vh] flex flex-col bg-slate-50">
            <header className="mb-6 flex-shrink-0">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
                        <Bot size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">AI Business Advisor</h1>
                        <p className="text-slate-500 font-medium text-sm mt-0.5 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Proactively monitoring your shop data
                        </p>
                    </div>
                </div>
            </header>

            <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col overflow-hidden">
                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'bot' && (
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3 flex-shrink-0 mt-1">
                                    <Sparkles size={14} />
                                </div>
                            )}
                            
                            <div className={`max-w-[75%] rounded-2xl p-4 ${
                                msg.role === 'user' 
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-100 rounded-br-sm' 
                                    : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-bl-sm'
                            }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                
                                {msg.actionableLinks && (
                                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                                        {msg.actionableLinks.map((link, i) => (
                                            <a 
                                                key={i} 
                                                href={link.href}
                                                className="w-full text-xs font-bold text-indigo-600 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors flex items-center gap-2"
                                            >
                                                <link.icon size={14} />
                                                {link.label}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 ml-3 flex-shrink-0 mt-1 pb-1">
                                    <User size={14} />
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3 mt-1">
                                <Sparkles size={14} />
                            </div>
                            <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-bl-sm p-4 flex gap-1 items-center">
                                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100">
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
                        {SUGGESTIONS.map((suggestion, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSendMessage(suggestion)}
                                className="whitespace-nowrap px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-full hover:bg-slate-50 hover:border-slate-300 transition-colors"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                    
                    <form 
                        onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }} 
                        className="flex items-center gap-3 relative"
                    >
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask about inventory, pricing strategies, or market trends..."
                            className="w-full pl-6 pr-14 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-200 focus:bg-white outline-none text-sm transition-all"
                            disabled={isTyping}
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className={`absolute right-2 p-2.5 rounded-xl flex items-center justify-center transition-all ${
                                inputValue.trim() && !isTyping 
                                    ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;

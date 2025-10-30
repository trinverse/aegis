
import React, { useState, useRef, useEffect } from 'react';
import type { Chat } from '@google/genai';
import { createPreparednessChat } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { SendIcon } from './icons/SendIcon';
import { SparklesIcon } from './icons/SparklesIcon';

const PublicPreparedness: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initChat = () => {
            const newChat = createPreparednessChat();
            setChat(newChat);
        };
        initChat();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !chat || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);
        setError(null);
        
        try {
            const stream = await chat.sendMessageStream({ message: userInput });
            let modelResponse = '';
            setMessages(prev => [...prev, { sender: 'model', text: '' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { sender: 'model', text: modelResponse };
                    return newMessages;
                });
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to get response: ${errorMessage}`);
            setMessages(prev => prev.filter(msg => msg !== userMessage));
        } finally {
            setIsLoading(false);
        }
    };

    const suggestedQuestions = [
        "What should be in a basic emergency kit?",
        "How do I create a family evacuation plan?",
        "What's the best way to prepare for a power outage?",
        "How to stay safe during a wildfire?",
    ];

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-2xl">
            <header className="p-4 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6" />
                    Public Preparedness Guide
                </h2>
                <p className="text-sm text-gray-400 mt-1">Ask anything about emergency preparedness.</p>
            </header>
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 h-full flex flex-col justify-center">
                        <p className="mb-4">No messages yet. Start the conversation!</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {suggestedQuestions.map(q => (
                                <button key={q} onClick={() => setUserInput(q)} className="p-3 bg-gray-700/50 rounded-lg text-sm text-gray-300 hover:bg-gray-700 transition-colors">
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'model' && <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">AI</div>}
                            <div className={`max-w-xl p-3 rounded-xl ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))
                )}
                {isLoading && messages[messages.length - 1]?.sender === 'user' && (
                     <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">AI</div>
                        <div className="max-w-xl p-3 rounded-xl bg-gray-700 text-gray-200">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
             {error && <p className="text-red-400 text-sm px-6 pb-2">{error}</p>}
            <footer className="p-4 border-t border-gray-700">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ask about creating a plan, building a kit, etc."
                        className="flex-1 bg-gray-700 border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white p-3"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !userInput.trim()} className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors">
                        <SendIcon className="w-6 h-6" />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default PublicPreparedness;

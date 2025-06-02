import React, { useState } from "react";
import { FaTwitter, FaYoutube, FaDiscord, FaReddit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";




function Home() {
    const [prompt, setPrompt] = useState("");
    
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            navigate('/chat', { 
                state: { 
                    prompt
                } 
            });
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div
            className="h-screen  bg-radial-[at_5%_5%] from-slate-900 via-blue-800 to-black to-100%"
            style={{ fontFamily: "'Playpen Sans Thai',cursive" }}
        >
            <div className="">
                <div className="flex flex-row justify-between items-center p-6">
                    <h1 className="text-4xl font-bold text-white tracking-wider">Bolt</h1>

                    <div className="flex gap-6">
                        <span className="text-2xl text-white hover:text-blue-400 cursor-pointer transition-all duration-300 hover:scale-110">
                            <FaTwitter />
                        </span>
                        <span className="text-2xl text-white hover:text-red-500 cursor-pointer transition-all duration-300 hover:scale-110">
                            <FaYoutube />
                        </span>
                        <span className="text-2xl text-white hover:text-indigo-400 cursor-pointer transition-all duration-300 hover:scale-110 ">
                            <FaDiscord />
                        </span>
                        <span className="text-2xl text-white hover:text-orange-500 cursor-pointer transition-all duration-300 hover:scale-110">
                            <FaReddit />
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center pt-30">
                <h1 className="text-4xl text-white animate-pulse">What do you want to build?</h1>
            </div>
            <div className="flex flex-col items-center">
                <h4 className="text-2xl text-gray-400 ">Prompt, run, edit, and deploy full-stack web and mobile apps.</h4>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col items-center pt-10">
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="How can Bolt help you today?"
                    className="w-[600px] h-36 p-4 rounded-lg bg-slate-800/30 border border-blue-500/50 text-slate-300 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40 shadow-lg shadow-blue-500/20 backdrop-blur-sm transition-all duration-300 hover:border-blue-400 animate-float"
                />
            </form>
        </div>
    );
}

export default Home;

import React, { useState } from 'react';
import { LogOut, Bell, Settings, Plus,ChevronDown } from 'lucide-react';
import purplebg from '../assets/purplebg.png'

export default function AdminPanel() {
    const [questionType, setQuestionType] = useState('multiple-choice');

    return (
        <div className="min-h-screen text-white p-8 font-sans flex items-center justify-center bg-cover " style={{ backgroundImage: `url(${purplebg})` }}>
            <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-5 relative">
                {/* LEFT COLUMN: Profile & Stats */}
                <div className="md:col-span-4 flex flex-col justify-between min-h-[600px]">

                    {/* Profile Card */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-50"></div>
                        <div className="w-20 h-20 rounded-full border-2 border-cyan-400 p-1 mb-3 relative z-10">
                            <img
                                src="unsplash.com"
                                alt="Aditya Singh"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                        <h2 className="text-xl font-semibold relative z-10">Aditya Singh</h2>
                        <button className="text-xs text-gray-400 hover:text-cyan-400 transition mt-1 relative z-10">Edit Profile</button>
                    </div>

                    {/* Stats Cards Container */}
                    <div className="flex flex-col gap-4 mt-6 flex-grow justify-center">
                        {/* Total Questions */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg">
                            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">Total Questions Added:</p>
                            <p className="text-4xl font-extrabold mt-1 text-white">157</p>
                        </div>

                        {/* History Questions */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg flex-grow overflow-hidden flex flex-col">
                            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-3">Recently Added Questions:</p>
                            <div className="space-y-3 overflow-y-auto pr-2 max-h-[300px]">
                                {[  
                                    "Where is the library located?",
                                    "What are the admission requirements for B.Tech?",
                                    "Who is the HOD of CS department?",
                                    "What is the placement record for 2023?",
                                    "How to apply for a scholarship?",
                                      "Where is the library located?",
                                    "What are the admission requirements for B.Tech?",
                                    "Who is the HOD of CS department?",
                                    "What is the placement record for 2023?",
                                    "How to apply for a scholarship?",
                                      "Where is the library located?",
                                    "What are the admission requirements for B.Tech?",
                                    "Who is the HOD of CS department?",
                                    "What is the placement record for 2023?",
                                    "How to apply for a scholarship?"
                                ].map((q, i) => (
                                    <div key={i} className="text-sm text-gray-300 border-b border-white/5 pb-2 hover:text-cyan-400 cursor-pointer transition">
                                        {i + 1}. {q}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    

                    
                </div>

                {/* RIGHT COLUMN: Form Area */}
                <div className="md:col-span-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden">

                    {/* Header Icons */}
                    <div className="absolute top-0 right-6 flex items-center gap-6 text-gray-400">
                        <button className="mt-2 flex items-center justify-center gap-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl py-2 px-5 text-sm font-bold text-white  hover:bg-white/10 hover:text-white transition w-max">
                            <span>LOGOUT</span>
                            <LogOut size={16} />
                        </button>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <h3 className="text-xl font-semibold mb-6">Add / Edit Knowledge Base</h3>

                            {/* Category */}
                            <label className="block text-xs font-medium text-gray-700 mb-2">Category</label>
                            <div className="relative">
                                <select className="w-full bg-slate-700 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 appearance-none focus:outline-none focus:border-cyan-500 transition">
                                    <option>General</option>
                                    <option>Acadamics</option>
                                    <option>Admission</option>
                                    <option>HOD</option>
                                    <option>Facilities</option>
                                    <option>Placement</option>


                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                   <ChevronDown size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Questions Fields */}
                        <div className="space-y-3">
                            <label className="block text-xs font-medium text-gray-400">Questions:</label>

                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Question Field"
                                    className="w-full bg-slate-900/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Question Field"
                                    className="w-full bg-slate-900/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Question Field"
                                    className="w-full bg-slate-900/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Question Field"
                                    className="w-full bg-slate-900/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                                />
                            </div>
                        </div>

                        {/* Answer Text */}
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Answer Text:</label>
                            <textarea
                                rows="4"
                                className="w-full bg-slate-900/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition resize-none"
                                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                            />
                        </div>
                        {/* Keywords */}
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Keywords:</label>
                            <textarea
                                rows="2"
                                className="w-full bg-slate-900/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition resize-none"
                                placeholder="Enter keywords separated by commas address, location ,etc"
                            />
                        </div>
                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-cyan-600 text-slate-950 font-bold text-sm py-4 rounded-xl shadow-lg shadow-cyan-500/20 uppercase tracking-wider transition mt-4"
                        >
                            Save Question
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
import React, { useState, useEffect, useContext } from 'react';
import { LogOut, Bell, Settings, Plus, ChevronDown, Loader2, Trash2, Edit3, UserCircle, X } from 'lucide-react';
import purplebg from '../assets/purplebg.png'
import axios from 'axios';
import { userDataContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
    const { serverUrl } = useContext(userDataContext);
    const navigate = useNavigate();
    
    // State for FAQs and Stats
    const [recentFaqs, setRecentFaqs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [adminData, setAdminProfile] = useState({ username: 'Admin', email: '' });

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileFormData, setProfileFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    // Form State
    const [formData, setFormData] = useState({
        category: 'General',
        question: '',
        alt1: '',
        alt2: '',
        alt3: '',
        answer: '',
        keywords: ''
    });

    const fetchAdminData = async () => {
        try {
            const [faqsRes, profileRes] = await Promise.all([
                axios.get(`${serverUrl}/admin/get-faqs`, { withCredentials: true }),
                axios.get(`${serverUrl}/admin/profile`, { withCredentials: true })
            ]);
            setRecentFaqs(faqsRes.data.faqs || []);
            setAdminProfile(profileRes.data.admin);
            setProfileFormData({
                username: profileRes.data.admin.username,
                email: profileRes.data.admin.email,
                password: ''
            });
        } catch (error) {
            console.error("Fetch Error:", error);
            // If unauthorized, send to login
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate('/admin-login');
            }
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.get(`${serverUrl}/admin/logout`, { withCredentials: true });
            toast.success("Logged out successfully");
            navigate('/');
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    const handleSaveQuestion = async (e) => {
        e.preventDefault();
        if (!formData.question || !formData.answer) {
            return toast.warn("Question and Answer are required!");
        }

        setLoading(true);
        try {
            // Combine alternate questions
            const alternateQuestionsArray = [formData.alt1, formData.alt2, formData.alt3]
                .filter(q => q.trim() !== "");


            const payload = {
                category: formData.category.toLowerCase(),
                question: formData.question,
                answer: formData.answer,
                keywords: formData.keywords,
                alternateQuestions: alternateQuestionsArray
            };

            let res;
            if (formData.id) {
                res = await axios.put(`${serverUrl}/admin/update-faq/${formData.id}`, payload, { withCredentials: true });
            } else {
                res = await axios.post(`${serverUrl}/admin/add-faq`, payload, { withCredentials: true });
            }
            
            if (res.data.success) {
                toast.success(formData.id ? "FAQ updated successfully!" : "Knowledge base updated!");
                setFormData({
                    category: 'General',
                    question: '',
                    alt1: '',
                    alt2: '',
                    alt3: '',
                    answer: '',
                    keywords: ''
                });
                fetchAdminData(); // Refresh list
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error saving question");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFaq = async (id) => {
        if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
        try {
            const res = await axios.delete(`${serverUrl}/admin/delete-faq/${id}`, { withCredentials: true });
            if (res.data.success) {
                toast.success("FAQ deleted successfully");
                fetchAdminData();
            }
        } catch (error) {
            toast.error("Failed to delete FAQ");
        }
    };

    const handleEditClick = (faq) => {
        const alts = Array.isArray(faq.alternateQuestions) ? faq.alternateQuestions : [];
        setFormData({
            id: faq._id,
            category: faq.category.charAt(0).toUpperCase() + faq.category.slice(1),
            question: faq.question,
            alt1: alts[0] || '',
            alt2: alts[1] || '',
            alt3: alts[2] || '',
            answer: faq.answer,
            keywords: Array.isArray(faq.keywords) ? faq.keywords.join(', ') : (faq.keywords || '')
        });
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast.info("FAQ loaded into form for editing");
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!profileFormData.username || !profileFormData.email) {
            return toast.warn("Username and Email are required!");
        }
        setLoading(true);
        try {
            const res = await axios.put(`${serverUrl}/admin/profile`, profileFormData, { withCredentials: true });
            if (res.data.success) {
                toast.success("Profile updated successfully!");
                setAdminProfile(res.data.admin);
                setIsEditingProfile(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen text-white p-8 font-sans flex items-center justify-center bg-cover  " style={{ backgroundImage: `url(${purplebg})` }}>
            <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-5 relative">
                
                {/* Header Icons (Absolute positioned in pre-made UI) */}
                <div className="absolute top-0 right-6 flex items-center gap-6 text-gray-400 z-20">
                    <button 
                        onClick={handleLogout}
                        className="mt-2 flex items-center justify-center gap-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl py-2 px-5 text-sm font-bold text-white hover:bg-white/10 hover:text-white transition w-max cursor-pointer"
                    >
                        <span>LOGOUT</span>
                        <LogOut size={16} />
                    </button>
                </div>

                {/* LEFT COLUMN: Profile & Stats */}
                <div className="md:col-span-4 flex flex-col justify-between min-h-[600px]">

                    {/* Profile Card */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-50"></div>
                        <div className="w-20 h-20 rounded-full border-2 border-cyan-400 p-1 mb-3 relative z-10">
                            <img
                                src="https://tse3.mm.bing.net/th/id/OIP.dCpgPQ0i-xX2gZ-yonm54gHaHa?pid=Api&P=0&h=180"
                                alt="Admin"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                        <h2 className="text-xl font-semibold relative z-10 text-white">{adminData.username}</h2>
                        <button 
                            onClick={() => { setIsEditingProfile(true); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                            className="text-xs text-gray-100 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-cyan-400 transition-all duration-300 mt-2 relative z-10 flex items-center gap-1"
                        >
                            <Edit3 size={12} /> Edit Profile
                        </button>
                    </div>

                    {/* Stats Cards Container */}
                    <div className="flex flex-col gap-4 mt-6 flex-grow justify-center">
                        {/* Total Questions */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg animate-pulse-slow">
                            <p className="text-xs font-bold tracking-wider text-gray-300 uppercase">Total Questions Added:</p>
                            <p className="text-4xl font-extrabold mt-1 text-white">{recentFaqs.length}</p>
                        </div>

                        {/* History Questions */}
                        <div className="bg-white/9 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg flex-grow overflow-hidden flex flex-col">
                            <p className="text-xs font-bold tracking-wider text-gray-300 uppercase mb-3">Recently Added Questions:</p>
                            <div className="space-y-3 overflow-y-scroll pr-2 max-h-[300px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ">
                                {recentFaqs.length > 0 ? recentFaqs.slice(0, 100).map((f, i) => (
                                    <div key={f._id} className="group text-sm text-gray-300 border-b border-white/5 pb-2 flex items-center justify-between hover:text-cyan-400 transition">
                                        <span className="truncate flex-1">{i + 1}. {f.question}</span>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEditClick(f)} className="p-1 hover:bg-white/10 rounded text-blue-400" title="Edit">
                                                <Edit3 size={14} />
                                            </button>
                                            <button onClick={() => handleDeleteFaq(f._id)} className="p-1 hover:bg-white/10 rounded text-red-400" title="Delete">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-xs text-gray-500 italic">No questions found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Form Area */}
                <div className="md:col-span-8 space-y-6">
                    {isEditingProfile ? (
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold flex items-center gap-2"><UserCircle size={24} className="text-cyan-400"/> Edit Admin Profile</h3>
                                <button onClick={() => setIsEditingProfile(false)} className="p-1.5 mt-6 border border-gray-600 hover:bg-white/10 rounded-full transition text-gray-200 hover:text-white">
                                    <X size={25} />
                                </button>
                            </div>
                            
                            <form className="space-y-5" onSubmit={handleUpdateProfile}>
                                <div>
                                    <label className="block text-xs font-medium text-gray-200 mb-2 uppercase tracking-wider">Username</label>
                                    <input
                                        type="text"
                                        value={profileFormData.username}
                                        onChange={(e) => setProfileFormData({...profileFormData, username: e.target.value})}
                                        className="w-full bg-slate-900/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-500 transition"
                                        placeholder="Enter new username"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-medium text-gray-200 mb-2 uppercase tracking-wider">Email Address</label>
                                    <input
                                        type="email"
                                        value={profileFormData.email}
                                        onChange={(e) => setProfileFormData({...profileFormData, email: e.target.value})}
                                        className="w-full bg-slate-900/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-500 transition"
                                        placeholder="Enter new email"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-medium text-gray-200 mb-2 uppercase tracking-wider">New Password (leave blank to keep current)</label>
                                    <input
                                        type="password"
                                        value={profileFormData.password}
                                        onChange={(e) => setProfileFormData({...profileFormData, password: e.target.value})}
                                        className="w-full bg-slate-900/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-500 transition"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-cyan-600 text-slate-950 font-bold text-sm py-4 rounded-xl shadow-lg shadow-cyan-500/20 uppercase tracking-wider transition hover:bg-cyan-500 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Profile"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">

                    <form className="space-y-4" onSubmit={handleSaveQuestion}>
                        <div>
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-xl font-semibold">{formData.id ? "Edit FAQ" : "Add Knowledge Base"}</h3>
                                {formData.id && (
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({
                                            category: 'General',
                                            question: '',
                                            alt1: '',
                                            alt2: '',
                                            alt3: '',
                                            answer: '',
                                            keywords: ''
                                        })}
                                        className="text-xs bg-red-500/40 text-white font-semibold px-5 py-2 mt-5 rounded-lg hover:bg-red-300/20 transition cursor-pointer"
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                            </div>

                            {/* Category */}
                            <label className="block text-xs font-medium text-gray-200 mb-2">Category</label>
                            <div className="relative">
                                <select 
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    className="w-full bg-slate-700 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 appearance-none focus:outline-none focus:border-cyan-500 transition"
                                >
                                    <option>General</option>
                                    <option>Academics</option>
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
                            <label className="block text-xs font-medium text-gray-200">Questions:</label>

                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Primary Question"
                                    value={formData.question}
                                    onChange={(e) => setFormData({...formData, question: e.target.value})}
                                    className="w-full bg-slate-900/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Alternate Question 1"
                                    value={formData.alt1}
                                    onChange={(e) => setFormData({...formData, alt1: e.target.value})}
                                    className="w-full bg-slate-900/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-white/20 transition"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Alternate Question 2"
                                    value={formData.alt2}
                                    onChange={(e) => setFormData({...formData, alt2: e.target.value})}
                                    className="w-full bg-slate-900/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-white/20 transition"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Alternate Question 3"
                                    value={formData.alt3}
                                    onChange={(e) => setFormData({...formData, alt3: e.target.value})}
                                    className="w-full bg-slate-900/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-white/20 transition"
                                />
                            </div>
                        </div>

                        {/* Answer Text */}
                        <div>
                            <label className="block text-xs font-medium text-gray-200 mb-2">Answer Text:</label>
                            <textarea
                                rows="4"
                                value={formData.answer}
                                onChange={(e) => setFormData({...formData, answer: e.target.value})}
                                className="w-full bg-slate-900/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition resize-none"
                                placeholder="Provide the answer here..."
                            />
                        </div>
                        {/* Keywords */}
                        <div>
                            <label className="block text-xs font-medium text-gray-200 mb-2">Keywords:</label>
                            <textarea
                                rows="2"
                                value={formData.keywords}
                                onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                                className="w-full bg-slate-900/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition resize-none"
                                placeholder="address, location, fees, etc."
                            />
                        </div>
                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-cyan-600 text-slate-950 font-bold text-sm py-4 rounded-xl shadow-lg shadow-cyan-500/20 uppercase tracking-wider transition mt-4 flex items-center justify-center gap-2 hover:bg-cyan-500 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (formData.id ? "Update FAQ" : "Save Question")}
                        </button>
                    </form>
                    </div>
                    )}
                </div>

            </div>
        </div>
    );
}
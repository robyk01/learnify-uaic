import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useParams } from "react-router-dom";

import { IoPencil } from "react-icons/io5";
import { IoMdCheckbox } from "react-icons/io";


export default function Profile(){
    const { username } = useParams();
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true);
    const [rank, setRank] = useState(0)
    const [finishedLessons, setFinishedLessons] = useState([])
    const [currUserId, setCurrUserId] = useState(null)

    const [isEditingName, setIsEditingName] = useState(false)
    const [newName, setNewName] = useState("")
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")

    const [uploadingAvatar, setUploadingAvatar] = useState(false)

    useEffect(() => {
        const getProfile = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            setCurrUserId(user?.id);
            
            let profileQuery;

            if (username){
                profileQuery = supabase.from('profiles').select('*').eq('username', username).single();
            } else {
                if (!user) {
                    setLoading(false);
                    return; 
                }
                profileQuery = supabase.from('profiles').select('*').eq('id', user.id).single();
            }

            const profileResult = await profileQuery;
            const userData = profileResult.data;

            if (!userData) {
                setLoading(false);
                return; 
            }
            
            setProfile(userData);
            setNewName(userData.username)
            
            const { count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .gt('xp', userData.xp);

            setRank((count || 0) + 1);

            const {data: progressData} = await supabase
            .from('user_progress')
            .select('completed_at, lesson_id')
            .eq('user_id', userData.id)
            .order('completed_at', { ascending: false})
            .limit(10)
            
            if (progressData && progressData.length > 0) {
                const lessonIds = progressData.map(item => item.lesson_id);

                const {data: lessonData} = await supabase
                .from('lessons')
                .select('id, title, slug, lesson_type')
                .in('id', lessonIds)

                if (lessonData){
                    const combinedList = progressData.map(progress => {
                        const lessonDetails = lessonData.find(l => l.id === progress.lesson_id);
                        return {
                            created_at: progress.completed_at,
                            lessons: lessonDetails
                        };
                    });

                    setFinishedLessons(combinedList)
                }
            }

            setLoading(false);
            };
            
        getProfile();

    }, []);

    const validateUsername = (username) => {
        const trimmed = username.trim();
        
        if (!trimmed) {
            return "Numele nu poate fi gol!";
        }
        if (trimmed.length < 3) {
            return "Numele trebuie să aibă cel puțin 3 caractere!";
        }
        if (trimmed.length > 20) {
            return "Numele trebuie să aibă maxim 20 de caractere!";
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
            return "Numele poate conține doar litere, cifre, _ și -";
        }
        return null;
    };

    const handleSaveUsername = async () => {
        setError("");

        // Client-side validation
        const validationError = validateUsername(newName);
        if (validationError) {
            setError(validationError);
            return;
        }

        if (newName.trim() === profile.username) {
            setIsEditingName(false);
            return;
        }

        setSaving(true);

        const { error: updateError } = await supabase
        .from('profiles')
        .update({ username: newName.trim() })
        .eq('id', profile.id);

        if (updateError) {
            console.error('Update Error:', updateError);

            if (updateError.code === '23505') {
                setError('Acest nume este deja folosit!');
            } else {
                setError('Eroare la salvare. Încearcă din nou.');
            }
        } else {
            setProfile({ ...profile, username: newName.trim() });
            setIsEditingName(false);
        }

        setSaving(false);
    };

    const handleCancelEdit = () => {
        setNewName(profile.username); 
        setIsEditingName(false);
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingAvatar(true);

        try {
            const uploadPath = currUserId;

            if (profile?.avatar_url){
                await supabase.storage.from('avatars').remove(uploadPath);
            }

            const {error: uploadError} = await supabase.storage
            .from('avatars')
            .upload(uploadPath, file, {upsert: true});

            if (uploadError) throw uploadError

            const {data} = supabase.storage.from('avatars').getPublicUrl(uploadPath);

            const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: data.publicUrl })
            .eq('id', currUserId);

            if (updateError) throw updateError;

            setProfile({ ...profile, avatar_url: data.publicUrl });
            setAvatarUrl(data.publicUrl);
        } catch (error) {
            console.error("Avatar upload error: ", error)
        } finally {
            setUploadingAvatar(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        )
    }

    return(
        <div className='min-h-screen text-slate-200 p-8 font-sans'>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 max-w-5xl mx-auto">

                <aside className="flex flex-col w-full md:w-64 h-fit border border-slate-800 bg-slate-900 p-6 rounded">

                    <div className="relative w-24 h-24 rounded-full bg-white flex items-center justify-center mb-4 text-2xl font-bold text-slate-900 overflow-hidden">
                        {profile?.avatar_url ? (
                            <img src={profile?.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            profile?.username?.[0].toUpperCase()
                        )}
                        {currUserId === profile?.id && (
                            <label className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition">
                                <input 
                                    type="file" 
                                    accept="image/jpeg,image/png,image/webp" 
                                    onChange={handleAvatarUpload}
                                    disabled={uploadingAvatar}
                                    className="hidden" 
                                />
                                <span className="text-white text-xs">Schimbă</span>
                            </label>
                        )}
                    </div>

                    <div className="mb-1">
                        {!isEditingName ? (
                            <div className="text-xl font-medium text-white flex justify-between items-center">
                                <span>{profile?.username}</span>
                                {currUserId === profile?.id && (
                                    <button 
                                        onClick={() => {
                                            setIsEditingName(true);
                                            setError("");
                                        }}
                                        className="text-slate-400 hover:text-white transition-colors">
                                        <IoPencil />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => {
                                        setNewName(e.target.value);
                                        setError(""); 
                                    }}
                                    placeholder="Nume nou..."
                                    className="bg-slate-800 text-white px-3 py-2 rounded border border-slate-700 focus:border-blue-500 focus:outline-none"
                                    autoFocus
                                    maxLength={20}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveUsername();
                                        if (e.key === 'Escape') handleCancelEdit();
                                    }}
                                />

                                {error && (
                                    <p className="text-red-400 text-xs">{error}</p>
                                )}

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSaveUsername}
                                        disabled={saving}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50">
                                        {saving ? 'Salvare...' : 'Salvează'}
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        disabled={saving}
                                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50">
                                        Anulează
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-1 mb-2 items-center">
                        <div className="text-slate-400">Clasament:</div>
                        <div className="">#{rank}</div>
                    </div>

                    <div className="flex items-center justify-between gap-3 py-2 text-slate-300 hover:text-white text-nowrap ">
                        <span className="text-sm font-bold text-slate-400">Nivel: {profile?.level}</span>
                        <span className="font-bold text-blue-400 font-mono">{profile?.xp} XP</span>
                    </div>
                </aside>

                <main className="flex-1 bg-slate-900 p-6 rounded border border-slate-800">
                    <h2 className="text-2xl font-medium mb-6 text-white">Lecții finalizate</h2>

                    {finishedLessons.length === 0 ? (
                        <p className="text-slate-500 italic">Nu ai terminat nicio lecție încă. Spor la treabă!</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {finishedLessons.map((item, index) => {
                                const isCode = item?.lessons?.lesson_type === 'code'
                                const to = isCode ? `/probleme/${item?.lessons?.slug}` : `/lectie/${item?.lessons?.slug}`
                                return(
                                <Link 
                                    to={to}
                                    key={index}
                                    className="text-sm py-3 px-4 border border-slate-800 rounded-lg transition-all hover:border-slate-600 hover:bg-slate-800/50">
                                        {item?.lessons?.title}
                                </Link>
                                )
                            })}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
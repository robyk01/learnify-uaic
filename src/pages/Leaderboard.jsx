import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

import { IoTrophy, IoArrowBack } from "react-icons/io5";
import { FaMedal } from "react-icons/fa";

export default function Leaderboard() {
    const [users, setUsers] = useState([])
    const [profile, setProfile] = useState()
    const [profileRank, setProfileRank] = useState(null)

    useEffect(() => {
        const fetchUsers = async () => {
            const {data, error} = await supabase
            .from("profiles")
            .select("*")
            .order("xp", {ascending: false})
            .limit(10)

            if (!error) setUsers(data)

            const {data: {user}} = await supabase.auth.getUser();

            if (user) {
                const {data: userProfile} = await supabase
                .from("profiles")
                .select("*")
                .eq('id', user.id)
                .single()

                if (userProfile){
                    setProfile(userProfile);

                    const {count} = await supabase
                    .from("profiles")
                    .select("*", {count: 'exact', head: true})
                    .gt("xp", userProfile.xp)

                    setProfileRank((count || 0) + 1)
                } 
            }
        }

        fetchUsers()
    }, []);

    const topTen = users.some(u => u.id === profile?.id)

    return(
        <div className='min-h-screen bg-slate-950 text-slate-200 p-8 font-sans'>
            <div className="max-w-5xl mx-auto text-center">

                <div className="flex items-center justify-between mb-12 py-6">
                    <Link to={`/`} className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
                                <IoArrowBack className="group-hover:-translate-x-1 transition-transform" />
                                Înapoi acasă
                            </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-white font-display flex gap-3 items-center">
                        Top studenți 
                         <IoTrophy className="text-yellow-500" />
                    </h1>
                    <div className="w-20"></div> {/* Spacer invizibil pt centrare */}
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 bg-slate-900/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <div className="col-span-2 text-center">Loc</div>
                        <div className="col-span-7 text-left">Student</div>
                        <div className="col-span-3 text-right pr-4">XP Total</div>
                    </div>

                    <div className="divide-y divide-slate-800/80">
                        {users.map((user, index) => {
                            const isCurrent = user.id === profile?.id
                            const topThree = index < 3

                            return(
                                <div key={user.id}
                                    className={`grid grid-cols-12 gap-4 p-4 items-center transition-all duration-200
                                                ${index === 0 ? "bg-yellow-500/30 border-yellow-500" : 
                                                index === 1 ? "bg-slate-400/40 border-slate-700" : 
                                                index === 2 ? "bg-orange-700/30 border-orange-700" : ""
                                                }
                                                ${isCurrent && !topThree ? "ring-2 ring-yellow-500 ring-inset rounded-lg" : ""}
                                                ${isCurrent && topThree ? "ring-2 ring-yellow-400 ring-inset rounded-lg" : ""}
                                                `}>

                                    <div className="col-span-2 flex justify-center items-center">
                                        {index === 0 ? <FaMedal className="text-yellow-400 text-2xl" /> :
                                         index === 1 ? <FaMedal className="text-slate-400 text-2xl" /> :
                                         index === 2 ? <FaMedal className="text-orange-600 text-2xl" /> :
                                         index + 1}
                                    </div>

                                    <div className="col-span-7 flex items-center gap-3">
                                        {user.username}
                                    </div>

                                    <div className="col-span-3 text-right pr-4">
                                        <span className="font-mono font-bold text-lg">
                                            {user.xp}
                                        </span>
                                        <span className="text-xs text-slate-400 ml-2">XP</span>
                                    </div>
                                </div>
                            )
                        })}

                        {!topTen && profile && (
                            <>
                                <div className="grid grid-cols-12 gap-4 p-2 items-center bg-slate-900/50">
                                    <div className="col-span-12 text-center text-slate-500 text-xs">
                                        ...
                                    </div>
                                </div>
                                <div className="grid grid-cols-12 gap-4 p-4 items-center transition-all duration-200 ring-2 ring-yellow-400 ring-inset bg-slate-800/30 rounded-2xl">
                                    <div className="col-span-2 flex justify-center items-center">
                                        {profileRank}
                                    </div>

                                    <div className="col-span-7 flex items-center gap-3">
                                        {profile.username}
                                    </div>

                                    <div className="col-span-3 text-right pr-4">
                                        <span className="font-mono font-bold text-lg">
                                            {profile.xp}
                                        </span>
                                        <span className="text-xs text-slate-400 ml-2">XP</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
import { supabase } from "../supabaseClient";
import { useState, useEffect, useContext, createContext } from "react";
import { SubjectContext } from "./SubjectContext";
export const ProfileContext = createContext()

export const ProfileProvider = ({children}) => {
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        const fetchProfile = async () => {
            const {data: {session}} = await supabase.auth.getSession()

            if (session?.user){
                const {data: profileData} = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()

                setProfile(profileData)
            } else {
                setProfile(null)
            }
        }

        fetchProfile()

        // Auth listener
        const {data: {subscription: authListener}} = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) fetchProfile()
            else setProfile(null)
        })

        // Real-time subscription
        const channel = supabase
        .channel('realtime-navbar')
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles'
        }, (payload) => {
            setProfile(prevProfile => {
                if (prevProfile && payload.new.id === prevProfile.id){
                    return payload.new
                }
                return prevProfile
            })
        })
        .subscribe()

        return () => {
            authListener?.unsubscribe()
            supabase.removeChannel(channel)
        }
    }, [])

    return(
        <ProfileContext.Provider
            value={{profile, setProfile}}>
            {children}
        </ProfileContext.Provider>
    )
}
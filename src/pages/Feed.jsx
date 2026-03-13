import { useContext } from "react"
import FeedPost from "../components/FeedPost"
import { ProfileContext } from "../components/ProfileContext"
import { SubjectContext } from "../components/SubjectContext"

export default function Feed(){
    const {profile} = useContext(ProfileContext)
    const {subjects} = useContext(SubjectContext)

    const feedPosts = [
        {
            subject: 'Programare Orientata Obiect',
            short: 'OOP',
            title: 'Lorem ipsum dolor sit amet',
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        },
        {
            subject: 'Probabilitati si Statistica',
            short: 'PS',
            title: 'Lorem ipsum dolor sit amet',
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        },
        {
            subject: 'Sisteme de operare',
            short: 'SO',
            title: 'Lorem ipsum dolor sit amet',
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }
    ]

    return(
        <div className='text-slate-200 p-8 mb-8 font-sans'>
            <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-white font-display mt-6 mb-12">
                    Feed 
                </h1>

                {profile?.premium ? (
                    <div className="flex flex-col gap-12">
                        {feedPosts.map((post) => (
                            <FeedPost post={post}/>
                        ))}
                    </div>
                ) : (
                    <div className="">În curând...</div>
                )}
            </div>
        </div>
    )
}
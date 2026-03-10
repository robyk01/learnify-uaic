import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function News() {
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(true)

    // useEffect(() => {
    //     const fetchNews = async () => {
    //         const { data, error } = await supabase
    //             .from('news')
    //             .select('*')
    //             .order('created_at', { ascending: false })

    //         if (error) {
    //             console.error('Error fetching news:', error)
    //         } else {
    //             setNews(data || [])
    //         }
    //         setLoading(false)
    //     }

    //     fetchNews()
    // }, [])

    return (
        <div className='min-h-screen text-slate-200 p-8 font-sans my-12'>
            <div className="max-w-5xl mx-auto">
                <div className="mb-12">
                    <h1 className='text-4xl font-bold text-white mb-2'>Noutăți</h1>
                    <p className='text-slate-400'>Rămâi la curent cu ultimele actualizări</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-1 md:grid-rows-3 gap-4">

                    <div className="mb-8 bg-gradient-to-r from-blue-600/20 to-blue-500/10 border border-blue-500/30 p-6 rounded-lg flex flex-col md:flex-row gap-6 items-center h-full">
                        <img src="/addtohome.PNG" className='w-48 rounded-lg flex-shrink-0'></img>
                        <div className='pr-8'>
                            <h2 className="text-xl font-bold text-white mb-4">Instalează aplicația pe ecranul principal</h2>
                            <p className="text-slate-300 mb-2 text-sm">Pentru o experiență mai bună și acces mai rapid, instalează Learnify pe ecranul principal al telefonului tău.</p>
                            <p className="text-sm text-slate-400">
                                Apasă meniul (⋮), apoi apasă butonul Share și selectează "Add to Home Screen".
                            </p>
                        </div>
                    </div>

                    <div className="relative flex flex-col items-center justify-center border border-slate-800 p-8 rounded-lg flex-1 overflow-hidden">

                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-32 left-12 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl"></div>

                        <div className="flex flex-col items-start mb-2 w-full md:w-[50%]">
                            <h3 className="font-semibold text-white">Meniu și progres refăcut</h3>
                            <span className="text-xs text-slate-500">8 Mar</span>
                        </div>
                        <p className="text-sm text-slate-400 w-full md:w-[50%]">Meniul materiilor se află în partea stângă, iar pe prima pagină poți vedea exact unde ai ajuns cu învățatul. Noul design îți oferă o navigare mai ușoară și acces rapid la lecțiile în progres.</p>
                    </div>
                </div>

               

                {/* {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="border border-slate-800 p-4 rounded-lg animate-pulse">
                                <div className="h-6 bg-slate-700 rounded w-3/4 mb-3"></div>
                                <div className="h-4 bg-slate-700 rounded w-full"></div>
                            </div>
                        ))}
                    </div>
                ) : news.length > 0 ? (
                    <div className="space-y-4">
                        {news.map((item) => (
                            <div key={item.id} className="border border-slate-800 p-4 rounded-lg hover:border-slate-700 transition">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-white text-lg">{item.title}</h3>
                                    <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                                        {new Date(item.created_at).toLocaleDateString('ro-RO')}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-400">{item.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-slate-400">Nu sunt noutăți disponibile în acest moment.</p>
                    </div>
                )} */}
            </div>
        </div>
    )
}
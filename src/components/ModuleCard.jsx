import { Link } from "react-router-dom";

const ModuleCard = ({ module }) => {
    return(
        <Link to={`/modul/${module.slug}`}>
            <div className='bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all hover:-translate-y-1 cursor-pointer group'>
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                    <h2 className='text-xl font-semibold text-white group-hover:text-blue-400 transition-colors'>
                        {module.title}
                    </h2> 
                    <span className='bg-slate-800 text-xs font-bold px-2 py-1 rounded'>
                        #{module.order_index}
                    </span>
                </div>

                <p className='text-slate-400 text-sm leading-relaxed mb-4'>
                    {module.description}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-800 flex justify-between gap-2">
                    <span className='text-sm font-medium'>
                        Incepe capitol
                    </span>
                    <span className='text-sm'>→</span>
                </div>
            </div>
        </Link>
    );
}

export default ModuleCard;
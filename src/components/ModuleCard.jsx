import { Link } from "react-router-dom";

const ModuleCard = ({ module }) => {
    return(
        <Link>
            <div className='bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-main transition-all hover:-translate-y-1 cursor-pointer group'>
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                    <h2 className='text-xl font-semibold text-white group-hover:text-main transition-colors'>
                        {module.title}
                    </h2>
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
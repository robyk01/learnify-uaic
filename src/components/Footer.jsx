import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-slate-900 mt-auto">
            <div className="max-w-7xl mx-auto py-6">
                <div className="flex flex-col justify-center items-center gap-4">
                    <p className="text-slate-400 text-xs text-center flex flex-col">
                        <span>Created by Amore Roberto</span>
                        <span>CS AI student @ UAIC</span>
                    </p>
                    
                    <div className="flex items-center gap-4">
                        <a
                            href="https://www.linkedin.com/in/amore-roberto-0bb418327" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-blue-400 transition-colors text-xl"
                            aria-label="LinkedIn">
                            <FaLinkedin />
                        </a>
                        <a 
                            href="https://github.com/robyk01" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-white transition-colors text-xl"
                            aria-label="GitHub">
                            <FaGithub />
                        </a>
                    </div>
                </div>
                
                
            </div>
        </footer>
    );
}

export default Footer;
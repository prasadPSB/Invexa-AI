import { House, ChartArea, User, Database, Sparkles, Moon, Sun } from "lucide-react"

export default function Header({ selected, setSelected, profile, setProfile, isDark, toggleTheme }) {

    const navItems = [
        { id: "Home", icon: House, label: "Home" },
        { id: "Database", icon: Database, label: "Database" },
        { id: "Analytics", icon: ChartArea, label: "Analytics" },
        { id: "Settings", icon: User, label: "Account" }
    ];

    return (
        <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/80 text-white px-6 py-3 shadow-sm">
            <div className="flex justify-between items-center max-w-[1600px] mx-auto">

                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSelected("Home")}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-900/30">
                        <Sparkles size={16} className="text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent transform translate-y-[1px]">
                        Invexa
                    </span>
                </div>

                {/* Navigation Pills */}
                <nav className="flex items-center gap-20 p-2 bg-gray-900/80 border border-gray-800/80 rounded-full shadow-inner">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = selected === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setSelected(item.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-gray-800 text-indigo-400 shadow-md border border-gray-700/50"
                                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-600/40 border border-transparent"
                                    }`}
                            >
                                <Icon size={16} />
                                <span className={isActive ? "block" : "hidden sm:block"}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border ${isDark
                        ? "bg-gray-800/60 border-gray-700/50 hover:bg-gray-700/80 text-white"
                        : "bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-900"
                        }`}
                >
                    <span
                        className="transition-transform duration-500"
                        style={{ display: "flex", transform: isDark ? "rotate(0deg) scale(1)" : "rotate(180deg) scale(0.9)" }}
                    >
                        {isDark
                            ? <Moon size={18} className="text-white" />
                            : <Sun size={18} className="text-gray-900" />
                        }
                    </span>
                </button>
            </div>
        </header>
    );
}

import Header from "./Header";
import { useState, useEffect } from "react";
import Profilemodel from "./Models/ProfileModel";
import HomePage from "./HomePage";
import Database from "./Database";
import Chat from "./Chat";
import Account from "./Account";
export default function Merger({ user, onSignOut }) {
    const states = ["Home", "Database", "Analytics", "Settings"]
    const [selected, setSelected] = useState("Home")
    const [profile, setProfile] = useState(false)
    const [isDark, setIsDark] = useState(true)
    const [pendingPrompt, setPendingPrompt] = useState("")

    const handleSendFromHome = (prompt) => {
        setPendingPrompt(prompt)
        setSelected("Analytics")
    }

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark)
    }, [isDark])

    const toggleTheme = () => setIsDark(prev => !prev)

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-950 overflow-hidden">
            <div className="shrink-0 z-50 relative">
                <Header selected={selected} setSelected={setSelected} profile={profile} setProfile={setProfile} isDark={isDark} toggleTheme={toggleTheme} />
            </div>
            {profile && <Profilemodel profile={profile} setProfile={setProfile} />}

            <div className="flex-1 min-h-0 relative overflow-y-auto">
                {selected === "Home" && <HomePage setSelected={setSelected} user={user} onSendPrompt={handleSendFromHome} isDark={isDark} />}
                {selected === "Database" && <Database />}
                {selected === "Analytics" && <Chat initialPrompt={pendingPrompt} onPromptConsumed={() => setPendingPrompt("")} />}
                {selected === "Settings" && <Account user={user} onSignOut={onSignOut} />}
            </div>
        </div>
    )
}
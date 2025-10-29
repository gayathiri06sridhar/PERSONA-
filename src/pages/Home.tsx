import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Brain, Crown, Lightbulb, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useState } from "react";
import InstructionSlides from "@/components/InstructionSlides";

const Home = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showInstructions, setShowInstructions] = useState(false);

  const handleStartGame = () => {
    setShowInstructions(true);
  };

  const handleStartPlay = () => {
    navigate("/game");
  };

  const handleAuthClick = () => {
    if (user) {
      navigate("/game");
    } else {
      navigate("/auth");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-amber-50 to-red-100 animate-fade-in relative overflow-hidden">
      {/* Auth button in top-right corner */}
      <div className="absolute top-6 right-6 z-20">
        {user ? (
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-2 border-orange-300 hover:bg-orange-50 shadow-md"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        ) : (
          <Button
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-orange-600 to-red-500 text-white hover:shadow-lg hover:from-orange-700 hover:to-red-600"
          >
            Login / Sign Up
          </Button>
        )}
      </div>

      {/* Traditional Indian decorative patterns */}
      <div className="absolute inset-0 opacity-10">
        {/* Rangoli-inspired circular patterns */}
        <div className="absolute top-10 left-10 w-72 h-72">
          <div className="absolute inset-0 rounded-full border-8 border-orange-600" style={{ borderStyle: 'double' }}></div>
          <div className="absolute inset-4 rounded-full border-4 border-red-500" style={{ borderStyle: 'dashed' }}></div>
          <div className="absolute inset-8 rounded-full border-2 border-yellow-600"></div>
        </div>
        <div className="absolute bottom-10 right-10 w-72 h-72">
          <div className="absolute inset-0 rounded-full border-8 border-red-600" style={{ borderStyle: 'double' }}></div>
          <div className="absolute inset-4 rounded-full border-4 border-orange-500" style={{ borderStyle: 'dashed' }}></div>
          <div className="absolute inset-8 rounded-full border-2 border-amber-600"></div>
        </div>
        {/* Center lotus-inspired pattern */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem]">
          <div className="absolute inset-0 rounded-full border-8 border-amber-600" style={{ borderStyle: 'double' }}></div>
          <div className="absolute inset-6 rounded-full border-6 border-orange-500" style={{ borderStyle: 'dotted' }}></div>
        </div>
      </div>

      <div className="text-center space-y-12 animate-scale-in relative z-10 px-6 max-w-5xl">
        {/* Main title with traditional Indian aesthetic */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 bg-clip-text text-transparent drop-shadow-2xl tracking-wide">
            🪷 Persona
          </h1>
          <p className="text-xl md:text-2xl text-orange-900 font-semibold tracking-wider">
            YOUR COMPANION BOT
          </p>
        </div>

        {/* Three pillars with icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
          {/* Chess Strategy */}
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border-3 border-orange-300 hover:scale-105 transition-transform hover:shadow-orange-200/50">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-orange-800 mb-2">Strategic Moves</h3>
            <p className="text-orange-900/70">Navigate like a chess master through life's challenges</p>
          </div>

          {/* Knowledge Quest */}
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border-3 border-amber-300 hover:scale-105 transition-transform hover:shadow-amber-200/50">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-amber-800 mb-2">Quest for Knowledge</h3>
            <p className="text-amber-900/70">Answer questions to unlock wisdom and awareness</p>
          </div>

          {/* Mental Wellness */}
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border-3 border-red-300 hover:scale-105 transition-transform hover:shadow-red-200/50">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Inner Balance</h3>
            <p className="text-red-900/70">Discover insights about mental health and well-being</p>
          </div>
        </div>

        {/* Traditional Indian decorative divider */}
        <div className="flex items-center justify-center gap-4 my-8">
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded"></div>
          <div className="w-2 h-2 rounded-full bg-orange-600"></div>
          <div className="w-3 h-3 rounded-full bg-amber-600 border-2 border-orange-600"></div>
          <div className="text-2xl">🪷</div>
          <div className="w-3 h-3 rounded-full bg-red-600 border-2 border-orange-600"></div>
          <div className="w-2 h-2 rounded-full bg-red-600"></div>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded"></div>
        </div>

        {/* Start button with traditional styling */}
        <Button
          onClick={handleStartGame}
          size="lg"
          className="text-2xl px-16 py-8 bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-white hover:shadow-2xl hover:scale-110 transition-all duration-300 border-4 border-white shadow-xl font-bold rounded-xl hover:from-orange-700 hover:via-amber-700 hover:to-red-700"
        >
          🎲 Start Your Journey
        </Button>

        {/* Subtitle */}
        <p className="text-sm text-orange-800 italic font-medium">
          Roll the dice, answer with wisdom, and reach enlightenment
        </p>
      </div>

      <InstructionSlides
        open={showInstructions}
        onClose={() => setShowInstructions(false)}
        onStartGame={handleStartPlay}
      />
    </div>
  );
};

export default Home;

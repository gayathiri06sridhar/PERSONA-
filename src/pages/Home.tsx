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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-green-50 to-blue-50 animate-fade-in relative overflow-hidden">
      {/* Auth button in top-right corner */}
      <div className="absolute top-6 right-6 z-20">
        {user ? (
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-2 border-orange-200 hover:bg-orange-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        ) : (
          <Button
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-orange-500 via-green-500 to-blue-500 text-white hover:shadow-lg"
          >
            Login / Sign Up
          </Button>
        )}
      </div>

      {/* Decorative mandala pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full border-8 border-orange-600" style={{ borderStyle: 'double' }}></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full border-8 border-green-600" style={{ borderStyle: 'double' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border-8 border-blue-600" style={{ borderStyle: 'double' }}></div>
      </div>

      <div className="text-center space-y-12 animate-scale-in relative z-10 px-6 max-w-5xl">
        {/* Main title with Indian flag colors gradient */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-600 via-green-600 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">
            Mythical Gamified Quiz
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-medium">
            A Journey Through Chess, Knowledge & Inner Wellness
          </p>
        </div>

        {/* Three pillars with icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
          {/* Chess Strategy */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-2 border-orange-200 hover:scale-105 transition-transform">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-orange-700 mb-2">Strategic Moves</h3>
            <p className="text-gray-600">Navigate like a chess master through life's challenges</p>
          </div>

          {/* Knowledge Quest */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-2 border-green-200 hover:scale-105 transition-transform">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-green-700 mb-2">Quest for Knowledge</h3>
            <p className="text-gray-600">Answer questions to unlock wisdom and awareness</p>
          </div>

          {/* Mental Wellness */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-2 border-blue-200 hover:scale-105 transition-transform">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-blue-700 mb-2">Inner Balance</h3>
            <p className="text-gray-600">Discover insights about mental health and well-being</p>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-4 my-8">
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-orange-400 to-transparent rounded"></div>
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded"></div>
        </div>

        {/* Start button */}
        <Button
          onClick={handleStartGame}
          size="lg"
          className="text-2xl px-16 py-8 bg-gradient-to-r from-orange-500 via-green-500 to-blue-500 text-white hover:shadow-2xl hover:scale-110 transition-all duration-300 border-4 border-white shadow-xl font-bold rounded-xl"
        >
          🎲 Start Your Journey
        </Button>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 italic">
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

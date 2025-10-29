import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronRight, Crown, Lightbulb, Gamepad2, Star } from "lucide-react";

interface InstructionSlidesProps {
  open: boolean;
  onClose: () => void;
  onStartGame: () => void;
}

const InstructionSlides = ({ open, onClose, onStartGame }: InstructionSlidesProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "🎮 Game Rules & Instructions",
      icon: <Gamepad2 className="w-12 h-12 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-lg">Welcome to <span className="font-bold text-primary">Chess-Quiz Journey!</span></p>
          <ul className="space-y-2 text-left list-disc list-inside">
            <li>Your goal is to travel from <span className="font-semibold">Box 1 → Box 100</span></li>
            <li>Reach the Crown 👑 (King) at the end</li>
            <li>Answer quiz questions and move across the chess-themed board to progress!</li>
          </ul>
        </div>
      )
    },
    {
      title: "🕹 Example Gameplay",
      icon: <Star className="w-12 h-12 text-green-600" />,
      content: (
        <div className="space-y-3 text-left">
          <p className="font-semibold text-center mb-4">How a typical turn works:</p>
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border-2 border-green-200 dark:border-green-800">
            <p>1. Player starts at <span className="font-bold">Box 1</span></p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border-2 border-blue-200 dark:border-blue-800">
            <p>2. Moves <span className="font-bold">1 step per turn</span></p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border-2 border-orange-200 dark:border-orange-800">
            <p>3. Lands on Rook (♖) at Box 10 → Moves <span className="font-bold text-orange-600">+5</span> → Goes to Box 15</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-2 border-purple-200 dark:border-purple-800">
            <p>4. Lands on Knight (♘) at Box 22 → Random backward <span className="font-bold text-purple-600">–3</span> → Goes to Box 19</p>
          </div>
          <p className="text-center mt-4 italic">Continue this way until you reach Box 100!</p>
        </div>
      )
    },
    {
      title: "♟ Game Features",
      icon: <Crown className="w-12 h-12 text-blue-600" />,
      content: (
        <div className="space-y-4">
          <p className="font-semibold text-center mb-4">Chess Pieces & Their Powers:</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary/10">
                  <th className="border border-border p-3 text-left">Piece</th>
                  <th className="border border-border p-3 text-left">Symbol</th>
                  <th className="border border-border p-3 text-left">Power / Move</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3">Queen</td>
                  <td className="border border-border p-3 text-2xl">♕</td>
                  <td className="border border-border p-3">+5 forward or +3 diagonal</td>
                </tr>
                <tr className="bg-muted/50">
                  <td className="border border-border p-3">Rook</td>
                  <td className="border border-border p-3 text-2xl">♖</td>
                  <td className="border border-border p-3">+5 forward (straight move)</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Bishop</td>
                  <td className="border border-border p-3 text-2xl">♗</td>
                  <td className="border border-border p-3">+3 diagonal (same color square)</td>
                </tr>
                <tr className="bg-muted/50">
                  <td className="border border-border p-3">Knight</td>
                  <td className="border border-border p-3 text-2xl">♘</td>
                  <td className="border border-border p-3">Random L-shape (backward like a snake)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      title: "💡 Quiz Logic",
      icon: <Lightbulb className="w-12 h-12 text-yellow-600" />,
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
            <p className="text-lg mb-3">Between Box 1 and Box 100, <span className="font-bold text-yellow-700 dark:text-yellow-400">21 quiz questions</span> will appear.</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Each answer adds to your score</li>
              <li>Questions assess stress, anxiety, and depression levels</li>
              <li>Final score is calculated based on quiz performance</li>
              <li>If you skip boxes with questions, you'll still be asked those questions</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "🚀 How to Start",
      icon: <Star className="w-12 h-12 text-purple-600" />,
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-orange-50 via-green-50 to-blue-50 dark:from-orange-900/20 dark:via-green-900/20 dark:to-blue-900/20 p-6 rounded-lg border-2 border-primary">
            <ol className="space-y-3 list-decimal list-inside text-left">
              <li>Click <span className="font-bold">"Start Game"</span> on the homepage</li>
              <li>Read all Game Rules & Instructions using the <span className="font-bold">"Next"</span> button</li>
              <li>After reading the final page, click <span className="font-bold">"Start to Play"</span> to open the game interface</li>
              <li>Begin your <span className="font-bold text-primary">Chess + Quiz + Mental Health Journey!</span></li>
            </ol>
          </div>
          <p className="text-center font-semibold text-lg mt-6">Ready to begin your journey? 🎯</p>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartPlay = () => {
    onStartGame();
    onClose();
    setCurrentStep(0);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col items-center space-y-6 py-6">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
            {steps[currentStep].icon}
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-600 via-green-600 to-blue-600 bg-clip-text text-transparent">
            {steps[currentStep].title}
          </h2>

          {/* Content */}
          <div className="w-full px-4">
            {steps[currentStep].content}
          </div>

          {/* Progress indicator */}
          <div className="flex gap-2 mt-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "w-8 bg-gradient-to-r from-orange-500 via-green-500 to-blue-500"
                    : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-4 mt-6">
            {currentStep > 0 && (
              <Button
                onClick={handlePrevious}
                variant="outline"
                size="lg"
                className="px-8"
              >
                Previous
              </Button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                size="lg"
                className="bg-gradient-to-r from-orange-500 via-green-500 to-blue-500 text-white px-8"
              >
                Next <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            ) : (
              <Button
                onClick={handleStartPlay}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white px-12 text-xl animate-pulse"
              >
                🎮 Start to Play
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstructionSlides;

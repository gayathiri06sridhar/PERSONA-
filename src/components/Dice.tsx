import { cn } from "@/lib/utils";

interface DiceProps {
  value: number | null;
  isRolling: boolean;
}

const Dice = ({ value, isRolling }: DiceProps) => {
  const renderDots = () => {
    if (!value) return null;

    const dotPositions: { [key: number]: string[] } = {
      1: ["center"],
      2: ["top-left", "bottom-right"],
      3: ["top-left", "center", "bottom-right"],
      4: ["top-left", "top-right", "bottom-left", "bottom-right"],
      5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
      6: ["top-left", "top-right", "middle-left", "middle-right", "bottom-left", "bottom-right"],
    };

    const positions = dotPositions[value] || [];

    return positions.map((position, index) => {
      const positionClasses = {
        "top-left": "top-2 left-2",
        "top-right": "top-2 right-2",
        "middle-left": "top-1/2 -translate-y-1/2 left-2",
        "middle-right": "top-1/2 -translate-y-1/2 right-2",
        "bottom-left": "bottom-2 left-2",
        "bottom-right": "bottom-2 right-2",
        "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      };

      return (
        <div
          key={`${position}-${index}`}
          className={cn(
            "absolute w-3 h-3 bg-primary rounded-full",
            positionClasses[position as keyof typeof positionClasses]
          )}
        />
      );
    });
  };

  return (
    <div
      className={cn(
        "relative w-24 h-24 bg-card border-4 border-primary rounded-xl shadow-2xl transition-all duration-300",
        isRolling && "animate-spin"
      )}
    >
      {renderDots()}
    </div>
  );
};

export default Dice;

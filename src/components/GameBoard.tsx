import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import Dice from "@/components/Dice";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import SeraChatbot from "./SeraChatbot";

type PieceType = "pawn" | "king" | "queen" | "rook" | "bishop" | "knight" | null;

interface Piece {
  type: PieceType;
  symbol: string;
}

const GameBoard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [playerPosition, setPlayerPosition] = useState(1);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showQueenDialog, setShowQueenDialog] = useState(false);
  const [validMoves, setValidMoves] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [stressScore, setStressScore] = useState(0);
  const [anxietyScore, setAnxietyScore] = useState(0);
  const [depressionScore, setDepressionScore] = useState(0);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [scoresSaved, setScoresSaved] = useState(false);
  const [showSeraChatbot, setShowSeraChatbot] = useState(false);

  // Questions for specific positions
  const questionPositions = [5, 9, 14, 18, 23, 27, 30, 33, 37, 40, 48, 52, 56, 60, 64, 70, 75, 80, 87, 95, 98];
  
  // Category mapping
  const stressPositions = [5, 9, 13, 18, 23, 27, 30];
  const anxietyPositions = [33, 37, 40, 48, 52, 56, 60];
  const depressionPositions = [64, 70, 75, 80, 87, 95, 98];
  const questions = [
    {
      id: 1,
      position: 5,
      funFact: "Delhi Metro is the busiest and longest metro system in India, approximately 389 km and 285 stations and nearly 4 million passengers daily.",
      question: "I feel like my mind runs constantly as Delhi Metro, finding it hard to wind down.",
      options: [
        { emoji: "☀", text: "Not at all" },
        { emoji: "🌤", text: "Sometimes" },
        { emoji: "🌧", text: "Often" },
        { emoji: "⛈", text: "Always" }
      ]
    },
    {
      id: 2,
      position: 9,
      funFact: "World's largest integrated film studio complex is Ramoji Film City, located in Hyderabad, India, and was opened in 1996.",
      question: "My reactions are mostly cinematic and I tend to overreact to situations.",
      options: [
        { emoji: "☀", text: "Not at all" },
        { emoji: "🌤", text: "Sometimes" },
        { emoji: "🌧", text: "Often" },
        { emoji: "⛈", text: "Always" }
      ]
    },
    {
      id: 3,
      position: 14,
      funFact: "The Bhangarh Fort, once grand and powerful, became abandoned due to the curse of a strong ascetic Guru Balunath with a lot of nervous energy.",
      question: "I feel I use a lot of nervous energy.",
      options: [
        { emoji: "☀", text: "Not at all" },
        { emoji: "🌤", text: "Sometimes" },
        { emoji: "🌧", text: "Often" },
        { emoji: "⛈", text: "Always" }
      ]
    },
    {
      id: 4,
      position: 18,
      funFact: "The 2004 Indian Ocean tsunami was caused by a magnitude 9.1 earthquake and its energy was equivalent to 23,000 Hiroshima-sized atomic bombs.",
      question: "Like the oceans during the tsunami, I find myself getting agitated.",
      options: [
        { emoji: "☀", text: "Not at all" },
        { emoji: "🌤", text: "Sometimes" },
        { emoji: "🌧", text: "Often" },
        { emoji: "⛈", text: "Always" }
      ]
    },
    {
      id: 5,
      position: 23,
      funFact: "Coorg is famously known as \"Scotland of India\" due to its cool climate, hilly terrain, and scenic beauty.",
      question: "I think I may find it difficult to relax even in places like Coorg.",
      options: [
        { emoji: "☀", text: "Not at all" },
        { emoji: "🌤", text: "Sometimes" },
        { emoji: "🌧", text: "Often" },
        { emoji: "⛈", text: "Always" }
      ]
    },
    {
      id: 6,
      position: 27,
      funFact: "The 2002 Gujarat riots in India erupted like a volcano due to intolerance among humans.",
      question: "I am intolerant of anything that keeps me from getting on with what I was doing.",
      options: [
        { emoji: "☀", text: "Not at all" },
        { emoji: "🌤", text: "Sometimes" },
        { emoji: "🌧", text: "Often" },
        { emoji: "⛈", text: "Always" }
      ]
    },
    {
      id: 7,
      position: 30,
      funFact: "The Taj Mahal in Agra is a UNESCO World Heritage site that appears to change color throughout the day, looking pinkish in the morning, milky white in the evening, and golden in the moonlight.",
      question: "I feel I am rather touchy, like a delicate petal in the shadow of the Taj Mahal, sensitive to every ripple of the world around me.",
      options: [
        { emoji: "☀", text: "Not at all" },
        { emoji: "🌤", text: "Sometimes" },
        { emoji: "🌧", text: "Often" },
        { emoji: "⛈", text: "Always" }
      ]
    },
    {
      id: 8,
      position: 33,
      funFact: "Thar Desert of India is the most densely populated desert in the world.",
      question: "My mouth feels dry like the wind of the Thar Desert.",
      options: [
        { emoji: "☀", text: "Not at all" },
        { emoji: "🌤", text: "Sometimes" },
        { emoji: "🌧", text: "Often" },
        { emoji: "⛈", text: "Always" }
      ]
    },
    {
      id: 9,
      position: 37,
      funFact: "Shimla is a world heritage site. It is the only Indian place where natural ice skating takes place.",
      question: "I experience breathing difficulty sometimes, like I am running across Shimla's cold mountains up and down.",
      options: [
        { emoji: "☀", text: "Not at all" },
        { emoji: "🌤", text: "Sometimes" },
        { emoji: "🌧", text: "Often" },
        { emoji: "⛈", text: "Always" }
      ]
    },
    {
      id: 10,
      position: 40,
      funFact: "The massive energy released by the 2004 Sumatra–Andaman Earthquake caused the entire planet to vibrate as much as 1 mm.",
      question: "I experience trembling often like an earthquake.",
      options: [
        { emoji: "☀", text: "Not at all" },
        { emoji: "🌤", text: "Sometimes" },
        { emoji: "🌧", text: "Often" },
        { emoji: "⛈", text: "Always" }
      ]
    },
    {
      id: 11,
      position: 48,
      funFact: "'Thenali,' an Indian Tamil comedy film shot at Kodaikanal, tells the story of a man who is both neurotic and multiphobic.",
      question: "I am worried about situations in which I might panic and make a fool of myself just like Thenali.",
      options: [
        { emoji: "☀", text: "Not at all" },
        { emoji: "🌤", text: "Sometimes" },
        { emoji: "🌧", text: "Often" },
        { emoji: "⛈", text: "Always" }
      ]
    },
    {
      id: 12,
      position: 52,
      funFact: "Dumas Beach in Surat is known for its black sand and its reputation as one of the country's most haunted places.",
      question: "I feel like I am close to panic as though I am in Dumas Beach.",
      options: [
        { emoji: "☀", text: "Not at all" },
        { emoji: "🌤", text: "Sometimes" },
        { emoji: "🌧", text: "Often" },
        { emoji: "⛈", text: "Always" }
      ]
    },
    {
      id: 13,
      position: 56,
      funFact: "Leh–Ladakh offers rugged terrain ideal for high-altitude trekking, like the famous Chadar Trek, and extensive mountain biking opportunities making our hearts skip a beat.",
      question: "I am aware of the action of my heart in the absence of physical exertion (e.g., sense of heart rate increase, heart missing a beat, etc.).",
      options: [
        { emoji: "☀", text: "Not at all" },
        { emoji: "🌤", text: "Sometimes" },
        { emoji: "🌧", text: "Often" },
        { emoji: "⛈", text: "Always" }
      ]
    },
    {
      id: 14,
      position: 60,
      funFact: "Rani Lakshmibai, Queen of Jhansi, was a fearless leader of the Indian Rebellion of 1857.",
      question: "Sometimes I feel scared without any good reason, unlike Rani Lakshmibai.",
      options: [
        { emoji: "☀", text: "Not at all" },
        { emoji: "🌤", text: "Sometimes" },
        { emoji: "🌧", text: "Often" },
        { emoji: "⛈", text: "Always" }
      ]
    },
    {
      id: 15,
      position: 64,
      funFact: "Rishikesh of Uttarakhand is known as the Yoga Capital of the World, surrounded by the Himalayas.",
      question: "I couldn't seem to experience any positive feeling at all. I think I need to go to Rishikesh.",
      options: [
        { emoji: "☀", text: "Not at all" },
        { emoji: "🌤", text: "Sometimes" },
        { emoji: "🌧", text: "Often" },
        { emoji: "⛈", text: "Always" }
      ]
    },
    {
      id: 16,
      position: 70,
      funFact: "The first sunrise in India is at Dong village in Anjaw District of Arunachal Pradesh.",
      question: "I watch opportunities appear like sunrise in Dong village but find it difficult to work up the initiative to do things.",
      options: [
        { emoji: "☀", text: "Not at all" },
        { emoji: "🌤", text: "Sometimes" },
        { emoji: "🌧", text: "Often" },
        { emoji: "⛈", text: "Always" }
      ]
    },
    {
      id: 17,
      position: 75,
      funFact: "Kanchenjunga is the third highest mountain in the world and its name means 'five treasures of snow' after its five high peaks.",
      question: "When I look forward toward Kanchenjunga, I see five high peaks but personally I feel like I have nothing to look forward to.",
      options: [
        { emoji: "☀", text: "Not at all" },
        { emoji: "🌤", text: "Sometimes" },
        { emoji: "🌧", text: "Often" },
        { emoji: "⛈", text: "Always" }
      ]
    },
    {
      id: 18,
      position: 80,
      funFact: "Siachen Glacier is the world's highest and coldest battlefield.",
      question: "I feel down-hearted and blue, like I am at Siachen Glacier, losing a battle.",
      options: [
        { emoji: "☀", text: "Not at all" },
        { emoji: "🌤", text: "Sometimes" },
        { emoji: "🌧", text: "Often" },
        { emoji: "⛈", text: "Always" }
      ]
    },
    {
      id: 19,
      position: 87,
      funFact: "Wonderla Kochi is the first park in India to get ISO 14001 certificate for eco-friendliness and OHSAS 18001 certificate for safety.",
      question: "Even if I am in Wonderla, I feel I am unable to become enthusiastic about anything.",
      options: [
        { emoji: "☀", text: "Not at all" },
        { emoji: "🌤", text: "Sometimes" },
        { emoji: "🌧", text: "Often" },
        { emoji: "⛈", text: "Always" }
      ]
    },
    {
      id: 20,
      position: 95,
      funFact: "Dr. A. P. J. Abdul Kalam, born in Rameswaram, is lovingly called the 'People's President' and 'Missile Man of India.'",
      question: "I feel I am not worth much as a person. But I need to strive to be like our beloved president.",
      options: [
        { emoji: "☀", text: "Not at all" },
        { emoji: "🌤", text: "Sometimes" },
        { emoji: "🌧", text: "Often" },
        { emoji: "⛈", text: "Always" }
      ]
    },
    {
      id: 21,
      position: 98,
      funFact: "Bhakra–Nangal Multipurpose River Valley Project is a joint venture between Punjab, Haryana, and Rajasthan providing irrigation and hydroelectric power.",
      question: "I feel life is meaningless without any purpose.",
      options: [
        { emoji: "☀", text: "Not at all" },
        { emoji: "🌤", text: "Sometimes" },
        { emoji: "🌧", text: "Often" },
        { emoji: "⛈", text: "Always" }
      ]
    }
  ];

  // Initial piece positions (updated as per requirements)
  const pieces: { [key: number]: Piece } = {
    1: { type: "pawn", symbol: "♙" },
    7: { type: "rook", symbol: "♖" },
    19: { type: "bishop", symbol: "♗" },
    28: { type: "queen", symbol: "♕" },
    36: { type: "bishop", symbol: "♗" },
    39: { type: "knight", symbol: "♘" },
    43: { type: "rook", symbol: "♖" },
    47: { type: "bishop", symbol: "♗" },
    49: { type: "knight", symbol: "♘" },
    51: { type: "queen", symbol: "♕" },
    59: { type: "knight", symbol: "♘" },
    76: { type: "rook", symbol: "♖" },
    82: { type: "knight", symbol: "♘" },
    88: { type: "knight", symbol: "♘" },
    92: { type: "rook", symbol: "♖" },
    97: { type: "knight", symbol: "♘" },
    100: { type: "king", symbol: "♔" },
  };

  // Convert position to row and column in snake pattern
  const getRowCol = (position: number) => {
    const row = Math.floor((position - 1) / 10);
    const col = (position - 1) % 10;
    const isEvenRow = row % 2 === 0;
    return { row, col: isEvenRow ? col : 9 - col };
  };

  // Get position from row and column
  const getPosition = (row: number, col: number) => {
    const isEvenRow = row % 2 === 0;
    const actualCol = isEvenRow ? col : 9 - col;
    return row * 10 + actualCol + 1;
  };

  // Calculate diagonal moves for bishop
  const getDiagonalMoves = (position: number, steps: number) => {
    const { row, col } = getRowCol(position);
    const moves: number[] = [];
    const isWhiteSquare = position % 2 === 1;

    // Check all four diagonal directions
    const directions = [
      { dr: 1, dc: 1 },
      { dr: 1, dc: -1 },
      { dr: -1, dc: 1 },
      { dr: -1, dc: -1 },
    ];

    for (const { dr, dc } of directions) {
      const newRow = row + dr * steps;
      const newCol = col + dc * steps;

      if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
        const newPos = getPosition(newRow, newCol);
        // Check if the new position maintains the same color (odd/even)
        const newIsWhiteSquare = newPos % 2 === 1;
        if (newIsWhiteSquare === isWhiteSquare && newPos <= 100) {
          moves.push(newPos);
        }
      }
    }

    return moves;
  };

  // Calculate L-shape moves for knight (only downwards - towards position 1)
  const getKnightMoves = (position: number) => {
    const { row, col } = getRowCol(position);
    const moves: number[] = [];

    // All possible L-shaped moves
    const knightMoves = [
      { dr: 2, dc: 1 },
      { dr: 2, dc: -1 },
      { dr: -2, dc: 1 },
      { dr: -2, dc: -1 },
      { dr: 1, dc: 2 },
      { dr: 1, dc: -2 },
      { dr: -1, dc: 2 },
      { dr: -1, dc: -2 },
    ];

    for (const { dr, dc } of knightMoves) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
        const newPos = getPosition(newRow, newCol);
        // Only allow moves that go downwards (decrease position)
        if (newPos <= 100 && newPos < position) {
          moves.push(newPos);
        }
      }
    }

    return moves;
  };

  const saveScoresToDatabase = async () => {
    if (!user || scoresSaved) return;

    try {
      const { error } = await supabase
        .from("student_scores")
        .insert({
          user_id: user.id,
          stress_score: stressScore * 2,
          anxiety_score: anxietyScore * 2,
          depression_score: depressionScore * 2
        });

      if (error) throw error;
      setScoresSaved(true);
      toast.success("Your scores have been saved!");
    } catch (error: any) {
      console.error("Error saving scores:", error);
      toast.error("Failed to save scores");
    }
  };

  const rollDice = () => {
    if (!gameStarted) return;
    
    setIsRolling(true);
    const value = Math.floor(Math.random() * 6) + 1;
    
    setTimeout(() => {
      setDiceValue(value);
      setIsRolling(false);
      
      // Check if player can move with this dice value
      const targetPosition = playerPosition + value;
      
      if (targetPosition > 100) {
        // Stay at current position if dice value overshoots 100
        return;
      }
      
      // Move step by step with animation
      movePlayerStepByStep(value);
    }, 500);
  };

  const movePlayerStepByStep = (steps: number) => {
    setIsMoving(true);
    let currentStep = 0;
    const startPosition = playerPosition;
    
    const interval = setInterval(() => {
      currentStep++;
      const newPosition = startPosition + currentStep;
      setPlayerPosition(newPosition);
      
      // Check if we crossed or landed on a question position during this step
      const questionToAsk = questions.find(q => 
        newPosition >= q.position && 
        startPosition < q.position && 
        !answeredQuestions.includes(q.id)
      );
      
      if (questionToAsk) {
        clearInterval(interval);
        setIsMoving(false);
        setTimeout(() => {
          setCurrentQuestion(questionToAsk);
          setShowQuestionDialog(true);
        }, 500);
        return;
      }
      
      if (currentStep >= steps) {
        clearInterval(interval);
        setIsMoving(false);
        
        // Check if reached 100
        if (newPosition === 100) {
          // Check for any skipped questions before showing results
          const skippedQuestions = questions.filter(q => 
            newPosition >= q.position && 
            !answeredQuestions.includes(q.id)
          );
          
          if (skippedQuestions.length > 0) {
            setTimeout(() => {
              setCurrentQuestion(skippedQuestions[0]);
              setShowQuestionDialog(true);
            }, 500);
          } else {
            setTimeout(async () => {
              await saveScoresToDatabase();
              setShowFinalResults(true);
            }, 500);
          }
          return;
        }
        
        // Check if landed on a special piece
        const landedPiece = pieces[newPosition];
        if (landedPiece) {
          setTimeout(() => handlePieceLanding(landedPiece.type, newPosition), 500);
        }
      }
    }, 400); // 400ms per step for smooth animation
  };

  const startGame = () => {
    setGameStarted(true);
    setPlayerPosition(1);
    setDiceValue(null);
  };

  const resetGame = () => {
    setPlayerPosition(1);
    setDiceValue(null);
    setGameStarted(false);
    setIsMoving(false);
    setValidMoves([]);
    setShowQueenDialog(false);
    setShowQuestionDialog(false);
    setAnsweredQuestions([]);
    setCurrentQuestion(null);
    setStressScore(0);
    setAnxietyScore(0);
    setDepressionScore(0);
    setShowFinalResults(false);
    setScoresSaved(false);
  };


  const handlePieceLanding = (pieceType: PieceType, position: number) => {
    if (!pieceType) return;

    switch (pieceType) {
      case "bishop":
        // Move 3 steps diagonally
        const bishopMoves = getDiagonalMoves(position, 3);
        if (bishopMoves.length > 0) {
          setValidMoves(bishopMoves);
          setTimeout(() => {
            const move = bishopMoves[0];
            
            // Check for skipped questions during bishop move
            const skippedQuestions = questions.filter(q => 
              move >= q.position && 
              position < q.position && 
              !answeredQuestions.includes(q.id)
            );
            
            setPlayerPosition(move);
            setValidMoves([]);
            
            // Ask skipped questions if any
            if (skippedQuestions.length > 0) {
              setTimeout(() => {
                setCurrentQuestion(skippedQuestions[0]);
                setShowQuestionDialog(true);
              }, 500);
            }
          }, 1500);
        }
        break;

      case "rook":
        // Move +5 steps forward
        const rookMove = Math.min(position + 5, 100);
        
        // Check for skipped questions during rook move
        const rookSkippedQuestions = questions.filter(q => 
          rookMove >= q.position && 
          position < q.position && 
          !answeredQuestions.includes(q.id)
        );
        
        setTimeout(() => {
          setPlayerPosition(rookMove);
          
          // Ask skipped questions if any
          if (rookSkippedQuestions.length > 0) {
            setTimeout(() => {
              setCurrentQuestion(rookSkippedQuestions[0]);
              setShowQuestionDialog(true);
            }, 500);
          } else if (rookMove === 100) {
            setTimeout(() => {
              setShowFinalResults(true);
            }, 500);
          }
        }, 1000);
        break;

      case "queen":
        // Show dialog for choice
        setShowQueenDialog(true);
        break;

      case "knight":
        // Move in L-shape
        const knightMoves = getKnightMoves(position);
        if (knightMoves.length > 0) {
          setValidMoves(knightMoves);
          setTimeout(() => {
            const move = knightMoves[0];
            
            // Check for skipped questions during knight move
            const knightSkippedQuestions = questions.filter(q => 
              (move <= q.position && q.position <= position) && 
              !answeredQuestions.includes(q.id)
            );
            
            setPlayerPosition(move);
            setValidMoves([]);
            
            // Ask skipped questions if any
            if (knightSkippedQuestions.length > 0) {
              setTimeout(() => {
                setCurrentQuestion(knightSkippedQuestions[0]);
                setShowQuestionDialog(true);
              }, 500);
            }
          }, 1500);
        }
        break;
    }
  };

  const handleQueenChoice = (choice: "diagonal" | "forward") => {
    const currentPos = playerPosition;
    let newPos: number;
    
    if (choice === "diagonal") {
      const diagonalMoves = getDiagonalMoves(currentPos, 3);
      if (diagonalMoves.length > 0) {
        newPos = diagonalMoves[0];
      } else {
        setShowQueenDialog(false);
        return;
      }
    } else {
      newPos = Math.min(currentPos + 5, 100);
    }
    
    // Check for skipped questions during queen move
    const queenSkippedQuestions = questions.filter(q => 
      newPos >= q.position && 
      currentPos < q.position && 
      !answeredQuestions.includes(q.id)
    );
    
    setPlayerPosition(newPos);
    setShowQueenDialog(false);
    
    // Ask skipped questions if any
    if (queenSkippedQuestions.length > 0) {
      setTimeout(() => {
        setCurrentQuestion(queenSkippedQuestions[0]);
        setShowQuestionDialog(true);
      }, 500);
    } else if (newPos === 100) {
      setTimeout(() => {
        setShowFinalResults(true);
      }, 500);
    }
  };

  // Severity level calculation functions
  const getDepressionLevel = (score: number) => {
    if (score <= 9) return "Normal";
    if (score <= 13) return "Mild";
    if (score <= 20) return "Moderate";
    if (score <= 27) return "Severe";
    return "Extremely Severe";
  };

  const getAnxietyLevel = (score: number) => {
    if (score <= 7) return "Normal";
    if (score <= 9) return "Mild";
    if (score <= 14) return "Moderate";
    if (score <= 19) return "Severe";
    return "Extremely Severe";
  };

  const getStressLevel = (score: number) => {
    if (score <= 14) return "Normal";
    if (score <= 18) return "Mild";
    if (score <= 25) return "Moderate";
    if (score <= 33) return "Severe";
    return "Extremely Severe";
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (currentQuestion) {
      // Calculate score based on option index (0-3 points)
      const points = answerIndex;
      
      // Determine category and update score
      if (stressPositions.includes(currentQuestion.position)) {
        setStressScore(prev => prev + points);
      } else if (anxietyPositions.includes(currentQuestion.position)) {
        setAnxietyScore(prev => prev + points);
      } else if (depressionPositions.includes(currentQuestion.position)) {
        setDepressionScore(prev => prev + points);
      }
      
      setAnsweredQuestions([...answeredQuestions, currentQuestion.id]);
    }
    setShowQuestionDialog(false);
    
    // Check if there are more unanswered questions that were crossed
    const nextQuestion = questions.find(q => 
      playerPosition >= q.position && 
      !answeredQuestions.includes(q.id) &&
      q.id !== currentQuestion?.id
    );
    
    if (nextQuestion) {
      setTimeout(() => {
        setCurrentQuestion(nextQuestion);
        setShowQuestionDialog(true);
      }, 500);
      return;
    }
    
    // Check if reached 100 after answering all questions
    if (playerPosition === 100) {
      setTimeout(async () => {
        await saveScoresToDatabase();
        setShowFinalResults(true);
      }, 500);
      return;
    }
    
    // Continue checking for pieces after answering all questions
    const landedPiece = pieces[playerPosition];
    if (landedPiece) {
      setTimeout(() => handlePieceLanding(landedPiece.type, playerPosition), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-red-100 dark:from-orange-950 dark:via-amber-950 dark:to-red-950 flex flex-col items-center justify-center p-4 gap-8 relative overflow-hidden">
      {/* Traditional Indian decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Rangoli-inspired patterns */}
        <div className="absolute top-10 left-10 w-72 h-72">
          <div className="absolute inset-0 rounded-full border-8 border-orange-400/20 dark:border-orange-500/10" style={{ borderStyle: 'double' }}></div>
          <div className="absolute inset-4 rounded-full border-4 border-red-400/20 dark:border-red-500/10" style={{ borderStyle: 'dashed' }}></div>
          <div className="absolute inset-8 rounded-full border-2 border-amber-400/20 dark:border-amber-500/10"></div>
        </div>
        <div className="absolute bottom-20 right-20 w-96 h-96">
          <div className="absolute inset-0 rounded-full border-8 border-red-400/20 dark:border-red-500/10" style={{ borderStyle: 'double' }}></div>
          <div className="absolute inset-6 rounded-full border-6 border-orange-400/20 dark:border-orange-500/10" style={{ borderStyle: 'dotted' }}></div>
        </div>
        {/* Center lotus-inspired pattern */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
          <div className="absolute inset-0 rounded-full border-8 border-amber-400/15 dark:border-amber-500/10" style={{ borderStyle: 'double' }}></div>
          <div className="absolute inset-12 rounded-full border-6 border-orange-400/15 dark:border-orange-500/10" style={{ borderStyle: 'dotted' }}></div>
        </div>
        {/* Additional decorative mandala corners */}
        <div className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full border-4 border-orange-300/20 dark:border-orange-500/10" style={{ borderStyle: 'dashed' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full border-4 border-red-300/20 dark:border-red-500/10" style={{ borderStyle: 'dashed' }}></div>
      </div>

      <Button
        onClick={() => setShowExitDialog(true)}
        variant="outline"
        size="lg"
        className="absolute top-4 left-4 text-lg px-6 py-3 z-10 border-2 border-orange-300 hover:bg-orange-50 dark:border-orange-700 dark:hover:bg-orange-950"
      >
        ← Back to Home
      </Button>

      <Button
        onClick={resetGame}
        variant="destructive"
        size="lg"
        className="absolute top-4 right-4 text-lg px-6 py-3 z-10 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
      >
        Reset Game 🔄
      </Button>

      <div className="text-center space-y-2 relative z-10">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 bg-clip-text text-transparent drop-shadow-lg">🪷 Persona</h1>
        <p className="text-orange-900 dark:text-orange-200 text-lg font-medium">Navigate through awareness & reach your goal!</p>
      </div>

      {gameStarted && (
        <div className="text-center relative z-10">
          <div className="text-xl font-semibold text-foreground mb-4">
            Current Position: <span className="text-accent text-3xl">{playerPosition}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-10 gap-0 border-4 border-primary shadow-2xl relative z-10 bg-card/80 backdrop-blur-sm rounded-lg">
        {Array.from({ length: 100 }, (_, i) => {
          const position = 100 - i;
          const row = Math.floor(i / 10);
          const col = i % 10;
          const isEvenRow = row % 2 === 0;
          const actualPosition = isEvenRow ? 100 - (row * 10 + col) : 100 - (row * 10 + (9 - col));
          
          const isWhiteSquare = actualPosition % 2 === 1;
          const piece = pieces[actualPosition];
          const isPlayerHere = playerPosition === actualPosition;
          const isValidMove = validMoves.includes(actualPosition);

          return (
            <div
              key={actualPosition}
              className={`w-16 h-16 flex flex-col items-center justify-center border border-border relative transition-all duration-300 ${
                isWhiteSquare ? "bg-game-light" : "bg-game-dark"
              } ${isPlayerHere ? "ring-4 ring-game-start" : ""} ${
                isValidMove ? "ring-4 ring-game-highlight" : ""
              }`}
            >
              <span
                className={`text-xs font-bold absolute top-1 left-1 ${
                  isWhiteSquare ? "text-foreground" : "text-primary-foreground"
                }`}
              >
                {actualPosition}
              </span>

              {actualPosition === 1 && (
                <span className="text-xs font-bold text-game-start">START</span>
              )}

              {actualPosition === 100 && (
                <span className="text-3xl">👑</span>
              )}

              {piece && actualPosition !== 1 && actualPosition !== 100 && !isPlayerHere && (
                <span className={`text-3xl ${isWhiteSquare ? "!text-black" : "!text-white"}`}>
                  {piece.symbol}
                </span>
              )}

              {isPlayerHere && (
                <span className="text-4xl animate-bounce">♙</span>
              )}
            </div>
          );
        })}
      </div>

      {gameStarted && (
        <div className="flex flex-col items-center gap-4 relative z-10 mt-8">
          <Dice value={diceValue} isRolling={isRolling} />
          <Button
            onClick={rollDice}
            disabled={isRolling || isMoving || playerPosition === 100}
            size="lg"
            className="text-xl px-8 py-6"
          >
            {isRolling ? "Rolling..." : isMoving ? "Moving..." : "Roll Dice 🎲"}
          </Button>
        </div>
      )}

      {!gameStarted && (
        <Button
          onClick={startGame}
          size="lg"
          variant="default"
          className="text-2xl px-12 py-8 h-auto relative z-10 bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white shadow-xl"
        >
          START GAME 🎮
        </Button>
      )}

      <Dialog open={showQueenDialog} onOpenChange={setShowQueenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Queen's Choice ♕</DialogTitle>
            <DialogDescription>
              Choose your move: diagonal like a Bishop or forward like a Rook?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-center mt-4">
            <Button onClick={() => handleQueenChoice("diagonal")} variant="secondary">
              Diagonal (3 steps) ♗
            </Button>
            <Button onClick={() => handleQueenChoice("forward")}>
              Forward (+5 steps) ♖
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
        <DialogContent className="sm:max-w-md bg-card">
          {currentQuestion && (
            <div className="flex flex-col items-center space-y-4 py-6">
              <div className="w-full bg-primary/10 rounded-lg p-4 border-2 border-primary/30">
                <p className="text-sm font-semibold text-primary mb-2">Fun Fact:</p>
                <p className="text-sm text-foreground">{currentQuestion.funFact}</p>
              </div>
              
              <DialogHeader className="text-center w-full">
                <DialogDescription className="text-base pt-2 text-foreground font-medium">
                  {currentQuestion.question}
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-col gap-3 w-full mt-4">
                {currentQuestion.options.map((option: any, index: number) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    variant="outline"
                    className="h-20 text-lg border-2 border-orange-300/50 hover:border-orange-500 hover:bg-orange-50 dark:border-orange-700/50 dark:hover:border-orange-500 dark:hover:bg-orange-950/50 flex items-center justify-start gap-4 px-6"
                  >
                    <span className="text-2xl">{index + 1}️⃣</span>
                    <span className="text-3xl">{option.emoji}</span>
                    <span className="font-semibold text-xl text-orange-900 dark:text-orange-100">{option.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showFinalResults} onOpenChange={setShowFinalResults}>
        <DialogContent className="sm:max-w-2xl bg-card">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
              Your Mental Health Assessment Results
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-2">
                🎯 Your Depression is {getDepressionLevel(depressionScore * 2)}
              </h3>
              <p className="text-3xl font-bold text-blue-800 dark:text-blue-300">({depressionScore * 2}/42)</p>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-6 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
              <h3 className="text-2xl font-bold text-yellow-700 dark:text-yellow-400 mb-2">
                💭 Your Anxiety is {getAnxietyLevel(anxietyScore * 2)}
              </h3>
              <p className="text-3xl font-bold text-yellow-800 dark:text-yellow-300">({anxietyScore * 2}/42)</p>
            </div>
            
            <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6 rounded-lg border-2 border-red-200 dark:border-red-800">
              <h3 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
                ⚡ Your Stress is {getStressLevel(stressScore * 2)}
              </h3>
              <p className="text-3xl font-bold text-red-800 dark:text-red-300">({stressScore * 2}/42)</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-4 pt-4">
            <Button 
              onClick={() => {
                setShowFinalResults(false);
                setShowSeraChatbot(true);
              }}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
            >
              Talk to SERA 💬
            </Button>
            <Button 
              onClick={resetGame} 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white"
            >
              Play Again 🔄
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {showSeraChatbot && (
        <SeraChatbot
          stressScore={stressScore * 2}
          anxietyScore={anxietyScore * 2}
          depressionScore={depressionScore * 2}
          onClose={() => setShowSeraChatbot(false)}
        />
      )}

      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to exit the game?</AlertDialogTitle>
            <AlertDialogDescription>
              Your current progress will not be saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/")}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GameBoard;

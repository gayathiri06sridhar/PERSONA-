import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Users } from "lucide-react";

interface StudentScore {
  id: string;
  user_id: string;
  stress_score: number;
  anxiety_score: number;
  depression_score: number;
  created_at: string;
  user_email?: string;
}

const InstituteDashboard = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState<StudentScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if institute is logged in
    const isLoggedIn = localStorage.getItem("instituteLoggedIn");
    if (!isLoggedIn) {
      navigate("/institute-login");
      return;
    }

    fetchStudentScores();
  }, [navigate]);

  const fetchStudentScores = async () => {
    try {
      const { data, error } = await supabase
        .from("student_scores")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setScores(data || []);
    } catch (error: any) {
      toast.error("Failed to load student scores");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("instituteLoggedIn");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const getLevel = (score: number, type: "stress" | "anxiety" | "depression") => {
    if (type === "stress") {
      if (score <= 14) return "Normal";
      if (score <= 18) return "Mild";
      if (score <= 25) return "Moderate";
      if (score <= 33) return "Severe";
      return "Extremely Severe";
    } else if (type === "anxiety") {
      if (score <= 7) return "Normal";
      if (score <= 9) return "Mild";
      if (score <= 14) return "Moderate";
      if (score <= 19) return "Severe";
      return "Extremely Severe";
    } else {
      if (score <= 9) return "Normal";
      if (score <= 13) return "Mild";
      if (score <= 20) return "Moderate";
      if (score <= 27) return "Severe";
      return "Extremely Severe";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-green-600 to-blue-600 bg-clip-text text-transparent">
                Institute Dashboard
              </h1>
              <p className="text-muted-foreground">Student Assessment Results</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-2 border-orange-200 hover:bg-orange-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-muted-foreground">Loading student scores...</p>
          </div>
        ) : scores.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-lg text-muted-foreground">No student scores available yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {scores.map((score) => (
              <Card key={score.id} className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Student Assessment</span>
                    <span className="text-sm text-muted-foreground font-normal">
                      {new Date(score.created_at).toLocaleDateString()}
                    </span>
                  </CardTitle>
                  <CardDescription>User ID: {score.user_id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                      <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-1">
                        Depression
                      </h3>
                      <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                        {score.depression_score}/42
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                        Level: {getLevel(score.depression_score, "depression")}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
                      <h3 className="text-lg font-bold text-yellow-700 dark:text-yellow-400 mb-1">
                        Anxiety
                      </h3>
                      <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">
                        {score.anxiety_score}/42
                      </p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                        Level: {getLevel(score.anxiety_score, "anxiety")}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-lg border-2 border-red-200 dark:border-red-800">
                      <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-1">
                        Stress
                      </h3>
                      <p className="text-2xl font-bold text-red-800 dark:text-red-300">
                        {score.stress_score}/42
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        Level: {getLevel(score.stress_score, "stress")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstituteDashboard;

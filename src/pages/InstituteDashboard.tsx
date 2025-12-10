import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Users, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface StudentScore {
  id: string;
  user_id: string;
  stress_score: number;
  anxiety_score: number;
  depression_score: number;
  created_at: string;
  full_name?: string;
}

const InstituteDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [scores, setScores] = useState<StudentScore[]>([]);
  const [filteredScores, setFilteredScores] = useState<StudentScore[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      if (authLoading) return;

      if (!user) {
        navigate("/institute-login");
        return;
      }

      // Verify user has admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (roleError || !roleData) {
        toast.error("Access denied. Admin privileges required.");
        await supabase.auth.signOut();
        navigate("/institute-login");
        return;
      }

      setIsAdmin(true);
      fetchStudentScores();
    };

    checkAdminAndFetchData();
  }, [user, authLoading, navigate]);

  const fetchStudentScores = async () => {
    try {
      // Fetch scores with profile data joined
      const { data: scoresData, error: scoresError } = await supabase
        .from("student_scores")
        .select("*")
        .order("created_at", { ascending: false });

      if (scoresError) throw scoresError;

      // Fetch profiles to get full_name
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name");

      if (profilesError) throw profilesError;

      // Map profiles to scores
      const profileMap = new Map(profilesData?.map(p => [p.id, p.full_name]) || []);
      const enrichedScores = (scoresData || []).map(score => ({
        ...score,
        full_name: profileMap.get(score.user_id) || score.user_id.substring(0, 8)
      }));

      setScores(enrichedScores);
      setFilteredScores(enrichedScores);
    } catch (error: any) {
      toast.error("Failed to load student scores");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter scores based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredScores(scores);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredScores(
        scores.filter(score => 
          (score.full_name?.toLowerCase().includes(query)) ||
          score.user_id.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, scores]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
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

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-green-50 to-blue-50">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

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

        {/* Search Box - Centered */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-base bg-white/90 backdrop-blur-sm border-2 border-orange-200 focus:border-orange-400 rounded-xl shadow-lg"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-muted-foreground">Loading student scores...</p>
          </div>
        ) : filteredScores.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-lg text-muted-foreground">
                {scores.length === 0 ? "No student scores available yet." : "No results found for your search."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-orange-100 via-green-100 to-blue-100 dark:from-orange-900/40 dark:via-green-900/40 dark:to-blue-900/40 border-b-2 border-orange-300">
                      <TableHead className="font-bold text-foreground text-base border-r border-orange-200">Date & Time</TableHead>
                      <TableHead className="font-bold text-foreground text-base border-r border-orange-200">Username</TableHead>
                      <TableHead className="font-bold text-foreground text-base border-r border-orange-200 text-center">Depression Score</TableHead>
                      <TableHead className="font-bold text-foreground text-base border-r border-orange-200 text-center">Depression Level</TableHead>
                      <TableHead className="font-bold text-foreground text-base border-r border-orange-200 text-center">Anxiety Score</TableHead>
                      <TableHead className="font-bold text-foreground text-base border-r border-orange-200 text-center">Anxiety Level</TableHead>
                      <TableHead className="font-bold text-foreground text-base border-r border-orange-200 text-center">Stress Score</TableHead>
                      <TableHead className="font-bold text-foreground text-base text-center">Stress Level</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScores.map((score, index) => {
                      const depLevel = getLevel(score.depression_score, "depression");
                      const anxLevel = getLevel(score.anxiety_score, "anxiety");
                      const stressLevel = getLevel(score.stress_score, "stress");
                      
                      return (
                        <TableRow 
                          key={score.id} 
                          className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'} hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors`}
                        >
                          <TableCell className="border-r border-gray-200 dark:border-gray-700 font-medium">
                            <div className="flex flex-col">
                              <span>{new Date(score.created_at).toLocaleDateString()}</span>
                              <span className="text-sm text-muted-foreground">
                                {new Date(score.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="border-r border-gray-200 dark:border-gray-700 font-medium">
                            {score.full_name || score.user_id.substring(0, 8)}
                          </TableCell>
                          <TableCell className="border-r border-gray-200 dark:border-gray-700 text-center font-semibold text-blue-700 dark:text-blue-400">
                            {score.depression_score}/42
                          </TableCell>
                          <TableCell className="border-r border-gray-200 dark:border-gray-700 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className={`font-semibold ${depLevel === "Extremely Severe" ? "text-red-700 dark:text-red-400" : "text-blue-700 dark:text-blue-400"}`}>
                                {depLevel}
                              </span>
                              {depLevel === "Extremely Severe" && (
                                <span className="text-red-600 text-xl animate-pulse">⚠️</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="border-r border-gray-200 dark:border-gray-700 text-center font-semibold text-yellow-700 dark:text-yellow-400">
                            {score.anxiety_score}/42
                          </TableCell>
                          <TableCell className="border-r border-gray-200 dark:border-gray-700 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className={`font-semibold ${anxLevel === "Extremely Severe" ? "text-red-700 dark:text-red-400" : "text-yellow-700 dark:text-yellow-400"}`}>
                                {anxLevel}
                              </span>
                              {anxLevel === "Extremely Severe" && (
                                <span className="text-red-600 text-xl animate-pulse">⚠️</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="border-r border-gray-200 dark:border-gray-700 text-center font-semibold text-red-700 dark:text-red-400">
                            {score.stress_score}/42
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className={`font-semibold ${stressLevel === "Extremely Severe" ? "text-red-700 dark:text-red-400" : "text-red-700 dark:text-red-400"}`}>
                                {stressLevel}
                              </span>
                              {stressLevel === "Extremely Severe" && (
                                <span className="text-red-600 text-xl animate-pulse">⚠️</span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InstituteDashboard;

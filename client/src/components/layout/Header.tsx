/**
 * Header Component - Global fixed header (Mobile-First)
 * 
 * Layout:
 * - Row 1: Brand | Selectors | SyncStatus | ThemeToggle
 * - Row 2: All 7 module tabs (horizontal scroll on mobile)
 * 
 * Modules: HOME | MATCHUP | WAIVER WIRE | SCHEDULE | ANALYTICS | MANAGERS | SETTINGS
 * 
 * Rules:
 * - 100% shadcn/ui components
 * - No CSS ad-hoc, only tokens/theme
 * - Selectors NEVER hidden (mobile: compact version)
 * - If capabilities disables a module → tab hidden or disabled with tooltip
 */
import { Trophy } from "lucide-react";
import { Link, useLocation } from "wouter";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppContext } from "@/contexts/ContextProvider";
import { SyncStatusIndicator } from "../SyncStatusIndicator";
import { ThemeToggle } from "../ThemeToggle";
import type { League, Team } from "@/hooks/useContext";
import { cn } from "@/lib/utils";

// All 7 module tabs per specification
const MODULE_TABS = [
  { id: "home", label: "Home", path: "/" },
  { id: "matchup", label: "Matchup", path: "/matchup" },
  { id: "waiver", label: "Waiver Wire", path: "/waiver" },
  { id: "schedule", label: "Schedule", path: "/schedule" },
  { id: "analytics", label: "Analytics", path: "/analytics" },
  { id: "managers", label: "Managers", path: "/managers" },
  { id: "settings", label: "Settings", path: "/settings" },
] as const;

export function Header() {
  const [location, setLocation] = useLocation();
  const { context, activeLeague, activeTeam, setActiveContext, loading } = useAppContext();
  
  // Get leagues from context
  const leagues: League[] = context?.leagues || [];
  const teams: Team[] = activeLeague?.teams || [];
  
  // Handle league selection
  const handleLeagueChange = async (leagueKey: string) => {
    const league = leagues.find((l: League) => l.league_key === leagueKey);
    const firstTeam = league?.teams?.[0];
    await setActiveContext(leagueKey, firstTeam?.team_key);
  };
  
  // Handle team selection
  const handleTeamChange = async (teamKey: string) => {
    if (activeLeague?.league_key) {
      await setActiveContext(activeLeague.league_key, teamKey);
    }
  };
  
  // Get current tab from location
  const currentTab = MODULE_TABS.find(tab => tab.path === location)?.id || "home";
  
  // Check if tab is available based on capabilities (placeholder for now)
  const isTabAvailable = (_tabId: string) => {
    // TODO: Check capabilities from context
    // For now, all tabs are available
    return true;
  };
  
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Main Header Row */}
      <div className="border-b">
        <div className="container flex h-12 items-center gap-2">
          {/* Brand */}
          <Link 
            href={activeLeague && activeTeam ? "/matchup" : "/"} 
            className="flex items-center gap-1.5 font-semibold shrink-0"
          >
            <Trophy className="h-5 w-5 text-primary" />
            <span className="hidden sm:inline text-sm">Sport Insider</span>
          </Link>
          
          {/* Context Selectors */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0 ml-2">
            {/* League Selector */}
            {loading ? (
              <Skeleton className="h-7 w-[100px] sm:w-[160px]" />
            ) : (
              <Select
                value={activeLeague?.league_key || ""}
                onValueChange={handleLeagueChange}
                disabled={leagues.length === 0}
              >
                <SelectTrigger className="h-7 w-[100px] sm:w-[160px] text-xs">
                  <SelectValue placeholder="League">
                    {activeLeague ? (
                      <span className="truncate">{activeLeague.name}</span>
                    ) : (
                      "Select League"
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {leagues.map((league: League) => (
                    <SelectItem key={league.league_key} value={league.league_key}>
                      {league.name} ({league.season})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {/* Team Selector */}
            {loading ? (
              <Skeleton className="h-7 w-[80px] sm:w-[120px]" />
            ) : (
              <Select
                value={activeTeam?.team_key || ""}
                onValueChange={handleTeamChange}
                disabled={!activeLeague || teams.length === 0}
              >
                <SelectTrigger className="h-7 w-[80px] sm:w-[120px] text-xs">
                  <SelectValue placeholder="Team">
                    {activeTeam ? (
                      <span className="truncate">{activeTeam.name}</span>
                    ) : (
                      "Team"
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team: Team) => (
                    <SelectItem key={team.team_key} value={team.team_key}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          {/* Right Controls */}
          <div className="flex items-center gap-1 shrink-0">
            <SyncStatusIndicator />
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      {/* Module Tabs Row - Horizontal scroll */}
      <div className="border-b bg-muted/30">
        <div className="container">
          <TooltipProvider>
            <nav className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide py-1.5 -mx-1 px-1">
              {MODULE_TABS.map((tab) => {
                const available = isTabAvailable(tab.id);
                const isActive = currentTab === tab.id;
                
                const tabButton = (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    size="sm"
                    disabled={!available}
                    className={cn(
                      "h-7 px-3 text-xs shrink-0 rounded-full transition-colors",
                      isActive 
                        ? "bg-background text-foreground shadow-sm border" 
                        : "text-muted-foreground hover:text-foreground",
                      !available && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => available && setLocation(tab.path)}
                  >
                    {tab.label}
                  </Button>
                );
                
                // Wrap disabled tabs in tooltip
                if (!available) {
                  return (
                    <Tooltip key={tab.id}>
                      <TooltipTrigger asChild>
                        {tabButton}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Not available for this league settings</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }
                
                return tabButton;
              })}
            </nav>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}

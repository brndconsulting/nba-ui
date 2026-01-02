/**
 * ContextGate - Guards access without active context
 * 
 * States (per spec 0.2):
 * - Loading: Fetching context from API
 * - Empty: No leagues found for owner
 * - Missing: Context exists but no active selection
 * - Error: API error or token invalid
 * - Ready: Has active league and team → render children
 * 
 * Design: 100% shadcn/ui, no hardcode estético
 */
import React, { useState } from 'react';
import { useAppContext } from '@/contexts/ContextProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ContextGate({ children }: { children: React.ReactNode }) {
  const { context, loading, error, setActiveContext } = useAppContext();
  const [selectedLeagueKey, setSelectedLeagueKey] = useState<string>('');
  const [selectedTeamKey, setSelectedTeamKey] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mientras carga
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Loading context...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sin ligas
  if (!context || context.leagues.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No leagues found</CardTitle>
            <CardDescription>
              No fantasy leagues found for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Please verify your Yahoo Fantasy account is connected and has active leagues.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Con contexto activo, renderizar children
  if (context.active_league_key && context.active_team_key) {
    return <>{children}</>;
  }

  // Selector de liga/equipo
  const leagues = context.leagues;
  const selectedLeague = leagues.find((l) => l.league_key === selectedLeagueKey);
  const teams = selectedLeague?.teams || [];

  const handleSubmit = async () => {
    if (!selectedLeagueKey || !selectedTeamKey) return;

    setIsSubmitting(true);
    try {
      const success = await setActiveContext(selectedLeagueKey, selectedTeamKey);
      if (!success) {
        alert('Error setting context');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Select League & Team</CardTitle>
          <CardDescription>
            Choose your active league and team to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Liga */}
          <div className="space-y-2">
            <label className="text-sm font-medium">League</label>
            <Select value={selectedLeagueKey} onValueChange={setSelectedLeagueKey}>
              <SelectTrigger>
                <SelectValue placeholder="Select a league" />
              </SelectTrigger>
              <SelectContent>
                {leagues.map((league) => (
                  <SelectItem key={league.league_key} value={league.league_key}>
                    {league.name} ({league.season})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Equipo */}
          {selectedLeague && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Team</label>
              <Select value={selectedTeamKey} onValueChange={setSelectedTeamKey}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.team_key} value={team.team_key}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!selectedLeagueKey || !selectedTeamKey || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Loading...' : 'Continue'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

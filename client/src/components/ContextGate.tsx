/**
 * ContextGate - bloquea acceso sin contexto activo
 * Muestra selector de liga/equipo si no hay selección
 * Solo renderiza children si hay contexto válido
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
            <CardTitle>Cargando contexto...</CardTitle>
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
            <CardTitle>Sin ligas disponibles</CardTitle>
            <CardDescription>
              No se encontraron ligas para tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Por favor, verifica tu cuenta de Yahoo Fantasy NBA
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
        alert('Error al cambiar contexto');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Selecciona tu liga y equipo</CardTitle>
          <CardDescription>
            Elige dónde quieres jugar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Liga */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Liga</label>
            <Select value={selectedLeagueKey} onValueChange={setSelectedLeagueKey}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una liga" />
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
              <label className="text-sm font-medium">Equipo</label>
              <Select value={selectedTeamKey} onValueChange={setSelectedTeamKey}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu equipo" />
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
            {isSubmitting ? 'Cargando...' : 'Continuar'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

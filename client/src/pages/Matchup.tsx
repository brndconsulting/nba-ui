/**
 * Página de Matchup - UI dinámica según capabilities
 * - Tabs: Resumen, Categorías/Puntos, Detalle
 * - Skeleton sin números, StaleState con timestamp
 * - 100% shadcn/ui
 */
import React, { useMemo } from 'react';
import { useAppContext } from '@/contexts/ContextProvider';
import { useMatchups, useCapabilities } from '@/hooks/useMatchups';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Clock } from 'lucide-react';
import { copy } from '@/lib/copy/es';

export default function Matchup() {
  const { activeLeague, activeTeam, ownerId } = useAppContext();
  
  const { matchup, loading: matchupLoading, error: matchupError, lastSyncAt } = useMatchups(
    activeLeague?.league_key || '',
    activeTeam?.team_key,
    ownerId || undefined
  );
  
  const { capabilities, loading: capabilitiesLoading } = useCapabilities(
    activeLeague?.league_key || '',
    ownerId || undefined
  );

  const isLoading = matchupLoading || capabilitiesLoading;

  // Determinar si mostrar categorías o puntos
  const showCategories = capabilities?.has_categories_scoring ?? false;
  const showPoints = capabilities?.has_points_scoring ?? true;

  // Calcular si los datos están desactualizados (más de 1 hora)
  const isStale = useMemo(() => {
    if (!lastSyncAt) return false;
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return lastSyncAt < oneHourAgo;
  }, [lastSyncAt]);

  if (!activeLeague || !activeTeam) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Por favor selecciona una liga y equipo
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{copy.matchup.title}</h1>
        <p className="text-muted-foreground">{copy.matchup.subtitle}</p>
      </div>

      {/* Error State */}
      {matchupError && !isLoading && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{copy.matchup.error.invalidPayload}</AlertDescription>
        </Alert>
      )}

      {/* Stale State */}
      {isStale && lastSyncAt && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            {copy.matchup.stale.label} - {lastSyncAt.toLocaleString()}
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !matchup && (
        <Card>
          <CardHeader>
            <CardTitle>{copy.matchup.empty.noSnapshot}</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            {copy.matchup.empty.noData}
          </CardContent>
        </Card>
      )}

      {/* Matchup Content */}
      {!isLoading && matchup && (
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">{copy.matchup.tabs.summary}</TabsTrigger>
            {showCategories && (
              <TabsTrigger value="categories">{copy.matchup.tabs.categories}</TabsTrigger>
            )}
            {showPoints && (
              <TabsTrigger value="points">{copy.matchup.tabs.details}</TabsTrigger>
            )}
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {matchup.teams.map((team) => (
                <Card key={team.team_key}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {team.logo_url && (
                        <img
                          src={team.logo_url}
                          alt={team.name}
                          className="h-8 w-8 rounded"
                        />
                      )}
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {team.points_total !== null && team.points_total !== undefined && (
                      <div className="text-3xl font-bold">
                        {team.points_total.toFixed(1)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Categories Tab */}
          {showCategories && (
            <TabsContent value="categories" className="space-y-4">
              <div className="space-y-2">
                {matchup.teams[0]?.categories.map((category) => (
                  <Card key={category.stat_id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.name}</span>
                        <div className="flex items-center gap-2">
                          {matchup.teams.map((team) => {
                            const teamCategory = team.categories.find(
                              (c) => c.stat_id === category.stat_id
                            );
                            return (
                              <div key={team.team_key} className="text-right">
                                <div className="font-semibold">
                                  {teamCategory?.display_value || '-'}
                                </div>
                                {teamCategory?.result && (
                                  <Badge variant="outline">
                                    {teamCategory.result}
                                  </Badge>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}

          {/* Points Tab */}
          {showPoints && (
            <TabsContent value="points" className="space-y-4">
              <div className="space-y-2">
                {matchup.teams.map((team) => (
                  <Card key={team.team_key}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{team.name}</span>
                        <span className="text-2xl font-bold">
                          {team.points_total?.toFixed(1) || '-'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      )}

      {/* Metadata */}
      {lastSyncAt && (
        <div className="text-xs text-muted-foreground text-center">
          Última actualización: {lastSyncAt.toLocaleString()}
        </div>
      )}
    </div>
  );
}

/**
 * SyncStatusIndicator - Data Health Indicator for Header
 * 
 * Shows compact badge with overall status + popover with domain details
 * 100% shadcn/ui components, no hardcoded styles
 * 
 * Spec compliance:
 * - Indicador compacto (badge/dot) por overall_status
 * - Tooltip/Popover shadcn con detalle por dominio
 * - Timestamp accesible (last_sync_at)
 */

import { useAppContext } from '@/contexts/ContextProvider';
import { 
  useSyncStatus, 
  getStatusDotClass, 
  formatSyncTime,
  type SyncStatusType,
  type DomainStatus,
} from '@/hooks/useSyncStatus';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RefreshCw, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Status icon based on domain status
 */
function StatusIcon({ status }: { status: SyncStatusType }) {
  switch (status) {
    case 'fresh':
      return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />;
    case 'stale':
      return <Clock className="h-3.5 w-3.5 text-yellow-500" />;
    case 'missing':
      return <AlertCircle className="h-3.5 w-3.5 text-red-500" />;
    default:
      return null;
  }
}

/**
 * Single domain row in the popover
 */
function DomainRow({ 
  domain, 
  info 
}: { 
  domain: string; 
  info: DomainStatus;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <StatusIcon status={info.status} />
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm font-medium cursor-help">
              {info.display_name}
            </span>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-[200px]">
            <p className="text-xs">{info.description}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {formatSyncTime(info.last_sync_at)}
        </span>
        <div 
          className={cn(
            "h-2 w-2 rounded-full",
            getStatusDotClass(info.status)
          )} 
        />
      </div>
    </div>
  );
}

/**
 * Overall status badge with color coding
 */
function OverallStatusBadge({ 
  status, 
  loading 
}: { 
  status: 'fresh' | 'stale' | 'incomplete' | null;
  loading: boolean;
}) {
  if (loading) {
    return <Skeleton className="h-6 w-16" />;
  }

  const getVariant = () => {
    switch (status) {
      case 'fresh':
        return 'default';
      case 'stale':
        return 'secondary';
      case 'incomplete':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'fresh':
        return 'Synced';
      case 'stale':
        return 'Stale';
      case 'incomplete':
        return 'Incomplete';
      default:
        return 'Unknown';
    }
  };

  const getDotClass = () => {
    switch (status) {
      case 'fresh':
        return 'bg-green-500';
      case 'stale':
        return 'bg-yellow-500';
      case 'incomplete':
        return 'bg-red-500';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Badge variant={getVariant()} className="gap-1.5">
      <span className={cn("h-1.5 w-1.5 rounded-full", getDotClass())} />
      {getLabel()}
    </Badge>
  );
}

/**
 * Main SyncStatusIndicator component
 */
export function SyncStatusIndicator() {
  const { ownerId, activeLeague } = useAppContext();
  const { data, loading, error, refetch } = useSyncStatus(
    ownerId,
    activeLeague?.league_key || null
  );

  // Don't render if no owner
  if (!ownerId) {
    return null;
  }

  // Error state
  if (error && !data) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="destructive" className="gap-1.5 cursor-help">
            <AlertCircle className="h-3 w-3" />
            Error
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{error}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  // Group domains by status for summary
  const statusCounts: Partial<Record<SyncStatusType, number>> = data 
    ? Object.values(data.sync_status).reduce(
        (acc, info) => {
          acc[info.status] = (acc[info.status] || 0) + 1;
          return acc;
        },
        {} as Partial<Record<SyncStatusType, number>>
      ) 
    : {};

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 gap-1.5 px-2"
          disabled={loading}
        >
          <OverallStatusBadge 
            status={data?.overall_status || null} 
            loading={loading} 
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className="w-80"
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Data Health</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0"
              onClick={() => refetch()}
              disabled={loading}
            >
              <RefreshCw className={cn(
                "h-3.5 w-3.5",
                loading && "animate-spin"
              )} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>

          {/* Summary badges */}
          {data && (
            <div className="flex gap-2 flex-wrap">
              {statusCounts.fresh && (
                <Badge variant="outline" className="gap-1 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {statusCounts.fresh} fresh
                </Badge>
              )}
              {statusCounts.stale && (
                <Badge variant="outline" className="gap-1 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                  {statusCounts.stale} stale
                </Badge>
              )}
              {statusCounts.missing && (
                <Badge variant="outline" className="gap-1 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  {statusCounts.missing} missing
                </Badge>
              )}
            </div>
          )}

          <Separator />

          {/* Domain list */}
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          ) : data ? (
            <div className="max-h-[300px] overflow-y-auto">
              {Object.entries(data.sync_status).map(([domain, info]) => (
                <DomainRow key={domain} domain={domain} info={info} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No sync data available
            </p>
          )}

          {/* Footer with context info */}
          {data && (
            <>
              <Separator />
              <div className="text-xs text-muted-foreground">
                {data.league_key ? (
                  <span>League: {data.league_key}</span>
                ) : (
                  <span>Global context</span>
                )}
                <span className="mx-2">•</span>
                <span>{data.domains_count} domains</span>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

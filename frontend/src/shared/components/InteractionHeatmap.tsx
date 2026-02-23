import { useMemo, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface InteractionCount {
  date: string;
  count: number;
}

interface InteractionHeatmapProps {
  data: InteractionCount[];
}

interface DayData {
  dateString: string;
  count: number;
  inRange: boolean;
}

interface TooltipData {
  x: number;
  y: number;
  date: string;
  count: number;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function InteractionHeatmap({ data }: InteractionHeatmapProps) {
  const { t } = useTranslation('heatmap');
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(containerRef.current);
    setContainerWidth(containerRef.current.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  const { weeks, monthLabels, maxCount } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);
    const dow = startDate.getDay();
    const daysToMonday = dow === 0 ? 6 : dow - 1;
    startDate.setDate(startDate.getDate() - daysToMonday);

    const dataMap = new Map<string, number>();
    let maxCount = 0;
    for (const item of data) {
      const dateStr = item.date.split('T')[0];
      dataMap.set(dateStr, item.count);
      if (item.count > maxCount) maxCount = item.count;
    }

    const weeks: DayData[][] = [];
    const monthLabels: { label: string; colIndex: number }[] = [];

    const cursor = new Date(startDate);
    let weekIndex = 0;

    while (cursor <= today) {
      const week: DayData[] = [];

      for (let d = 0; d < 7; d++) {
        const dateStr = toLocalDateString(cursor);
        const inRange = cursor <= today;
        week.push({
          dateString: dateStr,
          count: dataMap.get(dateStr) ?? 0,
          inRange,
        });

        if (cursor.getDate() === 1 && d === 0) {
          monthLabels.push({ label: MONTHS[cursor.getMonth()], colIndex: weekIndex });
        } else if (cursor.getDate() === 1 && d > 0) {
          monthLabels.push({ label: MONTHS[cursor.getMonth()], colIndex: weekIndex + 1 });
        }

        cursor.setDate(cursor.getDate() + 1);
      }

      weeks.push(week);
      weekIndex++;
    }

    return { weeks, monthLabels, maxCount };
  }, [data]);

  const getColor = (day: DayData): string => {
    if (!day.inRange) return '';
    if (day.count === 0) return 'bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600';
    const intensity = maxCount > 0 ? day.count / maxCount : 0;
    if (intensity <= 0.25) return 'bg-emerald-200 dark:bg-emerald-900 border border-emerald-300 dark:border-emerald-800';
    if (intensity <= 0.5)  return 'bg-emerald-400 dark:bg-emerald-700 border border-emerald-500 dark:border-emerald-600';
    if (intensity <= 0.75) return 'bg-emerald-500 dark:bg-emerald-600 border border-emerald-600 dark:border-emerald-500';
    return 'bg-emerald-600 dark:bg-emerald-500 border border-emerald-700 dark:border-emerald-400';
  };

  const formatDate = (dateStr: string): string => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const handleMouseEnter = (day: DayData, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top,
      date: formatDate(day.dateString),
      count: day.count,
    });
  };

  const DAY_LABEL_WIDTH = 36;
  const isMobile = containerWidth > 0 && containerWidth < 640;
  const labelOffset = isMobile ? 0 : DAY_LABEL_WIDTH;
  const GAP = 2;
  const numWeeks = weeks.length;
  const availableWidth = containerWidth - labelOffset;
  const CELL = numWeeks > 0 && availableWidth > 0
    ? Math.floor((availableWidth - (numWeeks - 1) * GAP) / numWeeks)
    : 12;
  const STEP = CELL + GAP;

  return (
    <div className="w-full" ref={containerRef}>
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-2 text-sm rounded-lg shadow-lg pointer-events-none bg-gray-900 border border-gray-700"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, calc(-100% - 8px))',
          }}
        >
          <div className="font-semibold text-white">
            {t('interactions', { count: tooltip.count })}
          </div>
          <div className="text-xs text-gray-400">{tooltip.date}</div>
          <div
            className="absolute w-2 h-2 rotate-45 bg-gray-900 border-r border-b border-gray-700"
            style={{ bottom: -5, left: '50%', marginLeft: -4 }}
          />
        </div>
      )}

      <div className="flex flex-col w-full">
          <div className="flex mb-1 sm:pl-[36px]">
            <div style={{ position: 'relative', height: 16, width: '100%' }}>
              {monthLabels.map((m, i) => (
                <span
                  key={i}
                  className="absolute text-xs text-gray-400 font-medium"
                  style={{ left: m.colIndex * STEP, top: 0 }}
                >
                  {m.label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex">
            <div className="hidden sm:flex flex-col mr-1" style={{ width: DAY_LABEL_WIDTH - 4, gap: GAP }}>
              {DAYS.map((day, i) => (
                <div
                  key={day}
                  className="text-xs text-gray-400 font-medium flex items-center justify-end pr-1"
                  style={{ height: CELL, lineHeight: `${CELL}px` }}
                >
                  {(i === 0 || i === 2 || i === 4) ? day : ''}
                </div>
              ))}
            </div>

            <div className="flex" style={{ gap: GAP }}>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
                  {week.map((day, di) => (
                    <div
                      key={di}
                      className={`rounded-sm transition-all duration-150 ${
                        day.inRange
                          ? `${getColor(day)} cursor-pointer hover:scale-125 hover:ring-1 hover:ring-emerald-400`
                          : 'opacity-0'
                      }`}
                      style={{ width: CELL, height: CELL }}
                      onMouseEnter={day.inRange ? (e) => handleMouseEnter(day, e) : undefined}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-1.5 mt-3 text-xs text-gray-400 font-medium">
            <span>{t('legend.less')}</span>
            <div className="rounded-sm bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" style={{ width: CELL, height: CELL }} />
            <div className="rounded-sm bg-emerald-200 dark:bg-emerald-900 border border-emerald-300 dark:border-emerald-800" style={{ width: CELL, height: CELL }} />
            <div className="rounded-sm bg-emerald-400 dark:bg-emerald-700 border border-emerald-500 dark:border-emerald-600" style={{ width: CELL, height: CELL }} />
            <div className="rounded-sm bg-emerald-500 dark:bg-emerald-600 border border-emerald-600 dark:border-emerald-500" style={{ width: CELL, height: CELL }} />
            <div className="rounded-sm bg-emerald-600 dark:bg-emerald-500 border border-emerald-700 dark:border-emerald-400" style={{ width: CELL, height: CELL }} />
            <span>{t('legend.more')}</span>
          </div>
        </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';

const LEVELS = [
    'bg-white',
    'bg-gray-300',
    'bg-gray-500',
    'bg-gray-700',
    'bg-black',
];

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = [
    { index: 1, label: 'Mon' },
    { index: 3, label: 'Wed' },
    { index: 5, label: 'Fri' },
];

function getLevel(count, max) {
    if (count === 0) return 0;
    if (max === 0) return 0;
    const ratio = count / max;
    if (ratio <= 0.25) return 1;
    if (ratio <= 0.5) return 2;
    if (ratio <= 0.75) return 3;
    return 4;
}

const ContributionGraph = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchContributions = async () => {
            try {
                const response = await fetch('https://utils.leiro.dev/contributions/abrahampo1');
                if (!response.ok) throw new Error('Failed to fetch');
                const json = await response.json();
                setData(json);
            } catch {
                // graceful degradation — don't render anything
            }
        };
        fetchContributions();
    }, []);

    if (!data) return null;

    const { weeks } = data;

    const maxCount = Math.max(
        ...weeks.flatMap(w => w.contributionDays.map(d => d.contributionCount))
    );

    // Build month labels positioned at the first week where a new month starts
    const monthPositions = [];
    let lastMonth = null;
    weeks.forEach((week, weekIndex) => {
        const firstDay = week.contributionDays[0];
        if (!firstDay) return;
        const month = new Date(firstDay.date).getMonth();
        if (month !== lastMonth) {
            monthPositions.push({ weekIndex, month });
            lastMonth = month;
        }
    });

    return (
        <div className="mt-4">
            <div className="border-black border-1 border-r-3 border-b-3 p-3 bg-white overflow-x-auto">
                <div className="inline-flex flex-col gap-1 min-w-fit">
                    {/* Month labels */}
                    <div className="flex" style={{ marginLeft: '28px' }}>
                        {monthPositions.map(({ weekIndex, month }, i) => {
                            const nextPos = monthPositions[i + 1]?.weekIndex ?? weeks.length;
                            const span = nextPos - weekIndex;
                            return (
                                <div
                                    key={`${month}-${weekIndex}`}
                                    className="text-xs tinos-regular"
                                    style={{ width: `${span * 14}px` }}
                                >
                                    {MONTH_LABELS[month]}
                                </div>
                            );
                        })}
                    </div>

                    {/* Grid */}
                    <div className="flex gap-0">
                        {/* Day labels column */}
                        <div className="flex flex-col gap-[2px] mr-1" style={{ width: '24px' }}>
                            {Array.from({ length: 7 }, (_, dayIndex) => {
                                const dayLabel = DAY_LABELS.find(d => d.index === dayIndex);
                                return (
                                    <div
                                        key={dayIndex}
                                        className="text-xs tinos-regular flex items-center justify-end"
                                        style={{ height: '12px' }}
                                    >
                                        {dayLabel ? dayLabel.label : ''}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Weeks columns */}
                        {weeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="flex flex-col gap-[2px]">
                                {Array.from({ length: 7 }, (_, dayIndex) => {
                                    const day = week.contributionDays.find(
                                        d => new Date(d.date).getDay() === dayIndex
                                    );
                                    if (!day) {
                                        return <div key={dayIndex} style={{ width: '12px', height: '12px' }} />;
                                    }
                                    const level = getLevel(day.contributionCount, maxCount);
                                    return (
                                        <div
                                            key={dayIndex}
                                            className={`${LEVELS[level]} border border-gray-300`}
                                            style={{ width: '12px', height: '12px' }}
                                            title={`${day.date}: ${day.contributionCount} contribution${day.contributionCount !== 1 ? 's' : ''}`}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-1 mt-1 justify-end">
                        <span className="text-xs tinos-regular">Less</span>
                        {LEVELS.map((bg, i) => (
                            <div
                                key={i}
                                className={`${bg} border border-gray-300`}
                                style={{ width: '12px', height: '12px' }}
                            />
                        ))}
                        <span className="text-xs tinos-regular">More</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContributionGraph;

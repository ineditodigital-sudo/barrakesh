import React from 'react';

const PerformanceChart = ({ data, isDarkMode }) => {
    const maxVal = Math.max(...data.map(d => d.value), 10);
    const height = 120;
    const width = 300;
    const padding = 20;

    return (
        <div className="w-full">
            <div className="flex justify-between items-end h-[120px] gap-2 px-2">
                {data.map((d, i) => {
                    const barHeight = (d.value / maxVal) * 100;
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="relative w-full flex flex-col justify-end h-full">
                                {/* Tooltip */}
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap font-black uppercase">
                                    {d.value} Citas
                                </div>
                                <div
                                    className={`w-full bg-primary rounded-t-sm transition-all duration-700 ease-out border-x border-t ${isDarkMode ? 'border-primary/20 shadow-[0_0_15px_rgba(254,225,1,0.1)]' : 'border-black/5'}`}
                                    style={{ height: `${barHeight}%` }}
                                ></div>
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-tighter ${isDarkMode ? 'text-white/20' : 'text-black/30'}`}>
                                {d.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PerformanceChart;

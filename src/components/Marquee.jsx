import React from 'react';

const Marquee = ({ text, reverse = false, bg = "bg-primary", textColor = "text-black" }) => {
    return (
        <div className={`marquee-container ${bg} ${textColor}`}>
            <div className={`marquee-content ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
                {[...Array(10)].map((_, i) => (
                    <span key={i} className="mx-4 font-display text-lg uppercase">
                        {text} ///
                    </span>
                ))}
            </div>
        </div>
    );
};

export default Marquee;

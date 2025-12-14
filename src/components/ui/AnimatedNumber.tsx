'use client';
import CountUp from 'react-countup';
import { useEffect, useState } from 'react';

interface AnimatedNumberProps {
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    duration?: number;
    className?: string;
}

export function AnimatedNumber({
    value,
    prefix = '',
    suffix = '',
    decimals = 0,
    duration = 1.5,
    className = ''
}: AnimatedNumberProps) {
    const [prevValue, setPrevValue] = useState(value);
    const [key, setKey] = useState(0);

    useEffect(() => {
        if (value !== prevValue) {
            setKey(k => k + 1);
            setPrevValue(value);
        }
    }, [value, prevValue]);

    return (
        <span className={className}>
            <CountUp
                key={key}
                start={prevValue}
                end={value}
                duration={duration}
                decimals={decimals}
                prefix={prefix}
                suffix={suffix}
                useEasing={true}
                separator=","
            />
        </span>
    );
}

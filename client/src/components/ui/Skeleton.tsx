import React from 'react'

interface SkeletonProps {
    className?: string;
}


const Skeleton = ({className = ""}:SkeletonProps) => {
    return (
        <div
            className={`animate-pulse bg-secondary-200 dark:bg-secondary-800 rounded ${className}`}
        />
    )
}

export default Skeleton
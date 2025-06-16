import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
  height?: string;
  width?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  className = '',
  count = 1,
  height = 'h-4',
  width = 'w-full'
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={`${height} ${width} bg-gray-700 rounded animate-pulse`}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            delay: index * 0.1 
          }}
        />
      ))}
    </div>
  );
};

// Skeleton específico para cards
export const CardSkeleton: React.FC = () => (
  <div className="bg-gray-800 p-6 rounded-3xl shadow-lg animate-pulse">
    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4" />
    <div className="h-12 bg-gray-700 rounded w-1/2 mb-6" />
    <div className="space-y-2">
      <div className="h-4 bg-gray-700 rounded w-full" />
      <div className="h-4 bg-gray-700 rounded w-5/6" />
      <div className="h-4 bg-gray-700 rounded w-4/6" />
    </div>
  </div>
);

// Skeleton para tabelas
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="w-full">
    <div className="h-10 bg-gray-700 rounded mb-4" />
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="flex space-x-4 mb-3">
        <div className="h-8 bg-gray-700 rounded flex-1" />
        <div className="h-8 bg-gray-700 rounded w-20" />
      </div>
    ))}
  </div>
);

export default SkeletonLoader;
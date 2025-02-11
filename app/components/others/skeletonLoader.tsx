interface Props {
  className: string;
}

const SkeletonLoader = (props: Props) => {
  return (
    <div
      className={`skeleton-card bg-gray-300 rounded-md animate-pulse ${props.className}`}
    ></div>
  );
};

export default SkeletonLoader;

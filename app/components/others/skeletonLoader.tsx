interface Props {
  class: string;
}

const SkeletonLoader = (props: Props) => {
  return (
    <div
      className={`skeleton-card bg-gray-300 rounded-md animate-pulse ${props.class}`}
    ></div>
  );
};

export default SkeletonLoader;

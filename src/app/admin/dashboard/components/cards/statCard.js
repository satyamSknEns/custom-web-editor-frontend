const StatCard = ({ label, value, color, textColor }) => {
  return (
    <div
      className={`rounded-xl shadow-lg relative overflow-hidden ${color} text-white`}
    >
      <div className="flex flex-col w-full py-3 pb-10 h-20 md:h-24 lg:h-32 max-h-28 rounded-lg relative">
        <div className="flex items-center justify-end">
          <div
            className={`bg-white font-medium py-2 px-4 rounded-md rounded-r-none uppercase text-xl ${textColor}`}
          >
            {label}
          </div>
        </div>
        <div className="text-4xl font-bold text-white pl-3 pb-3 ">{value}</div>
      </div>
    </div>
  );
};

export default StatCard;

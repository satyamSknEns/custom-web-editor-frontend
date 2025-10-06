
const NewsletterPopUp = ({ headingText, subheadingText, buttonLabel,backgroundColor, textColor,buttonColor }) => {
  return (
    <div
      style={{ backgroundColor: backgroundColor, color: textColor }}
      className={`flex flex-col items-center justify-center sm:p-8 p-4 w-full`}
    >
        <h2
          className="text-base text-center font-bold mb-2 uppercase"
          style={{ color: textColor }}
        >
          {headingText}
        </h2>
        <p className="text-xs mb-6 text-center max-w-lg" style={{ color: textColor }}>
          {subheadingText}
        </p>

      <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 w-full md:max-w-lg sm:max-w-md items-center overflow-hidden">
        <input
          type="email"
          placeholder="Enter your email address"
          className="w-full sm:w-auto flex-grow py-1 px-1.5 rounded-md sm:rounded-l-md sm:rounded-r-none outline-none border sm:border-r-0 text-gray-800"
        />
        <button
          type="submit"
          className="w-full sm:w-auto text-white py-1 px-3 rounded-md sm:rounded-r-md sm:rounded-l-none border sm:border-l-0"
          style={{ backgroundColor: buttonColor }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default NewsletterPopUp;

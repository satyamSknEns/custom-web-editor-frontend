import React from "react";

export const LineLoader = () => {
  return (
    <div className="absolute top-1/2 left-1/2 transform translate-x-[-50%] translate-y-[-50%]">
      <svg
        version="1.1"
        id="L9"
        width="200px"
        height="200px"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        enableBackground="new 0 0 0 0"
        xmlSpace="preserve"
      >
        <path
          fill="#000"
          d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            dur="1s"
            from="0 50 50"
            to="360 50 50"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  );
};

export const BlinkLoader = () => {
  return (
    <div className="absolute top-1/2 left-1/2 transform translate-x-[-50%] translate-y-[-50%] ">
      <svg
        version="1.1"
        id="L9"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        className=" w-14 h-14 m-4 inline-block"
      >
        <path
          fill="#123525"
          d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            dur="1s"
            from="0 50 50"
            to="360 50 50"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  );
};

export const DynamicLoader = ({maintext,subtext}) => {
  return (
    <div>
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white/100 w-60 flex justify-center flex-col items-center h-60 p-6 rounded shadow-lg text-center">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-900"></div>
        <p className="mt-4 font-bold text-gray-800">{maintext}</p>
        <p className="mt-4 text-sm text-gray-800">{subtext}</p>
      </div>
    </div>
  </div>
  )
}


const staggerCircle = ({ color, height, width }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 280 200"
      height={height ? height : ""}
      width={width ? width : 50}
    >
      <circle
        fill={color ? color : "#000"}
        stroke={color ? color : "#000"}
        stroke-width="15"
        r="15"
        cx="40"
        cy="100"
      >
        <animate
          attributeName="opacity"
          calcMode="spline"
          dur="2"
          values="1;0;1;"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="-.4"
        ></animate>
      </circle>
      <circle
        fill={color ? color : "#000"}
        stroke={color ? color : "#000"}
        stroke-width="15"
        r="15"
        cx="100"
        cy="100"
      >
        <animate
          attributeName="opacity"
          calcMode="spline"
          dur="2"
          values="1;0;1;"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="-.2"
        ></animate>
      </circle>
      <circle
        fill={color ? color : "#000"}
        stroke={color ? color : "#000"}
        stroke-width="15"
        r="15"
        cx="160"
        cy="100"
      >
        <animate
          attributeName="opacity"
          calcMode="spline"
          dur="2"
          values="1;0;1;"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="0"
        ></animate>
      </circle>
    </svg>
  );
};

const loader = { LineLoader, BlinkLoader, DynamicLoader, staggerCircle };

export default loader;
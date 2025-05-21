"use client";

interface ToggleSwitchProps {
  isOn: boolean;
  handleToggle: () => void;
  labelOn?: string;
  labelOff?: string;
  size?: "sm" | "md";
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isOn,
  handleToggle,
  labelOn = "Måned",
  labelOff = "År",
  size = "md",
}) => {
  const switchWidth = size === "sm" ? "w-9" : "w-11";
  const switchHeight = size === "sm" ? "h-5" : "h-6";
  const knobSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const knobTranslate =
    size === "sm"
      ? isOn
        ? "translate-x-4"
        : "translate-x-0.5"
      : isOn
      ? "translate-x-5"
      : "translate-x-1";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className="flex items-center space-x-2">
      <span
        className={`${textSize} font-medium ${
          !isOn ? "text-indigo-400" : "text-gray-400 dark:text-gray-500"
        }`}
      >
        {labelOff}
      </span>
      <button
        type="button"
        onClick={handleToggle}
        className={`relative inline-flex items-center rounded-full ${switchWidth} ${switchHeight} transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800
                    ${isOn ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"}`}
        aria-pressed={isOn}
      >
        <span className="sr-only">Skift visning</span>
        <span
          className={`inline-block ${knobSize} transform bg-white rounded-full transition-transform
                      ${knobTranslate}`}
        />
      </button>
      <span
        className={`${textSize} font-medium ${
          isOn ? "text-indigo-400" : "text-gray-400 dark:text-gray-500"
        }`}
      >
        {labelOn}
      </span>
    </div>
  );
};

export default ToggleSwitch;

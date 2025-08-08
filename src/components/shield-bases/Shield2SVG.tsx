import { ShieldProps } from "@/types/props";

const Shield2SVG: React.FC<ShieldProps> = ({
    className,
    children,
    patternId,
    strokeColor = "#000000",
    strokeWidth = 1,
}) => {
    return (
        <svg
            id="etEUwW5BF6e1"
            viewBox="0 0 145 145"
            className={className}

        >
            <defs>{children}</defs>
            <path
                d="M29.393817,26.221497C13.670259,89.081048,48.576539,112.270366,73.23003,123.594286C111.860346,108.40726,129.361871,72.5,118.264093,26.221497c-13.10615,7.963753-35.290814,5.341696-45.034063-2.917537-10.608519,7.695601-32.252851,10.718789-43.836213,2.917537Z"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                fill={patternId ? `url(#${patternId})` : "#CCCCCC"}
                />
        </svg>
    );
};

export default Shield2SVG;

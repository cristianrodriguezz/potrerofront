interface ShieldProps {
    className?: string;
    children?: React.ReactNode;
    patternId?: string;
    strokeColor?: string;
    strokeWidth?: number;
}

const Shield4SVG: React.FC<ShieldProps> = ({
    className,
    children,
    patternId,
    strokeColor = "#000",
    strokeWidth = 0.5,
}) => {
    return (
        <svg id="evPGsof0BlR1" viewBox="0 0 145 145" className={className}>
            <defs>{children}</defs>
            <path
                fill={patternId ? `url(#${patternId})` : "#CCCCCC"}
                d="M19.444453,27.586398c0-.083192,51.578569-13.476981,51.828142-13.476981q.249573,0,52.692465,13.476981c-6.685579,45.10088,1.434202,71.138019-52.692465,103.678741C29.603425,102.804417,23.66742,89.130006,19.444453,27.586398Z"
                transform="translate(0-.34254)"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
            />
        </svg>
    );
};
export default Shield4SVG;
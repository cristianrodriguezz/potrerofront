interface ShieldProps {
    className?: string;
    children?: React.ReactNode;
    patternId?: string;
    strokeColor?: string;
    strokeWidth?: number;
}

const Shield5SVG: React.FC<ShieldProps> = ({
    className,
    children,
    patternId,
    strokeColor = "#000",
    strokeWidth = 0.5,
}) => {
    return (
        <svg
            id="ewd4IqoPnzh1"
            viewBox="0 0 101 100"
        >
            <path
                d="M19.514125,9.320518c-.804014,2.434827-2.534493,6.36644-7.089343,11.770491c5.691219,8.198146,7.065723,23.708946,1.840078,31.564429C20.466191,73.675383,39.050877,89.215758,50.5,93.146506c11.866309-4.612354,30.534169-20.402324,35.731366-40.491068-4.209708-7.402019-4.209527-22.64586,1.660203-31.564429-2.365709-2.164325-5.724664-8.426256-6.345605-11.873506C74.557132,13.603376,59.139198,14.144096,50.5,9.966059c-10.504984,3.090332-17.454315,4.75405-30.985875-.645541Z"
                stroke="#000"
                stroke-width="0.5"
            />
        </svg>
    );
};
export default Shield5SVG;

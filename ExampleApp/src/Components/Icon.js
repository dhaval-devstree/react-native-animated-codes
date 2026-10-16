// Global Imports
import Svg, { Path } from 'react-native-svg';

// Local Imports
import Colors from '../Helper/Colors';

// Stroke icons drawn on a 24×24 grid (Lucide style)
const PATHS = {
  'chevron-left': ['M15 18l-6-6 6-6'],
  'chevron-right': ['M9 18l6-6-6-6'],
  'chevron-down': ['M6 9l6 6 6-6'],
  'rotate-ccw': ['M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8', 'M3 3v5h5'],
};

// Filled icons
const FILLED_PATHS = {
  play: 'M7 4.8v14.4a1 1 0 0 0 1.52.85l11.5-7.2a1 1 0 0 0 0-1.7L8.52 3.95A1 1 0 0 0 7 4.8z',
};

const Icon = ({ name, size = 20, color = Colors.INK, strokeWidth = 2 }) => {
  return (
    <Svg width={size} height={size} viewBox='0 0 24 24'>
      {FILLED_PATHS[name] ? (
        <Path d={FILLED_PATHS[name]} fill={color} />
      ) : (
        (PATHS[name] ?? []).map((d) => (
          <Path key={d} d={d} fill='none' stroke={color} strokeWidth={strokeWidth}
            strokeLinecap='round' strokeLinejoin='round' />
        ))
      )}
    </Svg>
  );
};

export default Icon;

import Svg, { Path, Circle } from 'react-native-svg'

export function EditIcon({ color = '#d1d5db', size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </Svg>
  )
}

export function TrashIcon({ color = '#d1d5db', size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </Svg>
  )
}

export function CloseIcon({ color = '#9ca3af', size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </Svg>
  )
}

export function GripIcon({ color = '#d1d5db', size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Circle cx={9} cy={6} r={1.6} />
      <Circle cx={15} cy={6} r={1.6} />
      <Circle cx={9} cy={12} r={1.6} />
      <Circle cx={15} cy={12} r={1.6} />
      <Circle cx={9} cy={18} r={1.6} />
      <Circle cx={15} cy={18} r={1.6} />
    </Svg>
  )
}

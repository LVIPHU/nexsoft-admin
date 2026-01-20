

export const IconsMap = {
  BarChart: {
    Icon: Commitlint,
  },
} as const

export function Brand(props: {
  name: keyof typeof IconsMap
  className?: string
}) {
  const { name, className } = props
  const {
    Icon,
  }: {
    Icon: React.FC<React.SVGProps<SVGSVGElement>>
  } = IconsMap[name] || {}

  if (!Icon)
    return <span className="hidden">Missing brand icon for {name}</span>

  return <Icon className={className} fill="currentColor" />
}

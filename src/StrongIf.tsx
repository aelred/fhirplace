import { ReactNode } from "react"

type Props = {
    children: ReactNode
    condition: boolean
    strong?: boolean
    opacity?: boolean
}

export default function StrongIf({ children, condition, strong = true, opacity = true }: Props): ReactNode {
    return <span style={{ opacity: !opacity || condition ? 1.0 : 0.5, fontWeight: strong && condition ? "bold" : "unset" }}>{children}</span>
}
type Props = {
    base: string | undefined;
    diff: string | undefined;
    onChange: (value: string | undefined) => void;
};

export default function StringEditor({ base, diff, onChange }: Props) {
    return <textarea value={diff} placeholder={base} onChange={e => onChange(e.target.value || undefined)} className="subtle" />;
}
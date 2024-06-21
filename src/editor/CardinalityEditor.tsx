type Props = {
    base: { min: number, max: string };
    diff: { min?: number, max?: string };
    onChange: (value: { min: number, max: string }) => any;
};

export default function CardinalityEditor({ base, diff, onChange }: Props) {
    var options = [
        { min: 0, max: "0" }, { min: 0, max: "1" }, { min: 0, max: "*" }, { min: 1, max: "1" }, { min: 1, max: "*" }
    ];
    options = options.filter(opt => opt.min >= base.min && (base.max === "*" || (opt.max !== "*" && opt.max <= base.max) || (opt.max === "*" && base.max === "0")));

    return (<select value={`${diff.min || base.min}..${diff.max || base.max}`} onChange={e => onChange({ min: Number(e.target.value[0]), max: e.target.value[3] })}>
        {options.map(({ min, max }) => (<option>{`${min}..${max}`}</option>))}
    </select >);
}
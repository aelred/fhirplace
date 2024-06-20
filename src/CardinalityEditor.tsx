type CardinalityProps = {
    baseMin: number;
    baseMax: string;
    diffMin?: number;
    diffMax?: string;
    onChange: (min: number, max: string) => any;
};

export function CardinalityEditor({ baseMin, baseMax, diffMin, diffMax, onChange }: CardinalityProps) {
    var options = [
        { min: 0, max: "0" }, { min: 0, max: "1" }, { min: 0, max: "*" }, { min: 1, max: "1" }, { min: 1, max: "*" }
    ];
    options = options.filter(opt => opt.min >= baseMin && (baseMax === "*" || (opt.max !== "*" && opt.max <= baseMax) || (opt.max === "*" && baseMax === "0")));

    return (<select value={`${diffMin || baseMin}..${diffMax || baseMax}`} onChange={e => onChange(Number(e.target.value[0]), e.target.value[3])}>
        {options.map(({ min, max }) => (<option>{`${min}..${max}`}</option>))}
    </select>);
}

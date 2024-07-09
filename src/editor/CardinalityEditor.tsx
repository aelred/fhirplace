import StrongIf from "StrongIf";
import { default as Select } from "react-select";

type Card = {
    min: number
    max: string
}

type Props = {
    base: Card
    diff?: Partial<Card>
    onChange: (value: Card) => any;
};

export default function CardinalityEditor({ base, diff, onChange }: Props) {
    var cards = [
        { min: 0, max: "0" }, { min: 0, max: "1" }, { min: 0, max: "*" }, { min: 1, max: "1" }, { min: 1, max: "*" }
    ];
    cards = cards.filter(opt => opt.min >= base.min && (base.max === "*" || (opt.max !== "*" && opt.max <= base.max) || (opt.max === "*" && base.max === "0")));

    const selected = { ...base, ...diff }

    const options = cards.map(card => toOption(card, base))

    const selectedOption = options.find(option => option.value.min == selected.min && option.value.max == selected.max)

    return <Select
        unstyled openMenuOnFocus className="select" classNamePrefix="select"
        value={selectedOption}
        options={options}
        onChange={e => onChange(e?.value || base)}
    />
}

function toOption(card: Card, base: Card) {
    const component = <>
        <StrongIf condition={card.min != base.min}>{card.min}</StrongIf>
        <span style={{ opacity: 0.5 }}>..</span>
        <StrongIf condition={card.max != base.max}>{card.max}</StrongIf>
    </>

    return {
        value: card,
        label: component,
    }
}
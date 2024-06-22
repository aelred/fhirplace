import Select from "react-select";

type Props = {
    base: string[];
    diff: string[] | undefined;
    onChange: (value: string[]) => void;
};

export default function TargetProfilesEditor({ base, diff, onChange }: Props) {
    if (base.length === 1) {
        return <span>({`${shortProfileName(base[0])}`})</span>;
    }

    const options = base.map(profile => {
        return {
            value: profile,
            label: shortProfileName(profile)
        };
    });

    const selected = options.filter(opt => (diff || base).includes(opt.value));

    return (
        <span>
            {"("}
            <Select
                isMulti
                defaultValue={selected}
                options={options}
                closeMenuOnSelect={false}
                isClearable={false}
                onChange={(newValue, _) => onChange(newValue.map(nv => nv.value))}
                className="select"
                classNamePrefix="select"
            />
            {")"}
        </span>
    );
}

function shortProfileName(profile: string): string {
    return profile.replace(/^http:\/\/hl7\.org\/fhir\/StructureDefinition\//, "");
}

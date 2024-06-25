import { getTypeCode } from "fhir";
import { ElementDefinitionType } from "fhir/r5";
import { ReactElement } from "react";
import TargetProfilesEditor from "./TargetProfilesEditor";

type Props = {
    base: ElementDefinitionType
    diff?: ElementDefinitionType
    onChange: (value: ElementDefinitionType) => void
}

export default function ({ base, diff, onChange }: Props): ReactElement | undefined {
    return (<span className="type">
        {getTypeCode(base)}
        {base.targetProfile &&
            <TargetProfilesEditor base={base.targetProfile} diff={diff?.targetProfile} onChange={targetProfile => onChange({ code: base.code, ...diff, targetProfile })} />}
    </span>)
}
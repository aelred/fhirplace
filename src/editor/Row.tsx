import tbl_blank from 'hl7fhir/tbl_blank.png';
import tbl_spacer from 'hl7fhir/tbl_spacer.png';
import tbl_vline from 'hl7fhir/tbl_vline.png';
import { ReactNode } from "react";
import VJoin from './VJoin';

type Props = {
    icon?: ReactNode
    name?: ReactNode
    flags?: ReactNode
    card?: ReactNode
    type?: ReactNode
    description?: ReactNode
    isOpen?: boolean
    setOpen?: (open: boolean) => void;
    indent: boolean[]
    nextIndent: boolean[]
}

export default function Row({ icon, name, flags, card, type, description, isOpen, setOpen, indent, nextIndent }: Props) {
    const backgroundImage = `url(${process.env.PUBLIC_URL}/hl7fhir/tbl_bck${nextIndent.map(b => +b).join("")}.png)`;

    return <tr style={{ border: "0px #F0F0F0 solid", padding: "0px", verticalAlign: "top" }}>
        <td style={{ whiteSpace: "nowrap", backgroundImage }} className="hierarchy">
            <img src={tbl_spacer} alt="." style={{ backgroundColor: "inherit" }} className="hierarchy" />
            {indent.slice(0, -1).map((drawLine, idx) => {
                const image = drawLine ? tbl_vline : tbl_blank;
                return (<img key={idx} src={image} alt="." style={{ backgroundColor: "inherit" }} className="hierarchy" />)
            })}
            {indent.length > 0 && (<VJoin isOpen={isOpen} isLastChild={!nextIndent[indent.length - 1]} setOpen={v => setOpen && setOpen(v)} />)}
            {icon}
            {" "}
            {name}
        </td>
        <td className="hierarchy">{flags}</td>
        <td className="hierarchy">{card}</td>
        <td className="hierarchy">{type}</td>
        <td className="hierarchy">{description}</td>
    </tr>
}
import tbl_vjoin_closed from 'hl7fhir/tbl_vjoin-closed.png';
import tbl_vjoin_open from 'hl7fhir/tbl_vjoin-open.png';
import tbl_vjoin from 'hl7fhir/tbl_vjoin.png';
import tbl_vjoin_end_closed from 'hl7fhir/tbl_vjoin_end-closed.png';
import tbl_vjoin_end_open from 'hl7fhir/tbl_vjoin_end-open.png';
import tbl_vjoin_end from 'hl7fhir/tbl_vjoin_end.png';

type Props = {
    isOpen?: boolean
    isLastChild: boolean
    setOpen: (value: boolean) => void
}

export default function VJoin({ isOpen, isLastChild, setOpen }: Props) {
    const joinImage = isOpen === undefined ? (
        isLastChild ? tbl_vjoin_end : tbl_vjoin
    ) : (
        isLastChild ? (isOpen ? tbl_vjoin_end_open : tbl_vjoin_end_closed) : (isOpen ? tbl_vjoin_open : tbl_vjoin_closed)
    );

    return <img src={joinImage} alt="." style={{ backgroundColor: "inherit" }} className="hierarchy" onClick={(_) => {
        if (isOpen !== undefined) setOpen(!isOpen)
    }} />;
}
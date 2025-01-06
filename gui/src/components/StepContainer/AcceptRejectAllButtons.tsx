import { useContext } from "react";
import { IdeMessengerContext } from "../../context/IdeMessenger";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ApplyState } from "core";
import { getMetaKeyLabel } from "../../util";
import { useAppSelector } from "../../redux/hooks";
import { selectIsSingleRangeEditOrInsertion } from "../../redux/slices/sessionSlice";

export interface AcceptRejectAllButtonsProps {
  pendingApplyStates: ApplyState[];
  onAcceptOrReject?: (outcome: AcceptOrRejectOutcome) => void;
}

export type AcceptOrRejectOutcome = "acceptDiff" | "rejectDiff";

export default function AcceptRejectAllButtons({
  pendingApplyStates,
  onAcceptOrReject,
}: AcceptRejectAllButtonsProps) {
  const ideMessenger = useContext(IdeMessengerContext);
  const isSingleRangeEdit = useAppSelector(selectIsSingleRangeEditOrInsertion);

  async function handleAcceptOrReject(status: AcceptOrRejectOutcome) {
    for (const { filepath = "", streamId } of pendingApplyStates) {
      ideMessenger.post(status, {
        filepath,
        streamId,
      });
    }

    if (onAcceptOrReject) {
      onAcceptOrReject(status);
    }
  }

  return (
    <div className="border-border/25 flex justify-center gap-2 border-b p-1 px-3">
      <button
        className="text-description flex cursor-pointer items-center border-none bg-transparent px-2 py-1 text-xs opacity-80 hover:opacity-100 hover:brightness-125"
        onClick={() => handleAcceptOrReject("rejectDiff")}
      >
        <XMarkIcon className="text-error mr-1 h-4 w-4" />
        {isSingleRangeEdit ? (
          <span>Reject ({getMetaKeyLabel()}⇧⌫)</span>
        ) : (
          <>
            <span className="sm:hidden">Reject</span>
            <span className="max-sm:hidden md:hidden">Reject all</span>
            <span className="max-md:hidden">Reject all changes</span>
          </>
        )}
      </button>
      <button
        className="text-description flex cursor-pointer items-center border-none bg-transparent px-2 py-1 text-xs opacity-80 hover:opacity-100 hover:brightness-125"
        onClick={() => handleAcceptOrReject("acceptDiff")}
      >
        <CheckIcon className="text-success mr-1 h-4 w-4" />
        {isSingleRangeEdit ? (
          <span>Accept ({getMetaKeyLabel()}⇧⏎)</span>
        ) : (
          <>
            <span className="sm:hidden">Accept</span>
            <span className="max-sm:hidden md:hidden">Accept all</span>
            <span className="max-md:hidden">Accept all changes</span>
          </>
        )}
      </button>
    </div>
  );
}

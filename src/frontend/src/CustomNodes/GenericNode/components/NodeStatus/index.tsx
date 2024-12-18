import { getSpecificClassFromBuildStatus } from "@/CustomNodes/helpers/get-class-from-build-status";
import useIconStatus from "@/CustomNodes/hooks/use-icons-status";
import useUpdateValidationStatus from "@/CustomNodes/hooks/use-update-validation-status";
import useValidationStatusString from "@/CustomNodes/hooks/use-validation-status-string";
import ShadTooltip from "@/components/shadTooltipComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ICON_STROKE_WIDTH,
  RUN_TIMESTAMP_PREFIX,
  STATUS_BUILD,
  STATUS_BUILDING,
  STATUS_INACTIVE,
} from "@/constants/constants";
import { BuildStatus } from "@/constants/enums";
import { track } from "@/customization/utils/analytics";
import { useDarkStore } from "@/stores/darkStore";
import useFlowStore from "@/stores/flowStore";
import { useShortcutsStore } from "@/stores/shortcuts";
import { VertexBuildTypeAPI } from "@/types/api";
import { NodeDataType } from "@/types/flow";
import { findLastNode } from "@/utils/reactflowUtils";
import { classNames, cn } from "@/utils/utils";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import IconComponent from "../../../../components/genericIconComponent";
import { normalizeTimeString } from "./utils/format-run-time";

export default function NodeStatus({
  nodeId,
  display_name,
  selected,
  setBorderColor,
  frozen,
  showNode,
  data,
  buildStatus,
  isOutdated,
  isUserEdited,
  getValidationStatus,
}: {
  nodeId: string;
  display_name: string;
  selected: boolean;
  setBorderColor: (color: string) => void;
  frozen?: boolean;
  showNode: boolean;
  data: NodeDataType;
  buildStatus: BuildStatus;
  isOutdated: boolean;
  isUserEdited: boolean;
  getValidationStatus: (data) => VertexBuildTypeAPI | null;
}) {
  const nodeId_ = data.node?.flow?.data
    ? (findLastNode(data.node?.flow.data!)?.id ?? nodeId)
    : nodeId;
  const [validationString, setValidationString] = useState<string>("");
  const [validationStatus, setValidationStatus] =
    useState<VertexBuildTypeAPI | null>(null);

  const conditionSuccess =
    buildStatus === BuildStatus.BUILT ||
    (!(!buildStatus || buildStatus === BuildStatus.TO_BUILD) &&
      validationStatus &&
      validationStatus.valid);

  const lastRunTime = useFlowStore(
    (state) => state.flowBuildStatus[nodeId_]?.timestamp,
  );
  const iconStatus = useIconStatus(buildStatus);
  const buildFlow = useFlowStore((state) => state.buildFlow);
  const isBuilding = useFlowStore((state) => state.isBuilding);
  const setNode = useFlowStore((state) => state.setNode);
  const version = useDarkStore((state) => state.version);

  function handlePlayWShortcut() {
    if (buildStatus === BuildStatus.BUILDING || isBuilding || !selected) return;
    setValidationStatus(null);
    buildFlow({ stopNodeId: nodeId });
  }

  const play = useShortcutsStore((state) => state.play);
  const flowPool = useFlowStore((state) => state.flowPool);
  useHotkeys(play, handlePlayWShortcut, { preventDefault: true });
  useValidationStatusString(validationStatus, setValidationString);
  useUpdateValidationStatus(
    nodeId_,
    flowPool,
    setValidationStatus,
    getValidationStatus,
  );

  const getBaseBorderClass = (selected) => {
    let className =
      selected && !isBuilding
        ? " border ring-[0.75px] ring-muted-foreground border-muted-foreground hover:shadow-node"
        : "border ring-[0.5px] hover:shadow-node ring-border";
    let frozenClass = selected ? "border-ring-frozen" : "border-frozen";
    let updateClass =
      isOutdated && !isUserEdited ? "border-warning ring-2 ring-warning" : "";
    return cn(frozen ? frozenClass : className, updateClass);
  };
  const getNodeBorderClassName = (
    selected: boolean,
    showNode: boolean,
    buildStatus: BuildStatus | undefined,
    validationStatus: VertexBuildTypeAPI | null,
  ) => {
    const specificClassFromBuildStatus = getSpecificClassFromBuildStatus(
      buildStatus,
      validationStatus,
      isBuilding,
    );

    const baseBorderClass = getBaseBorderClass(selected);
    const names = classNames(baseBorderClass, specificClassFromBuildStatus);
    return names;
  };

  useEffect(() => {
    setBorderColor(
      getNodeBorderClassName(selected, showNode, buildStatus, validationStatus),
    );
  }, [
    selected,
    showNode,
    buildStatus,
    validationStatus,
    isOutdated,
    isUserEdited,
    frozen,
  ]);

  useEffect(() => {
    if (buildStatus === BuildStatus.BUILT && !isBuilding) {
      setNode(
        nodeId,
        (old) => {
          return {
            ...old,
            data: {
              ...old.data,
              node: {
                ...old.data.node,
                lf_version: version,
              },
            },
          };
        },
        false,
      );
    }
  }, [buildStatus, isBuilding]);

  const divRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const stopBuilding = useFlowStore((state) => state.stopBuilding);

  const handleClickRun = () => {
    if (BuildStatus.BUILDING === buildStatus && isHovered) {
      stopBuilding();
      return;
    }
    if (buildStatus === BuildStatus.BUILDING || isBuilding) return;
    setValidationStatus(null);
    buildFlow({ stopNodeId: nodeId });
    track("Flow Build - Clicked", { stopNodeId: nodeId });
  };

  const iconName =
    BuildStatus.BUILDING === buildStatus
      ? isHovered
        ? "X"
        : "Loader2"
      : "Play";

  // Keep the existing icon classes
  const iconClasses = cn(
    "play-button-icon",
    isHovered ? "text-foreground" : "text-placeholder-foreground",
    BuildStatus.BUILDING === buildStatus && !isHovered && "animate-spin",
  );

  const getTooltipContent = () => {
    if (BuildStatus.BUILDING === buildStatus && isHovered) {
      return "Stop build";
    }
    return "Run component";
  };

  return (
    <>
      <div className="flex flex-shrink-0 items-center">
        <div className="flex items-center gap-2 self-center">
          <ShadTooltip
            styleClasses={cn(
              "border rounded-xl",
              conditionSuccess
                ? "border-accent-emerald-foreground bg-success-background"
                : "border-destructive bg-error-background",
            )}
            content={
              buildStatus === BuildStatus.BUILDING ? (
                <span> {STATUS_BUILDING} </span>
              ) : buildStatus === BuildStatus.INACTIVE ? (
                <span> {STATUS_INACTIVE} </span>
              ) : !validationStatus ? (
                <span className="flex">{STATUS_BUILD}</span>
              ) : (
                <div className="max-h-100 px-1 py-2.5">
                  <div className="flex max-h-80 flex-col gap-2 overflow-auto">
                    {validationString && (
                      <div className="text-sm text-foreground">
                        {validationString}
                      </div>
                    )}
                    {lastRunTime && (
                      <div className="flex items-center text-sm text-secondary-foreground">
                        <div>{RUN_TIMESTAMP_PREFIX}</div>
                        <div className="ml-1 text-secondary-foreground">
                          {lastRunTime}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center text-secondary-foreground">
                      <div>Duration:</div>
                      <div className="ml-1">
                        {validationStatus?.data.duration}
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
            side="bottom"
          >
            <div className="cursor-help">
              {conditionSuccess && validationStatus?.data?.duration ? (
                <div className="font-jetbrains mr-1 flex gap-1 rounded-sm bg-accent-emerald px-1 text-[11px] font-bold text-accent-emerald-foreground">
                  <Check className="h-4 w-4 items-center self-center" />
                  <span>
                    {normalizeTimeString(validationStatus?.data?.duration)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center self-center">
                  {iconStatus}
                </div>
              )}
            </div>
          </ShadTooltip>

          {data.node?.beta && showNode && (
            <Badge
              size="sq"
              className="pointer-events-none mr-1 flex h-[22px] w-10 justify-center rounded-[8px] bg-accent-pink text-accent-pink-foreground"
            >
              <span className="text-[11px]">Beta</span>
            </Badge>
          )}
        </div>
        <ShadTooltip content={getTooltipContent()}>
          <div
            ref={divRef}
            className="button-run-bg hit-area-icon"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClickRun}
          >
            {showNode && (
              <Button unstyled className="group">
                <div data-testid={`button_run_` + display_name.toLowerCase()}>
                  <IconComponent
                    name={iconName}
                    className={iconClasses}
                    strokeWidth={ICON_STROKE_WIDTH}
                  />
                </div>
              </Button>
            )}
          </div>
        </ShadTooltip>
      </div>
    </>
  );
}
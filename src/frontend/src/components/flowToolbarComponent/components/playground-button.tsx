import ForwardedIconComponent from "@/components/genericIconComponent";
import ShadTooltip from "@/components/shadTooltipComponent";
import IOModal from "@/modals/IOModal/newModal";
import { useTranslation } from "react-i18next";

const PlaygroundButton = ({ hasIO, open, setOpen, canvasOpen }) => {
  const { t } = useTranslation();
  const PlayIcon = () => (
    <ForwardedIconComponent name="Play" className="h-4 w-4 transition-all" />
  );

  const ButtonLabel = () => <span className="hidden md:block">{t("pages.flow.toolbar.playground")}</span>;

  const ActiveButton = () => (
    <div
      data-testid="playground-btn-flow-io"
      className="playground-btn-flow-toolbar hover:bg-accent"
    >
      <PlayIcon />
      <ButtonLabel />
    </div>
  );

  const DisabledButton = () => (
    <div
      className="playground-btn-flow-toolbar cursor-not-allowed text-muted-foreground duration-150"
      data-testid="playground-btn-flow"
    >
      <PlayIcon />
      <ButtonLabel />
    </div>
  );

  return hasIO ? (
    <IOModal
      open={open}
      setOpen={setOpen}
      disable={!hasIO}
      canvasOpen={canvasOpen}
    >
      <ActiveButton />
    </IOModal>
  ) : (
    <ShadTooltip content="Add a Chat Input or Chat Output to use the playground">
      <div>
        <DisabledButton />
      </div>
    </ShadTooltip>
  );
};

export default PlaygroundButton;

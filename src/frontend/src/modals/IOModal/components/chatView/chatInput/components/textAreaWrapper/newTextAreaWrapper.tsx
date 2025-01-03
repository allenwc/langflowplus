import { useEffect } from "react";
import { Textarea } from "../../../../../../../components/ui/textarea";
import { classNames } from "../../../../../../../utils/utils";
import { useTranslation } from "react-i18next";

const TextAreaWrapper = ({
  checkSendingOk,
  send,
  lockChat,
  noInput,
  chatValue,
  setChatValue,
  CHAT_INPUT_PLACEHOLDER,
  CHAT_INPUT_PLACEHOLDER_SEND,
  inputRef,
  setInputFocus,
  files,
  isDragging,
}) => {
  const { t } = useTranslation();
  const getPlaceholderText = (
    isDragging: boolean,
    noInput: boolean,
  ): string => {
    if (isDragging) {
      return "Drop here";
    } else if (noInput) {
      return CHAT_INPUT_PLACEHOLDER;
    } else {
      return t("io_modal.send_a_message");
    }
  };

  const fileClass = files.length > 0 ? "!rounded-t-none border-t-0" : "";

  const additionalClassNames =
    "form-input block w-full border-0 custom-scroll focus:border-ring rounded-none shadow-none focus:ring-0 p-0 sm:text-sm !bg-transparent";

  useEffect(() => {
    if (!lockChat && !noInput) {
      inputRef.current?.focus();
    }
  }, [lockChat, noInput]);

  return (
    <Textarea
      data-testid="input-chat-playground"
      onFocus={(e) => {
        setInputFocus(true);
      }}
      onBlur={() => setInputFocus(false)}
      onKeyDown={(event) => {
        if (checkSendingOk(event)) {
          send();
        }
      }}
      rows={1}
      ref={inputRef}
      disabled={lockChat || noInput}
      style={{
        resize: "none",
        bottom: `${inputRef?.current?.scrollHeight}px`,
        maxHeight: "150px",
        overflow: `${inputRef.current && inputRef.current.scrollHeight > 150
            ? "auto"
            : "hidden"
          }`,
      }}
      value={chatValue}
      onChange={(event): void => {
        setChatValue(event.target.value);
      }}
      className={classNames(fileClass, additionalClassNames)}
      placeholder={getPlaceholderText(isDragging, noInput)}
    />
  );
};

export default TextAreaWrapper;

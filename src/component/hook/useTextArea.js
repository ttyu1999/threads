import { useRef, useCallback } from "react";

export const useTextArea = (setValue, maxLength) => {
  const isComposing = useRef(false);
  const inputRef = useRef(null);

  const countBytes = useCallback((text) => {
    return new TextEncoder().encode(text).length;
  }, []);

  const sliceBytes = useCallback((text, maxBytes) => {
    const unit8 = new TextEncoder().encode(text).slice(0, maxBytes);
    const section = new TextDecoder("utf-8").decode(unit8).replace(/\uFFFD/g, "");
    return section;
  }, []);

  const autoResize = useCallback((textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }, []);

  const handleChange = useCallback((e) => {
    const input = e.target.value;

    if (isComposing.current) {
      setValue(input);
      return;
    }
  
    if (countBytes(input) <= maxLength) {
      setValue(input);
    } else {
      setValue(sliceBytes(input, maxLength));
    }
  
    setTimeout(() => autoResize(e.target), 0);
  }, [countBytes, sliceBytes, autoResize, maxLength, setValue]);

  const handleCompositionStart = useCallback(() => {
    isComposing.current = true;
  }, []);

  const handleCompositionEnd = useCallback((e) => {
    isComposing.current = false;
    handleChange(e); // 在拼音輸入結束後處理變更
  }, [handleChange]);

  return {
    inputRef,
    handleChange,
    handleCompositionStart,
    handleCompositionEnd,
    autoResize,
  };
};
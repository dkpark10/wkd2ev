"use client";

import { forwardRef, type ForwardedRef } from "react";

interface TextEditorBlockProps {
  dataBlockId: string;
}

export default forwardRef<HTMLDivElement, TextEditorBlockProps>(function TextEditorArea(
  { dataBlockId },
  ref: ForwardedRef<HTMLDivElement>,
) {
  return <div data-block-id={dataBlockId} contentEditable ref={ref} data-testid="editor-block1" />;
});

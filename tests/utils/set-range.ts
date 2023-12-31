export interface SetRangeArgs {
  editorBlock: SVGElement | HTMLElement;
  startLine: number;
  initHtml?: string;
  endOffset?: number;
}

export const setRange = ({ editorBlock, initHtml, startLine, endOffset }: SetRangeArgs) => {
  const range = new Range();

  if (initHtml) editorBlock.innerHTML = initHtml;

  const len = endOffset ?? editorBlock.children[startLine].firstChild?.textContent?.length as number;
  range.setStart(editorBlock.children[startLine].firstChild as Node, 0);
  range.setEnd(editorBlock.children[startLine].firstChild as Node, len);

  window.getSelection()?.removeAllRanges();
  window.getSelection()?.addRange(range);
}
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable no-continue */
import type { Editor } from "types";
import { AbstractTextEditorHandler, type AbstractTextEditorHandlerProps } from "./abstract-text-editor-handler";

/** @description 기본 텍스트 에디터 핸들러 */
export class TextEditorHandler extends AbstractTextEditorHandler {
  constructor({ contentEditableDom, selection, range }: AbstractTextEditorHandlerProps) {
    super({ contentEditableDom, selection, range });
  }

  public runBold() {
    const clonedContents = this.origRange.cloneContents();

    // const firstNode =
    //   clonedContents.childNodes.length > 1 ? this.getProcessedRightNode("bold") : this.getProcessedNode("bold");
    this.getProcessedNode("bold");

    // const middleNode = this.getActionMiddleNode(clonedContents.childNodes, "bold");
    // const lastNode = this.getProcessedLeftNode("bold");

    // this.setRangeAll();
    // this.range.deleteContents();

    // if (clonedContents.childNodes.length > 1) {
    //   this.range.insertNode(lastNode);
    // }

    // middleNode.forEach((node) => this.range.insertNode(node));

    // this.range.insertNode(firstNode);

    this.selection.removeAllRanges();
  }

  /** @desc 영역을 start container, end container 를 포함하여 새로 설정하는 함수 */
  public setRangeAll() {
    this.origRange.setStart(this.origRange.startContainer, 0);
    this.origRange.setEndAfter(this.origRange.endContainer);
  }

  public getProcessedRightNode(action: Editor.EditorAction) {
    const { startContainer: node, startOffset } = this.origRange;

    const beforeText = node.textContent?.slice(0, startOffset);
    const afterText = node.textContent?.slice(startOffset);

    const beforeElement = document.createTextNode(beforeText ?? "");
    const afterElement = this.createTextActionElement(action);
    afterElement.textContent = afterText ?? "";

    const newElement = document.createDocumentFragment();
    newElement.appendChild(beforeElement);
    newElement.appendChild(afterElement);

    return newElement;
  }

  public getProcessedLeftNode(action: Editor.EditorAction) {
    const { endContainer: node, endOffset } = this.origRange;

    const beforeText = node.textContent?.slice(0, endOffset);
    const afterText = node.textContent?.slice(endOffset);

    const beforeElement = this.createTextActionElement(action);
    beforeElement.textContent = beforeText ?? "";

    const afterElement = document.createTextNode(afterText ?? "");

    const newElement = document.createDocumentFragment();
    newElement.appendChild(beforeElement);
    newElement.appendChild(afterElement);

    return newElement;
  }

  public getProcessedNode(action: Editor.EditorAction) {
    const { startContainer, endContainer, startOffset, endOffset } = this.origRange;

    if (this.isAlreadyHaveActionElement(startContainer)) {
      if (this.isAlreadyHaveSameActionOnlyOne(action, startContainer)) {
        if (this.isAccurateMatch(startContainer)) {
          startContainer.parentElement?.remove();
          const newElement = document.createTextNode(startContainer.textContent as string);
          this.origRange.setStart(this.origRange.startContainer, 0);
          this.origRange.insertNode(newElement);
        } else {
          this.origRange.setStart(startContainer, 0);
          this.origRange.setEnd(endContainer, endOffset);

          const beginText = startContainer.textContent ?? "";
          const endText = endContainer.textContent?.slice(0, endOffset) ?? "";

          startContainer.parentElement?.remove();

          const newElement = document.createDocumentFragment();
          const actionElement = this.createTextActionElement(action);
          actionElement.textContent = beginText + endText;
          newElement.appendChild(actionElement);

          this.origRange.deleteContents();

          this.origRange.insertNode(newElement);
        }
      }
      return;
    }

    if (this.isAlreadyHaveActionElement(endContainer)) {
      if (this.isAlreadyHaveSameActionOnlyOne(action, endContainer)) {
        if (this.isAccurateMatch(endContainer)) {
          endContainer.parentElement?.remove();
          const newElement = document.createTextNode(endContainer.textContent as string);
          this.origRange.setStart(this.origRange.endContainer, 0);
          this.origRange.insertNode(newElement);
        } else {
          this.origRange.setStart(startContainer, startOffset);
          this.origRange.setEnd(endContainer, endOffset);

          const beginText = startContainer.textContent?.slice(startOffset) ?? "";
          const endText = endContainer.textContent ?? "";

          endContainer.parentElement?.remove();

          const newElement = document.createDocumentFragment();
          const actionElement = this.createTextActionElement(action);
          actionElement.textContent = beginText + endText;
          newElement.appendChild(actionElement);

          this.origRange.deleteContents();

          this.origRange.insertNode(newElement);
        }
      }
      return;
    }

    const beforeText = startContainer.textContent?.slice(0, startOffset);
    const middleText = startContainer.textContent?.slice(startOffset, endOffset);
    const afterText = startContainer.textContent?.slice(endOffset);

    const beforeElement = document.createTextNode(beforeText ?? "");
    const middleElement = this.createTextActionElement(action);
    middleElement.textContent = middleText ?? "";

    const afterElement = document.createTextNode(afterText ?? "");

    const newElement = document.createDocumentFragment();
    newElement.appendChild(beforeElement);
    newElement.appendChild(middleElement);
    newElement.appendChild(afterElement);

    this.setRangeAll();
    this.origRange.deleteContents();
    this.origRange.insertNode(newElement);
  }

  public getActionMiddleNode(middleRangeNode: NodeListOf<ChildNode>, action: Editor.EditorAction) {
    const result = [];
    const { length } = middleRangeNode;
    for (let i = length - 2; i >= 1; i -= 1) {
      const childNode = middleRangeNode[i];
      result.push(this.runTextActionRangeNode(childNode, action));
    }

    return result;
  }

  public runTextActionRangeNode(childNode: ChildNode, action: Editor.EditorAction) {
    const wrapperElement = this.createTextActionElement(action);
    const newElement = childNode.cloneNode();
    newElement.textContent = childNode.textContent;
    wrapperElement.appendChild(newElement);

    return wrapperElement;
  }

  /** @desc 선택 영역의 부모노드가 span이라면 */
  public isAlreadyHaveActionElement(node: Node) {
    const isTagNameSpan = node.parentElement?.nodeName === this.actionTagName;
    const hasAttributeAction = Object.prototype.hasOwnProperty.call(node.parentElement?.dataset, "actionAttribute");

    return isTagNameSpan && hasAttributeAction;
  }

  /** @desc 선택 영역의 액션이 동일하다면 */
  public isAlreadyHaveSameActionOnlyOne(action: Editor.EditorAction, node: Node) {
    return (
      node.parentElement?.classList.length === 1 && node.parentElement.className === this.classNameByTextAction[action]
    );
  }

  /** @desc 이전 선택영역과 완전히 겹치는지 판별하는 함수 */
  public isAccurateMatch(node: Node) {
    const { startOffset, endOffset } = this.origRange;
    const textLen = endOffset - startOffset;
    return node.textContent?.length === textLen;
  }
}

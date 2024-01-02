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
    const clonedContents = this.range.cloneContents();

    const firstNode =
      clonedContents.childNodes.length > 1 ? this.getProcessedRightNode("bold") : this.getProcessedNode("bold");

    const middleNode = this.getActionMiddleNode(clonedContents.childNodes, "bold");
    const lastNode = this.getProcessedLeftNode("bold");

    this.setRangeAll();
    this.range.deleteContents();

    if (clonedContents.childNodes.length > 1) {
      this.range.insertNode(lastNode);
    }

    middleNode.forEach((node) => this.range.insertNode(node));

    this.range.insertNode(firstNode);

    this.selection.removeAllRanges();
  }

  /** @desc 영역을 start container, end container 를 포함하여 새로 설정하는 함수 */
  public setRangeAll() {
    this.range.setStart(this.range.startContainer, 0);
    this.range.setEndAfter(this.range.endContainer);
  }

  public getProcessedRightNode(action: Editor.EditorAction) {
    const { startContainer: node, startOffset } = this.range;

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
    const { endContainer: node, endOffset } = this.range;

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
    const { startContainer, startOffset, endOffset } = this.range;

    if (this.isAlreadyHaveActionElement(startContainer)) {
      if (this.isAlreadyHaveSameActionOnlyOne(startContainer, action)) {
        //
      }
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

    return newElement;
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

  public isAlreadyHaveActionElement(node: Node) {
    const { parentElement } = node;
    const isTagNameSpan = parentElement?.nodeName === this.actionTagName;
    const hasAttributeAction = Object.prototype.hasOwnProperty.call(parentElement?.dataset, "actionAttribute");

    return isTagNameSpan && hasAttributeAction;
  }

  public isAlreadyHaveSameActionOnlyOne(node: Node, action: Editor.EditorAction) {
    const { parentElement } = node;
    return parentElement?.classList.length === 1 && parentElement.className === this.classNameByTextAction[action];
  }

  // public isAccurateMatch(startOffset: number, endOffset: number) {
  //   const { parentElement } = node;
  //   return parentElement?.classList.length === 1 && parentElement.className === this.classNameByTextAction[action];
  // }
}

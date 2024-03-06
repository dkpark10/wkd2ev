export const countTextNodes = (rootNode: HTMLElement) => {
  let count = 0;
  for (const childNode of rootNode.childNodes) {
    if (childNode.nodeType === Node.TEXT_NODE) {
      /** @desc 현재 노드가 텍스트 노드인 경우 */
      count++;
    } else if (childNode.nodeType === Node.ELEMENT_NODE) {
      /** @desc 현재 노드가 엘리먼트 노드인 경우 재귀적으로 탐색 */
      count += countTextNodes(rootNode);
    }
  }
  return count;
};

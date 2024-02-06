import { test, expect } from "@playwright/test";
import { keyPress, replaceHtml, countTextNodes } from "./utils";

interface SetRangeArgs {
  editorBlock: SVGElement | HTMLElement;
  startLine?: number;
  beginIdx?: number;
  initHtml?: string;
  endOffset?: number;
}

const EDITOR_SELECTOR = 'div[data-testid="editor-block1"]';

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("에디터 액션 테스트", () => {
  const initHtmlList = ["1111111111", "2222222222", "3333333333", "4444444444", "5555555555", "6666666666"];

  test("한 줄 전체 bold 처리 후 똑같은 영역을 잡고 다시 bold를 누르면 bold를 없앤다.", async ({ page }, testInfo) => {
    const editorBlock = await page.$(EDITOR_SELECTOR);
    if (!editorBlock) return;

    await editorBlock.click();

    await keyPress(page, initHtmlList);

    const startLine = 1;
    await page.evaluate(
      ({ editorBlock, startLine = 0, beginIdx = 0 }: SetRangeArgs) => {
        const range = new Range();

        const len = editorBlock.children[startLine].firstChild?.textContent?.length as number;
        range.setStart(editorBlock.children[startLine].firstChild as Node, beginIdx);
        range.setEnd(editorBlock.children[startLine].firstChild as Node, len);

        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
      },
      {
        editorBlock,
        startLine,
      },
    );

    await page.screenshot({ path: `./tests/${testInfo.title}/range1.png` });

    const boldButton = page.getByTestId("button-action-bold");
    await boldButton.click();

    const expectedValue = replaceHtml(
      initHtmlList.map((html) => `<div>${html}</div>`),
      `<div><span class="font-bold" data-action-attribute="">${initHtmlList[startLine]}</span></div>`,
      startLine,
    );

    expect(await editorBlock.innerHTML()).toBe(expectedValue);

    await page.evaluate(
      ({ editorBlock, startLine = 0 }: SetRangeArgs) => {
        const range = new Range();

        const startNode = editorBlock.children[startLine];
        const textNode = startNode.children[0].firstChild;

        if (!startNode || !textNode) return;

        range.setStart(textNode, 0);
        range.setEnd(textNode, textNode.textContent?.length ?? 0);

        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
      },
      {
        editorBlock,
        startLine: 1,
      },
    );

    await page.screenshot({ path: `./tests/${testInfo.title}/range2.png` });

    await boldButton.click();

    await page.screenshot({ path: `./tests/${testInfo.title}/result.png` });
    expect(await editorBlock.innerHTML()).toBe(initHtmlList.map((html) => `<div>${html}</div>`).join(""));
  });

  test("한 줄 일부영역을 bold 처리 후 똑같은 영역을 잡고 다시 bold를 누르면 bold를 없앤다.", async ({
    page,
  }, testInfo) => {
    const editorBlock = await page.$(EDITOR_SELECTOR);
    if (!editorBlock) return;

    await editorBlock.click();

    await keyPress(page, initHtmlList);

    const startLine = 1;
    const beginIdx = 3;
    await page.evaluate(
      ({ editorBlock, startLine = 0, beginIdx = 0 }: SetRangeArgs) => {
        const range = new Range();

        const len = editorBlock.children[startLine].firstChild?.textContent?.length as number;
        range.setStart(editorBlock.children[startLine].firstChild as Node, beginIdx);
        range.setEnd(editorBlock.children[startLine].firstChild as Node, len);

        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
      },
      {
        editorBlock,
        startLine,
        beginIdx,
      },
    );

    await page.screenshot({ path: `./tests/${testInfo.title}/range1.png` });

    const boldButton = page.getByTestId("button-action-bold");
    await boldButton.click();

    const expectedValue = replaceHtml(
      initHtmlList.map((html) => `<div>${html}</div>`),
      `<div>222<span class="font-bold" data-action-attribute="">${initHtmlList[startLine].slice(
        beginIdx,
      )}</span></div>`,
      startLine,
    );

    expect(await editorBlock.innerHTML()).toBe(expectedValue);

    await page.evaluate(
      ({ editorBlock, startLine = 0 }: SetRangeArgs) => {
        const range = new Range();

        const startNode = editorBlock.children[startLine];
        const textNode = startNode.children[0].firstChild;

        if (!startNode || !textNode) return;

        range.setStart(textNode, 0);
        range.setEnd(textNode, textNode.textContent?.length ?? 0);

        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
      },
      {
        editorBlock,
        startLine: 1,
      },
    );

    await page.screenshot({ path: `./tests/${testInfo.title}/range2.png` });

    await boldButton.click();

    await page.screenshot({ path: `./tests/${testInfo.title}/result.png` });
    expect(await editorBlock.innerHTML()).toBe(initHtmlList.map((html) => `<div>${html}</div>`).join(""));
  });

  test("한 줄 일부영역 bold 처리 후 시작 컨테이너를 텍스트 노드로 설정 bold 처리된 영역을 끝 컨테이너로 설정하여 bold 처리하면 두 영역이 bold처리 되어야 한다.", async ({
    page,
  }, testInfo) => {
    const editorBlock = await page.$(EDITOR_SELECTOR);
    if (!editorBlock) return;

    await editorBlock.click();

    await keyPress(page, initHtmlList);

    const startLine = 1;
    const beginIdx = 3;
    await page.evaluate(
      ({ editorBlock, startLine = 0, beginIdx = 0 }: SetRangeArgs) => {
        const range = new Range();

        const len = editorBlock.children[startLine].firstChild?.textContent?.length as number;
        const startNode = editorBlock.children[startLine].firstChild;
        const endNode = editorBlock.children[startLine].firstChild;

        range.setStart(startNode as Node, beginIdx);
        range.setEnd(endNode as Node, len);

        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
      },
      {
        editorBlock,
        startLine,
        beginIdx,
      },
    );

    await page.screenshot({ path: `./tests/${testInfo.title}/range1.png` });

    const boldButton = page.getByTestId("button-action-bold");
    await boldButton.click();

    let expectedValue = replaceHtml(
      initHtmlList.map((html) => `<div>${html}</div>`),
      `<div>222<span class="font-bold" data-action-attribute="">${initHtmlList[startLine].slice(
        beginIdx,
      )}</span></div>`,
      startLine,
    );

    expect(await editorBlock.innerHTML()).toBe(expectedValue);

    await page.evaluate(
      ({ editorBlock, startLine = 0 }: SetRangeArgs) => {
        const range = new Range();

        const startNode = editorBlock.children[startLine].firstChild?.nextSibling;
        const endNode = editorBlock.children[startLine];
        const textNode = endNode.children[0].firstChild;

        if (!startNode || !textNode || !endNode) return;

        range.setStart(startNode as Node, 1);
        range.setEnd(textNode, 2);

        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
      },
      {
        editorBlock,
        startLine,
      },
    );

    await page.screenshot({ path: `./tests/${testInfo.title}/range2.png` });

    await boldButton.click();

    expectedValue = replaceHtml(
      initHtmlList.map((html) => `<div>${html}</div>`),
      `<div>2<span class="font-bold" data-action-attribute="">${initHtmlList[startLine].slice(1)}</span></div>`,
      startLine,
    );

    await page.screenshot({ path: `./tests/${testInfo.title}/result.png` });
    expect(await editorBlock.innerHTML()).toBe(expectedValue);
  });
});

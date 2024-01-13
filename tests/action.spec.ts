import { test, expect } from "@playwright/test";
import { keyPress } from './utils/key-press';

interface SetRangeArgs {
  editorBlock: SVGElement | HTMLElement;
  startLine?: number;
  beginIdx?: number;
  initHtml?: string;
  endOffset?: number;
}

const EDITOR_SELECTOR = 'div[data-testid="editor-block1"]';

const replaceHtml = (initHtmlList: Array<string>, value: string, idx: number) => {
  return initHtmlList.reduce((acc, content, i) => {
    return i === idx ? acc + value : acc + content;
  }, "");
};

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("에디터 액션 테스트", () => {
  const initHtmlList = ["1111111111", "2222222222", "3333333333", "4444444444", "5555555555", "6666666666"];

  test("한 줄 전체 bold 처리 후 다시 bold를 누르면 bold를 없앤다.", async ({ page }, testInfo) => {
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

    expect(await editorBlock.innerHTML()).toBe(initHtmlList.map((html) => `<div>${html}</div>`).join(""));
  });

  test("한 줄 일부 bold 처리 후 똑같은 영역을 다시 bold를 없앤다.", async ({ page }, testInfo) => {
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

    expect(await editorBlock.innerHTML()).toBe(initHtmlList.map((html) => `<div>${html}</div>`).join(""));
  });

  test("한 줄 일부 bold 처리 후 bold처리된 영역의 텍스트 일부와 새로운 텍스트 일부의 영역을 선택해서 bold처리 시 기존 bold처리된 영역과 새로운 영역이 합쳐져 bold 처리 되어야 한다.", async ({
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
  });
});

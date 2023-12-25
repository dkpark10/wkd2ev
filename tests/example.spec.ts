import { test, expect } from "@playwright/test";

const initEditorHtml = ["1111111111", "2222222222", "3333333333", "4444444444", "5555555555", "6666666666"];

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("에디터 액션 테스트", () => {
  test("한 줄 전체 bold 처리 테스트", async ({ page }) => {
    const editorBlock = await page.$('div[data-testid="editor-block1"]');
    if (!editorBlock) return;

    await editorBlock.click();

    for (let i = 0; i < initEditorHtml.length; i += 1) {
      await page.keyboard.type(initEditorHtml[i]);
      await page.keyboard.press("Enter");
    }

    await page.evaluateHandle(() => {
      // const range = new Range();
      // const editorBlockElement = document.querySelector('div[data-testid="editor-block1"]');

      // if (!editorBlockElement) return;

      // range.setStart(editorBlockElement.children[0].firstChild as Node, 0);
      // range.setEnd(editorBlockElement.children[0].firstChild as Node, 3);

      // document.getSelection()?.removeAllRanges();
      // document.getSelection()?.addRange(range);

      let editableDiv = document.querySelector('div[data-testid="editor-block1"]');

      // Create a range object
      let range = document.createRange();

      // Get the second div (index 1) and its text node
      let secondDiv = editableDiv?.children[1];
      let textNode = secondDiv?.firstChild;

      // Set the start position to the 3rd character of the text node in the second div
      range.setStart(textNode as Node, 2);

      // Get the fourth div (index 3) and its text node
      let fourthDiv = editableDiv?.children[3];
      textNode = fourthDiv?.firstChild;

      // Set the end position to the 7th character of the text node in the fourth div
      range.setEnd(textNode as Node, 6);

      // Clear any existing selections
      window.getSelection()?.removeAllRanges();

      // Add the new range to the selection
      window.getSelection()?.addRange(range);
    });
    page.screenshot({ path: "selection.png" });
  });

  // test("한 줄 일부 bold 처리 테스트", async () => {});

  // test("한 줄 bold 처리된 텍스트를 원상태로 복귀한다.", async () => {});

  // test("한 줄 bold 처리된 텍스트를 bold처리 되지 않은 텍스트와 겹치게 해서 다시 bold 처리할 때 기존 bold 처리된 텍스트와 합쳐져서 처리된다", async () => {});

  // test("한 줄 bold 처리된 텍스트의 기울기 액션을 추가하여 둘다 적용 되는지 테스트", async () => {});

  // test("한 줄 bold 처리된 텍스트와 그렇지 않은 곳을 선택하여 기울기 액션 적용 시 겹치는 부분은 두 기울기, bold 둘 다 적용되어야 한다.", async () => {});

  // test("여러줄 bold 처리 테스트", async () => {});

  // test("여러줄 bold 처리된 텍스트를 원상태로 복귀한다.", async () => {});
});

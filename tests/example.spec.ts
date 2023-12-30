import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("에디터 액션 테스트", () => {
  test("한 줄 전체 bold 처리 테스트", async ({ page }) => {
    const editorBlock = await page.$('div[data-testid="editor-block1"]');
    if (!editorBlock) return;

    await page.evaluateHandle(() => {
      const range = new Range();
      const editorBlockElement = document.querySelector('div[data-testid="editor-block1"]');

      if (!editorBlockElement) return;

      editorBlockElement.innerHTML = `
        1111111111
        <div>2222222222</div>
        <div>3333333333</div>
        <div>4444444444</div>
        <div>5555555555</div>
        <div>6666666666</div>
      `;

      const len = editorBlockElement.children[0].firstChild?.textContent?.length as number;
      range.setStart(editorBlockElement.children[0].firstChild as Node, 0);
      range.setEnd(editorBlockElement.children[0].firstChild as Node, len);

      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
    });

    const boldButton = page.getByTestId('button-action-bold');
    await boldButton.click();

    const html = await editorBlock.innerHTML(); 

    expect(html).toBe(`
      1111111111
      <div><span class="font-bold" data-action-attribute="">2222222222</span></div>
      <div>3333333333</div>
      <div>4444444444</div>
      <div>5555555555</div>
      <div>6666666666</div>    
    `)
  });

  // test("한 줄 일부 bold 처리 테스트", async () => {});

  // test("한 줄 bold 처리된 텍스트를 원상태로 복귀한다.", async () => {});

  // test("한 줄 bold 처리된 텍스트를 bold처리 되지 않은 텍스트와 겹치게 해서 다시 bold 처리할 때 기존 bold 처리된 텍스트와 합쳐져서 처리된다", async () => {});

  // test("한 줄 bold 처리된 텍스트의 기울기 액션을 추가하여 둘다 적용 되는지 테스트", async () => {});

  // test("한 줄 bold 처리된 텍스트와 그렇지 않은 곳을 선택하여 기울기 액션 적용 시 겹치는 부분은 두 기울기, bold 둘 다 적용되어야 한다.", async () => {});

  // test("여러줄 bold 처리 테스트", async () => {});

  // test("여러줄 bold 처리된 텍스트를 원상태로 복귀한다.", async () => {});
});

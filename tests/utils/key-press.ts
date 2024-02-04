import type { Page } from "@playwright/test";

export const keyPress = async (page: Page, initHtmlList: Array<string>) => {
  /** @todo 임시용 추후 지우기 */
  if (process.env.TEST_ENV === 'true') return;
  for (let i = 0; i < initHtmlList.length; i += 1) {
    await page.keyboard.type(initHtmlList[i]);

    if (i < initHtmlList.length - 1) {
      await page.keyboard.press("Enter");
    }
  }
};

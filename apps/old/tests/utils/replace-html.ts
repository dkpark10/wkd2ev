export const replaceHtml = (initHtmlList: Array<string>, value: string, idx: number) => {
  return initHtmlList.reduce((acc, content, i) => {
    return i === idx ? acc + value : acc + content;
  }, "");
};
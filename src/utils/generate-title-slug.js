export const generateTitleSlug = (title) => {
  return decodeURIComponent(title)
    .trim()
    .toLowerCase() // 소문자로 변환
    .replace(/\.+/g, '-') // 연속된 점(...)을 하나의 하이픈으로 변환
    .replace(/…/g, '-') // 특수문자 '…' 하이픈으로 변환
    .replace(/[\(\)\[\]\{\}]/g, ' ') // 괄호 및 대괄호, 중괄호 제거
    .replace(/[\s,;:!]+/g, '-') // 공백, 쉼표, 세미콜론, 콜론, 느낌표 등을 하이픈으로 변환
    .replace(/[^a-zA-Z0-9가-힣-]/g, '') // 영문, 숫자, 한글, 하이픈을 제외한 문자 제거
    .replace(/-+/g, '-') // 연속된 하이픈을 하나로 줄임
    .replace(/^-|-$|^-$/g, ''); // 문자열의 시작과 끝의 하이픈 제거
};
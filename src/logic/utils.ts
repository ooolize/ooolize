/*
 * @Description:
 * @Author: lize
 * @Date: 2023-12-07
 * @LastEditors: lize
 */
export const isInScreen = (element: HTMLElement) => {
  let rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

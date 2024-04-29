"use strict";
exports.id = "component---src-pages-post-markdown-remark-frontmatter-slug-jsx";
exports.ids = ["component---src-pages-post-markdown-remark-frontmatter-slug-jsx"];
exports.modules = {

/***/ "./src/pages/post/{markdownRemark.frontmatter__slug}.jsx?export=default":
/*!******************************************************************************!*\
  !*** ./src/pages/post/{markdownRemark.frontmatter__slug}.jsx?export=default ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BlogPostTemplate)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function BlogPostTemplate({
  data
}) {
  const {
    markdownRemark
  } = data;
  const {
    frontmatter,
    html
  } = markdownRemark;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("h1", null, frontmatter.title), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("h2", null, frontmatter.date), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: html
    }
  })));
}
const pageQuery = "1238545120";

/***/ })

};
;
//# sourceMappingURL=component---src-pages-post-markdown-remark-frontmatter-slug-jsx.js.map
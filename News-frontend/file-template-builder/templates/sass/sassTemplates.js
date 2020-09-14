const sassTemplates = (fileExtension, relativePathToSrc, isScss) =>
  `// Default imports from shared sass/scss files
// Remove/comment if not needed
// 1 - TOOLS - Global SASS Variables
//---------------------------------------------------

@import "${relativePathToSrc}/assets/sass/1-tools/vars.scss"${isScss ? ";" : ""}

// Custom mixin
@import "${relativePathToSrc}/assets/sass/1-tools/custom-mixin.scss"${isScss ? ";" : ""}
  
`;

module.exports = sassTemplates;

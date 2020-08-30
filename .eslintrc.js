module.exports = {
  "extends": [
    "prettier",
    "prettier/standard",
    "prettier/react",
    "plugin:react/recommended"
  ],
  "plugins": ["prettier", "react", "react-hooks"],
  "rules": {
    "prettier/prettier": "error",
    "react/prop-types": [2, { ignore: ['children'] }]
  },
  "parser": "babel-eslint",
  "env": {
    "browser": true
  },
  "settings": {
    "react": {
      "pragma": "React",
      "version": "detect"
    }
  }
}

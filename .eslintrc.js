module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    parserOptions: {
        parser: 'babel-eslint'
    },
    rules: {
     
            "generator-star-spacing": "off",
            "no-tabs":"off",
            "no-unused-vars":"off",
            "no-console":"off",
            "no-irregular-whitespace":"off",
            "no-debugger": "off",       
        'space-before-Function-paren':0,
        "no-irregular-whitespace": "off",
        "indent": ["off", 2],
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    }
}
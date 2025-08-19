// This is copied from the nativewind docs

module.exports = function (api) {
    api.cache(true);
    return{
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
            "nativewind/babel",
        ]
    }
}
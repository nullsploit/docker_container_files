
export function getExtensionLanguage(extension) {
    switch (extension) {
        case "py":
        return "python";
        case "js":
        return "javascript";
        case "json":
        return "json";
        case "html":
        return "html";
        case "css":
        return "css";
        case "txt":
        return "text";
        default:
        return "text";
    }
}

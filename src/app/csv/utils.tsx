

export const camelCaseToTitleCase: (str: string) => string = (str: string) => {
    const text = str;
    const result = text.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
}
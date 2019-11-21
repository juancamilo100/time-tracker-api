import { ObjectLiteral } from "../../types/generics";

export const camelToSnake = (string: string) => {
    return string.replace(/[\w]([A-Z])/g, (m) => {
        return m[0] + "_" + m[1];
    }).toLowerCase();
};

export const toCamelCase = (string: string) => {
    return string.replace(/([-_][a-z])/ig, (m) => {
      return m.toUpperCase()
        .replace("-", "")
        .replace("_", "");
    });
};

export const toCamelCaseAllPropsKeys = (object: ObjectLiteral) => {
    const transformedObject = {} as ObjectLiteral;

    Object.keys(object).forEach((field) => {
        transformedObject[toCamelCase(field)] = object[field];
    });

    return transformedObject;
};

export const toSnakeCaseAllPropsKeys = (object: ObjectLiteral) => {
    const transformedObject = {} as ObjectLiteral;

    Object.keys(object).forEach((field) => {
        transformedObject[camelToSnake(field)] = object[field];
    });

    return transformedObject;
};

export const toLowerCaseAllPropsValues = (object: ObjectLiteral, propsToExclude?: string[]) => {
    const objectLiteral = object as ObjectLiteral;

    Object.keys(object).forEach((field) => {
        if (typeof objectLiteral[field] === "string" && !propsToExclude!.includes(field)) {
            objectLiteral[field] = objectLiteral[field].toLowerCase();
        }
    });

    return objectLiteral;
};

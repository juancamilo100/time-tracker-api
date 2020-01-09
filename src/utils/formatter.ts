import { ObjectLiteral } from "../../types/generics";

export const camelToSnake = (string: string) => {
    return string.replace(/[\w]([A-Z0-9])/g, (m) => {
        return m[0] + "_" + m[1];
    }).toLowerCase();
};

export const toCamelCase = (string: string) => {
    return string.replace(/([-_][a-z0-9])/ig, (m) => {
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

export const toTitleCase = (string: string) => {
    let split = string.split(" ");
    for (let i = 0; i < split.length; i++) {
        split[i] = split[i].charAt(0).toUpperCase() + split[i].slice(1); ;
    }
    return split.join(" ");
}

export const toLowerCaseAllPropsValues = (object: ObjectLiteral, propsToExclude?: string[]) => {
    const objectLiteral = object as ObjectLiteral;

    Object.keys(object).forEach((field) => {
        if (typeof objectLiteral[field] === "string" && !propsToExclude!.includes(field)) {
            objectLiteral[field] = objectLiteral[field].toLowerCase();
        }
    });

    return objectLiteral;
};

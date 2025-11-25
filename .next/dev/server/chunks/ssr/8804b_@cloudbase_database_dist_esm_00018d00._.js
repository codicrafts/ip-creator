module.exports = [
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/index.js [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
;
;
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/constant.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorCode",
    ()=>ErrorCode,
    "FieldType",
    ()=>FieldType,
    "Opeartor",
    ()=>Opeartor,
    "OperatorMap",
    ()=>OperatorMap,
    "OrderDirectionList",
    ()=>OrderDirectionList,
    "QueryType",
    ()=>QueryType,
    "UpdateOperatorList",
    ()=>UpdateOperatorList,
    "WhereFilterOpList",
    ()=>WhereFilterOpList
]);
var ErrorCode;
(function(ErrorCode) {
    ErrorCode["DocIDError"] = "\u6587\u6863ID\u4E0D\u5408\u6CD5";
    ErrorCode["CollNameError"] = "\u96C6\u5408\u540D\u79F0\u4E0D\u5408\u6CD5";
    ErrorCode["OpStrError"] = "\u64CD\u4F5C\u7B26\u4E0D\u5408\u6CD5";
    ErrorCode["DirectionError"] = "\u6392\u5E8F\u5B57\u7B26\u4E0D\u5408\u6CD5";
    ErrorCode["IntergerError"] = "must be integer";
    ErrorCode["BooleanError"] = "must be boolean";
    ErrorCode["ArrayError"] = "must be array";
    ErrorCode["QueryParamTypeError"] = "\u67E5\u8BE2\u53C2\u6570\u5FC5\u987B\u4E3A\u5BF9\u8C61";
    ErrorCode["QueryParamValueError"] = "\u67E5\u8BE2\u53C2\u6570\u5BF9\u8C61\u503C\u4E0D\u80FD\u5747\u4E3Aundefined";
    ErrorCode["CentersPhereError"] = "centersPhere\u7ED3\u6784\u4E0D\u5408\u6CD5";
})(ErrorCode || (ErrorCode = {}));
const FieldType = {
    String: 'String',
    Number: 'Number',
    Object: 'Object',
    Array: 'Array',
    Boolean: 'Boolean',
    Null: 'Null',
    GeoPoint: 'GeoPoint',
    GeoLineString: 'GeoLineString',
    GeoPolygon: 'GeoPolygon',
    GeoMultiPoint: 'GeoMultiPoint',
    GeoMultiLineString: 'GeoMultiLineString',
    GeoMultiPolygon: 'GeoMultiPolygon',
    Date: 'Date',
    Command: 'Command',
    ServerDate: 'ServerDate',
    BsonDate: 'BsonDate'
};
const OrderDirectionList = [
    'desc',
    'asc'
];
const WhereFilterOpList = [
    '<',
    '<=',
    '==',
    '>=',
    '>'
];
var Opeartor;
(function(Opeartor) {
    Opeartor["lt"] = "<";
    Opeartor["gt"] = ">";
    Opeartor["lte"] = "<=";
    Opeartor["gte"] = ">=";
    Opeartor["eq"] = "==";
})(Opeartor || (Opeartor = {}));
const OperatorMap = {
    [Opeartor.eq]: '$eq',
    [Opeartor.lt]: '$lt',
    [Opeartor.lte]: '$lte',
    [Opeartor.gt]: '$gt',
    [Opeartor.gte]: '$gte'
};
const UpdateOperatorList = [
    '$set',
    '$inc',
    '$mul',
    '$unset',
    '$push',
    '$pop',
    '$unshift',
    '$shift',
    '$currentDate',
    '$each',
    '$position'
];
var QueryType;
(function(QueryType) {
    QueryType["WHERE"] = "WHERE";
    QueryType["DOC"] = "DOC";
})(QueryType || (QueryType = {}));
;
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/symbol.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InternalSymbol",
    ()=>InternalSymbol,
    "default",
    ()=>__TURBOPACK__default__export__
]);
const _symbols = [];
const __internalMark__ = {};
class HiddenSymbol {
    constructor(target){
        Object.defineProperties(this, {
            target: {
                enumerable: false,
                writable: false,
                configurable: false,
                value: target
            }
        });
    }
}
class InternalSymbol extends HiddenSymbol {
    constructor(target, __mark__){
        if (__mark__ !== __internalMark__) {
            throw new TypeError('InternalSymbol cannot be constructed with new operator');
        }
        super(target);
    }
    static for(target) {
        for(let i = 0, len = _symbols.length; i < len; i++){
            if (_symbols[i].target === target) {
                return _symbols[i].instance;
            }
        }
        const symbol = new InternalSymbol(target, __internalMark__);
        _symbols.push({
            target,
            instance: symbol
        });
        return symbol;
    }
}
const __TURBOPACK__default__export__ = InternalSymbol;
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/helper/symbol.js [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SYMBOL_GEO_LINE_STRING",
    ()=>SYMBOL_GEO_LINE_STRING,
    "SYMBOL_GEO_MULTI_LINE_STRING",
    ()=>SYMBOL_GEO_MULTI_LINE_STRING,
    "SYMBOL_GEO_MULTI_POINT",
    ()=>SYMBOL_GEO_MULTI_POINT,
    "SYMBOL_GEO_MULTI_POLYGON",
    ()=>SYMBOL_GEO_MULTI_POLYGON,
    "SYMBOL_GEO_POINT",
    ()=>SYMBOL_GEO_POINT,
    "SYMBOL_GEO_POLYGON",
    ()=>SYMBOL_GEO_POLYGON,
    "SYMBOL_LOGIC_COMMAND",
    ()=>SYMBOL_LOGIC_COMMAND,
    "SYMBOL_OBJECTID",
    ()=>SYMBOL_OBJECTID,
    "SYMBOL_QUERY_COMMAND",
    ()=>SYMBOL_QUERY_COMMAND,
    "SYMBOL_REGEXP",
    ()=>SYMBOL_REGEXP,
    "SYMBOL_SERVER_DATE",
    ()=>SYMBOL_SERVER_DATE,
    "SYMBOL_UNSET_FIELD_NAME",
    ()=>SYMBOL_UNSET_FIELD_NAME,
    "SYMBOL_UPDATE_COMMAND",
    ()=>SYMBOL_UPDATE_COMMAND
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/symbol.js [app-rsc] (ecmascript)");
;
;
const SYMBOL_UNSET_FIELD_NAME = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].for('UNSET_FIELD_NAME');
const SYMBOL_UPDATE_COMMAND = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].for('UPDATE_COMMAND');
const SYMBOL_QUERY_COMMAND = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].for('QUERY_COMMAND');
const SYMBOL_LOGIC_COMMAND = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].for('LOGIC_COMMAND');
const SYMBOL_GEO_POINT = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].for('GEO_POINT');
const SYMBOL_GEO_LINE_STRING = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].for('SYMBOL_GEO_LINE_STRING');
const SYMBOL_GEO_POLYGON = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].for('SYMBOL_GEO_POLYGON');
const SYMBOL_GEO_MULTI_POINT = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].for('SYMBOL_GEO_MULTI_POINT');
const SYMBOL_GEO_MULTI_LINE_STRING = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].for('SYMBOL_GEO_MULTI_LINE_STRING');
const SYMBOL_GEO_MULTI_POLYGON = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].for('SYMBOL_GEO_MULTI_POLYGON');
const SYMBOL_SERVER_DATE = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].for('SERVER_DATE');
const SYMBOL_REGEXP = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].for('REGEXP');
const SYMBOL_OBJECTID = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].for('OBJECTID');
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/type.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getType",
    ()=>getType,
    "isArray",
    ()=>isArray,
    "isDate",
    ()=>isDate,
    "isFunction",
    ()=>isFunction,
    "isInternalObject",
    ()=>isInternalObject,
    "isNumber",
    ()=>isNumber,
    "isObject",
    ()=>isObject,
    "isPlainObject",
    ()=>isPlainObject,
    "isPromise",
    ()=>isPromise,
    "isRegExp",
    ()=>isRegExp,
    "isString",
    ()=>isString
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/symbol.js [app-rsc] (ecmascript)");
;
const getType = (x)=>Object.prototype.toString.call(x).slice(8, -1).toLowerCase();
const isObject = (x)=>getType(x) === 'object';
const isString = (x)=>getType(x) === 'string';
const isNumber = (x)=>getType(x) === 'number';
const isPromise = (x)=>getType(x) === 'promise';
const isFunction = (x)=>typeof x === 'function';
const isArray = (x)=>Array.isArray(x);
const isDate = (x)=>getType(x) === 'date';
const isRegExp = (x)=>getType(x) === 'regexp';
const isInternalObject = (x)=>x && x._internalType instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["InternalSymbol"];
const isPlainObject = (obj)=>{
    if (typeof obj !== 'object' || obj === null) return false;
    let proto = obj;
    while(Object.getPrototypeOf(proto) !== null){
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(obj) === proto;
};
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/lineString.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LineString",
    ()=>LineString
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/helper/symbol.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$point$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/point.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/type.js [app-rsc] (ecmascript)");
;
;
;
class LineString {
    constructor(points){
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(points)) {
            throw new TypeError(`"points" must be of type Point[]. Received type ${typeof points}`);
        }
        if (points.length < 2) {
            throw new Error('"points" must contain 2 points at least');
        }
        points.forEach((point)=>{
            if (!(point instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$point$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Point"])) {
                throw new TypeError(`"points" must be of type Point[]. Received type ${typeof point}[]`);
            }
        });
        this.points = points;
    }
    parse(key) {
        return {
            [key]: {
                type: 'LineString',
                coordinates: this.points.map((point)=>point.toJSON().coordinates)
            }
        };
    }
    toJSON() {
        return {
            type: 'LineString',
            coordinates: this.points.map((point)=>point.toJSON().coordinates)
        };
    }
    static validate(lineString) {
        if (lineString.type !== 'LineString' || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(lineString.coordinates)) {
            return false;
        }
        for (let point of lineString.coordinates){
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isNumber"])(point[0]) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isNumber"])(point[1])) {
                return false;
            }
        }
        return true;
    }
    static isClosed(lineString) {
        const firstPoint = lineString.points[0];
        const lastPoint = lineString.points[lineString.points.length - 1];
        if (firstPoint.latitude === lastPoint.latitude && firstPoint.longitude === lastPoint.longitude) {
            return true;
        }
    }
    get _internalType() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_GEO_LINE_STRING"];
    }
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/polygon.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Polygon",
    ()=>Polygon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/helper/symbol.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/type.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$lineString$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/lineString.js [app-rsc] (ecmascript)");
;
;
;
class Polygon {
    constructor(lines){
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(lines)) {
            throw new TypeError(`"lines" must be of type LineString[]. Received type ${typeof lines}`);
        }
        if (lines.length === 0) {
            throw new Error('Polygon must contain 1 linestring at least');
        }
        lines.forEach((line)=>{
            if (!(line instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$lineString$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LineString"])) {
                throw new TypeError(`"lines" must be of type LineString[]. Received type ${typeof line}[]`);
            }
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$lineString$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LineString"].isClosed(line)) {
                throw new Error(`LineString ${line.points.map((p)=>p.toReadableString())} is not a closed cycle`);
            }
        });
        this.lines = lines;
    }
    parse(key) {
        return {
            [key]: {
                type: 'Polygon',
                coordinates: this.lines.map((line)=>{
                    return line.points.map((point)=>[
                            point.longitude,
                            point.latitude
                        ]);
                })
            }
        };
    }
    toJSON() {
        return {
            type: 'Polygon',
            coordinates: this.lines.map((line)=>{
                return line.points.map((point)=>[
                        point.longitude,
                        point.latitude
                    ]);
            })
        };
    }
    static validate(polygon) {
        if (polygon.type !== 'Polygon' || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(polygon.coordinates)) {
            return false;
        }
        for (let line of polygon.coordinates){
            if (!this.isCloseLineString(line)) {
                return false;
            }
            for (let point of line){
                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isNumber"])(point[0]) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isNumber"])(point[1])) {
                    return false;
                }
            }
        }
        return true;
    }
    static isCloseLineString(lineString) {
        const firstPoint = lineString[0];
        const lastPoint = lineString[lineString.length - 1];
        if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
            return false;
        }
        return true;
    }
    get _internalType() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_GEO_POLYGON"];
    }
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/multiPoint.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MultiPoint",
    ()=>MultiPoint
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/helper/symbol.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$point$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/point.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/type.js [app-rsc] (ecmascript)");
;
;
;
class MultiPoint {
    constructor(points){
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(points)) {
            throw new TypeError(`"points" must be of type Point[]. Received type ${typeof points}`);
        }
        if (points.length === 0) {
            throw new Error('"points" must contain 1 point at least');
        }
        points.forEach((point)=>{
            if (!(point instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$point$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Point"])) {
                throw new TypeError(`"points" must be of type Point[]. Received type ${typeof point}[]`);
            }
        });
        this.points = points;
    }
    parse(key) {
        return {
            [key]: {
                type: 'MultiPoint',
                coordinates: this.points.map((point)=>point.toJSON().coordinates)
            }
        };
    }
    toJSON() {
        return {
            type: 'MultiPoint',
            coordinates: this.points.map((point)=>point.toJSON().coordinates)
        };
    }
    static validate(multiPoint) {
        if (multiPoint.type !== 'MultiPoint' || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(multiPoint.coordinates)) {
            return false;
        }
        for (let point of multiPoint.coordinates){
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isNumber"])(point[0]) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isNumber"])(point[1])) {
                return false;
            }
        }
        return true;
    }
    get _internalType() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_GEO_MULTI_POINT"];
    }
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/multiLineString.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MultiLineString",
    ()=>MultiLineString
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/helper/symbol.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/type.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$lineString$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/lineString.js [app-rsc] (ecmascript)");
;
;
;
class MultiLineString {
    constructor(lines){
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(lines)) {
            throw new TypeError(`"lines" must be of type LineString[]. Received type ${typeof lines}`);
        }
        if (lines.length === 0) {
            throw new Error('Polygon must contain 1 linestring at least');
        }
        lines.forEach((line)=>{
            if (!(line instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$lineString$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LineString"])) {
                throw new TypeError(`"lines" must be of type LineString[]. Received type ${typeof line}[]`);
            }
        });
        this.lines = lines;
    }
    parse(key) {
        return {
            [key]: {
                type: 'MultiLineString',
                coordinates: this.lines.map((line)=>{
                    return line.points.map((point)=>[
                            point.longitude,
                            point.latitude
                        ]);
                })
            }
        };
    }
    toJSON() {
        return {
            type: 'MultiLineString',
            coordinates: this.lines.map((line)=>{
                return line.points.map((point)=>[
                        point.longitude,
                        point.latitude
                    ]);
            })
        };
    }
    static validate(multiLineString) {
        if (multiLineString.type !== 'MultiLineString' || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(multiLineString.coordinates)) {
            return false;
        }
        for (let line of multiLineString.coordinates){
            for (let point of line){
                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isNumber"])(point[0]) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isNumber"])(point[1])) {
                    return false;
                }
            }
        }
        return true;
    }
    get _internalType() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_GEO_MULTI_LINE_STRING"];
    }
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/multiPolygon.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MultiPolygon",
    ()=>MultiPolygon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/helper/symbol.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/type.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$polygon$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/polygon.js [app-rsc] (ecmascript)");
;
;
;
class MultiPolygon {
    constructor(polygons){
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(polygons)) {
            throw new TypeError(`"polygons" must be of type Polygon[]. Received type ${typeof polygons}`);
        }
        if (polygons.length === 0) {
            throw new Error('MultiPolygon must contain 1 polygon at least');
        }
        for (let polygon of polygons){
            if (!(polygon instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$polygon$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Polygon"])) {
                throw new TypeError(`"polygon" must be of type Polygon[]. Received type ${typeof polygon}[]`);
            }
        }
        this.polygons = polygons;
    }
    parse(key) {
        return {
            [key]: {
                type: 'MultiPolygon',
                coordinates: this.polygons.map((polygon)=>{
                    return polygon.lines.map((line)=>{
                        return line.points.map((point)=>[
                                point.longitude,
                                point.latitude
                            ]);
                    });
                })
            }
        };
    }
    toJSON() {
        return {
            type: 'MultiPolygon',
            coordinates: this.polygons.map((polygon)=>{
                return polygon.lines.map((line)=>{
                    return line.points.map((point)=>[
                            point.longitude,
                            point.latitude
                        ]);
                });
            })
        };
    }
    static validate(multiPolygon) {
        if (multiPolygon.type !== 'MultiPolygon' || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(multiPolygon.coordinates)) {
            return false;
        }
        for (let polygon of multiPolygon.coordinates){
            for (let line of polygon){
                for (let point of line){
                    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isNumber"])(point[0]) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isNumber"])(point[1])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    get _internalType() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_GEO_MULTI_POLYGON"];
    }
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/util.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Util",
    ()=>Util
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/constant.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$point$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/point.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$lineString$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/lineString.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$polygon$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/polygon.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$multiPoint$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/multiPoint.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$multiLineString$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/multiLineString.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$multiPolygon$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/multiPolygon.js [app-rsc] (ecmascript)");
;
;
class Util {
}
Util.formatResDocumentData = (documents)=>{
    return documents.map((document)=>{
        return Util.formatField(document);
    });
};
Util.formatField = (document)=>{
    const keys = Object.keys(document);
    let protoField = {};
    if (Array.isArray(document)) {
        protoField = [];
    }
    keys.forEach((key)=>{
        const item = document[key];
        const type = Util.whichType(item);
        let realValue;
        switch(type){
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FieldType"].GeoPoint:
                realValue = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$point$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Point"](item.coordinates[0], item.coordinates[1]);
                break;
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FieldType"].GeoLineString:
                realValue = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$lineString$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LineString"](item.coordinates.map((point)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$point$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Point"](point[0], point[1])));
                break;
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FieldType"].GeoPolygon:
                realValue = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$polygon$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Polygon"](item.coordinates.map((line)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$lineString$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LineString"](line.map(([lng, lat])=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$point$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Point"](lng, lat)))));
                break;
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FieldType"].GeoMultiPoint:
                realValue = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$multiPoint$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MultiPoint"](item.coordinates.map((point)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$point$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Point"](point[0], point[1])));
                break;
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FieldType"].GeoMultiLineString:
                realValue = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$multiLineString$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MultiLineString"](item.coordinates.map((line)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$lineString$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LineString"](line.map(([lng, lat])=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$point$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Point"](lng, lat)))));
                break;
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FieldType"].GeoMultiPolygon:
                realValue = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$multiPolygon$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MultiPolygon"](item.coordinates.map((polygon)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$polygon$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Polygon"](polygon.map((line)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$lineString$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LineString"](line.map(([lng, lat])=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$point$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Point"](lng, lat)))))));
                break;
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FieldType"].Date:
                realValue = item;
                break;
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FieldType"].Object:
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FieldType"].Array:
                realValue = Util.formatField(item);
                break;
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FieldType"].ServerDate:
                realValue = new Date(item.$date);
                break;
            default:
                realValue = item;
        }
        if (Array.isArray(protoField)) {
            protoField.push(realValue);
        } else {
            protoField[key] = realValue;
        }
    });
    return protoField;
};
Util.whichType = (obj)=>{
    let type = Object.prototype.toString.call(obj).slice(8, -1);
    if (type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FieldType"].Date) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FieldType"].Date;
    }
    if (type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FieldType"].Object) {
        if (obj.$date) {
            type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FieldType"].ServerDate;
        } else if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$point$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Point"].validate(obj)) {
            type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FieldType"].GeoPoint;
        } else if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$lineString$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LineString"].validate(obj)) {
            type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FieldType"].GeoLineString;
        } else if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$polygon$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Polygon"].validate(obj)) {
            type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FieldType"].GeoPolygon;
        } else if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$multiPoint$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MultiPoint"].validate(obj)) {
            type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FieldType"].GeoMultiPoint;
        } else if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$multiLineString$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MultiLineString"].validate(obj)) {
            type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FieldType"].GeoMultiLineString;
        } else if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$multiPolygon$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MultiPolygon"].validate(obj)) {
            type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FieldType"].GeoMultiPolygon;
        }
    }
    return type;
};
Util.generateDocId = ()=>{
    let chars = 'ABCDEFabcdef0123456789';
    let autoId = '';
    for(let i = 0; i < 24; i++){
        autoId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return autoId;
};
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/const/code.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ERRORS",
    ()=>ERRORS
]);
const ERRORS = {
    CREATE_WATCH_NET_ERROR: {
        code: 'CREATE_WATCH_NET_ERROR',
        message: 'create watch network error'
    },
    CREATE_WACTH_EXCEED_ERROR: {
        code: 'CREATE_WACTH_EXCEED_ERROR',
        message: 'maximum connections exceed'
    },
    CREATE_WATCH_SERVER_ERROR: {
        code: 'CREATE_WATCH_SERVER_ERROR',
        message: 'create watch server error'
    },
    CONN_ERROR: {
        code: 'CONN_ERROR',
        message: 'connection error'
    },
    INVALID_PARAM: {
        code: 'INVALID_PARAM',
        message: 'Invalid request param'
    },
    INSERT_DOC_FAIL: {
        code: 'INSERT_DOC_FAIL',
        message: 'insert document failed'
    },
    DATABASE_TRANSACTION_CONFLICT: {
        code: 'DATABASE_TRANSACTION_CONFLICT',
        message: 'database transaction conflict'
    },
    DATABASE_REQUEST_FAILED: {
        code: 'DATABASE_REQUEST_FAILED',
        message: 'database request failed'
    }
};
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/utils.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "E",
    ()=>E,
    "TcbError",
    ()=>TcbError,
    "autoCount",
    ()=>autoCount,
    "filterUndefined",
    ()=>filterUndefined,
    "getReqOpts",
    ()=>getReqOpts,
    "parseByEJSON",
    ()=>parseByEJSON,
    "processReturn",
    ()=>processReturn,
    "sleep",
    ()=>sleep,
    "stringifyByEJSON",
    ()=>stringifyByEJSON
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bson$40$4$2e$7$2e$2$2f$node_modules$2f$bson$2f$dist$2f$bson$2e$esm$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/bson@4.7.2/node_modules/bson/dist/bson.esm.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/type.js [app-rsc] (ecmascript)");
;
;
const sleep = (ms = 0)=>new Promise((r)=>setTimeout(r, ms));
const counters = {};
const autoCount = (domain = 'any')=>{
    if (!counters[domain]) {
        counters[domain] = 0;
    }
    return counters[domain]++;
};
const getReqOpts = (apiOptions)=>{
    if (apiOptions.timeout !== undefined) {
        return {
            timeout: apiOptions.timeout
        };
    }
    return {};
};
const filterUndefined = (o)=>{
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isObject"])(o)) {
        return o;
    }
    for(let key in o){
        if (o[key] === undefined) {
            delete o[key];
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isObject"])(o[key])) {
            o[key] = filterUndefined(o[key]);
        }
    }
    return o;
};
const stringifyByEJSON = (params)=>{
    params = filterUndefined(params);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bson$40$4$2e$7$2e$2$2f$node_modules$2f$bson$2f$dist$2f$bson$2e$esm$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EJSON"].stringify(params, {
        relaxed: false
    });
};
const parseByEJSON = (params)=>{
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bson$40$4$2e$7$2e$2$2f$node_modules$2f$bson$2f$dist$2f$bson$2e$esm$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EJSON"].parse(params);
};
class TcbError extends Error {
    constructor(error){
        super(error.message);
        this.code = error.code;
        this.message = error.message;
    }
}
const E = (errObj)=>{
    return new TcbError(errObj);
};
function processReturn(throwOnCode, res) {
    if (throwOnCode === false) {
        return res;
    }
    throw E(Object.assign({}, res));
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/validate.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Validate",
    ()=>Validate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/constant.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$util$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/util.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$const$2f$code$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/const/code.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/utils.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/type.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/helper/symbol.js [app-rsc] (ecmascript) <locals>");
;
;
;
;
;
;
const validOptionsKeys = [
    'limit',
    'offset',
    'projection',
    'order',
    'multiple',
    'timeout',
    'raw'
];
class Validate {
    static isGeopoint(point, degree) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$util$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Util"].whichType(degree) !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FieldType"].Number) {
            throw new Error('Geo Point must be number type');
        }
        const degreeAbs = Math.abs(degree);
        if (point === 'latitude' && degreeAbs > 90) {
            throw new Error('latitude should be a number ranges from -90 to 90');
        } else if (point === 'longitude' && degreeAbs > 180) {
            throw new Error('longitude should be a number ranges from -180 to 180');
        }
        return true;
    }
    static isInteger(param, num) {
        if (!Number.isInteger(num)) {
            throw new Error(param + __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ErrorCode"].IntergerError);
        }
        return true;
    }
    static mustBeBoolean(param, bool) {
        if (typeof bool !== 'boolean') {
            throw new Error(param + __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ErrorCode"].BooleanError);
        }
        return true;
    }
    static isProjection(param, value) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getType"])(value) !== 'object') {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["E"])(Object.assign(Object.assign({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$const$2f$code$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERRORS"].INVALID_PARAM), {
                message: `${param} projection must be an object`
            }));
        }
        for(const key in value){
            const subValue = value[key];
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getType"])(subValue) === 'number') {
                if (subValue !== 0 && subValue !== 1) {
                    throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["E"])(Object.assign(Object.assign({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$const$2f$code$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERRORS"].INVALID_PARAM), {
                        message: `if the value in projection is of number, it must be 0 or 1`
                    }));
                }
            } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getType"])(subValue) === 'object') {} else {
                throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["E"])(Object.assign(Object.assign({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$const$2f$code$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERRORS"].INVALID_PARAM), {
                    message: 'invalid projection'
                }));
            }
        }
        return true;
    }
    static isOrder(param, value) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getType"])(value) !== 'object') {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["E"])(Object.assign(Object.assign({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$const$2f$code$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERRORS"].INVALID_PARAM), {
                message: `${param} order must be an object`
            }));
        }
        for(let key in value){
            const subValue = value[key];
            if (subValue !== 1 && subValue !== -1) {
                throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["E"])(Object.assign(Object.assign({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$const$2f$code$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERRORS"].INVALID_PARAM), {
                    message: `order value must be 1 or -1`
                }));
            }
        }
        return true;
    }
    static isFieldOrder(direction) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["OrderDirectionList"].indexOf(direction) === -1) {
            throw new Error(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ErrorCode"].DirectionError);
        }
        return true;
    }
    static isFieldPath(path) {
        if (!/^[a-zA-Z0-9-_\.]/.test(path)) {
            throw new Error();
        }
        return true;
    }
    static isOperator(op) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["WhereFilterOpList"].indexOf(op) === -1) {
            throw new Error(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ErrorCode"].OpStrError);
        }
        return true;
    }
    static isCollName(name) {
        if (!/^[a-zA-Z0-9]([a-zA-Z0-9-_]){1,32}$/.test(name)) {
            throw new Error(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ErrorCode"].CollNameError);
        }
        return true;
    }
    static isDocID(docId) {
        if (!/^([a-fA-F0-9]){24}$/.test(docId)) {
            throw new Error(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ErrorCode"].DocIDError);
        }
        return true;
    }
    static isValidOptions(options = {}) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getType"])(options) !== 'object') {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["E"])(Object.assign(Object.assign({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$const$2f$code$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERRORS"].INVALID_PARAM), {
                message: `options must be an object`
            }));
        }
        const keys = Object.keys(options);
        for(const index in keys){
            if (validOptionsKeys.indexOf(keys[index]) < 0) {
                throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["E"])(Object.assign(Object.assign({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$const$2f$code$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERRORS"].INVALID_PARAM), {
                    message: `${keys[index]} is invalid options key`
                }));
            }
        }
        const { limit, offset, projection, order } = options;
        const { multiple } = options;
        if (limit !== undefined) {
            Validate.isInteger('limit', limit);
        }
        if (offset !== undefined) {
            Validate.isInteger('offset', offset);
        }
        if (projection !== undefined) {
            Validate.isProjection('projection', projection);
        }
        if (order !== undefined) {
            Validate.isOrder('order', order);
        }
        if (multiple !== undefined) {
            Validate.mustBeBoolean('multiple', multiple);
        }
        if (options.timeout !== undefined) {
            Validate.isInteger('timeout', options.timeout);
        }
        return true;
    }
    static isValidAggregation(stage) {
        if (Object.keys(stage).length !== 1) {
            throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["E"])(Object.assign(Object.assign({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$const$2f$code$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERRORS"].INVALID_PARAM), {
                message: `aggregation stage must have one key`
            }));
        }
        return true;
    }
    static isCentersPhere(param) {
        if (Array.isArray(param) && param.length === 2) {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getType"])(param[0]) === 'object' && param[0]._internalType === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_GEO_POINT"] && typeof param[1] === 'number') {
                return true;
            }
            if (Array.isArray(param[0]) && param[0].length === 2) {
                const longitude = param[0][0];
                const latitude = param[0][1];
                Validate.isGeopoint('longitude', longitude);
                Validate.isGeopoint('latitude', latitude);
                if (typeof param[1] === 'number') {
                    return true;
                }
            }
        }
        throw new Error(`${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ErrorCode"].CentersPhereError}`);
    }
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/point.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Point",
    ()=>Point
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/validate.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/helper/symbol.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/type.js [app-rsc] (ecmascript)");
;
;
;
class Point {
    constructor(longitude, latitude){
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Validate"].isGeopoint('longitude', longitude);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Validate"].isGeopoint('latitude', latitude);
        this.longitude = longitude;
        this.latitude = latitude;
    }
    parse(key) {
        return {
            [key]: {
                type: 'Point',
                coordinates: [
                    this.longitude,
                    this.latitude
                ]
            }
        };
    }
    toJSON() {
        return {
            type: 'Point',
            coordinates: [
                this.longitude,
                this.latitude
            ]
        };
    }
    toReadableString() {
        return `[${this.longitude},${this.latitude}]`;
    }
    static validate(point) {
        return point.type === 'Point' && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(point.coordinates) && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Validate"].isGeopoint('longitude', point.coordinates[0]) && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Validate"].isGeopoint('latitude', point.coordinates[1]);
    }
    get _internalType() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_GEO_POINT"];
    }
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/index.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LineString",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$lineString$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LineString"],
    "MultiLineString",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$multiLineString$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MultiLineString"],
    "MultiPoint",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$multiPoint$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MultiPoint"],
    "MultiPolygon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$multiPolygon$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MultiPolygon"],
    "Point",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$point$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Point"],
    "Polygon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$polygon$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Polygon"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$point$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/point.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$lineString$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/lineString.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$polygon$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/polygon.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$multiPoint$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/multiPoint.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$multiLineString$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/multiLineString.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$multiPolygon$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/multiPolygon.js [app-rsc] (ecmascript)");
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/commands/update.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UPDATE_COMMANDS_LITERAL",
    ()=>UPDATE_COMMANDS_LITERAL,
    "UpdateCommand",
    ()=>UpdateCommand,
    "default",
    ()=>__TURBOPACK__default__export__,
    "isKnownUpdateCommand",
    ()=>isKnownUpdateCommand,
    "isUpdateCommand",
    ()=>isUpdateCommand
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/helper/symbol.js [app-rsc] (ecmascript) <locals>");
;
var UPDATE_COMMANDS_LITERAL;
(function(UPDATE_COMMANDS_LITERAL) {
    UPDATE_COMMANDS_LITERAL["SET"] = "set";
    UPDATE_COMMANDS_LITERAL["REMOVE"] = "remove";
    UPDATE_COMMANDS_LITERAL["INC"] = "inc";
    UPDATE_COMMANDS_LITERAL["MUL"] = "mul";
    UPDATE_COMMANDS_LITERAL["PUSH"] = "push";
    UPDATE_COMMANDS_LITERAL["PULL"] = "pull";
    UPDATE_COMMANDS_LITERAL["PULL_ALL"] = "pullAll";
    UPDATE_COMMANDS_LITERAL["POP"] = "pop";
    UPDATE_COMMANDS_LITERAL["SHIFT"] = "shift";
    UPDATE_COMMANDS_LITERAL["UNSHIFT"] = "unshift";
    UPDATE_COMMANDS_LITERAL["ADD_TO_SET"] = "addToSet";
    UPDATE_COMMANDS_LITERAL["BIT"] = "bit";
    UPDATE_COMMANDS_LITERAL["RENAME"] = "rename";
    UPDATE_COMMANDS_LITERAL["MAX"] = "max";
    UPDATE_COMMANDS_LITERAL["MIN"] = "min";
})(UPDATE_COMMANDS_LITERAL || (UPDATE_COMMANDS_LITERAL = {}));
class UpdateCommand {
    constructor(operator, operands, fieldName){
        this._internalType = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_UPDATE_COMMAND"];
        Object.defineProperties(this, {
            _internalType: {
                enumerable: false,
                configurable: false
            }
        });
        this.operator = operator;
        this.operands = operands;
        this.fieldName = fieldName || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_UNSET_FIELD_NAME"];
    }
    _setFieldName(fieldName) {
        const command = new UpdateCommand(this.operator, this.operands, fieldName);
        return command;
    }
}
function isUpdateCommand(object) {
    return object && object instanceof UpdateCommand && object._internalType === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_UPDATE_COMMAND"];
}
function isKnownUpdateCommand(object) {
    return isUpdateCommand(object) && object.operator.toUpperCase() in UPDATE_COMMANDS_LITERAL;
}
const __TURBOPACK__default__export__ = UpdateCommand;
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/commands/logic.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AND",
    ()=>AND,
    "LOGIC_COMMANDS_LITERAL",
    ()=>LOGIC_COMMANDS_LITERAL,
    "LogicCommand",
    ()=>LogicCommand,
    "NOR",
    ()=>NOR,
    "NOT",
    ()=>NOT,
    "OR",
    ()=>OR,
    "default",
    ()=>__TURBOPACK__default__export__,
    "isKnownLogicCommand",
    ()=>isKnownLogicCommand,
    "isLogicCommand",
    ()=>isLogicCommand
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/helper/symbol.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/commands/query.js [app-rsc] (ecmascript)");
;
;
const AND = 'and';
const OR = 'or';
const NOT = 'not';
const NOR = 'nor';
var LOGIC_COMMANDS_LITERAL;
(function(LOGIC_COMMANDS_LITERAL) {
    LOGIC_COMMANDS_LITERAL["AND"] = "and";
    LOGIC_COMMANDS_LITERAL["OR"] = "or";
    LOGIC_COMMANDS_LITERAL["NOT"] = "not";
    LOGIC_COMMANDS_LITERAL["NOR"] = "nor";
})(LOGIC_COMMANDS_LITERAL || (LOGIC_COMMANDS_LITERAL = {}));
class LogicCommand {
    constructor(operator, operands, fieldName){
        this._internalType = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_LOGIC_COMMAND"];
        Object.defineProperties(this, {
            _internalType: {
                enumerable: false,
                configurable: false
            }
        });
        this.operator = operator;
        this.operands = operands;
        this.fieldName = fieldName || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_UNSET_FIELD_NAME"];
        if (this.fieldName !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_UNSET_FIELD_NAME"]) {
            if (Array.isArray(operands)) {
                operands = operands.slice();
                this.operands = operands;
                for(let i = 0, len = operands.length; i < len; i++){
                    const query = operands[i];
                    if (isLogicCommand(query) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isQueryCommand"])(query)) {
                        operands[i] = query._setFieldName(this.fieldName);
                    }
                }
            } else {
                const query = operands;
                if (isLogicCommand(query) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isQueryCommand"])(query)) {
                    operands = query._setFieldName(this.fieldName);
                }
            }
        }
    }
    _setFieldName(fieldName) {
        const operands = this.operands.map((operand)=>{
            if (operand instanceof LogicCommand) {
                return operand._setFieldName(fieldName);
            } else {
                return operand;
            }
        });
        const command = new LogicCommand(this.operator, operands, fieldName);
        return command;
    }
    and(...__expressions__) {
        const expressions = Array.isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        expressions.unshift(this);
        return new LogicCommand(LOGIC_COMMANDS_LITERAL.AND, expressions, this.fieldName);
    }
    or(...__expressions__) {
        const expressions = Array.isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        expressions.unshift(this);
        return new LogicCommand(LOGIC_COMMANDS_LITERAL.OR, expressions, this.fieldName);
    }
}
function isLogicCommand(object) {
    return object && object instanceof LogicCommand && object._internalType === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_LOGIC_COMMAND"];
}
function isKnownLogicCommand(object) {
    return isLogicCommand && object.operator.toUpperCase() in LOGIC_COMMANDS_LITERAL;
}
const __TURBOPACK__default__export__ = LogicCommand;
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/commands/query.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ALL",
    ()=>ALL,
    "ELEM_MATCH",
    ()=>ELEM_MATCH,
    "EQ",
    ()=>EQ,
    "EXISTS",
    ()=>EXISTS,
    "GT",
    ()=>GT,
    "GTE",
    ()=>GTE,
    "IN",
    ()=>IN,
    "LT",
    ()=>LT,
    "LTE",
    ()=>LTE,
    "MOD",
    ()=>MOD,
    "NEQ",
    ()=>NEQ,
    "NIN",
    ()=>NIN,
    "QUERY_COMMANDS_LITERAL",
    ()=>QUERY_COMMANDS_LITERAL,
    "QueryCommand",
    ()=>QueryCommand,
    "SIZE",
    ()=>SIZE,
    "default",
    ()=>__TURBOPACK__default__export__,
    "isComparisonCommand",
    ()=>isComparisonCommand,
    "isKnownQueryCommand",
    ()=>isKnownQueryCommand,
    "isQueryCommand",
    ()=>isQueryCommand
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$logic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/commands/logic.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/helper/symbol.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$point$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/point.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$lineString$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/lineString.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$polygon$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/polygon.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$multiPoint$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/multiPoint.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$multiLineString$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/multiLineString.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$multiPolygon$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/multiPolygon.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/type.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
const EQ = 'eq';
const NEQ = 'neq';
const GT = 'gt';
const GTE = 'gte';
const LT = 'lt';
const LTE = 'lte';
const IN = 'in';
const NIN = 'nin';
const ALL = 'all';
const ELEM_MATCH = 'elemMatch';
const EXISTS = 'exists';
const SIZE = 'size';
const MOD = 'mod';
var QUERY_COMMANDS_LITERAL;
(function(QUERY_COMMANDS_LITERAL) {
    QUERY_COMMANDS_LITERAL["EQ"] = "eq";
    QUERY_COMMANDS_LITERAL["NEQ"] = "neq";
    QUERY_COMMANDS_LITERAL["GT"] = "gt";
    QUERY_COMMANDS_LITERAL["GTE"] = "gte";
    QUERY_COMMANDS_LITERAL["LT"] = "lt";
    QUERY_COMMANDS_LITERAL["LTE"] = "lte";
    QUERY_COMMANDS_LITERAL["IN"] = "in";
    QUERY_COMMANDS_LITERAL["NIN"] = "nin";
    QUERY_COMMANDS_LITERAL["ALL"] = "all";
    QUERY_COMMANDS_LITERAL["ELEM_MATCH"] = "elemMatch";
    QUERY_COMMANDS_LITERAL["EXISTS"] = "exists";
    QUERY_COMMANDS_LITERAL["SIZE"] = "size";
    QUERY_COMMANDS_LITERAL["MOD"] = "mod";
    QUERY_COMMANDS_LITERAL["GEO_NEAR"] = "geoNear";
    QUERY_COMMANDS_LITERAL["GEO_WITHIN"] = "geoWithin";
    QUERY_COMMANDS_LITERAL["GEO_INTERSECTS"] = "geoIntersects";
})(QUERY_COMMANDS_LITERAL || (QUERY_COMMANDS_LITERAL = {}));
class QueryCommand extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$logic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LogicCommand"] {
    constructor(operator, operands, fieldName){
        super(operator, operands, fieldName);
        this.operator = operator;
        this._internalType = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_QUERY_COMMAND"];
    }
    toJSON() {
        switch(this.operator){
            case QUERY_COMMANDS_LITERAL.IN:
            case QUERY_COMMANDS_LITERAL.NIN:
                return {
                    ['$' + this.operator]: this.operands
                };
            case QUERY_COMMANDS_LITERAL.NEQ:
                return {
                    ['$ne']: this.operands[0]
                };
            default:
                return {
                    ['$' + this.operator]: this.operands[0]
                };
        }
    }
    _setFieldName(fieldName) {
        const command = new QueryCommand(this.operator, this.operands, fieldName);
        return command;
    }
    eq(val) {
        const command = new QueryCommand(QUERY_COMMANDS_LITERAL.EQ, [
            val
        ], this.fieldName);
        return this.and(command);
    }
    neq(val) {
        const command = new QueryCommand(QUERY_COMMANDS_LITERAL.NEQ, [
            val
        ], this.fieldName);
        return this.and(command);
    }
    gt(val) {
        const command = new QueryCommand(QUERY_COMMANDS_LITERAL.GT, [
            val
        ], this.fieldName);
        return this.and(command);
    }
    gte(val) {
        const command = new QueryCommand(QUERY_COMMANDS_LITERAL.GTE, [
            val
        ], this.fieldName);
        return this.and(command);
    }
    lt(val) {
        const command = new QueryCommand(QUERY_COMMANDS_LITERAL.LT, [
            val
        ], this.fieldName);
        return this.and(command);
    }
    lte(val) {
        const command = new QueryCommand(QUERY_COMMANDS_LITERAL.LTE, [
            val
        ], this.fieldName);
        return this.and(command);
    }
    in(list) {
        const command = new QueryCommand(QUERY_COMMANDS_LITERAL.IN, list, this.fieldName);
        return this.and(command);
    }
    nin(list) {
        const command = new QueryCommand(QUERY_COMMANDS_LITERAL.NIN, list, this.fieldName);
        return this.and(command);
    }
    geoNear(val) {
        if (!(val.geometry instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$point$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Point"])) {
            throw new TypeError(`"geometry" must be of type Point. Received type ${typeof val.geometry}`);
        }
        if (val.maxDistance !== undefined && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isNumber"])(val.maxDistance)) {
            throw new TypeError(`"maxDistance" must be of type Number. Received type ${typeof val.maxDistance}`);
        }
        if (val.minDistance !== undefined && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isNumber"])(val.minDistance)) {
            throw new TypeError(`"minDistance" must be of type Number. Received type ${typeof val.minDistance}`);
        }
        const command = new QueryCommand(QUERY_COMMANDS_LITERAL.GEO_NEAR, [
            val
        ], this.fieldName);
        return this.and(command);
    }
    geoWithin(val) {
        if (!(val.geometry instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$multiPolygon$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MultiPolygon"]) && !(val.geometry instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$polygon$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Polygon"]) && !__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Validate"].isCentersPhere(val.centerSphere)) {
            throw new TypeError(`"geometry" must be of type Polygon or MultiPolygon. Received type ${typeof val.geometry}`);
        }
        const command = new QueryCommand(QUERY_COMMANDS_LITERAL.GEO_WITHIN, [
            val
        ], this.fieldName);
        return this.and(command);
    }
    geoIntersects(val) {
        if (!(val.geometry instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$point$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Point"]) && !(val.geometry instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$lineString$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LineString"]) && !(val.geometry instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$polygon$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Polygon"]) && !(val.geometry instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$multiPoint$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MultiPoint"]) && !(val.geometry instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$multiLineString$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MultiLineString"]) && !(val.geometry instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$multiPolygon$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MultiPolygon"])) {
            throw new TypeError(`"geometry" must be of type Point, LineString, Polygon, MultiPoint, MultiLineString or MultiPolygon. Received type ${typeof val.geometry}`);
        }
        const command = new QueryCommand(QUERY_COMMANDS_LITERAL.GEO_INTERSECTS, [
            val
        ], this.fieldName);
        return this.and(command);
    }
}
function isQueryCommand(object) {
    return object && object instanceof QueryCommand && object._internalType === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_QUERY_COMMAND"];
}
function isKnownQueryCommand(object) {
    return isQueryCommand(object) && object.operator.toUpperCase() in QUERY_COMMANDS_LITERAL;
}
function isComparisonCommand(object) {
    return isQueryCommand(object);
}
const __TURBOPACK__default__export__ = QueryCommand;
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/operator-map.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OperatorMap",
    ()=>OperatorMap,
    "operatorToString",
    ()=>operatorToString
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/commands/query.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$logic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/commands/logic.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/commands/update.js [app-rsc] (ecmascript)");
;
;
;
const OperatorMap = {};
for(const key in __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"]){
    OperatorMap[key] = '$' + key;
}
for(const key in __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$logic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LOGIC_COMMANDS_LITERAL"]){
    OperatorMap[key] = '$' + key;
}
for(const key in __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"]){
    OperatorMap[key] = '$' + key;
}
OperatorMap[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].NEQ] = '$ne';
OperatorMap[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].REMOVE] = '$unset';
OperatorMap[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].SHIFT] = '$pop';
OperatorMap[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].UNSHIFT] = '$push';
function operatorToString(operator) {
    return OperatorMap[operator] || '$' + operator;
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/serverDate/index.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ServerDate",
    ()=>ServerDate,
    "ServerDateConstructor",
    ()=>ServerDateConstructor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/helper/symbol.js [app-rsc] (ecmascript) <locals>");
;
class ServerDate {
    constructor({ offset = 0 } = {}){
        this.offset = offset;
    }
    get _internalType() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_SERVER_DATE"];
    }
    parse() {
        return {
            $tcb_server_date: {
                offset: this.offset
            }
        };
    }
}
function ServerDateConstructor(opt) {
    return new ServerDate(opt);
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/serializer/datatype.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deserialize",
    ()=>deserialize,
    "serialize",
    ()=>serialize
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/helper/symbol.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/type.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$point$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/point.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serverDate$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/serverDate/index.js [app-rsc] (ecmascript)");
;
;
;
;
function serialize(val) {
    return serializeHelper(val, [
        val
    ]);
}
function serializeHelper(val, visited) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isInternalObject"])(val)) {
        switch(val._internalType){
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_GEO_POINT"]:
                {
                    return val.toJSON();
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_SERVER_DATE"]:
                {
                    return val.parse();
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_REGEXP"]:
                {
                    return val.parse();
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_OBJECTID"]:
                {
                    return val.parse();
                }
            default:
                {
                    return val.toJSON ? val.toJSON() : val;
                }
        }
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isDate"])(val)) {
        return val;
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isRegExp"])(val)) {
        return {
            $regularExpression: {
                pattern: val.source,
                options: val.flags
            }
        };
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(val)) {
        return val.map((item)=>{
            if (visited.indexOf(item) > -1) {
                throw new Error('Cannot convert circular structure to JSON');
            }
            return serializeHelper(item, [
                ...visited,
                item
            ]);
        });
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isObject"])(val)) {
        const rawRet = Object.assign({}, val);
        const finalRet = {};
        for(const key in rawRet){
            if (visited.indexOf(rawRet[key]) > -1) {
                throw new Error('Cannot convert circular structure to JSON');
            }
            if (rawRet[key] !== undefined) {
                finalRet[key] = serializeHelper(rawRet[key], [
                    ...visited,
                    rawRet[key]
                ]);
            }
        }
        return finalRet;
    } else {
        return val;
    }
}
function deserialize(object) {
    const ret = Object.assign({}, object);
    for(const key in ret){
        switch(key){
            case '$date':
                {
                    switch((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getType"])(ret[key])){
                        case 'number':
                            {
                                return new Date(ret[key]);
                            }
                        case 'object':
                            {
                                return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serverDate$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ServerDate"](ret[key]);
                            }
                    }
                    break;
                }
            case 'type':
                {
                    switch(ret.type){
                        case 'Point':
                            {
                                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(ret.coordinates) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isNumber"])(ret.coordinates[0]) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isNumber"])(ret.coordinates[1])) {
                                    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$point$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Point"](ret.coordinates[0], ret.coordinates[1]);
                                }
                                break;
                            }
                    }
                    break;
                }
        }
    }
    return object;
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/serializer/common.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decodeInternalDataType",
    ()=>decodeInternalDataType,
    "encodeInternalDataType",
    ()=>encodeInternalDataType,
    "flattenObject",
    ()=>flattenObject,
    "flattenQueryObject",
    ()=>flattenQueryObject,
    "isConversionRequired",
    ()=>isConversionRequired,
    "mergeConditionAfterEncode",
    ()=>mergeConditionAfterEncode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/type.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$datatype$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/serializer/datatype.js [app-rsc] (ecmascript)");
;
;
function flatten(query, shouldPreserverObject, parents, visited) {
    const cloned = Object.assign({}, query);
    for(const key in query){
        if (/^\$/.test(key)) continue;
        const value = query[key];
        if (value === undefined) {
            delete cloned[key];
            continue;
        }
        if (!value) continue;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isObject"])(value) && !shouldPreserverObject(value)) {
            if (visited.indexOf(value) > -1) {
                throw new Error('Cannot convert circular structure to JSON');
            }
            const newParents = [
                ...parents,
                key
            ];
            const newVisited = [
                ...visited,
                value
            ];
            const flattenedChild = flatten(value, shouldPreserverObject, newParents, newVisited);
            cloned[key] = flattenedChild;
            let hasKeyNotCombined = false;
            for(const childKey in flattenedChild){
                if (!/^\$/.test(childKey)) {
                    cloned[`${key}.${childKey}`] = flattenedChild[childKey];
                    delete cloned[key][childKey];
                } else {
                    hasKeyNotCombined = true;
                }
            }
            if (!hasKeyNotCombined) {
                delete cloned[key];
            }
        }
    }
    return cloned;
}
function flattenQueryObject(query) {
    return flatten(query, isConversionRequired, [], [
        query
    ]);
}
function flattenObject(object) {
    return flatten(object, (_)=>false, [], [
        object
    ]);
}
function mergeConditionAfterEncode(query, condition, key) {
    if (!condition[key]) {
        delete query[key];
    }
    for(const conditionKey in condition){
        if (query[conditionKey]) {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(query[conditionKey])) {
                query[conditionKey].push(condition[conditionKey]);
            } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isObject"])(query[conditionKey])) {
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isObject"])(condition[conditionKey])) {
                    Object.assign(query[conditionKey], condition[conditionKey]);
                } else {
                    console.warn(`unmergable condition, query is object but condition is ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getType"])(condition)}, can only overwrite`, condition, key);
                    query[conditionKey] = condition[conditionKey];
                }
            } else {
                console.warn(`to-merge query is of type ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getType"])(query)}, can only overwrite`, query, condition, key);
                query[conditionKey] = condition[conditionKey];
            }
        } else {
            query[conditionKey] = condition[conditionKey];
        }
    }
}
function isConversionRequired(val) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isInternalObject"])(val) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isDate"])(val) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isRegExp"])(val);
}
function encodeInternalDataType(val) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$datatype$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serialize"])(val);
}
function decodeInternalDataType(object) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$datatype$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deserialize"])(object);
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/serializer/update.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UpdateSerializer",
    ()=>UpdateSerializer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/commands/update.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/helper/symbol.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/type.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$operator$2d$map$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/operator-map.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$common$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/serializer/common.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/utils.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
class UpdateSerializer {
    constructor(){}
    static encode(query) {
        const stringifier = new UpdateSerializer();
        return stringifier.encodeUpdate(query);
    }
    static encodeEJSON(query, raw) {
        const stringifier = new UpdateSerializer();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["stringifyByEJSON"])(raw ? query : stringifier.encodeUpdate(query));
    }
    encodeUpdate(query) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isUpdateCommand"])(query)) {
            return this.encodeUpdateCommand(query);
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getType"])(query) === 'object') {
            return this.encodeUpdateObject(query);
        } else {
            return query;
        }
    }
    encodeUpdateCommand(query) {
        if (query.fieldName === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_UNSET_FIELD_NAME"]) {
            throw new Error('Cannot encode a comparison command with unset field name');
        }
        switch(query.operator){
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].PUSH:
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].PULL:
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].PULL_ALL:
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].POP:
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].SHIFT:
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].UNSHIFT:
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].ADD_TO_SET:
                {
                    return this.encodeArrayUpdateCommand(query);
                }
            default:
                {
                    return this.encodeFieldUpdateCommand(query);
                }
        }
    }
    encodeFieldUpdateCommand(query) {
        const $op = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$operator$2d$map$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["operatorToString"])(query.operator);
        switch(query.operator){
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].REMOVE:
                {
                    return {
                        [$op]: {
                            [query.fieldName]: ''
                        }
                    };
                }
            default:
                {
                    return {
                        [$op]: {
                            [query.fieldName]: query.operands[0]
                        }
                    };
                }
        }
    }
    encodeArrayUpdateCommand(query) {
        const $op = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$operator$2d$map$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["operatorToString"])(query.operator);
        switch(query.operator){
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].PUSH:
                {
                    let modifiers;
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(query.operands)) {
                        modifiers = {
                            $each: query.operands.map(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$common$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encodeInternalDataType"])
                        };
                    } else {
                        modifiers = query.operands;
                    }
                    return {
                        [$op]: {
                            [query.fieldName]: modifiers
                        }
                    };
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].UNSHIFT:
                {
                    const modifiers = {
                        $each: query.operands.map(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$common$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encodeInternalDataType"]),
                        $position: 0
                    };
                    return {
                        [$op]: {
                            [query.fieldName]: modifiers
                        }
                    };
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].POP:
                {
                    return {
                        [$op]: {
                            [query.fieldName]: 1
                        }
                    };
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].SHIFT:
                {
                    return {
                        [$op]: {
                            [query.fieldName]: -1
                        }
                    };
                }
            default:
                {
                    return {
                        [$op]: {
                            [query.fieldName]: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$common$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encodeInternalDataType"])(query.operands)
                        }
                    };
                }
        }
    }
    encodeUpdateObject(query) {
        const flattened = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$common$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["flattenQueryObject"])(query);
        for(const key in flattened){
            if (/^\$/.test(key)) continue;
            let val = flattened[key];
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isUpdateCommand"])(val)) {
                flattened[key] = val._setFieldName(key);
                const condition = this.encodeUpdateCommand(flattened[key]);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$common$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["mergeConditionAfterEncode"])(flattened, condition, key);
            } else {
                flattened[key] = val = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$common$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encodeInternalDataType"])(val);
                const $setCommand = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].SET, [
                    val
                ], key);
                const condition = this.encodeUpdateCommand($setCommand);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$common$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["mergeConditionAfterEncode"])(flattened, condition, key);
            }
        }
        return flattened;
    }
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/realtime/message.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "genRequestId",
    ()=>genRequestId,
    "isInitEventMessage",
    ()=>isInitEventMessage
]);
function genRequestId(prefix = '') {
    return `${prefix ? `${prefix}_` : ''}${+new Date()}_${Math.random()}`;
}
function isInitEventMessage(msg) {
    return msg.msgType === 'INIT_EVENT';
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/config/error.config.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ERR_CODE",
    ()=>ERR_CODE
]);
const ERR_CODE = {
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    SDK_DATABASE_REALTIME_LISTENER_INIT_WATCH_FAIL: 'SDK_DATABASE_REALTIME_LISTENER_INIT_WATCH_FAIL',
    SDK_DATABASE_REALTIME_LISTENER_RECONNECT_WATCH_FAIL: 'SDK_DATABASE_REALTIME_LISTENER_RECONNECT_WATCH_FAIL',
    SDK_DATABASE_REALTIME_LISTENER_REBUILD_WATCH_FAIL: 'SDK_DATABASE_REALTIME_LISTENER_REBUILD_WATCH_FAIL',
    SDK_DATABASE_REALTIME_LISTENER_CLOSE_WATCH_FAIL: 'SDK_DATABASE_REALTIME_LISTENER_CLOSE_WATCH_FAIL',
    SDK_DATABASE_REALTIME_LISTENER_SERVER_ERROR_MSG: 'SDK_DATABASE_REALTIME_LISTENER_SERVER_ERROR_MSG',
    SDK_DATABASE_REALTIME_LISTENER_RECEIVE_INVALID_SERVER_DATA: 'SDK_DATABASE_REALTIME_LISTENER_RECEIVE_INVALID_SERVER_DATA',
    SDK_DATABASE_REALTIME_LISTENER_WEBSOCKET_CONNECTION_ERROR: 'SDK_DATABASE_REALTIME_LISTENER_WEBSOCKET_CONNECTION_ERROR',
    SDK_DATABASE_REALTIME_LISTENER_WEBSOCKET_CONNECTION_CLOSED: 'SDK_DATABASE_REALTIME_LISTENER_WEBSOCKET_CONNECTION_CLOSED',
    SDK_DATABASE_REALTIME_LISTENER_CHECK_LAST_FAIL: 'SDK_DATABASE_REALTIME_LISTENER_CHECK_LAST_FAIL',
    SDK_DATABASE_REALTIME_LISTENER_UNEXPECTED_FATAL_ERROR: 'SDK_DATABASE_REALTIME_LISTENER_UNEXPECTED_FATAL_ERROR'
};
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/error.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CancelledError",
    ()=>CancelledError,
    "CloudSDKError",
    ()=>CloudSDKError,
    "TimeoutError",
    ()=>TimeoutError,
    "isCancelledError",
    ()=>isCancelledError,
    "isGenericError",
    ()=>isGenericError,
    "isSDKError",
    ()=>isSDKError,
    "isTimeoutError",
    ()=>isTimeoutError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/type.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$config$2f$error$2e$config$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/config/error.config.js [app-rsc] (ecmascript)");
;
;
class CloudSDKError extends Error {
    constructor(options){
        super(options.errMsg);
        this.errCode = 'UNKNOWN_ERROR';
        Object.defineProperties(this, {
            message: {
                get () {
                    return `errCode: ${this.errCode} ${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$config$2f$error$2e$config$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERR_CODE"][this.errCode] || ''} | errMsg: ` + this.errMsg;
                },
                set (msg) {
                    this.errMsg = msg;
                }
            }
        });
        this.errCode = options.errCode || 'UNKNOWN_ERROR';
        this.errMsg = options.errMsg;
    }
    get message() {
        return `errCode: ${this.errCode} | errMsg: ` + this.errMsg;
    }
    set message(msg) {
        this.errMsg = msg;
    }
}
function isSDKError(error) {
    return error && error instanceof Error && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isString"])(error.errMsg);
}
const isGenericError = (e)=>e.generic;
class TimeoutError extends Error {
    constructor(message){
        super(message);
        this.type = 'timeout';
        this.payload = null;
        this.generic = true;
    }
}
const isTimeoutError = (e)=>e.type === 'timeout';
class CancelledError extends Error {
    constructor(message){
        super(message);
        this.type = 'cancelled';
        this.payload = null;
        this.generic = true;
    }
}
const isCancelledError = (e)=>e.type === 'cancelled';
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/realtime/listener.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RealtimeListener",
    ()=>RealtimeListener
]);
class RealtimeListener {
    constructor(options){
        this.close = options.close;
        this.onChange = options.onChange;
        this.onError = options.onError;
        if (options.debug) {
            Object.defineProperty(this, 'virtualClient', {
                get: ()=>{
                    return options.virtualClient;
                }
            });
        }
    }
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/realtime/snapshot.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Snapshot",
    ()=>Snapshot
]);
class Snapshot {
    constructor(options){
        const { id, docChanges, docs, msgType, type } = options;
        let cachedDocChanges;
        let cachedDocs;
        Object.defineProperties(this, {
            id: {
                get: ()=>id,
                enumerable: true
            },
            docChanges: {
                get: ()=>{
                    if (!cachedDocChanges) {
                        cachedDocChanges = JSON.parse(JSON.stringify(docChanges));
                    }
                    return cachedDocChanges;
                },
                enumerable: true
            },
            docs: {
                get: ()=>{
                    if (!cachedDocs) {
                        cachedDocs = JSON.parse(JSON.stringify(docs));
                    }
                    return cachedDocs;
                },
                enumerable: true
            },
            msgType: {
                get: ()=>msgType,
                enumerable: true
            },
            type: {
                get: ()=>type,
                enumerable: true
            }
        });
    }
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/realtime/error.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RealtimeErrorMessageError",
    ()=>RealtimeErrorMessageError,
    "isRealtimeErrorMessageError",
    ()=>isRealtimeErrorMessageError
]);
class RealtimeErrorMessageError extends Error {
    constructor(serverErrorMsg){
        super(`Watch Error ${JSON.stringify(serverErrorMsg.msgData)} (requestid: ${serverErrorMsg.requestId})`);
        this.isRealtimeErrorMessageError = true;
        this.payload = serverErrorMsg;
    }
}
const isRealtimeErrorMessageError = (e)=>e && e.isRealtimeErrorMessageError;
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/realtime/virtual-websocket-client.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VirtualWebSocketClient",
    ()=>VirtualWebSocketClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$2e$set$40$4$2e$3$2e$2$2f$node_modules$2f$lodash$2e$set$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lodash.set@4.3.2/node_modules/lodash.set/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$2e$unset$40$4$2e$5$2e$2$2f$node_modules$2f$lodash$2e$unset$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lodash.unset@4.5.2/node_modules/lodash.unset/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$2e$clonedeep$40$4$2e$5$2e$0$2f$node_modules$2f$lodash$2e$clonedeep$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lodash.clonedeep@4.5.0/node_modules/lodash.clonedeep/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$message$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/realtime/message.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$error$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/error.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$config$2f$error$2e$config$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/config/error.config.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/utils.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$listener$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/realtime/listener.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$snapshot$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/realtime/snapshot.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$error$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/realtime/error.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
var WATCH_STATUS;
(function(WATCH_STATUS) {
    WATCH_STATUS["LOGGINGIN"] = "LOGGINGIN";
    WATCH_STATUS["INITING"] = "INITING";
    WATCH_STATUS["REBUILDING"] = "REBUILDING";
    WATCH_STATUS["ACTIVE"] = "ACTIVE";
    WATCH_STATUS["ERRORED"] = "ERRORED";
    WATCH_STATUS["CLOSING"] = "CLOSING";
    WATCH_STATUS["CLOSED"] = "CLOSED";
    WATCH_STATUS["PAUSED"] = "PAUSED";
    WATCH_STATUS["RESUMING"] = "RESUMING";
})(WATCH_STATUS || (WATCH_STATUS = {}));
const DEFAULT_WAIT_TIME_ON_UNKNOWN_ERROR = 100;
const DEFAULT_MAX_AUTO_RETRY_ON_ERROR = 2;
const DEFAULT_MAX_SEND_ACK_AUTO_RETRY_ON_ERROR = 2;
const DEFAULT_SEND_ACK_DEBOUNCE_TIMEOUT = 10 * 1000;
const DEFAULT_INIT_WATCH_TIMEOUT = 10 * 1000;
const DEFAULT_REBUILD_WATCH_TIMEOUT = 10 * 1000;
class VirtualWebSocketClient {
    constructor(options){
        this.watchStatus = WATCH_STATUS.INITING;
        this._login = async (envId, refresh)=>{
            this.watchStatus = WATCH_STATUS.LOGGINGIN;
            const loginResult = await this.login(envId, refresh);
            if (!this.envId) {
                this.envId = loginResult.envId;
            }
            return loginResult;
        };
        this.initWatch = async (forceRefreshLogin)=>{
            if (this._initWatchPromise) {
                return this._initWatchPromise;
            }
            this._initWatchPromise = new Promise(async (resolve, reject)=>{
                try {
                    if (this.watchStatus === WATCH_STATUS.PAUSED) {
                        console.log('[realtime] initWatch cancelled on pause');
                        return resolve();
                    }
                    const { envId } = await this._login(this.envId, forceRefreshLogin);
                    if (this.watchStatus === WATCH_STATUS.PAUSED) {
                        console.log('[realtime] initWatch cancelled on pause');
                        return resolve();
                    }
                    this.watchStatus = WATCH_STATUS.INITING;
                    const initWatchMsg = {
                        watchId: this.watchId,
                        requestId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$message$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["genRequestId"])(),
                        msgType: 'INIT_WATCH',
                        msgData: {
                            envId,
                            collName: this.collectionName,
                            query: this.query,
                            limit: this.limit,
                            orderBy: this.orderBy
                        }
                    };
                    const initEventMsg = await this.send({
                        msg: initWatchMsg,
                        waitResponse: true,
                        skipOnMessage: true,
                        timeout: DEFAULT_INIT_WATCH_TIMEOUT
                    });
                    const { events, currEvent } = initEventMsg.msgData;
                    this.sessionInfo = {
                        queryID: initEventMsg.msgData.queryID,
                        currentEventId: currEvent - 1,
                        currentDocs: []
                    };
                    if (events.length > 0) {
                        for (const e of events){
                            e.ID = currEvent;
                        }
                        this.handleServerEvents(initEventMsg);
                    } else {
                        this.sessionInfo.currentEventId = currEvent;
                        const snapshot = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$snapshot$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Snapshot"]({
                            id: currEvent,
                            docChanges: [],
                            docs: [],
                            type: 'init'
                        });
                        this.listener.onChange(snapshot);
                        this.scheduleSendACK();
                    }
                    this.onWatchStart(this, this.sessionInfo.queryID);
                    this.watchStatus = WATCH_STATUS.ACTIVE;
                    this._availableRetries.INIT_WATCH = DEFAULT_MAX_AUTO_RETRY_ON_ERROR;
                    resolve();
                } catch (e) {
                    this.handleWatchEstablishmentError(e, {
                        operationName: 'INIT_WATCH',
                        resolve,
                        reject
                    });
                }
            });
            let success = false;
            try {
                await this._initWatchPromise;
                success = true;
            } finally{
                this._initWatchPromise = undefined;
            }
            console.log(`[realtime] initWatch ${success ? 'success' : 'fail'}`);
        };
        this.rebuildWatch = async (forceRefreshLogin)=>{
            if (this._rebuildWatchPromise) {
                return this._rebuildWatchPromise;
            }
            this._rebuildWatchPromise = new Promise(async (resolve, reject)=>{
                try {
                    if (this.watchStatus === WATCH_STATUS.PAUSED) {
                        console.log('[realtime] rebuildWatch cancelled on pause');
                        return resolve();
                    }
                    const { envId } = await this._login(this.envId, forceRefreshLogin);
                    if (!this.sessionInfo) {
                        throw new Error('can not rebuildWatch without a successful initWatch (lack of sessionInfo)');
                    }
                    if (this.watchStatus === WATCH_STATUS.PAUSED) {
                        console.log('[realtime] rebuildWatch cancelled on pause');
                        return resolve();
                    }
                    this.watchStatus = WATCH_STATUS.REBUILDING;
                    const rebuildWatchMsg = {
                        watchId: this.watchId,
                        requestId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$message$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["genRequestId"])(),
                        msgType: 'REBUILD_WATCH',
                        msgData: {
                            envId,
                            collName: this.collectionName,
                            queryID: this.sessionInfo.queryID,
                            eventID: this.sessionInfo.currentEventId
                        }
                    };
                    const nextEventMsg = await this.send({
                        msg: rebuildWatchMsg,
                        waitResponse: true,
                        skipOnMessage: false,
                        timeout: DEFAULT_REBUILD_WATCH_TIMEOUT
                    });
                    this.handleServerEvents(nextEventMsg);
                    this.watchStatus = WATCH_STATUS.ACTIVE;
                    this._availableRetries.REBUILD_WATCH = DEFAULT_MAX_AUTO_RETRY_ON_ERROR;
                    resolve();
                } catch (e) {
                    this.handleWatchEstablishmentError(e, {
                        operationName: 'REBUILD_WATCH',
                        resolve,
                        reject
                    });
                }
            });
            let success = false;
            try {
                await this._rebuildWatchPromise;
                success = true;
            } finally{
                this._rebuildWatchPromise = undefined;
            }
            console.log(`[realtime] rebuildWatch ${success ? 'success' : 'fail'}`);
        };
        this.handleWatchEstablishmentError = async (e, options)=>{
            const isInitWatch = options.operationName === 'INIT_WATCH';
            const abortWatch = ()=>{
                this.closeWithError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$error$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CloudSDKError"]({
                    errCode: isInitWatch ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$config$2f$error$2e$config$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERR_CODE"].SDK_DATABASE_REALTIME_LISTENER_INIT_WATCH_FAIL : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$config$2f$error$2e$config$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERR_CODE"].SDK_DATABASE_REALTIME_LISTENER_REBUILD_WATCH_FAIL,
                    errMsg: e
                }));
                options.reject(e);
            };
            const retry = (refreshLogin)=>{
                if (this.useRetryTicket(options.operationName)) {
                    if (isInitWatch) {
                        this._initWatchPromise = undefined;
                        options.resolve(this.initWatch(refreshLogin));
                    } else {
                        this._rebuildWatchPromise = undefined;
                        options.resolve(this.rebuildWatch(refreshLogin));
                    }
                } else {
                    abortWatch();
                }
            };
            this.handleCommonError(e, {
                onSignError: ()=>retry(true),
                onTimeoutError: ()=>retry(false),
                onNotRetryableError: abortWatch,
                onCancelledError: options.reject,
                onUnknownError: async ()=>{
                    try {
                        const onWSDisconnected = async ()=>{
                            this.pause();
                            await this.onceWSConnected();
                            retry(true);
                        };
                        if (!this.isWSConnected()) {
                            await onWSDisconnected();
                        } else {
                            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sleep"])(DEFAULT_WAIT_TIME_ON_UNKNOWN_ERROR);
                            if (this.watchStatus === WATCH_STATUS.PAUSED) {
                                options.reject(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$error$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CancelledError"](`${options.operationName} cancelled due to pause after unknownError`));
                            } else if (!this.isWSConnected()) {
                                await onWSDisconnected();
                            } else {
                                retry(false);
                            }
                        }
                    } catch (e) {
                        retry(true);
                    }
                }
            });
        };
        this.closeWatch = async ()=>{
            const queryId = this.sessionInfo ? this.sessionInfo.queryID : '';
            if (this.watchStatus !== WATCH_STATUS.ACTIVE) {
                this.watchStatus = WATCH_STATUS.CLOSED;
                this.onWatchClose(this, queryId);
                return;
            }
            try {
                this.watchStatus = WATCH_STATUS.CLOSING;
                const closeWatchMsg = {
                    watchId: this.watchId,
                    requestId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$message$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["genRequestId"])(),
                    msgType: 'CLOSE_WATCH',
                    msgData: null
                };
                await this.send({
                    msg: closeWatchMsg
                });
                this.sessionInfo = undefined;
                this.watchStatus = WATCH_STATUS.CLOSED;
            } catch (e) {
                this.closeWithError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$error$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CloudSDKError"]({
                    errCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$config$2f$error$2e$config$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERR_CODE"].SDK_DATABASE_REALTIME_LISTENER_CLOSE_WATCH_FAIL,
                    errMsg: e
                }));
            } finally{
                this.onWatchClose(this, queryId);
            }
        };
        this.scheduleSendACK = ()=>{
            this.clearACKSchedule();
            this._ackTimeoutId = setTimeout(()=>{
                if (this._waitExpectedTimeoutId) {
                    this.scheduleSendACK();
                } else {
                    this.sendACK();
                }
            }, DEFAULT_SEND_ACK_DEBOUNCE_TIMEOUT);
        };
        this.clearACKSchedule = ()=>{
            if (this._ackTimeoutId) {
                clearTimeout(this._ackTimeoutId);
            }
        };
        this.sendACK = async ()=>{
            try {
                if (this.watchStatus !== WATCH_STATUS.ACTIVE) {
                    this.scheduleSendACK();
                    return;
                }
                if (!this.sessionInfo) {
                    console.warn('[realtime listener] can not send ack without a successful initWatch (lack of sessionInfo)');
                    return;
                }
                const ackMsg = {
                    watchId: this.watchId,
                    requestId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$message$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["genRequestId"])(),
                    msgType: 'CHECK_LAST',
                    msgData: {
                        queryID: this.sessionInfo.queryID,
                        eventID: this.sessionInfo.currentEventId
                    }
                };
                await this.send({
                    msg: ackMsg
                });
                this.scheduleSendACK();
            } catch (e) {
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$error$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isRealtimeErrorMessageError"])(e)) {
                    const msg = e.payload;
                    switch(msg.msgData.code){
                        case 'CHECK_LOGIN_FAILED':
                        case 'SIGN_EXPIRED_ERROR':
                        case 'SIGN_INVALID_ERROR':
                        case 'SIGN_PARAM_INVALID':
                            {
                                this.rebuildWatch();
                                return;
                            }
                        case 'QUERYID_INVALID_ERROR':
                        case 'SYS_ERR':
                        case 'INVALIID_ENV':
                        case 'COLLECTION_PERMISSION_DENIED':
                            {
                                this.closeWithError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$error$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CloudSDKError"]({
                                    errCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$config$2f$error$2e$config$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERR_CODE"].SDK_DATABASE_REALTIME_LISTENER_CHECK_LAST_FAIL,
                                    errMsg: msg.msgData.code
                                }));
                                return;
                            }
                        default:
                            {
                                break;
                            }
                    }
                }
                if (this._availableRetries.CHECK_LAST && this._availableRetries.CHECK_LAST > 0) {
                    this._availableRetries.CHECK_LAST--;
                    this.scheduleSendACK();
                } else {
                    this.closeWithError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$error$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CloudSDKError"]({
                        errCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$config$2f$error$2e$config$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERR_CODE"].SDK_DATABASE_REALTIME_LISTENER_CHECK_LAST_FAIL,
                        errMsg: e
                    }));
                }
            }
        };
        this.handleCommonError = (e, options)=>{
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$error$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isRealtimeErrorMessageError"])(e)) {
                const msg = e.payload;
                switch(msg.msgData.code){
                    case 'CHECK_LOGIN_FAILED':
                    case 'SIGN_EXPIRED_ERROR':
                    case 'SIGN_INVALID_ERROR':
                    case 'SIGN_PARAM_INVALID':
                        {
                            options.onSignError(e);
                            return;
                        }
                    case 'QUERYID_INVALID_ERROR':
                    case 'SYS_ERR':
                    case 'INVALIID_ENV':
                    case 'COLLECTION_PERMISSION_DENIED':
                        {
                            options.onNotRetryableError(e);
                            return;
                        }
                    default:
                        {
                            options.onNotRetryableError(e);
                            return;
                        }
                }
            } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$error$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isTimeoutError"])(e)) {
                options.onTimeoutError(e);
                return;
            } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$error$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isCancelledError"])(e)) {
                options.onCancelledError(e);
                return;
            }
            options.onUnknownError(e);
        };
        this.watchId = `watchid_${+new Date()}_${Math.random()}`;
        this.envId = options.envId;
        this.collectionName = options.collectionName;
        this.query = options.query;
        this.limit = options.limit;
        this.orderBy = options.orderBy;
        this.send = options.send;
        this.login = options.login;
        this.isWSConnected = options.isWSConnected;
        this.onceWSConnected = options.onceWSConnected;
        this.getWaitExpectedTimeoutLength = options.getWaitExpectedTimeoutLength;
        this.onWatchStart = options.onWatchStart;
        this.onWatchClose = options.onWatchClose;
        this.debug = options.debug;
        this._availableRetries = {
            INIT_WATCH: DEFAULT_MAX_AUTO_RETRY_ON_ERROR,
            REBUILD_WATCH: DEFAULT_MAX_AUTO_RETRY_ON_ERROR,
            CHECK_LAST: DEFAULT_MAX_SEND_ACK_AUTO_RETRY_ON_ERROR
        };
        this.listener = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$listener$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RealtimeListener"]({
            close: this.closeWatch,
            onChange: options.onChange,
            onError: options.onError,
            debug: this.debug,
            virtualClient: this
        });
        this.initWatch();
    }
    useRetryTicket(operationName) {
        if (this._availableRetries[operationName] && this._availableRetries[operationName] > 0) {
            this._availableRetries[operationName]--;
            console.log(`[realtime] ${operationName} use a retry ticket, now only ${this._availableRetries[operationName]} retry left`);
            return true;
        }
        return false;
    }
    async handleServerEvents(msg) {
        try {
            this.scheduleSendACK();
            await this._handleServerEvents(msg);
            this._postHandleServerEventsValidityCheck(msg);
        } catch (e) {
            console.error('[realtime listener] internal non-fatal error: handle server events failed with error: ', e);
            throw e;
        }
    }
    async _handleServerEvents(msg) {
        const { requestId } = msg;
        const { events } = msg.msgData;
        const { msgType } = msg;
        if (!events.length || !this.sessionInfo) {
            return;
        }
        const sessionInfo = this.sessionInfo;
        let allChangeEvents;
        try {
            allChangeEvents = events.map(getPublicEvent);
        } catch (e) {
            this.closeWithError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$error$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CloudSDKError"]({
                errCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$config$2f$error$2e$config$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERR_CODE"].SDK_DATABASE_REALTIME_LISTENER_RECEIVE_INVALID_SERVER_DATA,
                errMsg: e
            }));
            return;
        }
        let docs = [
            ...sessionInfo.currentDocs
        ];
        let initEncountered = false;
        for(let i = 0, len = allChangeEvents.length; i < len; i++){
            const change = allChangeEvents[i];
            if (sessionInfo.currentEventId >= change.id) {
                if (!allChangeEvents[i - 1] || change.id > allChangeEvents[i - 1].id) {
                    console.warn(`[realtime] duplicate event received, cur ${sessionInfo.currentEventId} but got ${change.id}`);
                } else {
                    console.error(`[realtime listener] server non-fatal error: events out of order (the latter event's id is smaller than that of the former) (requestId ${requestId})`);
                }
                continue;
            } else if (sessionInfo.currentEventId === change.id - 1) {
                switch(change.dataType){
                    case 'update':
                        {
                            if (!change.doc) {
                                switch(change.queueType){
                                    case 'update':
                                    case 'dequeue':
                                        {
                                            const localDoc = docs.find((doc)=>doc._id === change.docId);
                                            if (localDoc) {
                                                const doc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$2e$clonedeep$40$4$2e$5$2e$0$2f$node_modules$2f$lodash$2e$clonedeep$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(localDoc);
                                                if (change.updatedFields) {
                                                    for(const fieldPath in change.updatedFields){
                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$2e$set$40$4$2e$3$2e$2$2f$node_modules$2f$lodash$2e$set$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(doc, fieldPath, change.updatedFields[fieldPath]);
                                                    }
                                                }
                                                if (change.removedFields) {
                                                    for (const fieldPath of change.removedFields){
                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$2e$unset$40$4$2e$5$2e$2$2f$node_modules$2f$lodash$2e$unset$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(doc, fieldPath);
                                                    }
                                                }
                                                change.doc = doc;
                                            } else {
                                                console.error('[realtime listener] internal non-fatal server error: unexpected update dataType event where no doc is associated.');
                                            }
                                            break;
                                        }
                                    case 'enqueue':
                                        {
                                            const err = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$error$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CloudSDKError"]({
                                                errCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$config$2f$error$2e$config$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERR_CODE"].SDK_DATABASE_REALTIME_LISTENER_UNEXPECTED_FATAL_ERROR,
                                                errMsg: `HandleServerEvents: full doc is not provided with dataType="update" and queueType="enqueue" (requestId ${msg.requestId})`
                                            });
                                            this.closeWithError(err);
                                            throw err;
                                        }
                                    default:
                                        {
                                            break;
                                        }
                                }
                            }
                            break;
                        }
                    case 'replace':
                        {
                            if (!change.doc) {
                                const err = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$error$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CloudSDKError"]({
                                    errCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$config$2f$error$2e$config$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERR_CODE"].SDK_DATABASE_REALTIME_LISTENER_UNEXPECTED_FATAL_ERROR,
                                    errMsg: `HandleServerEvents: full doc is not provided with dataType="replace" (requestId ${msg.requestId})`
                                });
                                this.closeWithError(err);
                                throw err;
                            }
                            break;
                        }
                    case 'remove':
                        {
                            const doc = docs.find((doc)=>doc._id === change.docId);
                            if (doc) {
                                change.doc = doc;
                            } else {
                                console.error('[realtime listener] internal non-fatal server error: unexpected remove event where no doc is associated.');
                            }
                            break;
                        }
                    case 'limit':
                        {
                            if (!change.doc) {
                                switch(change.queueType){
                                    case 'dequeue':
                                        {
                                            const doc = docs.find((doc)=>doc._id === change.docId);
                                            if (doc) {
                                                change.doc = doc;
                                            } else {
                                                console.error('[realtime listener] internal non-fatal server error: unexpected limit dataType event where no doc is associated.');
                                            }
                                            break;
                                        }
                                    case 'enqueue':
                                        {
                                            const err = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$error$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CloudSDKError"]({
                                                errCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$config$2f$error$2e$config$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERR_CODE"].SDK_DATABASE_REALTIME_LISTENER_UNEXPECTED_FATAL_ERROR,
                                                errMsg: `HandleServerEvents: full doc is not provided with dataType="limit" and queueType="enqueue" (requestId ${msg.requestId})`
                                            });
                                            this.closeWithError(err);
                                            throw err;
                                        }
                                    default:
                                        {
                                            break;
                                        }
                                }
                            }
                            break;
                        }
                }
                switch(change.queueType){
                    case 'init':
                        {
                            if (!initEncountered) {
                                initEncountered = true;
                                docs = [
                                    change.doc
                                ];
                            } else {
                                docs.push(change.doc);
                            }
                            break;
                        }
                    case 'enqueue':
                        {
                            docs.push(change.doc);
                            break;
                        }
                    case 'dequeue':
                        {
                            const ind = docs.findIndex((doc)=>doc._id === change.docId);
                            if (ind > -1) {
                                docs.splice(ind, 1);
                            } else {
                                console.error('[realtime listener] internal non-fatal server error: unexpected dequeue event where no doc is associated.');
                            }
                            break;
                        }
                    case 'update':
                        {
                            const ind = docs.findIndex((doc)=>doc._id === change.docId);
                            if (ind > -1) {
                                docs[ind] = change.doc;
                            } else {
                                console.error('[realtime listener] internal non-fatal server error: unexpected queueType update event where no doc is associated.');
                            }
                            break;
                        }
                }
                if (i === len - 1 || allChangeEvents[i + 1] && allChangeEvents[i + 1].id !== change.id) {
                    const docsSnapshot = [
                        ...docs
                    ];
                    const docChanges = allChangeEvents.slice(0, i + 1).filter((c)=>c.id === change.id);
                    this.sessionInfo.currentEventId = change.id;
                    this.sessionInfo.currentDocs = docs;
                    const snapshot = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$snapshot$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Snapshot"]({
                        id: change.id,
                        docChanges,
                        docs: docsSnapshot,
                        msgType
                    });
                    this.listener.onChange(snapshot);
                }
            } else {
                console.warn(`[realtime listener] event received is out of order, cur ${this.sessionInfo.currentEventId} but got ${change.id}`);
                await this.rebuildWatch();
                return;
            }
        }
    }
    _postHandleServerEventsValidityCheck(msg) {
        if (!this.sessionInfo) {
            console.error('[realtime listener] internal non-fatal error: sessionInfo lost after server event handling, this should never occur');
            return;
        }
        if (this.sessionInfo.expectEventId && this.sessionInfo.currentEventId >= this.sessionInfo.expectEventId) {
            this.clearWaitExpectedEvent();
        }
        if (this.sessionInfo.currentEventId < msg.msgData.currEvent) {
            console.warn('[realtime listener] internal non-fatal error: client eventId does not match with server event id after server event handling');
            return;
        }
    }
    clearWaitExpectedEvent() {
        if (this._waitExpectedTimeoutId) {
            clearTimeout(this._waitExpectedTimeoutId);
            this._waitExpectedTimeoutId = undefined;
        }
    }
    onMessage(msg) {
        switch(this.watchStatus){
            case WATCH_STATUS.PAUSED:
                {
                    if (msg.msgType !== 'ERROR') {
                        return;
                    }
                    break;
                }
            case WATCH_STATUS.LOGGINGIN:
            case WATCH_STATUS.INITING:
            case WATCH_STATUS.REBUILDING:
                {
                    console.warn(`[realtime listener] internal non-fatal error: unexpected message received while ${this.watchStatus}`);
                    return;
                }
            case WATCH_STATUS.CLOSED:
                {
                    console.warn('[realtime listener] internal non-fatal error: unexpected message received when the watch has closed');
                    return;
                }
            case WATCH_STATUS.ERRORED:
                {
                    console.warn('[realtime listener] internal non-fatal error: unexpected message received when the watch has ended with error');
                    return;
                }
        }
        if (!this.sessionInfo) {
            console.warn('[realtime listener] internal non-fatal error: sessionInfo not found while message is received.');
            return;
        }
        this.scheduleSendACK();
        switch(msg.msgType){
            case 'NEXT_EVENT':
                {
                    console.warn(`nextevent ${msg.msgData.currEvent} ignored`, msg);
                    this.handleServerEvents(msg);
                    break;
                }
            case 'CHECK_EVENT':
                {
                    if (this.sessionInfo.currentEventId < msg.msgData.currEvent) {
                        this.sessionInfo.expectEventId = msg.msgData.currEvent;
                        this.clearWaitExpectedEvent();
                        this._waitExpectedTimeoutId = setTimeout(()=>{
                            this.rebuildWatch();
                        }, this.getWaitExpectedTimeoutLength());
                        console.log(`[realtime] waitExpectedTimeoutLength ${this.getWaitExpectedTimeoutLength()}`);
                    }
                    break;
                }
            case 'ERROR':
                {
                    this.closeWithError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$error$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CloudSDKError"]({
                        errCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$config$2f$error$2e$config$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERR_CODE"].SDK_DATABASE_REALTIME_LISTENER_SERVER_ERROR_MSG,
                        errMsg: `${msg.msgData.code} - ${msg.msgData.message}`
                    }));
                    break;
                }
            default:
                {
                    console.warn(`[realtime listener] virtual client receive unexpected msg ${msg.msgType}: `, msg);
                    break;
                }
        }
    }
    closeWithError(error) {
        this.watchStatus = WATCH_STATUS.ERRORED;
        this.clearACKSchedule();
        this.listener.onError(error);
        this.onWatchClose(this, this.sessionInfo && this.sessionInfo.queryID || '');
        console.log(`[realtime] client closed (${this.collectionName} ${this.query}) (watchId ${this.watchId})`);
    }
    pause() {
        this.watchStatus = WATCH_STATUS.PAUSED;
        console.log(`[realtime] client paused (${this.collectionName} ${this.query}) (watchId ${this.watchId})`);
    }
    async resume() {
        this.watchStatus = WATCH_STATUS.RESUMING;
        console.log(`[realtime] client resuming with ${this.sessionInfo ? 'REBUILD_WATCH' : 'INIT_WATCH'} (${this.collectionName} ${this.query}) (${this.watchId})`);
        try {
            await (this.sessionInfo ? this.rebuildWatch() : this.initWatch());
            console.log(`[realtime] client successfully resumed (${this.collectionName} ${this.query}) (${this.watchId})`);
        } catch (e) {
            console.error(`[realtime] client resume failed (${this.collectionName} ${this.query}) (${this.watchId})`, e);
        }
    }
}
function getPublicEvent(event) {
    const e = {
        id: event.ID,
        dataType: event.DataType,
        queueType: event.QueueType,
        docId: event.DocID,
        doc: event.Doc && event.Doc !== '{}' ? JSON.parse(event.Doc) : undefined
    };
    if (event.DataType === 'update') {
        if (event.UpdatedFields) {
            e.updatedFields = JSON.parse(event.UpdatedFields);
        }
        if (event.removedFields || event.RemovedFields) {
            e.removedFields = JSON.parse(event.removedFields);
        }
    }
    return e;
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/realtime/ws-event.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CLOSE_EVENT_CODE",
    ()=>CLOSE_EVENT_CODE,
    "CLOSE_EVENT_CODE_INFO",
    ()=>CLOSE_EVENT_CODE_INFO,
    "getWSCloseError",
    ()=>getWSCloseError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$error$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/error.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$config$2f$error$2e$config$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/config/error.config.js [app-rsc] (ecmascript)");
;
;
const CLOSE_EVENT_CODE_INFO = {
    1000: {
        code: 1000,
        name: 'Normal Closure',
        description: 'Normal closure; the connection successfully completed whatever purpose for which it was created.'
    },
    1001: {
        code: 1001,
        name: 'Going Away',
        description: 'The endpoint is going away, either because of a server failure or because the browser is navigating away from the page that opened the connection.'
    },
    1002: {
        code: 1002,
        name: 'Protocol Error',
        description: 'The endpoint is terminating the connection due to a protocol error.'
    },
    1003: {
        code: 1003,
        name: 'Unsupported Data',
        description: 'The connection is being terminated because the endpoint received data of a type it cannot accept (for example, a text-only endpoint received binary data).'
    },
    1005: {
        code: 1005,
        name: 'No Status Received',
        description: 'Indicates that no status code was provided even though one was expected.'
    },
    1006: {
        code: 1006,
        name: 'Abnormal Closure',
        description: 'Used to indicate that a connection was closed abnormally (that is, with no close frame being sent) when a status code is expected.'
    },
    1007: {
        code: 1007,
        name: 'Invalid frame payload data',
        description: 'The endpoint is terminating the connection because a message was received that contained inconsistent data (e.g., non-UTF-8 data within a text message).'
    },
    1008: {
        code: 1008,
        name: 'Policy Violation',
        description: 'The endpoint is terminating the connection because it received a message that violates its policy. This is a generic status code, used when codes 1003 and 1009 are not suitable.'
    },
    1009: {
        code: 1009,
        name: 'Message too big',
        description: 'The endpoint is terminating the connection because a data frame was received that is too large.'
    },
    1010: {
        code: 1010,
        name: 'Missing Extension',
        description: "The client is terminating the connection because it expected the server to negotiate one or more extension, but the server didn't."
    },
    1011: {
        code: 1011,
        name: 'Internal Error',
        description: 'The server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.'
    },
    1012: {
        code: 1012,
        name: 'Service Restart',
        description: 'The server is terminating the connection because it is restarting.'
    },
    1013: {
        code: 1013,
        name: 'Try Again Later',
        description: 'The server is terminating the connection due to a temporary condition, e.g. it is overloaded and is casting off some of its clients.'
    },
    1014: {
        code: 1014,
        name: 'Bad Gateway',
        description: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server. This is similar to 502 HTTP Status Code.'
    },
    1015: {
        code: 1015,
        name: 'TLS Handshake',
        description: "Indicates that the connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified)."
    },
    3000: {
        code: 3000,
        name: 'Reconnect WebSocket',
        description: 'The client is terminating the connection because it wants to reconnect'
    },
    3001: {
        code: 3001,
        name: 'No Realtime Listeners',
        description: 'The client is terminating the connection because no more realtime listeners exist'
    },
    3002: {
        code: 3002,
        name: 'Heartbeat Ping Error',
        description: 'The client is terminating the connection due to its failure in sending heartbeat messages'
    },
    3003: {
        code: 3003,
        name: 'Heartbeat Pong Timeout Error',
        description: 'The client is terminating the connection because no heartbeat response is received from the server'
    },
    3050: {
        code: 3050,
        name: 'Server Close',
        description: 'The client is terminating the connection because no heartbeat response is received from the server'
    }
};
var CLOSE_EVENT_CODE;
(function(CLOSE_EVENT_CODE) {
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["NormalClosure"] = 1000] = "NormalClosure";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["GoingAway"] = 1001] = "GoingAway";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["ProtocolError"] = 1002] = "ProtocolError";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["UnsupportedData"] = 1003] = "UnsupportedData";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["NoStatusReceived"] = 1005] = "NoStatusReceived";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["AbnormalClosure"] = 1006] = "AbnormalClosure";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["InvalidFramePayloadData"] = 1007] = "InvalidFramePayloadData";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["PolicyViolation"] = 1008] = "PolicyViolation";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["MessageTooBig"] = 1009] = "MessageTooBig";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["MissingExtension"] = 1010] = "MissingExtension";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["InternalError"] = 1011] = "InternalError";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["ServiceRestart"] = 1012] = "ServiceRestart";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["TryAgainLater"] = 1013] = "TryAgainLater";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["BadGateway"] = 1014] = "BadGateway";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["TLSHandshake"] = 1015] = "TLSHandshake";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["ReconnectWebSocket"] = 3000] = "ReconnectWebSocket";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["NoRealtimeListeners"] = 3001] = "NoRealtimeListeners";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["HeartbeatPingError"] = 3002] = "HeartbeatPingError";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["HeartbeatPongTimeoutError"] = 3003] = "HeartbeatPongTimeoutError";
    CLOSE_EVENT_CODE[CLOSE_EVENT_CODE["NoAuthentication"] = 3050] = "NoAuthentication";
})(CLOSE_EVENT_CODE || (CLOSE_EVENT_CODE = {}));
const getWSCloseError = (code, reason)=>{
    const info = CLOSE_EVENT_CODE_INFO[code];
    const errMsg = !info ? `code ${code}` : `${info.name}, code ${code}, reason ${reason || info.description}`;
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$error$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CloudSDKError"]({
        errCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$config$2f$error$2e$config$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERR_CODE"].SDK_DATABASE_REALTIME_LISTENER_WEBSOCKET_CONNECTION_CLOSED,
        errMsg
    });
};
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/realtime/websocket-client.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RealtimeWebSocketClient",
    ()=>RealtimeWebSocketClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$virtual$2d$websocket$2d$client$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/realtime/virtual-websocket-client.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/utils.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$message$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/realtime/message.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$ws$2d$event$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/realtime/ws-event.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$error$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/error.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$error$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/realtime/error.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$config$2f$error$2e$config$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/config/error.config.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/index.js [app-rsc] (ecmascript) <locals>");
;
;
;
;
;
;
;
;
const WS_READY_STATE = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3
};
const MAX_RTT_OBSERVED = 3;
const DEFAULT_EXPECTED_EVENT_WAIT_TIME = 5000;
const DEFAULT_UNTRUSTED_RTT_THRESHOLD = 10000;
const DEFAULT_MAX_RECONNECT = 5;
const DEFAULT_WS_RECONNECT_INTERVAL = 10000;
const DEFAULT_PING_FAIL_TOLERANCE = 2;
const DEFAULT_PONG_MISS_TOLERANCE = 2;
const DEFAULT_LOGIN_TIMEOUT = 5000;
class RealtimeWebSocketClient {
    constructor(options){
        this._virtualWSClient = new Set();
        this._queryIdClientMap = new Map();
        this._watchIdClientMap = new Map();
        this._pingFailed = 0;
        this._pongMissed = 0;
        this._logins = new Map();
        this._wsReadySubsribers = [];
        this._wsResponseWait = new Map();
        this._rttObserved = [];
        this.initWebSocketConnection = async (reconnect, availableRetries = this._maxReconnect)=>{
            if (reconnect && this._reconnectState) {
                return;
            }
            if (reconnect) {
                this._reconnectState = true;
            }
            if (this._wsInitPromise) {
                return this._wsInitPromise;
            }
            if (reconnect) {
                this.pauseClients();
            }
            this.close(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$ws$2d$event$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CLOSE_EVENT_CODE"].ReconnectWebSocket);
            this._wsInitPromise = new Promise(async (resolve, reject)=>{
                try {
                    const wsSign = await this.getWsSign();
                    await new Promise((success)=>{
                        const url = wsSign.wsUrl || 'wss://tcb-ws.tencentcloudapi.com';
                        this._ws = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Db"].wsClass ? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Db"].wsClass(url) : new WebSocket(url);
                        success();
                    });
                    if (this._ws.connect) {
                        await this._ws.connect();
                    }
                    await this.initWebSocketEvent();
                    resolve();
                    if (reconnect) {
                        this.resumeClients();
                        this._reconnectState = false;
                    }
                } catch (e) {
                    console.error('[realtime] initWebSocketConnection connect fail', e);
                    if (availableRetries > 0) {
                        const isConnected = true;
                        this._wsInitPromise = undefined;
                        if ("TURBOPACK compile-time truthy", 1) {
                            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sleep"])(this._reconnectInterval);
                            if (reconnect) {
                                this._reconnectState = false;
                            }
                        }
                        resolve(this.initWebSocketConnection(reconnect, availableRetries - 1));
                    } else {
                        reject(e);
                        if (reconnect) {
                            this.closeAllClients(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$error$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CloudSDKError"]({
                                errCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$config$2f$error$2e$config$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERR_CODE"].SDK_DATABASE_REALTIME_LISTENER_RECONNECT_WATCH_FAIL,
                                errMsg: e
                            }));
                        }
                    }
                }
            });
            try {
                await this._wsInitPromise;
                this._wsReadySubsribers.forEach(({ resolve })=>resolve());
            } catch (e) {
                this._wsReadySubsribers.forEach(({ reject })=>reject());
            } finally{
                this._wsInitPromise = undefined;
                this._wsReadySubsribers = [];
            }
        };
        this.initWebSocketEvent = ()=>new Promise((resolve, reject)=>{
                if (!this._ws) {
                    throw new Error('can not initWebSocketEvent, ws not exists');
                }
                let wsOpened = false;
                this._ws.onopen = (event)=>{
                    console.warn('[realtime] ws event: open', event);
                    wsOpened = true;
                    resolve();
                };
                this._ws.onerror = (event)=>{
                    this._logins = new Map();
                    if (!wsOpened) {
                        console.error('[realtime] ws open failed with ws event: error', event);
                        reject(event);
                    } else {
                        console.error('[realtime] ws event: error', event);
                        this.clearHeartbeat();
                        this._virtualWSClient.forEach((client)=>client.closeWithError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$error$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CloudSDKError"]({
                                errCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$config$2f$error$2e$config$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERR_CODE"].SDK_DATABASE_REALTIME_LISTENER_WEBSOCKET_CONNECTION_ERROR,
                                errMsg: event
                            })));
                    }
                };
                this._ws.onclose = (closeEvent)=>{
                    console.warn('[realtime] ws event: close', closeEvent);
                    this._logins = new Map();
                    this.clearHeartbeat();
                    switch(closeEvent.code){
                        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$ws$2d$event$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CLOSE_EVENT_CODE"].ReconnectWebSocket:
                            {
                                break;
                            }
                        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$ws$2d$event$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CLOSE_EVENT_CODE"].NoRealtimeListeners:
                            {
                                break;
                            }
                        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$ws$2d$event$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CLOSE_EVENT_CODE"].HeartbeatPingError:
                        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$ws$2d$event$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CLOSE_EVENT_CODE"].HeartbeatPongTimeoutError:
                        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$ws$2d$event$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CLOSE_EVENT_CODE"].NormalClosure:
                        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$ws$2d$event$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CLOSE_EVENT_CODE"].AbnormalClosure:
                            {
                                if (this._maxReconnect > 0) {
                                    this.initWebSocketConnection(true, this._maxReconnect);
                                } else {
                                    this.closeAllClients((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$ws$2d$event$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWSCloseError"])(closeEvent.code));
                                }
                                break;
                            }
                        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$ws$2d$event$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CLOSE_EVENT_CODE"].NoAuthentication:
                            {
                                this.closeAllClients((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$ws$2d$event$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWSCloseError"])(closeEvent.code, closeEvent.reason));
                                break;
                            }
                        default:
                            {
                                if (this._maxReconnect > 0) {
                                    this.initWebSocketConnection(true, this._maxReconnect);
                                } else {
                                    this.closeAllClients((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$ws$2d$event$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWSCloseError"])(closeEvent.code));
                                }
                            }
                    }
                };
                this._ws.onmessage = (res)=>{
                    const rawMsg = res.data;
                    this.heartbeat();
                    let msg;
                    try {
                        msg = JSON.parse(rawMsg);
                    } catch (e) {
                        throw new Error(`[realtime] onMessage parse res.data error: ${e}`);
                    }
                    if (msg.msgType === 'ERROR') {
                        let virtualWatch = null;
                        this._virtualWSClient.forEach((item)=>{
                            if (item.watchId === msg.watchId) {
                                virtualWatch = item;
                            }
                        });
                        if (virtualWatch) {
                            virtualWatch.listener.onError(msg);
                        }
                    }
                    const responseWaitSpec = this._wsResponseWait.get(msg.requestId);
                    if (responseWaitSpec) {
                        try {
                            if (msg.msgType === 'ERROR') {
                                responseWaitSpec.reject(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$error$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RealtimeErrorMessageError"](msg));
                            } else {
                                responseWaitSpec.resolve(msg);
                            }
                        } catch (e) {
                            console.error('ws onMessage responseWaitSpec.resolve(msg) errored:', e);
                        } finally{
                            this._wsResponseWait.delete(msg.requestId);
                        }
                        if (responseWaitSpec.skipOnMessage) {
                            return;
                        }
                    }
                    if (msg.msgType === 'PONG') {
                        if (this._lastPingSendTS) {
                            const rtt = Date.now() - this._lastPingSendTS;
                            if (rtt > DEFAULT_UNTRUSTED_RTT_THRESHOLD) {
                                console.warn(`[realtime] untrusted rtt observed: ${rtt}`);
                                return;
                            }
                            if (this._rttObserved.length >= MAX_RTT_OBSERVED) {
                                this._rttObserved.splice(0, this._rttObserved.length - MAX_RTT_OBSERVED + 1);
                            }
                            this._rttObserved.push(rtt);
                        }
                        return;
                    }
                    let client = msg.watchId && this._watchIdClientMap.get(msg.watchId);
                    if (client) {
                        client.onMessage(msg);
                    } else {
                        console.error(`[realtime] no realtime listener found responsible for watchId ${msg.watchId}: `, msg);
                        switch(msg.msgType){
                            case 'INIT_EVENT':
                            case 'NEXT_EVENT':
                            case 'CHECK_EVENT':
                                {
                                    client = this._queryIdClientMap.get(msg.msgData.queryID);
                                    if (client) {
                                        client.onMessage(msg);
                                    }
                                    break;
                                }
                            default:
                                {
                                    for (const [, client] of this._watchIdClientMap){
                                        client.onMessage(msg);
                                        break;
                                    }
                                }
                        }
                    }
                };
                this.heartbeat();
            });
        this.isWSConnected = ()=>{
            return Boolean(this._ws && this._ws.readyState === WS_READY_STATE.OPEN);
        };
        this.onceWSConnected = async ()=>{
            if (this.isWSConnected()) {
                return;
            }
            if (this._wsInitPromise) {
                return this._wsInitPromise;
            }
            return new Promise((resolve, reject)=>{
                this._wsReadySubsribers.push({
                    resolve,
                    reject
                });
            });
        };
        this.webLogin = async (envId, refresh)=>{
            if (!refresh) {
                if (envId) {
                    const loginInfo = this._logins.get(envId);
                    if (loginInfo) {
                        if (loginInfo.loggedIn && loginInfo.loginResult) {
                            return loginInfo.loginResult;
                        } else if (loginInfo.loggingInPromise) {
                            return loginInfo.loggingInPromise;
                        }
                    }
                } else {
                    const emptyEnvLoginInfo = this._logins.get('');
                    if (emptyEnvLoginInfo && emptyEnvLoginInfo.loggingInPromise) {
                        return emptyEnvLoginInfo.loggingInPromise;
                    }
                }
            }
            const promise = new Promise(async (resolve, reject)=>{
                try {
                    const wsSign = await this.getWsSign();
                    const msgData = {
                        envId: wsSign.envId || '',
                        accessToken: '',
                        referrer: 'web',
                        sdkVersion: '',
                        dataVersion: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Db"].dataVersion || ''
                    };
                    const loginMsg = {
                        watchId: undefined,
                        requestId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$message$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["genRequestId"])(),
                        msgType: 'LOGIN',
                        msgData,
                        exMsgData: {
                            runtime: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Db"].runtime,
                            signStr: wsSign.signStr,
                            secretVersion: wsSign.secretVersion
                        }
                    };
                    const loginResMsg = await this.send({
                        msg: loginMsg,
                        waitResponse: true,
                        skipOnMessage: true,
                        timeout: DEFAULT_LOGIN_TIMEOUT
                    });
                    if (!loginResMsg.msgData.code) {
                        resolve({
                            envId: wsSign.envId
                        });
                    } else {
                        reject(new Error(`${loginResMsg.msgData.code} ${loginResMsg.msgData.message}`));
                    }
                } catch (e) {
                    reject(e);
                }
            });
            let loginInfo = envId && this._logins.get(envId);
            const loginStartTS = Date.now();
            if (loginInfo) {
                loginInfo.loggedIn = false;
                loginInfo.loggingInPromise = promise;
                loginInfo.loginStartTS = loginStartTS;
            } else {
                loginInfo = {
                    loggedIn: false,
                    loggingInPromise: promise,
                    loginStartTS
                };
                this._logins.set(envId || '', loginInfo);
            }
            try {
                const loginResult = await promise;
                const curLoginInfo = envId && this._logins.get(envId);
                if (curLoginInfo && curLoginInfo === loginInfo && curLoginInfo.loginStartTS === loginStartTS) {
                    loginInfo.loggedIn = true;
                    loginInfo.loggingInPromise = undefined;
                    loginInfo.loginStartTS = undefined;
                    loginInfo.loginResult = loginResult;
                    return loginResult;
                } else if (curLoginInfo) {
                    if (curLoginInfo.loggedIn && curLoginInfo.loginResult) {
                        return curLoginInfo.loginResult;
                    } else if (curLoginInfo.loggingInPromise) {
                        return curLoginInfo.loggingInPromise;
                    } else {
                        throw new Error('ws unexpected login info');
                    }
                } else {
                    throw new Error('ws login info reset');
                }
            } catch (e) {
                loginInfo.loggedIn = false;
                loginInfo.loggingInPromise = undefined;
                loginInfo.loginStartTS = undefined;
                loginInfo.loginResult = undefined;
                throw e;
            }
        };
        this.getWsSign = async ()=>{
            if (this._wsSign && this._wsSign.expiredTs > Date.now()) {
                return this._wsSign;
            }
            const expiredTs = Date.now() + 60000;
            const res = await this._context.appConfig.request.send('auth.wsWebSign', {
                runtime: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Db"].runtime
            });
            if (res.code) {
                throw new Error(`[tcb-js-sdk] 获取实时数据推送登录票据失败: ${res.code}`);
            }
            if (res.data) {
                const { signStr, wsUrl, secretVersion, envId } = res.data;
                return {
                    signStr,
                    wsUrl,
                    secretVersion,
                    envId,
                    expiredTs
                };
            } else {
                throw new Error('[tcb-js-sdk] 获取实时数据推送登录票据失败');
            }
        };
        this.getWaitExpectedTimeoutLength = ()=>{
            if (!this._rttObserved.length) {
                return DEFAULT_EXPECTED_EVENT_WAIT_TIME;
            }
            return this._rttObserved.reduce((acc, cur)=>acc + cur) / this._rttObserved.length * 1.5;
        };
        this.ping = async ()=>{
            const msg = {
                watchId: undefined,
                requestId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$message$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["genRequestId"])(),
                msgType: 'PING',
                msgData: null
            };
            await this.send({
                msg
            });
        };
        this.send = async (opts)=>new Promise(async (_resolve, _reject)=>{
                let timeoutId;
                let _hasResolved = false;
                let _hasRejected = false;
                const resolve = (value)=>{
                    _hasResolved = true;
                    timeoutId && clearTimeout(timeoutId);
                    _resolve(value);
                };
                const reject = (error)=>{
                    _hasRejected = true;
                    timeoutId && clearTimeout(timeoutId);
                    _reject(error);
                };
                if (opts.timeout) {
                    timeoutId = setTimeout(async ()=>{
                        if (!_hasResolved || !_hasRejected) {
                            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sleep"])(0);
                            if (!_hasResolved || !_hasRejected) {
                                reject(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$error$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TimeoutError"]('wsclient.send timedout'));
                            }
                        }
                    }, opts.timeout);
                }
                try {
                    if (this._wsInitPromise) {
                        await this._wsInitPromise;
                    }
                    if (!this._ws) {
                        reject(new Error('invalid state: ws connection not exists, can not send message'));
                        return;
                    }
                    if (this._ws.readyState !== WS_READY_STATE.OPEN) {
                        reject(new Error(`ws readyState invalid: ${this._ws.readyState}, can not send message`));
                        return;
                    }
                    if (opts.waitResponse) {
                        this._wsResponseWait.set(opts.msg.requestId, {
                            resolve,
                            reject,
                            skipOnMessage: opts.skipOnMessage
                        });
                    }
                    try {
                        await this._ws.send(JSON.stringify(opts.msg));
                        if (!opts.waitResponse) {
                            resolve();
                        }
                    } catch (err) {
                        if (err) {
                            reject(err);
                            if (opts.waitResponse) {
                                this._wsResponseWait.delete(opts.msg.requestId);
                            }
                        }
                    }
                } catch (e) {
                    reject(e);
                }
            });
        this.closeAllClients = (error)=>{
            this._virtualWSClient.forEach((client)=>{
                client.closeWithError(error);
            });
        };
        this.pauseClients = (clients)=>{
            ;
            (clients || this._virtualWSClient).forEach((client)=>{
                client.pause();
            });
        };
        this.resumeClients = (clients)=>{
            ;
            (clients || this._virtualWSClient).forEach((client)=>{
                client.resume();
            });
        };
        this.onWatchStart = (client, queryID)=>{
            this._queryIdClientMap.set(queryID, client);
        };
        this.onWatchClose = (client, queryID)=>{
            if (queryID) {
                this._queryIdClientMap.delete(queryID);
            }
            this._watchIdClientMap.delete(client.watchId);
            this._virtualWSClient.delete(client);
            if (!this._virtualWSClient.size) {
                this.close(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$ws$2d$event$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CLOSE_EVENT_CODE"].NoRealtimeListeners);
            }
        };
        this._maxReconnect = options.maxReconnect || DEFAULT_MAX_RECONNECT;
        this._reconnectInterval = options.reconnectInterval || DEFAULT_WS_RECONNECT_INTERVAL;
        this._context = options.context;
    }
    heartbeat(immediate) {
        this.clearHeartbeat();
        this._pingTimeoutId = setTimeout(async ()=>{
            try {
                if (!this._ws || this._ws.readyState !== WS_READY_STATE.OPEN) {
                    return;
                }
                this._lastPingSendTS = Date.now();
                await this.ping();
                this._pingFailed = 0;
                this._pongTimeoutId = setTimeout(()=>{
                    console.error('pong timed out');
                    if (this._pongMissed < DEFAULT_PONG_MISS_TOLERANCE) {
                        this._pongMissed++;
                        this.heartbeat(true);
                    } else {
                        this.initWebSocketConnection(true);
                    }
                }, this._context.appConfig.realtimePongWaitTimeout);
            } catch (e) {
                if (this._pingFailed < DEFAULT_PING_FAIL_TOLERANCE) {
                    this._pingFailed++;
                    this.heartbeat();
                } else {
                    this.close(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$ws$2d$event$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CLOSE_EVENT_CODE"].HeartbeatPingError);
                }
            }
        }, immediate ? 0 : this._context.appConfig.realtimePingInterval);
    }
    clearHeartbeat() {
        this._pingTimeoutId && clearTimeout(this._pingTimeoutId);
        this._pongTimeoutId && clearTimeout(this._pongTimeoutId);
    }
    close(code) {
        this.clearHeartbeat();
        if (this._ws) {
            this._ws.close(code, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$ws$2d$event$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CLOSE_EVENT_CODE_INFO"][code].name);
            this._ws = undefined;
        }
    }
    watch(options) {
        if (!this._ws && !this._wsInitPromise) {
            this.initWebSocketConnection(false);
        }
        const virtualClient = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$virtual$2d$websocket$2d$client$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VirtualWebSocketClient"](Object.assign(Object.assign({}, options), {
            send: this.send,
            login: this.webLogin,
            isWSConnected: this.isWSConnected,
            onceWSConnected: this.onceWSConnected,
            getWaitExpectedTimeoutLength: this.getWaitExpectedTimeoutLength,
            onWatchStart: this.onWatchStart,
            onWatchClose: this.onWatchClose,
            debug: true
        }));
        this._virtualWSClient.add(virtualClient);
        this._watchIdClientMap.set(virtualClient.watchId, virtualClient);
        return virtualClient.listener;
    }
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/document.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DocumentReference",
    ()=>DocumentReference
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$util$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/util.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/serializer/update.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$datatype$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/serializer/datatype.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/commands/update.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$websocket$2d$client$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/realtime/websocket-client.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/constant.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/utils.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$const$2f$code$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/const/code.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bson$40$4$2e$7$2e$2$2f$node_modules$2f$bson$2f$dist$2f$bson$2e$esm$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/bson@4.7.2/node_modules/bson/dist/bson.esm.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
class DocumentReference {
    constructor(db, coll, apiOptions, docID, transactionId){
        this.watch = (options)=>{
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Db"].ws) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Db"].ws = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$websocket$2d$client$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RealtimeWebSocketClient"]({
                    context: {
                        appConfig: {
                            docSizeLimit: 1000,
                            realtimePingInterval: 10000,
                            realtimePongWaitTimeout: 5000,
                            request: this.request
                        }
                    }
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Db"].ws.watch(Object.assign(Object.assign({}, options), {
                envId: this._db.config.env,
                collectionName: this._coll,
                query: JSON.stringify({
                    _id: this.id
                })
            }));
        };
        this._db = db;
        this._coll = coll;
        this.id = docID;
        this._transactionId = transactionId;
        this.request = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Db"].reqClass(this._db.config);
        this._apiOptions = apiOptions;
    }
    async create(data) {
        if (this.id) {
            data['_id'] = this.id;
        }
        let params = {
            collectionName: this._coll,
            data: [
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["stringifyByEJSON"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$datatype$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serialize"])(data))
            ],
            transactionId: this._transactionId
        };
        const res = await this.request.send('database.insertDocument', params, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getReqOpts"])(this._apiOptions));
        if (res.code) {
            return res;
        }
        if (this._transactionId) {
            return {
                inserted: 1,
                ok: 1,
                id: res.data.insertedIds[0],
                requestId: res.requestId
            };
        }
        return {
            id: res.data.insertedIds[0],
            requestId: res.requestId
        };
    }
    async set(data) {
        if (!this.id) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["processReturn"])(this._db.config.throwOnCode, Object.assign(Object.assign({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$const$2f$code$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERRORS"].INVALID_PARAM), {
                message: 'docId不能为空'
            }));
        }
        if (!data || typeof data !== 'object') {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["processReturn"])(this._db.config.throwOnCode, Object.assign(Object.assign({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$const$2f$code$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERRORS"].INVALID_PARAM), {
                message: '参数必需是非空对象'
            }));
        }
        if (data.hasOwnProperty('_id')) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["processReturn"])(this._db.config.throwOnCode, Object.assign(Object.assign({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$const$2f$code$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERRORS"].INVALID_PARAM), {
                message: '不能更新_id的值'
            }));
        }
        let hasOperator = false;
        const checkMixed = (objs)=>{
            if (typeof objs === 'object') {
                for(let key in objs){
                    if (objs[key] instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateCommand"]) {
                        hasOperator = true;
                    } else if (typeof objs[key] === 'object') {
                        checkMixed(objs[key]);
                    }
                }
            }
        };
        checkMixed(data);
        if (hasOperator) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["processReturn"])(this._db.config.throwOnCode, Object.assign(Object.assign({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$const$2f$code$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERRORS"].DATABASE_REQUEST_FAILED), {
                message: 'update operator complicit'
            }));
        }
        let param = {
            collectionName: this._coll,
            queryType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryType"].DOC,
            data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["stringifyByEJSON"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$datatype$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serialize"])(data)),
            transactionId: this._transactionId,
            multi: false,
            merge: false,
            upsert: true
        };
        if (this.id) {
            param['query'] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["stringifyByEJSON"])({
                _id: this.id
            });
        }
        const res = await this.request.send('database.modifyDocument', param, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getReqOpts"])(this._apiOptions));
        if (res.code) {
            return res;
        }
        if (this._transactionId) {
            return {
                updated: res.data.updated,
                upserted: [
                    {
                        _id: res.data.upsert_id
                    }
                ],
                requestId: res.requestId
            };
        }
        return {
            updated: res.data.updated,
            upsertedId: res.data.upsert_id,
            requestId: res.requestId
        };
    }
    async update(data) {
        if (!data || typeof data !== 'object') {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["processReturn"])(this._db.config.throwOnCode, Object.assign(Object.assign({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$const$2f$code$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERRORS"].INVALID_PARAM), {
                message: '参数必需是非空对象'
            }));
        }
        if (data.hasOwnProperty('_id')) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["processReturn"])(this._db.config.throwOnCode, Object.assign(Object.assign({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$const$2f$code$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERRORS"].INVALID_PARAM), {
                message: '不能更新_id的值'
            }));
        }
        const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["stringifyByEJSON"])({
            _id: this.id
        });
        const param = {
            collectionName: this._coll,
            transactionId: this._transactionId,
            data: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateSerializer"].encodeEJSON(data, this._apiOptions.raw || false),
            query,
            queryType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryType"].DOC,
            multi: false,
            merge: true,
            upsert: false
        };
        const res = await this.request.send('database.modifyDocument', param, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getReqOpts"])(this._apiOptions));
        if (res.code) {
            return res;
        }
        return {
            updated: res.data.updated,
            requestId: res.requestId
        };
    }
    async delete() {
        return this.remove();
    }
    async remove() {
        const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["stringifyByEJSON"])({
            _id: this.id
        });
        const param = {
            collectionName: this._coll,
            transactionId: this._transactionId,
            query: query,
            queryType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryType"].DOC,
            multi: false
        };
        const res = await this.request.send('database.removeDocument', param, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getReqOpts"])(this._apiOptions));
        if (res.code) {
            return res;
        }
        return {
            deleted: res.data.deleted,
            requestId: res.requestId
        };
    }
    async get() {
        const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["stringifyByEJSON"])({
            _id: this.id
        });
        const { projection } = this._apiOptions;
        const param = {
            collectionName: this._coll,
            query,
            transactionId: this._transactionId,
            queryType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryType"].DOC,
            multi: false
        };
        if (projection) {
            param.projection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["stringifyByEJSON"])(projection);
        }
        const res = await this.request.send('database.getDocument', param, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getReqOpts"])(this._apiOptions));
        if (res.code) {
            return res;
        }
        const list = res.data.list.map((item)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bson$40$4$2e$7$2e$2$2f$node_modules$2f$bson$2f$dist$2f$bson$2e$esm$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EJSON"].parse(item));
        const documents = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$util$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Util"].formatResDocumentData(list);
        if (this._transactionId) {
            return {
                data: documents[0] || null,
                requestId: res.requestId
            };
        }
        return {
            data: documents,
            requestId: res.requestId,
            offset: res.data.offset,
            limit: res.data.limit
        };
    }
    field(projection) {
        let transformProjection = {};
        for(let k in projection){
            if (typeof projection[k] === 'boolean') {
                transformProjection[k] = projection[k] === true ? 1 : 0;
            }
            if (typeof projection[k] === 'number') {
                transformProjection[k] = projection[k] > 0 ? 1 : 0;
            }
            if (typeof projection[k] === 'object') {
                transformProjection[k] = projection[k];
            }
        }
        let newApiOption = Object.assign({}, this._apiOptions);
        newApiOption.projection = transformProjection;
        return new DocumentReference(this._db, this._coll, newApiOption, this.id, this._transactionId);
    }
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/serializer/query.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QuerySerializer",
    ()=>QuerySerializer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/commands/query.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$logic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/commands/logic.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/helper/symbol.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/type.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$operator$2d$map$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/operator-map.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$common$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/serializer/common.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/utils.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
class QuerySerializer {
    constructor(){}
    static encode(query) {
        const encoder = new QueryEncoder();
        return encoder.encodeQuery(query);
    }
    static encodeEJSON(query, raw) {
        const encoder = new QueryEncoder();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["stringifyByEJSON"])(raw ? query : encoder.encodeQuery(query));
    }
}
class QueryEncoder {
    encodeQuery(query, key) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$common$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isConversionRequired"])(query)) {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$logic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isLogicCommand"])(query)) {
                return this.encodeLogicCommand(query);
            } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isQueryCommand"])(query)) {
                return this.encodeQueryCommand(query);
            } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isRegExp"])(query)) {
                return {
                    [key]: this.encodeRegExp(query)
                };
            } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isDate"])(query)) {
                return {
                    [key]: query
                };
            } else {
                return {
                    [key]: this.encodeQueryObject(query)
                };
            }
        } else {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isObject"])(query)) {
                return this.encodeQueryObject(query);
            } else {
                return query;
            }
        }
    }
    encodeRegExp(query) {
        return {
            $regularExpression: {
                pattern: query.source,
                options: query.flags
            }
        };
    }
    encodeLogicCommand(query) {
        switch(query.operator){
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$logic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LOGIC_COMMANDS_LITERAL"].NOR:
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$logic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LOGIC_COMMANDS_LITERAL"].AND:
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$logic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LOGIC_COMMANDS_LITERAL"].OR:
                {
                    const $op = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$operator$2d$map$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["operatorToString"])(query.operator);
                    const subqueries = query.operands.map((oprand)=>this.encodeQuery(oprand, query.fieldName));
                    return {
                        [$op]: subqueries
                    };
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$logic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LOGIC_COMMANDS_LITERAL"].NOT:
                {
                    const $op = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$operator$2d$map$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["operatorToString"])(query.operator);
                    const operatorExpression = query.operands[0];
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isRegExp"])(operatorExpression)) {
                        return {
                            [query.fieldName]: {
                                [$op]: this.encodeRegExp(operatorExpression)
                            }
                        };
                    } else {
                        const subqueries = this.encodeQuery(operatorExpression)[query.fieldName];
                        return {
                            [query.fieldName]: {
                                [$op]: subqueries
                            }
                        };
                    }
                }
            default:
                {
                    const $op = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$operator$2d$map$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["operatorToString"])(query.operator);
                    if (query.operands.length === 1) {
                        const subquery = this.encodeQuery(query.operands[0]);
                        return {
                            [$op]: subquery
                        };
                    } else {
                        const subqueries = query.operands.map(this.encodeQuery.bind(this));
                        return {
                            [$op]: subqueries
                        };
                    }
                }
        }
    }
    encodeQueryCommand(query) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isComparisonCommand"])(query)) {
            return this.encodeComparisonCommand(query);
        } else {
            return this.encodeComparisonCommand(query);
        }
    }
    encodeComparisonCommand(query) {
        if (query.fieldName === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_UNSET_FIELD_NAME"]) {
            throw new Error('Cannot encode a comparison command with unset field name');
        }
        const $op = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$operator$2d$map$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["operatorToString"])(query.operator);
        switch(query.operator){
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].EQ:
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].NEQ:
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].LT:
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].LTE:
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].GT:
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].GTE:
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].ELEM_MATCH:
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].EXISTS:
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].SIZE:
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].MOD:
                {
                    return {
                        [query.fieldName]: {
                            [$op]: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$common$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encodeInternalDataType"])(query.operands[0])
                        }
                    };
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].IN:
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].NIN:
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].ALL:
                {
                    return {
                        [query.fieldName]: {
                            [$op]: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$common$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encodeInternalDataType"])(query.operands)
                        }
                    };
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].GEO_NEAR:
                {
                    const options = query.operands[0];
                    return {
                        [query.fieldName]: {
                            $nearSphere: {
                                $geometry: options.geometry.toJSON(),
                                $maxDistance: options.maxDistance,
                                $minDistance: options.minDistance
                            }
                        }
                    };
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].GEO_WITHIN:
                {
                    const options = query.operands[0];
                    if (options.centerSphere) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Validate"].isCentersPhere(options.centerSphere);
                        const centerSphere = options.centerSphere;
                        if (centerSphere[0]._internalType === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_GEO_POINT"]) {
                            return {
                                [query.fieldName]: {
                                    $geoWithin: {
                                        $centerSphere: [
                                            centerSphere[0].toJSON().coordinates,
                                            centerSphere[1]
                                        ]
                                    }
                                }
                            };
                        }
                        return {
                            [query.fieldName]: {
                                $geoWithin: {
                                    $centerSphere: options.centerSphere
                                }
                            }
                        };
                    }
                    return {
                        [query.fieldName]: {
                            $geoWithin: {
                                $geometry: options.geometry.toJSON()
                            }
                        }
                    };
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].GEO_INTERSECTS:
                {
                    const options = query.operands[0];
                    return {
                        [query.fieldName]: {
                            $geoIntersects: {
                                $geometry: options.geometry.toJSON()
                            }
                        }
                    };
                }
            default:
                {
                    return {
                        [query.fieldName]: {
                            [$op]: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$common$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encodeInternalDataType"])(query.operands[0])
                        }
                    };
                }
        }
    }
    encodeQueryObject(query) {
        const flattened = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$common$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["flattenQueryObject"])(query);
        for(const key in flattened){
            const val = flattened[key];
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$logic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isLogicCommand"])(val)) {
                flattened[key] = val._setFieldName(key);
                const condition = this.encodeLogicCommand(flattened[key]);
                this.mergeConditionAfterEncode(flattened, condition, key);
            } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isComparisonCommand"])(val)) {
                flattened[key] = val._setFieldName(key);
                const condition = this.encodeComparisonCommand(flattened[key]);
                this.mergeConditionAfterEncode(flattened, condition, key);
            } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$common$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isConversionRequired"])(val)) {
                flattened[key] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$common$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encodeInternalDataType"])(val);
            }
        }
        return flattened;
    }
    mergeConditionAfterEncode(query, condition, key) {
        if (!condition[key]) {
            delete query[key];
        }
        for(const conditionKey in condition){
            if (query[conditionKey]) {
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(query[conditionKey])) {
                    query[conditionKey] = query[conditionKey].concat(condition[conditionKey]);
                } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isObject"])(query[conditionKey])) {
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isObject"])(condition[conditionKey])) {
                        Object.assign(query, condition);
                    } else {
                        console.warn(`unmergable condition, query is object but condition is ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getType"])(condition)}, can only overwrite`, condition, key);
                        query[conditionKey] = condition[conditionKey];
                    }
                } else {
                    console.warn(`to-merge query is of type ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getType"])(query)}, can only overwrite`, query, condition, key);
                    query[conditionKey] = condition[conditionKey];
                }
            } else {
                query[conditionKey] = condition[conditionKey];
            }
        }
    }
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/query.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Query",
    ()=>Query
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/constant.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/validate.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$util$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/util.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/serializer/query.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/serializer/update.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$websocket$2d$client$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/realtime/websocket-client.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/utils.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$const$2f$code$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/const/code.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bson$40$4$2e$7$2e$2$2f$node_modules$2f$bson$2f$dist$2f$bson$2e$esm$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/bson@4.7.2/node_modules/bson/dist/bson.esm.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
class Query {
    constructor(db, coll, fieldFilters, apiOptions, transactionId){
        this.watch = (options)=>{
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Db"].ws) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Db"].ws = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$realtime$2f$websocket$2d$client$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RealtimeWebSocketClient"]({
                    context: {
                        appConfig: {
                            docSizeLimit: 1000,
                            realtimePingInterval: 10000,
                            realtimePongWaitTimeout: 5000,
                            request: this._request
                        }
                    }
                });
            }
            const { limit, order } = this._apiOptions;
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Db"].ws.watch(Object.assign(Object.assign({}, options), {
                envId: this._db.config.env,
                collectionName: this._coll,
                query: JSON.stringify(this._fieldFilters),
                limit,
                orderBy: order ? order.reduce((acc, cur)=>{
                    acc[cur.field] = cur.direction;
                    return acc;
                }, {}) : undefined
            }));
        };
        this._db = db;
        this._coll = coll;
        this._fieldFilters = fieldFilters;
        this._apiOptions = apiOptions || {};
        this._request = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Db"].reqClass(this._db.config);
        this._transactionId = transactionId;
    }
    async get() {
        const order = this._apiOptions.order;
        let param = {
            collectionName: this._coll,
            queryType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryType"].WHERE,
            transactionId: this._transactionId
        };
        if (this._fieldFilters) {
            param.query = this._fieldFilters;
        }
        if (order) {
            param.order = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["stringifyByEJSON"])(order);
        }
        const offset = this._apiOptions.offset;
        if (offset) {
            param.offset = offset;
        }
        const limit = this._apiOptions.limit;
        if (limit) {
            param.limit = limit < 1000 ? limit : 1000;
        } else {
            param.limit = 100;
        }
        const projection = this._apiOptions.projection;
        if (projection) {
            param.projection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["stringifyByEJSON"])(projection);
        }
        const res = await this._request.send('database.getDocument', param, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getReqOpts"])(this._apiOptions));
        if (res.code) {
            return res;
        }
        const list = res.data.list.map((item)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bson$40$4$2e$7$2e$2$2f$node_modules$2f$bson$2f$dist$2f$bson$2e$esm$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EJSON"].parse(item));
        const documents = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$util$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Util"].formatResDocumentData(list);
        const result = {
            data: documents,
            requestId: res.requestId
        };
        if (res.limit) result.limit = res.limit;
        if (res.offset) result.offset = res.offset;
        return result;
    }
    async count() {
        let param = {
            collectionName: this._coll,
            queryType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryType"].WHERE
        };
        if (this._fieldFilters) {
            param.query = this._fieldFilters;
        }
        const res = await this._request.send('database.calculateDocument', param, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getReqOpts"])(this._apiOptions));
        if (res.code) {
            return res;
        }
        return {
            requestId: res.requestId,
            total: res.data.total
        };
    }
    where(query) {
        if (Object.prototype.toString.call(query).slice(8, -1) !== 'Object') {
            throw Error(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ErrorCode"].QueryParamTypeError);
        }
        const keys = Object.keys(query);
        const checkFlag = keys.some((item)=>{
            return query[item] !== undefined;
        });
        if (keys.length && !checkFlag) {
            throw Error(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ErrorCode"].QueryParamValueError);
        }
        return new Query(this._db, this._coll, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QuerySerializer"].encodeEJSON(query, this._apiOptions.raw || false), this._apiOptions, this._transactionId);
    }
    options(apiOptions) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Validate"].isValidOptions(apiOptions);
        return new Query(this._db, this._coll, this._fieldFilters, apiOptions, this._transactionId);
    }
    orderBy(fieldPath, directionStr) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Validate"].isFieldPath(fieldPath);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Validate"].isFieldOrder(directionStr);
        const newOrder = {
            [fieldPath]: directionStr === 'desc' ? -1 : 1
        };
        const order = this._apiOptions.order || {};
        const newApiOption = Object.assign({}, this._apiOptions, {
            order: Object.assign({}, order, newOrder)
        });
        return new Query(this._db, this._coll, this._fieldFilters, newApiOption, this._transactionId);
    }
    limit(limit) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Validate"].isInteger('limit', limit);
        let newApiOption = Object.assign({}, this._apiOptions);
        newApiOption.limit = limit;
        return new Query(this._db, this._coll, this._fieldFilters, newApiOption, this._transactionId);
    }
    skip(offset) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Validate"].isInteger('offset', offset);
        let newApiOption = Object.assign({}, this._apiOptions);
        newApiOption.offset = offset;
        return new Query(this._db, this._coll, this._fieldFilters, newApiOption, this._transactionId);
    }
    async update(data) {
        if (!data || typeof data !== 'object') {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["processReturn"])(this._db.config.throwOnCode, Object.assign(Object.assign({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$const$2f$code$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERRORS"].INVALID_PARAM), {
                message: '参数必需是非空对象'
            }));
        }
        if (data.hasOwnProperty('_id')) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["processReturn"])(this._db.config.throwOnCode, Object.assign(Object.assign({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$const$2f$code$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERRORS"].INVALID_PARAM), {
                message: '不能更新_id的值'
            }));
        }
        let { multiple } = this._apiOptions;
        const multi = multiple === undefined ? true : multiple;
        let param = {
            collectionName: this._coll,
            queryType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryType"].WHERE,
            multi,
            merge: true,
            upsert: false,
            data: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateSerializer"].encodeEJSON(data, this._apiOptions.raw || false)
        };
        if (this._fieldFilters) {
            param.query = this._fieldFilters;
        }
        const res = await this._request.send('database.modifyDocument', param, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getReqOpts"])(this._apiOptions));
        if (res.code) {
            return res;
        }
        return {
            requestId: res.requestId,
            updated: res.data.updated,
            upsertId: res.data.upsert_id
        };
    }
    field(projection) {
        let transformProjection = {};
        for(let k in projection){
            if (typeof projection[k] === 'boolean') {
                transformProjection[k] = projection[k] === true ? 1 : 0;
            }
            if (typeof projection[k] === 'number') {
                transformProjection[k] = projection[k] > 0 ? 1 : 0;
            }
            if (typeof projection[k] === 'object') {
                transformProjection[k] = projection[k];
            }
        }
        let newApiOption = Object.assign({}, this._apiOptions);
        newApiOption.projection = transformProjection;
        return new Query(this._db, this._coll, this._fieldFilters, newApiOption, this._transactionId);
    }
    async remove() {
        const { offset, limit, projection, order } = this._apiOptions;
        if (offset !== undefined || limit !== undefined || projection !== undefined || order !== undefined) {
            console.warn('`offset`, `limit`, `projection`, `orderBy` are not supported in remove() operation');
        }
        let { multiple } = this._apiOptions;
        const multi = multiple === undefined ? true : multiple;
        const param = {
            collectionName: this._coll,
            query: this._fieldFilters,
            queryType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryType"].WHERE,
            multi
        };
        const res = await this._request.send('database.removeDocument', param, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getReqOpts"])(this._apiOptions));
        if (res.code) {
            return res;
        }
        return {
            requestId: res.requestId,
            deleted: res.data.deleted
        };
    }
    async updateAndReturn(data) {
        if (!data || typeof data !== 'object') {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["processReturn"])(this._db.config.throwOnCode, Object.assign(Object.assign({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$const$2f$code$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERRORS"].INVALID_PARAM), {
                message: '参数必需是非空对象'
            }));
        }
        if (data.hasOwnProperty('_id')) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["processReturn"])(this._db.config.throwOnCode, Object.assign(Object.assign({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$const$2f$code$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERRORS"].INVALID_PARAM), {
                message: '不能更新_id的值'
            }));
        }
        let param = {
            collectionName: this._coll,
            queryType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$constant$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryType"].WHERE,
            data: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateSerializer"].encodeEJSON(data, false)
        };
        if (this._transactionId) {
            param.transactionId = this._transactionId;
        }
        if (this._fieldFilters) {
            param.query = this._fieldFilters;
        }
        const res = await this._request.send('database.modifyAndReturnDoc', param, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getReqOpts"])(this._apiOptions));
        if (res.code) {
            return res;
        }
        return {
            requestId: res.requestId,
            updated: res.data.updated,
            doc: res.data.doc && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bson$40$4$2e$7$2e$2$2f$node_modules$2f$bson$2f$dist$2f$bson$2e$esm$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EJSON"].parse(res.data.doc)
        };
    }
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/aggregate.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Aggregation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bson$40$4$2e$7$2e$2$2f$node_modules$2f$bson$2f$dist$2f$bson$2e$esm$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/bson@4.7.2/node_modules/bson/dist/bson.esm.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/serializer/query.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/utils.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/type.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/validate.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$point$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/point.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
class Aggregation {
    constructor(db, collectionName, rawPipeline){
        this._stages = [];
        if (db && collectionName) {
            this._db = db;
            this._request = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Db"].reqClass(this._db.config);
            this._collectionName = collectionName;
            if (rawPipeline && rawPipeline.length > 0) {
                rawPipeline.forEach((stage)=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Validate"].isValidAggregation(stage);
                    const stageName = Object.keys(stage)[0];
                    this._pipe(stageName, stage[stageName], true);
                });
            }
        }
    }
    async end() {
        if (!this._collectionName || !this._db) {
            throw new Error('Aggregation pipeline cannot send request');
        }
        const result = await this._request.send('database.aggregateDocuments', {
            collectionName: this._collectionName,
            stages: this._stages
        });
        if (result && result.data && result.data.list) {
            return {
                requestId: result.requestId,
                data: result.data.list.map(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bson$40$4$2e$7$2e$2$2f$node_modules$2f$bson$2f$dist$2f$bson$2e$esm$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EJSON"].parse)
            };
        }
        return result;
    }
    unwrap() {
        return this._stages;
    }
    done() {
        return this._stages.map(({ stageKey, stageValue })=>{
            return {
                [stageKey]: JSON.parse(stageValue)
            };
        });
    }
    _pipe(stage, param, raw = false) {
        let transformParam = '';
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getType"])(param) === 'object') {
            transformParam = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["stringifyByEJSON"])(param);
        } else {
            transformParam = JSON.stringify(param);
        }
        this._stages.push({
            stageKey: raw ? stage : `$${stage}`,
            stageValue: transformParam
        });
        return this;
    }
    addFields(param) {
        return this._pipe('addFields', param);
    }
    bucket(param) {
        return this._pipe('bucket', param);
    }
    bucketAuto(param) {
        return this._pipe('bucketAuto', param);
    }
    count(param) {
        return this._pipe('count', param);
    }
    geoNear(param) {
        if (param.query) {
            param.query = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QuerySerializer"].encode(param.query);
        }
        if (param.distanceMultiplier && typeof param.distanceMultiplier === 'number') {
            param.distanceMultiplier = param.distanceMultiplier;
        }
        if (param.near) {
            param.near = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$point$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Point"](param.near.longitude, param.near.latitude).toJSON();
        }
        return this._pipe('geoNear', param);
    }
    group(param) {
        return this._pipe('group', param);
    }
    limit(param) {
        return this._pipe('limit', param);
    }
    match(param) {
        return this._pipe('match', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QuerySerializer"].encode(param));
    }
    project(param) {
        return this._pipe('project', param);
    }
    lookup(param) {
        return this._pipe('lookup', param);
    }
    replaceRoot(param) {
        return this._pipe('replaceRoot', param);
    }
    sample(param) {
        return this._pipe('sample', param);
    }
    skip(param) {
        return this._pipe('skip', param);
    }
    sort(param) {
        return this._pipe('sort', param);
    }
    sortByCount(param) {
        return this._pipe('sortByCount', param);
    }
    unwind(param) {
        return this._pipe('unwind', param);
    }
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/collection.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CollectionReference",
    ()=>CollectionReference
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$document$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/document.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/query.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$aggregate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/aggregate.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$datatype$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/serializer/datatype.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/utils.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/validate.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/type.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
class CollectionReference extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Query"] {
    constructor(db, coll, apiOptions, transactionId){
        super(db, coll, '', apiOptions, transactionId);
        if (transactionId) {
            this._transactionId = transactionId;
        }
    }
    get name() {
        return this._coll;
    }
    doc(docID) {
        if (typeof docID !== 'string' && typeof docID !== 'number') {
            throw new Error('docId必须为字符串或数字');
        }
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$document$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DocumentReference"](this._db, this._coll, this._apiOptions, docID, this._transactionId);
    }
    async add(data) {
        let transformData = data;
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(data)) {
            transformData = [
                data
            ];
        }
        transformData = transformData.map((item)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["stringifyByEJSON"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serializer$2f$datatype$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["serialize"])(item));
        });
        let params = {
            collectionName: this._coll,
            data: transformData
        };
        if (this._transactionId) {
            params.transactionId = this._transactionId;
        }
        const res = await this._request.send('database.insertDocument', params, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getReqOpts"])(this._apiOptions));
        if (res.code) {
            return res;
        }
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(data)) {
            if (this._transactionId) {
                return {
                    inserted: 1,
                    ok: 1,
                    id: res.data.insertedIds[0],
                    requestId: res.requestId
                };
            }
            return {
                id: res.data.insertedIds[0],
                requestId: res.requestId
            };
        }
        return {
            ids: res.data.insertedIds,
            requestId: res.requestId
        };
    }
    aggregate(rawPipeline = []) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$aggregate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"](this._db, this._coll, this._apiOptions.raw || false ? rawPipeline : []);
    }
    options(apiOptions) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Validate"].isValidOptions(apiOptions);
        return new CollectionReference(this._db, this._coll, apiOptions, this._transactionId);
    }
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/command.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AggregationOperator",
    ()=>AggregationOperator,
    "Command",
    ()=>Command,
    "ProjectionOperator",
    ()=>ProjectionOperator,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/commands/query.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$logic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/commands/logic.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/commands/update.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/utils/type.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$aggregate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/aggregate.js [app-rsc] (ecmascript)");
;
;
;
;
;
const Command = {
    eq (val) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].EQ, [
            val
        ]);
    },
    neq (val) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].NEQ, [
            val
        ]);
    },
    lt (val) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].LT, [
            val
        ]);
    },
    lte (val) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].LTE, [
            val
        ]);
    },
    gt (val) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].GT, [
            val
        ]);
    },
    gte (val) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].GTE, [
            val
        ]);
    },
    in (val) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].IN, val);
    },
    nin (val) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].NIN, val);
    },
    all (val) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].ALL, val);
    },
    elemMatch (val) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].ELEM_MATCH, [
            val
        ]);
    },
    exists (val) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].EXISTS, [
            val
        ]);
    },
    size (val) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].SIZE, [
            val
        ]);
    },
    mod () {
        if (arguments.length == 1) return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].MOD, [
            arguments[0]
        ]);
        if (arguments.length == 2) return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].MOD, [
            [
                arguments[0],
                arguments[1]
            ]
        ]);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].MOD, arguments);
    },
    geoNear (val) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].GEO_NEAR, [
            val
        ]);
    },
    geoWithin (val) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].GEO_WITHIN, [
            val
        ]);
    },
    geoIntersects (val) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QueryCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["QUERY_COMMANDS_LITERAL"].GEO_INTERSECTS, [
            val
        ]);
    },
    and (...__expressions__) {
        const expressions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(arguments[0]) ? arguments[0] : Array.from(arguments);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$logic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LogicCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$logic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LOGIC_COMMANDS_LITERAL"].AND, expressions);
    },
    nor (...__expressions__) {
        const expressions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(arguments[0]) ? arguments[0] : Array.from(arguments);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$logic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LogicCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$logic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LOGIC_COMMANDS_LITERAL"].NOR, expressions);
    },
    or (...__expressions__) {
        const expressions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(arguments[0]) ? arguments[0] : Array.from(arguments);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$logic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LogicCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$logic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LOGIC_COMMANDS_LITERAL"].OR, expressions);
    },
    not (...__expressions__) {
        const expressions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(arguments[0]) ? arguments[0] : Array.from(arguments);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$logic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LogicCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$logic$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LOGIC_COMMANDS_LITERAL"].NOT, expressions);
    },
    set (val) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].SET, [
            val
        ]);
    },
    remove () {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].REMOVE, []);
    },
    inc (val) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].INC, [
            val
        ]);
    },
    mul (val) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].MUL, [
            val
        ]);
    },
    push (...args) {
        let values;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isObject"])(args[0]) && args[0].hasOwnProperty('each')) {
            values = {};
            const options = args[0];
            if (options.each !== undefined) {
                values['$each'] = options.each;
            }
            if (options.position !== undefined) {
                values['$position'] = options.position;
            }
            if (options.sort !== undefined) {
                values['$sort'] = options.sort;
            }
            if (options.slice !== undefined) {
                values['$slice'] = options.slice;
            }
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(args[0])) {
            values = args[0];
        } else {
            values = Array.from(args);
        }
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].PUSH, values);
    },
    pull (values) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].PULL, values);
    },
    pullAll (values) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].PULL_ALL, values);
    },
    pop () {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].POP, []);
    },
    shift () {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].SHIFT, []);
    },
    unshift (...__values__) {
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(arguments[0]) ? arguments[0] : Array.from(arguments);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].UNSHIFT, values);
    },
    addToSet (values) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].ADD_TO_SET, values);
    },
    rename (values) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].RENAME, [
            values
        ]);
    },
    bit (values) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].BIT, [
            values
        ]);
    },
    max (values) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].MAX, [
            values
        ]);
    },
    min (values) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateCommand"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$commands$2f$update$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UPDATE_COMMANDS_LITERAL"].MIN, [
            values
        ]);
    },
    expr (values) {
        return {
            $expr: values
        };
    },
    jsonSchema (schema) {
        return {
            $jsonSchema: schema
        };
    },
    text (values) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$utils$2f$type$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isString"])(values)) {
            return {
                $search: values.search
            };
        } else {
            return {
                $search: values.search,
                $language: values.language,
                $caseSensitive: values.caseSensitive,
                $diacriticSensitive: values.diacriticSensitive
            };
        }
    },
    aggregate: {
        pipeline () {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$aggregate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]();
        },
        abs: (param)=>new AggregationOperator('abs', param),
        add: (param)=>new AggregationOperator('add', param),
        ceil: (param)=>new AggregationOperator('ceil', param),
        divide: (param)=>new AggregationOperator('divide', param),
        exp: (param)=>new AggregationOperator('exp', param),
        floor: (param)=>new AggregationOperator('floor', param),
        ln: (param)=>new AggregationOperator('ln', param),
        log: (param)=>new AggregationOperator('log', param),
        log10: (param)=>new AggregationOperator('log10', param),
        mod: (param)=>new AggregationOperator('mod', param),
        multiply: (param)=>new AggregationOperator('multiply', param),
        pow: (param)=>new AggregationOperator('pow', param),
        sqrt: (param)=>new AggregationOperator('sqrt', param),
        subtract: (param)=>new AggregationOperator('subtract', param),
        trunc: (param)=>new AggregationOperator('trunc', param),
        arrayElemAt: (param)=>new AggregationOperator('arrayElemAt', param),
        arrayToObject: (param)=>new AggregationOperator('arrayToObject', param),
        concatArrays: (param)=>new AggregationOperator('concatArrays', param),
        filter: (param)=>new AggregationOperator('filter', param),
        in: (param)=>new AggregationOperator('in', param),
        indexOfArray: (param)=>new AggregationOperator('indexOfArray', param),
        isArray: (param)=>new AggregationOperator('isArray', param),
        map: (param)=>new AggregationOperator('map', param),
        range: (param)=>new AggregationOperator('range', param),
        reduce: (param)=>new AggregationOperator('reduce', param),
        reverseArray: (param)=>new AggregationOperator('reverseArray', param),
        size: (param)=>new AggregationOperator('size', param),
        slice: (param)=>new AggregationOperator('slice', param),
        zip: (param)=>new AggregationOperator('zip', param),
        and: (param)=>new AggregationOperator('and', param),
        not: (param)=>new AggregationOperator('not', param),
        or: (param)=>new AggregationOperator('or', param),
        cmp: (param)=>new AggregationOperator('cmp', param),
        eq: (param)=>new AggregationOperator('eq', param),
        gt: (param)=>new AggregationOperator('gt', param),
        gte: (param)=>new AggregationOperator('gte', param),
        lt: (param)=>new AggregationOperator('lt', param),
        lte: (param)=>new AggregationOperator('lte', param),
        neq: (param)=>new AggregationOperator('ne', param),
        cond: (param)=>new AggregationOperator('cond', param),
        ifNull: (param)=>new AggregationOperator('ifNull', param),
        switch: (param)=>new AggregationOperator('switch', param),
        dateFromParts: (param)=>new AggregationOperator('dateFromParts', param),
        dateFromString: (param)=>new AggregationOperator('dateFromString', param),
        dayOfMonth: (param)=>new AggregationOperator('dayOfMonth', param),
        dayOfWeek: (param)=>new AggregationOperator('dayOfWeek', param),
        dayOfYear: (param)=>new AggregationOperator('dayOfYear', param),
        isoDayOfWeek: (param)=>new AggregationOperator('isoDayOfWeek', param),
        isoWeek: (param)=>new AggregationOperator('isoWeek', param),
        isoWeekYear: (param)=>new AggregationOperator('isoWeekYear', param),
        millisecond: (param)=>new AggregationOperator('millisecond', param),
        minute: (param)=>new AggregationOperator('minute', param),
        month: (param)=>new AggregationOperator('month', param),
        second: (param)=>new AggregationOperator('second', param),
        hour: (param)=>new AggregationOperator('hour', param),
        week: (param)=>new AggregationOperator('week', param),
        year: (param)=>new AggregationOperator('year', param),
        literal: (param)=>new AggregationOperator('literal', param),
        mergeObjects: (param)=>new AggregationOperator('mergeObjects', param),
        objectToArray: (param)=>new AggregationOperator('objectToArray', param),
        allElementsTrue: (param)=>new AggregationOperator('allElementsTrue', param),
        anyElementTrue: (param)=>new AggregationOperator('anyElementTrue', param),
        setDifference: (param)=>new AggregationOperator('setDifference', param),
        setEquals: (param)=>new AggregationOperator('setEquals', param),
        setIntersection: (param)=>new AggregationOperator('setIntersection', param),
        setIsSubset: (param)=>new AggregationOperator('setIsSubset', param),
        setUnion: (param)=>new AggregationOperator('setUnion', param),
        concat: (param)=>new AggregationOperator('concat', param),
        dateToString: (param)=>new AggregationOperator('dateToString', param),
        indexOfBytes: (param)=>new AggregationOperator('indexOfBytes', param),
        indexOfCP: (param)=>new AggregationOperator('indexOfCP', param),
        split: (param)=>new AggregationOperator('split', param),
        strLenBytes: (param)=>new AggregationOperator('strLenBytes', param),
        strLenCP: (param)=>new AggregationOperator('strLenCP', param),
        strcasecmp: (param)=>new AggregationOperator('strcasecmp', param),
        substr: (param)=>new AggregationOperator('substr', param),
        substrBytes: (param)=>new AggregationOperator('substrBytes', param),
        substrCP: (param)=>new AggregationOperator('substrCP', param),
        toLower: (param)=>new AggregationOperator('toLower', param),
        toUpper: (param)=>new AggregationOperator('toUpper', param),
        meta: (param)=>new AggregationOperator('meta', param),
        addToSet: (param)=>new AggregationOperator('addToSet', param),
        avg: (param)=>new AggregationOperator('avg', param),
        first: (param)=>new AggregationOperator('first', param),
        last: (param)=>new AggregationOperator('last', param),
        max: (param)=>new AggregationOperator('max', param),
        min: (param)=>new AggregationOperator('min', param),
        push: (param)=>new AggregationOperator('push', param),
        stdDevPop: (param)=>new AggregationOperator('stdDevPop', param),
        stdDevSamp: (param)=>new AggregationOperator('stdDevSamp', param),
        sum: (param)=>new AggregationOperator('sum', param),
        let: (param)=>new AggregationOperator('let', param)
    },
    project: {
        slice: (param)=>new ProjectionOperator('slice', param),
        elemMatch: (param)=>new ProjectionOperator('elemMatch', param)
    }
};
class AggregationOperator {
    constructor(name, param){
        this['$' + name] = param;
    }
}
class ProjectionOperator {
    constructor(name, param){
        this['$' + name] = param;
    }
}
const __TURBOPACK__default__export__ = Command;
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/regexp/index.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RegExp",
    ()=>RegExp,
    "RegExpConstructor",
    ()=>RegExpConstructor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/helper/symbol.js [app-rsc] (ecmascript) <locals>");
;
class RegExp {
    constructor({ regexp, options }){
        if (!regexp) {
            throw new TypeError('regexp must be a string');
        }
        this.$regularExpression = {
            pattern: regexp || '',
            options: options || ''
        };
    }
    parse() {
        return {
            $regularExpression: {
                pattern: this.$regularExpression.pattern,
                options: this.$regularExpression.options
            }
        };
    }
    get _internalType() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_REGEXP"];
    }
}
function RegExpConstructor(param) {
    return new RegExp(param);
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/transaction/index.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Transaction",
    ()=>Transaction,
    "runTransaction",
    ()=>runTransaction,
    "startTransaction",
    ()=>startTransaction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$collection$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/collection.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$const$2f$code$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/const/code.js [app-rsc] (ecmascript)");
;
;
;
const START = 'database.startTransaction';
const COMMIT = 'database.commitTransaction';
const ABORT = 'database.abortTransaction';
class Transaction {
    constructor(db){
        this._db = db;
        this._request = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Db"].reqClass(this._db.config);
        this.aborted = false;
        this.commited = false;
        this.inited = false;
    }
    async init() {
        const res = await this._request.send(START);
        if (res.code) {
            throw res;
        }
        this.inited = true;
        this._id = res.transactionId;
    }
    collection(collName) {
        if (!collName) {
            throw new Error('Collection name is required');
        }
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$collection$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CollectionReference"](this._db, collName, {}, this._id);
    }
    getTransactionId() {
        return this._id;
    }
    getRequestMethod() {
        return this._request;
    }
    async commit() {
        const param = {
            transactionId: this._id
        };
        const res = await this._request.send(COMMIT, param);
        if (res.code) throw res;
        this.commited = true;
        return res;
    }
    async rollback(customRollbackRes) {
        const param = {
            transactionId: this._id
        };
        const res = await this._request.send(ABORT, param);
        if (res.code) throw res;
        this.aborted = true;
        this.abortReason = customRollbackRes;
        return res;
    }
}
async function startTransaction() {
    const transaction = new Transaction(this);
    await transaction.init();
    return transaction;
}
async function runTransaction(callback, times = 3) {
    let transaction;
    try {
        transaction = new Transaction(this);
        await transaction.init();
        const callbackRes = await callback(transaction);
        if (transaction.aborted === true) {
            throw transaction.abortReason;
        }
        await transaction.commit();
        return callbackRes;
    } catch (error) {
        if (transaction.inited === false) {
            throw error;
        }
        const throwWithRollback = async (error)=>{
            if (!transaction.aborted && !transaction.commited) {
                try {
                    await transaction.rollback();
                } catch (err) {}
                throw error;
            }
            if (transaction.aborted === true) {
                throw transaction.abortReason;
            }
            throw error;
        };
        if (times <= 0) {
            await throwWithRollback(error);
        }
        if (error && error.code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$const$2f$code$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERRORS"].DATABASE_TRANSACTION_CONFLICT.code) {
            return await runTransaction.bind(this)(callback, --times);
        }
        await throwWithRollback(error);
    }
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/ObjectId/index.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ObjectId",
    ()=>ObjectId,
    "ObjectIdConstructor",
    ()=>ObjectIdConstructor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/helper/symbol.js [app-rsc] (ecmascript) <locals>");
;
class ObjectId {
    constructor({ id = '' } = {}){
        this.id = id;
    }
    get _internalType() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$helper$2f$symbol$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SYMBOL_OBJECTID"];
    }
    parse() {
        return {
            $oid: this.id
        };
    }
}
function ObjectIdConstructor(opt) {
    return new ObjectId(opt);
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/index.js [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Db",
    ()=>Db
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/geo/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$collection$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/collection.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$command$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/command.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serverDate$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/serverDate/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$regexp$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/regexp/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$transaction$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/transaction/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$ObjectId$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/ObjectId/index.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
class Db {
    constructor(config){
        this.config = config;
        this.Geo = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$geo$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__;
        this.serverDate = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$serverDate$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ServerDateConstructor"];
        this.command = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$command$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Command"];
        this.RegExp = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$regexp$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RegExpConstructor"];
        this.ObjectId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$ObjectId$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ObjectIdConstructor"];
        this.startTransaction = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$transaction$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["startTransaction"];
        this.runTransaction = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$transaction$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["runTransaction"];
    }
    collection(collName) {
        if (!collName) {
            throw new Error('Collection name is required');
        }
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$collection$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CollectionReference"](this, collName);
    }
    createCollection(collName) {
        let request = new Db.reqClass(this.config);
        const params = {
            collectionName: collName
        };
        return request.send('database.addCollection', params);
    }
}
}),
"[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/index.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CollectionReference",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$collection$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CollectionReference"],
    "Db",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Db"],
    "DocumentReference",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$document$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DocumentReference"],
    "Query",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Query"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/query.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$collection$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/collection.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$cloudbase$2b$database$40$1$2e$4$2e$1$2f$node_modules$2f40$cloudbase$2f$database$2f$dist$2f$esm$2f$document$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@cloudbase+database@1.4.1/node_modules/@cloudbase/database/dist/esm/document.js [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=8804b_%40cloudbase_database_dist_esm_00018d00._.js.map
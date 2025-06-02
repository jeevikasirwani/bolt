"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedHTMLElements = exports.MODIFICATIONS_TAG_NAME = exports.WORK_DIR = exports.WORK_DIR_NAME = void 0;
exports.stripIndents = stripIndents;
exports.WORK_DIR_NAME = 'project';
exports.WORK_DIR = `/home/${exports.WORK_DIR_NAME}`;
exports.MODIFICATIONS_TAG_NAME = 'bolt_file_modifications';
exports.allowedHTMLElements = [
    'a',
    'b',
    'blockquote',
    'br',
    'code',
    'dd',
    'del',
    'details',
    'div',
    'dl',
    'dt',
    'em',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hr',
    'i',
    'ins',
    'kbd',
    'li',
    'ol',
    'p',
    'pre',
    'q',
    'rp',
    'rt',
    'ruby',
    's',
    'samp',
    'source',
    'span',
    'strike',
    'strong',
    'sub',
    'summary',
    'sup',
    'table',
    'tbody',
    'td',
    'tfoot',
    'th',
    'thead',
    'tr',
    'ul',
    'var',
];
function stripIndents(arg0, ...values) {
    if (typeof arg0 !== 'string') {
        const processedString = arg0.reduce((acc, curr, i) => {
            var _a;
            acc += curr + ((_a = values[i]) !== null && _a !== void 0 ? _a : '');
            return acc;
        }, '');
        return _stripIndents(processedString);
    }
    return _stripIndents(arg0);
}
function _stripIndents(value) {
    return value
        .split('\n')
        .map((line) => line.trim())
        .join('\n')
        .trimStart()
        .replace(/[\r\n]$/, '');
}

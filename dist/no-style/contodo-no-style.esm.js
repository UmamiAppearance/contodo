const isPositiveInteger = (input) => {
    input = Number(input);
    if (isNaN(input)) {
        return false;
    }
    return (Number.isInteger(input) && input > 0);
};


/* The original of the followng beast can be admired
 * here: https://stackoverflow.com/a/9337047
 * 
 * For objects it is legal to use "const, if, ..."
 * so this could be removed. A dollar sign though
 * must be inside of a string and was also removed
 * from the original regex. 
 */

/* eslint-disable no-misleading-character-class */
const isIdentifier = (str) => {
    const regex = "^[A-Z_a-z\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc][A-Z_a-z\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc0-9\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u0669\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0711\u0730-\u074a\u07a6-\u07b0\u07c0-\u07c9\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u08e4-\u08fe\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09cb-\u09cd\u09d7\u09e2\u09e3\u09e6-\u09ef\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d3e-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d62\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0e50-\u0e59\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e\u0f3f\u0f71-\u0f84\u0f86\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1040-\u1049\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b4-\u17d3\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u18a9\u1920-\u192b\u1930-\u193b\u1946-\u194f\u19b0-\u19c0\u19c8\u19c9\u19d0-\u19d9\u1a17-\u1a1b\u1a55-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1b00-\u1b04\u1b34-\u1b44\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1b82\u1ba1-\u1bad\u1bb0-\u1bb9\u1be6-\u1bf3\u1c24-\u1c37\u1c40-\u1c49\u1c50-\u1c59\u1cd0-\u1cd2\u1cd4-\u1ce8\u1ced\u1cf2-\u1cf4\u1dc0-\u1de6\u1dfc-\u1dff\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua620-\ua629\ua66f\ua674-\ua67d\ua69f\ua6f0\ua6f1\ua802\ua806\ua80b\ua823-\ua827\ua880\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua8e0-\ua8f1\ua900-\ua909\ua926-\ua92d\ua947-\ua953\ua980-\ua983\ua9b3-\ua9c0\ua9d0-\ua9d9\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\uaa7b\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uaaeb-\uaaef\uaaf5\uaaf6\uabe3-\uabea\uabec\uabed\uabf0-\uabf9\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f]*$";
    const match = str.match(new RegExp(regex));
    return Boolean(match);
};

/**
 * [contodo]{@link https://github.com/UmamiAppearance/contodo}
 *
 * @version 0.4.3
 * @author UmamiAppearance [mail@umamiappearance.eu]
 * @license MIT
 */

// Store Default Console Methods
window._console = {
    assert: console.assert.bind(console),
    count: console.count.bind(console),
    countReset: console.countReset.bind(console),
    clear: console.clear.bind(console),
    debug: console.debug.bind(console),
    error: console.error.bind(console),
    exception: console.exception ? console.exception.bind(console) : null,
    info: console.info.bind(console),
    log: console.log.bind(console),
    table: console.table.bind(console),
    time: console.time.bind(console),
    timeEnd: console.timeEnd.bind(console),
    timeLog: console.timeLog.bind(console),
    trace: console.trace.bind(console),
    warn: console.warn.bind(console)
};


/**
 * Creates a html node which displays browser console
 * entries. It is possible to mirror the console or 
 * to stop the default console from logging.
 * The methods "console.dir/dirxml" and console.group*
 * are not available. Every other method can be rendered
 * into a document node.
 *
 * Inspired by: https://github.com/bahmutov/console-log-div
 */
class ConTodo {

    /**
     * The constructor sets all options, stores the
     * default console and initializes the document
     * node to a provided patent node. If it is not
     * provided contodo is appended to the body.
     *  
     * @param {object} [node=document.body] - Parent document node. 
     * @param {object} [options] - Options object.
     */
    constructor(node, options={}) {
        
        // Parent Node
        this.parentNode = (node) ? node : document.body;

        // Helper function to test, wether an option
        // was set.
        const hasOption = (key) => Object.prototype.hasOwnProperty.call(options, key);

        // (Default) Options
        this.options = {
            autostart: hasOption("autostart") ? Boolean(options.autostart) : true,
            catchErrors: hasOption("catchErrors") ? Boolean(options.catchErrors) : false,
            clearButton: hasOption("clearButton") ? Boolean(options.clearButton) : false,
            height: hasOption("height") ? options.height : "inherit",
            maxEntries: hasOption("maxEntries") ? Math.max(parseInt(Number(options.maxEntries), 10), 0) : 0,
            preventDefault: hasOption("preventDefault") ? Boolean(options.preventDefault) : false,
            reversed: hasOption("reversed") ? Boolean(options.reversed) : false,
            showDebugging: hasOption("showDebugging") ? Boolean(options.showDebugging) : true,
            showTimestamp: hasOption("showTimestamp") ? Boolean(options.showTimestamp) : false,
            width: hasOption("width") ? options.width : "inherit"
        };

        if (typeof defaultCSS === "string") {
            this.options.applyCSS = hasOption("applyCSS") ? Boolean(options.applyCSS) : true;
        } else {
            if (hasOption("applyCSS")) {
                console.warn("Build css is not available. Option 'applyCSS' was ignored.");
            }
            this.options.applyCSS = false;
        }
         
        // Class values
        this.active = false;
        this.counters = {};
        this.mainElem = null;
        this.clearBtn = null;
        this.style = null;
        this.timers = {};

        // Bind Error Function to Class
        this.catchErrorFN = this.catchErrorFN.bind(this);

        // create API
        this.#makeAPI();

        // Auto Init
        if (this.options.autostart) {
            this.createDocumentNode();
            this.initFunctions();
        }
    }


    /**
     * Creates the actual node in the document.
     */
    createDocumentNode() {
        if (!this.mainElem) {
            this.mainElem = document.createElement("code");
            this.mainElem.classList.add("contodo");
            this.mainElem.style.height = this.options.height;
            this.parentNode.append(this.mainElem);

            if (this.options.clearButton) {
                this.mainElem.classList.add("clearBtn");
                this.clearBtn = document.createElement("a");
                this.clearBtn.textContent = "clear";
                this.clearBtn.title = "clear console";
                this.clearBtn.addEventListener("click", () => { this.clear(false); }, false);
                this.clearBtn.classList.add("contodo-clear");
                this.parentNode.append(this.clearBtn);
            }
            
            this.logCount = 0;
        }
        if (this.options.applyCSS) {
            this.applyCSS();
        }
    }


    /**
     * Removes contodo node from document
     */
    destroyDocumentNode() {
        if (this.active) {
            this.restoreDefaultConsole();
        }
        if (!this.mainElem) {
            return;
        }
        this.mainElem.remove();
        if (this.clearBtn) {
            this.clearBtn.remove();
            this.clearBtn = null;
        }
        this.mainElem = null;
    }

    #makeAPI() {
        const naErr = () => {
            throw new ReferenceError("contodo does not have this method available");
        };

        this.api = {
            assert: (bool, ...args) => this.assert(bool, args),
            count: (label) => this.count(label),
            countReset: (label) => this.countReset(label),
            counters: () => this.countersShow(),
            clear: () => this.clear(),
            debug: (...args) => this.debug(args),
            dir: naErr,
            dirxml: naErr,
            error: (...args) => this.makeLog("error", args),
            group: naErr,
            info: (...args) => this.makeLog("info", args),
            log: (...args) => this.makeLog("log", args),
            table: (...args) => this.makeTableLog(args),
            time: (label) => this.time(label),
            timeEnd: (label) => this.timeEnd(label),
            timeLog: (label) => this.timeLog(label),
            timers: () => this.timersShow(),
            trace: (...args) => this.trace(args),
            warn: (...args) => this.makeLog("warn", args),
        };
        this.api.exception = this.api.error;
    }


    /**
     * Replaces default console methods with
     * contodo methods.
     */
    initFunctions() {
        if (this.active) {
            return;
        }
        console.assert = this.api.assert;
        console.count = this.api.count;
        console.countReset = this.api.countReset;
        console.counters = this.api.counters;
        console.clear = this.api.clear;
        console.debug = this.api.debug;
        console.error = this.api.error;
        console.exception = this.api.exception;
        console.info = this.api.info;
        console.log = this.api.log;
        console.table = this.api.table;
        console.time = this.api.time;
        console.timeEnd = this.api.timeEnd;
        console.timeLog = this.api.timeLog;
        console.timers = this.api.timers;
        console.trace = this.api.trace;
        console.warn = this.api.warn;
        if (this.options.catchErrors) window.addEventListener("error", this.catchErrorFN, false);
        this.active = true;
    }


    /**
     * Restores the console methods.
     */
    restoreDefaultConsole() {
        if (!this.active) {
            return;
        }
        console.assert = window._console.assert;
        console.count = window._console.count;
        console.countReset = window._console.countReset;
        delete console.counters;
        console.clear = window._console.clear;
        console.debug = window._console.debug;
        console.error = window._console.error;
        console.exception = window._console.exception;
        console.info = window._console.info;
        console.log = window._console.log;
        console.table = window._console.table;
        console.time = window._console.time;
        console.timeEnd = window._console.timeEnd;
        console.timeLog = window._console.timeLog;
        delete console.timers;
        console.trace = window._console.trace;
        console.warn = window._console.warn;
        if (this.options.catchErrors) window.removeEventListener("error", this.catchErrorFN, false);
        this.active = false;
    }


    /**
     * Allows the displaying of errors inside of contodo.
     * @param {*} err 
     */
    catchErrorFN(err) {
        this.makeLog(
            "error", 
            [
                "Uncaught",
                err.message,
                "\n",
                `  > ${err.filename}`,
                "\n",
                `  > line ${err.lineno}, colum ${err.colno}`
            ],
            true
        );
    }


    /**
     * Applies CSS to document.
     */
    applyCSS() {
        if (this.style) {
            return;
        }
        this.style = document.createElement("style"); 
        this.style.append(document.createTextNode(defaultCSS));
        document.head.append(this.style);
    }


    /**
     * Removes CSS from document.
     */
    removeCSS() {
        if (!this.style) {
            return;
        }
        this.style.remove();
        this.style = null;
    }


    /**
     * Console[error|info|log|warn] to node. It adds a 
     * symbol at the start of the log for any other than 
     * log and calls if not prevented.
     * It is called by many other methods to generate
     * output. 
     * @param {string} type - error|info|log|warn
     * @param {Array} args - Message arguments.
     * @param {boolean} [preventDefaultLog=this.options.preventDefault] - If true it does not log to the default console.
     */
    makeLog(type, args, preventDefaultLog=this.options.preventDefault) {
        const infoAdder = {
            error: "⛔",
            info: "ⓘ",
            warn: "⚠️"
        };

        if (!preventDefaultLog) {
            window._console[type](...args);
        }

        const newLog = this.#makeDivLogEntry(type);
        const lastIndex = args.length-1;

        // An empty log call only logs an empty space.
        // (It has to log something, otherwise the node 
        // would collapse.)
        if (type === "log" && lastIndex < 0) {
            this.#makeSpaceSpan(newLog);
        }
        
        // Every other type than a log gets its leading symbol
        else if (type !== "log") {
            newLog.append(this.#makeEntrySpan("info", infoAdder[type]));
            this.#makeSpaceSpan(newLog);
        }

        // The input is getting analyzed by "#analyzeInputMakeSpan"
        // which also appends the content to the new log. Every node
        // is followed by a space node (except the very last).
        args.forEach((arg, i) => {
            this.#analyzeInputMakeSpan(arg, newLog);

            if (i !== lastIndex) {
                this.#makeSpaceSpan(newLog);
            }
        });

        // Finally scroll to the current log
        this.#scroll();
    }


    /**
     * Prepares the data for a HTML table. The actual
     * node generation is handled by "genHTMLTable",
     * which is called at the end by this prep function.
     * 
     * @param {*} args - Shall be an iterable (otherwise it is a generic log). 
     * @param {*} preventDefaultLog - If true it does not log to the default console.
     */
    makeTableLog(args, preventDefaultLog=this.options.preventDefault) {
        if (!preventDefaultLog) {
            window._console.table(...args);
        }

        // Helper function. Test wether the data
        // can be visualized as a table.
        const isIterable = (val) => (typeof val === "object" || (Symbol.iterator in Object(val) && typeof val !== "string"));
        
        let data, cols;
        [data, cols] = args;

        // If it is not possible to create a table from the data,
        // create an ordinary log. (As the default console does)
        if (!isIterable(data)) {
            const msg = (typeof data === "undefined") ? [] : [data];
            this.makeLog("log", msg, true);
        } 
        
        // Deconstruct and prepare the data
        else {
            // Array are converted into objects first
            if (typeof data !== "object") {
                data = Object.assign({}, data);
            }

            // Prepare the columns if not provided
            if (!cols) {
                const colSet = new Set();
                for (let rowKey in data) {
                    let row = data[rowKey];
                    if (!isIterable(row)) {
                        row = [row];
                    }
                    const rowObj = (typeof row !== "object") ? Object.assign({}, row) : row;

                    for (const key in rowObj) {
                        colSet.add(key);
                    } 
                }
                cols = [...colSet];
            }

            // Prepare the header
            let header;
            if (cols.length === 1 && cols[0] == 0) {
                header = ["(Index)", "Value"];
            } else {
                header = ["(Index)", ...cols];
            }

            // Prepare the data
            const tData = [];
            for (const index in data) {
                let row = data[index];
                if (!isIterable(row)) {
                    row = [row];
                }
                const rowObj = (typeof row !== "object") ? Object.assign({}, row) : row;
                const rowArray = [index];

                for (const col of cols) {
                    const colVal = rowObj[col];
                    rowArray.push((colVal === undefined) ? "" : colVal);
                }
                
                tData.push(rowArray);
            }
            
            // Call the html table generation
            this.#genHTMLTable(tData, header);
        }
    }

    /**
     * Creates a new log node and appends it to the
     * contodo main element. 
     * @param {string} [className="log"] - Class name of the log (determines the styling) 
     * @returns {object} - Log Node.
     */
    #makeDivLogEntry(className="log") {        
        let log = document.createElement("div");
        log.classList.add("log", className);

        const dateStr = new Date().toISOString();
        if (this.options.showTimestamp) {
            log.append(this.#makeEntrySpan("time", dateStr));
            log.append("\n");
        }
        log.dataset.date = dateStr;

        this.logCount++;
        let delNode = false;
        if (this.options.maxEntries && this.logCount > this.options.maxEntries) {
            delNode = true;
        }

        if (this.options.reversed) {
            if (delNode) {
                this.mainElem.childNodes[this.options.maxEntries-1].remove();
            }
            this.mainElem.prepend(log);
        } else {
            if (delNode) {
                this.mainElem.childNodes[0].remove();
            }
            this.mainElem.append(log); 
        }

        return log;
    }

    /**
     * Helps to create a classed span inside of the
     * current log (css styled).
     * @param {string} CSSClass - CSS Class of the span elem. 
     * @param {object} content - Span DOM Node.
     * @returns {object} - HTML span node
     */
    #makeEntrySpan(CSSClass, content) {
        const span = document.createElement("span");
        span.classList.add(CSSClass);
        span.textContent = content;
        return span;
    }

    /**
     * Shortcut. Creates a span with the class "space",
     * which contains one space by default.
     * @param {object} log - log node
     * @param {number} [spaces=1] - The amount of spaces.
     */
    #makeSpaceSpan(log, spaces=1) {
        log.append(this.#makeEntrySpan("space", " ".repeat(spaces)));
    }

    /**
     * This error is logged, if the type can't be
     * analyzed. Because of a case, which is not 
     * thought of...
     * @param {*} input - Input Arguments. 
     */
    #foundEdgeCaseError(input) {
        console.error("You found an edge case, which is not covered yet.\nPlease create an issue mentioning your input at:\nhttps://github.com/UmamiAppearance/contodo/issues");
        window._console.warn(input);
        
    }

    /**
     * Analyzes the type of a given parameter handed to 
     * the console. It creates a span element with the 
     * required properties. (Can be called recursively)
     * 
     * @param {*} arg - Any input.
     * @param {object} newLog - The current log document node.
     */
    #analyzeInputMakeSpan(arg, newLog) {
        let argType = typeof arg;

        if (argType === "object") {

            // Array and Typed Array
            if (Array.isArray(arg) || (ArrayBuffer.isView(arg) && (arg.constructor.name.match("Array")))) {
                const lastIndex = arg.length - 1;
                newLog.append(this.#makeEntrySpan("object", `${arg.constructor.name} [ `));
                
                arg.forEach((subArg, i) => {
                    let subType = typeof subArg;
                    if (subType === "string") {
                        subArg = `"${subArg}"`;
                        subType = "array-string";
                        newLog.append(this.#makeEntrySpan(subType, subArg));
                    }

                    else {
                        this.#analyzeInputMakeSpan(subArg, newLog);
                    }
                    
                    if (i < lastIndex) {
                        newLog.append(this.#makeEntrySpan("object", ", "));
                    }
                });

                newLog.append(this.#makeEntrySpan("object", " ]"));
            }

            // DataView
            else if (ArrayBuffer.isView(arg)) {
                newLog.append(this.#makeEntrySpan("object", "DataView { buffer: ArrayBuffer, byteLength: "));
                newLog.append(this.#makeEntrySpan("number", arg.byteLength));
                newLog.append(this.#makeEntrySpan("object", ", byteOffset: "));
                newLog.append(this.#makeEntrySpan("number", arg.byteOffset));
                newLog.append(this.#makeEntrySpan("object", " }"));
            }

            // null
            else if (arg === null) {
                newLog.append(this.#makeEntrySpan("null", "null"));
            }
            
            // ArrayBuffer
            else if (arg.constructor.name === "ArrayBuffer") {
                newLog.append(this.#makeEntrySpan("object", "ArrayBuffer { byteLength: "));
                newLog.append(this.#makeEntrySpan("number", arg.byteLength));
                newLog.append(this.#makeEntrySpan("object", " }"));
            }

            // Ordinary Object with key, value pairs
            else if (arg === Object(arg)) {
                newLog.append(this.#makeEntrySpan("object", "Object { "));
                
                const objEntries = Object.entries(arg);
                const lastIndex = objEntries.length - 1;

                // Walk through all entries and call 
                // #analyzeInputMakeSpan recursively
                // for the values
                objEntries.forEach((entry, i) => {
                    entry.forEach((subArg, j) => {
                        let subType = typeof subArg;
                        const isKey = !j;

                        if (subType === "string") {
                            
                            // key
                            if (isKey) {
                                subType = "object";
                                if (isPositiveInteger(subArg)) {
                                    subArg = Number(subArg);
                                } else if (!isIdentifier(subArg)) {
                                    subArg = `"${subArg}"`;
                                }
                            }
                            
                            // value
                            else {
                                subArg = `"${subArg}"`;
                                subType = "array-string";
                            }
                            newLog.append(this.#makeEntrySpan(subType, subArg));
                        }

                        // keys must be strings, this case only applies to values
                        else {
                            this.#analyzeInputMakeSpan(subArg, newLog);
                        }

                        // append a colon after each key
                        if (isKey) {
                            newLog.append(this.#makeEntrySpan("object", ":"));
                            this.#makeSpaceSpan(newLog);
                        }
                    });
                    
                    // add a comma and a space after each key/value pair
                    if (i < lastIndex) {
                        newLog.append(this.#makeEntrySpan("object", ","));
                        this.#makeSpaceSpan(newLog);
                    }
                });

                // close the object with space and curly brace
                newLog.append(this.#makeEntrySpan("object", " }"));
            }
            

            // Unexpected Object Type
            else {
                this.#foundEdgeCaseError(arg);
            }
        }

        // Function
        else if (argType === "function") {
            // cf. https://stackoverflow.com/a/31194949
            let fnStr = Function.toString.call(arg);
            const isClass = Boolean(fnStr.match(/^class/));
            let hasConstructor = true;
            let paramArray;
            
            // Arrow Function
            if (fnStr.match("=>")) {
                paramArray = fnStr
                    .replace(/\s+/g, "")                        // remove all whitespace
                    .replace(/=>.*/, "")                        // remove everything after the arrow
                    .replace(/(\(|\))/g, "")                    // remove brackets
                    .split(",")                                 // split parameters
                    .filter(Boolean);                           // filter [""]
            }
            
            // Class without constructor
            else if (isClass && !fnStr.match("constructor")) {
                hasConstructor = false;
                paramArray = [];
            }
            
            // Class and regular Functions
            else {
                paramArray = fnStr
                    .replace(/\/\/.*$/mg,"")                    // strip single-line comments
                    .replace(/\s+/g, "")                        // strip white space
                    .replace(/\/\*[^/*]*\*\//g, "")             // strip multi-line comments  
                    .split("){", 1)[0].replace(/^[^(]*\(/, "")  // extract the parameters
                    .replace(/=[^,]+/g, "")                     // strip any ES6 defaults 
                    .split(",")                                 // split parameters
                    .filter(Boolean);                           // filter [""]
            }
 
            // Join function arguments
            const params = paramArray.join(", ");
            
            if (isClass) {
                if (hasConstructor) {
                    newLog.append(this.#makeEntrySpan("function", `class ${arg.name} { constructor(`));
                    newLog.append(this.#makeEntrySpan("fn-args", params));
                    newLog.append(this.#makeEntrySpan("function", ") }"));
                } else {
                    newLog.append(this.#makeEntrySpan("function", `class ${arg.name} {}`));
                }
            } else {
                newLog.append(this.#makeEntrySpan("function", `function ${arg.name}(`));
                newLog.append(this.#makeEntrySpan("fn-args", params));
                newLog.append(this.#makeEntrySpan("function", ")"));
            }
        }

        // "undefined"
        else if (argType === "undefined") {
            newLog.append(this.#makeEntrySpan("null", "undefined"));
        }

        else {
            
            // String
            if (argType === "string") {
                // Empty String
                if (arg === "") {
                    arg = "<empty string>";
                }
                // All other strings just pass
            }
            
            // BigInt
            else if (argType === "bigint") {
                arg += "n";
            }
            
            // Symbol
            else if (argType === "symbol") {
                arg = arg.toString().replace("(", "(\"").replace(")", "\")");
            }
            
            // NaN
            else if (isNaN(arg)) {
                argType = "null";
            }

            // type "number" and "boolean" are walking untouched
            // until this point and need no special treatment

            newLog.append(this.#makeEntrySpan(argType, arg));
        }
    }


    /**
     * Creates a HTML table from the given input.
     * (Which must be an array of object to make
     * it work).
     * @param {string[]} data - Table body data.
     * @param {array} header - Table head data.
     */
    #genHTMLTable(data, header) {
        const table = document.createElement("table");
        
        const tHead = document.createElement("thead");
        const trHead = document.createElement("tr");

        for (const head of header) {
            const th = document.createElement("th");
            th.append(document.createTextNode(head));
            trHead.append(th);
        }
        
        tHead.append(trHead);
        table.append(tHead);


        const tBody = document.createElement("tbody");

        for (const row of data) {
            const tr = document.createElement("tr");

            for (const col of row) {
                const td = document.createElement("td");
                td.append(document.createTextNode(col));
                tr.append(td);
            }

            tBody.append(tr);
        }

        table.append(tBody);


        let divLog = this.#makeDivLogEntry();
        divLog.append(table);

        this.#scroll();
    }

    /**
     * Converts the input to a label string.
     * If the input is undefined output will
     * be "default";
     * @param {*} [label] 
     * @returns {string} - label
     */
    #makeLabelStr(label) {
        if (typeof label === "undefined") {
            label = "default";
        } else {
            label = String(label);
        }
        return label;
    }


    /**
     * Scroll a new log into view. 
     */
    #scroll() {
        if (this.options.reversed) {
            this.mainElem.scrollTop = 0;
        } else {
            this.mainElem.scrollTop = this.mainElem.scrollHeight;
        }
    }

    /**
     * console.assert
     * @param {boolean} bool - Result of a comparison 
     * @param {*} [args] - Parameter are appended to the assertion call.
     */
    assert(bool, args) {
        if (!this.options.preventDefault) {
            window._console.assert(bool, ...args);
        }
        if (!bool) {
            this.makeLog("error", ["Assertion failed:", ...args], true);
        }
    }

    /**
     * console.count
     * @param {*} [label] - Input gets converted to string. Label is "default" if nothing is passed. 
     */
    count(label) {
        label = this.#makeLabelStr(label);

        if (!this.counters[label]) {
            this.counters[label] = 1;
        } else {
            this.counters[label] ++;
        }
        this.makeLog("log", [`${label}: ${this.counters[label]}`]);
    }

    /**
     * console.countReset
     * @param {*} [label] - Corresponding label.
     */
    countReset(label) {
        label = this.#makeLabelStr(label);
        
        if (Object.prototype.hasOwnProperty.call(this.counters, label)) {
            this.counters[label] = 0;
            this.makeLog("log", [`${label}: ${this.counters[label]}`]);
        } else {
            const msg = `Count for '${label}' does not exist`;
            this.makeLog("warn", [msg]);
        }
        
    }

    /**
     * Bonus feature. Shows all current counters via
     * console.table.
     */
    countersShow() {
        if (Object.keys(this.counters).length) {
            this.makeTableLog([this.counters]);
        }
    }

    /**
     * console.clear
     */
    clear(info=true) {
        if (!this.options.preventDefault && info) {
            window._console.clear();
        }
        this.mainElem.innerHTML = "";
        this.logCount = 0;
        if (info) {
            this.makeLog("log", ["Console was cleared"], true);
        }
    }

    /**
     * console.debug
     * Nowadays console.debug and console.log are identical
     * in browsers. With contodo it is possible to only show
     * debug logs if debugging is globally enabled. (Which
     * is the case by default)
     * @param {} args 
     */
    debug(args) {
        if (!this.options.preventDefault) {
            window._console.debug(...args);
        }
        if (this.options.showDebugging) {
            this.makeLog("log", args, true);
        }
    }

    /**
     * console.time
     * @param {*} [label] - Input gets converted to string. Label is "default" if nothing is passed. 
     */
    time(label) {
        const now = window.performance.now();
        label = this.#makeLabelStr(label);

        if (!this.timers[label]) {
            this.timers[label] = now;
        } else {
            const msg = `Timer '${label}' already exists`;
            this.makeLog("warn", [msg], true);

            if (!this.options.preventDefault) {
                window._console.warn(msg);
            }
        }
    }

    /**
     * console.timeLog and console.timeEnd are 
     * basically the same function. The latter
     * only differs in terms of deleting the 
     * timer. Therefore this helper function 
     * was created. 
     * @param {*} [label] - Corresponding label. 
     * @returns {string} - label
     */
    #timeLogEnd(label) {
        const now = window.performance.now();
        label = this.#makeLabelStr(label);
        const elapsed = now - this.timers[label];

        let msg;
        let type;

        if (this.timers[label]) {
            msg = `${label}: ${elapsed} ms`;
            type = "log";
        } else {
            msg = `Timer '${label}' does not exist`;
            type = "warn";
        }

        this.makeLog(type, [msg], true);
        if (!this.options.preventDefault) {
            window._console[type](msg);
        }
        
        return label;
    }

    /**
     * console.timeEnd
     * @param {*} [label] - Corresponding label. 
     */
    timeEnd(label) {
        label = this.#timeLogEnd(label);
        delete this.timers[label];
    }

    /**
     * console.timeEnd
     * @param {*} [label] - Corresponding label. 
     */
    timeLog(label) {
        this.#timeLogEnd(label);
    }

    /**
     * Bonus feature. Shows all current timers via
     * console.table.
     */
    timersShow() {
        const now = window.performance.now();
        const timers = {};
        for (const timer in this.timers) {
            timers[timer] = `${now - this.timers[timer]} ms`;
        }
        if (Object.keys(timers).length) {
            this.makeTableLog([timers]);
        }
    }

    /**
     * console.trace
     * This one is a little hacky. It is not
     * possible to call trace directly, as this
     * file and the caller are part of the stack.
     * To reach the aimed goal, a generic Error
     * is thrown and catched to get a stack, which
     * then cleaned up.
     *  
     * @param {*} args 
     */
    trace(args) {
        let stack;
        try {
            throw new Error();
        } catch (err) {
            stack = err.stack;
        }

        const stackArr = [];
        let addLine = false;
        let lenLeft = 0;
        
        stack.split("\n").slice(0, -1).forEach(line => {

            if (!addLine && line.match("console.trace")) {
                addLine = true;
            }
            
            else if (addLine) {
                let name, file;
                [name, file] = line.split("@");
                if (!name) {
                    name = "(anonymous)";
                }
                const len = name.length;
                lenLeft = Math.max(lenLeft, len);
                stackArr.push({name, file, len});
            }
        });

        lenLeft++;

        // html trace
        const newLog = this.#makeDivLogEntry();
        newLog.append(this.#makeEntrySpan("trace-head", "console.trace()"));

        for (const arg of args) {
            this.#makeSpaceSpan(newLog);
            this.#analyzeInputMakeSpan(arg, newLog);
        }

        newLog.append("\n");

        for (const line of stackArr) {
            this.#makeSpaceSpan(newLog);
            newLog.append(this.#makeEntrySpan("trace-name", line.name));
            this.#makeSpaceSpan(newLog, lenLeft-line.len);
            newLog.append(this.#makeEntrySpan("trace-file", line.file));
            newLog.append("\n");
        }

        this.#scroll();
        
        // default console trace
        if (!this.options.preventDefault) {
            const msg = ["%cconsole.trace()", "color:magenta;", ...args, "\n"];
            
            for (const line of stackArr) {
                msg.push(`  ${line.name}${" ".repeat(lenLeft-line.len)}${line.file}\n`);
            }

            window._console.log(...msg);
        }
    }
}

export { ConTodo as default };

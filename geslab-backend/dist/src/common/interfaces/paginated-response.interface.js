"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaginatedResponse = buildPaginatedResponse;
function buildPaginatedResponse(data, total, page, limit) {
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}
//# sourceMappingURL=paginated-response.interface.js.map
"use strict";
const advancedResults = (model, populate) => async (req, res, next) => {
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach((field) => delete reqQuery[field]);
    // Filtering
    let query = JSON.stringify(reqQuery);
    query = query.replace(/\b(lt|lte|gt|gte)\b/g, (match) => `$${match}`);
    let resultsQuery = model.find(JSON.parse(query));
    // Selecting
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        resultsQuery = resultsQuery.select(fields);
    }
    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        resultsQuery = resultsQuery.sort(sortBy);
    }
    else {
        resultsQuery = resultsQuery.sort('-createdAt');
    }
    // Paginating
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();
    if (populate) {
        resultsQuery = resultsQuery.populate(populate);
    }
    const results = await resultsQuery.skip(startIndex).limit(limit);
    // Pagination results
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }
    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results,
    };
    next();
};
module.exports = advancedResults;
//# sourceMappingURL=advancedResults.js.map
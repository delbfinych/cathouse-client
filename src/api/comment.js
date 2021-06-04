"use strict";
exports.__esModule = true;
exports.commentApi = void 0;
// import useAxios from 'axios-hooks';
var http_client_1 = require("./http-client");
var getById = function (id) { return http_client_1.http.get("/comment/" + id); };
var like = function (id) { return http_client_1.http.post("/comment/" + id + "/like"); };
var dislike = function (id) { return http_client_1.http.post("/comment/" + id + "/dislike"); };
var deleteById = function (id) { return http_client_1.http["delete"]("/comment" + id); };
var update = function (id, data) {
    return http_client_1.http.post("/comment/" + id, data);
};
exports.commentApi = { getById: getById, like: like, dislike: dislike, deleteById: deleteById, update: update };

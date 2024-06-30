/*
 * File         : routes.js
 * Project      : bookshelf-api-fwaskito
 * Author       : F. Waskito
 * ----------------------------------------------
 * Created Date : 'Tue, Jun 25th 2024' 9:30:36 AM
 * Last Modified: 'Tue, Jun 25th 2024' 8:34:42 PM
 */


const {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
} = require('./handler');

const routes = [
    { // KRITERIA 3 [ROUTE]: API data menyimpan buku
      method: 'POST',
      path: '/books',
      handler: addBookHandler,
    },
    { // KRITERIA 4 [ROUTE]: API dapat menampilkan seluruh buku (termasuk fitur opsional)
      method: 'GET',
      path: '/books',
      handler: getAllBooksHandler,
    },
    { // KRITERIA 5 [ROUTE]: API dapat menampilkan detail buku
      method: 'GET',
      path: '/books/{bookId}',
      handler: getBookByIdHandler,
    },
    { // KRITERIA 6 [ROUTE]: API dapat mengubah data buku
      method: 'PUT',
      path: '/books/{bookId}',
      handler: editBookByIdHandler,
    },
    { // KRITERIA 7 [ROUTE]: API dapat menghapus buku
      method: 'DELETE',
      path: '/books/{bookId}',
      handler: deleteBookByIdHandler,
    },
];

module.exports = routes;
